import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { AuthContext } from '@/shared/context/AuthContext';
import { ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Coffee,
  Container,
  Database,
  FileText,
  GithubIcon,
  Hexagon,
  Layers,
  Phone,
  Users,
  Workflow,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const HIGHLIGHTS = [
  'Guaranteed Sprints — No Resume Filter',
  'Up to 20% Merit Scholarship',
  'Senior Engineer Code Reviews',
  'Verifiable Digital Certificate',
];

const FEATURE_PILLS = [
  {
    icon: Building2,
    title: '4 Tech Partners',
    subtitle: '8 Fixed Domain Tracks',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    hoverGlow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/40',
    topHighlight: 'via-emerald-400/60',
  },
  {
    icon: FileText,
    title: 'Internship Completion Letter',
    subtitle: 'Official corporate credentials',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    hoverGlow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/40',
    topHighlight: 'via-emerald-400/60',
  },
  {
    icon: Users,
    title: '1-on-1 Mentor',
    subtitle: 'Weekly senior reviews',
    iconBg: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
    hoverGlow: 'hover:shadow-sky-500/10 hover:border-sky-500/40',
    topHighlight: 'via-sky-400/60',
  },
  {
    icon: Phone,
    title: 'Placement Support',
    subtitle: 'Interview opportunities',
    iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    hoverGlow: 'hover:shadow-purple-500/10 hover:border-purple-500/40',
    topHighlight: 'via-purple-400/60',
  },
];

/**
 * Hero section displaying the full image in the background with uniform contrast,
 * showcasing the whole photograph across the entire landing page viewport.
 */
export function HeroSection({ className }) {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const scrollToExplore = (e) => {
    if (!isAuthenticated) {
      const el = document.getElementById('explore-internships');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg"
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
              to={isAuthenticated ? ROUTES.CATALOG : '/#explore-internships'}
              onClick={scrollToExplore}
              size="lg"
              rightIcon={ArrowRight}
              className="shadow-xl px-7"
            >
              Explore Internships
            </Button>
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
        </div>

        {/* 4 Tech Partner & Outcome Cards (Glassmorphic Glow Cards) */}
        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 text-left">
          {FEATURE_PILLS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/65 p-4 shadow-xl backdrop-blur-xl',
                  'transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-slate-900/85 hover:shadow-2xl',
                  item.hoverGlow,
                )}
              >
                {/* Top ambient highlight gradient line */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100',
                    item.topHighlight,
                  )}
                />

                {/* Subtle soft ambient background glow */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/5 blur-xl transition-all duration-300 group-hover:scale-150 group-hover:bg-white/10" />

                <div className="relative flex items-center gap-3.5">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-transform duration-300 group-hover:scale-105',
                      item.iconBg,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold tracking-tight text-white transition-colors group-hover:text-amber-300">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-300 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
