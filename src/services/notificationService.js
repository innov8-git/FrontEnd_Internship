import { api } from './api';

export const getNotifications = (params = {}) => api.get('/notifications', params);

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${encodeURIComponent(id)}/read`);

export const markAllNotificationsRead = () => api.patch('/notifications/read-all');
