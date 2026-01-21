import React from 'react';
import { Button, Tooltip } from 'antd';
import { Phase } from '../JobDetails.interface';
import { formatDuration, getStatusIcon } from '../JobDetails.utils';
import styles from '../JobDetails.module.scss';

interface PhaseDetailsHeaderProps {
  phase: Phase;
  onAction?: () => void;
  actionButtonLabel?: string;
  actionButtonDisabled?: boolean;
  actionButtonLoading?: boolean;
  showKingfisherLink?: boolean;
  kingfisherVersion?: string;
}

const PhaseDetailsHeader: React.FC<PhaseDetailsHeaderProps> = ({
  phase,
  onAction,
  actionButtonLabel,
  actionButtonDisabled,
  actionButtonLoading,
  showKingfisherLink,
  kingfisherVersion,
}) => {
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
    <div className={styles.phaseDetailsHeader}>
      <div className={styles.phaseDetailsHeaderLeft}>
        {getStatusIcon(phase.status)}
        <h3 className={styles.phaseDetailsTitle}>{phase.name}</h3>
        <span className={getStatusBadgeClass(phase.status)}>
          {phase.status.toUpperCase()}
        </span>
      </div>
      <div className={styles.phaseDetailsHeaderRight}>
        {showKingfisherLink && kingfisherVersion && (
          <Tooltip title="Take me to Kingfisher">
            <a
              href="http://172.16.0.13:8080/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.kingfisherTag}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.kingfisherTagText}>Kingfisher {kingfisherVersion}</span>
            </a>
          </Tooltip>
        )}
        <div className={styles.durationInfo}>
          Duration: <span className={styles.durationValue}>{formatDuration(phase.duration)}</span>
        </div>
        {onAction && actionButtonLabel && (
          <Button
            type="primary"
            onClick={onAction}
            disabled={actionButtonDisabled}
            loading={actionButtonLoading}
          >
            {actionButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhaseDetailsHeader;
