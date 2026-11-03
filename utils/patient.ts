import type { Doctor, Patient, PatientForm, PatientPayload } from '@/types';
import { PATIENT_STRINGS } from './constants';

export const INITIAL_PATIENT_FORM: PatientForm = {
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
  condition: '',
  doctorId: '',
};

export function getDoctor(patient: Patient): Doctor | null {
  return typeof patient.doctorId === 'object' && patient.doctorId !== null
    ? patient.doctorId
    : null;
}

export function formatDate(date: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function getPatientInitials(name: string): string {
  if (!name.trim()) return 'P';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function validatePatientForm(
  form: PatientForm,
  isEditing: boolean
): string | null {
  if (!form.name.trim() || form.name.trim().length < 2) {
    return PATIENT_STRINGS.validationName;
  }

  const age = Number(form.age);
  if (form.age.trim() === '' || !Number.isInteger(age) || age < 0 || age > 130) {
    return PATIENT_STRINGS.validationAge;
  }

  if (form.phone.trim().length < 7) {
    return PATIENT_STRINGS.validationPhone;
  }

  if (form.condition.trim().length < 2) {
    return PATIENT_STRINGS.validationCondition;
  }

  if (!isEditing && !form.doctorId) {
    return PATIENT_STRINGS.validationDoctor;
  }

  return null;
}

export function mapFormToPayload(form: PatientForm): PatientPayload {
  return {
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender,
    phone: form.phone.trim(),
    condition: form.condition.trim(),
  };
}

