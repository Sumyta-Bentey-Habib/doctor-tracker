'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';
import {
  DoctorAlerts,
  DoctorFilters,
  DoctorFooter,
  DoctorModal,
  DoctorStats,
  DoctorTable,
} from '@/components/doctors';
import { AppShell } from '@/components/layout/app-shell';
import { useDoctorForm, useDoctorList } from '@/hooks';
import { doctorService } from '@/services';
import { DOCTOR_STRINGS } from '@/utils';

function DoctorsContent() {
  const router = useRouter();
  const { user: admin } = useAuth();

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
    try {
      await doctorService.logout();
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : DOCTOR_STRINGS.unableToLogout);
    }
  };

  return (
    <AppShell
      adminName={admin.name}
      adminEmail={admin.email}
      totalDoctors={totalDoctors}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Page Title & Action */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
              {DOCTOR_STRINGS.headingBadge}
            </p>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {DOCTOR_STRINGS.heading}
            </h2>
            <p className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">
              {DOCTOR_STRINGS.subheading}
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-primary to-primary-hover px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>{DOCTOR_STRINGS.addDoctor}</span>
          </button>
        </section>

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

      <DoctorModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingDoctor={editingDoctor}
        form={form}
        formLoading={formLoading}
        onUpdateForm={updateForm}
        onSubmit={(event) => void handleSubmit(event)}
      />
    </AppShell>
  );
}

export default function DoctorsPage() {
  return (
    <AuthGuard>
      <DoctorsContent />
    </AuthGuard>
  );
}
