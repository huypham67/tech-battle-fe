import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from '@/context/theme-context';
import {
  applyTheme,
  getSystemTheme,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readThemePreference);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
  const resolvedTheme = resolveTheme(preference, systemTheme);

  useEffect(() => {
    applyTheme(resolvedTheme);
    writeThemePreference(preference);
  }, [preference, resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const setPreference = (nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
  };

  const toggleTheme = () => {
    setPreferenceState((currentPreference) => {
      const currentTheme = resolveTheme(currentPreference, systemTheme);
      return currentTheme === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
