import React from 'react';
import {
  FileTextOutlined,
  FolderOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Phase } from '../JobDetails.interface';
import { TestReviewData } from '../../testReview/TestReview.interface';
import { formatDate, formatDuration } from '../JobDetails.utils';
import styles from '../JobDetails.module.scss';

interface PhaseMetadataProps {
  phase: Phase;
  testReviewData?: TestReviewData | null;
  activeTestTab?: 'templates' | 'review' | 'generate';
  onTestTabChange?: (tab: 'templates' | 'review' | 'generate') => void;
  onTemplateFilterChange?: (filter: string | null) => void;
}

const PhaseMetadata: React.FC<PhaseMetadataProps> = ({
  phase,
  testReviewData,
  activeTestTab,
  onTestTabChange,
  onTemplateFilterChange,
}) => {
  return (
    <div className={styles.phaseMetadata}>
      <div className={styles.metadataGrid}>
        {/* Common metadata */}
        {phase.startedAt && (
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Started: </span>
            <span className={styles.metadataValue}>{formatDate(phase.startedAt)}</span>
          </div>
        )}
        {phase.completedAt && (
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Completed: </span>
            <span className={styles.metadataValue}>{formatDate(phase.completedAt)}</span>
          </div>
        )}

        {/* Code Sync Metadata */}
        {phase.metadata?.codeSync && (
          <>
            <div className={styles.metadataItem}>
              <FileTextOutlined className={styles.metadataIcon} />
              <span className={styles.metadataValue}>{phase.metadata.codeSync.filesCount}</span>
              <span className={styles.metadataLabel}>files</span>
            </div>
            <div className={styles.metadataItem}>
              <FolderOutlined className={styles.metadataIcon} />
              <span className={styles.metadataValue}>{phase.metadata.codeSync.foldersCount}</span>
              <span className={styles.metadataLabel}>folders</span>
            </div>
            <div className={styles.metadataItem}>
              <DatabaseOutlined className={styles.metadataIcon} />
              <span className={styles.metadataValue}>{phase.metadata.codeSync.totalSize}</span>
            </div>
            <div className={styles.metadataItem}>
              <BranchesOutlined className={styles.metadataIcon} />
              <span className={styles.metadataValue}>{phase.metadata.codeSync.branch}</span>
            </div>
          </>
        )}

        {/* dbt to SQL Metadata */}
        {phase.metadata?.dbtToSql && (
          <>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Models: </span>
              <span className={styles.metadataValue}>{phase.metadata.dbtToSql.modelsCount}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>SQL Files: </span>
              <span className={styles.metadataValue}>{phase.metadata.dbtToSql.sqlFilesCount}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Tests: </span>
              <span className={styles.metadataValue}>{phase.metadata.dbtToSql.testsCount}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Compilation Time: </span>
              <span className={styles.metadataValue}>
                {formatDuration(phase.metadata.dbtToSql.compilationTime)}
              </span>
            </div>
          </>
        )}

        {/* Test Generation Metadata */}
        {phase.metadata?.testGeneration && (
          <>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Tests Generated: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.testGeneration.testsGenerated}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Generation Time: </span>
              <span className={styles.metadataValue}>
                {formatDuration(phase.metadata.testGeneration.generationTime)}
              </span>
            </div>
            {phase.metadata.testGeneration.aiModel && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Model: </span>
                <span className={styles.metadataValue}>
                  {phase.metadata.testGeneration.aiModel}
                </span>
              </div>
            )}
          </>
        )}

        {/* SQL to Data Metadata */}
        {phase.metadata?.sqlToData && (
          <>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>SQL Files Analyzed: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.sqlToData.analyzedSqlCount}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>No. of Analyzed Tables: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.sqlToData.analyzedTablesCount ||
                  phase.metadata.sqlToData.tablesCount ||
                  0}
              </span>
            </div>
            {phase.metadata.sqlToData.constraintsCount !== undefined && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>No. of Constraints: </span>
                <span className={styles.metadataValue}>
                  {phase.metadata.sqlToData.constraintsCount}
                </span>
              </div>
            )}
            {phase.metadata.sqlToData.associationsCount !== undefined && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Associations: </span>
                <span className={styles.metadataValue}>
                  {phase.metadata.sqlToData.associationsCount}
                </span>
              </div>
            )}
            {phase.metadata.sqlToData.literalsSummary && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Literals Summary: </span>
                <span className={styles.metadataValue}>
                  {phase.metadata.sqlToData.literalsSummary}
                </span>
              </div>
            )}
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Records Generated: </span>
              <span className={styles.metadataValueSuccess}>
                {phase.metadata.sqlToData.recordsGenerated}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Records Per Table: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.sqlToData.recordsPerTable}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Data Size: </span>
              <span className={styles.metadataValue}>{phase.metadata.sqlToData.dataSize}</span>
            </div>
          </>
        )}

        {/* Load Data Metadata */}
        {phase.metadata?.loadData && (
          <>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Files Written: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.loadData.filesWritten}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Total Size: </span>
              <span className={styles.metadataValue}>{phase.metadata.loadData.totalSize}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Target: </span>
              <span
                className={styles.metadataValue}
                title={phase.metadata.loadData.targetLocation}
              >
                {phase.metadata.loadData.targetLocation.split('/').slice(-2).join('/')}
              </span>
            </div>
          </>
        )}

        {/* Test Execution Metadata */}
        {phase.metadata?.testExecution && (
          <>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Total Tests: </span>
              <span className={styles.metadataValue}>
                {phase.metadata.testExecution.totalTests}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Passed: </span>
              <span className={styles.metadataValueSuccess}>
                {phase.metadata.testExecution.passedTests}
              </span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Failed: </span>
              <span
                className={
                  phase.metadata.testExecution.failedTests > 0
                    ? styles.metadataValueError
                    : styles.metadataValue
                }
              >
                {phase.metadata.testExecution.failedTests}
              </span>
            </div>
            {testReviewData && (
              <>
                <div className={styles.metadataItem}>
                  <span className={styles.metadataLabel}>Happy Path: </span>
                  <span className={`${styles.metadataValue} ${styles.happyPath}`}>
                    {testReviewData.tests.filter((t) => t.testCategory === 'happy_path').length}
                  </span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.metadataLabel}>Negative: </span>
                  <span className={`${styles.metadataValue} ${styles.negative}`}>
                    {testReviewData.tests.filter((t) => t.testCategory === 'negative').length}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {/* Tabs in Metadata Grid - For Test Generation phase only */}
        {phase.name === 'Test Generation' && onTestTabChange && (
          <div className={styles.metadataTabsWrapper}>
            <div className={styles.tabSwitchContainer}>
              <div
                className={`${styles.tabSwitchItem} ${
                  activeTestTab === 'templates'
                    ? styles.tabSwitchActive
                    : styles.tabSwitchInactive
                }`}
                onClick={() => {
                  onTestTabChange('templates');
                  onTemplateFilterChange?.(null);
                }}
              >
                <AppstoreOutlined className={styles.tabSwitchIcon} />
                <span className={styles.tabSwitchLabel}>Test Categories</span>
              </div>
              <div
                className={`${styles.tabSwitchItem} ${
                  activeTestTab === 'review'
                    ? styles.tabSwitchActive
                    : styles.tabSwitchInactive
                }`}
                onClick={() => onTestTabChange('review')}
              >
                <FileTextOutlined className={styles.tabSwitchIcon} />
                <span className={styles.tabSwitchLabel}>Review Tests</span>
                {testReviewData && testReviewData.pendingTests > 0 && (
                  <span className={styles.tabBadge}>{testReviewData.pendingTests}</span>
                )}
              </div>
              <div
                className={`${styles.tabSwitchItem} ${
                  activeTestTab === 'generate'
                    ? styles.tabSwitchActive
                    : styles.tabSwitchInactive
                }`}
                onClick={() => onTestTabChange('generate')}
              >
                <DatabaseOutlined className={styles.tabSwitchIcon} />
                <span className={styles.tabSwitchLabel}>Generate Tests</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseMetadata;
