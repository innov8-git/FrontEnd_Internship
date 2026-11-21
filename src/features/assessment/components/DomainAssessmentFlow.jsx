import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@/shared/components/ui';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Percent,
  Sparkles,
  Users,
  Wallet,
} from '@/shared/icons';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';

const BASE_PLATFORM_FEE = 1999;
const DIRECT_DISCOUNT_PERCENT = 15;

export function DomainAssessmentFlow({
  candidate = {},
  domain = 'Banking',
  partner = {},
  role = {},
  onClose,
}) {
  const navigate = useNavigate();

  // Payment method and status state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const discountAmount = Math.round((BASE_PLATFORM_FEE * DIRECT_DISCOUNT_PERCENT) / 100);
  const finalPayable = BASE_PLATFORM_FEE - discountAmount;

  // Handles demo payment confirmation and sets up the student session & storage
  const handleConfirmDemoSeat = () => {
    setIsProcessingPayment(true);

    const selectionRecord = {
      id: `selection-${Date.now()}`,
      partner,
      role,
      domain,
      concessionPercent: DIRECT_DISCOUNT_PERCENT,
      basePrice: BASE_PLATFORM_FEE,
      discountAmount,
      finalAmount: finalPayable,
      candidate,
      paymentMethod,
      status: 'SELECTED_CONFIRMED',
      adminTaskAssignmentStatus: 'PENDING_ADMIN_ASSIGNMENT',
      confirmedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('alfre_selected_internship', JSON.stringify(selectionRecord));

      // Ensure a student profile exists in localStorage so /dashboard route is accessible
      const existingUser = localStorage.getItem('alfre.auth.user');
      if (!existingUser) {
        const studentUser = {
          _id: `user-${Date.now()}`,
          name: candidate.fullName || 'Student Candidate',
          email: candidate.email || 'student@alfre.com',
          role: 'STUDENT',
          roles: ['STUDENT'],
        };
        localStorage.setItem('alfre.auth.user', JSON.stringify(studentUser));
        localStorage.setItem('alfre.auth.token', 'demo-student-token-jwt');
      }
    } catch {
      // ignore storage errors
    }

    setPaymentSuccess(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      if (onClose) onClose();
      navigate(ROUTES.DASHBOARD);
    }, 1200);
  };

  if (paymentSuccess) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950/60 dark:text-emerald-400 animate-bounce">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Seat Successfully Confirmed!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            You are officially enrolled for <strong>{partner.name}</strong> ({domain} Domain Track).
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Opening your Student Dashboard where your selected internship is logged…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Applicant Header */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-4 sm:p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5" />
              Direct Admission & Platform Charges
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Application Submitted to {partner.name || 'Partner Company'}!
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Thank you, <span className="font-semibold text-slate-900 dark:text-white">{candidate.fullName || 'Candidate'}</span>!
              Your application for the{' '}
              <span className="font-semibold text-brand-600 dark:text-brand-400">{role.designation || 'Role'}</span> ({domain} Domain · {candidate.duration || '3 Months'}) has been accepted.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="brand" className="text-xs px-2.5 py-1">
              {domain} Track
            </Badge>
            <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Role: {role.designation || 'Trainee Software Engineer'}
            </span>
          </div>
        </div>
      </div>

      {/* Program Highlights */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Direct Enrollment Granted
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
              Instant admission into the {domain} industry engineering track.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Direct Platform Concession
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
              {DIRECT_DISCOUNT_PERCENT}% platform fee discount applied automatically.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              1-on-1 Senior Mentorship
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
              Daily pull request code reviews and personalized guidance.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Verified GitHub Certificate
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
              Recruiter-verifiable credential linked to your committed code repository.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing & Checkout Simulator */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Charge Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Internship & Platform Charge Breakdown
          </h4>

          <div className="space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Partner Company:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{partner.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Role & Track:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{role.designation}</span>
            </div>
            <div className="flex justify-between">
              <span>Selected Domain:</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{domain} Track</span>
            </div>
            <div className="flex justify-between">
              <span>Internship Tuition:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹0 (100% Free / Unpaid)</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Platform Fee:</span>
              <span className="text-slate-900 dark:text-white font-medium">₹{BASE_PLATFORM_FEE}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Direct Platform Discount ({DIRECT_DISCOUNT_PERCENT}%):</span>
              <span>-₹{discountAmount}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
            <span>Net Platform Fee Payable:</span>
            <span className="text-base text-brand-600 dark:text-brand-400">₹{finalPayable}</span>
          </div>
        </div>

        {/* Demo Payment Simulator */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Select Demo Payment Method
            </h4>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
              Demo Checkout
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={cn(
                'flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all',
                paymentMethod === 'upi'
                  ? 'border-brand-600 bg-brand-50/70 text-brand-900 dark:border-brand-500 dark:bg-brand-950/60 dark:text-brand-200 font-semibold shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400',
              )}
            >
              <Wallet className="h-4 w-4 mb-1 text-brand-600 dark:text-brand-400" />
              <span>Demo UPI</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all',
                paymentMethod === 'card'
                  ? 'border-brand-600 bg-brand-50/70 text-brand-900 dark:border-brand-500 dark:bg-brand-950/60 dark:text-brand-200 font-semibold shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400',
              )}
            >
              <CreditCard className="h-4 w-4 mb-1 text-brand-600 dark:text-brand-400" />
              <span>Demo Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={cn(
                'flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all',
                paymentMethod === 'netbanking'
                  ? 'border-brand-600 bg-brand-50/70 text-brand-900 dark:border-brand-500 dark:bg-brand-950/60 dark:text-brand-200 font-semibold shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400',
              )}
            >
              <Building2 className="h-4 w-4 mb-1 text-brand-600 dark:text-brand-400" />
              <span>NetBanking</span>
            </button>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[11px] text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            <p>
              <strong>Direct Enrollment Active:</strong> No entrance screening test required. Confirm below to complete your enrollment directly.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="md" onClick={onClose}>
          Close & Exit
        </Button>

        <Button
          variant="primary"
          size="lg"
          loading={isProcessingPayment}
          rightIcon={CheckCircle2}
          onClick={handleConfirmDemoSeat}
          className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          Confirm Seat & Open Student Portal (Demo ₹{finalPayable})
        </Button>
      </div>
    </div>
  );
}

export default DomainAssessmentFlow;
