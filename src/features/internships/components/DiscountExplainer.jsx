import { ASSESSMENT_MAX_SCORE, DEFAULT_DISCOUNT_SLABS, TEAM_MAX_MEMBERS } from '@/shared/constants';
import { CheckCircle2, Percent, ShieldCheck, Users } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { MAX_EXAMPLE_DISCOUNT_PERCENT } from '../utils/catalogFormat';

const EXAMPLE_CAPTION = 'Example slabs — your exact discount is confirmed after the assessment.';

const SORTED_SLABS = [...DEFAULT_DISCOUNT_SLABS].sort((a, b) => b.minScore - a.minScore);

function formatScoreRange({ minScore, maxScore }) {
  return minScore === maxScore ? `${minScore}` : `${minScore}–${maxScore}`;
}

/** Illustrative slab table. The bars are decorative; the percentages are printed in text. */
function SlabTable({ className }) {
  const scale = MAX_EXAMPLE_DISCOUNT_PERCENT || 1;
  return (
    <table className={cn('w-full text-sm', className)}>
      <caption className="caption-bottom pt-3 text-left text-xs text-slate-500 dark:text-slate-400">
        {EXAMPLE_CAPTION}
      </caption>
      <thead>
        <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <th scope="col" className="py-2.5 pr-3 font-semibold">
            Score (out of {ASSESSMENT_MAX_SCORE})
          </th>
          <th scope="col" className="py-2.5 text-right font-semibold">
            Individual discount
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {SORTED_SLABS.map((slab) => (
          <tr key={`${slab.minScore}-${slab.maxScore}`}>
            <th scope="row" className="tabular py-3 pr-3 text-left font-medium text-slate-900 dark:text-white">
              {formatScoreRange(slab)} pts
            </th>
            <td className="py-3">
              <div className="flex items-center justify-end gap-3">
                <span
                  className="hidden h-2.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:block"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full rounded-full bg-amber-500"
                    style={{ width: `${(Number(slab.discountPercent) / scale) * 100}%` }}
                  />
                </span>
                <span className="tabular w-12 text-right font-bold text-slate-900 dark:text-white">
                  {slab.discountPercent}%
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const POINTS = [
  {
    icon: CheckCircle2,
    title: 'No Pass or Fail Pressure',
    text: `Every candidate from score 0 to ${ASSESSMENT_MAX_SCORE} can continue straight into enrollment.`,
  },
  {
    icon: Users,
    title: 'Individual & Team Flexibility',
    text: `Take it individually for maximum merit discount, or enroll as a cohort team of up to ${TEAM_MAX_MEMBERS}.`,
  },
  {
    icon: ShieldCheck,
    title: 'Server-Verified & Locked',
    text: 'Your discount is cryptographically calculated and locked into your invoice quote.',
  },
];

/**
 * Merit-discount explainer (SN5). `variant="section"` is the full-width home page band,
 * `variant="compact"` a card for side columns. Never mentions pass marks.
 */
export function DiscountExplainer({ variant = 'section', headingAs: Heading = 'h2', className }) {
  if (variant === 'compact') {
    return (
      <div
        className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900', className)}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-400"
            aria-hidden="true"
          >
            <Percent className="h-4 w-4" />
          </span>
          <Heading className="text-base font-bold text-slate-900 dark:text-white">Merit discount</Heading>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Your assessment score decides your individual discount. Teams pay the full plan price.
        </p>
        <SlabTable className="mt-3" />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="merit-discount-heading"
      className={cn('bg-white py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-950', className)}
    >
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Merit-First Education</p>
          <Heading
            id="merit-discount-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Score Higher, Pay Less
          </Heading>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Our assessment isn&apos;t a barrier — it&apos;s your opportunity to earn merit recognition.
            The better you perform, the higher your tuition grant
            {MAX_EXAMPLE_DISCOUNT_PERCENT > 0 ? `, up to ${MAX_EXAMPLE_DISCOUNT_PERCENT}% off` : ''}.
          </p>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/70 dark:text-brand-400"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/70 dark:text-brand-400"
              aria-hidden="true"
            >
              <Percent className="h-4 w-4" />
            </span>
            <p className="text-base font-bold text-slate-900 dark:text-white">Example Merit Slabs</p>
          </div>
          <SlabTable className="mt-5" />
        </div>
      </div>
    </section>
  );
}

export default DiscountExplainer;
