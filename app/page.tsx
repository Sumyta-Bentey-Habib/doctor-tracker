'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { apiRequest } from '@/lib/api';
import { WELCOME_STRINGS } from '@/utils';

interface AuthCheckResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function WelcomeHomePage() {
  const router = useRouter();
  const currentYear = 2026;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    apiRequest<AuthCheckResponse>('/auth/me')
      .then((res) => {
        if (active && res.success && res.user) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (active) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const features = [
    {
      title: WELCOME_STRINGS.feature1Title,
      description: WELCOME_STRINGS.feature1Desc,
      icon: Stethoscope,
      iconBg: 'bg-primary/10 text-primary dark:bg-primary/20',
    },
    {
      title: WELCOME_STRINGS.feature2Title,
      description: WELCOME_STRINGS.feature2Desc,
      icon: Users,
      iconBg: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/20',
    },
    {
      title: WELCOME_STRINGS.feature3Title,
      description: WELCOME_STRINGS.feature3Desc,
      icon: Activity,
      iconBg: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors selection:bg-primary-muted selection:text-primary">
      {/* Ambient background glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -right-32 h-[550px] w-[550px] rounded-full bg-primary/10 blur-[140px] dark:bg-primary/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -left-32 h-[550px] w-[550px] rounded-full bg-rose-400/10 blur-[140px] dark:bg-purple-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/8 blur-[140px] dark:bg-sky-900/15"
      />

      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-surface/80 px-4 py-4 backdrop-blur-xl sm:px-8 transition-colors">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground shadow-md shadow-primary/25">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {WELCOME_STRINGS.brandName}
              </span>
              <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                {WELCOME_STRINGS.adminPortal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/25 transition hover:opacity-95"
              >
                <span>{WELCOME_STRINGS.btnDashboard}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs shadow-primary/25 transition hover:opacity-95"
              >
                <span>{WELCOME_STRINGS.btnLogin}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary dark:bg-primary/10 mb-6 backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{WELCOME_STRINGS.badge}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
            {WELCOME_STRINGS.heroTitle}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            {WELCOME_STRINGS.heroSubtitle}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => router.push(isAuthenticated ? '/dashboard' : '/login')}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-95 sm:w-auto"
            >
              <span>{isAuthenticated ? WELCOME_STRINGS.btnDashboard : WELCOME_STRINGS.btnGetStarted}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-text-muted">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>{WELCOME_STRINGS.securityBadge}</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <section id="features" className="mt-20 sm:mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {WELCOME_STRINGS.featuresHeading}
            </h2>
            <p className="mt-2 text-xs text-text-secondary sm:text-sm">
              {WELCOME_STRINGS.featuresSubheading}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/85 p-7 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon size={24} strokeWidth={2.2} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-xs text-text-muted sm:mt-28 sm:flex-row">
          <p>{WELCOME_STRINGS.footerCopyright(currentYear)}</p>
          <p>MediTrack · Healthcare management made simpler.</p>
        </footer>
      </main>
    </div>
  );
}
