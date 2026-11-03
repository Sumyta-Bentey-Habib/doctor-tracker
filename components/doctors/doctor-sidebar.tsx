import { useRouter } from 'next/navigation';
import {
  Activity,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { DOCTOR_STRINGS, getDoctorInitials } from '@/utils';

interface DoctorSidebarProps {
  adminName: string;
  adminEmail: string;
  mobileMenuOpen: boolean;
  logoutLoading: boolean;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

const NAVIGATION_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Doctors', icon: Stethoscope, href: '/doctors' },
  { label: 'Patients', icon: Users, href: '/patients' },
] as const;

export function DoctorSidebar({
  adminName,
  adminEmail,
  mobileMenuOpen,
  logoutLoading,
  onCloseMobileMenu,
  onLogout,
}: DoctorSidebarProps) {
  const router = useRouter();
  const initials = getDoctorInitials(adminName);

  return (
    <>
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-text-inverse transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-text-inverse/10 px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity size={23} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight">
                {DOCTOR_STRINGS.brandName}
              </h1>
              <p className="text-[10px] tracking-[2px] text-text-muted">
                {DOCTOR_STRINGS.adminPortal}
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobileMenu}
            className="rounded-lg p-2 text-text-muted hover:bg-text-inverse/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-text-muted">
            {DOCTOR_STRINGS.mainMenu}
          </p>

          <nav className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === 'Doctors';

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onCloseMobileMenu();
                    if (!isActive) {
                      router.push(item.href);
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-text-muted hover:bg-text-inverse/5 hover:text-text-inverse'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-5">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-text-muted">
            {DOCTOR_STRINGS.preferences}
          </p>

          <button
            disabled
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium text-text-muted opacity-50"
          >
            <Settings size={19} />
            {DOCTOR_STRINGS.settings}
          </button>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-text-inverse/10 bg-text-inverse/5 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Activity size={18} />
            </div>

            <p className="text-xs font-semibold">{DOCTOR_STRINGS.needAssistance}</p>
            <p className="mt-1 text-[11px] leading-5 text-text-muted">
              {DOCTOR_STRINGS.assistanceText}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-text-inverse/10 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-text-inverse">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{adminName}</p>
              <p className="truncate text-[10px] text-text-muted">{adminEmail}</p>
            </div>

            <button
              onClick={onLogout}
              disabled={logoutLoading}
              title={DOCTOR_STRINGS.logout}
              aria-label={DOCTOR_STRINGS.logout}
              className="rounded-lg p-2 text-text-muted transition hover:bg-text-inverse/10 hover:text-text-inverse disabled:opacity-50"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

