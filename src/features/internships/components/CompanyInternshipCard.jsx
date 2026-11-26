import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Code2,
  Globe,
  HeartPulse,
  Landmark,
  Network,
  Server,
  Smartphone,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { PartnerLogo } from './PartnerLogo';

function getDomainIcon(category) {
  switch (category) {
    case 'banking':
      return Landmark;
    case 'telecom':
      return Network;
    case 'healthcare':
      return HeartPulse;
    case 'enterprise':
    default:
      return Server;
  }
}

/**
 * CompanyInternshipCard
 * Minimal, scannable, visually polished internship card for the home and catalog grids.
 * Full syllabus, responsibilities, and perks live inside InternshipDetailsModal.
 */
export function CompanyInternshipCard({
  partner,
  role,
  onSelect,
  onApply,
  className,
}) {
  const currentRole = role || partner?.role || partner?.internship || partner?.roles?.[0];
  const isWeb = currentRole?.track === 'web';
  const TrackIcon = isWeb ? Code2 : Smartphone;
  const DomainIcon = getDomainIcon(partner.domainCategory);
  const trackLabel = currentRole?.trackLabel || (isWeb ? 'Web Development' : 'App Development');

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card',
        'transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/70 hover:shadow-xl',
        'dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700/60',
        className,
      )}
    >
      {/* Top accent gradient bar */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', partner.gradient)} aria-hidden="true" />

      {/* Subtle ambient glow in the top-right corner */}
      <div
        className={cn(
          'pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]',
          partner.gradient,
        )}
        aria-hidden="true"
      />

      <div className="relative flex flex-1 flex-col p-6">
        {/* Header: Company Identity + Single Track Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <PartnerLogo
              partner={partner}
              size="lg"
              className="rounded-2xl shadow-md ring-2 ring-white/80 dark:ring-slate-800"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-bold text-slate-900 dark:text-white">
                  {partner.name}
                </span>
                <span title="Verified Enterprise Partner" className="shrink-0">
                  <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
              </div>
              {partner.domain && (
                <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <DomainIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{partner.domain}</span>
                </div>
              )}
            </div>
          </div>

          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs',
              isWeb
                ? 'border-blue-200/80 bg-blue-50/90 text-blue-700 dark:border-blue-800/80 dark:bg-blue-950/60 dark:text-blue-300'
                : 'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300',
            )}
          >
            <TrackIcon className="h-3.5 w-3.5" />
            <span>{trackLabel}</span>
          </span>
        </div>

        {/* Centerpiece: Bold Role Title & Assigned Domains */}
        <div className="mt-5">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {currentRole?.role || 'Trainee Software Engineer'}
          </h3>

          {partner.assignedDomains?.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {partner.assignedDomains.map((domainName) => (
                <span
                  key={domainName}
                  className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300"
                >
                  {domainName}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Key Logistics: Remote & Duration */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50/90 px-2.5 py-1.5 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Online Remote
          </span>
          {currentRole?.duration && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/90 px-2.5 py-1.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {currentRole.duration}
            </span>
          )}
        </div>
      </div>

      {/* Clean Symmetrical Action Footer */}
      <div className="relative grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
        <button
          type="button"
          onClick={() => onSelect(partner, 'details', currentRole)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onApply(partner, currentRole)}
          className="group/btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
        >
          <span>Apply</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}
