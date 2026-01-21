import { Job } from './JobsList.interface';

export const mockJobs: Job[] = [
  // Job 1: Paused at Test Generation phase - waiting for user to review and approve tests
  {
    id: 'job-001',
    jobName: 'Customer Analytics - ETL Pipeline',
    sourceType: 'dbt',
    status: 'running',
    phaseStatus: [
      { phase: 'Code Sync', status: 'completed' },
      { phase: 'dbt to SQL', status: 'completed' },
      { phase: 'SQL to Tests Generation (AI)', status: 'completed' },
      { phase: 'SQL to Data', status: 'pending' },
      { phase: 'Load Data', status: 'pending' },
      { phase: 'Test Execution', status: 'pending' },
    ],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:07:15Z',
    duration: 435, // 7m 15s - paused at Test Generation for user review
    projectId: 'project-1',
    commitId: 'commit-1',
    commitSha: 'a1b2c3d4e5f6789',
    branch: 'main',
    createdBy: {
      id: 'user-1',
      name: 'admin',
      email: 'admin@example.com',
    },
  },
  // Job 2: Completed - went through full flow (tests approved, data generated, tests executed)
  {
    id: 'job-002',
    jobName: 'Order Analytics - Full Pipeline',
    sourceType: 'dbt',
    status: 'completed',
    phaseStatus: [
      { phase: 'Code Sync', status: 'completed' },
      { phase: 'dbt to SQL', status: 'completed' },
      { phase: 'SQL to Tests Generation (AI)', status: 'completed' },
      { phase: 'SQL to Data', status: 'completed' },
      { phase: 'Load Data', status: 'completed' },
      { phase: 'Test Execution', status: 'completed' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:48:30Z',
    duration: 810, // 13m 30s - full pipeline completed
    projectId: 'project-1',
    commitId: 'commit-2',
    commitSha: 'b2c3d4e5f6a7890',
    branch: 'main',
    createdBy: {
      id: 'user-2',
      name: 'admin',
      email: 'admin@example.com',
    },
  },
  // Job 3: Running - tests approved, currently in Data Generation phase
  {
    id: 'job-003',
    jobName: 'Product Catalog - Data Generation',
    sourceType: 'dbt',
    status: 'running',
    phaseStatus: [
      { phase: 'Code Sync', status: 'completed' },
      { phase: 'dbt to SQL', status: 'completed' },
      { phase: 'SQL to Tests Generation (AI)', status: 'completed' },
      { phase: 'SQL to Data', status: 'running' },
      { phase: 'Load Data', status: 'pending' },
      { phase: 'Test Execution', status: 'pending' },
    ],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:10:20Z',
    duration: 620, // 10m 20s - tests approved, now generating data
    projectId: 'project-2',
    commitId: 'commit-3',
    commitSha: 'c3d4e5f6a7b8901',
    branch: 'main',
    createdBy: {
      id: 'user-3',
      name: 'admin',
      email: 'admin@example.com',
    },
  },
];

