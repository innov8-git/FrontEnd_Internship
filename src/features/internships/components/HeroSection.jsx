import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  Container,
  Database,
  GithubIcon,
  Hexagon,
  Layers,
  Star,
  Workflow,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';
import { MAX_EXAMPLE_DISCOUNT_PERCENT } from '../utils/catalogFormat';

const HIGHLIGHTS = [
  'Guaranteed Sprints — No Resume Filter',
  'Up to 20% Merit Scholarship',
  'Senior Engineer Code Reviews',
  'Verifiable Digital Certificate',
];

const POPULAR_TRACKS = [
  { label: '☕ Java Banking', query: 'java' },
  { label: '⚛️ Full Stack', query: 'full-stack' },
  { label: '☁️ DevOps & Cloud', query: 'devops' },
  { label: '🔷 .NET Core', query: 'net' },
  { label: '🗄️ SQL & Backend', query: 'sql' },
];

/**
 * Hero section displaying the full image in the background with uniform contrast,
 * showcasing the whole photograph across the entire landing page viewport.
 */
export function HeroSection({ className }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        'relative isolate min-h-[640px] overflow-hidden bg-slate-950 text-white transition-colors duration-200 lg:min-h-[720px]',
        className,
      )}
    >
      {/* Background Image Container - The WHOLE image is visible across the entire section */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />

        {/* Subtle, balanced overlay allowing the background photograph to be clearly visible and vibrant */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/35" />

        {/* Ambient warm amber brand glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[36rem] w-[44rem] rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      <div className="container-page flex flex-col items-center justify-center py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-900/80 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-lg backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2026 Cohorts Open</span>
            <span className="text-amber-400/70">·</span>
            <span className="text-amber-200">
              Up to {MAX_EXAMPLE_DISCOUNT_PERCENT}% Merit Scholarship
            </span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg"
          >
            Real Industry Internships.{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Real Production Code.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-100 drop-shadow-md sm:text-lg">
            Build production software, get reviewed by senior engineers on GitHub,
            and graduate with employer-verified credentials.
          </p>

          {/* Primary Action Button */}
          <div className="mt-5 flex items-center justify-center">
            <Button
              as={Link}
              to={ROUTES.CATALOG}
              size="lg"
              rightIcon={ArrowRight}
              className="shadow-xl px-7"
            >
              Explore Internships
            </Button>
          </div>

          {/* Popular Tracks Quick Links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">Popular:</span>
            {POPULAR_TRACKS.map(({ label, query }) => (
              <Link
                key={label}
                to={`${ROUTES.CATALOG}?q=${query}`}
                className="rounded-full border border-white/15 bg-slate-900/70 px-3 py-1 font-medium text-slate-200 backdrop-blur transition hover:border-amber-400 hover:text-amber-300"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Feature Highlights Checklist */}
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-200">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Live Trust Metrics Bar */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-5 text-center">
            <div>
              <p className="text-xl font-black text-white sm:text-2xl">2,500+</p>
              <p className="text-xs text-slate-300">Active Interns</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <p className="text-xl font-black text-white sm:text-2xl">4.9</p>
                <div className="flex text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
              </div>
              <p className="text-xs text-slate-300">500+ Reviews</p>
            </div>
            <div>
              <p className="text-xl font-black text-white sm:text-2xl">100%</p>
              <p className="text-xs text-slate-300">Verifiable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// STACKS list
const STACKS = [
  { label: 'Java', icon: Coffee },
  { label: 'Full Stack', icon: Layers },
  { label: '.NET', icon: Hexagon },
  { label: 'DevOps', icon: Workflow },
  { label: 'Docker', icon: Container },
  { label: 'SQL', icon: Database },
  { label: 'GitHub', icon: GithubIcon },
];

/** Trust strip under the hero: continuous autoscrolling marquee for industry tech stacks. */
export function TrustStrip({ className }) {
  return (
    <section
      aria-label="Technologies covered"
      className={cn(
        'overflow-hidden border-y border-slate-200 bg-white py-5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60',
        className,
      )}
    >
      <div className="container-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Label with pulse dot */}
          <div className="flex shrink-0 items-center justify-center lg:justify-start gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Industry Stacks You Will Master:
            </p>
          </div>

          {/* Autoscrolling Infinite Marquee */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex w-max items-center gap-4 animate-marquee py-1 hover:[animation-play-state:paused]">
              {/* Duplicated multiple times to guarantee an unbroken, seamless infinite marquee */}
              {[...STACKS, ...STACKS, ...STACKS].map(({ label, icon: Icon }, idx) => (
                <div
                  key={`${label}-${idx}`}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200/90 bg-slate-50/90 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-amber-500 hover:text-amber-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 sm:text-sm cursor-default"
                >
                  <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
