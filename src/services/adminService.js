import { api, apiClient } from './api';

/** Admin operations (MM16, MM18, SD15). Lists take { page, limit, search, ...filters }. */
export const getAdminStats = () => api.get('/admin/stats');

// Users and roles
export const getUsers = (params = {}) => api.get('/admin/users', params);
export const updateUserRoles = (id, roles) =>
  api.patch(`/admin/users/${encodeURIComponent(id)}/roles`, { roles });
export const updateUserStatus = (id, status) =>
  api.patch(`/admin/users/${encodeURIComponent(id)}/status`, { status });
export const updateStudentTrainer = (id, payload) =>
  api.patch(`/admin/users/${encodeURIComponent(id)}/trainer`, payload);

// Enrollments and payments monitoring
export const getAdminEnrollments = (params = {}) => api.get('/admin/enrollments', params);
export const getAdminEnrollment = (id) => api.get(`/admin/enrollments/${encodeURIComponent(id)}`);
export const getAdminPayments = (params = {}) => api.get('/admin/payments', params);
export const getAdminPayment = (id) => api.get(`/admin/payments/${encodeURIComponent(id)}`);

// Certificates and email status
export const getAdminCertificates = (params = {}) => api.get('/admin/certificates', params);
export const resendCertificateEmail = (id) =>
  api.post(`/admin/certificates/${encodeURIComponent(id)}/resend`);

// Audit log (append-only)
export const getAuditLogs = (params = {}) => api.get('/admin/audit-logs', params);

// Trainers management
export const getTrainers = (params = {}) => api.get('/admin/trainers', params);
export const createTrainer = (payload) => api.post('/admin/trainers', payload);
export const updateTrainerStatus = (id, payload) =>
  api.patch(`/admin/trainers/${encodeURIComponent(id)}`, payload);
export const deleteTrainer = (id) =>
  api.delete(`/admin/trainers/${encodeURIComponent(id)}`);
export const getTrainerAssignments = (trainerId) =>
  api.get('/admin/trainer-assignments', { trainerId });
export const assignToTrainer = (trainerId, payload) =>
  api.post('/admin/trainer-assignments', { trainerId, ...payload });
export const removeTrainerAssignment = (_trainerId, assignmentId) =>
  api.delete(`/admin/trainer-assignments/${encodeURIComponent(assignmentId)}`);

export const fetchTrainerResumeBlob = async (trainerId, { download = false } = {}) => {
  const res = await apiClient.get(`/admin/trainers/${encodeURIComponent(trainerId)}/resume`, {
    params: download ? { download: '1' } : undefined,
    responseType: 'blob',
  });
  return res.data;
};

// Trainer join requests (public applications -> admin accept/delete)
export const getTrainerApplications = (params = {}) =>
  api.get('/admin/trainer-applications', params);

export const acceptTrainerApplication = (id, payload = {}) =>
  api.post(`/admin/trainer-applications/${encodeURIComponent(id)}/accept`, payload);

export const deleteTrainerApplication = (id) =>
  api.delete(`/admin/trainer-applications/${encodeURIComponent(id)}`);

export const fetchTrainerApplicationResumeBlob = async (id, { download = false } = {}) => {
  const res = await apiClient.get(
    `/admin/trainer-applications/${encodeURIComponent(id)}/resume`,
    {
      params: download ? { download: '1' } : undefined,
      responseType: 'blob',
    },
  );
  return res.data;
};
