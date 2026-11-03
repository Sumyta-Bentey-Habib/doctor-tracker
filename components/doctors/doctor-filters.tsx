import { Filter, Search } from 'lucide-react';
import { DOCTOR_STRINGS } from '@/utils';

interface DoctorFiltersProps {
  search: string;
  specialization: string;
  hospital: string;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DoctorFilters({
  search,
  specialization,
  hospital,
  onSearchChange,
  onSpecializationChange,
  onHospitalChange,
  onClearFilters,
}: DoctorFiltersProps) {
  const hasActiveFilters = Boolean(search || specialization || hospital);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={16} className="text-text-secondary" />
        <h3 className="text-sm font-bold text-foreground">{DOCTOR_STRINGS.filterHeading}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex h-11 items-center gap-2 rounded-xl border border-border px-3">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={DOCTOR_STRINGS.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-text-muted"
          />
        </div>

        <input
          value={specialization}
          onChange={(event) => onSpecializationChange(event.target.value)}
          placeholder={DOCTOR_STRINGS.specializationPlaceholder}
          className="h-11 rounded-xl border border-border bg-transparent px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
        />

        <input
          value={hospital}
          onChange={(event) => onHospitalChange(event.target.value)}
          placeholder={DOCTOR_STRINGS.hospitalPlaceholder}
          className="h-11 rounded-xl border border-border bg-transparent px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-3 text-xs font-semibold text-primary hover:underline"
        >
          {DOCTOR_STRINGS.clearAllFilters}
        </button>
      )}
    </section>
  );
}

