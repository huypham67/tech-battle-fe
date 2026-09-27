export const THEME_STORAGE_KEY = 'tb.theme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : 'system';
  } catch {
    return 'system';
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    return;
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference;
}

export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute('content', theme === 'dark' ? '#131519' : '#f6f7f8');
}
