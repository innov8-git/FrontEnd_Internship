import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Skeleton, SkeletonText } from '@/shared/components/ui';
import { ROUTES, buildPath } from '@/shared/constants';
import { ArrowRight, Building2 } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { useDomains } from '../hooks/useDomains';
import { getDomainVisual } from '../utils/designationVisuals';

function DomainSkeletonGrid() {
  return (
    <div role="status">
      <span className="sr-only">Loading domains…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <Skeleton className="h-10 w-10" rounded="lg" />
            <Skeleton className="mt-4 h-4 w-1/2" />
            <SkeletonText lines={2} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Home page band of published industry domains; each links to the filtered catalog. */
export function DomainStrip({ className }) {
  const { data: domains = [], isLoading, isError, error, refetch } = useDomains();

  let content;
  if (isLoading) {
    content = <DomainSkeletonGrid />;
  } else if (isError) {
    content = (
      <ErrorState compact error={error} title="We couldn't load domains" onRetry={refetch} />
    );
  } else if (domains.length === 0) {
    content = (
      <EmptyState
        compact
        icon={Building2}
        title="Domains are on their way"
        description="Industry domains appear here as soon as they're published."
      />
    );
  } else {
    content = (
      <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {domains.map((domain) => {
          const visual = getDomainVisual(domain.slug || domain.name);
          const Icon = visual.icon;
          return (
            <li
              key={domain._id}
              className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105',
                  visual.tint,
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                <Link
                  to={buildPath(ROUTES.CATALOG, {}, { domain: domain._id })}
                  className="rounded-sm outline-none transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-brand-600 focus-visible:after:ring-2 focus-visible:after:ring-brand-500 dark:group-hover:text-brand-400"
                >
                  {domain.name}
                </Link>
              </h3>
              {domain.description ? (
                <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {domain.description}
                </p>
              ) : null}
              <span
                className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700 transition group-hover:text-brand-800 dark:text-brand-400 dark:group-hover:text-brand-300"
                aria-hidden="true"
              >
                Explore track
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby="domains-heading"
      className={cn('bg-slate-50/70 py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-900/40', className)}
    >
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Enterprise Specializations</p>
          <h2
            id="domains-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Build Real Enterprise Systems
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Every internship is situated in a production domain — banking transaction limits, clinical
            records, or e-commerce pipelines — providing authentic portfolio code.
          </p>
        </div>
        <div className="mt-10">{content}</div>
      </div>
    </section>
  );
}

export default DomainStrip;
