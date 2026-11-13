import { api, orNullOn404 } from './api';

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
