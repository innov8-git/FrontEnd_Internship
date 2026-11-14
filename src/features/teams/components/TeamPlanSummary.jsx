import { Briefcase } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { planDetailsLabel } from '../utils/teamUtils';

/**
 * Designation · domain · duration summary for team plan.
 * `action` (node) renders on the right, e.g. a "Change plan" button.
 */
export function TeamPlanSummary({ plan, label = 'Internship plan', action, className }) {
  if (!plan) return null;
  const designation = plan.designation?.name ?? 'Internship';
  const details = planDetailsLabel(plan);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-brand-100 bg-brand-50/60 p-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-inset ring-brand-100"
          aria-hidden="true"
        >
          <Briefcase className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <p className="mt-0.5 break-words font-semibold text-slate-900">{designation}</p>
          {details ? <p className="text-sm text-slate-600">{details}</p> : null}
        </div>
      </div>

      {action ? (
        <div className="flex items-center justify-end">
          <div className="shrink-0">{action}</div>
        </div>
      ) : null}
    </div>
  );
}

export default TeamPlanSummary;
