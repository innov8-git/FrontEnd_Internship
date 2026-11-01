import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '@/shared/constants';
import { cn } from '@/shared/utils/cn';

const SIZES = {
  sm: {
    mark: 'h-7 w-7',
    title: 'text-sm font-bold tracking-wider',
    sub: 'text-[8px] font-semibold tracking-widest',
  },
  md: {
    mark: 'h-9 w-9',
    title: 'text-base font-bold tracking-wider',
    sub: 'text-[9px] font-semibold tracking-widest',
  },
  lg: {
    mark: 'h-11 w-11',
    title: 'text-lg font-bold tracking-wider',
    sub: 'text-[10px] font-semibold tracking-widest',
  },
};

/** ALFRE company emblem mark (black backdrop with metallic silver apex & gold tie). */
function LogoMark({ size = 'md', inverted = false, className }) {
  const [imgFailed, setImgFailed] = useState(false);
  const sizeStyles = SIZES[size] ? SIZES[size].mark : SIZES.md.mark;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black shadow-sm ring-1 transition-transform',
        inverted ? 'ring-brand-500/40' : 'ring-black/10 dark:ring-amber-500/30',
        sizeStyles,
        className,
      )}
      aria-hidden="true"
    >
      {!imgFailed ? (
        <img
          src="/alfre-icon.png"
          alt=""
          loading="eager"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-contain p-0.5"
        />
      ) : (
        /* Vector fallback matching the ALFRE emblem */
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full p-1" focusable="false">
          <path d="M16 4L6 26h5l5-12 5 12h5L16 4z" fill="url(#alfre-silver)" />
          <path d="M16 16c1 2 2.5 5 4 10h-3c-1.2-3.5-2.2-6.5-2.5-8l1.5-2z" fill="url(#alfre-gold)" />
          <defs>
            <linearGradient id="alfre-silver" x1="6" y1="4" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="alfre-gold" x1="15" y1="16" x2="20" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </span>
  );
}

/**
 * ALFRE Brand Logo component:
 * - Displays the official ALFRE emblem icon alongside bold brand typography & tagline.
 * - `to`: wraps the logo in a React Router Link.
 * - `inverted`: styles for dark backdrops (e.g., auth side panel).
 * - `showSubtitle`: toggles the "CAREER GUIDANCE" subtitle.
 */
export function Logo({
  size = 'md',
  withText = true,
  showSubtitle = true,
  to,
  inverted = false,
  className,
  ...rest
}) {
  const sizeKey = SIZES[size] ? size : 'md';
  const sizeConfig = SIZES[sizeKey];

  const content = (
    <>
      <LogoMark size={sizeKey} inverted={inverted} />
      {withText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'leading-none select-none',
              sizeConfig.title,
              inverted ? 'text-white' : 'text-slate-900 dark:text-white',
            )}
          >
            {APP_NAME}
          </span>
          {showSubtitle ? (
            <span
              className={cn(
                'mt-1 uppercase select-none leading-none',
                sizeConfig.sub,
                inverted ? 'text-brand-300' : 'text-brand-600 dark:text-brand-400',
              )}
            >
              Career Guidance
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const base = 'inline-flex min-w-0 items-center gap-2.5';

  if (to) {
    return (
      <Link
        to={to}
        aria-label={`${APP_NAME} home`}
        className={cn(
          base,
          'rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          inverted
            ? 'focus-visible:ring-white focus-visible:ring-offset-transparent'
            : 'focus-visible:ring-brand-500 dark:focus-visible:ring-offset-slate-900',
          className,
        )}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      className={cn(base, className)}
      role={withText ? undefined : 'img'}
      aria-label={withText ? undefined : APP_NAME}
      {...rest}
    >
      {content}
    </span>
  );
}

export default Logo;
