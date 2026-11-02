import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Gauge,
  Percent,
  Sparkles,
  Zap,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

// eslint-disable-next-line react-refresh/only-export-components
export const PERCENTAGE_SLABS = [
  {
    range: '100%',
    minScore: 100,
    maxScore: 100,
    discountPercent: 20,
    tier: 'Top Merit Scholarship',
    badge: 'Max 20% Off',
    gradient: 'from-emerald-500 to-teal-500',
    barColor: 'bg-emerald-500',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    desc: 'Perfect score in track assessment',
  },
  {
    range: '90% – 99%',
    minScore: 90,
    maxScore: 99,
    discountPercent: 10,
    tier: 'High Achiever Discount',
    badge: '10% Off',
    gradient: 'from-amber-500 to-brand-500',
    barColor: 'bg-amber-500',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    desc: 'Strong technical aptitude',
  },
  {
    range: '80% – 89%',
    minScore: 80,
    maxScore: 89,
    discountPercent: 5,
    tier: 'Merit Incentive',
    badge: '5% Off',
    gradient: 'from-blue-500 to-sky-500',
    barColor: 'bg-blue-500',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    desc: 'Solid foundation score',
  },
];

function getDiscountForScore(score) {
  if (score >= 100) return { percent: 20, label: '20% Discount (Top Merit)', tier: '100% Score' };
  if (score >= 90) return { percent: 10, label: '10% Discount (High Achiever)', tier: '90% – 99% Score' };
  return { percent: 5, label: '5% Discount (Merit Incentive)', tier: '80% – 89% Score' };
}

/**
 * Merit-discount explainer section displaying percentage-based discount tiers:
 * - 100% in assessment -> 20% discount
 * - 90-99% in assessment -> 10% discount
 * - 80-89% in assessment -> 5% discount
 * - Below 80% -> standard
 */
export function DiscountExplainer({ variant = 'section', headingAs: Heading = 'h2', className }) {
  const [simulatedScore, setSimulatedScore] = useState(95);
  const activeDiscount = getDiscountForScore(simulatedScore);

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900',
          className,
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
            aria-hidden="true"
          >
            <Percent className="h-4 w-4" />
          </span>
          <div>
            <Heading className="text-base font-bold text-slate-900 dark:text-white">
              Merit Discount Slabs
            </Heading>
            <p className="text-xs text-slate-500 dark:text-slate-400">Earn up to 20% based on score</p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          We provide discounts based on your assessment percentage score:
        </p>

        {/* Compact Slabs List */}
        <div className="mt-4 space-y-2.5">
          {PERCENTAGE_SLABS.map((slab) => (
            <div
              key={slab.range}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs dark:border-slate-800/80 dark:bg-slate-800/50"
            >
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">{slab.range}</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">{slab.desc}</span>
              </div>
              <span
                className={cn(
                  'rounded-lg border px-2 py-0.5 text-xs font-bold',
                  slab.badgeStyle,
                )}
              >
                {slab.discountPercent > 0 ? `${slab.discountPercent}% Off` : 'Standard'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="merit-discount-heading"
      className={cn('bg-white py-16 sm:py-24 dark:bg-slate-950', className)}
    >
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading and Value Pillars */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-semibold text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Assessment Merit Scholarship</span>
            </div>

            <Heading
              id="merit-discount-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
            >
              Score higher in assessment, earn up to 20% discount
            </Heading>

            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              We reward real technical competence. When you take the diagnostic skills assessment,
              your score percentage directly unlocks your program discount:
            </p>

            {/* 3 Core Principles */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    100% Score = 20% Maximum Discount
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Achieve full marks on your track evaluation to unlock our highest tier scholarship.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Graduated Slabs: 90–100% (10%) & 80–90% (5%)
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Strong performance is always recognized. Earn 10% off for 90–99% and 5% off for 80–89%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Instant Auto-Application at Checkout
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    Your discount is calculated seamlessly and deducted automatically from your enrollment quote.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Slabs Table & Interactive Simulator */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-elevated dark:border-slate-800 dark:bg-slate-900">
              {/* Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                      <Percent className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Percentage Discount Slabs
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluated on assessment score (0% to 100%)
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    Up to 20% Off
                  </span>
                </div>
              </div>

              {/* Slabs Grid */}
              <div className="p-6">
                <div className="space-y-3">
                  {PERCENTAGE_SLABS.map((slab) => (
                    <div
                      key={slab.range}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border p-4 transition-all duration-150',
                        slab.discountPercent === 20
                          ? 'border-emerald-300/80 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                          : 'border-slate-200/70 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900',
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs text-white shadow-xs',
                            slab.barColor,
                          )}
                        >
                          {slab.discountPercent > 0 ? `${slab.discountPercent}%` : '0%'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {slab.range}
                            </span>
                            {slab.discountPercent === 20 && (
                              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                Best Value
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {slab.tier}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-xl border px-3 py-1 text-xs font-bold',
                            slab.badgeStyle,
                          )}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {slab.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Simulator Slider */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Gauge className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      <span>Simulate your score:</span>
                    </div>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {simulatedScore}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="80"
                    max="100"
                    step="1"
                    value={simulatedScore}
                    onChange={(e) => setSimulatedScore(Number(e.target.value))}
                    className="mt-3 w-full accent-brand-600 cursor-pointer"
                    aria-label="Simulate assessment score percentage"
                  />

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">
                      Your Unlocked Discount:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {activeDiscount.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscountExplainer;
