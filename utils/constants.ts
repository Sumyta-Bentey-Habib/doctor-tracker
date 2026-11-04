export const APP_STRINGS = {
  appName: 'Doctor Tracker',
  portalName: 'Admin Portal',
  searchPlaceholder: 'Search patients by name, doctor, or condition...',
  noPatientsFound: 'No patient records found.',
  verifyingSession: 'Verifying your session...',
  loadingDashboard: 'Loading dashboard data...',
  unableToLoadDashboard: 'Unable to load dashboard data.',
  unableToLoadPatients: 'Unable to load patients.',
  unableToLogout: 'Unable to log out.',
} as const;

export type AppStrings = typeof APP_STRINGS;

export const PATIENT_STRINGS = {
  // Navigation & Headers
  brandName: 'DoctorTracker',
  adminPortal: 'ADMIN PORTAL',
  navMenu: 'Main menu',
  navOverview: 'Overview',
  navDoctors: 'Doctors',
  navPatients: 'Patients',
  signOut: 'Sign out',
  adminBadge: 'ADMIN / PATIENTS',
  pageTitle: 'Patient Management',
  heading: 'Manage patients',
  subheading: 'Add, update, search, and manage patient records.',
  addPatient: 'Add patient',

  // Stats
  totalRegistered: 'Total registered patients',

  // Filters
  filterHeading: 'Search and filters',
  filterSubheading: 'Find patients by name, phone number, or medical condition.',
  searchPlaceholder: 'Search patients...',
  conditionPlaceholder: 'Filter by condition...',
  startDatePlaceholder: 'From (YYYY-MM-DD)',
  endDatePlaceholder: 'To (YYYY-MM-DD)',
  clearAllFilters: 'Clear all filters',

  // Table
  recordsHeading: 'Patient records',
  recordsSubheading: 'Patient information retrieved from your database.',
  colPatient: 'Patient',
  colAgeGender: 'Age / Gender',
  colCondition: 'Condition',
  colDoctor: 'Assigned doctor',
  colContact: 'Contact',
  colJoined: 'Joined',
  colActions: 'Actions',
  loadingPatients: 'Loading patients...',
  noPatientsTitle: 'No patients found',
  noPatientsDescription: 'Try changing your search or add a new patient.',
  doctorUnavailable: 'Doctor unavailable',
  years: 'years',
  editPatientTitle: 'Edit patient',
  deletePatientTitle: 'Delete patient',
  showingPrefix: 'Showing',
  showingOf: 'of',
  patientsWord: 'patients',
  patientWord: 'patient',
  pageWord: 'Page',

  // Modal
  modalAddTitle: 'Add new patient',
  modalEditTitle: 'Edit patient',
  modalAddSubtitle: 'Enter the patient information and assign a doctor.',
  modalEditSubtitle: 'Update the patient information below.',
  labelName: 'Patient name',
  placeholderName: 'Enter patient name',
  labelAge: 'Age',
  placeholderAge: 'Enter age',
  labelGender: 'Gender',
  labelPhone: 'Phone number',
  placeholderPhone: '+8801XXXXXXXXX',
  labelCondition: 'Medical condition',
  placeholderCondition: 'e.g. Migraine',
  labelAssignDoctor: 'Assign doctor',
  selectDoctorPlaceholder: 'Select a doctor',
  noDoctorsWarning: 'Add a doctor before registering a patient.',
  assignedDoctorLabel: 'Assigned doctor',
  doctorReassignNote: 'Doctor reassignment is not supported by the current backend update API.',
  btnCancel: 'Cancel',
  btnSaving: 'Saving...',
  btnSaveChanges: 'Save changes',
  btnCreatePatient: 'Create patient',

  // Validation & Errors
  validationName: 'Patient name must be at least 2 characters.',
  validationAge: 'Enter a valid age between 0 and 130.',
  validationPhone: 'Phone number must be at least 7 characters.',
  validationCondition: 'Condition must be at least 2 characters.',
  validationDoctor: 'Please select a doctor.',
  failedToLoadPatients: 'Failed to load patients',
  failedToLoadDoctors: 'Failed to load doctors',
  failedToSavePatient: 'Failed to save patient',
  failedToDeletePatient: 'Failed to delete patient',
  deleteConfirmation: (name: string) =>
    `Are you sure you want to delete ${name}? This action cannot be undone.`,
} as const;

export type PatientStrings = typeof PATIENT_STRINGS;

