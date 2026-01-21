// Mock data for Dashboard component
// This file will be replaced with actual API calls during integration

export interface StatCardData {
  label: string
  value: string
  subtitle: string
  additionalValue: string
  change: string
  trend: 'up' | 'down'
}

export interface TestResultsOverTime {
  date: string
  passed: number
  failed: number
}

export interface TestStatusByModel {
  model: string
  passed: number
  failed: number
}

export interface TestTypeDistribution {
  name: string
  value: number
  color: string
}

export interface RecentExecution {
  id: string
  model: string
  status: 'success' | 'failed'
  time: string
}

export interface AutomatedReport {
  id: string
  title: string
  description: string
  lastGenerated: string
}

// Key Metrics Cards Data
export const statCardsData: StatCardData[] = [
  {
    label: 'TOTAL TESTS',
    value: '142',
    subtitle: 'Active Tests',
    additionalValue: '158',
    change: '+5',
    trend: 'up',
  },
  {
    label: 'PASS RATE',
    value: '98.6%',
    subtitle: 'Success Rate',
    additionalValue: '98.1%',
    change: '+0.5%',
    trend: 'up',
  },
  {
    label: 'AVG DURATION',
    value: '2.3m',
    subtitle: 'Execution Time',
    additionalValue: '2.5m',
    change: '-0.2m',
    trend: 'down',
  },
  {
    label: 'RUNS TODAY',
    value: '12',
    subtitle: 'Test Executions',
    additionalValue: '9',
    change: '+3',
    trend: 'up',
  },
]

// Test Results Over Time Data
export const testResultsOverTimeData: TestResultsOverTime[] = [
  { date: '2024-01-10', passed: 115, failed: 2 },
  { date: '2024-01-11', passed: 120, failed: 1 },
  { date: '2024-01-12', passed: 125, failed: 0 },
  { date: '2024-01-13', passed: 128, failed: 1 },
  { date: '2024-01-14', passed: 132, failed: 0 },
  { date: '2024-01-15', passed: 130, failed: 2 },
]

// Test Status by Model Data
export const testStatusByModelData: TestStatusByModel[] = [
  { model: 'customers', passed: 45, failed: 1 },
  { model: 'orders', passed: 38, failed: 0 },
  { model: 'products', passed: 32, failed: 1 },
  { model: 'transactions', passed: 28, failed: 0 },
]

// Test Type Distribution Data
export const testTypeDistributionData: TestTypeDistribution[] = [
  { name: 'Not Null', value: 32, color: '#3b82f6' },
  { name: 'Unique', value: 20, color: '#10b981' },
  { name: 'Relationships', value: 23, color: '#f59e0b' },
  { name: 'Accepted Values', value: 14, color: '#8b5cf6' },
  { name: 'Other', value: 11, color: '#64748b' },
]

// Recent Executions Data
export const recentExecutionsData: RecentExecution[] = [
  { id: 'TR-2024-001', model: 'customers', status: 'success', time: '10:30 AM' },
  { id: 'TR-2024-002', model: 'orders', status: 'success', time: '09:15 AM' },
  { id: 'TR-2024-003', model: 'products', status: 'success', time: '08:00 AM' },
  { id: 'TR-2024-004', model: 'transactions', status: 'failed', time: '07:45 AM' },
]

// Automated Reports Data
export const automatedReportsData: AutomatedReport[] = [
  {
    id: 'RPT-001',
    title: 'Daily Test Execution Report',
    description: 'Generated after CI/CD pipeline runs',
    lastGenerated: '2024-01-15 10:30 AM',
  },
]

// DBT Project Stats Interface
export interface DbtProjectStats {
  projectId: string;
  projectName: string;
  totalModels: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testCoverage: number;
  lastRunAt: string;
  nextRunAt?: string;
}

// Helper function to get a date X hours ago
const getHoursAgo = (hours: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

// Helper function to get a date X hours from now
const getHoursFromNow = (hours: number): string => {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

// DBT Project Stats - mapped by project ID
export const mockDbtProjectStatsMap: Record<string, DbtProjectStats> = {
  'project-1': {
    projectId: 'project-1',
    projectName: 'dbt_analytics_warehouse',
    totalModels: 45,
    totalTests: 142,
    passedTests: 140,
    failedTests: 2,
    testCoverage: 96,
    lastRunAt: getHoursAgo(2), // 2 hours ago
    nextRunAt: getHoursFromNow(2), // 2 hours from now
  },
  'project-2': {
    projectId: 'project-2',
    projectName: 'dbt_marketing_analytics',
    totalModels: 32,
    totalTests: 98,
    passedTests: 96,
    failedTests: 2,
    testCoverage: 94,
    lastRunAt: getHoursAgo(3), // 3 hours ago
    nextRunAt: getHoursFromNow(1), // 1 hour from now
  },
};

// Project-specific dashboard metrics
export const getProjectStatCards = (projectId: string): StatCardData[] => {
  if (projectId === 'project-1') {
    return [
      {
        label: 'TOTAL TESTS',
        value: '142',
        subtitle: 'Active Tests',
        additionalValue: '158',
        change: '+5',
        trend: 'up',
      },
      {
        label: 'PASS RATE',
        value: '98.6%',
        subtitle: 'Success Rate',
        additionalValue: '98.1%',
        change: '+0.5%',
        trend: 'up',
      },
      {
        label: 'AVG DURATION',
        value: '2.3m',
        subtitle: 'Execution Time',
        additionalValue: '2.5m',
        change: '-0.2m',
        trend: 'down',
      },
      {
        label: 'RUNS TODAY',
        value: '12',
        subtitle: 'Test Executions',
        additionalValue: '9',
        change: '+3',
        trend: 'up',
      },
    ];
  } else {
    // project-2
    return [
      {
        label: 'TOTAL TESTS',
        value: '98',
        subtitle: 'Active Tests',
        additionalValue: '105',
        change: '+7',
        trend: 'up',
      },
      {
        label: 'PASS RATE',
        value: '98.0%',
        subtitle: 'Success Rate',
        additionalValue: '97.5%',
        change: '+0.5%',
        trend: 'up',
      },
      {
        label: 'AVG DURATION',
        value: '1.8m',
        subtitle: 'Execution Time',
        additionalValue: '2.1m',
        change: '-0.3m',
        trend: 'down',
      },
      {
        label: 'RUNS TODAY',
        value: '8',
        subtitle: 'Test Executions',
        additionalValue: '6',
        change: '+2',
        trend: 'up',
      },
    ];
  }
};

