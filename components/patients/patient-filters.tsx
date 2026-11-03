import { Filter, Search } from 'lucide-react';
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
    <section className="rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">{PATIENT_STRINGS.filterHeading}</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_280px]">
        <div className="flex h-11 items-center gap-2.5 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={PATIENT_STRINGS.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-hidden placeholder:text-text-muted"
          />
        </div>

        <input
          type="text"
          value={condition}
          onChange={(event) => onConditionChange(event.target.value)}
          placeholder={PATIENT_STRINGS.conditionPlaceholder}
          className="h-11 rounded-full border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden placeholder:text-text-muted shadow-xs transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </section>
  );
}
