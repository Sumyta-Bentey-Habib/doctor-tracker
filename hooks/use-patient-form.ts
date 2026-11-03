import { useState, type FormEvent } from 'react';
import { patientService } from '@/services';
import type { Patient, PatientForm } from '@/types';
import {
  INITIAL_PATIENT_FORM,
  mapFormToPayload,
  PATIENT_STRINGS,
  validatePatientForm,
} from '@/utils';

interface UsePatientFormProps {
  onSuccess?: (isEditing: boolean) => Promise<void> | void;
}

export function usePatientForm({ onSuccess }: UsePatientFormProps = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientForm>(INITIAL_PATIENT_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingPatient(null);
    setForm(INITIAL_PATIENT_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      condition: patient.condition,
      doctorId: typeof patient.doctorId === 'object' && patient.doctorId !== null
        ? patient.doctorId._id
        : '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingPatient(null);
    setForm(INITIAL_PATIENT_FORM);
    setFormError('');
  };

  const updateForm = (field: keyof PatientForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const isEditing = Boolean(editingPatient);
    const validationError = validatePatientForm(form, isEditing);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = mapFormToPayload(form);
    setSaving(true);

    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient._id, payload);
      } else {
        await patientService.createPatient(form.doctorId, payload);
      }

      setModalOpen(false);
      setEditingPatient(null);
      setForm(INITIAL_PATIENT_FORM);

      if (onSuccess) {
        await onSuccess(isEditing);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToSavePatient);
    } finally {
      setSaving(false);
    }
  };

  return {
    modalOpen,
    editingPatient,
    form,
    formError,
    saving,
    openCreateModal,
    openEditModal,
    closeModal,
    updateForm,
    handleSubmit,
  };
}

