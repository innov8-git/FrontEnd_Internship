import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DomainAssessmentFlow } from '@/features/assessment/components/DomainAssessmentFlow';
import { DiscountCalculator } from '@/features/internships/components/DiscountCalculator';
import { DomainSelectionModal } from '@/features/internships/components/DomainSelectionModal';
import AssessmentRedirect from '@/routes/AssessmentRedirect';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DomainAssessmentFlow, Calculator & Direct Enrollment Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('DomainAssessmentFlow (Direct Admission & Platform Charges)', () => {
    const candidate = {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      duration: '3 Months',
    };
    const partner = {
      name: 'Inlarge Software',
      domain: 'Banking & Finance',
    };
    const role = {
      designation: 'Trainee Software Engineer',
    };

    it('renders direct admission summary and partner details without quiz questions', () => {
      render(
        <MemoryRouter>
          <DomainAssessmentFlow
            candidate={candidate}
            partner={partner}
            role={role}
            domain="Banking"
            onClose={vi.fn()}
          />
        </MemoryRouter>,
      );

      // Header details
      expect(
        screen.getByText(/Application Submitted to Inlarge Software!/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Alex Morgan/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Banking Track/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Direct Admission & Platform Charges/i)).toBeInTheDocument();

      // Program highlight cards
      expect(screen.getByText(/Direct Enrollment Granted/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Platform Concession/i)).toBeInTheDocument();
      expect(screen.getByText(/1-on-1 Senior Mentorship/i)).toBeInTheDocument();
      expect(screen.getByText(/Verified GitHub Certificate/i)).toBeInTheDocument();

      // Completely ensures absence of old quiz & screening elements
      expect(screen.queryByText(/Question 1 of 15/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Jump to Question/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Use keys 1-4 to pick/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Technical screening test/i)).not.toBeInTheDocument();
    });

    it('displays transparent platform fee breakdown with direct 15% discount', () => {
      render(
        <MemoryRouter>
          <DomainAssessmentFlow
            candidate={candidate}
            partner={partner}
            role={role}
            domain="Banking"
            onClose={vi.fn()}
          />
        </MemoryRouter>,
      );

      // Tuition & fee breakdown
      expect(screen.getByText(/₹0 \(100% Free \/ Unpaid\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Standard Platform Fee:/i)).toBeInTheDocument();
      expect(screen.getByText(/₹1999/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Platform Discount \(15%\):/i)).toBeInTheDocument();
      expect(screen.getByText(/-₹300/i)).toBeInTheDocument();
      expect(screen.getAllByText(/₹1699/i).length).toBeGreaterThanOrEqual(1);
    });

    it('allows toggling payment methods (UPI, Card, NetBanking)', () => {
      render(
        <MemoryRouter>
          <DomainAssessmentFlow
            candidate={candidate}
            partner={partner}
            role={role}
            domain="Banking"
            onClose={vi.fn()}
          />
        </MemoryRouter>,
      );

      const cardBtn = screen.getByRole('button', { name: /Demo Card/i });
      const netBankingBtn = screen.getByRole('button', { name: /NetBanking/i });
      const upiBtn = screen.getByRole('button', { name: /Demo UPI/i });

      expect(cardBtn).toBeInTheDocument();
      expect(netBankingBtn).toBeInTheDocument();
      expect(upiBtn).toBeInTheDocument();

      fireEvent.click(cardBtn);
      // State switches smoothly without errors
      fireEvent.click(netBankingBtn);
      fireEvent.click(upiBtn);
    });

    it('completes demo seat confirmation, saves selection to localStorage, and confirms enrollment', async () => {
      const mockClose = vi.fn();
      render(
        <MemoryRouter>
          <DomainAssessmentFlow
            candidate={candidate}
            partner={partner}
            role={role}
            domain="Banking"
            onClose={mockClose}
          />
        </MemoryRouter>,
      );

      const confirmBtn = screen.getByRole('button', {
        name: /Confirm Seat & Open Student Portal/i,
      });
      fireEvent.click(confirmBtn);

      // Successfully transitions to confirmation view
      expect(
        await screen.findByText(/Seat Successfully Confirmed!/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/You are officially enrolled for/i),
      ).toBeInTheDocument();

      // Verified persistence in localStorage
      const saved = JSON.parse(localStorage.getItem('alfre_selected_internship') || '{}');
      expect(saved.partner.name).toBe('Inlarge Software');
      expect(saved.domain).toBe('Banking');
      expect(saved.concessionPercent).toBe(15);
      expect(saved.finalAmount).toBe(1699);
      expect(saved.status).toBe('SELECTED_CONFIRMED');

      // Verifies navigation timeout triggers
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        expect(mockClose).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });

  describe('DiscountCalculator (Platform Fee & Discount Simulator)', () => {
    it('renders platform discount simulator and recalculates on slider adjustment', () => {
      render(
        <MemoryRouter>
          <DiscountCalculator />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole('heading', {
          name: /Calculate Your Platform Charges & Discount/i,
        }),
      ).toBeInTheDocument();

      // Initial state is 15% discount
      // Base: ₹4,999, Savings: 15% of 4999 = 750, Final: 4249
      expect(screen.getByText(/15% OFF/i)).toBeInTheDocument();
      expect(screen.getByText(/₹4,249/i)).toBeInTheDocument();
      expect(screen.getByText(/You save ₹750 with direct platform discount!/i)).toBeInTheDocument();

      // Highlights present
      expect(screen.getByText(/Direct enrollment — no entrance test/i)).toBeInTheDocument();
      expect(screen.getByText(/Transparent platform charges & fees/i)).toBeInTheDocument();

      // Adjust slider to 20%
      const slider = screen.getByLabelText(/Direct Platform Discount/i);
      fireEvent.change(slider, { target: { value: '20' } });

      // Recalculates: 20% of 4999 = 1000, Final: 3999
      expect(screen.getByText(/20% OFF/i)).toBeInTheDocument();
      expect(screen.getByText(/₹3,999/i)).toBeInTheDocument();
      expect(screen.getByText(/You save ₹1,000 with direct platform discount!/i)).toBeInTheDocument();

      // Ensure button links to catalog
      const browseLink = screen.getByRole('link', { name: /Browse Tracks & Enroll/i });
      expect(browseLink).toHaveAttribute('href', '/internships');
    });
  });

  describe('DomainSelectionModal (Direct Track Selection without Screening Test)', () => {
    it('renders domain options and directly routes to /enroll upon selection', () => {
      const mockClose = vi.fn();
      const availableDomains = [
        { _id: 'dom-banking', name: 'Banking & FinTech', description: 'Enterprise banking' },
        { _id: 'dom-health', name: 'Healthcare & MedTech', description: 'HIPAA healthcare' },
      ];

      render(
        <MemoryRouter>
          <DomainSelectionModal
            open={true}
            onClose={mockClose}
            designation={{ _id: 'desig-999', name: 'Cloud Engineer' }}
            availableDomains={availableDomains}
          />
        </MemoryRouter>,
      );

      expect(screen.getByText(/Select Your Domain Specialization/i)).toBeInTheDocument();
      expect(screen.getByText(/Applying for Cloud Engineer/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Direct Admission · Instant Enrollment · Direct Concession/i),
      ).toBeInTheDocument();

      // Select healthcare domain
      const healthRadio = screen.getByLabelText(/Healthcare & MedTech/i);
      fireEvent.click(healthRadio);

      // Submit enrollment in chosen track
      const enrollBtn = screen.getByRole('button', {
        name: /Enroll in Track \(Healthcare & MedTech\)/i,
      });
      fireEvent.click(enrollBtn);

      expect(mockClose).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/enroll?designationId=desig-999');
    });
  });

  describe('AssessmentRedirect Component', () => {
    it('redirects to /enroll with designationId when present', () => {
      render(
        <MemoryRouter initialEntries={['/assessment/desig-777']}>
          <Routes>
            <Route path="/assessment/:designationId" element={<AssessmentRedirect />} />
            <Route path="/enroll" element={<div>Target Enrollment Page</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Target Enrollment Page')).toBeInTheDocument();
    });

    it('redirects to /internships when designationId is absent', () => {
      render(
        <MemoryRouter initialEntries={['/assessment']}>
          <Routes>
            <Route path="/assessment" element={<AssessmentRedirect />} />
            <Route path="/internships" element={<div>Target Catalog Page</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Target Catalog Page')).toBeInTheDocument();
    });
  });
});
