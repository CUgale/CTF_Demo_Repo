/**
 * Commit interface matching API contract
 */
export interface Commit {
  id: string;
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  timestamp: string;
  branch: string;
}

/**
 * Create Job Request matching API contract
 */
export interface CreateJobRequest {
  commit_id: string;
}

/**
 * Create Job Response matching API contract
 */
export interface CreateJobResponse {
  job_id: string;
  job_name: string;
  status: string;
  project_id: string;
  commit_sha: string;
  created_at: string;
  created_by: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Form values for CreateJob form
 */
export interface CreateJobFormValues {
  jobName?: string;
  commitSha?: string;
  customCommitId?: string;
}

/**
 * Commits state interfaces
 */
export interface CommitsInitialState {
  data: Commit[] | null;
  loading: boolean;
  error: string | null;
}

export interface CreateJobInitialState {
  data: CreateJobResponse | null;
  loading: boolean;
  error: string | null;
}

export interface CreateJobState {
  commits: CommitsInitialState;
  createJob: CreateJobInitialState;
}
