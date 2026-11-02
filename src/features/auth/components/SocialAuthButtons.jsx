import { cn } from '@/shared/utils/cn';
import { GoogleLoginButton } from './GoogleLoginButton';

/**
 * Social authentication component focused exclusively on Google sign-in / sign-up.
 * Features full dark and light mode theme support, responsive sizing, and accessible focus states.
 */
export function SocialAuthButtons({
  mode = 'login', // 'login' | 'register'
  className,
  onGoogleClick,
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <GoogleLoginButton
        mode={mode}
        variant="full"
        fullWidth
        onClick={onGoogleClick}
      />

      <div className="relative my-4 flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
          or with email
        </span>
      </div>
    </div>
  );
}

export default SocialAuthButtons;
