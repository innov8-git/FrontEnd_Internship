import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { AuthContext } from '@/shared/context/AuthContext';
import { ROUTES, getHomeRoute } from '@/shared/constants';
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  FileText,
  Globe,
  Phone,
  Rocket,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

/** Closing high-conversion call to action of the home page. */
export function CtaBanner({ className }) {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user ?? null;

  return (
    <section aria-labelledby="cta-heading" className={cn('bg-white py-8 sm:py-12 dark:bg-slate-950', className)}>
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 px-6 py-8 text-center shadow-lg shadow-slate-200/50 transition-colors duration-200 sm:px-10 sm:py-9 dark:border-slate-800/80 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-xl dark:shadow-black/40">
          {/* Ambient luminous glow backdrops */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-full max-w-2xl rounded-full bg-brand-500/5 blur-[80px] dark:bg-brand-600/10"
            aria-hidden="true"
          />

          {/* Decorative tech grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] opacity-25 [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] dark:opacity-35"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-4xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/90 px-3 py-1 text-xs font-semibold text-brand-800 shadow-xs backdrop-blur-md transition-colors dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
              <Rocket className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>100% Online Remote Industry Internships</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse dark:bg-emerald-400" />
            </div>

            {/* Main Headline */}
            <h2
              id="cta-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white"
            >
              Ready to build real software &{' '}
              <span className="bg-gradient-to-r from-brand-600 to-amber-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-amber-300">
                launch your career?
              </span>
            </h2>

            {/* Subtitle - concise and punchy */}
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              Work on production code, receive dedicated 1-on-1 mentorship, and earn verified credentials.
            </p>

            {/* Feature Highlights Strip - compact and supportive of dark & light */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1 text-slate-700 shadow-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Online Remote
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1 text-slate-700 shadow-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                1 to 6 Months Flexible
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1 text-slate-700 shadow-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-brand-400" />
                Experience Letter
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1 text-slate-700 shadow-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                1-on-1 Mentor
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2.5 py-1 text-slate-700 shadow-xs transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <Phone className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                Placement Calls
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                as={Link}
                to={ROUTES.CATALOG}
                size="md"
                variant="primary"
                rightIcon={ArrowRight}
                className="bg-brand-500 font-bold text-slate-950 hover:bg-brand-400 active:scale-95 shadow-md shadow-brand-500/20"
              >
                Explore Online Internships
              </Button>

              {isAuthenticated ? (
                <Button
                  as={Link}
                  to={getHomeRoute(user)}
                  size="md"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-800 shadow-xs hover:border-slate-400 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
                >
                  Go to your dashboard
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={ROUTES.REGISTER}
                  size="md"
                  variant="outline"
                  className="border-slate-300 bg-white text-slate-800 shadow-xs hover:border-slate-400 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
                >
                  Create a free student account
                </Button>
              )}
            </div>

            {/* Partner Logos / Trust ribbon - sleek inline bar */}
            <div className="mt-5 border-t border-slate-200/80 pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Official Partners:
              </span>
              <span className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors dark:hover:text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Inlarge Software (Banking)
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors dark:hover:text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Couldinger (Telecom)
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors dark:hover:text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                Proton (Healthcare)
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors dark:hover:text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                Ady Nexes (Enterprise AI)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
