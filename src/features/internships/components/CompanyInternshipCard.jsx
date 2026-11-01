import {
  ArrowRight,
  BadgeCheck,
  Clock,
  FileText,
  Globe,
  HeartPulse,
  Landmark,
  Network,
  Phone,
  Server,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

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

export function CompanyInternshipCard({ partner, onSelect, onApply, className }) {
  const { internship } = partner;
  const DomainIcon = getDomainIcon(partner.domainCategory);

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card',
        'transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {/* Top accent gradient bar */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', partner.gradient)} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6">
        {/* Company Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm ring-2 ring-white/60 dark:ring-slate-800',
                partner.logoBg,
              )}
            >
              {partner.logoInitials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">{partner.name}</span>
                <span title="Verified Enterprise Partner">
                  <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </span>
              </div>
              <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                {partner.tagline}
              </p>
            </div>
          </div>

          {/* Domain Tag */}
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs',
              partner.badgeTint,
            )}
          >
            <DomainIcon className="h-3.5 w-3.5" />
            <span>{partner.domain}</span>
          </span>
        </div>

        {/* Role Title */}
        <div className="mt-5">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {internship.role}
          </h3>

          {/* Meta Info Bar: 100% Online Remote & Duration */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Online Remote
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {internship.duration}
            </span>
          </div>
        </div>

        {/* Tech Stack Chips Preview */}
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Technologies & Tools
          </p>
          <div className="flex flex-wrap gap-1.5">
            {internship.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Core Outcomes: Experience Letter, 1-on-1 Mentor, Placement Calls */}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-100 pt-3.5 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
            <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Experience Letter
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
            <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            1-on-1 Mentor
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1 font-medium text-purple-700 dark:text-purple-400">
            <Phone className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            Placement Calls
          </span>
        </div>
      </div>

      {/* Card Footer: Status & Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Online Remote Track
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(partner, 'details')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onApply(partner)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-700 active:scale-95"
          >
            <span>Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
