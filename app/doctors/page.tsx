'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Users,
  X,
  Pencil,
  Trash2,
  Hospital,
  Mail,
  Phone,
  Filter,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface DoctorListResponse {
  success: boolean;
  data: Doctor[];
  pagination: {
    currentPage: number;
    limit: number;
    totalDoctors: number;
    totalPages: number;
  };
}

interface DoctorForm {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

const emptyForm: DoctorForm = {
  name: '',
  specialization: '',
  hospital: '',
  phone: '',
  email: '',
};

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Doctors', icon: Stethoscope },
  { label: 'Patients', icon: Users },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function DoctorsContent() {
  const router = useRouter();
  const { user: admin } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');

  const [page, setPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });

      if (search.trim()) params.set('search', search.trim());
      if (specialization.trim()) {
        params.set('specialization', specialization.trim());
      }
      if (hospital.trim()) params.set('hospital', hospital.trim());

      const response = await apiRequest<DoctorListResponse>(`/doctors?${params.toString()}`);

      setDoctors(response.data);
      setTotalDoctors(response.pagination.totalDoctors);
      setTotalPages(Math.max(1, response.pagination.totalPages));
    } catch (err) {
      setDoctors([]);
      setError(err instanceof Error ? err.message : 'Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  }, [page, search, specialization, hospital]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const openCreateModal = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
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
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (formLoading) return;

    setModalOpen(false);
    setEditingDoctor(null);
    setForm(emptyForm);
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
    setError('');
    setSuccess('');

    try {
      const isEditing = Boolean(editingDoctor);

      await apiRequest(isEditing ? `/doctors/${editingDoctor?._id}` : '/doctors', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });

      setModalOpen(false);
      setEditingDoctor(null);
      setForm(emptyForm);

      setSuccess(isEditing ? 'Doctor updated successfully.' : 'Doctor added successfully.');

      if (!isEditing) {
        setPage(1);
      } else {
        await loadDoctors();
      }

      if (!isEditing && page === 1) {
        await loadDoctors();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save doctor.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (doctor: Doctor) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${doctor.name}?`);

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await apiRequest(`/doctors/${doctor._id}`, {
        method: 'DELETE',
      });

      setSuccess(`${doctor.name} was deleted successfully.`);

      if (doctors.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadDoctors();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete doctor.');
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });

      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log out.');
      setLogoutLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSpecialization('');
    setHospital('');
    setPage(1);
  };

  const today = new Date();

  return (
    <div className="min-h-screen bg-background lg:flex">
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-text-inverse transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-text-inverse/10 px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity size={23} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight">MediTrack</h1>
              <p className="text-[10px] tracking-[2px] text-text-muted">ADMIN PORTAL</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-text-muted hover:bg-text-inverse/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-text-muted">
            MAIN MENU
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === 'Doctors';
              const isDisabled = item.label === 'Patients';

              return (
                <button
                  key={item.label}
                  disabled={isDisabled}
                  onClick={() => {
                    setMobileMenuOpen(false);

                    if (item.label === 'Overview') {
                      router.push('/');
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-text-muted hover:bg-text-inverse/5 hover:text-text-inverse disabled:cursor-not-allowed disabled:opacity-50'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-5">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-text-muted">
            PREFERENCES
          </p>

          <button
            disabled
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium text-text-muted opacity-50"
          >
            <Settings size={19} />
            Settings
          </button>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-text-inverse/10 bg-text-inverse/5 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Activity size={18} />
            </div>

            <p className="text-xs font-semibold">Need assistance?</p>
            <p className="mt-1 text-[11px] leading-5 text-text-muted">
              Contact your system administrator for support.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-text-inverse/10 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-text-inverse">
              {getInitials(admin.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{admin.name}</p>
              <p className="truncate text-[10px] text-text-muted">{admin.email}</p>
            </div>

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              title="Log out"
              aria-label="Log out"
              className="rounded-lg p-2 text-text-muted transition hover:bg-text-inverse/10 hover:text-text-inverse disabled:opacity-50"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-[18px] font-bold tracking-tight text-foreground sm:text-xl">
                Doctors
              </h2>
              <p className="mt-0.5 hidden text-[11px] text-text-muted sm:block">
                Dashboard / Doctors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3 py-2 text-xs text-text-secondary sm:flex">
              {today.toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
              })}
            </div>

            <div className="hidden h-8 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
                {getInitials(admin.name)}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-foreground">{admin.name}</p>
                <p className="text-[10px] text-text-muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-6 p-5 sm:p-8 lg:p-10">
          {/* Alerts */}
          {error && (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger"
            >
              <span>{error}</span>
              <button onClick={() => setError('')} aria-label="Dismiss error">
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center justify-between rounded-xl border border-success/20 bg-success-bg px-4 py-3 text-sm text-success"
            >
              <span>{success}</span>
              <button onClick={() => setSuccess('')} aria-label="Dismiss success">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Page heading */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-medium text-primary">DOCTOR DIRECTORY</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
                Manage doctors
              </h2>
              <p className="mt-2 text-[13px] text-text-secondary">
                Add, update, search, and manage doctor records.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              <Plus size={17} />
              Add doctor
            </button>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted text-primary">
                <Stethoscope size={22} />
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary">Total registered doctors</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {totalDoctors.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={16} className="text-text-secondary" />
              <h3 className="text-sm font-bold text-foreground">Search and filters</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex h-11 items-center gap-2 rounded-xl border border-border px-3">
                <Search size={16} className="shrink-0 text-text-muted" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search doctors..."
                  className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-text-muted"
                />
              </div>

              <input
                value={specialization}
                onChange={(event) => {
                  setSpecialization(event.target.value);
                  setPage(1);
                }}
                placeholder="Filter by specialization"
                className="h-11 rounded-xl border border-border bg-transparent px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
              />

              <input
                value={hospital}
                onChange={(event) => {
                  setHospital(event.target.value);
                  setPage(1);
                }}
                placeholder="Filter by hospital"
                className="h-11 rounded-xl border border-border bg-transparent px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
              />
            </div>

            {(search || specialization || hospital) && (
              <button
                onClick={clearFilters}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </section>

          {/* Doctor table */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="flex flex-col justify-between gap-2 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Doctor records</h3>
                <p className="mt-1 text-[11px] text-text-muted">
                  Doctor information retrieved from your database.
                </p>
              </div>

              <p className="text-[11px] text-text-secondary">
                {totalDoctors} doctor{totalDoctors === 1 ? '' : 's'} found
              </p>
            </div>

            <div className="dashboard-scrollbar overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-border-subtle bg-surface-secondary">
                    {['DOCTOR', 'SPECIALIZATION', 'HOSPITAL', 'CONTACT', 'JOINED', 'ACTIONS'].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3.5 text-[9px] font-semibold tracking-[1px] text-text-muted"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-xs text-text-muted">
                        Loading doctors...
                      </td>
                    </tr>
                  ) : doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <tr
                        key={doctor._id}
                        className="border-b border-border-subtle last:border-0 hover:bg-surface-hover"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-bold text-primary">
                              {getInitials(doctor.name)}
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-foreground">{doctor.name}</p>
                              <p className="mt-1 text-[10px] text-text-muted">{doctor.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-info-bg px-2.5 py-1.5 text-[10px] font-medium text-info">
                            {doctor.specialization}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                            <Hospital size={14} className="text-text-muted" />
                            {doctor.hospital}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <p className="flex items-center gap-2 text-[10px] text-text-secondary">
                              <Phone size={12} className="text-text-muted" />
                              {doctor.phone}
                            </p>
                            <p className="flex items-center gap-2 text-[10px] text-text-secondary">
                              <Mail size={12} className="text-text-muted" />
                              {doctor.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-[10px] text-text-secondary">
                          {formatDate(doctor.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(doctor)}
                              title="Edit doctor"
                              aria-label={`Edit ${doctor.name}`}
                              className="rounded-lg border border-border p-2 text-text-secondary transition hover:border-primary hover:bg-primary-muted hover:text-primary"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(doctor)}
                              title="Delete doctor"
                              aria-label={`Delete ${doctor.name}`}
                              className="rounded-lg border border-border p-2 text-text-secondary transition hover:border-danger hover:bg-danger-bg hover:text-danger"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
                          <Stethoscope size={22} />
                        </div>
                        <p className="mt-3 text-xs font-semibold text-foreground">
                          No doctors found
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted">
                          Try changing your filters or add a new doctor.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-[10px] text-text-muted">
                Showing <span className="font-semibold text-text-secondary">{doctors.length}</span>{' '}
                of <span className="font-semibold text-text-secondary">{totalDoctors}</span> doctors
              </p>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous page"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-border p-1.5 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={15} />
                </button>

                <span className="px-2 text-[10px] text-text-secondary">
                  Page {page} of {totalPages}
                </span>

                <button
                  aria-label="Next page"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-border p-1.5 text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-text-muted sm:flex-row">
            <p>© {today.getFullYear()} MediTrack. All rights reserved.</p>
            <p>Healthcare management made simpler.</p>
          </footer>
        </div>
      </main>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-[560px] rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingDoctor ? 'Edit doctor' : 'Add new doctor'}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {editingDoctor
                    ? 'Update the doctor information below.'
                    : 'Enter the doctor information to create a record.'}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={formLoading}
                aria-label="Close modal"
                className="rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(
                [
                  {
                    name: 'name',
                    label: 'Doctor name',
                    placeholder: 'e.g. Dr. Sarah Ahmed',
                    type: 'text',
                  },
                  {
                    name: 'specialization',
                    label: 'Specialization',
                    placeholder: 'e.g. Cardiology',
                    type: 'text',
                  },
                  {
                    name: 'hospital',
                    label: 'Hospital',
                    placeholder: 'e.g. City Medical College',
                    type: 'text',
                  },
                  {
                    name: 'phone',
                    label: 'Phone number',
                    placeholder: 'e.g. +8801712345678',
                    type: 'tel',
                  },
                  {
                    name: 'email',
                    label: 'Email address',
                    placeholder: 'e.g. doctor@example.com',
                    type: 'email',
                  },
                ] as const
              ).map((field) => (
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
                    minLength={field.name === 'phone' ? 7 : 2}
                    value={form[field.name]}
                    onChange={(event) => updateForm(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-xs text-foreground outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              ))}

              <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="rounded-xl border border-border px-5 py-3 text-xs font-semibold text-text-secondary transition hover:bg-surface-hover disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formLoading ? 'Saving...' : editingDoctor ? 'Save changes' : 'Add doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
