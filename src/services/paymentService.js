import { api } from './api';

/**
 * Payments Service (SD7, SD8, PAY-17).
 * The amount is always taken from the enrollment's price snapshot on the server;
 * the browser requests an order with provider 'hdfc' and opens the gateway checkout.
 *
 * @param {string|{enrollmentId: string, provider?: string}} enrollmentIdOrParams
 * @returns {Promise<{paymentId: string, orderId: string, provider: string, amount: number, currency: string, status: string, payment_url?: string, checkoutData?: object}>}
 */
export const createOrder = (enrollmentIdOrParams) => {
  const payload =
    typeof enrollmentIdOrParams === 'string'
      ? { enrollmentId: enrollmentIdOrParams, provider: 'hdfc' }
      : { provider: 'hdfc', ...enrollmentIdOrParams };

  return api.post('/payments/orders', payload);
};

/**
 * @deprecated Legacy mock gateway only: simulates webhook outcome in local mock mode.
 * @param {{ orderId: string, outcome: 'success'|'failure'|'pending' }} param0
 */
export const completeMockPayment = ({ orderId, outcome }) =>
  api.post('/payments/mock/complete', { orderId, outcome });

/**
 * Initiates an HDFC SmartGateway checkout directly from the internship application modal.
 * Creates a PENDING_PAYMENT enrollment and returns the HDFC payment_url for redirection.
 */
export const initiateHdfcCheckout = (payload) =>
  api.post('/payments/hdfc-checkout', payload);

/**
 * Demo payment directly from the application modal without external gateways.
 * Creates an active enrollment and successful payment visible in admin analytics.
 */
export const completeDemoCheckout = (payload) =>
  api.post('/payments/demo-checkout', payload);
