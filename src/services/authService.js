import { api } from './api';

export const validateReferralCode = (code) =>
  api.get(`/auth/referral-code/${encodeURIComponent(String(code ?? '').trim().toUpperCase())}`);

export const register = (payload) =>
  api.post('/auth/register', payload);

export const registerStudent = (payload) =>
  api.post('/auth/register/student', payload);

export const sendOtp = ({ email, purpose }) =>
  api.post('/auth/otp/send', { email, purpose });

export const resendOtp = ({ email, purpose }) =>
  api.post('/auth/otp/resend', { email, purpose });

export const verifyRegistrationOtp = ({ email, otp }) =>
  api.post('/auth/otp/verify-registration', { email, otp });

export const loginWithOtp = ({ email, otp }) =>
  api.post('/auth/otp/login', { email, otp });

export const verifyResetOtp = ({ email, otp }) =>
  api.post('/auth/otp/verify-reset', { email, otp });

export const login = ({ email, password }) => api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getMe = () => api.get('/auth/me');

export const updateMe = (payload) => api.patch('/auth/me', payload);

export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append('avatar', file);
  return api.post('/auth/me/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadResume = (file) => {
  const form = new FormData();
  form.append('resume', file);
  return api.post('/auth/me/resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifyEmail = (token) => api.post('/auth/verify-email', { token });

export const resendVerification = (email) => api.post('/auth/resend-verification', { email });

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const resetPassword = ({ token, password }) =>
  api.post('/auth/reset-password', { token, password });

export const loginWithGoogle = ({ credential, code, referralCode } = {}) => {
  const normalizedCode = typeof referralCode === 'string' ? referralCode.trim().toUpperCase() : '';
  return api.post('/auth/google', {
    credential,
    code,
    ...(normalizedCode ? { referralCode: normalizedCode } : {}),
  });
};

