export type TestStatus = 'pending' | 'approved' | 'rejected';
export type TestType = 'not_null' | 'unique' | 'relationships' | 'accepted_values' | 'custom';
export type TestSource = 'ai' | 'dbt';
export type TestCategory = 'happy_path' | 'negative';
export type TestExecutionStatus = 'passed' | 'failed' | 'not_executed';

export interface TestDetail {
  id: string;
  name: string;
  type: TestType;
  model: string;
  column?: string;
  sql: string;
  description: string;
  status: TestStatus;
  generatedAt: string;
  generatedBy?: string;
  source: TestSource;
  isPushed?: boolean;
  pushedAt?: string;
  testCategory?: TestCategory;
  executionStatus?: TestExecutionStatus;
  lastExecuted?: string;
}

export interface GitMetadata {
  repository: string;
  branch: string;
  targetPath: string;
  commitMessage: string;
  author: {
    name: string;
    email: string;
  };
}

export interface TestReviewData {
  jobId: string;
  phaseId?: string;
  totalTests: number;
  approvedTests: number;
  rejectedTests: number;
  pendingTests: number;
  tests: TestDetail[];
  gitMetadata?: GitMetadata;
}

