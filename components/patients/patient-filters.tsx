import { Search } from 'lucide-react';
import { PATIENT_STRINGS } from '@/utils';

interface PatientFiltersProps {
  search: string;
  condition: string;
  onSearchChange: (value: string) => void;
  onConditionChange: (value: string) => void;
}

export function PatientFilters({
  search,
  condition,
  onSearchChange,
  onConditionChange,
}: PatientFiltersProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4">
        <h2 className="font-semibold text-foreground">{PATIENT_STRINGS.filterHeading}</h2>
        <p className="mt-1 text-xs text-text-secondary">
          {PATIENT_STRINGS.filterSubheading}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_260px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={PATIENT_STRINGS.searchPlaceholder}
            className="w-full rounded-xl border border-border bg-surface px-10 py-3 text-sm text-foreground outline-none transition placeholder:text-text-muted focus:border-primary"
          />
        </div>

        <input
          type="text"
          value={condition}
          onChange={(event) => onConditionChange(event.target.value)}
          placeholder={PATIENT_STRINGS.conditionPlaceholder}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-text-muted focus:border-primary"
        />
      </div>
    </section>
  );
}

