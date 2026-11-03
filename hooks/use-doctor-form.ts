import { useState, type FormEvent } from 'react';
import { doctorService } from '@/services';
import type { Doctor, DoctorForm } from '@/types';
import { DOCTOR_STRINGS, INITIAL_DOCTOR_FORM } from '@/utils';

interface UseDoctorFormOptions {
  onSuccess?: (isEditing: boolean) => Promise<void> | void;
  onError?: (errorMessage: string) => void;
  onClearFeedback?: () => void;
}

export function useDoctorForm({
  onSuccess,
  onError,
  onClearFeedback,
}: UseDoctorFormOptions = {}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorForm>(INITIAL_DOCTOR_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const openCreateModal = () => {
    setEditingDoctor(null);
    setForm(INITIAL_DOCTOR_FORM);
    onClearFeedback?.();
    setModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    });
    onClearFeedback?.();
    setModalOpen(true);
  };

  const closeModal = () => {
    if (formLoading) return;
    setModalOpen(false);
    setEditingDoctor(null);
    setForm(INITIAL_DOCTOR_FORM);
  };

  const updateForm = (field: keyof DoctorForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);
    onClearFeedback?.();

    const isEditing = Boolean(editingDoctor);

    try {
      if (isEditing && editingDoctor) {
        await doctorService.updateDoctor(editingDoctor._id, form);
      } else {
        await doctorService.createDoctor(form);
      }

      setModalOpen(false);
      setEditingDoctor(null);
      setForm(INITIAL_DOCTOR_FORM);

      if (onSuccess) {
        await onSuccess(isEditing);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : DOCTOR_STRINGS.unableToSaveDoctor;
      onError?.(message);
    } finally {
      setFormLoading(false);
    }
  };

  return {
    modalOpen,
    editingDoctor,
    form,
    formLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    updateForm,
    handleSubmit,
  };
}

