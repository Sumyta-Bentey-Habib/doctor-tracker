import { Menu, Plus } from 'lucide-react';
import { formatCurrentDate, PATIENT_STRINGS } from '@/utils';

interface PatientHeaderProps {
  onOpenMobileMenu: () => void;
  onAddPatient: () => void;
  canAddPatient: boolean;
}

export function PatientHeader({
  onOpenMobileMenu,
  onAddPatient,
  canAddPatient,
}: PatientHeaderProps) {
  const currentDate = formatCurrentDate();

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 hover:bg-surface-hover lg:hidden"
            onClick={onOpenMobileMenu}
          >
            <Menu size={21} />
          </button>
          <div>
            <p className="text-xs font-medium text-text-secondary">
              {PATIENT_STRINGS.adminBadge}
            </p>
            <p className="text-sm font-semibold">{PATIENT_STRINGS.pageTitle}</p>
          </div>
        </div>

        <p className="hidden text-sm text-text-secondary sm:block">{currentDate}</p>
      </header>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {PATIENT_STRINGS.heading}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {PATIENT_STRINGS.subheading}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddPatient}
          disabled={!canAddPatient}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          {PATIENT_STRINGS.addPatient}
        </button>
      </section>
    </>
  );
}

