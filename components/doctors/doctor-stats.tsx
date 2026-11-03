import { Stethoscope } from 'lucide-react';
import { DOCTOR_STRINGS } from '@/utils';

interface DoctorStatsProps {
  totalDoctors: number;
}

export function DoctorStats({ totalDoctors }: DoctorStatsProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted text-primary">
          <Stethoscope size={22} />
        </div>

        <div>
          <p className="text-xs font-medium text-text-secondary">
            {DOCTOR_STRINGS.totalRegisteredDoctors}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalDoctors.toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}

