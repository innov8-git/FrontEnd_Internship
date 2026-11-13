import { ASSESSMENT_OPTION_COUNT, PUBLISH_STATUS, ROLES } from '@/shared/constants';
import { db } from '../db';
import { attemptDto, createAttempt, getPublishedAssessmentConfig } from '../services';
import { discountForScore } from '../seed/helpers';
import {
  conflict,
  created,
  json,
  mock,
  notFound,
  paginate,
  readJson,
  requireAuth,
  validationError,
} from '../utils';

/**
 * Student assessment (MM7). Questions never include `correctIndex` or marks; the score is
 * computed on the server (services.createAttempt) and every score can continue to enrollment.
 * '/assessments/attempts/mine' is registered before the ':designationId' routes.
 */

const STUDENT_ONLY = [ROLES.STUDENT];
const ALREADY_ATTEMPTED_MESSAGE =
  'You have already taken this assessment. Each assessment can be taken once.';

const studentDomainSessions = new Map();

function sampleQuestions(pool, count = 15) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function findDesignation(idOrSlug) {
  const key = String(idOrSlug ?? '');
  return db.designations.find((entry) => entry._id === key || entry.slug === key);
}

function designationRef(designation) {
  return designation ? { _id: designation._id, name: designation.name, slug: designation.slug } : null;
}

function findUserAttempt(userId, designationId) {
  return db.assessmentAttempts.find(
    (attempt) => attempt.userId === userId && attempt.designationId === designationId,
  );
}

/** Published designation + its published config, or null (both missing -> 404 for students). */
function resolveAssessment(idOrSlug) {
  const designation = findDesignation(idOrSlug);
  if (!designation || designation.status !== PUBLISH_STATUS.PUBLISHED) return null;
  const config = getPublishedAssessmentConfig(designation._id);
  if (!config || !Array.isArray(config.questions) || config.questions.length === 0) return null;
  return { designation, config };
}

/** Validates `answers: [{ questionId, selectedIndex }]`; null/undefined selectedIndex = unanswered. */
function validateAnswers(rawAnswers, config) {
  if (!Array.isArray(rawAnswers)) {
    return { answers: [], details: [{ field: 'answers', message: 'Answers must be a list.' }] };
  }

  const optionCounts = new Map(
    config.questions.map((question) => [
      question._id,
      Array.isArray(question.options) ? question.options.length : ASSESSMENT_OPTION_COUNT,
    ]),
  );

  if (rawAnswers.length > optionCounts.size) {
    return {
      answers: [],
      details: [{ field: 'answers', message: 'There are more answers than questions.' }],
    };
  }

  const details = [];
  const answers = [];
  const seen = new Set();

  rawAnswers.forEach((entry, index) => {
    const field = `answers.${index}`;
    if (!entry || typeof entry !== 'object') {
      details.push({ field, message: 'Each answer needs a questionId and a selectedIndex.' });
      return;
    }
    const { questionId, selectedIndex } = entry;
    if (typeof questionId !== 'string' || !optionCounts.has(questionId)) {
      details.push({ field: `${field}.questionId`, message: 'This question is not part of the assessment.' });
      return;
    }
    if (seen.has(questionId)) {
      details.push({ field: `${field}.questionId`, message: 'Each question can be answered once.' });
      return;
    }
    seen.add(questionId);
    if (selectedIndex === null || selectedIndex === undefined) return; // unanswered counts as wrong
    if (
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= optionCounts.get(questionId)
    ) {
      details.push({ field: `${field}.selectedIndex`, message: 'Choose one of the options.' });
      return;
    }
    answers.push({ questionId, selectedIndex });
  });

  return { answers, details };
}

