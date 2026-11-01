import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, ProgressBar } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Coffee,
  Container,
  Database,
  GitCommit,
  GithubIcon,
  GitPullRequest,
  Hexagon,
  Layers,
  Lock,
  Percent,
  ShieldCheck,
  Star,
  Timer,
  Workflow,
  Zap,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { MAX_EXAMPLE_DISCOUNT_PERCENT } from '../utils/catalogFormat';

const HIGHLIGHTS = [
  'No pass or fail',
  'One attempt, no timer',
  'Trainer code reviews on GitHub',
  'Certificates anyone can verify',
];

const POPULAR_TRACKS = [
  { label: '☕ Java Banking', query: 'java' },
  { label: '⚛️ Full Stack', query: 'full-stack' },
  { label: '☁️ DevOps & Cloud', query: 'devops' },
  { label: '🔷 .NET Core', query: 'net' },
];

const PREVIEW_TASKS = [
  {
    title: 'Fix the failing transfer service',
    status: 'Approved',
    variant: 'success',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Add JPA persistence for ledgers',
    status: 'In review',
    variant: 'info',
    icon: Timer,
    iconClass: 'text-sky-600 dark:text-sky-400',
  },
  {
    title: 'Write JUnit tests for statements',
    status: 'Locked',
    variant: 'neutral',
    icon: Lock,
    iconClass: 'text-slate-400 dark:text-slate-500',
  },
];

const MASK_TOP =
  '[mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]';

/**
 * High-fidelity decorative "student dashboard" mockup demonstrating real internship experience.
 */
function HeroVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-md sm:pb-14 sm:pt-20 lg:max-w-lg"
      aria-hidden="true"
    >
      {/* Ambient glow behind the cards */}
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-400/20 via-orange-400/10 to-amber-600/20 blur-2xl dark:from-amber-500/10 dark:to-orange-500/10" />

      {/* Floating Trainer Feedback Card (Top Left) */}
      <div className="absolute -left-4 -top-6 z-20 hidden w-64 rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/95 sm:flex sm:items-start sm:gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
          <GitPullRequest className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Trainer Feedback
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-600 dark:text-slate-300">
            &ldquo;Clean JPA entities &amp; query optimization. Approved for Day 13!&rdquo;
          </p>
        </div>
      </div>

      {/* Main Interactive Student Dashboard Card */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-2xl backdrop-blur transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar name="Aarav Sharma" size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                Aarav Sharma
              </p>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Active Intern
              </span>
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Java Developer · Banking Domain
            </p>
          </div>
          <Badge variant="brand" dot>
            Day 12 / 30
          </Badge>
        </div>

        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Internship Progress
            </span>
            <span className="font-bold text-brand-700 dark:text-brand-400">40% Completed</span>
          </div>
          <ProgressBar className="mt-2" value={40} label="Internship progress" />
        </div>

        <ul className="mt-4 space-y-2.5">
          {PREVIEW_TASKS.map(({ title, status, variant, icon: Icon, iconClass }) => (
            <li
              key={title}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 transition-colors dark:border-slate-800/70 dark:bg-slate-800/50"
            >
              <Icon className={cn('h-4 w-4 shrink-0', iconClass)} />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                {title}
              </span>
              <Badge variant={variant}>{status}</Badge>
            </li>
          ))}
        </ul>

        {/* Git Commit Bar */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300 shadow-inner dark:bg-slate-950">
          <GitCommit className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="truncate text-slate-200">feat: add daily transfer limits</span>
          <span className="ml-auto shrink-0 font-semibold text-emerald-400">#merged</span>
        </div>
      </div>

      {/* Floating Assessment Score Card (Top Right) */}
      <div className="absolute -right-3 top-6 hidden w-56 rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/95 sm:block lg:-right-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Assessment Score
          </p>
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
        </div>
        <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
          14 <span className="text-sm font-medium text-slate-400">/ 15</span>
        </p>
        <Badge variant="brand" icon={Percent} className="mt-2 w-full justify-center">
          10% Merit Discount Applied
        </Badge>
      </div>

      {/* Floating Certificate Verified Badge (Bottom Left) */}
      <div className="absolute -bottom-4 -left-4 hidden w-64 rounded-xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/95 sm:block lg:-left-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-950/80 dark:text-emerald-400">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Official Certificate
            </p>
            <p className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
              ALF-2026-000123 · Verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Home page hero: headline, social proof, CTAs, live stats and interactive dashboard visual. */
export function HeroSection({ className }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        'relative isolate overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white transition-colors duration-200 dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-950',
        className,
      )}
    >
      <div
        className={cn('bg-grid pointer-events-none absolute inset-0 -z-10', MASK_TOP)}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-amber-300/30 via-orange-400/20 to-amber-600/10 blur-3xl dark:from-amber-500/10 dark:via-orange-500/5 dark:to-transparent"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-20">
        <div className="max-w-2xl">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-800 backdrop-blur dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Summer &amp; Fall 2026 Cohorts Live</span>
            <span className="text-amber-400/70">·</span>
            <span className="text-brand-700 dark:text-brand-300">Merit Discounts up to 20%</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem]"
          >
            Prove your skills.
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-amber-500">
              Earn your discount.
            </span>
            <br />
            Ship real projects.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Skip the generic resume filters. Take a 15-question skill challenge, unlock an individual
            merit discount
            {MAX_EXAMPLE_DISCOUNT_PERCENT > 0 ? ` of up to ${MAX_EXAMPLE_DISCOUNT_PERCENT}%` : ''},
            and build production software through day-wise tasks reviewed by trainers on GitHub.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              as={Link}
              to={ROUTES.CATALOG}
              size="lg"
              rightIcon={ArrowRight}
              className="shadow-md hover:shadow-lg transition-all"
            >
              Explore internships
            </Button>
            <Button
              as={Link}
              to={ROUTES.VERIFY_CERTIFICATE}
              size="lg"
              variant="outline"
              leftIcon={ShieldCheck}
            >
              Verify a certificate
            </Button>
          </div>

          {/* Popular Tracks Quick Links */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Popular:</span>
            {POPULAR_TRACKS.map(({ label, query }) => (
              <Link
                key={label}
                to={`${ROUTES.CATALOG}?q=${query}`}
                className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Feature Highlights Checklist */}
          <ul className="mt-6 grid grid-cols-1 gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 sm:grid-cols-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Live Trust Metrics Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 dark:border-slate-800">
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                2,500+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Students Enrolled</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                  4.9
                </p>
                <div className="flex text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">500+ Reviews</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                100%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verifiable on LinkedIn</p>
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

const STACKS = [
  { label: 'Java', icon: Coffee },
  { label: 'Full Stack', icon: Layers },
  { label: '.NET', icon: Hexagon },
  { label: 'DevOps', icon: Workflow },
  { label: 'Docker', icon: Container },
  { label: 'SQL', icon: Database },
  { label: 'GitHub', icon: GithubIcon },
];

/** Trust strip under the hero: the stacks the internship tracks are built on. */
export function TrustStrip({ className }) {
  return (
    <section
      aria-label="Technologies covered"
      className={cn(
        'border-y border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60',
        className,
      )}
    >
      <div className="container-page flex flex-col items-center gap-5 py-7 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300 lg:text-left">
            Industry Stacks You Will Master:
          </p>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {STACKS.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 sm:text-sm"
            >
              <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HeroSection;
