import { Menu, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { DOCTOR_STRINGS, formatLongDate, getDoctorInitials } from '@/utils';

interface DoctorHeaderProps {
  adminName: string;
  onOpenMobileMenu: () => void;
  onAddDoctor: () => void;
}

export function DoctorHeader({
  adminName,
  onOpenMobileMenu,
  onAddDoctor,
}: DoctorHeaderProps) {
  const currentDate = formatLongDate();
  const initials = getDoctorInitials(adminName);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover lg:hidden"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div>
            <h2 className="text-[18px] font-bold tracking-tight text-foreground sm:text-xl">
              {DOCTOR_STRINGS.doctors}
            </h2>
            <p className="mt-0.5 hidden text-[11px] text-text-muted sm:block">
              {DOCTOR_STRINGS.headerBadge}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3 py-2 text-xs text-text-secondary sm:flex">
            {currentDate}
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-foreground">{adminName}</p>
              <p className="text-[10px] text-text-muted">{DOCTOR_STRINGS.administrator}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium text-primary">
            {DOCTOR_STRINGS.headingBadge}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
            {DOCTOR_STRINGS.heading}
          </h2>
          <p className="mt-2 text-[13px] text-text-secondary">
            {DOCTOR_STRINGS.subheading}
          </p>
        </div>

        <button
          onClick={onAddDoctor}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <Plus size={17} />
          {DOCTOR_STRINGS.addDoctor}
        </button>
      </section>
    </>
  );
}

