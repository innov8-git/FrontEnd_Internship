import { Link } from 'react-router-dom';
import { Badge, Skeleton, SkeletonText } from '@/shared/components/ui';
import { paths } from '@/shared/constants';
import { ArrowRight, CalendarDays, CheckCircle2, Star, Zap } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { formatDuration, pluralize } from '@/shared/utils/helpers';
import { getDesignationVisual } from '../utils/designationVisuals';
import { PriceTag } from './PriceTag';

const MAX_DOMAIN_CHIPS = 3;

/**
 * Catalog card for one designation summary (from useInternships):
 * { designation, minPrice, currency, durations[], domains[] }.
 * Upgraded with badges, rating, modern elevation and full dark-mode styling.
 */
export function InternshipCard({ summary, headingAs: Heading = 'h3', className }) {
  const { designation, minPrice, currency, durations = [], domains = [] } = summary;
  const visual = getDesignationVisual(designation.slug || designation.name);
  const Icon = visual.icon;
  const extraDomains = Math.max(0, domains.length - MAX_DOMAIN_CHIPS);
  const hasPlans = durations.length > 0;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all duration-200',
        'hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <div className={cn('h-1.5 w-full bg-gradient-to-r', visual.gradient)} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Top Tag Bar */}
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Open Cohort
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/70 dark:text-amber-400">
              <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
              Up to 20% Off
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ring-2 ring-white/60 dark:ring-slate-800',
              visual.gradient,
            )}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 pt-0.5">
            <Heading className="text-base font-bold leading-snug text-slate-900 dark:text-white">
              <Link
                to={paths.designation(designation.slug)}
                className={cn(
                  'rounded-sm outline-none transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400',
                  'after:absolute after:inset-0 after:rounded-2xl',
                  'focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-brand-500',
                )}
              >
                {designation.name}
              </Link>
            </Heading>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {hasPlans
                ? `${pluralize(domains.length, 'industry track')} · ${pluralize(durations.length, 'duration')}`
                : 'Plans coming soon'}
            </p>
          </div>
        </div>

        {designation.description ? (
          <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {designation.description}
          </p>
        ) : null}

        {hasPlans ? (
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="sr-only">Durations</dt>
              <dd className="flex flex-wrap items-center gap-1.5">
                <CalendarDays className="mr-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                {durations.map((months) => (
                  <span
                    key={months}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {formatDuration(months)}
                  </span>
                ))}
              </dd>
            </div>
            {domains.length > 0 ? (
              <div>
                <dt className="sr-only">Domains</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {domains.slice(0, MAX_DOMAIN_CHIPS).map((domain) => (
                    <Badge key={domain._id} variant="brand">
                      {domain.name}
                    </Badge>
                  ))}
                  {extraDomains > 0 ? <Badge variant="neutral">+{extraDomains} more</Badge> : null}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {/* Feature Checkpoints */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            GitHub PR Reviews
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Verified Certificate
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <PriceTag amount={minPrice} currency={currency} prefix="From" size="md" />
            <span
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 transition group-hover:text-brand-800 dark:text-brand-400 dark:group-hover:text-brand-300"
              aria-hidden="true"
            >
              Enroll Track
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Placeholder with the same footprint as InternshipCard. */
export function InternshipCardSkeleton({ className }) {
  return (
    <div
      className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900', className)}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11" rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-4" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-5 w-20" rounded="full" />
      </div>
      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default InternshipCard;
