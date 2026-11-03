import { DOCTOR_STRINGS } from '@/utils';

export function DoctorFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-text-muted sm:flex-row">
      <p>{DOCTOR_STRINGS.copyright(currentYear)}</p>
      <p>{DOCTOR_STRINGS.footerTagline}</p>
    </footer>
  );
}

