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
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-sm font-bold text-foreground">{DOCTOR_STRINGS.recordsHeading}</h3>
          <p className="mt-1 text-[11px] text-text-muted">
            {DOCTOR_STRINGS.recordsSubheading}
          </p>
        </div>

        <p className="text-[11px] text-text-secondary">
          {totalDoctors} {totalDoctors === 1 ? DOCTOR_STRINGS.doctorWord : DOCTOR_STRINGS.doctorsWord} found
        </p>
      </div>

      <div className="dashboard-scrollbar overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-subtle bg-surface-secondary">
              {DOCTOR_STRINGS.tableColumns.map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3.5 text-[9px] font-semibold tracking-[1px] text-text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-xs text-text-muted">
                  {DOCTOR_STRINGS.loadingDoctors}
                </td>
              </tr>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr
                  key={doctor._id}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-hover"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
                        {getDoctorInitials(doctor.name)}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-foreground">{doctor.name}</p>
                        <p className="mt-1 text-[10px] text-text-muted">{doctor.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-info-bg px-2.5 py-1.5 text-[10px] font-medium text-info">
                      {doctor.specialization}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                      <Hospital size={14} className="text-text-muted" />
                      {doctor.hospital}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-2 text-[10px] text-text-secondary">
                        <Phone size={12} className="text-text-muted" />
                        {doctor.phone}
                      </p>
                      <p className="flex items-center gap-2 text-[10px] text-text-secondary">
                        <Mail size={12} className="text-text-muted" />
                        {doctor.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-[10px] text-text-secondary">
                    {formatDoctorDate(doctor.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(doctor)}
                        title={DOCTOR_STRINGS.editDoctor}
                        aria-label={`Edit ${doctor.name}`}
                        className="rounded-lg border border-border p-2 text-text-secondary transition hover:border-primary hover:bg-primary-muted hover:text-primary"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => onDelete(doctor)}
                        title={DOCTOR_STRINGS.deleteDoctor}
                        aria-label={`Delete ${doctor.name}`}
                        className="rounded-lg border border-border p-2 text-text-secondary transition hover:border-danger hover:bg-danger-bg hover:text-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
                    <Stethoscope size={22} />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-foreground">
                    {DOCTOR_STRINGS.noDoctorsTitle}
                  </p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    {DOCTOR_STRINGS.noDoctorsSubtitle}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-[10px] text-text-muted">
          {DOCTOR_STRINGS.showing}{' '}
          <span className="font-semibold text-text-secondary">{doctors.length}</span>{' '}
          {DOCTOR_STRINGS.of}{' '}
          <span className="font-semibold text-text-secondary">{totalDoctors}</span>{' '}
          {DOCTOR_STRINGS.doctorsWord}
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-border p-1.5 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="px-2 text-[10px] text-text-secondary">
            {DOCTOR_STRINGS.pageWord} {page} {DOCTOR_STRINGS.of} {totalPages}
          </span>

          <button
            aria-label="Next page"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-border p-1.5 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

