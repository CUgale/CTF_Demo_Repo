export interface User {
  email: string;
  name: string;
  role: 'Admin' | 'Regular';
}

export interface DashboardProps {
  user: User | null;
}

export interface TestMetric {
  label: string;
  value: string;
  color: string;
  trend: string;
}

export interface TestData {
  id: number;
  name: string;
  model: string;
  status: 'passed' | 'failed';
  runtime: string;
  timestamp: string;
  createdBy: string;
  type: string;
  coverage: number;
}

export interface DbtProjectStats {
  projectId: string;
  projectName: string;
  totalModels: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastRunAt?: string;
}
