import { cn } from '@/shared/utils/cn';

const VARIANTS = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/20 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-500/30',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-500/30',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-500/30',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-500/30',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-500/30',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-500/30',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-950/60 dark:text-orange-300 dark:ring-orange-500/30',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * Pill label. `icon` is an icon component (e.g. icon={Lock}); `dot` adds a leading status dot.
 * Colour is never the only signal: always pass a text label as children.
 */
export function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  icon: Icon,
  className,
  children,
  ...rest
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium ring-1 ring-inset',
        VARIANTS[variant] ?? VARIANTS.neutral,
        SIZES[size] ?? SIZES.sm,
        className,
      )}
      {...rest}
    >
      {dot ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" /> : null}
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export default Badge;
