import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HdfcCheckout } from '@/features/enrollment/components/gateways/HdfcCheckout';
import {
  GATEWAY_ADAPTERS,
  getGatewayAdapter,
} from '@/features/enrollment/components/gateways/registry';
import { toast } from '@/shared/components/ui';

vi.mock('@/shared/components/ui', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

describe('HDFC SmartGateway Checkout Adapter (PAY-16)', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    delete window.location;
    window.location = {
      href: '',
      assign: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location = originalLocation;
  });

  describe('Gateway Registry Integration', () => {
    it('should register hdfc adapter in GATEWAY_ADAPTERS', () => {
      expect(GATEWAY_ADAPTERS.hdfc).toBeDefined();
      expect(GATEWAY_ADAPTERS.hdfc).toBe(HdfcCheckout);
    });

    it('should resolve HdfcCheckout through getGatewayAdapter case-insensitively', () => {
      expect(getGatewayAdapter('hdfc')).toBe(HdfcCheckout);
      expect(getGatewayAdapter('HDFC')).toBe(HdfcCheckout);
      expect(getGatewayAdapter('  hdfc  ')).toBe(HdfcCheckout);
    });

    it('should fallback to default gateway when provider is unrecognised or null', () => {
      expect(getGatewayAdapter('unknown_gateway')).toBe(GATEWAY_ADAPTERS.mock);
      expect(getGatewayAdapter(null)).toBe(GATEWAY_ADAPTERS.mock);
    });
  });

  describe('HdfcCheckout Component Lifecycle & Rendering', () => {
    const mockOrder = {
      orderId: 'ORD_ENR_TEST_001',
      amount: 499900, // 4999 in paise or major
      currency: 'INR',
      provider: 'hdfc',
      payment_url: 'https://smartgatewayuat.hdfcbank.com/session/sess_test_123',
    };

    const mockEnrollment = {
      id: 'enr_123',
      plan: {
        name: 'Full Stack Web Development',
        durationMonths: 6,
      },
    };

    const mockUser = {
      name: 'Test Student',
      email: 'student@example.com',
    };

    it('should render nothing when open is false', () => {
      const { container } = render(
        <HdfcCheckout
          order={mockOrder}
          enrollment={mockEnrollment}
          user={mockUser}
          open={false}
          onClose={vi.fn()}
          onComplete={vi.fn()}
        />
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText(/Redirecting to HDFC SmartGateway/i)).not.toBeInTheDocument();
    });

    it('should show toast error and call onClose if payment_url is missing', () => {
      const onClose = vi.fn();
      const orderWithoutUrl = { ...mockOrder, payment_url: undefined };

      render(
        <HdfcCheckout
          order={orderWithoutUrl}
          enrollment={mockEnrollment}
          user={mockUser}
          open={true}
          onClose={onClose}
          onComplete={vi.fn()}
        />
      );

      expect(toast.error).toHaveBeenCalledWith(
        'Unable to open HDFC SmartGateway',
        expect.objectContaining({
          description: expect.stringContaining('Payment session URL was not received'),
        })
      );
      expect(onClose).toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });

    it('should render modal dialog with branding, order details, and fallback link', () => {
      render(
        <HdfcCheckout
          order={mockOrder}
          enrollment={mockEnrollment}
          user={mockUser}
          open={true}
          onClose={vi.fn()}
          onComplete={vi.fn()}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to HDFC SmartGateway')).toBeInTheDocument();
      expect(screen.getByText('ORD_ENR_TEST_001')).toBeInTheDocument();
      expect(screen.getByText('PCI-DSS Level 1 Certified Bank Gateway')).toBeInTheDocument();

      const fallbackLink = screen.getByRole('link', {
        name: /click here if not redirected automatically/i,
      });
      expect(fallbackLink).toHaveAttribute(
        'href',
        'https://smartgatewayuat.hdfcbank.com/session/sess_test_123'
      );
    });

    it('should redirect window.location.href to payment_url after timer', () => {
      render(
        <HdfcCheckout
          order={mockOrder}
          enrollment={mockEnrollment}
          user={mockUser}
          open={true}
          onClose={vi.fn()}
          onComplete={vi.fn()}
        />
      );

      expect(window.location.href).toBe('');

      // Fast-forward redirect timer
      act(() => {
        vi.advanceTimersByTime(700);
      });

      expect(window.location.href).toBe(
        'https://smartgatewayuat.hdfcbank.com/session/sess_test_123'
      );
    });

    it('should support payment_url nested in checkoutData', () => {
      const nestedOrder = {
        orderId: 'ORD_NESTED_01',
        amount: 2500,
        provider: 'hdfc',
        checkoutData: {
          payment_url: 'https://smartgatewayuat.hdfcbank.com/session/sess_nested_456',
        },
      };

      render(
        <HdfcCheckout
          order={nestedOrder}
          enrollment={mockEnrollment}
          user={mockUser}
          open={true}
          onClose={vi.fn()}
          onComplete={vi.fn()}
        />
      );

      act(() => {
        vi.advanceTimersByTime(700);
      });

      expect(window.location.href).toBe(
        'https://smartgatewayuat.hdfcbank.com/session/sess_nested_456'
      );
    });

    it('should abort redirection cleanly if unmounted before timer fires', () => {
      const { unmount } = render(
        <HdfcCheckout
          order={mockOrder}
          enrollment={mockEnrollment}
          user={mockUser}
          open={true}
          onClose={vi.fn()}
          onComplete={vi.fn()}
        />
      );

      // Unmount before 600ms
      unmount();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // window.location.href remains unchanged
      expect(window.location.href).toBe('');
    });
  });
});
