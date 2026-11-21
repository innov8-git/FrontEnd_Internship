import { Link } from 'react-router-dom';
import { Button, Card, SkeletonCard, Stepper } from '@/shared/components/ui';
import { ArrowRight, Rocket } from '@/shared/icons';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';

const JOURNEY_STEPS = [
  { label: 'Choose plan', description: 'Pick a domain and duration' },
  { label: 'Review pricing', description: 'Platform charges & discount' },
  { label: 'Payment', description: 'Secure checkout' },
  { label: 'Start learning', description: 'Schedule, SOPs and tasks' },
];

/**
 * Dashboard for a student who has not enrolled yet. Prompts them to explore
 * the catalog and choose an internship plan.
 */
export function NoEnrollmentState({ isLoading = false, className }) {
  if (isLoading) {
    return <SkeletonCard lines={4} className={className} />;
  }

  const title = 'Explore internships and enroll';
  const description =
    'Pick an internship from our catalog, choose your preferred domain and duration, and start learning with live tasks, guides, and mentorship.';

  return (
    <Card padding="none" className={cn('overflow-hidden', className)}>
      <div className="bg-gradient-to-br from-brand-50 via-white to-white p-6 sm:p-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:bg-slate-900">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 dark:border dark:border-brand-800/60"
          aria-hidden="true"
        >
          <Rocket className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button as={Link} to={ROUTES.CATALOG} rightIcon={ArrowRight}>
            Browse internships
          </Button>
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-6 sm:px-8 dark:border-slate-800">
        <h3 className="eyebrow mb-5 text-slate-500 dark:text-slate-400">How it works</h3>
        <Stepper
          steps={JOURNEY_STEPS}
          current={0}
          aria-label="Your path to an internship"
        />
      </div>
    </Card>
  );
}

export default NoEnrollmentState;
