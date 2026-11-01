import { BadgeCheck, Code2, GitPullRequest, Percent, ShieldCheck, Zap } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const HIGHLIGHTS = [
  {
    icon: GitPullRequest,
    title: 'Real GitHub Repositories & PRs',
    badge: 'Real Workflow',
    description:
      'No browser sandboxes or multiple-choice simulations. You clone repos, branch, commit code, and submit Pull Requests on GitHub just like a software engineering team.',
  },
  {
    icon: Percent,
    title: 'Merit-Based Tuition Discount',
    badge: 'Fair & Merit-Driven',
    description:
      'Prove your baseline skills in a 15-question challenge with no timer pressure. Your score instantly unlocks an individual discount of up to 20% off your enrollment.',
  },
  {
    icon: Code2,
    title: 'Line-by-Line Senior Code Reviews',
    badge: 'Human Mentorship',
    description:
      'Experienced trainers inspect your pull requests, point out code smells, verify test coverage, and approve your tasks before you advance to the next day.',
  },
  {
    icon: ShieldCheck,
    title: 'Tamper-Proof Verifiable Credentials',
    badge: 'Employer Verified',
    description:
      'Every completion certificate has a cryptographic ID and public verification link. Employers and recruiters can verify your achievement in one click.',
  },
];

/**
 * Bento-style feature showcase explaining why ALFRE stands out.
 */
export function WhyAlfre({ className }) {
  return (
    <section
      aria-labelledby="why-alfre-heading"
      className={cn(
        'relative bg-slate-50/70 py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-900/40',
        className,
      )}
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>Built For Real Careers</span>
          </div>
          <h2
            id="why-alfre-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Why ALFRE is Different from Generic Courses
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Traditional tutorials teach syntax. ALFRE builds engineering muscle through real daily
            SOPs, pull requests, and senior trainer feedback.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, badge, description }) => (
            <div
              key={title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-500/20 dark:text-amber-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <BadgeCheck className="h-4 w-4" />
                <span>Industry Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyAlfre;
