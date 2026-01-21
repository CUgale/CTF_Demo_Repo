import { JobStatus } from '../jobsList/JobsList.interface';

/**
 * Code Sync Phase Metadata
 */
export interface CodeSyncMetadata {
  filesCount: number;
  foldersCount: number;
  totalSize: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  pulledAt: string;
}

/**
 * dbt to SQL Phase Metadata
 */
export interface DbtToSqlMetadata {
  modelsCount: number;
  sqlFilesCount: number;
  testsCount: number;
  compiledAt: string;
  compilationTime: number;
}

/**
 * Test Generation Phase Metadata
 */
export interface TestGenerationMetadata {
  testsGenerated: number;
  generatedAt: string;
  generationTime: number;
  aiModel?: string;
}

/**
 * Data Preview Row - represents a single row in data preview
 */
export interface DataPreviewRow {
  [key: string]: string | number | boolean | null;
}

/**
 * Data Preview Table - represents a table in data preview
 */
export interface DataPreviewTable {
  tableName: string;
  database?: string;
  schema?: string;
  columns: string[];
  rows: DataPreviewRow[];
  totalRows: number;
}

/**
 * SQL to Data Phase Metadata
 */
export interface SqlToDataMetadata {
  analyzedSqlCount: number;
  recordsGenerated: number;
  recordsPerTable: number;
  dataSize: string;
  timeTaken: number;
  kingfisherVersion?: string;
  tablesCount?: number;
  analyzedTablesCount?: number;
  constraintsCount?: number;
  associationsCount?: number;
  literalsSummary?: string;
  dataPreview?: DataPreviewTable[];
}

/**
 * Load Data Phase Metadata
 */
export interface LoadDataMetadata {
  targetLocation: string;
  filesWritten: number;
  totalSize: string;
  loadTime: number;
  loadedAt: string;
}

/**
 * Test Execution Phase Metadata
 */
export interface TestExecutionMetadata {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTime: number;
  executedAt: string;
}

/**
 * Phase Metadata - union of all phase-specific metadata types
 */
export interface PhaseMetadata {
  codeSync?: CodeSyncMetadata;
  dbtToSql?: DbtToSqlMetadata;
  testGeneration?: TestGenerationMetadata;
  sqlToData?: SqlToDataMetadata;
  loadData?: LoadDataMetadata;
  testExecution?: TestExecutionMetadata;
}

/**
 * Execution Phase
 */
export interface Phase {
  id: string;
  name: string;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  logs?: string[];
  error?: string;
  progress?: number;
  metadata?: PhaseMetadata;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Job Details - complete job information with all phases
 */
export interface JobDetails {
  id: string;
  jobName: string;
  sourceType: string;
  status: JobStatus;
  phases: Phase[];
  createdAt: string;
  updatedAt?: string;
  duration?: number; // Total duration in seconds
  projectId: string;
  commitId?: string;
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
}

