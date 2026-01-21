/**
 * Mock data for Header component
 * This file contains all mock data and configuration
 * to make API integration easier in the future
 */

import { DbtProject, UserData } from './Header.interface';

export interface NavItem {
  id: string;
  label: string;
  route: string;
}

/**
 * Navigation items configuration
 */
export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'DASHBOARD', route: '/dashboard' },
  { id: 'jobs', label: 'JOBS', route: '/jobs' },
  { id: 'tests', label: 'TESTS', route: '/tests' },
  { id: 'data', label: 'DATA', route: '/data' },
  { id: 'admin', label: 'ADMIN', route: '/admin/settings' },
];

/**
 * Route mapping for navigation
 */
export const ROUTE_MAP: Record<string, string> = {
  dashboard: '/dashboard',
  jobs: '/jobs',
  tests: '/tests',
  data: '/data',
  admin: '/admin/settings',
};

/**
 * Get active section based on pathname
 */
export const getActiveSection = (pathname: string): string => {
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/jobs' || pathname === '/create-job' || pathname.startsWith('/jobs/')) return 'jobs';
  if (pathname === '/tests' || pathname.includes('test-review') || pathname.includes('test-generation')) return 'tests';
  if (pathname === '/data' || pathname.includes('/data/')) return 'data';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'dashboard';
};

/**
 * Get visible and overflow items based on screen width
 */
export const getVisibleAndOverflowItems = (windowWidth: number, navItems: NavItem[]) => {
  // On very small screens (< 768px), show all items (they will wrap)
  if (windowWidth < 768) {
    return { visible: navItems.map(item => item.id), overflow: [] };
  }

  // On medium screens (768px - 1200px), show first 3 items, rest in dropdown
  if (windowWidth < 1200) {
    return {
      visible: navItems.slice(0, 3).map(item => item.id),
      overflow: navItems.slice(3).map(item => item.id),
    };
  }

  // On large screens, show all items
  return { visible: navItems.map(item => item.id), overflow: [] };
};

/**
 * Mock user data
 */
export const mockUserData: UserData = {
  username: 'Admin',
  email: 'admin@example.com',
  roles: ['Admin', 'User'],
};

/**
 * Mock dbt projects
 */
export const mockDbtProjects: DbtProject[] = [
  {
    id: 'project-1',
    name: 'dbt_analytics_warehouse',
    repository: 'org/analytics-warehouse',
    branch: 'main',
    isActive: true,
  },
  {
    id: 'project-2',
    name: 'dbt_marketing_analytics',
    repository: 'org/marketing-data',
    branch: 'main',
    isActive: false,
  },
];
