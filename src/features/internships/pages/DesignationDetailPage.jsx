import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
  SkeletonCard,
  SkeletonText,
} from '@/shared/components/ui';
import { useDocumentTitle } from '@/shared/hooks';
import { ASSESSMENT_QUESTION_COUNT, ROUTES } from '@/shared/constants';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CalendarDays,
  IndianRupee,
  ListChecks,
  Search,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { getErrorStatus } from '@/shared/utils/errors';
import { formatMoney } from '@/shared/utils/helpers';
import { EnrollmentSteps } from '../components/EnrollmentSteps';
import { DomainSelectionModal } from '../components/DomainSelectionModal';
import { PlanList } from '../components/PlanList';
import { SchedulePreviewModal } from '../components/SchedulePreviewModal';
import { JoinTeamButton, StartAssessmentButton } from '../components/StartAssessmentButton';
import { useDesignation } from '../hooks/useDesignation';
import { useDomains } from '../hooks/useDomains';
import { usePlans } from '../hooks/usePlans';
import { formatDurationOptions, formatList } from '../utils/catalogFormat';
import { getDesignationVisual } from '../utils/designationVisuals';

const HERO_MASK =
  '[mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]';

function breadcrumbsFor(name) {
  return [
    { label: 'Home', to: ROUTES.HOME },
    { label: 'Internships', to: ROUTES.CATALOG },
    { label: name },
  ];
}

/** Lowest server price, unique durations and domain names of the published plans. */
function summarisePlans(plans) {
  const prices = plans.map((plan) => Number(plan.basePrice)).filter((price) => Number.isFinite(price));
  const durations = [...new Set(plans.map((plan) => Number(plan.durationMonths)))].sort(
    (a, b) => a - b,
  );
  const domainNames = [
    ...new Set(plans.map((plan) => plan.domain?.name).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  return {
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    currency: plans[0]?.currency,
    durations,
    domainNames,
  };
}

function DetailSkeleton() {
  return (
    <div role="status" className="container-page space-y-6 py-10">
      <span className="sr-only">Loading internship…</span>
      <div className="space-y-3" aria-hidden="true">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <SkeletonText lines={3} className="max-w-3xl" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-40" rounded="lg" />
          <Skeleton className="h-11 w-48" rounded="lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20" rounded="lg" />
        ))}
      </div>
      <SkeletonCard lines={4} />
    </div>
  );
}

