import { Users } from 'lucide-react';
import { PATIENT_STRINGS } from '@/utils';

interface PatientStatsProps {
  totalPatients: number;
}

export function PatientStats({ totalPatients }: PatientStatsProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 shadow-xs">
          <Users size={24} strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-secondary">{PATIENT_STRINGS.totalRegistered}</p>
          <p className="mt-1 text-3xl font-black tracking-tight text-foreground">{totalPatients.toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}
