import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '@/shared/context/AuthContext';
import { PayPanel } from '@/features/enrollment/components/PayPanel';
import { PaymentPage } from '@/features/enrollment/pages/PaymentPage';
import { createOrder } from '@/services/paymentService';
import { api } from '@/services/api';

describe('PAY-17: Payment UI, PayPanel & Live HDFC Gateway Integration', () => {
  describe('PayPanel Component Security Badges & CTAs', () => {
    it('renders payable amount, bank encryption badge, and HDFC SmartGateway branding', () => {
      const handlePay = vi.fn();
      render(
        <PayPanel
          amount={499900}
          currency="INR"
          canPay={true}
          loading={false}
          onPay={handlePay}
        />
      );

      // Verify amount display
      expect(screen.getByText('Total payable')).toBeInTheDocument();
      expect(screen.getAllByText(/4,999/).length).toBeGreaterThanOrEqual(1);

      // Verify HDFC SmartGateway bank-grade branding & encryption
      expect(screen.getByText('Powered by HDFC SmartGateway')).toBeInTheDocument();
      expect(screen.getByText('256-bit Bank Grade SSL Encryption')).toBeInTheDocument();
      expect(
        screen.getByText(/Payments are handled securely via HDFC. We never see or store your card or UPI credentials./)
      ).toBeInTheDocument();

      // Verify CTA button
      const payButton = screen.getByRole('button', { name: /Pay/i });
      expect(payButton).toBeInTheDocument();
      expect(payButton).not.toBeDisabled();

      fireEvent.click(payButton);
      expect(handlePay).toHaveBeenCalledTimes(1);
    });

    it('renders "Retry payment" when isRetry is true after a failed attempt', () => {
      const handlePay = vi.fn();
      render(
        <PayPanel
          amount={499900}
          currency="INR"
          isRetry={true}
          canPay={true}
          loading={false}
          onPay={handlePay}
        />
      );

      expect(screen.getByRole('button', { name: 'Retry payment' })).toBeInTheDocument();
      expect(screen.getByText('Powered by HDFC SmartGateway')).toBeInTheDocument();
    });

    it('disables pay button and displays blocked reason when user cannot pay', () => {
      render(
        <PayPanel
          amount={499900}
          currency="INR"
          canPay={false}
          blockedReason="Verify your email to unlock payment."
          loading={false}
          onPay={vi.fn()}
        />
      );

      const payBtn = screen.getByRole('button', { name: /Pay/i });
      expect(payBtn).toBeDisabled();
      expect(screen.getByText('Verify your email to unlock payment.')).toBeInTheDocument();
    });

    it('shows loading state on pay button during order session creation', () => {
      render(
        <PayPanel
          amount={499900}
          currency="INR"
          canPay={true}
          loading={true}
          onPay={vi.fn()}
        />
      );

      const payBtn = screen.getByRole('button', { name: /Pay/i });
      expect(payBtn).toBeDisabled();
    });
  });

  describe('Payment Service: createOrder Payload Verification', () => {
    it('automatically ensures provider "hdfc" when passed enrollmentId string', async () => {
      const apiPostSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
        orderId: 'order_hdfc_test_123',
        provider: 'hdfc',
        payment_url: 'https://smartgatewayuat.hdfcbank.com/session/order_hdfc_test_123',
      });

      await createOrder('enr_test_abc');

      expect(apiPostSpy).toHaveBeenCalledWith('/payments/orders', {
        enrollmentId: 'enr_test_abc',
        provider: 'hdfc',
      });

      apiPostSpy.mockRestore();
    });

    it('preserves or defaults provider "hdfc" when passed params object', async () => {
      const apiPostSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
        orderId: 'order_hdfc_test_456',
        provider: 'hdfc',
        payment_url: 'https://smartgatewayuat.hdfcbank.com/session/order_hdfc_test_456',
      });

      await createOrder({ enrollmentId: 'enr_test_xyz' });

      expect(apiPostSpy).toHaveBeenCalledWith('/payments/orders', {
        enrollmentId: 'enr_test_xyz',
        provider: 'hdfc',
      });

      apiPostSpy.mockRestore();
    });
  });

  describe('PaymentPage Integration Flow', () => {
    function renderPaymentPage(enrollmentData, userData = {}) {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      });

      // Seed enrollment and terms in query cache
      queryClient.setQueryData(['enrollments', 'detail', 'enr_123'], enrollmentData);
      queryClient.setQueryData(['terms', 'latest'], { version: '1' });

      const mockAuthValue = {
        user: { _id: 'usr_1', email: 'student@example.com', name: 'Test Student', emailVerified: true, ...userData },
        isAuthenticated: true,
        status: 'authenticated',
        updateUser: vi.fn(),
      };

      return render(
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={mockAuthValue}>
            <MemoryRouter initialEntries={['/payment/enr_123']}>
              <Routes>
                <Route path="/payment/:enrollmentId" element={<PaymentPage />} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    }

    it('renders order summary, price breakdown and security badges for payable enrollment', async () => {
      const mockEnrollment = {
        _id: 'enr_123',
        id: 'enr_123',
        userId: 'usr_1',
        status: 'PENDING_PAYMENT',
        paymentStatus: 'CREATED',
        termsAcceptedVersion: '1',
        plan: { title: 'Standard Track' },
        priceSnapshot: {
          payableAmount: 499900,
          currency: 'INR',
          planPrice: 499900,
        },
      };

      renderPaymentPage(mockEnrollment);

      expect(screen.getByText('Review and pay')).toBeInTheDocument();
      expect(screen.getByText('Powered by HDFC SmartGateway')).toBeInTheDocument();
      expect(screen.getByText('256-bit Bank Grade SSL Encryption')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Pay/i })).not.toBeDisabled();
    });

    it('renders "Retry payment" when last payment attempt failed', async () => {
      const failedEnrollment = {
        _id: 'enr_123',
        id: 'enr_123',
        userId: 'usr_1',
        status: 'PENDING_PAYMENT',
        paymentStatus: 'FAILED',
        termsAcceptedVersion: '1',
        plan: { title: 'Standard Track' },
        priceSnapshot: {
          payableAmount: 499900,
          currency: 'INR',
        },
      };

      renderPaymentPage(failedEnrollment);

      expect(screen.getByRole('button', { name: 'Retry payment' })).toBeInTheDocument();
      expect(screen.getByText('Powered by HDFC SmartGateway')).toBeInTheDocument();
    });

    it('disables pay button if student email is not verified', async () => {
      const mockEnrollment = {
        _id: 'enr_123',
        id: 'enr_123',
        userId: 'usr_1',
        status: 'PENDING_PAYMENT',
        paymentStatus: 'CREATED',
        termsAcceptedVersion: '1',
        plan: { title: 'Standard Track' },
        priceSnapshot: {
          payableAmount: 499900,
          currency: 'INR',
        },
      };

      renderPaymentPage(mockEnrollment, { emailVerified: false });

      const payBtn = screen.getByRole('button', { name: /Pay/i });
      expect(payBtn).toBeDisabled();
      expect(screen.getByText('Verify your email to unlock payment.')).toBeInTheDocument();
    });

    it('renders "Nothing left to pay" when enrollment is already ACTIVE', async () => {
      const activeEnrollment = {
        _id: 'enr_123',
        id: 'enr_123',
        userId: 'usr_1',
        status: 'ACTIVE',
        paymentStatus: 'SUCCESS',
        termsAcceptedVersion: '1',
        plan: { title: 'Standard Track' },
        priceSnapshot: {
          payableAmount: 499900,
          currency: 'INR',
        },
      };

      renderPaymentPage(activeEnrollment);

      expect(screen.getByText('Nothing left to pay')).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /Go to dashboard/i }).length).toBeGreaterThanOrEqual(1);
    });
  });
});
