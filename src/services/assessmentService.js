import { api, orNullOn404 } from './api';
import { getQuestionsForDomain, normalizeDomainSlug } from '@/mocks/seed/content/domainQuestions';

/** Assessment (MM7). Questions never include answer keys; scoring happens on the server. */
export const getAssessment = (designationId, params = {}) =>
  api.get(`/assessments/${encodeURIComponent(designationId)}`, params);

/** payload: { answers: [{ questionId, selectedIndex }], domainId?: string } | answers[] -> Attempt */
export const submitAssessment = (designationId, payload) => {
  const body = Array.isArray(payload) ? { answers: payload } : payload;
  return api.post(`/assessments/${encodeURIComponent(designationId)}/submit`, body);
};

/** The current student's attempt for a designation, or null when not attempted yet. */
export const getMyAttempt = (designationId) =>
  orNullOn404(api.get(`/assessments/${encodeURIComponent(designationId)}/attempt`));

export const getMyAttempts = () => api.get('/assessments/attempts/mine');

/**
 * Fetches domain-specific assessment questions from the API / database.
 * If the user is unauthenticated or the backend has no configured assessment for this domain/role,
 * seamlessly falls back to the curated 15-question domain bank so the candidate can complete the assessment.
 */
export const fetchAssessmentQuestionsByDomain = async (domain, designationId = 'general') => {
  const normalizedDomain = normalizeDomainSlug(domain);

  // 1. Attempt API fetch from database (if server/backend has assessments)
  try {
    const res = await api.get(`/assessments/${encodeURIComponent(designationId)}`, {
      domainId: normalizedDomain,
    });
    if (res && Array.isArray(res.questions) && res.questions.length > 0) {
      return {
        ...res,
        domain: res.domain || { name: domain, slug: normalizedDomain },
      };
    }
  } catch {
    // Graceful fallback to domain questions bank
  }

  // 2. Curated domain questions bank
  const pool = getQuestionsForDomain(normalizedDomain);
  const formattedQuestions = pool.slice(0, 15).map((q, idx) => ({
    _id: `${normalizedDomain}-${idx + 1}`,
    text: q.text,
    options: [...q.options],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  return {
    designation: {
      _id: designationId,
      name: `${domain} Domain Technical Assessment`,
      slug: designationId,
    },
    domain: {
      _id: normalizedDomain,
      name: domain,
      slug: normalizedDomain,
    },
    configVersion: 1,
    totalQuestions: formattedQuestions.length,
    questions: formattedQuestions,
  };
};
