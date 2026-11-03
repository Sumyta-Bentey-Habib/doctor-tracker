import { Users } from 'lucide-react';
import { PATIENT_STRINGS } from '@/utils';

interface PatientStatsProps {
  totalPatients: number;
}

export function PatientStats({ totalPatients }: PatientStatsProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted text-primary">
          <Users size={23} />
        </div>
        <div>
          <p className="text-sm text-text-secondary">{PATIENT_STRINGS.totalRegistered}</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{totalPatients}</p>
        </div>
      </div>
    </section>
  );
}

