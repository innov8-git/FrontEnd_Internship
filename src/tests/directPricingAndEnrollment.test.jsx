import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { planCreateSchema, planUpdateSchema } from '@/features/catalog/schemas/catalogValidation';
import { isMemberReady, nextMissingStep } from '@/features/teams/utils/teamUtils';
import { StartAssessmentButton } from '@/features/internships/components/StartAssessmentButton';
import { PriceLines } from '@/features/enrollment/components/PriceBreakdown';
import { createQuote } from '@/mocks/services';
import { db } from '@/mocks/db';
import { AuthContext } from '@/shared/context/AuthContext';

describe('Direct Platform Charges & Discount Flow (Assessment Removed)', () => {
  describe('Plan validation schemas', () => {
    it('validates plan creation with base price and direct discount percentage', () => {
      const valid = {
        designationId: 'desig1',
        domainId: 'dom1',
        durationMonths: 3,
        basePrice: '12999',
        discountPercent: 15,
        publishNow: true,
      };
      const result = planCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercent).toBe(15);
      }
    });

    it('defaults discountPercent to 0 when omitted', () => {
      const valid = {
        designationId: 'desig1',
        domainId: 'dom1',
        durationMonths: 3,
        basePrice: '12999',
      };
      const result = planCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercent).toBe(0);
      }
    });

    it('rejects discountPercent greater than 100 or less than 0', () => {
      const overHundred = {
        designationId: 'desig1',
        domainId: 'dom1',
        durationMonths: 3,
        basePrice: '12999',
        discountPercent: 120,
      };
      const resultOver = planCreateSchema.safeParse(overHundred);
      expect(resultOver.success).toBe(false);

      const negative = {
        domainId: 'dom1',
        durationMonths: 3,
        basePrice: '12999',
        discountPercent: -5,
      };
      const resultNeg = planUpdateSchema.safeParse(negative);
      expect(resultNeg.success).toBe(false);
    });
  });

  describe('Team readiness helpers without assessment requirement', () => {
    it('marks a member ready when joined and paid, without requiring assessment', () => {
      const member = { joined: true, paid: true, assessed: false };
      expect(isMemberReady(member)).toBe(true);
    });

    it('returns pay for their seat when joined but not paid', () => {
      const member = { joined: true, paid: false, assessed: false };
      expect(isMemberReady(member)).toBe(false);
      expect(nextMissingStep(member)).toBe('pay for their seat');
    });

    it('returns accept the invite when not joined', () => {
      const member = { joined: false, paid: false, assessed: false };
      expect(isMemberReady(member)).toBe(false);
      expect(nextMissingStep(member)).toBe('accept the invite');
    });
  });

  describe('createQuote service without assessment gating', () => {
    it('generates a valid quote directly using plan discountPercent without requiring assessment attempt', () => {
      const studentUser = db.users.find((u) => u.roles?.includes('STUDENT')) || {
        _id: 'test-student-id',
        roles: ['STUDENT'],
      };
      const plan = db.internshipPlans.find((p) => p.status === 'PUBLISHED') || {
        _id: 'test-plan-id',
        status: 'PUBLISHED',
        basePrice: 1000000,
        currency: 'INR',
        designationId: 'desig1',
      };
      plan.discountPercent = 20;

      // Ensure no attempts exist for this user & designation
      db.assessmentAttempts = (db.assessmentAttempts || []).filter(
        (a) => !(a.userId === studentUser._id && a.designationId === plan.designationId),
      );

      const quote = createQuote({ user: studentUser, planId: plan._id });
      expect(quote).toBeDefined();
      expect(quote.basePrice).toBe(plan.basePrice);
      expect(quote.discountPercent).toBe(20);
      expect(quote.payableAmount).toBe(Math.round(plan.basePrice * 0.8));
    });
  });

  describe('StartAssessmentButton transformed to direct Enroll Now', () => {
    it('renders Enroll now button for student linking directly to /enroll', () => {
      const authValue = {
        isAuthenticated: true,
        isLoading: false,
        user: { _id: 's1', roles: ['STUDENT'] },
        hasRole: (role) => role === 'STUDENT',
      };

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter>
            <StartAssessmentButton designationId="desig-abc" />
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      const enrollBtn = screen.getByRole('link', { name: /enroll now/i });
      expect(enrollBtn).toBeInTheDocument();
      expect(enrollBtn.getAttribute('href')).toBe('/enroll?designationId=desig-abc');
      expect(screen.queryByText(/start assessment/i)).not.toBeInTheDocument();
    });

    it('renders Enroll now and Create an account for unauthenticated visitors', () => {
      const authValue = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasRole: () => false,
      };

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter>
            <StartAssessmentButton designationId="desig-xyz" />
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(screen.getByRole('link', { name: /enroll now/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
    });
  });

  describe('PriceLines component displays Platform discount', () => {
    it('renders Platform discount instead of Merit discount and shows discounted amount', () => {
      render(
        <PriceLines
          basePrice={1000000}
          discountPercent={15}
          payableAmount={850000}
          currency="INR"
        />,
      );

      expect(screen.getByText(/Platform discount/i)).toBeInTheDocument();
      expect(screen.getByText(/−15%/i)).toBeInTheDocument();
      expect(screen.queryByText(/Merit discount/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Assessment score/i)).not.toBeInTheDocument();
    });
  });
});
