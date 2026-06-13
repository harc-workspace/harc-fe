import { BadgeDollarSign, Clock3, Files, Home, User } from 'lucide-react';

export type DashboardSection = 'home' | 'profile' | 'timeOff' | 'payroll' | 'documents';

export const dashboardSections: Array<{
  key: DashboardSection;
  to: string;
  icon: typeof Home;
  labelKey: string;
}> = [
  { key: 'home', to: '/dashboard/home', icon: Home, labelKey: 'dashboard.sidebar.sections.home' },
  { key: 'profile', to: '/dashboard/profile', icon: User, labelKey: 'dashboard.sidebar.sections.profile' },
  { key: 'timeOff', to: '/dashboard/time-off', icon: Clock3, labelKey: 'dashboard.sidebar.sections.timeOff' },
  { key: 'payroll', to: '/dashboard/payroll', icon: BadgeDollarSign, labelKey: 'dashboard.sidebar.sections.payroll' },
  { key: 'documents', to: '/dashboard/documents', icon: Files, labelKey: 'dashboard.sidebar.sections.documents' },
];

export function getDashboardSectionFromPath(pathname: string): DashboardSection {
  if (pathname.startsWith('/dashboard/profile')) {
    return 'profile';
  }

  if (pathname.startsWith('/dashboard/time-off')) {
    return 'timeOff';
  }

  if (pathname.startsWith('/dashboard/payroll')) {
    return 'payroll';
  }

  if (pathname.startsWith('/dashboard/documents')) {
    return 'documents';
  }

  return 'home';
}
