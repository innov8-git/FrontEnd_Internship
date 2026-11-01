import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'alfre.theme';

/**
 * ThemeContext provides `theme` ('light' | 'dark'), `isDark` boolean,
 * and a `toggleTheme` function. Default is light mode.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
});

/**
 * Manages the `dark` class on `<html>` and persists the preference in localStorage.
 * Default is always light mode; the user's OS preference is NOT auto-detected
 * (the user asked for light as the default).
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // SSR or localStorage blocked
    }
    return 'light';
  });

  // Sync the `dark` class on <html> whenever theme changes.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage blocked
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
