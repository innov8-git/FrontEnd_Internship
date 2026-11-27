import { json, mock, requireAuth } from '../utils';

/**
 * In-app notifications mock handlers for Vitest & VITE_USE_MOCKS=true.
 */
export const notificationHandlers = [
  mock.get('/notifications', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    return json({ items: [], unreadCount: 0 });
  }),

  mock.patch('/notifications/read-all', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    return json({ unreadCount: 0 });
  }),

  mock.patch('/notifications/:id/read', ({ request }) => {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    return json({ read: true });
  }),
];

export default notificationHandlers;
