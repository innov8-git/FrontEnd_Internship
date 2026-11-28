import { api, apiClient } from './api';

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
 * Uses extended timeout since this involves enrollment creation + external HDFC API call.
 */
export const initiateHdfcCheckout = (payload) =>
  api.post('/payments/hdfc-checkout', payload, { timeout: 60000 });

/**
 * Demo payment directly from the application modal without external gateways.
 * Creates an active enrollment and successful payment visible in admin analytics.
 */
export const completeDemoCheckout = (payload) =>
  api.post('/payments/demo-checkout', payload);

/**
 * Downloads official PDF payment receipt and tax invoice for a payment or enrollment.
 * Triggers a browser file download of the PDF blob.
 *
 * @param {string} paymentOrEnrollmentId
 * @param {string} [filename]
 */
export const downloadReceiptPdf = async (paymentOrEnrollmentId, filename) => {
  const response = await apiClient.get(`/payments/${encodeURIComponent(paymentOrEnrollmentId)}/receipt`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || `receipt-${paymentOrEnrollmentId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
