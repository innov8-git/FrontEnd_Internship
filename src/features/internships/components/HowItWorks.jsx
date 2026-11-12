import { useCallback, useEffect, useRef, useState } from 'react';
import { ASSESSMENT_QUESTION_COUNT } from '@/shared/constants';
import {
  Award,
  CheckCircle2,
  CreditCard,
  GitPullRequest,
  ListChecks,
  Percent,
  Rocket,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { MAX_EXAMPLE_DISCOUNT_PERCENT } from '../utils/catalogFormat';

/* ─── Six Milestone Steps with Rich Value Propositions ─── */
const STEPS = [
  {
    stepNumber: '01',
    title: 'Quick Registration',
    shortTitle: 'Free Sign-Up',
    badge: '100% Free',
    meta: 'Takes ~2 mins',
    perk: 'Zero upfront fees',
    description:
      'Create your free account, pick your target domain, and immediately unlock your personalized internship dashboard.',
    icon: UserPlus,
    accent: '#f59e0b', // amber-500
    glow: 'rgba(245, 158, 11, 0.45)',
    gradient: 'from-amber-500 to-amber-600',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  {
    stepNumber: '02',
    title: `${ASSESSMENT_QUESTION_COUNT}-Question Assessment`,
    shortTitle: 'Skill Diagnostic',
    badge: 'No Timer',
    meta: 'Untimed test',
    perk: 'No pass/fail stress',
    description:
      'Demonstrate your practical knowledge in an adaptive diagnostic with zero countdown pressure — just show what you know.',
    icon: ListChecks,
    accent: '#ea580c', // orange-600
    glow: 'rgba(234, 88, 12, 0.45)',
    gradient: 'from-orange-500 to-amber-600',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
  },
  {
    stepNumber: '03',
    title: 'Merit Scholarship',
    shortTitle: 'Merit Discount',
    badge: MAX_EXAMPLE_DISCOUNT_PERCENT > 0 ? `Up to ${MAX_EXAMPLE_DISCOUNT_PERCENT}% Off` : 'Score Reward',
    meta: 'Instant reward',
    perk: 'Applied automatically',
    description:
      MAX_EXAMPLE_DISCOUNT_PERCENT > 0
        ? `Your assessment score unlocks a direct merit discount of up to ${MAX_EXAMPLE_DISCOUNT_PERCENT}% off your internship enrollment fee.`
        : 'Your assessment score unlocks a merit scholarship discount applied automatically to your enrollment.',
    icon: Percent,
    accent: '#10b981', // emerald-500
    glow: 'rgba(16, 185, 129, 0.45)',
    gradient: 'from-emerald-500 to-teal-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    stepNumber: '04',
    title: 'Choose Track & Enroll',
    shortTitle: 'Pick Plan & Pay',
    badge: 'Flexible Tenures',
    meta: '1 to 6 Months',
    perk: 'Transparent pricing',
    description:
      'Select your domain, choose your duration, review the curriculum breakdown, and confirm your spot via secure online checkout.',
    icon: CreditCard,
    accent: '#0284c7', // sky-600
    glow: 'rgba(2, 132, 199, 0.45)',
    gradient: 'from-sky-500 to-blue-600',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  },
  {
    stepNumber: '05',
    title: 'Ship Real Tasks on GitHub',
    shortTitle: 'Build on GitHub',
    badge: 'Live Mentorship',
    meta: 'Daily PR reviews',
    perk: 'Production Git workflow',
    description:
      'Work on daily sprint issues, open pull requests on GitHub, and receive actionable code reviews from senior industry trainers.',
    icon: GitPullRequest,
    accent: '#8b5cf6', // violet-500
    glow: 'rgba(139, 92, 246, 0.45)',
    gradient: 'from-violet-500 to-purple-600',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
  },
  {
    stepNumber: '06',
    title: 'Verifiable Certificate',
    shortTitle: 'Earn Certificate',
    badge: 'Globally Valid',
    meta: 'Unique ID',
    perk: 'LinkedIn shareable',
    description:
      'Graduate with an employer-verifiable credential featuring a unique verification ID that anyone can validate online.',
    icon: Award,
    accent: '#e11d48', // rose-600
    glow: 'rgba(225, 29, 72, 0.45)',
    gradient: 'from-rose-500 to-pink-600',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  },
];

/* ─── Harmonious Pin positions on the SVG curve (1200 x 360) ───
 * When active, cards open INWARD towards the spacious interior curve:
 * - Peaks (2 & 4) open card BELOW so they NEVER poke out of the top/navbar!
 * - Valleys (3 & 5) open card ABOVE so they NEVER poke out of the bottom!
 * - Ends (1 & 6) open card BELOW into the open mid-lower space!
 */
const PIN_COORDINATES = [
  { xPct: 5.4,  yPct: 50.0, cardAbove: true,  pillAbove: true,  align: 'left'   }, // Step 1: Start (card opens ABOVE)
  { xPct: 22.9, yPct: 27.8, cardAbove: false, pillAbove: true,  align: 'center' }, // Step 2: Peak 1 (card opens BELOW into open valley)
  { xPct: 41.3, yPct: 72.2, cardAbove: true,  pillAbove: false, align: 'center' }, // Step 3: Valley 1 (card opens ABOVE into open peak)
  { xPct: 59.6, yPct: 27.8, cardAbove: false, pillAbove: true,  align: 'center' }, // Step 4: Peak 2 (card opens BELOW into open valley)
  { xPct: 77.9, yPct: 72.2, cardAbove: true,  pillAbove: false, align: 'center' }, // Step 5: Valley 2 (card opens ABOVE into open peak)
  { xPct: 94.6, yPct: 50.0, cardAbove: true,  pillAbove: true,  align: 'right'  }, // Step 6: Finish (card opens ABOVE in clear space)
];

/* ─── Ultra-smooth cubic Bezier SVG path (1200 x 360) ─── */
const ROAD_PATH =
  'M 65,180 C 135,180 195,100 275,100 C 355,100 415,260 495,260 C 575,260 635,100 715,100 C 795,100 855,260 935,260 C 1015,260 1065,180 1135,180';

/* ─── Inline CSS Animations ─── */
const ROADMAP_STYLES = `
@keyframes roadDash {
  to { stroke-dashoffset: -56; }
}
@keyframes floatBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@keyframes floatBobDown {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(6px); }
}
`;

/** SVG road track with glowing neon lane and smooth traveling energy orb */
function RoadSvg() {
  return (
    <svg
      viewBox="0 0 1200 360"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft amber road aura */}
        <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Luminous beacon filter */}
        <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Linear road surface gradient */}
        <linearGradient id="roadSurface" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="25%" stopColor="#0f172a" />
          <stop offset="75%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Ambient road glow */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="rgba(245, 158, 11, 0.18)"
        strokeWidth="60"
        strokeLinecap="round"
        filter="url(#roadGlow)"
      />

      {/* Outer Road Kerb / Border */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="#cbd5e1"
        className="dark:stroke-slate-700"
        strokeWidth="44"
        strokeLinecap="round"
      />

      {/* High-tech road shoulder */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="#334155"
        strokeWidth="38"
        strokeLinecap="round"
      />

      {/* Dark Slate Road Asphalt Surface */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="url(#roadSurface)"
        strokeWidth="32"
        strokeLinecap="round"
      />

      {/* Side Guide Rails (subtle white dash lines) */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* Center Animated Luminous Dashed Lane */}
      <path
        d={ROAD_PATH}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="3.2"
        strokeDasharray="14 10"
        strokeLinecap="round"
        style={{ animation: 'roadDash 1.2s linear infinite' }}
      />

      {/* Smooth Gliding Light Orb (Traveling Beacon along the path) */}
      <circle r="6.5" fill="#fef08a" filter="url(#orbGlow)">
        <animateMotion
          path={ROAD_PATH}
          dur="7s"
          repeatCount="indefinite"
          keyTimes="0;0.5;1"
          keyPoints="0;1;0"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        />
      </circle>
    </svg>
  );
}

/** Individual Desktop Interactive Milestone */
function DesktopMilestone({ step, index, active, onSelect, isVisible }) {
  const coord = PIN_COORDINATES[index];
  const { icon: Icon, title, shortTitle, badge, perk, description, accent, glow, gradient, badgeClass, stepNumber } = step;
  const isActive = active === index;
  const cardRef = useRef(null);

  // Auto-scroll card smoothly only if completely clipped outside viewport
  useEffect(() => {
    if (isActive && cardRef.current) {
      const timer = setTimeout(() => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const navbarHeight = 85;
        if (rect.top < 0) {
          window.scrollBy({ top: rect.top - navbarHeight - 16, behavior: 'smooth' });
        } else if (rect.bottom > window.innerHeight && rect.top > navbarHeight) {
          window.scrollBy({ top: rect.bottom - window.innerHeight + 16, behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Active cards open INWARDS to guarantee 100% visibility without scrolling!
  const getPositionStyle = () => {
    const isAbove = isActive ? coord.cardAbove : coord.pillAbove;
    const verticalPos = isAbove
      ? { bottom: 'calc(100% + 12px)' }
      : { top: 'calc(100% + 12px)' };
    if (coord.align === 'left') {
      return { ...verticalPos, left: '-6px' };
    }
    if (coord.align === 'right') {
      return { ...verticalPos, right: '-6px' };
    }
    return { ...verticalPos, left: '50%', transform: 'translateX(-50%)' };
  };

  const isAbove = isActive ? coord.cardAbove : coord.pillAbove;

  // Card container styling – match DomainStrip glassmorphism & gradient border when active
  const cardBaseClass = cn(
    'relative flex flex-col w-[340px] sm:w-[380px] rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300',
    isActive
      ? 'bg-white/95 dark:bg-slate-900/95 border-transparent shadow-2xl scale-[1.03]'
      : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/60 dark:border-slate-800/60 shadow-lg opacity-90 hover:opacity-100 hover:shadow-md',
  );

  return (
    <div
      className="absolute group/pin"
      style={{
        left: `${coord.xPct}%`,
        top: `${coord.yPct}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 40 : 20,
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.5s ease-out ${index * 0.06}s`,
      }}
      onMouseEnter={() => onSelect(index)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isActive ? null : index);
      }}
    >
      {/* ── Circular Road Pin with luminous hover & active effects ── */}
      <div className="relative flex items-center justify-center">
        {/* Ambient luminous halo on hover / active */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -inset-2 rounded-full transition-all duration-300',
            isActive
              ? 'opacity-80 scale-100'
              : 'opacity-0 scale-75 group-hover/pin:opacity-90 group-hover/pin:scale-105',
          )}
          style={{
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          }}
        />

        <button
          type="button"
          aria-label={`Milestone ${index + 1}: ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(isActive ? null : index);
          }}
          className={cn(
            'relative flex items-center justify-center rounded-full text-white cursor-pointer select-none transition-all duration-300',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400',
            isActive
              ? 'h-11 w-11 ring-4 ring-white shadow-xl scale-110'
              : 'h-9.5 w-9.5 ring-2 ring-white/90 shadow-md group-hover/pin:scale-115 group-hover/pin:ring-4 group-hover/pin:ring-white group-hover/pin:shadow-lg',
          )}
          style={{
            backgroundColor: accent,
            boxShadow: isActive
              ? `0 0 20px ${glow}, 0 6px 16px rgba(0,0,0,0.22)`
              : `0 3px 10px rgba(0,0,0,0.16)`,
          }}
        >
          <span className="font-extrabold text-xs tracking-tight">{stepNumber}</span>
        </button>
      </div>

      {/* ── Connected Milestone Content (Pill or Direct Expanded Card) ── */}
      <div
        className="absolute cursor-pointer"
        style={getPositionStyle()}
      >
        {/* Invisible mouse hover bridge */}
        <div
          className={cn(
            'absolute w-12 -translate-x-1/2 left-1/2 pointer-events-auto',
            isAbove ? 'top-full h-4' : 'bottom-full h-4',
          )}
        />

        {/* Visual Connector stem line */}
        <div
          className={cn(
            'absolute w-0.5 pointer-events-none transition-opacity duration-200',
            isAbove ? 'top-full h-3' : 'bottom-full h-3',
            coord.align === 'left' ? 'left-6' : coord.align === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2',
            isActive ? 'opacity-100' : 'opacity-40 group-hover/pin:opacity-80',
          )}
          style={{
            background: `linear-gradient(to ${isAbove ? 'bottom' : 'top'}, ${accent}, transparent)`,
          }}
        />

        {isActive ? (
          /* ── Full Expanded Card (Displays DIRECTLY & IMMEDIATELY on click or hover) ── */
          <div
            ref={cardRef}
            className={cn(cardBaseClass, 'animate-in fade-in zoom-in-95 duration-200 hover:shadow-2xl')}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: `0 16px 36px -8px ${glow}, 0 6px 16px -4px rgba(15,23,42,0.14)`,
              borderColor: `${accent}40`,
            }}
          >
            {/* Top row: Step & Perk Badges + Close Button */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  Step {stepNumber}
                </span>

                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', badgeClass)}>
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  {badge}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close milestone card"
                aria-label="Close milestone card"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Icon + Title */}
            <div className="flex items-start gap-2.5 mb-1.5">
              <div
                className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br', gradient)}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {perk}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-1">
              {description}
            </p>

            {/* Micro bottom progress tag */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Milestone
              </span>
              <span className="font-semibold">{step.meta}</span>
            </div>
          </div>
        ) : (
          /* ── Resting Chic Milestone Pill (Hovering or clicking directly opens the card) ── */
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(index);
            }}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 select-none cursor-pointer',
              'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-100',
              'hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:scale-108 hover:-translate-y-0.5 active:scale-95',
              'group-hover/pin:scale-108 group-hover/pin:shadow-xl group-hover/pin:-translate-y-0.5 group-hover/pin:border-amber-400 dark:group-hover/pin:border-amber-500',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
            )}
            style={{
              animation: coord.pillAbove
                ? 'floatBob 3.6s ease-in-out infinite'
                : 'floatBobDown 3.6s ease-in-out infinite',
              animationDelay: `${index * 0.45}s`,
            }}
            aria-label={`Open milestone ${index + 1}: ${title}`}
          >
            {/* Glowing accent beacon dot */}
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover/pin:scale-125"
              style={{
                backgroundColor: accent,
                boxShadow: `0 0 8px ${accent}`,
              }}
            />
            {/* Accented Step Number */}
            <span
              className="text-[11px] sm:text-xs font-extrabold px-1.5 py-0.5 rounded-md transition-all duration-200"
              style={{
                backgroundColor: `${accent}18`,
                color: accent,
              }}
            >
              {stepNumber}
            </span>
            {/* Crisp readable short title */}
            <span className="tracking-tight text-slate-800 dark:text-slate-100 font-bold transition-colors group-hover/pin:text-slate-950 dark:group-hover/pin:text-white">
              {shortTitle}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Interactive Step Selector Pills (Quick controls below roadmap) */
function StepSelectorBar({ active, onSelect }) {
  return (
    <div className="mt-6 flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 max-w-6xl mx-auto px-2">
      {STEPS.map((s, idx) => {
        const isCurrent = active === idx;
        const { icon: StepIcon, glow } = s;

        return (
          <button
            key={s.stepNumber}
            type="button"
            onMouseEnter={() => onSelect(idx)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(isCurrent ? null : idx);
            }}
            className={cn(
              'group relative inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
              'hover:scale-105 hover:-translate-y-0.5 active:scale-95',
              isCurrent
                ? 'bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-950 scale-102 ring-2 ring-amber-500/50'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md',
            )}
            style={
              isCurrent
                ? {
                    boxShadow: `0 8px 20px -4px ${glow || 'rgba(245, 158, 11, 0.35)'}`,
                  }
                : undefined
            }
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200',
                isCurrent
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-amber-100 group-hover:text-amber-800 dark:group-hover:bg-amber-950/60 dark:group-hover:text-amber-300 group-hover:scale-110',
              )}
            >
              {idx + 1}
            </span>
            <span className="transition-colors group-hover:text-slate-900 dark:group-hover:text-white font-medium">
              {s.shortTitle}
            </span>
            <StepIcon className="w-3.5 h-3.5 shrink-0 opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110 group-hover:text-amber-500" />
          </button>
        );
      })}
    </div>
  );
}

/** Desktop View: Animated horizontal serpentine track */
function HorizontalRoadmap() {
  const [active, setActive] = useState(0); // Default to Step 1
  const wrapRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Click outside to close active milestone card
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicking outside the active card/roadmap, close the card
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setActive(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActive(null);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = useCallback((idx) => {
    setActive(idx);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:block w-full max-w-6xl mx-auto px-4"
    >
      {/* ── Start & Finish Milestone Badges ── */}
      <div className="absolute top-[50%] -translate-y-1/2 left-0 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
        <Rocket className="w-3 h-3 text-emerald-500" />
        Start
      </div>

      <div className="absolute top-[50%] -translate-y-1/2 right-0 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
        <Trophy className="w-3 h-3 text-rose-500" />
        Certified
      </div>

      {/* ── Canvas Box for the 1200 x 360 SVG & Pin Layer (Clean 30% aspect ratio) ── */}
      <div
        className="relative w-full cursor-pointer"
        style={{ paddingBottom: '30%' }}
        onClick={() => setActive(null)}
      >
        <RoadSvg />

        {STEPS.map((step, i) => (
          <DesktopMilestone
            key={step.title}
            step={step}
            index={i}
            active={active}
            onSelect={handleSelect}
            isVisible={isVisible}
          />
        ))}
      </div>

      {/* ── Quick Step Navigation Bar ── */}
      <StepSelectorBar active={active} onSelect={handleSelect} />
    </div>
  );
}

/** Mobile View: Vertical Roadmap with Accordion Cards */
function MobileRoadmap() {
  const [active, setActive] = useState(0);

  const toggle = (i) => setActive((prev) => (prev === i ? null : i));

  return (
    <div className="relative ml-4 mr-2 space-y-6 lg:hidden">
      {/* Gradient vertical timeline line */}
      <div className="absolute left-4 top-2 bottom-6 w-1 bg-gradient-to-b from-amber-500 via-sky-500 to-rose-500 rounded-full opacity-60" />

      {STEPS.map((step, index) => {
        const { icon: Icon, title, badge, perk, description, accent, gradient, badgeClass, stepNumber } = step;
        const isOpen = active === index;

        return (
          <div key={title} className="relative pl-12">
            {/* Numbered Pin on the line */}
            <button
              type="button"
              onClick={() => toggle(index)}
              onMouseEnter={() => setActive(index)}
              className={cn(
                'absolute left-1.5 top-3 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white dark:ring-slate-900 transition-transform duration-200 hover:scale-110',
                isOpen ? 'scale-110 shadow-lg' : 'scale-95',
              )}
              style={{ backgroundColor: accent }}
              aria-expanded={isOpen}
            >
              <span className="text-xs font-bold">{stepNumber}</span>
            </button>

            {/* Interactive Card */}
            <div
              onClick={() => toggle(index)}
              onMouseEnter={() => setActive(index)}
              className={cn(
                'cursor-pointer rounded-2xl border p-4 transition-all duration-300',
                'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md',
                'hover:shadow-lg hover:border-amber-400/80 dark:hover:border-amber-500/80 hover:-translate-y-0.5',
                isOpen
                  ? 'border-amber-500/40 shadow-xl ring-1 ring-amber-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm',
              )}
            >
              {/* Header: Step & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  Step {stepNumber}
                </span>

                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', badgeClass)}>
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  {badge}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white bg-gradient-to-br', gradient)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {perk}
                  </p>
                </div>
              </div>

              {/* Expandable details */}
              <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{
                  maxHeight: isOpen ? 160 : 0,
                  opacity: isOpen ? 1 : 0,
                  marginTop: isOpen ? 12 : 0,
                }}
              >
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {description}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Milestone
                  </span>
                  <span className="font-semibold">{step.meta}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** "How it works" Section */
export function HowItWorks({ className }) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn(
        'relative scroll-mt-20 overflow-visible pt-6 pb-12 sm:pt-8 sm:pb-16',
        'bg-slate-50/60 dark:bg-slate-950/60',
        className,
      )}
    >
      {/* Inject custom CSS keyframes */}
      <style>{ROADMAP_STYLES}</style>

      {/* ── Ambient Background Lighting & Tech Dot Matrix ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-gradient-to-r from-amber-400/10 via-amber-300/15 to-orange-400/10 dark:from-amber-500/5 dark:via-brand-500/10 dark:to-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-500/5 dark:bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Interactive Internship Roadmap</span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            From Sign-Up to Certificate in 6 Steps
          </h2>

          <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            A transparent, milestone-driven journey designed to build real engineering expertise with zero surprises or hidden costs.
          </p>

          <p className="mt-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hidden lg:block">
            Hover over or click any milestone to explore each stage
          </p>
        </div>

        {/* ── Desktop Horizontal Serpentine Roadmap ── */}
        <HorizontalRoadmap />

        {/* ── Mobile Vertical Roadmap ── */}
        <MobileRoadmap />
      </div>
    </section>
  );
}

export default HowItWorks;
