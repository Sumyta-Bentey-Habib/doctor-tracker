import { useRouter } from 'next/navigation';
import { Activity, LayoutDashboard, LogOut, Stethoscope, Users, X } from 'lucide-react';
import { PATIENT_STRINGS } from '@/utils';

interface PatientSidebarProps {
  userName: string;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

export function PatientSidebar({
  userName,
  mobileMenuOpen,
  onCloseMobileMenu,
  onLogout,
}: PatientSidebarProps) {
  const router = useRouter();
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'A';

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-text-inverse transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-text-inverse/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Activity size={21} />
          </div>
          <div>
            <p className="text-lg font-bold">Care Guide</p>
            <p className="text-xs text-text-inverse/60">Admin Dashboard</p>
          </div>
          <button
            type="button"
            className="ml-auto rounded-lg p-2 hover:bg-text-inverse/10 lg:hidden"
            onClick={onCloseMobileMenu}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-text-inverse/40">
            {PATIENT_STRINGS.navMenu}
          </p>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-inverse/70 transition hover:bg-text-inverse/10 hover:text-text-inverse"
            >
              <LayoutDashboard size={19} />
              {PATIENT_STRINGS.navOverview}
            </button>

            <button
              type="button"
              onClick={() => router.push('/doctors')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-inverse/70 transition hover:bg-text-inverse/10 hover:text-text-inverse"
            >
              <Stethoscope size={19} />
              {PATIENT_STRINGS.navDoctors}
            </button>

            <button
              type="button"
              onClick={onCloseMobileMenu}
              className="flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-3 text-sm font-medium text-primary-foreground"
            >
              <Users size={19} />
              {PATIENT_STRINGS.navPatients}
            </button>
          </nav>
        </div>

        <div className="mt-auto border-t border-text-inverse/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-text-inverse/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="text-xs text-text-inverse/50">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-inverse/70 transition hover:bg-text-inverse/10 hover:text-text-inverse"
          >
            <LogOut size={18} />
            {PATIENT_STRINGS.signOut}
          </button>
        </div>
      </aside>
    </>
  );
}

