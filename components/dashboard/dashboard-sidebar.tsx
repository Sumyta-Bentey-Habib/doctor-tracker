'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DASHBOARD_STRINGS, getDashboardInitials } from '@/utils';

interface DashboardSidebarProps {
  adminName: string;
  adminEmail: string;
  totalPatients?: number;
  mobileMenuOpen: boolean;
  logoutLoading: boolean;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { label: DASHBOARD_STRINGS.navOverview, href: '/dashboard', icon: LayoutDashboard },
  { label: DASHBOARD_STRINGS.navDoctors, href: '/doctors', icon: Stethoscope },
  { label: DASHBOARD_STRINGS.navPatients, href: '/patients', icon: Users },
] as const;

export function DashboardSidebar({
  adminName,
  adminEmail,
  totalPatients,
  mobileMenuOpen,
  logoutLoading,
  onCloseMobileMenu,
  onLogout,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initials = getDashboardInitials(adminName);

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border/70 bg-surface/95 text-foreground backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
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
            onClick={onCloseMobileMenu}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-hover lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main navigation */}
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
                    onCloseMobileMenu();
                    if (!isActive) {
                      router.push(item.href);
                    }
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

        {/* Preferences Section: Theme Mode Switcher */}
        <div className="mt-6 px-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-wider text-text-muted">
            {DASHBOARD_STRINGS.preferences}
          </p>

          <div className="mb-2 px-1">
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>

          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-xs font-semibold text-text-muted opacity-50"
          >
            <Settings size={17} />
            <span>{DASHBOARD_STRINGS.navSettings}</span>
          </button>
        </div>

        {/* Footer: Assistance & Admin profile */}
        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-border/70 bg-surface-secondary/80 p-3.5 shadow-2xs">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <Activity size={16} />
            </div>

            <p className="text-xs font-bold text-foreground">
              {DASHBOARD_STRINGS.needAssistance}
            </p>
            <p className="mt-1 text-[11px] leading-4 text-text-muted">
              {DASHBOARD_STRINGS.assistanceText}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-hover text-xs font-bold text-primary-foreground shadow-xs">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{adminName}</p>
              <p className="truncate text-[10px] text-text-muted">{adminEmail}</p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={logoutLoading}
              title={DASHBOARD_STRINGS.logout}
              aria-label={DASHBOARD_STRINGS.logout}
              className="rounded-xl p-2 text-text-muted transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

