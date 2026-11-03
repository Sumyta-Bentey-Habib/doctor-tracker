'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  DASHBOARD_STRINGS,
  formatDashboardDate,
  getDashboardInitials,
} from '@/utils';

export interface DashboardPatientRow {
  _id: string;
  name: string;
  phone: string;
  condition: string;
  createdAt: string;
  doctorName: string;
}

interface DashboardRecentPatientsProps {
  patients: DashboardPatientRow[];
  totalPatients: number;
  page: number;
  totalPages: number;
  searchQuery: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (newPage: number) => void;
}

export function DashboardRecentPatients({
  patients,
  totalPatients,
  page,
  totalPages,
  searchQuery,
  loading,
  onSearchChange,
  onPageChange,
}: DashboardRecentPatientsProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-surface/85 shadow-card backdrop-blur-xl transition-all">
      {/* Table Header & Search */}
      <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {DASHBOARD_STRINGS.recentPatientsTitle}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {DASHBOARD_STRINGS.recentPatientsSubtitle}
          </p>
        </div>

        {/* Pill Search Input */}
        <div className="flex h-10 items-center gap-2.5 rounded-full border border-border/70 bg-surface/90 px-3.5 shadow-xs transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 sm:w-64">
          <Search size={15} className="shrink-0 text-text-muted" />
          <input
            type="text"
            placeholder={DASHBOARD_STRINGS.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-hidden placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border/50 bg-surface-secondary/60">
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">
                {DASHBOARD_STRINGS.colPatient}
              </th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">
                {DASHBOARD_STRINGS.colPatientId}
              </th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">
                {DASHBOARD_STRINGS.colDoctor}
              </th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">
                {DASHBOARD_STRINGS.colCondition}
              </th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">
                {DASHBOARD_STRINGS.colRegistered}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-xs text-text-muted"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>{DASHBOARD_STRINGS.loadingPatients}</span>
                  </div>
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => {
                const initials = getDashboardInitials(patient.name);

                return (
                  <tr
                    key={patient._id}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-surface-hover/70"
                  >
                    {/* Patient Name + Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 to-primary-muted text-xs font-bold text-primary shadow-xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-foreground">
                            {patient.name}
                          </p>
                          <p className="truncate text-[11px] text-text-muted">
                            {patient.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      <span className="font-mono text-[11px]">
                        {patient._id.slice(-8)}
                      </span>
                    </td>

                    {/* Doctor Assigned */}
                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      <span className="inline-flex items-center rounded-lg bg-surface-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        {patient.doctorName}
                      </span>
                    </td>

                    {/* Medical Condition Pill */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary dark:bg-primary/20">
                        {patient.condition}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      {formatDashboardDate(patient.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-xs text-text-muted"
                >
                  {DASHBOARD_STRINGS.noPatientsFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col justify-between gap-3 border-t border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-xs text-text-muted">
          {DASHBOARD_STRINGS.showing}{' '}
          <span className="font-bold text-foreground">{patients.length}</span>{' '}
          {DASHBOARD_STRINGS.of}{' '}
          <span className="font-bold text-foreground">{totalPatients}</span>{' '}
          {DASHBOARD_STRINGS.patientsWord}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="px-2 text-xs font-semibold text-text-secondary">
            {DASHBOARD_STRINGS.pageWord} {page} {DASHBOARD_STRINGS.of} {totalPages}
          </span>

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

