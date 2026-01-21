export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type SourceType = 'dbt' | 'custom';

export interface Job {
  id: string;
  jobName: string;
  sourceType: SourceType;
  status: JobStatus;
  phaseStatus?: {
    phase: string;
    status: JobStatus;
  }[];
  createdAt: string;
  updatedAt?: string;
  duration?: number; // Duration in seconds
  projectId: string;
  commitId?: string;
  commitSha?: string;
  branch?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

