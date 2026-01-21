import React from 'react';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  UploadOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Phase, JobDetails as JobDetailsType } from './JobDetails.interface';

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

/**
 * Get status icon for phase/job
 */
export const getStatusIcon = (status: string, className?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    completed: <CheckCircleOutlined className={className} />,
    running: <SyncOutlined spin className={className} />,
    failed: <CloseCircleOutlined className={className} />,
    pending: <ClockCircleOutlined className={className} />,
  };
  return iconMap[status] || <ClockCircleOutlined className={className} />;
};

/**
 * Get phase icon
 */
export const getPhaseIcon = (phaseName: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'Code Pull': <BranchesOutlined />,
    'SQL Generation': <FileTextOutlined />,
    'Test Generation': <ThunderboltOutlined />,
    'Data Generation': <DatabaseOutlined />,
    'Data Load': <UploadOutlined />,
    'Tests Execution': <ExperimentOutlined />,
    'Code Push': <BranchesOutlined />,
  };
  return iconMap[phaseName] || <FileTextOutlined />;
};

/**
 * Calculate job progress percentage
 */
export const getJobProgress = (jobDetails: JobDetailsType | null): number => {
  if (!jobDetails) return 0;
  const completed = jobDetails.phases.filter(p => p.status === 'completed').length;
  return Math.round((completed / jobDetails.phases.length) * 100);
};

/**
 * Build tree data for Ant Design Tree component (Database -> Schema -> Tables)
 */
export const buildTreeData = (tables: any[]) => {
  const tableList = tables.map(table => ({
    name: table.tableName.split('.').pop() || table.tableName,
    fullName: table.tableName,
  }));

  return [{
    title: 'defaultdatabase',
    key: 'db-defaultdatabase',
    icon: <DatabaseOutlined />,
    selectable: false,
    children: [{
      title: 'defaultschema',
      key: 'db-defaultdatabase-schema-defaultschema',
      icon: <FileTextOutlined />,
      selectable: false,
      children: tableList.map(({ name, fullName }) => ({
        title: name,
        key: fullName,
        icon: <ExperimentOutlined />,
        isLeaf: true,
      })),
    }],
  }];
};

/**
 * Get initial phase index based on job status and phases
 */
export const getInitialPhaseIndex = (jobDetails: JobDetailsType | null): number => {
  if (!jobDetails) return 0;
  
  const phases = jobDetails.phases;
  const jobStatus = jobDetails.status;

  // Priority 1: Select the first running phase (but not Code Push)
  const runningIndex = phases.findIndex(p => p.status === 'running' && p.name !== 'Code Push');
  if (runningIndex !== -1) return runningIndex;

  // Priority 2: Select the first failed phase (but not Code Push)
  const failedIndex = phases.findIndex(p => p.status === 'failed' && p.name !== 'Code Push');
  if (failedIndex !== -1) return failedIndex;

  // Priority 3: If job is completed, select Tests Execution phase
  if (jobStatus === 'completed') {
    const testExecutionIndex = phases.findIndex(p => p.name === 'Tests Execution');
    if (testExecutionIndex !== -1 && phases[testExecutionIndex].status === 'completed') {
      return testExecutionIndex;
    }
  }

  // Priority 4: Select the last completed phase with actionButton (for review)
  for (let i = phases.length - 1; i >= 0; i--) {
    if (phases[i].name !== 'Code Push' && phases[i].actionButton && phases[i].status === 'completed') {
      return i;
    }
  }

  // Priority 5: Select the last non-Code Push phase
  for (let i = phases.length - 1; i >= 0; i--) {
    if (phases[i].name !== 'Code Push') {
      return i;
    }
  }

  return 0;
};

/**
 * Get template type display name
 */
export const getTemplateTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'not_null': 'Not Null Test',
    'unique': 'Unique Test',
    'relationships': 'Relationships Test',
    'accepted_values': 'Accepted Values Test',
  };
  return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get icon component for test type
 */
export const getTestIcon = (testType: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    not_null: <SafetyOutlined />,
    unique: <DatabaseOutlined />,
    relationships: <FileTextOutlined />,
    accepted_values: <CheckCircleOutlined />,
    custom: <ThunderboltOutlined />,
  };
  return iconMap[testType] || <ThunderboltOutlined />;
};

/**
 * Get category for test type
 */
export const getTestCategory = (testType: string): string => {
  const categoryMap: Record<string, string> = {
    not_null: 'validation',
    unique: 'validation',
    relationships: 'integrity',
    accepted_values: 'validation',
    custom: 'custom',
  };
  return categoryMap[testType] || 'validation';
};

/**
 * Get category color
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    validation: 'blue',
    quality: 'green',
    integrity: 'orange',
    custom: 'purple',
  };
  return colorMap[category] || 'default';
};
