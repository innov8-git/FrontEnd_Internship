import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/shared/hooks';
import { ROUTES, getHomeRoute } from '@/shared/constants';
import { ArrowRight, Sparkles } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const GRID_MASK =
  '[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]';

/** Closing call to action of the home page. */
export function CtaBanner({ className }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <section aria-labelledby="cta-heading" className={cn('bg-white pb-16 sm:pb-24 transition-colors duration-200 dark:bg-slate-950', className)}>
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-black px-6 py-14 text-center shadow-2xl ring-1 ring-amber-500/30 sm:px-12 sm:py-20">
          <div
            className={cn('bg-grid pointer-events-none absolute inset-0 -z-10 opacity-30', GRID_MASK)}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-inset ring-brand-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>ALFRE Career Acceleration</span>
            </div>

            <h2
              id="cta-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Ready to Accelerate Your Career?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Pick your dream track, take the 15-question skill challenge, unlock your merit discount,
              and start shipping real Pull Requests today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
              <Button
                as={Link}
                to={ROUTES.CATALOG}
                size="lg"
                variant="primary"
                rightIcon={ArrowRight}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg"
              >
                Explore internships
              </Button>
              {isAuthenticated ? (
                <Button
                  as={Link}
                  to={getHomeRoute(user)}
                  size="lg"
                  variant="ghost"
                  className="text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:text-white"
                >
                  Go to your dashboard
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={ROUTES.REGISTER}
                  size="lg"
                  variant="ghost"
                  className="text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:text-white"
                >
                  Create a free account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
