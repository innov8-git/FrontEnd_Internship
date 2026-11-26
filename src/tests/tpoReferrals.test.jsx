import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  buildTpoRegistrationLink,
  buildWhatsAppShareUrl,
} from '@/features/admin/utils/tpoShare';
import { CreateTpoModal } from '@/features/admin/components/CreateTpoModal';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { InternshipDetailsModal } from '@/features/internships/components/InternshipDetailsModal';
import { AuthContext } from '@/shared/context/AuthContext';
import * as adminService from '@/services/adminService';
import * as authService from '@/services/authService';
import * as paymentService from '@/services/paymentService';
import * as projectService from '@/services/projectService';

vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => ({
    loginWithGoogle: vi.fn(),
    user: null,
  }),
}));

const MOCK_PARTNER = {
  id: 'inlarge-software',
  name: 'Inlarge Software',
  logoInitials: 'IS',
  logoBg: 'bg-emerald-600',
  domain: 'Banking',
  assignedDomains: ['Banking'],
  location: '100% Online Remote',
  roles: [
    {
      designation: 'Trainee Software Engineer - Web Development',
      role: 'Trainee Software Engineer',
      track: 'web',
      trackType: 'Web Development',
      trackLabel: 'Web',
      duration: '1 to 6 Months',
      applicantsCount: 42,
      description: 'Build financial systems.',
      keyDeliverables: ['Build APIs'],
      perks: ['Certificate'],
    },
  ],
};

function renderWithProviders(ui, { initialEntries = ['/'], authValue = null } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapped = authValue ? (
    <AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>
  ) : (
    ui
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{wrapped}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('TPO Share Helpers', () => {
  it('builds an internships link containing ?ref=<CODE>', () => {
    const link = buildTpoRegistrationLink('tpo-rs-7k4m9');
    expect(link).toContain('/internships?ref=TPO-RS-7K4M9');
  });

  it('builds a WhatsApp wa.me share URL with sanitized phone and code message', () => {
    const url = buildWhatsAppShareUrl({
      name: 'Dr. Rahul Sharma',
      college: 'PIT',
      phone: '98765 43210',
      referralCode: 'TPO-RS-7K4M9',
    });
    expect(url).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
    expect(decodeURIComponent(url)).toContain('TPO-RS-7K4M9');
    expect(decodeURIComponent(url)).toContain('/internships?ref=TPO-RS-7K4M9');
  });
});

describe('CreateTpoModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('enforces all 4 mandatory fields and shows WhatsApp share view after code generation', async () => {
    const user = userEvent.setup();
    vi.spyOn(adminService, 'createTpo').mockResolvedValueOnce({
      _id: 'tpo-1',
      name: 'Dr. Rahul Sharma',
      college: 'Pune Institute of Technology',
      email: 'rahul@pit.edu',
      phone: '9876543210',
      referralCode: 'TPO-RS-7K4M9',
      isActive: true,
      totalReferences: 0,
      pendingReferences: 0,
    });

    renderWithProviders(<CreateTpoModal open onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /generate reference code/i }));
    expect(await screen.findByText(/tpo full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/college or institution name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone \/ whatsapp number is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tpo full name/i), 'Dr. Rahul Sharma');
    await user.type(screen.getByLabelText(/college \/ institution/i), 'Pune Institute of Technology');
    await user.type(screen.getByLabelText(/email address/i), 'rahul@pit.edu');
    await user.type(screen.getByLabelText(/phone \/ whatsapp number/i), '9876543210');

    await user.click(screen.getByRole('button', { name: /generate reference code/i }));

    expect(await screen.findByTestId('generated-tpo-code')).toHaveTextContent('TPO-RS-7K4M9');
    const waLink = screen.getByRole('link', { name: /share to tpo on whatsapp/i });
    expect(waLink).toHaveAttribute('href', expect.stringContaining('https://wa.me/919876543210'));
  });
});

describe('RegisterPage (TPO field removed)', () => {
  it('does not render a TPO Reference Code field on student registration', () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });
    expect(screen.queryByLabelText(/tpo reference code/i)).not.toBeInTheDocument();
  });
});

describe('InternshipDetailsModal Step 3 Demo Payment TPO Reference Code', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('validates optional TPO Reference Code on Step 3 and submits it in demo checkout', async () => {
    const user = userEvent.setup();
    vi.spyOn(projectService, 'getDomainProjects').mockResolvedValue({
      items: [{ id: 'proj-1', title: 'ApexPay', isDefault: true }],
    });
    vi.spyOn(authService, 'validateReferralCode').mockResolvedValue({
      valid: true,
      referralCode: 'TPO-RS-7K4M9',
      tpoName: 'Dr. Rahul Sharma',
      college: 'PIT',
    });
    const checkoutSpy = vi.spyOn(paymentService, 'completeDemoCheckout').mockResolvedValueOnce({
      success: true,
      orderId: 'DEMO-TXN-88888888',
      referralCodeUsed: 'TPO-RS-7K4M9',
      tpoName: 'Dr. Rahul Sharma',
    });

    renderWithProviders(
      <InternshipDetailsModal
        partner={MOCK_PARTNER}
        open
        onClose={vi.fn()}
        initialTab="apply"
      />,
      {
        initialEntries: ['/internships'],
        authValue: {
          isAuthenticated: true,
          user: { _id: 'stu-1', name: 'Alex Mugera', email: 'alex@pit.edu', roles: ['STUDENT'] },
        },
      },
    );

    // Step 1: Fill mandatory details
    await user.type(screen.getByLabelText(/phone number/i), '9876543210');
    await user.type(screen.getByLabelText(/college \/ university/i), 'Pune Institute of Tech');
    await user.click(screen.getByRole('button', { name: /^next$/i }));

    // Step 2: Advance to Demo Payment
    const submitAppBtn = await screen.findByRole('button', { name: /submit application/i });
    await user.click(submitAppBtn);

    // Step 3: Enter TPO Reference Code
    const refInput = await screen.findByTestId('payment-referral-code-input');
    await user.type(refInput, 'tpo-rs-7k4m9');
    expect(refInput).toHaveValue('TPO-RS-7K4M9');

    expect(await screen.findByTestId('payment-verified-tpo-banner')).toHaveTextContent(
      'Dr. Rahul Sharma (PIT)',
    );

    // Complete Demo Checkout
    await user.click(screen.getByRole('button', { name: /pay ₹1,699/i }));

    await waitFor(() => {
      expect(checkoutSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'alex@pit.edu',
          referralCode: 'TPO-RS-7K4M9',
        }),
      );
    });

    expect(await screen.findByText(/demo payment successful/i)).toBeInTheDocument();
    expect(screen.getByText('TPO-RS-7K4M9')).toBeInTheDocument();
  });
});
