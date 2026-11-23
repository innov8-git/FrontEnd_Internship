import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import {
  PAYMENT_PHASE,
  settledPhaseOf,
  usePaymentStatus,
} from '@/features/enrollment/hooks/usePaymentStatus';
import { PaymentStatusPage } from '@/features/enrollment/pages/PaymentStatusPage';
import { queryKeys } from '@/services/queryKeys';

describe('PAY-18: Payment Status Poller & Bank Return Handling', () => {
  describe('settledPhaseOf Helper Logic', () => {
    it('returns PAYMENT_PHASE.SUCCESS for active enrollment statuses', () => {
      expect(settledPhaseOf({ status: 'ACTIVE' })).toBe(PAYMENT_PHASE.SUCCESS);
      expect(settledPhaseOf({ status: 'IN_PROGRESS' })).toBe(PAYMENT_PHASE.SUCCESS);
      expect(settledPhaseOf({ status: 'COMPLETED' })).toBe(PAYMENT_PHASE.SUCCESS);
    });

    it('returns PAYMENT_PHASE.FAILED when paymentStatus is FAILED', () => {
      expect(settledPhaseOf({ status: 'PENDING_PAYMENT', paymentStatus: 'FAILED' })).toBe(
        PAYMENT_PHASE.FAILED
      );
    });

    it('returns PAYMENT_PHASE.UNAVAILABLE when enrollment is cancelled or suspended', () => {
      expect(settledPhaseOf({ status: 'CANCELLED' })).toBe(PAYMENT_PHASE.UNAVAILABLE);
      expect(settledPhaseOf({ status: 'SUSPENDED' })).toBe(PAYMENT_PHASE.UNAVAILABLE);
    });

    it('returns null while enrollment is still awaiting payment and not failed', () => {
      expect(settledPhaseOf({ status: 'PENDING_PAYMENT', paymentStatus: 'CREATED' })).toBeNull();
      expect(settledPhaseOf(null)).toBeNull();
    });
  });

  describe('usePaymentStatus Hook Lifecycle', () => {
    it('returns PAYMENT_PHASE.MISSING when no enrollmentId is passed', () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => usePaymentStatus(''), { wrapper });
      expect(result.current.phase).toBe(PAYMENT_PHASE.MISSING);
    });

    it('returns PAYMENT_PHASE.FAILED immediately when failed: true is provided in options', () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(
        () => usePaymentStatus('enr_test', { failed: true }),
        { wrapper }
      );
      expect(result.current.phase).toBe(PAYMENT_PHASE.FAILED);
    });

    it('returns PAYMENT_PHASE.SUCCESS and invalidates queries when enrollment is ACTIVE', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      // Pre-seed cache with active enrollment
      queryClient.setQueryData(queryKeys.enrollments.detail('enr_active'), {
        _id: 'enr_active',
        id: 'enr_active',
        status: 'ACTIVE',
        paymentStatus: 'SUCCESS',
      });

      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => usePaymentStatus('enr_active'), { wrapper });

      await waitFor(() => {
        expect(result.current.phase).toBe(PAYMENT_PHASE.SUCCESS);
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.enrollments.all });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.teams.all });
    });
  });

  describe('PaymentStatusPage Component UI Scenarios', () => {
    function renderStatusPage(initialUrl, cachedEnrollment = null) {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      });

      if (cachedEnrollment) {
        queryClient.setQueryData(
          queryKeys.enrollments.detail(cachedEnrollment._id || cachedEnrollment.id),
          cachedEnrollment
        );
      }

      return render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialUrl]}>
            <Routes>
              <Route path="/payment/status" element={<PaymentStatusPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
    }

    it('renders StatusPoller while polling unconfirmed payment with order ID', async () => {
      const pendingEnrollment = {
        _id: 'enr_pending',
        id: 'enr_pending',
        status: 'PENDING_PAYMENT',
        paymentStatus: 'CREATED',
      };

      renderStatusPage(
        '/payment/status?enrollmentId=enr_pending&orderId=order_hdfc_999',
        pendingEnrollment
      );

      expect(screen.getByText('Confirming your payment…')).toBeInTheDocument();
      expect(screen.getByText(/order_hdfc_999/)).toBeInTheDocument();
      expect(
        screen.getByText(/A redirect from the payment page is not proof of payment/)
      ).toBeInTheDocument();
    });

    it('renders PaymentSuccess when enrollment is confirmed ACTIVE', async () => {
      const activeEnrollment = {
        _id: 'enr_success',
        id: 'enr_success',
        status: 'ACTIVE',
        paymentStatus: 'SUCCESS',
        plan: { title: 'Full Stack Development Track' },
        priceSnapshot: {
          payableAmount: 499900,
          currency: 'INR',
        },
      };

      renderStatusPage(
        '/payment/status?enrollmentId=enr_success&orderId=order_hdfc_123&status=SUCCESS',
        activeEnrollment
      );

      expect(screen.getByText('Your internship is active')).toBeInTheDocument();
      expect(screen.getByText('Go to dashboard')).toBeInTheDocument();
      expect(screen.getByText(/order_hdfc_123/)).toBeInTheDocument();
    });

    it('renders PaymentFailed with bank reason when URL indicates failed payment', async () => {
      renderStatusPage(
        '/payment/status?enrollmentId=enr_fail&orderId=order_hdfc_failed&failed=true&reason=Transaction%20declined%20by%20bank'
      );

      expect(screen.getByText('Payment failed')).toBeInTheDocument();
      expect(screen.getByText(/Transaction declined by bank/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Retry payment' })).toBeInTheDocument();
      expect(screen.getByText(/order_hdfc_failed/)).toBeInTheDocument();
    });

    it('renders empty state when accessed with no enrollment ID or parameters', async () => {
      renderStatusPage('/payment/status');

      expect(screen.getByText("There's no payment to check")).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go to dashboard' })).toBeInTheDocument();
    });
  });
});
