import React, { useMemo } from 'react';
import { Phase } from '../JobDetails.interface';
import { TestReviewData, TestDetail } from '../../testReview/TestReview.interface';
import TestReviewPanel from './TestReviewPanel';
import TestDetailsPanel from './TestDetailsPanel';
import testReviewStyles from '../../testReview/TestReview.module.scss';
import styles from '../JobDetails.module.scss';

interface TestExecutionPhaseContentProps {
  phase: Phase;
  testReviewData: TestReviewData | null;
  viewingTest: TestDetail | null;
  onTestSelect: (test: TestDetail) => void;
  selectedTests: string[];
  onTestSelectionChange: (testIds: string[]) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchExpanded: boolean;
  onSearchExpand: (expanded: boolean) => void;
  testingMode: 'all' | 'happy_path' | 'negative';
  onTestingModeChange: (mode: 'all' | 'happy_path' | 'negative') => void;
  onApprove: (testId: string) => void;
  onReject: (testId: string) => void;
  onPushToGit: () => void;
  isExecutingTests: boolean;
  executionProgress: number;
  onExecuteTests: () => void;
}

/**
 * Test Execution Phase Content Component
 * Handles the Tests Execution phase with test review and execution functionality
 */
const TestExecutionPhaseContent: React.FC<TestExecutionPhaseContentProps> = ({
  phase,
  testReviewData,
  viewingTest,
  onTestSelect,
  selectedTests,
  onTestSelectionChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  isSearchExpanded,
  onSearchExpand,
  testingMode,
  onTestingModeChange,
  onApprove,
  onReject,
  onPushToGit,
  isExecutingTests,
  executionProgress,
  onExecuteTests,
}) => {
  // Filter tests based on filters and testing mode
  const filteredTests = useMemo(() => {
    if (!testReviewData) return [];
    return testReviewData.tests.filter((test) => {
      const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
      const matchesSearch =
        searchQuery === '' ||
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.column && test.column.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMode =
        testingMode === 'all' ||
        (testingMode === 'happy_path' && test.testCategory === 'happy_path') ||
        (testingMode === 'negative' && test.testCategory === 'negative');

      return matchesStatus && matchesSearch && matchesMode;
    });
  }, [testReviewData, statusFilter, searchQuery, testingMode]);

  const selectableApprovedVisibleIds = useMemo(() => {
    return filteredTests
      .filter((t) => t.status === 'approved' && !t.isPushed)
      .map((t) => t.id);
  }, [filteredTests]);

  const handleTestToggle = (testId: string, checked: boolean) => {
    if (checked) {
      onTestSelectionChange([...selectedTests, testId]);
    } else {
      onTestSelectionChange(selectedTests.filter((id) => id !== testId));
    }
  };

  const handleSelectAllApproved = () => {
    onTestSelectionChange(selectableApprovedVisibleIds);
  };

  const handleClearSelection = () => {
    onTestSelectionChange([]);
  };

  const handleClearAllFilters = () => {
    onStatusFilterChange('all');
    onSearchChange('');
  };

  if (!testReviewData) {
    return (
      <div className={styles.phaseContent}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Loading test data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phaseContent}>
      {phase.error && (
        <div className={styles.errorSection}>
          <span className={styles.errorMessage}>{phase.error}</span>
        </div>
      )}

      <div className={styles.testExecutionTabContent}>
        <div className={`${testReviewStyles.editorView} ${styles.inlineTestReviewWrapper}`}>
          <div className={testReviewStyles.editorContainer}>
            <TestReviewPanel
              phase={phase}
              testReviewData={testReviewData}
              filteredTests={filteredTests}
              viewingTest={viewingTest}
              onTestSelect={onTestSelect}
              selectedTests={selectedTests}
              onTestToggle={handleTestToggle}
              onApprove={onApprove}
              onReject={onReject}
              onApproveAll={() => {}}
              onSelectAllApproved={handleSelectAllApproved}
              onClearSelection={handleClearSelection}
              selectableApprovedVisibleIds={selectableApprovedVisibleIds}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              isSearchExpanded={isSearchExpanded}
              onSearchExpand={onSearchExpand}
              statusFilter={statusFilter}
              onStatusFilterChange={onStatusFilterChange}
              selectedTemplateFilter={null}
              onTemplateFilterClear={() => {}}
              onClearAllFilters={handleClearAllFilters}
              onPushToGit={onPushToGit}
            />

            <TestDetailsPanel
              viewingTest={viewingTest}
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestExecutionPhaseContent;
