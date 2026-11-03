'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Stethoscope,
  Users,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DASHBOARD_STRINGS, formatCurrentDate, getDashboardInitials } from '@/utils';

interface DashboardHeaderProps {
  adminName: string;
  totalPatients?: number;
  totalDoctors?: number;
  onOpenMobileMenu: () => void;
}

const NAV_ITEMS = [
  { label: DASHBOARD_STRINGS.navOverview, href: '/dashboard', icon: LayoutDashboard },
  { label: DASHBOARD_STRINGS.navDoctors, href: '/doctors', icon: Stethoscope },
  { label: DASHBOARD_STRINGS.navPatients, href: '/patients', icon: Users },
] as const;

export function DashboardHeader({
  adminName,
  totalPatients,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initials = getDashboardInitials(adminName);
  const today = formatCurrentDate();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-surface/80 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        {/* Left: Mobile menu toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
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

            <div className="hidden sm:block">
              <span className="text-[17px] font-bold tracking-tight text-foreground">
                {DASHBOARD_STRINGS.brandName}
              </span>
              <p className="text-[9px] font-semibold tracking-[1.5px] text-text-muted">
                {DASHBOARD_STRINGS.adminPortal}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Modern Floating Pill Navigation */}
        <nav className="hidden items-center rounded-full border border-border/80 bg-surface-secondary/70 p-1 backdrop-blur-md shadow-xs md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-surface text-primary shadow-xs font-bold'
                    : 'text-text-secondary hover:text-foreground hover:bg-surface/50'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-primary' : 'text-text-muted'} />
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

        {/* Right: Date, Theme Toggle, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Date pill */}
          <div className="hidden items-center gap-2 rounded-xl border border-border/70 bg-surface/70 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-xs backdrop-blur-md lg:flex">
            <CalendarDays size={14} className="text-primary" />
            <span>{today}</span>
          </div>

          {/* Theme Preference Switcher */}
          <ThemeToggle />

          {/* User profile avatar badge */}
          <div className="flex items-center gap-2.5 rounded-full border border-border/70 bg-surface/80 p-1 pl-1 pr-3 shadow-xs backdrop-blur-md">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-[11px] font-bold text-primary-foreground shadow-xs">
              {initials}
            </div>
            <span className="hidden max-w-[100px] truncate text-xs font-semibold text-foreground sm:inline-block">
              {adminName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

