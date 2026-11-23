import { api, orNullOn404 } from './api';
import { USE_MOCKS } from '@/shared/constants';

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
 * Fetches domain-specific assessment questions from the backend API.
 * In mock mode (VITE_USE_MOCKS=true) only, lazily falls back to the mock seed bank.
 */
export const fetchAssessmentQuestionsByDomain = async (domain, designationId = 'general') => {
  const normalizedDomain = String(domain || 'general').trim().toLowerCase().replace(/\s+/g, '-');

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
    if (!USE_MOCKS) return res;
  } catch (err) {
    if (!USE_MOCKS) throw err;
  }

  // Mock-mode-only lazy fallback so seed data never runs in live backend mode
  const { getQuestionsForDomain, normalizeDomainSlug } = await import(
    '@/mocks/seed/content/domainQuestions'
  );
  const slug = normalizeDomainSlug(domain);
  const pool = getQuestionsForDomain(slug);
  const formattedQuestions = pool.slice(0, 15).map((q, idx) => ({
    _id: `${slug}-${idx + 1}`,
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
      _id: slug,
      name: domain,
      slug,
    },
    configVersion: 1,
    totalQuestions: formattedQuestions.length,
    questions: formattedQuestions,
  };
};
