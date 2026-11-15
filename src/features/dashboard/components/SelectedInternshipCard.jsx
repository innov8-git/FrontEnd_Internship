import { Link } from 'react-router-dom';
import { Badge, Button } from '@/shared/components/ui';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  ListChecks,
  Percent,
} from '@/shared/icons';
import { ROUTES } from '@/shared/constants';

export function SelectedInternshipCard({ selection, className = '' }) {
  if (!selection) return null;

  const {
    partner = {},
    role = {},
    domain = 'Banking',
    score = 15,
    total = 15,
    concessionPercent = 20,
    finalAmount = 1599,
    candidate = {},
  } = selection;

  return (
    <div
      className={`rounded-2xl border border-brand-200/90 bg-gradient-to-br from-white via-brand-50/20 to-indigo-50/30 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:bg-slate-900 ${className}`}
    >
      {/* Header with verified badge and role selection status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold text-base shadow-md ${
              partner.logoBg || 'bg-brand-600'
            }`}
          >
            {partner.logoInitials || partner.name?.substring(0, 2)?.toUpperCase() || 'IS'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white sm:text-lg">
                {partner.name || 'Industry Partner'}
              </span>
              <Badge variant="success" className="inline-flex items-center gap-1 text-[11px] py-0 px-2">
                <BadgeCheck className="h-3 w-3" />
                Selected Candidate
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {role.designation || 'Trainee Software Engineer'} · <span className="font-semibold text-brand-600 dark:text-brand-400">{domain} Industry Track</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Seat Confirmed
          </span>
          {concessionPercent > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-950/70 dark:text-brand-300 dark:border dark:border-brand-800/60">
              <Percent className="h-3.5 w-3.5" />
              {concessionPercent}% Fee Concession Applied
            </span>
          )}
        </div>
      </div>

      {/* Grid of evaluation and selection details */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Selected Domain:</span>
          <p className="mt-0.5 font-bold text-brand-700 dark:text-brand-300 text-sm">
            {domain}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Track Specific</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Assessment Score:</span>
          <p className="mt-0.5 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            {score} / {total} ({Math.round((score / total) * 100)}%)
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Qualifying Score</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Tuition & Charges:</span>
          <p className="mt-0.5 font-bold text-slate-900 dark:text-white text-sm">
            Internship Tuition: Free
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Platform Access: ₹{finalAmount}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-slate-500 dark:text-slate-400">Candidate:</span>
          <p className="mt-0.5 font-bold text-slate-900 dark:text-white truncate">
            {candidate.fullName || 'Registered Student'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
            {candidate.email || 'Email Verified'}
          </span>
        </div>
      </div>

      {/* Admin Project Task Assignment Status Banner */}
      <div className="mt-4 rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <Clock className="h-4 w-4 animate-spin" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                Next Step: Admin Project Task Assignment in Progress
              </span>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                Awaiting Admin
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-amber-800 dark:text-amber-300">
              Congratulations on clearing the technical assessment for <strong>{partner.name}</strong> ({domain} Domain)! Your seat is reserved. The platform administrator is currently provisioning your industry project tasks and schedule milestones. Once the admin assigns the project tasks, your daily deliverables, repo workspace, and review board will automatically activate below.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper overview */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> 1. Assessment Done
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> 2. Seat Confirmed
          </span>
          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <Clock className="h-3.5 w-3.5" /> 3. Task Assignment (Pending Admin)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to={ROUTES.TASKS}
            variant="outline"
            size="sm"
            leftIcon={ListChecks}
            className="text-xs h-8"
          >
            Check Task Board
          </Button>
          <Button
            as={Link}
            to={ROUTES.CATALOG}
            variant="ghost"
            size="sm"
            className="text-xs h-8"
          >
            Explore Catalog
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectedInternshipCard;
