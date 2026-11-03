'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';
import {
  PatientFilters,
  PatientModal,
  PatientStats,
  PatientTable,
} from '@/components/patients';
import { AppShell } from '@/components/layout/app-shell';
import { useDoctors, usePatientForm, usePatients } from '@/hooks';
import { patientService } from '@/services';
import { PATIENT_STRINGS } from '@/utils';

function PatientsContent() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    patients,
    loading,
    error,
    search,
    condition,
    page,
    totalPatients,
    totalPages,
    deletingId,
    setPage,
    handleSearchChange,
    handleConditionChange,
    refetch,
    deletePatient,
  } = usePatients();

  const { doctors } = useDoctors();

  const {
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
  } = usePatientForm({
    onSuccess: async (isEditing) => {
      if (!isEditing && page !== 1) {
        setPage(1);
      } else {
        await refetch();
      }
    },
  });

  const handleLogout = async () => {
    try {
      await patientService.logout();
    } finally {
      router.replace('/login');
    }
  };

  return (
    <AppShell
      adminName={user.name}
      adminEmail={user.email}
      totalPatients={totalPatients}
      totalDoctors={doctors.length}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Page Title & Action */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
              {PATIENT_STRINGS.adminBadge}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {PATIENT_STRINGS.heading}
            </h2>
            <p className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">
              {PATIENT_STRINGS.subheading}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={doctors.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>{PATIENT_STRINGS.addPatient}</span>
          </button>
        </section>

        <PatientStats totalPatients={totalPatients} />

        <PatientFilters
          search={search}
          condition={condition}
          onSearchChange={handleSearchChange}
          onConditionChange={handleConditionChange}
        />

        <PatientTable
          patients={patients}
          loading={loading}
          error={error}
          deletingId={deletingId}
          page={page}
          totalPages={totalPages}
          totalPatients={totalPatients}
          onPageChange={setPage}
          onEdit={openEditModal}
          onDelete={(patient) => void deletePatient(patient)}
        />
      </div>

      <PatientModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingPatient={editingPatient}
        form={form}
        formError={formError}
        saving={saving}
        doctors={doctors}
        onUpdateForm={updateForm}
        onSubmit={(event) => void handleSubmit(event)}
      />
    </AppShell>
  );
}

export default function PatientsPage() {
  return (
    <AuthGuard>
      <PatientsContent />
    </AuthGuard>
  );
}
