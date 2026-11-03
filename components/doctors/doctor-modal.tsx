import type { FormEvent } from 'react';
import { X } from 'lucide-react';
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
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-[560px] rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isEditing ? DOCTOR_STRINGS.modalEditTitle : DOCTOR_STRINGS.modalAddTitle}
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              {isEditing ? DOCTOR_STRINGS.modalEditSubtitle : DOCTOR_STRINGS.modalAddSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={formLoading}
            aria-label="Close modal"
            className="rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {DOCTOR_FORM_FIELDS.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-1.5 block text-xs font-semibold text-text-secondary"
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
                className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          ))}

          <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={formLoading}
              className="rounded-xl border border-border px-5 py-3 text-xs font-semibold text-text-secondary transition hover:bg-surface-hover disabled:opacity-50"
            >
              {DOCTOR_STRINGS.btnCancel}
            </button>

            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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

