import type { FormEvent } from 'react';
import { Stethoscope, X } from 'lucide-react';
import type { Doctor, DoctorForm } from '@/types';
import { DOCTOR_FORM_FIELDS, DOCTOR_STRINGS } from '@/utils';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDoctor: Doctor | null;
  form: DoctorForm;
  formLoading: boolean;
  onUpdateForm: (field: keyof DoctorForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function DoctorModal({
  isOpen,
  onClose,
  editingDoctor,
  form,
  formLoading,
  onUpdateForm,
  onSubmit,
}: DoctorModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(editingDoctor);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md transition-all"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !formLoading) onClose();
      }}
    >
      <div className="relative my-auto w-full max-w-[560px] overflow-hidden rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 shadow-xs">
              <Stethoscope size={22} strokeWidth={2.2} />
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                {isEditing ? DOCTOR_STRINGS.modalEditTitle : DOCTOR_STRINGS.modalAddTitle}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-text-muted">
                {isEditing ? DOCTOR_STRINGS.modalEditSubtitle : DOCTOR_STRINGS.modalAddSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={formLoading}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-muted shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {DOCTOR_FORM_FIELDS.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-1.5 block text-xs font-bold text-text-secondary"
              >
                {field.label}
              </label>

              <input
                id={field.name}
                type={field.type}
                required
                minLength={field.minLength}
                value={form[field.name]}
                onChange={(event) => onUpdateForm(field.name, event.target.value)}
                placeholder={field.placeholder}
                className="h-11 w-full rounded-2xl border border-border/70 bg-surface/90 px-4 text-xs text-foreground outline-hidden shadow-xs transition placeholder:text-text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2.5 pt-4 border-t border-border/50 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className="rounded-full border border-border/70 bg-surface px-5 py-2.5 text-xs font-semibold text-text-secondary shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            >
              {DOCTOR_STRINGS.btnCancel}
            </button>

            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formLoading
                ? DOCTOR_STRINGS.btnSaving
                : isEditing
                ? DOCTOR_STRINGS.btnSaveChanges
                : DOCTOR_STRINGS.btnAddDoctor}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