export const assessmentHandlers = [
  mock.get('/assessments/attempts/mine', ({ request }) => {
    const auth = requireAuth(request, STUDENT_ONLY);
    if (auth.error) return auth.error;

    const items = db.assessmentAttempts
      .filter((attempt) => attempt.userId === auth.user._id)
      .sort((a, b) => String(b.submittedAt ?? '').localeCompare(String(a.submittedAt ?? '')))
      .map((attempt) => {
        const dto = attemptDto(attempt);
        return {
          ...dto,
          designation: dto?.designation ?? designationRef(findDesignation(attempt.designationId)),
        };
      });

    return json(paginate(items, request, 50));
  }),

  mock.get('/assessments/:designationId/attempt', ({ request, params }) => {
    const auth = requireAuth(request, STUDENT_ONLY);
    if (auth.error) return auth.error;

    const designation = findDesignation(params.designationId);
    const attempt = findUserAttempt(auth.user._id, designation?._id ?? params.designationId);
    if (!attempt) return notFound('Attempt');
    return json(attemptDto(attempt));
  }),

  mock.get('/assessments/:designationId', ({ request, params }) => {
    const auth = requireAuth(request, STUDENT_ONLY);
    if (auth.error) return auth.error;

    const resolved = resolveAssessment(params.designationId);
    if (!resolved) return notFound('Assessment');
    const { designation, config } = resolved;

    if (findUserAttempt(auth.user._id, designation._id)) {
      return conflict('ALREADY_ATTEMPTED', ALREADY_ATTEMPTED_MESSAGE);
    }

    const url = new URL(request.url);
    const domainId = url.searchParams.get('domainId');
    if (domainId) {
      const domain = db.domains.find((d) => d._id === domainId || d.slug === domainId);
      const pool = (db.domainQuestions ?? []).filter((q) => q.domainId === domain?._id);
      if (domain && pool.length >= 15) {
        const sampled = sampleQuestions(pool, 15);
        studentDomainSessions.set(`${auth.user._id}:${designation._id}`, {
          domain,
          sampled,
        });

        return json({
          designation: designationRef(designation),
          domain: { _id: domain._id, name: domain.name, slug: domain.slug },
          configVersion: config.version,
          totalQuestions: sampled.length,
          questions: sampled.map((question) => ({
            _id: question._id,
            text: question.text,
            options: Array.isArray(question.options) ? [...question.options] : [],
          })),
        });
      }
    }

    return json({
      designation: designationRef(designation),
      configVersion: config.version,
      totalQuestions: config.questions.length,
      // Strip correctIndex and marks: students only ever receive the text and the options.
      questions: config.questions.map((question) => ({
        _id: question._id,
        text: question.text,
        options: Array.isArray(question.options) ? [...question.options] : [],
      })),
    });
  }),

  mock.post('/assessments/:designationId/submit', async ({ request, params }) => {
    const auth = requireAuth(request, STUDENT_ONLY);
    if (auth.error) return auth.error;

    const resolved = resolveAssessment(params.designationId);
    if (!resolved) return notFound('Assessment');
    const { designation, config } = resolved;

    if (findUserAttempt(auth.user._id, designation._id)) {
      return conflict('ALREADY_ATTEMPTED', ALREADY_ATTEMPTED_MESSAGE);
    }

    const body = await readJson(request);
    const sessionKey = `${auth.user._id}:${designation._id}`;
    const session = studentDomainSessions.get(sessionKey);

    if (session) {
      const { domain, sampled } = session;
      const questionMap = new Map(sampled.map((q) => [q._id, q]));
      const rawAnswers = Array.isArray(body?.answers) ? body.answers : [];

      let score = 0;
      const normalizedAnswers = [];
      rawAnswers.forEach((entry) => {
        if (!entry || !entry.questionId) return;
        const q = questionMap.get(entry.questionId);
        if (!q) return;
        if (q.correctIndex === entry.selectedIndex) {
          score += 1;
        }
        normalizedAnswers.push({ questionId: q._id, selectedIndex: entry.selectedIndex });
      });

      const attempt = {
        _id: `att_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        userId: auth.user._id,
        designationId: designation._id,
        domainId: domain._id,
        domain: { _id: domain._id, name: domain.name, slug: domain.slug },
        configVersion: config.version,
        score,
        totalQuestions: 15,
        discountPercent: discountForScore(config.discountSlabs || [], score),
        submittedAt: new Date().toISOString(),
      };
      db.assessmentAttempts.push(attempt);
      studentDomainSessions.delete(sessionKey);
      return created(attemptDto(attempt));
    }

    const { answers, details } = validateAnswers(body?.answers, config);
    if (details.length > 0) return validationError(details);

    const attempt = createAttempt({ user: auth.user, designationId: designation._id, answers });
    return created(attemptDto(attempt));
  }),
];

export default assessmentHandlers;
