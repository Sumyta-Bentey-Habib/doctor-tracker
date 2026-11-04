import { Calendar, Filter, Search } from 'lucide-react';
import { DOCTOR_STRINGS } from '@/utils';

interface DoctorFiltersProps {
  search: string;
  specialization: string;
  hospital: string;
  startDate?: string;
  endDate?: string;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DoctorFilters({
  search,
  specialization,
  hospital,
  startDate = '',
  endDate = '',
  onSearchChange,
  onSpecializationChange,
  onHospitalChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: DoctorFiltersProps) {
  const hasActiveFilters = Boolean(
    search || specialization || hospital || startDate || endDate
  );

  return (
    <section className="rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">{DOCTOR_STRINGS.filterHeading}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex h-11 items-center gap-2.5 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={DOCTOR_STRINGS.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-hidden placeholder:text-text-muted"
          />
        </div>

        <input
          value={specialization}
          onChange={(event) => onSpecializationChange(event.target.value)}
          placeholder={DOCTOR_STRINGS.specializationPlaceholder}
          className="h-11 rounded-full border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden placeholder:text-text-muted shadow-xs transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />

        <input
          value={hospital}
          onChange={(event) => onHospitalChange(event.target.value)}
          placeholder={DOCTOR_STRINGS.hospitalPlaceholder}
          className="h-11 rounded-full border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden placeholder:text-text-muted shadow-xs transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />

        <div className="flex h-11 items-center gap-2 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Calendar size={14} className="shrink-0 text-text-muted" />
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            placeholder={DOCTOR_STRINGS.startDatePlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-hidden placeholder:text-text-muted"
            title={DOCTOR_STRINGS.startDatePlaceholder}
          />
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Calendar size={14} className="shrink-0 text-text-muted" />
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            placeholder={DOCTOR_STRINGS.endDatePlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-hidden placeholder:text-text-muted"
            title={DOCTOR_STRINGS.endDatePlaceholder}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-3.5 text-xs font-bold text-primary hover:underline"
        >
          {DOCTOR_STRINGS.clearAllFilters}
        </button>
      )}
    </section>
  );
}
