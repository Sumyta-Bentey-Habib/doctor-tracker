'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';
import { LOGIN_STRINGS } from '@/utils';

interface AuthResponse {
  success: boolean;
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      router.replace('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground transition-colors selection:bg-primary-muted selection:text-primary">
      {/* Ambient background glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[140px] dark:bg-primary/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-rose-400/10 blur-[140px] dark:bg-purple-900/20"
      />

      {/* Top controls: Back to Welcome & Theme Switcher */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/85 px-4 py-2 text-xs font-semibold text-text-secondary shadow-xs backdrop-blur-md transition hover:bg-surface-hover hover:text-foreground"
        >
          <ArrowLeft size={14} />
          <span>{LOGIN_STRINGS.backToWelcome}</span>
        </button>

        <ThemeToggle />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-surface/90 shadow-2xl backdrop-blur-2xl md:grid-cols-2">
        {/* Left Brand Side */}
        <section className="hidden flex-col justify-between border-r border-border/60 bg-surface-secondary/70 p-12 text-foreground md:flex">
          <div>
            <div
              onClick={() => router.push('/')}
              className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground shadow-md shadow-primary/25">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {LOGIN_STRINGS.brandName}
                </span>
                <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                  {LOGIN_STRINGS.adminPortal}
                </p>
              </div>
            </div>

            <div className="mt-20">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-primary dark:bg-primary/20">
                ADMINISTRATION
              </span>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
                {LOGIN_STRINGS.sideTitle}
              </h1>

              <p className="mt-5 max-w-sm text-xs leading-relaxed text-text-secondary sm:text-sm">
                {LOGIN_STRINGS.sideSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Encrypted Administrator Session</span>
          </div>
        </section>

        {/* Right Form Side */}
        <section className="flex flex-col justify-center px-7 py-16 sm:px-12">
          <div className="mx-auto w-full max-w-sm">
            {/* Mobile Brand */}
            <div className="mb-8 md:hidden">
              <div
                onClick={() => router.push('/')}
                className="flex cursor-pointer items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground shadow-md shadow-primary/25">
                  <Activity size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    {LOGIN_STRINGS.brandName}
                  </span>
                  <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                    {LOGIN_STRINGS.adminPortal}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                {LOGIN_STRINGS.adminPortal}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {LOGIN_STRINGS.heading}
              </h2>

              <p className="mt-1.5 text-xs text-text-secondary">
                {LOGIN_STRINGS.subheading}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold text-text-secondary"
                >
                  {LOGIN_STRINGS.labelEmail}
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={LOGIN_STRINGS.placeholderEmail}
                    className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 pl-11 pr-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold text-text-secondary"
                >
                  {LOGIN_STRINGS.labelPassword}
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={LOGIN_STRINGS.placeholderPassword}
                    className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 pl-11 pr-11 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-danger/20 bg-danger-bg px-4 py-2.5 text-xs font-semibold text-danger"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-5 py-3 text-xs font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? LOGIN_STRINGS.btnSigningIn : LOGIN_STRINGS.btnSignIn}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-text-muted">
              {LOGIN_STRINGS.restrictedNotice}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
