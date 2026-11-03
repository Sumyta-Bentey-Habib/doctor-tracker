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
