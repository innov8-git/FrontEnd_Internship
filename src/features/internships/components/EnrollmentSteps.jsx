import { cn } from '@/shared/utils/cn';

const STEPS = [
  {
    title: 'Choose your plan',
    description: 'Pick your industry domain and internship duration.',
  },
  {
    title: 'Review charges & discount',
    description: 'See the platform charges, direct discount, and final student price.',
  },
  {
    title: 'Accept terms and pay',
    description: 'Review the enrollment terms and complete checkout securely.',
  },
  {
    title: 'Start day 1',
    description: 'Your schedule, daily guides and tasks unlock as soon as payment is confirmed.',
  },
];

/** Side card on the designation page: the four steps from browsing to day 1. */
export function EnrollmentSteps({ headingAs: Heading = 'h2', className }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900', className)}>
      <Heading className="text-base font-semibold text-slate-900 dark:text-slate-100">How enrollment works</Heading>
      <ol className="mt-4 space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20 dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-500/30"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.title}</p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default EnrollmentSteps;
