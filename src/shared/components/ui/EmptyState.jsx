import { isValidElement } from 'react';
import { Inbox, Lock } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

const TONES = {
  default: 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400',
  muted: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  locked: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
};

/** A designed "nothing here yet / locked" moment with one clear next step. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  compact = false,
  titleAs: Title = 'h3',
  className,
  children,
  ...rest
}) {
  const Icon = icon ?? (variant === 'locked' ? Lock : Inbox);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact
          ? 'px-4 py-8'
          : 'rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          TONES[variant] ?? TONES.default,
        )}
      >
        {isValidElement(Icon) ? Icon : <Icon className="h-6 w-6" aria-hidden="true" />}
      </div>
      {title ? <Title className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</Title> : null}
      {description ? (
        <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
      {children}
      {action || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
