'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface LoginResponse {
  success: boolean;
  message: string;
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
      await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      router.replace('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-[#17243b] p-12 text-white md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Activity size={25} />
              </div>
              <span className="text-xl font-bold tracking-tight">Doctor Tracker</span>
            </div>

            <div className="mt-24">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Administration
              </p>

              <h1 className="mt-5 text-4xl font-bold leading-tight">
                Manage healthcare operations with clarity.
              </h1>

              <p className="mt-6 max-w-sm leading-7 text-slate-300">
                A centralized workspace to manage doctors, patients, and healthcare records.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400">Doctor Tracker · Admin Portal</p>
        </section>

        <section className="flex flex-col justify-center px-7 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 md:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17243b] text-white">
                  <Activity size={24} />
                </div>
                <span className="text-xl font-bold text-[#17243b]">Doctor Tracker</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#4f6df5]">ADMIN PORTAL</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17243b]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f6df5] focus:ring-4 focus:ring-[#4f6df5]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4f6df5] focus:ring-4 focus:ring-[#4f6df5]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#4f6df5] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#405ce0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in to dashboard'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Restricted access · Authorized administrators only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
