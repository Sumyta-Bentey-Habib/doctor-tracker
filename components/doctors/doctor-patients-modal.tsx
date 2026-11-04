'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { doctorService } from '@/services';
import type { Doctor, Gender, Patient } from '@/types';
import { DOCTOR_STRINGS, formatDoctorDate, PATIENT_STRINGS } from '@/utils';

interface DoctorPatientsModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onPatientCountChanged?: () => void;
}

const INITIAL_PATIENT_FORM = {
  name: '',
  age: '',
  gender: 'Male' as Gender,
  phone: '',
  condition: '',
};

export function DoctorPatientsModal({
  isOpen,
  doctor,
  onClose,
  onPatientCountChanged,
}: DoctorPatientsModalProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(INITIAL_PATIENT_FORM);

  const refreshPatients = useCallback(async () => {
    if (!doctor) return;
    try {
      const response = await doctorService.getDoctorPatients(doctor._id);
      setPatients(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadPatients);
    }
  }, [doctor]);

  const handleClose = () => {
    setError('');
    setSuccess('');
    setIsAdding(false);
    setForm(INITIAL_PATIENT_FORM);
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !doctor) return;
    let isSubscribed = true;

    doctorService
      .getDoctorPatients(doctor._id)
      .then((response) => {
        if (!isSubscribed) return;
        setPatients(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToLoadPatients);
        setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, doctor]);

  if (!isOpen || !doctor) return null;

  const handleAddPatientSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!doctor) return;

    if (form.name.trim().length < 2) {
      setError(PATIENT_STRINGS.validationName);
      return;
    }
    const parsedAge = Number(form.age);
    if (Number.isNaN(parsedAge) || parsedAge < 0 || parsedAge > 130) {
      setError(PATIENT_STRINGS.validationAge);
      return;
    }
    if (form.phone.trim().length < 7) {
      setError(PATIENT_STRINGS.validationPhone);
      return;
    }
    if (form.condition.trim().length < 2) {
      setError(PATIENT_STRINGS.validationCondition);
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await doctorService.addDoctorPatient(doctor._id, {
        name: form.name.trim(),
        age: parsedAge,
        gender: form.gender,
        phone: form.phone.trim(),
        condition: form.condition.trim(),
      });

      setSuccess(DOCTOR_STRINGS.patientAddedUnderDoctorSuccess);
      setForm(INITIAL_PATIENT_FORM);
      setIsAdding(false);
      await refreshPatients();
      onPatientCountChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToSavePatient);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (!doctor) return;
    const confirmed = window.confirm(
      DOCTOR_STRINGS.deletePatientFromDoctorConfirm(patient.name)
    );
    if (!confirmed) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await doctorService.deleteDoctorPatient(doctor._id, patient._id);
      setSuccess(DOCTOR_STRINGS.patientDeletedFromDoctorSuccess);
      await refreshPatients();
      onPatientCountChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : PATIENT_STRINGS.failedToDeletePatient);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md transition-all"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !actionLoading) handleClose();
      }}
    >
      <div className="relative my-auto flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 shadow-xs">
              <Users size={22} strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                  {DOCTOR_STRINGS.doctorPatientsModalTitle(doctor.name)}
                </h3>
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs font-medium text-text-muted">
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  <Stethoscope size={12} />
                  {doctor.specialization}
                </span>
                <span>•</span>
                <span>{doctor.hospital}</span>
                <span>•</span>
                <span>{DOCTOR_STRINGS.doctorPatientsModalSubtitle(patients.length)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={actionLoading}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-surface text-text-muted shadow-xs transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-2.5 text-xs font-medium text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-success/20 bg-success/10 px-4 py-2.5 text-xs font-medium text-success">
            <CheckCircle2 size={14} />
            <span>{success}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            {PATIENT_STRINGS.recordsHeading}
          </h4>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
          >
            <Plus size={14} />
            <span>{isAdding ? PATIENT_STRINGS.btnCancel : DOCTOR_STRINGS.addPatientUnderDoctor}</span>
          </button>
        </div>

        {/* Inline Add Patient Form */}
        {isAdding && (
          <form
            onSubmit={(e) => void handleAddPatientSubmit(e)}
            className="mt-3 rounded-2xl border border-primary/20 bg-surface-secondary/60 p-4 transition"
          >
            <h5 className="mb-3 text-xs font-bold text-foreground">
              {DOCTOR_STRINGS.addPatientUnderDoctor}
            </h5>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-text-muted">
                  {PATIENT_STRINGS.labelName}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={PATIENT_STRINGS.placeholderName}
                  className="h-9 w-full rounded-xl border border-border/70 bg-surface px-3 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-text-muted">
                  {PATIENT_STRINGS.labelAge}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={130}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder={PATIENT_STRINGS.placeholderAge}
                  className="h-9 w-full rounded-xl border border-border/70 bg-surface px-3 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-text-muted">
                  {PATIENT_STRINGS.labelGender}
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                  className="h-9 w-full rounded-xl border border-border/70 bg-surface px-3 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-text-muted">
                  {PATIENT_STRINGS.labelPhone}
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={PATIENT_STRINGS.placeholderPhone}
                  className="h-9 w-full rounded-xl border border-border/70 bg-surface px-3 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-text-muted">
                  {PATIENT_STRINGS.labelCondition}
                </label>
                <input
                  type="text"
                  required
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  placeholder={PATIENT_STRINGS.placeholderCondition}
                  className="h-9 w-full rounded-xl border border-border/70 bg-surface px-3 text-xs text-foreground outline-hidden focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-full border border-border/70 bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover"
              >
                {PATIENT_STRINGS.btnCancel}
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-full bg-gradient-to-tr from-primary to-primary-hover px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:opacity-95 disabled:opacity-50"
              >
                {actionLoading ? PATIENT_STRINGS.btnSaving : PATIENT_STRINGS.btnCreatePatient}
              </button>
            </div>
          </form>
        )}

        {/* Patient List */}
        <div className="dashboard-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-xs text-text-muted">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-2">{PATIENT_STRINGS.loadingPatients}</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-surface-secondary/40 py-10 text-center">
              <User size={28} className="mx-auto text-text-muted opacity-40" />
              <p className="mt-2 text-xs font-bold text-foreground">
                {DOCTOR_STRINGS.noDoctorPatientsTitle}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                {DOCTOR_STRINGS.noDoctorPatientsSubtitle}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-surface p-3.5 shadow-xs transition hover:border-primary/30 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-foreground">{patient.name}</p>
                        <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                          {patient.age} {PATIENT_STRINGS.years} • {patient.gender}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          {patient.condition}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone size={11} />
                          {patient.phone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDoctorDate(patient.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDeletePatient(patient)}
                    disabled={actionLoading}
                    title={PATIENT_STRINGS.deletePatientTitle}
                    aria-label={PATIENT_STRINGS.deletePatientTitle}
                    className="self-end sm:self-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-surface text-text-secondary shadow-xs transition hover:border-danger/50 hover:text-danger disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-border/50 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-border/70 bg-surface px-5 py-2 text-xs font-semibold text-text-secondary shadow-xs hover:bg-surface-hover hover:text-foreground"
          >
            {DOCTOR_STRINGS.btnCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
