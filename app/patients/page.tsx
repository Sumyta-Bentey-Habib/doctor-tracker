'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';
import {
  PatientFilters,
  PatientHeader,
  PatientModal,
  PatientSidebar,
  PatientStats,
  PatientTable,
} from '@/components/patients';
import { useDoctors, usePatientForm, usePatients } from '@/hooks';
import { patientService } from '@/services';

function PatientsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen bg-background">
      <PatientSidebar
        userName={user.name}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1">
        <PatientHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onAddPatient={openCreateModal}
          canAddPatient={doctors.length > 0}
        />

        <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
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
      </main>

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
    </div>
  );
}

export default function PatientsPage() {
  return (
    <AuthGuard>
      <PatientsContent />
    </AuthGuard>
  );
}