function FactsList({ facts }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/** Designation detail (SN5): description, plans by domain, schedule previews and the CTAs. */
export function DesignationDetailPage() {
  const { slug } = useParams();
  const designationQuery = useDesignation(slug);
  const designation = designationQuery.data;
  const designationId = designation?._id;

  const plansQuery = usePlans({ designationId }, { enabled: Boolean(designationId) });
  const domainsQuery = useDomains({ enabled: Boolean(designationId) });
  const [preview, setPreview] = useState({ open: false, plan: null });
  const [domainModalOpen, setDomainModalOpen] = useState(false);

  const isNotFound = designationQuery.isError && getErrorStatus(designationQuery.error) === 404;
  let documentTitle = 'Internship';
  if (designation?.name) documentTitle = designation.name;
  else if (isNotFound) documentTitle = 'Internship not found';
  useDocumentTitle(documentTitle);

  const plans = useMemo(() => plansQuery.data ?? [], [plansQuery.data]);
  const summary = useMemo(() => summarisePlans(plans), [plans]);
  const domainsById = useMemo(
    () => new Map((domainsQuery.data ?? []).map((domain) => [domain._id, domain])),
    [domainsQuery.data],
  );

  const availableDomains = useMemo(() => {
    const all = domainsQuery.data ?? [];
    const planDomainIds = new Set(plans.map((p) => p.domainId).filter(Boolean));
    if (planDomainIds.size > 0) {
      const filtered = all.filter((d) => planDomainIds.has(d._id));
      if (filtered.length > 0) return filtered;
    }
    return all.filter((d) => d.status === 'PUBLISHED');
  }, [domainsQuery.data, plans]);

  const openPreview = useCallback((plan) => setPreview({ open: true, plan }), []);
  const closePreview = useCallback(() => setPreview((current) => ({ ...current, open: false })), []);

  if (designationQuery.isLoading) return <DetailSkeleton />;

  if (designationQuery.isError) {
    return (
      <div className="container-page space-y-6 py-10">
        <PageHeader
          breadcrumbs={breadcrumbsFor(isNotFound ? 'Not found' : 'Internship')}
          title={isNotFound ? 'Internship not found' : 'Internship'}
        />
        {isNotFound ? (
          <EmptyState
            icon={Search}
            titleAs="h2"
            title="This internship isn't available"
            description="It may have been renamed or is no longer open for enrollment. Browse the catalog to find a similar role."
            action={
              <Button as={Link} to={ROUTES.CATALOG} leftIcon={ArrowLeft}>
                Browse internships
              </Button>
            }
          />
        ) : (
          <ErrorState
            error={designationQuery.error}
            title="We couldn't load this internship"
            onRetry={designationQuery.refetch}
          />
        )}
      </div>
    );
  }

  if (!designation) return <DetailSkeleton />;

  const visual = getDesignationVisual(designation.slug || designation.name);
  const VisualIcon = visual.icon;
  const plansPending = plansQuery.isLoading;
  const placeholder = plansPending ? '…' : '—';

  const facts = [
    {
      icon: IndianRupee,
      label: 'Starting price',
      value:
        summary.minPrice !== null ? `From ${formatMoney(summary.minPrice, summary.currency)}` : placeholder,
    },
    {
      icon: CalendarDays,
      label: 'Durations',
      value: formatDurationOptions(summary.durations) || placeholder,
    },
    {
      icon: Building2,
      label: 'Domains',
      value: formatList(summary.domainNames, 'and') || placeholder,
    },
    {
      icon: ListChecks,
      label: 'Assessment',
      value: `${ASSESSMENT_QUESTION_COUNT} questions · one attempt`,
    },
  ];

  let plansContent;
  if (plansPending) {
    plansContent = (
      <div role="status" className="space-y-4">
        <span className="sr-only">Loading plans…</span>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
    );
  } else if (plansQuery.isError) {
    plansContent = (
      <ErrorState
        error={plansQuery.error}
        title="We couldn't load the plans"
        onRetry={plansQuery.refetch}
      />
    );
  } else if (plans.length === 0) {
    plansContent = (
      <EmptyState
        icon={CalendarClock}
        title="Plans are coming soon"
        description="Pricing for this internship hasn't been published yet. You can still take the assessment now and choose a plan later."
        action={
          <Button as={Link} to={ROUTES.CATALOG} variant="outline">
            Browse other internships
          </Button>
        }
      />
    );
  } else {
    plansContent = <PlanList plans={plans} onPreview={openPreview} domainsById={domainsById} />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50/80 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div
          className={cn('bg-grid pointer-events-none absolute inset-0 -z-10', HERO_MASK)}
          aria-hidden="true"
        />
        <div className="container-page py-8 sm:py-12">
          <div className="flex items-start gap-8">
            <div className="min-w-0 flex-1">
              <PageHeader
                breadcrumbs={breadcrumbsFor(designation.name)}
                eyebrow="Internship"
                title={designation.name}
                description={
                  designation.description ? (
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {designation.description}
                    </p>
                  ) : null
                }
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <StartAssessmentButton
                  designationId={designation._id}
                  onStartAssessment={() => setDomainModalOpen(true)}
                />
                <JoinTeamButton
                  designationId={designation._id}
                  variant="outline"
                  size="lg"
                  className="h-11 border-slate-300 bg-white/90 font-medium text-slate-800 hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 shadow-xs dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-brand-400"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50/80 to-sky-50/60 px-3.5 py-2.5 text-xs text-brand-950 dark:border-brand-900/60 dark:from-brand-950/40 dark:to-slate-900/40 dark:text-brand-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs">
                  <Users className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="font-semibold text-brand-900 dark:text-brand-100">Enrolling with friends or classmates?</span>
                <span className="text-brand-700 dark:text-brand-300">Form a team of up to 4 to collaborate on a shared schedule, tasks, and GitHub repository.</span>
              </div>
            </div>
            <span
              className={cn(
                'hidden h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-elevated md:flex',
                visual.gradient,
              )}
              aria-hidden="true"
            >
              <VisualIcon className="h-11 w-11" />
            </span>
          </div>

          <div className="mt-8">
            <FactsList facts={facts} />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-labelledby="plans-heading" className="min-w-0 space-y-4">
          <div>
            <h2 id="plans-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Plans and pricing
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              These are base prices. Individuals can lower theirs with a merit discount from the
              assessment; teams pay the base price. You choose your plan after the assessment.
            </p>
          </div>
          {plansContent}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Enrollment information">
          <EnrollmentSteps headingAs="h2" />
        </aside>
      </div>

      <SchedulePreviewModal open={preview.open} plan={preview.plan} onClose={closePreview} />

      <DomainSelectionModal
        open={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
        designation={designation}
        availableDomains={availableDomains}
      />
    </div>
  );
}

export default DesignationDetailPage;
