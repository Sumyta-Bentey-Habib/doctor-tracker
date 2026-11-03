'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'meditrack_theme';
const THEME_CHANGE_EVENT = 'meditrack-theme-change';

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribe(callback: () => void) {
  const onThemeEvent = () => callback();
  window.addEventListener('storage', onThemeEvent);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeEvent);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onMediaChange = (event: MediaQueryListEvent) => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored || stored === 'system') {
        if (event.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch {
      // Ignore local storage errors
    }
    callback();
  };

  mediaQuery.addEventListener('change', onMediaChange);

  return () => {
    window.removeEventListener('storage', onThemeEvent);
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeEvent);
    mediaQuery.removeEventListener('change', onMediaChange);
  };
}

function getSnapshot(): ThemeMode {
  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'system';
  } catch {
    return 'system';
  }
}

function getServerSnapshot(): ThemeMode {
  return 'system';
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const mounted = useIsMounted();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = resolveIsDark(theme);
  const resolvedTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const setTheme = useCallback((newTheme: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      const shouldBeDark = resolveIsDark(newTheme);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // Ignore local storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [isDark, setTheme]);

  return {
    theme,
    resolvedTheme,
    mounted,
    setTheme,
    toggleTheme,
  };
}
