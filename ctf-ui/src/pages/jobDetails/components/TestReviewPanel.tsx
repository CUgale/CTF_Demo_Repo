import React from 'react';
import { Button, Card, Checkbox, Popconfirm, Tooltip, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  CheckOutlined,
  SearchOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { TestDetail, TestReviewData } from '../../testReview/TestReview.interface';
import { Phase } from '../JobDetails.interface';
import { getTestIcon, getTestCategory, getCategoryColor } from '../JobDetails.utils';
import TestFilters from './TestFilters';
import testReviewStyles from '../../testReview/TestReview.module.scss';

interface TestReviewPanelProps {
  phase: Phase;
  testReviewData: TestReviewData;
  filteredTests: TestDetail[];
  viewingTest: TestDetail | null;
  onTestSelect: (test: TestDetail) => void;
  selectedTests: string[];
  onTestToggle: (testId: string, checked: boolean) => void;
  onApprove: (testId: string) => void;
  onReject: (testId: string) => void;
  onApproveAll: () => void;
  onSelectAllApproved: () => void;
  onClearSelection: () => void;
  selectableApprovedVisibleIds: string[];
  // Filters
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchExpanded: boolean;
  onSearchExpand: (expanded: boolean) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  selectedTemplateFilter: string | null;
  onTemplateFilterClear: () => void;
  onClearAllFilters: () => void;
  // Actions
  onContinueToDataGeneration?: () => void;
  onPushToGit?: () => void;
}

/**
 * Test Review Panel Component
 * Main panel for displaying and managing test list
 */
const TestReviewPanel: React.FC<TestReviewPanelProps> = ({
  phase,
  testReviewData,
  filteredTests,
  viewingTest,
  onTestSelect,
  selectedTests,
  onTestToggle,
  onApprove,
  onReject,
  onApproveAll,
  onSelectAllApproved,
  onClearSelection,
  selectableApprovedVisibleIds,
  searchQuery,
  onSearchChange,
  isSearchExpanded,
  onSearchExpand,
  statusFilter,
  onStatusFilterChange,
  selectedTemplateFilter,
  onTemplateFilterClear,
  onClearAllFilters,
  onContinueToDataGeneration,
  onPushToGit,
}) => {
  const isTestExecutionPhase = phase.name === 'Tests Execution';
  const isTestGenerationPhase = phase.name === 'Test Generation';

  return (
    <div className={testReviewStyles.testListPanel}>
      <TestFilters
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isSearchExpanded={isSearchExpanded}
        onSearchExpand={onSearchExpand}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        selectedTemplateFilter={selectedTemplateFilter}
        onTemplateFilterClear={onTemplateFilterClear}
        filteredTestsCount={filteredTests.length}
      />

      {/* Bulk Actions */}
      <div className={testReviewStyles.bulkActionsBar}>
        <div className={testReviewStyles.bulkActionsContent}>
          <div className={testReviewStyles.bulkActionsInfo}>
            {selectedTests.length > 0 ? (
              <span className={testReviewStyles.bulkCountActive}>
                {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span className={testReviewStyles.bulkHintText}>
                {isTestGenerationPhase
                  ? 'Review and approve tests to continue to Data Generation'
                  : 'Select approved tests to push to Git'}
              </span>
            )}
          </div>
          <div className={testReviewStyles.bulkActionsButtons}>
            {testReviewData.pendingTests > 0 && (
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={onApproveAll}
                className={testReviewStyles.detailsApproveBtn}
              >
                Approve All
              </Button>
            )}
            {testReviewData.approvedTests > 0 && (
              <button
                className={testReviewStyles.bulkSelectBtn}
                onClick={onSelectAllApproved}
                disabled={selectableApprovedVisibleIds.length === 0}
              >
                <CheckOutlined />
                Select all approved
              </button>
            )}
            {selectedTests.length > 0 && (
              <button className={testReviewStyles.bulkClearBtn} onClick={onClearSelection}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test List - Card Style */}
      <div className={testReviewStyles.testListContent}>
        {filteredTests.length > 0 ? (
          <>
            {testReviewData.pendingTests > 0 && (
              <div className={testReviewStyles.listHelperText}>
                <span>👉 Click a test to view details</span>
              </div>
            )}
            <div className={testReviewStyles.testCardsGrid}>
              {filteredTests.map((test) => {
                const testCategory = getTestCategory(test.type);
                const categoryColor = getCategoryColor(testCategory);
                return (
                  <Card
                    key={test.id}
                    className={`${testReviewStyles.testReviewCard} ${
                      viewingTest?.id === test.id ? testReviewStyles.testReviewCardActive : ''
                    }`}
                    hoverable
                    onClick={() => onTestSelect(test)}
                  >
                    <div className={testReviewStyles.testReviewCardHeader}>
                      {/* Checkbox for approved tests in Test Execution phase */}
                      {isTestExecutionPhase && !test.isPushed && test.status === 'approved' && (
                        <div className={testReviewStyles.testReviewCardCheckbox}>
                          <Checkbox
                            checked={selectedTests.includes(test.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              onTestToggle(test.id, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      <div className={testReviewStyles.testReviewCardIcon}>
                        {getTestIcon(test.type)}
                      </div>
                      <div className={testReviewStyles.testReviewCardTitleGroup}>
                        <div className={testReviewStyles.testReviewCardName}>{test.name}</div>
                        <Tag color={categoryColor} className={testReviewStyles.testReviewCardCategory}>
                          {testCategory}
                        </Tag>
                      </div>
                    </div>
                    <div className={testReviewStyles.testReviewCardActions}>
                      <div className={testReviewStyles.testReviewCardDescription}>
                        {test.description}
                      </div>
                      <div className={testReviewStyles.testReviewCardButtons}>
                        {!test.isPushed ? (
                          <>
                            {test.status !== 'approved' && (
                              <Tooltip title="Accept">
                                <button
                                  className={testReviewStyles.testReviewCardApproveIcon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onApprove(test.id);
                                  }}
                                  aria-label="Accept test"
                                >
                                  <CheckOutlined />
                                </button>
                              </Tooltip>
                            )}
                            {test.status !== 'rejected' && (
                              <Popconfirm
                                title="Reject this test?"
                                onConfirm={(e) => {
                                  e?.stopPropagation();
                                  onReject(test.id);
                                }}
                                okText="Reject"
                                okButtonProps={{ danger: true }}
                                onCancel={(e) => e?.stopPropagation()}
                              >
                                <Tooltip title="Reject">
                                  <button
                                    className={testReviewStyles.testReviewCardRejectIcon}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Reject test"
                                  >
                                    <CloseCircleOutlined />
                                  </button>
                                </Tooltip>
                              </Popconfirm>
                            )}
                            {test.status === 'approved' && (
                              <span className={testReviewStyles.testReviewCardStatusBadge}>
                                <CheckCircleOutlined /> Approved
                              </span>
                            )}
                            {test.status === 'rejected' && (
                              <span className={testReviewStyles.testReviewCardStatusBadgeRejected}>
                                <CloseCircleOutlined /> Rejected
                              </span>
                            )}
                          </>
                        ) : (
                          <span className={testReviewStyles.testReviewCardPushedBadge}>
                            <CloudUploadOutlined /> Pushed
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className={testReviewStyles.emptyFilterState}>
            <SearchOutlined className={testReviewStyles.emptyFilterIcon} />
            <p>No tests match your filters</p>
            <button className={testReviewStyles.clearFiltersBtn} onClick={onClearAllFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Action Bar */}
      {isTestGenerationPhase && onContinueToDataGeneration && (
        <div className={testReviewStyles.selectionBar}>
          <span className={testReviewStyles.selectionCount}>
            {testReviewData.approvedTests > 0
              ? `${testReviewData.approvedTests} test${testReviewData.approvedTests !== 1 ? 's' : ''} approved`
              : 'No tests approved yet'}
          </span>
          <Button
            type="primary"
            size="small"
            icon={<RocketOutlined />}
            onClick={onContinueToDataGeneration}
            disabled={testReviewData.approvedTests === 0}
            title={
              testReviewData.approvedTests === 0
                ? 'Please approve at least one test to continue'
                : 'Continue Data Generation'
            }
          >
            Continue Data Generation
          </Button>
        </div>
      )}

      {isTestExecutionPhase && onPushToGit && (
        <div className={testReviewStyles.selectionBar}>
          <span className={testReviewStyles.selectionCount}>
            {selectedTests.length > 0
              ? `${selectedTests.length} test${selectedTests.length !== 1 ? 's' : ''} selected`
              : 'No tests selected'}
          </span>
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={onPushToGit}
            disabled={
              selectedTests.length === 0 ||
              selectedTests.filter((testId) => {
                const test = testReviewData.tests.find((t) => t.id === testId);
                return test && test.status === 'approved' && !test.isPushed;
              }).length === 0
            }
            title={
              selectedTests.length === 0
                ? 'Please select at least one approved test to push to Git'
                : 'Push selected tests to Git'
            }
          >
            Push to Git
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestReviewPanel;
