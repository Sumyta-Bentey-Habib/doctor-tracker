import { ChevronLeft, ChevronRight, Pencil, Trash2, Users } from 'lucide-react';
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
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex flex-col justify-between gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-foreground">{PATIENT_STRINGS.recordsHeading}</h2>
          <p className="mt-1 text-xs text-text-secondary">
            {PATIENT_STRINGS.recordsSubheading}
          </p>
        </div>
        <p className="text-sm text-text-secondary">
          {totalPatients} {totalPatients === 1 ? PATIENT_STRINGS.patientWord : PATIENT_STRINGS.patientsWord} found
        </p>
      </div>

      {error && (
        <div className="m-5 rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-surface-secondary">
            <tr className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-4">{PATIENT_STRINGS.colPatient}</th>
              <th className="px-5 py-4">{PATIENT_STRINGS.colAgeGender}</th>
              <th className="px-5 py-4">{PATIENT_STRINGS.colCondition}</th>
              <th className="px-5 py-4">{PATIENT_STRINGS.colDoctor}</th>
              <th className="px-5 py-4">{PATIENT_STRINGS.colContact}</th>
              <th className="px-5 py-4">{PATIENT_STRINGS.colJoined}</th>
              <th className="px-5 py-4 text-right">{PATIENT_STRINGS.colActions}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                  <p className="mt-3 text-sm text-text-secondary">
                    {PATIENT_STRINGS.loadingPatients}
                  </p>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <Users className="mx-auto text-text-muted" size={30} />
                  <p className="mt-3 font-medium text-foreground">
                    {PATIENT_STRINGS.noPatientsTitle}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {PATIENT_STRINGS.noPatientsDescription}
                  </p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const doctor = getDoctor(patient);
                const initials = getPatientInitials(patient.name);

                return (
                  <tr key={patient._id} className="transition hover:bg-surface-secondary">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-bold text-primary">
                          {initials}
                        </div>
                        <span className="font-semibold text-foreground">{patient.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {patient.age} {PATIENT_STRINGS.years}
                      <span className="mt-1 block text-xs text-text-muted">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-info-bg px-3 py-1 text-xs font-medium text-info">
                        {patient.condition}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {doctor ? (
                        <>
                          <p className="text-sm font-medium text-foreground">{doctor.name}</p>
                          <p className="mt-1 text-xs text-text-secondary">
                            {doctor.specialization}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-text-muted">
                          {PATIENT_STRINGS.doctorUnavailable}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-text-secondary">{patient.phone}</td>

                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {formatDate(patient.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title={PATIENT_STRINGS.editPatientTitle}
                          onClick={() => onEdit(patient)}
                          className="rounded-lg p-2 text-text-secondary transition hover:bg-primary-muted hover:text-primary"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          title={PATIENT_STRINGS.deletePatientTitle}
                          disabled={deletingId === patient._id}
                          onClick={() => onDelete(patient)}
                          className="rounded-lg p-2 text-text-secondary transition hover:bg-danger-bg hover:text-danger disabled:opacity-50"
                        >
                          <Trash2 size={17} />
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

      <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          {PATIENT_STRINGS.showingPrefix}{' '}
          <span className="font-semibold text-foreground">{patients.length}</span>{' '}
          {PATIENT_STRINGS.showingOf}{' '}
          <span className="font-semibold text-foreground">{totalPatients}</span>{' '}
          {PATIENT_STRINGS.patientsWord}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-2 text-sm text-text-secondary">
            {PATIENT_STRINGS.pageWord} {page} {PATIENT_STRINGS.showingOf} {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

