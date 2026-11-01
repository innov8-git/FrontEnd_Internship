import { Moon, Sun } from '@/shared/icons';
import { useTheme } from '@/shared/hooks';
import { cn } from '@/shared/utils/cn';

/**
 * Animated sun/moon toggle for the navbar.
 * Renders as a ghost-style icon button that smoothly rotates on switch.
 */
export function ThemeToggle({ className, ...rest }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg',
        'text-slate-600 transition-colors duration-200',
        'hover:bg-slate-100 hover:text-slate-900',
        'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-offset-slate-900',
        className,
      )}
      {...rest}
    >
      {/* Sun icon – visible in dark mode */}
      <Sun
        className={cn(
          'h-5 w-5 transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-amber-400'
            : '-rotate-90 scale-0 opacity-0 absolute',
        )}
        aria-hidden="true"
      />
      {/* Moon icon – visible in light mode */}
      <Moon
        className={cn(
          'h-5 w-5 transition-all duration-300',
          isDark
            ? 'rotate-90 scale-0 opacity-0 absolute'
            : 'rotate-0 scale-100 opacity-100 text-slate-600',
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
