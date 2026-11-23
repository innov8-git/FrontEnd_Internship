import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/services/paymentService';

/**
 * Creates a gateway order for an enrollment (SD7, PAY-17): mutate(enrollmentIdOrParams) resolves to
 * { paymentId, orderId, provider, amount, currency, status, payment_url, checkoutData }.
 * The amount is always the server's (from the enrollment's price snapshot).
 */
export function useCreateOrder() {
  return useMutation({
    mutationFn: (enrollmentIdOrParams) => createOrder(enrollmentIdOrParams),
  });
}

export default useCreateOrder;
