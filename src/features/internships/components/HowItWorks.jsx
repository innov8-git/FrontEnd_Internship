import { ASSESSMENT_QUESTION_COUNT } from '@/shared/constants';
import { Award, CreditCard, GitPullRequest, ListChecks, Percent, UserPlus } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { MAX_EXAMPLE_DISCOUNT_PERCENT } from '../utils/catalogFormat';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Register Free Account',
    description: 'Create your developer profile and choose your preferred tech track and domain.',
  },
  {
    icon: ListChecks,
    title: `Take the ${ASSESSMENT_QUESTION_COUNT}-Question Assessment`,
    description: 'One attempt, no timer and no pass or fail — showcase your foundational skills.',
  },
  {
    icon: Percent,
    title: 'Unlock Your Merit Discount',
    description:
      MAX_EXAMPLE_DISCOUNT_PERCENT > 0
        ? `Your score instantly decides your individual tuition discount — up to ${MAX_EXAMPLE_DISCOUNT_PERCENT}% off.`
        : 'Your assessment score decides your individual tuition discount.',
  },
  {
    icon: CreditCard,
    title: 'Confirm Plan & Access SOPs',
    description: 'Select your duration (1–6 months), review the terms and complete secure enrollment.',
  },
  {
    icon: GitPullRequest,
    title: 'Build & Ship Tasks via GitHub',
    description: 'Follow structured daily SOPs, commit code, create PRs, and get code reviews from senior engineers.',
  },
  {
    icon: Award,
    title: 'Graduate with Verifiable Certificate',
    description: 'Receive an authenticated completion certificate with an instant QR code and public verification link.',
  },
];

/** "How it works" band of the home page (anchor: #how-it-works). */
export function HowItWorks({ className }) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn(
        'scroll-mt-20 bg-slate-50/70 py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-900/40',
        className,
      )}
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Interactive Process</p>
          <h2
            id="how-it-works-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            From Assessment to Verifiable Certificate
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            A transparent, self-paced, and merit-driven engineering program designed to replicate
            real team environments.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-sm transition-colors group-hover:bg-brand-100 dark:bg-brand-950/70 dark:text-brand-400"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Step 0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;
