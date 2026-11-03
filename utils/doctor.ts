import type { DoctorForm } from '@/types';

export const INITIAL_DOCTOR_FORM: DoctorForm = {
  name: '',
  specialization: '',
  hospital: '',
  phone: '',
  email: '',
};

export function getDoctorInitials(name: string): string {
  if (!name.trim()) return 'D';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function formatDoctorDate(date: string): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function formatLongDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

export interface DoctorFormFieldConfig {
  name: keyof DoctorForm;
  label: string;
  placeholder: string;
  type: string;
  minLength: number;
}

export const DOCTOR_FORM_FIELDS: readonly DoctorFormFieldConfig[] = [
  {
    name: 'name',
    label: 'Doctor name',
    placeholder: 'e.g. Dr. Sarah Ahmed',
    type: 'text',
    minLength: 2,
  },
  {
    name: 'specialization',
    label: 'Specialization',
    placeholder: 'e.g. Cardiology',
    type: 'text',
    minLength: 2,
  },
  {
    name: 'hospital',
    label: 'Hospital',
    placeholder: 'e.g. City Medical College',
    type: 'text',
    minLength: 2,
  },
  {
    name: 'phone',
    label: 'Phone number',
    placeholder: 'e.g. +8801712345678',
    type: 'tel',
    minLength: 7,
  },
  {
    name: 'email',
    label: 'Email address',
    placeholder: 'e.g. doctor@example.com',
    type: 'email',
    minLength: 2,
  },
] as const;

