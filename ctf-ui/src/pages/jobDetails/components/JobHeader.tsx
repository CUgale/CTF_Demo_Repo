import React from 'react';
import { Button } from 'antd';
import {
  ArrowLeftOutlined,
  CodeOutlined,
  BranchesOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { JobDetails as JobDetailsType, Phase } from '../JobDetails.interface';
import { formatDate, formatDuration, getStatusIcon, getPhaseIcon, getJobProgress } from '../JobDetails.utils';
import styles from '../JobDetails.module.scss';

interface JobHeaderProps {
  jobDetails: JobDetailsType;
  selectedPhaseIndex: number;
  onPhaseSelect: (index: number) => void;
  onBack: () => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({
  jobDetails,
  selectedPhaseIndex,
  onPhaseSelect,
  onBack,
}) => {
  const completedPhases = jobDetails.phases.filter(p => p.status === 'completed').length;
  const totalPhases = jobDetails.phases.length;
  const progress = getJobProgress(jobDetails);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusBadgeCompleted;
      case 'running':
        return styles.statusBadgeRunning;
      case 'failed':
        return styles.statusBadgeFailed;
      default:
        return styles.statusBadgePending;
    }
  };

  return (
    <div className={styles.jobHeader}>
      {/* Title Row */}
      <div className={styles.jobHeaderTop}>
        <div className={styles.jobHeaderLeft}>
          <h1 className={styles.jobTitle}>{jobDetails.jobName}</h1>
          <span className={getStatusBadgeClass(jobDetails.status)}>
            {jobDetails.status.toUpperCase()}
          </span>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} className={styles.backButton}>
          Back to Jobs
        </Button>
      </div>

      {/* Commit Row */}
      {jobDetails.commitSha && (
        <div className={styles.jobHeaderCommit}>
          <code className={styles.commitHash}>{jobDetails.commitSha}</code>
          {jobDetails.commitMessage && (
            <span className={styles.commitMessage}>{jobDetails.commitMessage}</span>
          )}
        </div>
      )}

      {/* Meta Row with Progress */}
      <div className={styles.jobHeaderMeta}>
        <div className={styles.metaLeft}>
          <span className={styles.jobMetaItem}>
            <CodeOutlined />
            <span className={styles.jobId}>{jobDetails.id}</span>
          </span>
          {jobDetails.branch && (
            <span className={styles.jobMetaItem}>
              <BranchesOutlined />
              {jobDetails.branch}
            </span>
          )}
          <span className={styles.jobMetaItem}>
            <CalendarOutlined />
            {formatDate(jobDetails.createdAt)}
          </span>
          <span className={styles.jobMetaItem}>
            <ClockCircleOutlined />
            {formatDuration(jobDetails.duration)}
          </span>
        </div>
        <div className={styles.progressSection}>
          <span className={styles.progressText}>
            {completedPhases}/{totalPhases} phases
          </span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressPercent}>{progress}%</span>
        </div>
      </div>

      {/* Execution Phases */}
      <div className={styles.executionPhases}>
        <div className={styles.executionPhasesTitle}>EXECUTION PHASES</div>
        <div className={styles.pipelineSteps}>
          {jobDetails.phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              {phase.name === 'Code Push' ? (
                <div
                  className={`${styles.phaseButton} ${styles.phaseButtonDisabled}`}
                  style={{ cursor: 'not-allowed', opacity: 0.6 }}
                >
                  <div className={styles.phaseIcon}>{getStatusIcon(phase.status)}</div>
                  <div className={styles.phaseName}>{phase.name}</div>
                  <div className={styles.phaseDuration}>{formatDuration(phase.duration)}</div>
                </div>
              ) : (
                <button
                  onClick={() => onPhaseSelect(index)}
                  className={`${styles.phaseButton} ${
                    selectedPhaseIndex === index ? styles.phaseButtonActive : ''
                  }`}
                >
                  <div className={styles.phaseIcon}>{getStatusIcon(phase.status)}</div>
                  <div className={styles.phaseName}>{phase.name}</div>
                  <div className={styles.phaseDuration}>{formatDuration(phase.duration)}</div>
                </button>
              )}
              {index < jobDetails.phases.length - 1 && (
                <div className={styles.pipelineConnector} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
