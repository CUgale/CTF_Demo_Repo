import React, { useMemo } from 'react';
import { Phase } from '../JobDetails.interface';
import { TestReviewData, TestDetail } from '../../testReview/TestReview.interface';
import { GeneratedTest } from '../../../components/ChatInterface/ChatInterface.interface';
import { ChatContext } from '../../../components/ChatInterface/ChatInterface.interface';
import TestTemplatesView from './TestTemplatesView';
import TestReviewPanel from './TestReviewPanel';
import TestDetailsPanel from './TestDetailsPanel';
import TestGenerateView from './TestGenerateView';
import { getTestCategory } from '../JobDetails.utils';
import testReviewStyles from '../../testReview/TestReview.module.scss';
import styles from '../JobDetails.module.scss';

interface TestGenerationPhaseContentProps {
  phase: Phase;
  testReviewData: TestReviewData | null;
  activeTestTab: 'templates' | 'review' | 'generate';
  onTestTabChange: (tab: 'templates' | 'review' | 'generate') => void;
  selectedTemplateFilter: string | null;
  onTemplateFilterChange: (filter: string | null) => void;
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
  onApproveAll: () => void;
  onContinueToDataGeneration: () => void;
  generateInputValue: string;
  onGenerateInputChange: (value: string) => void;
  onGenerate: (prompt: string) => void;
  chatMessages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    generatedTests?: GeneratedTest[];
  }>;
  onAcceptAllTests: (tests: GeneratedTest[], messageId: string) => void;
  onRejectTests: (tests: GeneratedTest[], messageId: string) => void;
  chatContext?: ChatContext;
}

/**
 * Test Generation Phase Content Component
 * Handles the Test Generation phase with templates, review, and generate tabs
 */
const TestGenerationPhaseContent: React.FC<TestGenerationPhaseContentProps> = ({
  phase,
  testReviewData,
  activeTestTab,
  onTestTabChange,
  selectedTemplateFilter,
  onTemplateFilterChange,
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
  onApproveAll,
  onContinueToDataGeneration,
  generateInputValue,
  onGenerateInputChange,
  onGenerate,
  chatMessages,
  onAcceptAllTests,
  onRejectTests,
  chatContext,
}) => {
  // Filter tests based on filters, testing mode, and template type
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

      const matchesTemplate = !selectedTemplateFilter || test.type === selectedTemplateFilter;

      return matchesStatus && matchesSearch && matchesMode && matchesTemplate;
    });
  }, [testReviewData, statusFilter, searchQuery, testingMode, selectedTemplateFilter]);

  const selectableApprovedVisibleIds = useMemo(() => {
    return filteredTests.filter((t) => t.status === 'approved').map((t) => t.id);
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
    onTemplateFilterChange(null);
  };

  if (!testReviewData) {
    return (
      <div className={styles.phaseContent}>
        <div className={styles.testTemplatesView} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <p>Loading test data...</p>
          </div>
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
        {activeTestTab === 'templates' && (
          <TestTemplatesView
            testReviewData={testReviewData}
            onTemplateSelect={onTemplateFilterChange}
            onViewTests={(templateType) => {
              onTemplateFilterChange(templateType);
              onTestTabChange('review');
            }}
          />
        )}

        {activeTestTab === 'review' && (
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
                onApproveAll={onApproveAll}
                onSelectAllApproved={handleSelectAllApproved}
                onClearSelection={handleClearSelection}
                selectableApprovedVisibleIds={selectableApprovedVisibleIds}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                isSearchExpanded={isSearchExpanded}
                onSearchExpand={onSearchExpand}
                statusFilter={statusFilter}
                onStatusFilterChange={onStatusFilterChange}
                selectedTemplateFilter={selectedTemplateFilter}
                onTemplateFilterClear={() => onTemplateFilterChange(null)}
                onClearAllFilters={handleClearAllFilters}
                onContinueToDataGeneration={onContinueToDataGeneration}
              />

              <TestDetailsPanel
                viewingTest={viewingTest}
                onApprove={onApprove}
                onReject={onReject}
              />
            </div>
          </div>
        )}

        {activeTestTab === 'generate' && (
          <TestGenerateView
            generateInputValue={generateInputValue}
            onGenerateInputChange={onGenerateInputChange}
            onGenerate={onGenerate}
            chatMessages={chatMessages}
            onAcceptAllTests={onAcceptAllTests}
            onRejectTests={onRejectTests}
            onNavigateToReview={() => onTestTabChange('review')}
            chatContext={chatContext}
            testReviewDataTotalTests={testReviewData.totalTests}
          />
        )}
      </div>
    </div>
  );
};

export default TestGenerationPhaseContent;
