import { api } from './api';

export const register = (payload) =>
  api.post('/auth/register', payload);

export const login = ({ email, password }) => api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getMe = () => api.get('/auth/me');

export const updateMe = ({ name, trainerProfile }) =>
  api.patch('/auth/me', { name, trainerProfile });

export const verifyEmail = (token) => api.post('/auth/verify-email', { token });

export const resendVerification = (email) => api.post('/auth/resend-verification', { email });

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const resetPassword = ({ token, password }) =>
  api.post('/auth/reset-password', { token, password });

export const loginWithGoogle = ({ credential, code } = {}) =>
  api.post('/auth/google', { credential, code });

