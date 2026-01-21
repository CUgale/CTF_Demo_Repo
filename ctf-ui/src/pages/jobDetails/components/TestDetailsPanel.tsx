import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { TestDetail, TestStatus } from '../../testReview/TestReview.interface';
import testReviewStyles from '../../testReview/TestReview.module.scss';

interface TestDetailsPanelProps {
  viewingTest: TestDetail | null;
  onApprove: (testId: string) => void;
  onReject: (testId: string) => void;
}

/**
 * Test Details Panel Component
 * Displays detailed information about a selected test
 */
const TestDetailsPanel: React.FC<TestDetailsPanelProps> = ({
  viewingTest,
  onApprove,
  onReject,
}) => {
  if (!viewingTest) {
    return (
      <div className={testReviewStyles.testDetailsPanel}>
        <div className={testReviewStyles.emptyDetailsState}>
          <div className={testReviewStyles.emptyDetailsIcon}>
            <CodeOutlined />
          </div>
          <h3>Select a test to view details</h3>
          <p>Click on any test from the list to preview the SQL code and metadata</p>
        </div>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(viewingTest.sql);
    message.success('Copied to clipboard');
  };

  return (
    <div className={testReviewStyles.testDetailsPanel}>
      <div className={testReviewStyles.testDetailsContent}>
        <div className={testReviewStyles.detailsHeader}>
          <div className={testReviewStyles.detailsHeaderTop}>
            <div className={testReviewStyles.detailsTitleGroup}>
              <h2 className={testReviewStyles.detailsTestName}>{viewingTest.name}</h2>
              <span
                className={`${testReviewStyles.detailsStatusBadge} ${testReviewStyles[viewingTest.status]}`}
              >
                {viewingTest.status === 'approved' && <CheckCircleOutlined />}
                {viewingTest.status === 'rejected' && <CloseCircleOutlined />}
                {viewingTest.status === 'pending' && <ClockCircleOutlined />}
                {viewingTest.status}
              </span>
            </div>
            {!viewingTest.isPushed && (
              <div className={testReviewStyles.detailsActions}>
                {viewingTest.status !== 'approved' && (
                  <button
                    className={testReviewStyles.detailsApproveBtn}
                    onClick={() => onApprove(viewingTest.id)}
                  >
                    <CheckCircleOutlined />
                    <span>Approve</span>
                  </button>
                )}
                {viewingTest.status !== 'rejected' && (
                  <Popconfirm
                    title="Reject this test?"
                    onConfirm={() => onReject(viewingTest.id)}
                    okText="Reject"
                    okButtonProps={{ danger: true }}
                  >
                    <button className={testReviewStyles.detailsRejectBtn}>
                      <CloseCircleOutlined />
                      <span>Reject</span>
                    </button>
                  </Popconfirm>
                )}
              </div>
            )}
            {viewingTest.isPushed && (
              <div className={testReviewStyles.pushedBadge}>
                <CloudUploadOutlined /> Pushed to Git
              </div>
            )}
          </div>
        </div>

        <div className={testReviewStyles.codeSection}>
          <div className={testReviewStyles.codeHeader}>
            <div className={testReviewStyles.codeHeaderLeft}>
              <CodeOutlined />
              <span>SQL Query</span>
            </div>
            <Button
              type="text"
              size="small"
              className={testReviewStyles.copyBtn}
              onClick={handleCopyCode}
            >
              Copy Code
            </Button>
          </div>
          <div className={testReviewStyles.codeContainer}>
            <div className={testReviewStyles.codeWindowBar}>
              <div className={testReviewStyles.windowControls}>
                <span className={testReviewStyles.controlRed} />
                <span className={testReviewStyles.controlYellow} />
                <span className={testReviewStyles.controlGreen} />
              </div>
              <span className={testReviewStyles.codeFileName}>{viewingTest.name}.sql</span>
            </div>
            <div className={testReviewStyles.codeContent}>
              <pre>{viewingTest.sql}</pre>
            </div>
          </div>
        </div>

        <div className={testReviewStyles.detailsMeta}>
          <span className={testReviewStyles.metaItem}>
            <span className={testReviewStyles.metaLabel}>Type:</span>
            <span className={testReviewStyles.metaValue}>
              {viewingTest.type.replace('_', ' ')}
            </span>
          </span>
          <span className={testReviewStyles.metaItem}>
            <span className={testReviewStyles.metaLabel}>Model:</span>
            <span
              className={`${testReviewStyles.metaValue} ${testReviewStyles.metaValueHighlight}`}
            >
              {viewingTest.model}
            </span>
          </span>
          {viewingTest.column && (
            <span className={testReviewStyles.metaItem}>
              <span className={testReviewStyles.metaLabel}>Column:</span>
              <span
                className={`${testReviewStyles.metaValue} ${testReviewStyles.metaValueHighlight}`}
              >
                {viewingTest.column}
              </span>
            </span>
          )}
          <span className={testReviewStyles.metaItem}>
            <span className={testReviewStyles.metaLabel}>Source:</span>
            <span className={testReviewStyles.metaValue}>
              {viewingTest.source === 'ai' ? 'AI Generated' : 'dbt'}
            </span>
          </span>
          <span className={testReviewStyles.metaItem}>
            <span className={testReviewStyles.metaLabel}>Created:</span>
            <span className={`${testReviewStyles.metaValue} ${testReviewStyles.metaValueDate}`}>
              {new Date(viewingTest.generatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsPanel;
