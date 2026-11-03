import type { FormEvent } from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-xl rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEditing ? PATIENT_STRINGS.modalEditTitle : PATIENT_STRINGS.modalAddTitle}
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              {isEditing ? PATIENT_STRINGS.modalEditSubtitle : PATIENT_STRINGS.modalAddSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          {formError && (
            <div className="rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger">
              {formError}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {PATIENT_STRINGS.labelName}
            </label>
            <input
              required
              minLength={2}
              value={form.name}
              onChange={(event) => onUpdateForm('name', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderName}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
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
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {PATIENT_STRINGS.labelGender}
              </label>
              <select
                value={form.gender}
                onChange={(event) => onUpdateForm('gender', event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {PATIENT_STRINGS.labelPhone}
            </label>
            <input
              required
              minLength={7}
              value={form.phone}
              onChange={(event) => onUpdateForm('phone', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderPhone}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {PATIENT_STRINGS.labelCondition}
            </label>
            <input
              required
              minLength={2}
              value={form.condition}
              onChange={(event) => onUpdateForm('condition', event.target.value)}
              placeholder={PATIENT_STRINGS.placeholderCondition}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {!isEditing ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {PATIENT_STRINGS.labelAssignDoctor}
              </label>
              <select
                required
                value={form.doctorId}
                onChange={(event) => onUpdateForm('doctorId', event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">{PATIENT_STRINGS.selectDoctorPlaceholder}</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} — {doctor.specialization}
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <p className="mt-2 text-xs text-warning">
                  {PATIENT_STRINGS.noDoctorsWarning}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface-secondary p-4">
              <p className="text-xs font-medium text-text-secondary">
                {PATIENT_STRINGS.assignedDoctorLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {assignedDoctor?.name ?? PATIENT_STRINGS.doctorUnavailable}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {PATIENT_STRINGS.doctorReassignNote}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-hover disabled:opacity-50"
            >
              {PATIENT_STRINGS.btnCancel}
            </button>
            <button
              type="submit"
              disabled={saving || (!isEditing && doctors.length === 0)}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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

