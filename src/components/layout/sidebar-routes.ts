import {
  Briefcase,
  Building2,
  Building2Icon,
  FileText,
  History as HistoryIcon,
  Home,
  HomeIcon,
  RotateCcw,
  Settings as SettingsIcon,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';

export const commonItems = [
  { titleKey: 'sidebar.nav.page1', url: '/home', icon: Home },
  { titleKey: 'sidebar.nav.companies', url: '/companies', icon: Building2 },
];

export const adminItems = [
  {
    groupKey: 'sidebar.groups.security',
    items: [
      { titleKey: 'sidebar.nav.users', url: '/users', icon: Users },
      { titleKey: 'sidebar.nav.roles', url: '/roles', icon: ShieldCheck },
      { titleKey: 'sidebar.nav.teams', url: '/teams', icon: Briefcase },
      // { titleKey: 'sidebar.nav.organizations', url: '/organizations', icon: Building2Icon },
    ],
  },
  {
    groupKey: 'sidebar.groups.audit',
    items: [
      { titleKey: 'sidebar.nav.audit', url: '/audit', icon: HistoryIcon },
      { titleKey: 'sidebar.nav.recovery', url: '/recovery', icon: RotateCcw },
      { titleKey: 'sidebar.nav.documents', url: '/documents', icon: FileText },
    ],
  },
];
