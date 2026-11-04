import type { FormEvent } from 'react';
import { UserPlus, X } from 'lucide-react';
import type { Doctor, Patient, PatientForm } from '@/types';
import { getDoctor, PATIENT_STRINGS } from '@/utils';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPatient: Patient | null;
  form: PatientForm;
  formError: string;
  saving: boolean;
  doctors: Doctor[];
  onUpdateForm: (field: keyof PatientForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function PatientModal({
  isOpen,
  onClose,
  editingPatient,
  form,
  formError,
  saving,
  doctors,
  onUpdateForm,
  onSubmit,
}: PatientModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(editingPatient);
  const assignedDoctor = editingPatient ? getDoctor(editingPatient) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md transition-all"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 shadow-xs">
              <UserPlus size={22} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                {isEditing ? PATIENT_STRINGS.modalEditTitle : PATIENT_STRINGS.modalAddTitle}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-text-muted">
                {isEditing ? PATIENT_STRINGS.modalEditSubtitle : PATIENT_STRINGS.modalAddSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-muted shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-2xl border border-danger/20 bg-danger-bg px-4 py-3 text-xs font-semibold text-danger shadow-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-text-secondary">
              {PATIENT_STRINGS.labelName}
            </label>
            <input
              required
              minLength={2}
              value={form.name}
              onChange={(event) => onUpdateForm('name', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderName}
              className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-text-secondary">
                {PATIENT_STRINGS.labelAge}
              </label>
              <input
                required
                type="number"
                min="0"
                max="130"
                step="1"
                value={form.age}
                onChange={(event) => onUpdateForm('age', event.target.value)}
                placeholder={PATIENT_STRINGS.placeholderAge}
                className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-text-secondary">
                {PATIENT_STRINGS.labelGender}
              </label>
              <select
                value={form.gender}
                onChange={(event) => onUpdateForm('gender', event.target.value)}
                className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-text-secondary">
              {PATIENT_STRINGS.labelPhone}
            </label>
            <input
              required
              minLength={7}
              value={form.phone}
              onChange={(event) => onUpdateForm('phone', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderPhone}
              className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-text-secondary">
              {PATIENT_STRINGS.labelCondition}
            </label>
            <input
              required
              minLength={2}
              value={form.condition}
              onChange={(event) => onUpdateForm('condition', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderCondition}
              className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {!isEditing ? (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-text-secondary">
                {PATIENT_STRINGS.labelAssignDoctor}
              </label>
              <select
                required
                value={form.doctorId}
                onChange={(event) => onUpdateForm('doctorId', event.target.value)}
                className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{PATIENT_STRINGS.selectDoctorPlaceholder}</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} — {doctor.specialization}
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <p className="mt-1.5 text-xs font-semibold text-warning">
                  {PATIENT_STRINGS.noDoctorsWarning}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-surface-secondary/70 p-4 shadow-2xs">
              <p className="text-[11px] font-bold text-text-muted">
                {PATIENT_STRINGS.assignedDoctorLabel}
              </p>
              <p className="mt-1 text-xs font-bold text-foreground">
                {assignedDoctor?.name ?? PATIENT_STRINGS.doctorUnavailable}
              </p>
              <p className="mt-1 text-[11px] text-text-secondary">
                {PATIENT_STRINGS.doctorReassignNote}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2.5 pt-4 border-t border-border/50 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-border/70 bg-surface px-5 py-2.5 text-xs font-semibold text-text-secondary shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            >
              {PATIENT_STRINGS.btnCancel}
            </button>

            <button
              type="submit"
              disabled={saving || (!isEditing && doctors.length === 0)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? PATIENT_STRINGS.btnSaving
                : isEditing
                ? PATIENT_STRINGS.btnSaveChanges
                : PATIENT_STRINGS.btnCreatePatient}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
