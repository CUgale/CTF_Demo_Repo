import React from 'react';
import { Phase } from '../JobDetails.interface';
import styles from '../JobDetails.module.scss';

interface CodeSyncPhaseContentProps {
  phase: Phase;
}

/**
 * Code Sync Phase Content Component
 * Displays content for Code Pull phase
 */
const CodeSyncPhaseContent: React.FC<CodeSyncPhaseContentProps> = ({ phase }) => {
  // Code Sync phase primarily shows metadata, which is handled by PhaseMetadata component
  // This component can be extended if phase-specific UI is needed beyond metadata
  return (
    <div className={styles.phaseContent}>
      {phase.error && (
        <div className={styles.errorSection}>
          <span className={styles.errorMessage}>{phase.error}</span>
        </div>
      )}
      {/* Additional phase-specific content can be added here if needed */}
    </div>
  );
};

export default CodeSyncPhaseContent;
