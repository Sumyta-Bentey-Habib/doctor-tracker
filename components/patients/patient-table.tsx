import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { Patient } from '@/types';
import { formatDate, getDoctor, getPatientInitials, PATIENT_STRINGS } from '@/utils';

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  error: string;
  deletingId: string | null;
  page: number;
  totalPages: number;
  totalPatients: number;
  onPageChange: (newPage: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientTable({
  patients,
  loading,
  error,
  deletingId,
  page,
  totalPages,
  totalPatients,
  onPageChange,
  onEdit,
  onDelete,
}: PatientTableProps) {
  return (
    <section className="relative z-10 overflow-hidden rounded-3xl border border-border/70 bg-surface/85 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">{PATIENT_STRINGS.recordsHeading}</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            {PATIENT_STRINGS.recordsSubheading}
          </p>
        </div>
        <p className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
          {totalPatients} {totalPatients === 1 ? PATIENT_STRINGS.patientWord : PATIENT_STRINGS.patientsWord} found
        </p>
      </div>

      {error && (
        <div className="mx-6 mb-4 rounded-2xl border border-danger/20 bg-danger-bg px-4 py-3 text-xs font-semibold text-danger">
          {error}
        </div>
      )}

      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border/50 bg-surface-secondary/60">
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colPatient}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colAgeGender}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colCondition}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colDoctor}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colContact}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted">{PATIENT_STRINGS.colJoined}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted text-right">{PATIENT_STRINGS.colActions}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-xs text-text-muted">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>{PATIENT_STRINGS.loadingPatients}</span>
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-xs text-text-muted">
                  <p className="font-semibold text-foreground">{PATIENT_STRINGS.noPatientsTitle}</p>
                  <p className="mt-1 text-text-secondary">{PATIENT_STRINGS.noPatientsDescription}</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const assignedDoctor = getDoctor(patient);
                const initials = getPatientInitials(patient.name);

                return (
                  <tr
                    key={patient._id}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-surface-hover/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500/20 to-sky-200 text-xs font-bold text-sky-600 shadow-xs dark:text-sky-400">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{patient.name}</p>
                          <p className="font-mono text-[11px] text-text-muted">{patient._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      {patient.age} {PATIENT_STRINGS.years} • {patient.gender}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary dark:bg-primary/20">
                        {patient.condition}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      {assignedDoctor ? (
                        <div>
                          <p className="font-semibold text-foreground">{assignedDoctor.name}</p>
                          <p className="text-[11px] text-text-muted">{assignedDoctor.specialization}</p>
                        </div>
                      ) : (
                        <span className="text-text-muted">{PATIENT_STRINGS.doctorUnavailable}</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-text-secondary">{patient.phone}</td>

                    <td className="px-6 py-4 text-xs text-text-secondary">{formatDate(patient.createdAt)}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(patient)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:border-primary/50 hover:text-primary"
                          title={PATIENT_STRINGS.editPatientTitle}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === patient._id}
                          onClick={() => onDelete(patient)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:border-danger/50 hover:text-danger disabled:opacity-40"
                          title={PATIENT_STRINGS.deletePatientTitle}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-xs text-text-muted">
          {PATIENT_STRINGS.showingPrefix}{' '}
          <span className="font-bold text-foreground">{patients.length}</span>{' '}
          {PATIENT_STRINGS.showingOf}{' '}
          <span className="font-bold text-foreground">{totalPatients}</span>{' '}
          {PATIENT_STRINGS.patientsWord}
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
            {PATIENT_STRINGS.pageWord} {page} {PATIENT_STRINGS.showingOf} {totalPages}
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
