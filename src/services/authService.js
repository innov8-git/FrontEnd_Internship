import { api } from './api';

export const register = (payload) =>
  api.post('/auth/register', payload);

export const registerStudent = (payload) =>
  api.post('/auth/register/student', payload);

export const registerTrainer = (payload) =>
  api.post('/auth/register/trainer', payload);

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

export const verifyEmail = (token) => api.post('/auth/verify-email', { token });

export const resendVerification = (email) => api.post('/auth/resend-verification', { email });

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const resetPassword = ({ token, password }) =>
  api.post('/auth/reset-password', { token, password });

export const loginWithGoogle = ({ credential, code } = {}) =>
  api.post('/auth/google', { credential, code });

