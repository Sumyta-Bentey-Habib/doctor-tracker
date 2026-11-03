'use client';

import { useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';

const registrationData = [
  { day: 'Mon', patients: 18 },
  { day: 'Tue', patients: 27 },
  { day: 'Wed', patients: 22 },
  { day: 'Thu', patients: 35 },
  { day: 'Fri', patients: 29 },
  { day: 'Sat', patients: 43 },
  { day: 'Sun', patients: 38 },
];

const doctorData = [
  { name: 'Dr. Sarah', patients: 42 },
  { name: 'Dr. James', patients: 35 },
  { name: 'Dr. Emily', patients: 28 },
  { name: 'Dr. Michael', patients: 21 },
  { name: 'Dr. David', patients: 16 },
];

const patients = [
  {
    id: 'PT-001',
    name: 'Olivia Rhye',
    email: 'olivia.rhye@example.com',
    doctor: 'Dr. Sarah Wilson',
    condition: 'Migraine',
    date: 'Nov 03, 2026',
    status: 'Active',
    initials: 'OR',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'PT-002',
    name: 'Phoenix Baker',
    email: 'phoenix@example.com',
    doctor: 'Dr. James Miller',
    condition: 'Hypertension',
    date: 'Nov 03, 2026',
    status: 'Active',
    initials: 'PB',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'PT-003',
    name: 'Lana Steiner',
    email: 'lana@example.com',
    doctor: 'Dr. Emily Davis',
    condition: 'Diabetes',
    date: 'Nov 02, 2026',
    status: 'Pending',
    initials: 'LS',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'PT-004',
    name: 'Demi Wilkinson',
    email: 'demi@example.com',
    doctor: 'Dr. Sarah Wilson',
    condition: 'Asthma',
    date: 'Nov 02, 2026',
    status: 'Active',
    initials: 'DW',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'PT-005',
    name: 'Candice Wu',
    email: 'candice@example.com',
    doctor: 'Dr. Michael Lee',
    condition: 'Arthritis',
    date: 'Nov 01, 2026',
    status: 'Inactive',
    initials: 'CW',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

const stats = [
  {
    title: 'Total Doctors',
    value: '48',
    change: '+12.5%',
    description: 'from last month',
    icon: Stethoscope,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    positive: true,
  },
  {
    title: 'Total Patients',
    value: '1,284',
    change: '+18.2%',
    description: 'from last month',
    icon: Users,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    positive: true,
  },
  {
    title: 'New Registrations',
    value: '126',
    change: '+8.4%',
    description: 'from last month',
    icon: ClipboardList,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    positive: true,
  },
  {
    title: 'Pending Reviews',
    value: '18',
    change: '-4.3%',
    description: 'from last month',
    icon: Clock3,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    positive: false,
  },
];

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Doctors', icon: Stethoscope },
  { label: 'Patients', icon: Users },
];

export default function DashboardPage() {
  const [activePage, setActivePage] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.doctor} ${patient.condition} ${patient.id}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] lg:flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#17243b] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f6df5]">
              <Activity size={23} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight">MediTrack</h1>
              <p className="text-[10px] tracking-[2px] text-slate-400">ADMIN PORTAL</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-slate-500">
            MAIN MENU
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActivePage(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                    isActive
                      ? 'bg-[#4f6df5] text-white shadow-lg shadow-blue-950/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                  {item.label === 'Patients' && (
                    <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                      1.2k
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-5">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-slate-500">
            PREFERENCES
          </p>
          <button
            onClick={() => setActivePage('Settings')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
              activePage === 'Settings'
                ? 'bg-[#4f6df5] text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings size={19} />
            Settings
          </button>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <Activity size={18} />
            </div>
            <p className="text-xs font-semibold">Need assistance?</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              Contact your system administrator for support.
            </p>
            <button className="mt-3 text-[11px] font-semibold text-blue-300 hover:text-blue-200">
              Contact support →
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-bold text-indigo-200">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Admin User</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
            <MoreHorizontal size={19} className="text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-[18px] font-bold tracking-tight text-[#17243b] sm:text-xl">
                {activePage}
              </h2>
              <p className="mt-0.5 hidden text-[11px] text-slate-400 sm:block">
                Dashboard / {activePage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:flex">
              <CalendarDays size={15} />
              November 03, 2026
            </div>

            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <button className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9edff] text-xs font-bold text-[#4f6df5]">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-slate-700">Admin User</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <div className="dashboard-scrollbar mx-auto max-w-[1600px] space-y-7 overflow-x-hidden p-5 sm:p-8 lg:p-10">
          {/* Welcome */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-medium text-[#4f6df5]">TUESDAY, NOVEMBER 03, 2026</p>
              <h2 className="text-2xl font-bold tracking-tight text-[#17243b] sm:text-[28px]">
                Good afternoon, Admin <span>👋</span>
              </h2>
              <p className="mt-2 text-[13px] text-slate-500">
                Here&apos;s what&apos;s happening with your healthcare system today.
              </p>
            </div>

            <button className="flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-[#4f6df5] px-4 text-xs font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#405de0] sm:self-auto">
              <Plus size={16} />
              Add new doctor
            </button>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const TrendIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-slate-500">{stat.title}</p>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={19} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-2">
                    <h3 className="text-[29px] font-bold tracking-tight text-[#17243b]">
                      {stat.value}
                    </h3>
                    <div
                      className={`mb-1 flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${
                        stat.positive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <TrendIcon size={13} />
                      {stat.change}
                    </div>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400">{stat.description}</p>
                </article>
              );
            })}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
            <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] sm:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#17243b]">Patient registrations</h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Overview of new patient registrations
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium text-slate-600 hover:bg-slate-50">
                  This week <ChevronDown size={13} />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <p className="text-2xl font-bold text-[#17243b]">212</p>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <ArrowUpRight size={13} /> 12.8%
                </span>
                <span className="text-[10px] text-slate-400">vs. previous week</span>
              </div>

              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={registrationData}
                    margin={{ top: 10, right: 5, left: -22, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f6df5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4f6df5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#edf0f5" strokeDasharray="4 5" vertical={false} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#98a1b2', fontSize: 11 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#98a1b2', fontSize: 10 }}
                      ticks={[0, 10, 20, 30, 40, 50]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #edf0f5',
                        fontSize: 11,
                        boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#4f6df5"
                      strokeWidth={2.5}
                      fill="url(#patientGradient)"
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] sm:p-6">
              <div className="mb-7">
                <h3 className="text-sm font-bold text-[#17243b]">Patients per doctor</h3>
                <p className="mt-1 text-[11px] text-slate-400">Patient distribution by doctor</p>
              </div>

              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={doctorData}
                    layout="vertical"
                    margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                    barCategoryGap={15}
                  >
                    <CartesianGrid stroke="#edf0f5" horizontal={false} />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#98a1b2', fontSize: 10 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={78}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f7f8fc' }}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #edf0f5',
                        fontSize: 11,
                      }}
                    />
                    <Bar dataKey="patients" fill="#4f6df5" radius={[0, 5, 5, 0]} barSize={13} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* Recent patients */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-sm font-bold text-[#17243b]">Recent patients</h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  Keep track of the latest patient records
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-[210px]">
                  <Search size={15} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-50">
                  View all <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="dashboard-scrollbar overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50/70">
                    {[
                      'PATIENT',
                      'PATIENT ID',
                      'ASSIGNED DOCTOR',
                      'CONDITION',
                      'REGISTERED',
                      'STATUS',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3.5 text-[9px] font-semibold tracking-[1px] text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${patient.color}`}
                          >
                            {patient.initials}
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700">
                              {patient.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">{patient.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[10px] font-medium text-slate-500">
                        {patient.id}
                      </td>

                      <td className="px-6 py-4 text-[10px] font-medium text-slate-600">
                        {patient.doctor}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium text-slate-600">
                          {patient.condition}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[10px] text-slate-500">{patient.date}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                            patient.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600'
                              : patient.status === 'Pending'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                        No patients match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p className="text-[10px] text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-600">{filteredPatients.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{patients.length}</span> sample
                patients
              </p>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous page"
                  disabled
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                <button className="h-7 w-7 rounded-lg bg-[#4f6df5] text-[10px] font-semibold text-white">
                  1
                </button>
                <button
                  aria-label="Next page"
                  disabled
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-slate-400 sm:flex-row">
            <p>© 2026 MediTrack. All rights reserved.</p>
            <p>Healthcare management made simpler.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
