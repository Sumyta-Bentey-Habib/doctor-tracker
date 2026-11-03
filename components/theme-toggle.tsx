'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks';
import { THEME_STRINGS } from '@/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'segmented';
}

export function ThemeToggle({ className = '', variant = 'pill' }: ThemeToggleProps) {
  const { theme, resolvedTheme, mounted, setTheme, toggleTheme } = useTheme();

  if (!mounted) {
    if (variant === 'segmented') {
      return (
        <div
          className={`inline-flex h-9 w-[104px] items-center rounded-xl border border-border/80 bg-surface/70 p-1 backdrop-blur-md shadow-xs ${className}`}
          aria-hidden="true"
        />
      );
    }

    return (
      <div
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-surface/80 shadow-xs backdrop-blur-md ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center rounded-xl border border-border/80 bg-surface/70 p-1 backdrop-blur-md shadow-xs ${className}`}
        role="group"
        aria-label={THEME_STRINGS.themePreference}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-label={THEME_STRINGS.lightMode}
          title={THEME_STRINGS.lightMode}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${
            theme === 'light'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-foreground'
          }`}
        >
          <Sun size={14} />
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-label={THEME_STRINGS.darkMode}
          title={THEME_STRINGS.darkMode}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${
            theme === 'dark'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-foreground'
          }`}
        >
          <Moon size={14} />
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          aria-label={THEME_STRINGS.systemMode}
          title={THEME_STRINGS.systemMode}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-all ${
            theme === 'system'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-foreground'
          }`}
        >
          <Monitor size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark'
          ? THEME_STRINGS.switchToLight
          : THEME_STRINGS.switchToDark
      }
      title={
        resolvedTheme === 'dark'
          ? THEME_STRINGS.switchToLight
          : THEME_STRINGS.switchToDark
      }
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-surface/80 text-foreground shadow-xs backdrop-blur-md transition-all hover:bg-surface-hover hover:border-primary/40 focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${className}`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={16} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={16} className="text-primary transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}

