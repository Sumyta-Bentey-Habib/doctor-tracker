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

