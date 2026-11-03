'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';
import {
  DoctorAlerts,
  DoctorFilters,
  DoctorFooter,
  DoctorHeader,
  DoctorModal,
  DoctorSidebar,
  DoctorStats,
  DoctorTable,
} from '@/components/doctors';
import { useDoctorForm, useDoctorList } from '@/hooks';
import { doctorService } from '@/services';
import { DOCTOR_STRINGS } from '@/utils';

function DoctorsContent() {
  const router = useRouter();
  const { user: admin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const {
    doctors,
    loading,
    error,
    success,
    setError,
    setSuccess,
    search,
    specialization,
    hospital,
    page,
    totalDoctors,
    totalPages,
    setPage,
    handleSearchChange,
    handleSpecializationChange,
    handleHospitalChange,
    clearFilters,
    refetch,
    deleteDoctor,
  } = useDoctorList();

  const {
    modalOpen,
    editingDoctor,
    form,
    formLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    updateForm,
    handleSubmit,
  } = useDoctorForm({
    onClearFeedback: () => {
      setError('');
      setSuccess('');
    },
    onSuccess: async (isEditing) => {
      setSuccess(
        isEditing
          ? DOCTOR_STRINGS.doctorUpdatedSuccess
          : DOCTOR_STRINGS.doctorCreatedSuccess
      );

      if (!isEditing && page !== 1) {
        setPage(1);
      } else {
        await refetch();
      }
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    },
  });

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await doctorService.logout();
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : DOCTOR_STRINGS.unableToLogout);
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      <DoctorSidebar
        adminName={admin.name}
        adminEmail={admin.email}
        mobileMenuOpen={mobileMenuOpen}
        logoutLoading={logoutLoading}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1">
        <DoctorHeader
          adminName={admin.name}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onAddDoctor={openCreateModal}
        />

        <div className="mx-auto max-w-[1600px] space-y-6 p-5 sm:p-8 lg:p-10">
          <DoctorAlerts
            error={error}
            success={success}
            onDismissError={() => setError('')}
            onDismissSuccess={() => setSuccess('')}
          />

          <DoctorStats totalDoctors={totalDoctors} />

          <DoctorFilters
            search={search}
            specialization={specialization}
            hospital={hospital}
            onSearchChange={handleSearchChange}
            onSpecializationChange={handleSpecializationChange}
            onHospitalChange={handleHospitalChange}
            onClearFilters={clearFilters}
          />

          <DoctorTable
            doctors={doctors}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalDoctors={totalDoctors}
            onPageChange={setPage}
            onEdit={openEditModal}
            onDelete={(doctor) => void deleteDoctor(doctor)}
          />

          <DoctorFooter />
        </div>
      </main>

      <DoctorModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingDoctor={editingDoctor}
        form={form}
        formLoading={formLoading}
        onUpdateForm={updateForm}
        onSubmit={(event) => void handleSubmit(event)}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <AuthGuard>
      <DoctorsContent />
    </AuthGuard>
  );
}
