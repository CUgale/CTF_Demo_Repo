import React from 'react';
import { Phase } from '../JobDetails.interface';
import styles from '../JobDetails.module.scss';

interface ExecutionLogsProps {
  phase: Phase;
}

const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ phase }) => {
  if (!phase.logs || phase.logs.length === 0) {
    return null;
  }

  const getLogTextClass = (log: string): string => {
    const lowerLog = log.toLowerCase();
    if (lowerLog.includes('completed') || lowerLog.includes('successfully') || lowerLog.includes('passed')) {
      return styles.logTextSuccess;
    }
    if (lowerLog.includes('error') || lowerLog.includes('failed')) {
      return styles.logTextError;
    }
    if (lowerLog.includes('remaining') || lowerLog.includes('retrying')) {
      return styles.logTextWarning;
    }
    return '';
  };

  return (
    <>
      <div className={styles.logsHeader}>
        <span className={styles.logsTitle}>EXECUTION LOGS</span>
        <span className={styles.logsCount}>{phase.logs.length} entries</span>
      </div>

      <div className={styles.logsContainer}>
        <div className={styles.logsContent}>
          {phase.logs.map((log, index) => (
            <div key={index} className={styles.logLine}>
              <span className={styles.logLineNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`${styles.logText} ${getLogTextClass(log)}`}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExecutionLogs;
