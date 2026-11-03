import {
  ChevronLeft,
  ChevronRight,
  Hospital,
  Mail,
  Pencil,
  Phone,
  Stethoscope,
  Trash2,
} from 'lucide-react';
import type { Doctor } from '@/types';
import { DOCTOR_STRINGS, formatDoctorDate, getDoctorInitials } from '@/utils';

interface DoctorTableProps {
  doctors: Doctor[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalDoctors: number;
  onPageChange: (newPage: number) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export function DoctorTable({
  doctors,
  loading,
  page,
  totalPages,
  totalDoctors,
  onPageChange,
  onEdit,
  onDelete,
}: DoctorTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-surface/85 shadow-card backdrop-blur-xl transition hover:border-primary/20">
      <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">{DOCTOR_STRINGS.recordsHeading}</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {DOCTOR_STRINGS.recordsSubheading}
          </p>
        </div>

        <p className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
          {totalDoctors} {totalDoctors === 1 ? DOCTOR_STRINGS.doctorWord : DOCTOR_STRINGS.doctorsWord} found
        </p>
      </div>

      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border/50 bg-surface-secondary/60">
              {DOCTOR_STRINGS.tableColumns.map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3.5 text-[10px] font-bold tracking-wider text-text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-xs text-text-muted"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>{DOCTOR_STRINGS.loadingDoctors}</span>
                  </div>
                </td>
              </tr>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => {
                const initials = getDoctorInitials(doctor.name);

                return (
                  <tr
                    key={doctor._id}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-surface-hover/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 to-primary-muted text-xs font-bold text-primary shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {doctor.name}
                          </p>
                          <p className="font-mono text-[11px] text-text-muted">
                            {doctor._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary dark:bg-primary/20">
                        <Stethoscope size={13} />
                        {doctor.specialization}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Hospital size={14} className="text-text-muted" />
                        <span>{doctor.hospital}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="text-text-muted" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <Phone size={13} />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                      {formatDoctorDate(doctor.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(doctor)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:border-primary/50 hover:text-primary"
                          title={DOCTOR_STRINGS.editDoctor}
                          aria-label={DOCTOR_STRINGS.editDoctor}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => onDelete(doctor)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:border-danger/50 hover:text-danger"
                          title={DOCTOR_STRINGS.deleteDoctor}
                          aria-label={DOCTOR_STRINGS.deleteDoctor}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-xs text-text-muted"
                >
                  <p className="font-semibold text-foreground">{DOCTOR_STRINGS.noDoctorsTitle}</p>
                  <p className="mt-1 text-text-secondary">{DOCTOR_STRINGS.noDoctorsSubtitle}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-xs text-text-muted">
          {DOCTOR_STRINGS.showing}{' '}
          <span className="font-bold text-foreground">{doctors.length}</span>{' '}
          {DOCTOR_STRINGS.of}{' '}
          <span className="font-bold text-foreground">{totalDoctors}</span>{' '}
          {DOCTOR_STRINGS.doctorsWord}
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="px-2 text-xs font-semibold text-text-secondary">
            {DOCTOR_STRINGS.pageWord} {page} {DOCTOR_STRINGS.of} {totalPages}
          </span>

          <button
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
