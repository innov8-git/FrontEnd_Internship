import { api } from './api';

/**
 * Private TPO Partner Portal API client.
 * Accessible strictly to authenticated TPOs (own records) and ADMINs.
 */
export const getMyTpoSummary = (params = {}) => api.get('/tpo/me/summary', params);
export const getMyTpoReferrals = (params = {}) => api.get('/tpo/me/referrals', params);
export const getMyTpoPayouts = (params = {}) => api.get('/tpo/me/payouts', params);
