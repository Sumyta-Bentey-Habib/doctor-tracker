import { Stethoscope } from 'lucide-react';
import { DOCTOR_STRINGS } from '@/utils';

interface DoctorStatsProps {
  totalDoctors: number;
}

export function DoctorStats({ totalDoctors }: DoctorStatsProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 shadow-xs">
          <Stethoscope size={24} strokeWidth={2.2} />
        </div>

        <div>
          <p className="text-xs font-semibold text-text-secondary">
            {DOCTOR_STRINGS.totalRegisteredDoctors}
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-foreground">
            {totalDoctors.toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}
