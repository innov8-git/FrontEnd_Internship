import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, toast } from '@/shared/components/ui';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileText,
  Percent,
  Sparkles,
  Users,
} from '@/shared/icons';
import { ROUTES, paths } from '@/shared/constants';
import { AuthContext } from '@/shared/context/AuthContext';
import { getPlans } from '@/services/internshipService';
import { updateMe } from '@/services/authService';

const BASE_PLATFORM_FEE = 1999;
const DIRECT_DISCOUNT_PERCENT = 15;

function parseDurationMonths(value) {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : null;
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function textMatches(a, b) {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  return na.includes(nb) || nb.includes(na);
}

/**
 * Finds the closest published backend InternshipPlan matching the partner role, domain, and duration
 * so the student enters the real `/enroll` -> `/quotes` -> `/enrollments` -> `/payment` flow.
 */
function findMatchingPlan(plans, { domain, role, duration }) {
  if (!Array.isArray(plans) || plans.length === 0) return null;
  const durationMonths = parseDurationMonths(duration);
  const roleLabel = role?.designation || role?.role || '';

  const scorePlan = (plan) => {
    let score = 0;
    if (textMatches(plan.domain?.name, domain) || textMatches(plan.domain?.slug, domain)) score += 4;
    if (textMatches(plan.designation?.name, roleLabel) || textMatches(plan.designation?.slug, roleLabel)) score += 3;
    if (durationMonths && Number(plan.durationMonths) === durationMonths) score += 2;
    return score;
  };

  let best = null;
  let bestScore = 0;
  for (const plan of plans) {
    const s = scorePlan(plan);
    if (s > bestScore) {
      best = plan;
      bestScore = s;
    }
  }
  return bestScore > 0 ? best : plans[0];
}

export function DomainAssessmentFlow({
  candidate = {},
  domain = 'Banking',
  partner = {},
  role = {},
  onClose,
}) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isContinuing, setIsContinuing] = useState(false);

  const discountAmount = Math.round((BASE_PLATFORM_FEE * DIRECT_DISCOUNT_PERCENT) / 100);
  const finalPayable = BASE_PLATFORM_FEE - discountAmount;

  /**
   * Connects the partner application modal into the real frontend enrollment flow:
   *  1. If unauthenticated, redirect to /login with a return target to /internships.
   *  2. Persist the student's submitted profile fields (phone, college, graduationYear) via PATCH /auth/me.
   *  3. Resolve the matching published backend InternshipPlan via GET /internship-plans.
   *  4. Navigate to /enroll?planId=...&designationId=... (or /internships if no published plans exist).
   */
  const handleContinueToEnrollment = async () => {
    if (isContinuing) return;

    if (auth && !auth.isAuthenticated) {
      if (onClose) onClose();
      navigate(paths.login(ROUTES.CATALOG));
      return;
    }

    setIsContinuing(true);
    try {
      // Save applicant profile details on the real user record (best-effort)
      if (auth?.isAuthenticated) {
        const profilePatch = {};
        if (candidate.phone?.trim()) profilePatch.phone = candidate.phone.trim();
        if (candidate.college?.trim()) profilePatch.college = candidate.college.trim();
        if (/^\d{4}$/.test(String(candidate.graduationYear ?? '').trim())) {
          profilePatch.graduationYear = String(candidate.graduationYear).trim();
        }
        if (Object.keys(profilePatch).length > 0) {
          try {
            const updated = await updateMe(profilePatch);
            if (updated && auth.updateUser) auth.updateUser(updated);
          } catch {
            // Non-blocking: still let the student proceed to enrollment
          }
        }
      }

      // Resolve a published plan from the live catalog API
      let targetUrl = ROUTES.CATALOG;
      try {
        const res = await getPlans({ limit: 100 });
        const plans = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];
        const matched = findMatchingPlan(plans, {
          domain,
          role,
          duration: candidate.duration,
        });
        if (matched?._id) {
          targetUrl = paths.enroll({
            planId: matched._id,
            designationId: matched.designationId || matched.designation?._id,
          });
        }
      } catch {
        toast.info('Choose your plan from the catalog to finish enrolling.');
      }

      if (onClose) onClose();
      navigate(targetUrl);
    } finally {
      setIsContinuing(false);
    }
  };

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

      {/* Pricing Summary & Next Steps */}
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
            <span>Estimated Net Platform Fee:</span>
            <span className="text-base text-brand-600 dark:text-brand-400">₹{finalPayable}</span>
          </div>
        </div>

        {/* Next Steps in Enrollment Flow */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              Next Steps to Confirm Your Seat
            </h4>
            <ol className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>Review your matched internship plan and server-verified quote.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>Accept the latest internship Terms &amp; Conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>Complete checkout to activate your schedule and task board.</span>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[11px] text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            <p>
              <strong>Live Enrollment Flow:</strong> Continue to confirm your plan, lock your quote, and complete payment on the portal.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="md" onClick={onClose} disabled={isContinuing}>
          Close & Exit
        </Button>

        <Button
          variant="primary"
          size="lg"
          loading={isContinuing}
          rightIcon={ArrowRight}
          onClick={handleContinueToEnrollment}
          className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          Continue to Plan & Enrollment
        </Button>
      </div>
    </div>
  );
}

export default DomainAssessmentFlow;
