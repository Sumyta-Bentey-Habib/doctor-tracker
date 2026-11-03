'use client';

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
import { DASHBOARD_STRINGS } from '@/utils';

interface RegistrationDataPoint {
  day: string;
  patients: number;
}

interface DoctorDataPoint {
  name: string;
  patients: number;
}

interface DashboardChartsProps {
  registrationData: RegistrationDataPoint[];
  doctorData: DoctorDataPoint[];
}

function formatDayLabel(rawDay: string): string {
  if (!rawDay) return '';
  // If rawDay looks like a date (e.g. 2026-11-03)
  if (rawDay.includes('-') || rawDay.includes('/')) {
    const parsed = new Date(rawDay);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }
  return rawDay;
}

export function DashboardCharts({
  registrationData,
  doctorData,
}: DashboardChartsProps) {
  const formattedRegistrationData = registrationData.map((item) => ({
    ...item,
    formattedDay: formatDayLabel(item.day),
  }));

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
      {/* Real Chart 1: Patient Registrations Trend */}
      <article className="flex flex-col justify-between rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
        <div className="mb-6">
          <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {DASHBOARD_STRINGS.chartRegistrationsTitle}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {DASHBOARD_STRINGS.chartRegistrationsSubtitle}
          </p>
        </div>

        <div className="h-[270px] w-full">
          {formattedRegistrationData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedRegistrationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--chart-primary)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="var(--chart-grid)"
                  strokeDasharray="4 6"
                  vertical={false}
                />

                <XAxis
                  dataKey="formattedDay"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--border)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '8px 14px',
                    fontSize: '12px',
                  }}
                  formatter={(value: unknown) => [
                    `${Number(value)} patients`,
                    'Registrations',
                  ]}
                  labelFormatter={(label) => String(label)}
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
            <div className="flex h-full items-center justify-center text-xs font-medium text-text-muted">
              {DASHBOARD_STRINGS.chartNoTrends}
            </div>
          )}
        </div>
      </article>

      {/* Real Chart 2: Patients per Doctor Distribution */}
      <article className="flex flex-col justify-between rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition hover:border-primary/20">
        <div className="mb-6">
          <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {DASHBOARD_STRINGS.chartDoctorTitle}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            {DASHBOARD_STRINGS.chartDoctorSubtitle}
          </p>
        </div>

        <div className="h-[270px] w-full">
          {doctorData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorData}
                layout="vertical"
                margin={{ top: 0, right: 15, left: 0, bottom: 0 }}
                barCategoryGap={16}
              >
                <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--chart-tooltip-bg)',
                    borderColor: 'var(--border)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '8px 14px',
                    fontSize: '12px',
                  }}
                  formatter={(value: unknown) => [
                    `${Number(value)} patients`,
                    'Assigned',
                  ]}
                />

                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill="var(--chart-primary)"
                  radius={[0, 8, 8, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-medium text-text-muted">
              {DASHBOARD_STRINGS.chartNoDoctors}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
