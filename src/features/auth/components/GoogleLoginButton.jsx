import { forwardRef } from 'react';
import { Loader2 } from '@/shared/icons';
import { GoogleIcon } from '@/shared/icons/GoogleIcon';
import { cn } from '@/shared/utils/cn';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

/**
 * Google Sign-in / Sign-up button styled for both light and dark modes.
 * Adheres to Google's Brand Guidelines while matching the portal's design system.
 */
export const GoogleLoginButton = forwardRef(function GoogleLoginButton(
  {
    mode = 'login', // 'login' | 'register'
    variant = 'compact', // 'compact' | 'full'
    text,
    disabled = false,
    fullWidth = false,
    className,
    onClick,
    onSuccess,
    onError,
    ...rest
  },
  ref,
) {
  const { signInWithGoogle, isPending } = useGoogleAuth({ mode, onSuccess, onError });

  const isRegister = mode === 'register';
  const defaultLabel =
    variant === 'full'
      ? isRegister
        ? 'Sign up with Google'
        : 'Continue with Google'
      : 'Google';

  const label = text || defaultLabel;
  const isDisabled = Boolean(disabled || isPending);

  const handleClick = (e) => {
    if (isDisabled) return;
    if (onClick) {
      onClick(e);
      return;
    }
    signInWithGoogle();
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={isPending}
      data-testid="google-login-button"
      className={cn(
        'group relative inline-flex items-center justify-center gap-3 rounded-xl border font-medium select-none transition-all duration-150',
        'h-11 px-4 text-sm',
        'border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]',
        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/90 dark:hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400 dark:text-slate-500" aria-hidden="true" />
      ) : (
        <GoogleIcon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
});

export default GoogleLoginButton;