export const DOCTOR_STRINGS = {
  // Navigation & Brand
  brandName: 'DoctorTracker',
  adminPortal: 'ADMIN PORTAL',
  mainMenu: 'MAIN MENU',
  preferences: 'PREFERENCES',
  overview: 'Overview',
  doctors: 'Doctors',
  patients: 'Patients',
  settings: 'Settings',
  needAssistance: 'Need assistance?',
  assistanceText: 'Contact your system administrator for support.',
  administrator: 'Administrator',
  logout: 'Log out',

  // Headers
  headerBadge: 'Dashboard / Doctors',
  headingBadge: 'DOCTOR DIRECTORY',
  heading: 'Manage doctors',
  subheading: 'Add, update, search, and manage doctor records.',
  addDoctor: 'Add doctor',

  // Summary / Stats
  totalRegisteredDoctors: 'Total registered doctors',

  // Filters
  filterHeading: 'Search and filters',
  searchPlaceholder: 'Search doctors...',
  specializationPlaceholder: 'Filter by specialization',
  hospitalPlaceholder: 'Filter by hospital',
  startDatePlaceholder: 'From (YYYY-MM-DD)',
  endDatePlaceholder: 'To (YYYY-MM-DD)',
  clearAllFilters: 'Clear all filters',

  // Table
  recordsHeading: 'Doctor records',
  recordsSubheading: 'Doctor information retrieved from your database.',
  tableColumns: ['DOCTOR', 'SPECIALIZATION', 'HOSPITAL', 'CONTACT', 'JOINED', 'ACTIONS'] as const,
  loadingDoctors: 'Loading doctors...',
  noDoctorsTitle: 'No doctors found',
  noDoctorsSubtitle: 'Try changing your filters or add a new doctor.',
  editDoctor: 'Edit doctor',
  deleteDoctor: 'Delete doctor',
  viewPatients: 'View assigned patients',
  doctorPatientsModalTitle: (name: string) => `Patients of ${name}`,
  doctorPatientsModalSubtitle: (count: number) =>
    `${count} patient${count === 1 ? '' : 's'} assigned to this doctor.`,
  addPatientUnderDoctor: 'Add patient to this doctor',
  noDoctorPatientsTitle: 'No patients assigned',
  noDoctorPatientsSubtitle: 'This doctor has no assigned patients yet.',
  deletePatientFromDoctorConfirm: (name: string) =>
    `Are you sure you want to remove ${name} from this doctor's patient list?`,
  patientDeletedFromDoctorSuccess: 'Patient removed from doctor list.',
  patientAddedUnderDoctorSuccess: 'Patient registered under this doctor.',
  showing: 'Showing',
  of: 'of',
  doctorsWord: 'doctors',
  doctorWord: 'doctor',
  pageWord: 'Page',

  // Footer
  copyright: (year: number) => `© ${year} DoctorTracker. All rights reserved.`,
  footerTagline: 'Healthcare management made simpler.',

  // Modal
  modalAddTitle: 'Add new doctor',
  modalEditTitle: 'Edit doctor',
  modalAddSubtitle: 'Enter the doctor information to create a record.',
  modalEditSubtitle: 'Update the doctor information below.',
  btnCancel: 'Cancel',
  btnSaving: 'Saving...',
  btnSaveChanges: 'Save changes',
  btnAddDoctor: 'Add doctor',

  // Alerts & Messages
  doctorCreatedSuccess: 'Doctor added successfully.',
  doctorUpdatedSuccess: 'Doctor updated successfully.',
  doctorDeletedSuccess: (name: string) => `${name} was deleted successfully.`,
  unableToLoadDoctors: 'Unable to load doctors.',
  unableToSaveDoctor: 'Unable to save doctor.',
  unableToDeleteDoctor: 'Unable to delete doctor.',
  unableToLogout: 'Unable to log out.',
  deleteConfirmation: (name: string) => `Are you sure you want to delete ${name}?`,
} as const;

export type DoctorStrings = typeof DOCTOR_STRINGS;

