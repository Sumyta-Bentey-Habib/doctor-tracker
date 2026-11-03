'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { apiRequest } from '@/lib/api';
import AuthGuard, { useAuth } from '@/components/auth/auth-guard';
import {
  DashboardCharts,
  DashboardRecentPatients,
  DashboardStats,
} from '@/components/dashboard';
import { AppShell } from '@/components/layout/app-shell';
import {
  DASHBOARD_STRINGS,
  getSafeArray,
  getSafeObject,
} from '@/utils';

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

interface DashboardStatsData {
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

function DashboardContent() {
  const router = useRouter();
  const { user: admin } = useAuth();

  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Load dashboard statistics
  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const response = await apiRequest<{
          success: boolean;
          data: DashboardStatsData;
        }>('/dashboard/stats');

        if (active) {
          setStats(response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : DASHBOARD_STRINGS.unableToLoad
          );
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

  // Fetch patients using search and pagination
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

        const root = getSafeObject(response);
        const data = getSafeObject(root.data);
        const pagination = getSafeObject(root.pagination ?? data.pagination);

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
        setError(
          err instanceof Error ? err.message : DASHBOARD_STRINGS.unableToLoad
        );
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
      setError(
        err instanceof Error ? err.message : DASHBOARD_STRINGS.unableToLogout
      );
      setLogoutLoading(false);
    }
  };

  const overview = stats?.overview;
  const currentYear = 2026;

  const registrationData = getSafeArray(stats?.patientRegistrationTrends).map(
    (item) => ({
      day: String(item.date ?? item._id ?? ''),
      patients: Number(item.count ?? item.total ?? item.patients ?? 0),
    })
  );

  const doctorData = getSafeArray(stats?.patientsPerDoctor).map((item) => ({
    name: String(item.doctorName ?? item.name ?? item.doctor ?? 'Unknown'),
    patients: Number(
      item.patientCount ?? item.totalPatients ?? item.count ?? item.patients ?? 0
    ),
  }));

  const patientRows = patients.map((patient) => {
    const doctor =
      typeof patient.doctorId === 'object' ? patient.doctorId : null;

    return {
      _id: patient._id,
      name: patient.name,
      phone: patient.phone,
      condition: patient.condition,
      createdAt: patient.createdAt,
      doctorName: doctor?.name ?? DASHBOARD_STRINGS.unassigned,
    };
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-xs font-semibold text-text-muted">
            {DASHBOARD_STRINGS.loadingDashboard}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      adminName={admin.name}
      adminEmail={admin.email}
      totalPatients={overview?.totalPatients}
      totalDoctors={overview?.totalDoctors}
      onLogout={handleLogout}
      logoutLoading={logoutLoading}
    >
      <div className="space-y-7">
        {/* Error Notification */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-2xl border border-danger/20 bg-danger-bg px-4 py-3 text-xs font-semibold text-danger shadow-xs"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-danger/10"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Greeting Header */}
        <section className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {DASHBOARD_STRINGS.greetingPrefix}, {admin.name || DASHBOARD_STRINGS.greetingFallback}! 👋
            </h2>
            <p className="mt-1 text-xs font-medium text-text-secondary sm:text-sm">
              {DASHBOARD_STRINGS.subheading}
            </p>
          </div>
        </section>

        {/* Real Overview Metric Cards */}
        <DashboardStats
          totalDoctors={overview?.totalDoctors}
          totalPatients={overview?.totalPatients}
        />

        {/* Real Database Charts */}
        <DashboardCharts
          registrationData={registrationData}
          doctorData={doctorData}
        />

        {/* Recent Patients Table */}
        <DashboardRecentPatients
          patients={patientRows}
          totalPatients={totalPatients}
          page={page}
          totalPages={totalPages}
          searchQuery={searchQuery}
          loading={patientsLoading}
          onSearchChange={(query) => {
            setPatientsLoading(true);
            setSearchQuery(query);
            setPage(1);
          }}
          onPageChange={(newPage) => {
            setPatientsLoading(true);
            setPage(newPage);
          }}
        />

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-2 border-t border-border/50 pt-5 pb-4 text-xs font-medium text-text-muted sm:flex-row">
          <p>{DASHBOARD_STRINGS.copyright(currentYear)}</p>
          <p>{DASHBOARD_STRINGS.footerTagline}</p>
        </footer>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

