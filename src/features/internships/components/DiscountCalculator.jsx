import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ASSESSMENT_MAX_SCORE, ROUTES } from '@/shared/constants';
import { ArrowRight, CheckCircle2, Sparkles, Zap } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const BASE_EXAMPLE_PRICE = 4999;

function getDiscountPercent(score) {
  if (score >= 11) return 20;
  if (score >= 6) return 10;
  return 0;
}

/**
 * Interactive merit discount simulator.
 */
export function DiscountCalculator({ className }) {
  const [score, setScore] = useState(13);

  const discountPercent = getDiscountPercent(score);
  const savings = Math.round((BASE_EXAMPLE_PRICE * discountPercent) / 100);
  const finalPrice = BASE_EXAMPLE_PRICE - savings;

  return (
    <section
      aria-labelledby="calculator-heading"
      className={cn(
        'relative overflow-hidden bg-slate-50/70 py-16 sm:py-24 transition-colors duration-200 dark:bg-slate-900/40',
        className,
      )}
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Interactive Simulator</span>
          </div>
          <h2
            id="calculator-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            Calculate Your Merit Tuition Discount
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Your score in our 15-question foundational challenge determines your tuition fee. No
            stress, no pass mark — just fair merit rewards.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
            {/* Left: Interactive Score Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="score-slider"
                  className="text-sm font-bold text-slate-900 dark:text-white"
                >
                  Simulate Assessment Score
                </label>
                <span className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-sm font-black text-brand-700 dark:text-amber-300">
                  {score} / {ASSESSMENT_MAX_SCORE} pts
                </span>
              </div>

              <input
                id="score-slider"
                type="range"
                min="0"
                max={ASSESSMENT_MAX_SCORE}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand-600 dark:bg-slate-700"
              />

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">
                <span>0 pts (0% off)</span>
                <span>6 pts (10% off)</span>
                <span>11–15 pts (20% off)</span>
              </div>

              <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>15 multiple-choice questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No timer — solve at your own pace</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No pass/fail — everyone can enroll</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Price Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-6 dark:border-amber-500/30">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Your Unlocked Discount
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-3 w-3 fill-emerald-500" />
                    {discountPercent}% OFF
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-base font-semibold text-slate-400 line-through">
                      ₹{BASE_EXAMPLE_PRICE.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {discountPercent > 0
                    ? `You save ₹${savings.toLocaleString('en-IN')} based on your score!`
                    : 'Standard enrollment price for foundational learners.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <Button
                  as={Link}
                  to={ROUTES.CATALOG}
                  size="md"
                  rightIcon={ArrowRight}
                  className="w-full justify-center shadow-md"
                >
                  Browse Tracks &amp; Start
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscountCalculator;

