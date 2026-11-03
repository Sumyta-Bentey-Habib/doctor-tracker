'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DASHBOARD_STRINGS, formatCurrentDate, getDashboardInitials } from '@/utils';

interface AppShellProps {
  adminName: string;
  adminEmail: string;
  totalPatients?: number;
  totalDoctors?: number;
  onLogout: () => void;
  logoutLoading?: boolean;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: DASHBOARD_STRINGS.navOverview, href: '/dashboard', icon: LayoutDashboard },
  { label: DASHBOARD_STRINGS.navDoctors, href: '/doctors', icon: Stethoscope },
  { label: DASHBOARD_STRINGS.navPatients, href: '/patients', icon: Users },
] as const;

export function AppShell({
  adminName,
  adminEmail,
  totalPatients,
  onLogout,
  logoutLoading = false,
  children,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const initials = getDashboardInitials(adminName);
  const today = formatCurrentDate();

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors selection:bg-primary-muted selection:text-primary">
      {/* Ethereal background gradient ambient glow (inspiration aesthetic) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[130px] dark:bg-primary/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-rose-400/10 blur-[140px] dark:bg-purple-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-sky-400/8 blur-[130px] dark:bg-sky-900/15"
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border/70 bg-surface/95 text-foreground backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-border/60 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground shadow-md shadow-primary/20">
              <Activity size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-foreground">
                {DASHBOARD_STRINGS.brandName}
              </h1>
              <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                {DASHBOARD_STRINGS.adminPortal}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-hover"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-wider text-text-muted">
            {DASHBOARD_STRINGS.mainMenu}
          </p>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!isActive) router.push(item.href);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {item.label === DASHBOARD_STRINGS.navPatients &&
                    totalPatients !== undefined && (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-surface-secondary text-text-muted'
                        }`}
                      >
                        {totalPatients}
                      </span>
                    )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Preferences & Theme */}
        <div className="mt-6 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-wider text-text-muted">
            {DASHBOARD_STRINGS.preferences}
          </p>
          <div className="px-1">
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>
        </div>

        {/* Mobile User Profile & Logout */}
        <div className="mt-auto border-t border-border/60 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-secondary/70 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-xs font-bold text-primary-foreground shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{adminName}</p>
              <p className="truncate text-[10px] text-text-muted">{adminEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            disabled={logoutLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/80 bg-surface/90 py-2.5 text-xs font-bold text-danger hover:bg-danger-bg hover:border-danger/30 transition disabled:opacity-50"
          >
            <LogOut size={15} />
            <span>{DASHBOARD_STRINGS.logout}</span>
          </button>
        </div>
      </aside>

      {/* Top Floating Glass Navigation Bar (matching Inspiration Image) */}
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-surface/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8 transition-colors">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface text-text-secondary hover:bg-surface-hover lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>

            <div
              onClick={() => router.push('/dashboard')}
              className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary-hover text-primary-foreground shadow-md shadow-primary/20">
                <Activity size={22} strokeWidth={2.5} />
              </div>

              <div>
                <span className="text-[17px] font-bold tracking-tight text-foreground">
                  {DASHBOARD_STRINGS.brandName}
                </span>
                <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                  {DASHBOARD_STRINGS.adminPortal}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Floating Pill Navigation (Dashboard, Doctors, Patients) */}
          <nav className="hidden items-center rounded-full border border-border/80 bg-surface-secondary/70 p-1 backdrop-blur-md shadow-xs md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-surface text-primary shadow-xs font-bold'
                      : 'text-text-secondary hover:text-foreground hover:bg-surface/50'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-primary' : 'text-text-muted'} />
                  <span>{item.label}</span>
                  {item.label === DASHBOARD_STRINGS.navPatients && totalPatients !== undefined && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-hover text-text-muted'
                      }`}
                    >
                      {totalPatients}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Date, Theme Switcher, Notifications & User Avatar Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Date pill */}
            <div className="hidden items-center gap-2 rounded-xl border border-border/70 bg-surface/70 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-xs backdrop-blur-md lg:flex">
              <CalendarDays size={14} className="text-primary" />
              <span>{today}</span>
            </div>

            {/* Light / Dark Mode Preference Toggle */}
            <ThemeToggle />

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-border/70 bg-surface/80 p-1 pl-1 pr-3 shadow-xs backdrop-blur-md transition hover:border-primary/40"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-[11px] font-bold text-primary-foreground shadow-xs">
                  {initials}
                </div>
                <span className="hidden max-w-[100px] truncate text-xs font-semibold text-foreground sm:inline-block">
                  {adminName}
                </span>
                <ChevronDown size={14} className="text-text-muted" />
              </button>

              {/* Profile Popover / Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-40 w-64 rounded-3xl border border-border/80 bg-surface/95 p-4 shadow-xl backdrop-blur-2xl">
                    <div className="border-b border-border/50 pb-3">
                      <p className="truncate text-xs font-bold text-foreground">{adminName}</p>
                      <p className="truncate text-[11px] text-text-muted">{adminEmail}</p>
                      <span className="mt-1.5 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {DASHBOARD_STRINGS.administrator}
                      </span>
                    </div>

                    <div className="py-3">
                      <p className="mb-2 text-[10px] font-bold tracking-wider text-text-muted">
                        {DASHBOARD_STRINGS.preferences}
                      </p>
                      <ThemeToggle variant="segmented" className="w-full justify-between" />
                    </div>

                    <div className="border-t border-border/50 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        disabled={logoutLoading}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-danger hover:bg-danger-bg transition disabled:opacity-50"
                      >
                        <LogOut size={15} />
                        <span>{DASHBOARD_STRINGS.logout}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