export const DASHBOARD_STRINGS = {
  // Brand & Nav
  brandName: 'DoctorTracker',
  adminPortal: 'ADMIN PORTAL',
  navOverview: 'Overview',
  navDoctors: 'Doctors',
  navPatients: 'Patients',
  navSettings: 'Settings',
  navAnalytics: 'Analytics',
  mainMenu: 'MAIN MENU',
  preferences: 'PREFERENCES',

  // Welcome Header
  greetingPrefix: 'Good day',
  greetingFallback: 'Admin',
  overviewHeading: 'Overview',
  breadcrumb: 'Dashboard / Overview',
  subheading: "Here's an overview of your healthcare system.",

  // Stat Cards
  statTotalDoctors: 'Total Doctors',
  statTotalDoctorsSubtitle: 'Active medical staff',
  statTotalPatients: 'Total Patients',
  statTotalPatientsSubtitle: 'Registered patient base',

  // Charts
  chartRegistrationsTitle: 'Patient registrations',
  chartRegistrationsSubtitle: 'Registration trends from your database',
  chartDoctorTitle: 'Patients per doctor',
  chartDoctorSubtitle: 'Patient distribution by doctor',
  chartCurrentMonth: 'Current Month',
  chartNoTrends: 'No registration trend data available.',
  chartNoDoctors: 'No doctor distribution data available.',

  // Recent Patients
  recentPatientsTitle: 'Recent patients',
  recentPatientsSubtitle: 'Patient records retrieved from your database',
  searchPlaceholder: 'Search patients...',
  colPatient: 'PATIENT',
  colPatientId: 'PATIENT ID',
  colDoctor: 'ASSIGNED DOCTOR',
  colCondition: 'CONDITION',
  colRegistered: 'REGISTERED',
  noPatientsFound: 'No patient records found.',
  loadingPatients: 'Loading patients...',
  unassigned: 'Unassigned',
  showing: 'Showing',
  of: 'of',
  patientsWord: 'patients',
  pageWord: 'Page',

  // Sidebar assistance & user
  needAssistance: 'Need assistance?',
  assistanceText: 'Contact your system administrator for support.',
  administrator: 'Administrator',
  logout: 'Log out',
  loadingDashboard: 'Loading dashboard...',
  unableToLoad: 'Unable to load dashboard data.',
  unableToLogout: 'Unable to log out.',

  // Footer
  copyright: (year: number) => `© ${year} DoctorTracker. All rights reserved.`,
  footerTagline: 'Healthcare management made simpler.',
} as const;

export type DashboardStrings = typeof DASHBOARD_STRINGS;

export const THEME_STRINGS = {
  themePreference: 'Theme preference',
  lightMode: 'Light',
  darkMode: 'Dark',
  systemMode: 'System',
  switchToLight: 'Switch to light mode',
  switchToDark: 'Switch to dark mode',
} as const;

export type ThemeStrings = typeof THEME_STRINGS;

export const WELCOME_STRINGS = {
  brandName: 'DoctorTracker',
  adminPortal: 'ADMIN PORTAL',
  badge: 'HEALTHCARE MANAGEMENT PLATFORM',
  heroTitle: 'Manage healthcare operations with modern clarity & intelligence.',
  heroSubtitle:
    'A unified workspace to oversee medical practitioners, track patient registrations, and analyze hospital flow in real-time.',
  btnGetStarted: 'Access Admin Portal',
  btnLogin: 'Sign In',
  btnDashboard: 'Open Dashboard',
  featuresHeading: 'Engineered for modern healthcare teams',
  featuresSubheading:
    'Streamlined tools designed to minimize operational friction and maximize patient care quality.',
  feature1Title: 'Doctor Directory',
  feature1Desc:
    'Track practitioner credentials, specialties, hospitals, and direct contacts in one place.',
  feature2Title: 'Patient Admissions',
  feature2Desc:
    'Register incoming patients, assign designated doctors, and record conditions seamlessly.',
  feature3Title: 'Operational Insights',
  feature3Desc: 'Real-time registration metrics and doctor load distribution at your fingertips.',
  securityBadge: 'Protected by role-based administrator security & session encryption',
  footerCopyright: (year: number) => `© ${year} DoctorTracker. All rights reserved.`,
} as const;

export type WelcomeStrings = typeof WELCOME_STRINGS;

export const LOGIN_STRINGS = {
  brandName: 'DoctorTracker',
  adminPortal: 'ADMIN PORTAL',
  backToWelcome: 'Back to welcome',
  heading: 'Welcome back',
  subheading: 'Enter your administrator credentials to access your dashboard.',
  labelEmail: 'Email address',
  placeholderEmail: 'admin@example.com',
  labelPassword: 'Password',
  placeholderPassword: 'Enter your password',
  btnSignIn: 'Sign in to dashboard',
  btnSigningIn: 'Signing in...',
  restrictedNotice: 'Restricted access · Authorized administrators only',
  sideTitle: 'Manage healthcare operations with clarity.',
  sideSubtitle: 'A centralized workspace to manage doctors, patients, and healthcare records.',
} as const;

export type LoginStrings = typeof LOGIN_STRINGS;

export const CALENDAR_STRINGS = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  clearDate: 'Clear',
  today: 'Today',
  selectDate: 'Select date',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const,
  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const,
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const,
} as const;

export type CalendarStrings = typeof CALENDAR_STRINGS;



