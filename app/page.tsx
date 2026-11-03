'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { apiRequest } from '@/lib/api';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
  createdAt: string;
  doctorId?:
    | {
        _id?: string;
        name?: string;
        specialization?: string;
      }
    | string;
}

interface DashboardStats {
  overview: {
    totalDoctors: number;
    totalPatients: number;
  };
  patientsPerDoctor: Record<string, unknown>[];
  patientRegistrationTrends: Record<string, unknown>[];
  recentPatients: Patient[];
}

interface PatientListResponse {
  success: boolean;
  data?:
    | Patient[]
    | {
        patients?: Patient[];
        pagination?: {
          total?: number;
          page?: number;
          totalPages?: number;
        };
      };
  patients?: Patient[];
  pagination?: {
    total?: number;
    page?: number;
    totalPages?: number;
  };
}

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, href: '/' },
  { label: 'Doctors', icon: Stethoscope, href: '/doctors' },
  { label: 'Patients', icon: Users, href: '/patients' },
];

function getObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function getArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(getObject) : [];
}

function formatDate(date?: string) {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function DashboardContent() {
  const router = useRouter();
  const { user: admin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Load dashboard statistics.
  // AuthGuard has already verified the session and provided the admin.
  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response = await apiRequest<{
          success: boolean;
          data: DashboardStats;
        }>('/dashboard/stats');

        if (active) {
          setStats(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // Fetch patients using backend search and pagination.
  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams({
      page: String(page),
      limit: '5',
    });

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    apiRequest<PatientListResponse>(`/patients?${params.toString()}`)
      .then((response) => {
        if (ignore) return;

        const root = getObject(response);
        const data = getObject(root.data);
        const pagination = getObject(root.pagination ?? data.pagination);

        const patientData = Array.isArray(root.data)
          ? root.data
          : Array.isArray(data.patients)
            ? data.patients
            : Array.isArray(root.patients)
              ? root.patients
              : [];

        setPatients(patientData as Patient[]);
        setTotalPatients(Number(pagination.total ?? patientData.length));
        setTotalPages(Math.max(1, Number(pagination.totalPages ?? 1)));
        setPatientsLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setPatients([]);
        setError(err instanceof Error ? err.message : 'Unable to load patients.');
        setPatientsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, searchQuery]);

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

  const today = new Date();
  const overview = stats?.overview;

  const registrationData = getArray(stats?.patientRegistrationTrends).map((item) => ({
    day: String(item.date ?? item._id ?? ''),
    patients: Number(item.count ?? item.total ?? item.patients ?? 0),
  }));

  const doctorData = getArray(stats?.patientsPerDoctor).map((item) => ({
    name: String(item.doctorName ?? item.name ?? item.doctor ?? 'Unknown doctor'),
    patients: Number(item.patientCount ?? item.totalPatients ?? item.count ?? item.patients ?? 0),
  }));

  const statCards = [
    {
      title: 'Total Doctors',
      value: overview?.totalDoctors,
      icon: Stethoscope,
      iconBg: 'bg-primary-muted',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Patients',
      value: overview?.totalPatients,
      icon: Users,
      iconBg: 'bg-info-bg',
      iconColor: 'text-info',
    },
  ];

  const patientRows = patients.map((patient) => {
    const doctor = typeof patient.doctorId === 'object' ? patient.doctorId : null;

    return {
      ...patient,
      doctorName: doctor?.name ?? 'Unassigned',
    };
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
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
            className="rounded-lg p-2 text-text-muted hover:bg-white/10 lg:hidden"
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
              const isActive = item.label === 'Overview';

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (!isActive) {
                      router.push(item.href);
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-text-muted hover:bg-white/5 hover:text-text-inverse'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}

                  {item.label === 'Patients' && (
                    <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                      {overview?.totalPatients ?? '—'}
                    </span>
                  )}
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Activity size={18} />
            </div>

            <p className="text-xs font-semibold">Need assistance?</p>
            <p className="mt-1 text-[11px] leading-5 text-text-muted">
              Contact your system administrator for support.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary-muted">
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
              className="rounded-lg p-2 text-text-muted transition hover:bg-white/10 hover:text-text-inverse disabled:opacity-50"
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
                Overview
              </h2>
              <p className="mt-0.5 hidden text-[11px] text-text-muted sm:block">
                Dashboard / Overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface-secondary px-3 py-2 text-xs text-text-secondary sm:flex">
              <CalendarDays size={15} />
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

        <div className="dashboard-scrollbar mx-auto max-w-[1600px] space-y-7 overflow-x-hidden p-5 sm:p-8 lg:p-10">
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

          {/* Welcome */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-medium text-primary">
                {today
                  .toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                  })
                  .toUpperCase()}
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
                Good day, {admin.name} 👋
              </h2>

              <p className="mt-2 text-[13px] text-text-secondary">
                Here&apos;s an overview of your healthcare system.
              </p>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-text-secondary">{stat.title}</p>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-[29px] font-bold tracking-tight text-foreground">
                    {stat.value?.toLocaleString() ?? '—'}
                  </h3>
                </article>
              );
            })}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
            <article className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground">Patient registrations</h3>
                <p className="mt-1 text-[11px] text-text-muted">
                  Registration trends from your database
                </p>
              </div>

              <div className="h-[240px] w-full">
                {registrationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={registrationData}
                      margin={{ top: 10, right: 5, left: -22, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="var(--chart-grid)"
                        strokeDasharray="4 5"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 11,
                        }}
                        dy={10}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 10,
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--chart-tooltip-bg)',
                          borderColor: 'var(--border)',
                          borderRadius: '10px',
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="patients"
                        name="Registrations"
                        stroke="var(--chart-primary)"
                        strokeWidth={2.5}
                        fill="url(#patientGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-text-muted">
                    No registration trend data available.
                  </div>
                )}
              </div>
            </article>

            <article className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-7">
                <h3 className="text-sm font-bold text-foreground">Patients per doctor</h3>
                <p className="mt-1 text-[11px] text-text-muted">Patient distribution by doctor</p>
              </div>

              <div className="h-[240px] w-full">
                {doctorData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={doctorData}
                      layout="vertical"
                      margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                      barCategoryGap={15}
                    >
                      <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />

                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-muted)',
                          fontSize: 10,
                        }}
                      />

                      <YAxis
                        type="category"
                        dataKey="name"
                        width={95}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-secondary)',
                          fontSize: 10,
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--chart-tooltip-bg)',
                          borderColor: 'var(--border)',
                          borderRadius: '10px',
                        }}
                      />

                      <Bar
                        dataKey="patients"
                        name="Patients"
                        fill="var(--chart-primary)"
                        radius={[0, 5, 5, 0]}
                        barSize={13}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-text-muted">
                    No doctor distribution data available.
                  </div>
                )}
              </div>
            </article>
          </section>

          {/* Recent patients */}
          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Recent patients</h3>
                <p className="mt-1 text-[11px] text-text-muted">
                  Patient records retrieved from your database
                </p>
              </div>

              <div className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 sm:w-[230px]">
                <Search size={15} className="shrink-0 text-text-muted" />

                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="dashboard-scrollbar overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-border-subtle bg-surface-secondary">
                    {['PATIENT', 'PATIENT ID', 'ASSIGNED DOCTOR', 'CONDITION', 'REGISTERED'].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-6 py-3.5 text-[9px] font-semibold tracking-[1px] text-text-muted"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {patientsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs text-text-muted">
                        Loading patients...
                      </td>
                    </tr>
                  ) : patientRows.length > 0 ? (
                    patientRows.map((patient) => (
                      <tr
                        key={patient._id}
                        className="border-b border-border-subtle last:border-0 hover:bg-surface-hover"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-muted text-[10px] font-bold text-primary">
                              {getInitials(patient.name)}
                            </div>

                            <div>
                              <p className="text-[11px] font-semibold text-foreground">
                                {patient.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-text-muted">{patient.phone}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[10px] font-medium text-text-secondary">
                          {patient._id}
                        </td>

                        <td className="px-6 py-4 text-[10px] font-medium text-text-secondary">
                          {patient.doctorName}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md bg-surface-hover px-2.5 py-1.5 text-[10px] font-medium text-text-secondary">
                            {patient.condition}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-[10px] text-text-secondary">
                          {formatDate(patient.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs text-text-muted">
                        No patient records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-[10px] text-text-muted">
                Showing <span className="font-semibold text-text-secondary">{patients.length}</span>{' '}
                of <span className="font-semibold text-text-secondary">{totalPatients}</span>{' '}
                patients
              </p>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous page"
                  disabled={page <= 1 || patientsLoading}
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
                  disabled={page >= totalPages || patientsLoading}
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
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
