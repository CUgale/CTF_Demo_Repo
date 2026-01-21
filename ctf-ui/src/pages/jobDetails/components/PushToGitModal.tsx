import React from 'react';
import { Modal, Form, Input, Tooltip } from 'antd';
import {
  CloudUploadOutlined,
  BranchesOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { JobDetails as JobDetailsType } from '../JobDetails.interface';
import { TestReviewData, TestDetail } from '../../testReview/TestReview.interface';

interface PushToGitModalProps {
  visible: boolean;
  jobDetails: JobDetailsType | null;
  testReviewData: TestReviewData | null;
  selectedTests: string[];
  mrName: string;
  onMrNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  form: any;
}

/**
 * Push to Git Modal Component
 * Modal for pushing approved tests to Git with merge request creation
 */
const PushToGitModal: React.FC<PushToGitModalProps> = ({
  visible,
  jobDetails,
  testReviewData,
  selectedTests,
  mrName,
  onMrNameChange,
  onConfirm,
  onCancel,
  form,
}) => {
  if (!jobDetails || !testReviewData) {
    return null;
  }

  // Filter to only approved tests that haven't been pushed
  const approvedSelectedTests = selectedTests.filter((testId) => {
    const test = testReviewData.tests.find((t) => t.id === testId);
    return test && test.status === 'approved' && !test.isPushed;
  });

  const testDetails = approvedSelectedTests
    .map((testId) => {
      const test = testReviewData.tests.find((t) => t.id === testId);
      return test;
    })
    .filter(Boolean) as TestDetail[];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CloudUploadOutlined />
          <span>Push Tests to Git</span>
        </div>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Push to Git"
      cancelText="Cancel"
      width={600}
      okButtonProps={{ icon: <CloudUploadOutlined /> }}
    >
      <Form form={form} layout="vertical">
        {/* Push Details Section */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '12px', fontWeight: 600 }}>Push Details</h4>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Tests to Push:</span>
                <span style={{ fontWeight: 600 }}>{approvedSelectedTests.length} approved test(s)</span>
              </div>
              {testDetails.length > 0 && testDetails.length <= 5 && (
                <div
                  style={{
                    marginTop: '4px',
                    padding: '8px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ color: '#666', marginBottom: '4px' }}>Test Names:</div>
                  {testDetails.map((test) => (
                    <div key={test.id} style={{ padding: '2px 0' }}>
                      • {test.name || test.id}
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <span style={{ color: '#666' }}>Target Branch:</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BranchesOutlined />
                  {jobDetails.branch || 'main'}
                </span>
              </div>
              {jobDetails.commitSha && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Commit SHA:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {jobDetails.commitSha.substring(0, 8)}...
                  </span>
                </div>
              )}
              {jobDetails.commitMessage && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                  <span style={{ color: '#666', fontSize: '12px' }}>Commit Message:</span>
                  <span style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    {jobDetails.commitMessage}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MR Name Section */}
        <Form.Item
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Merge Request Name</span>
              <Tooltip title="If tests are approved, they will be pushed to the branch and an MR will be created with this name. Otherwise, the MR will use the commit name.">
                <LinkOutlined style={{ color: '#999', fontSize: '12px' }} />
              </Tooltip>
            </div>
          }
          name="mrName"
          rules={[
            { required: true, message: 'Please enter a merge request name' },
            { min: 3, message: 'MR name must be at least 3 characters' },
          ]}
          initialValue={
            jobDetails?.commitMessage || `${jobDetails?.jobName || 'Job'} - Test Updates`
          }
        >
          <Input
            placeholder="Enter merge request name"
            value={mrName}
            onChange={(e) => onMrNameChange(e.target.value)}
            onPressEnter={onConfirm}
          />
        </Form.Item>

        {/* Info Message */}
        <div
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '4px',
            padding: '12px',
            marginTop: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <InfoCircleOutlined style={{ color: '#1890ff', marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#666' }}>
              <div style={{ marginBottom: '4px', fontWeight: 600 }}>
                Approved tests will be pushed to branch: <strong>{jobDetails?.branch || 'main'}</strong>
              </div>
              <div>
                A merge request will be created with the name you specify above. If no name is provided,
                the commit message will be used as the MR name.
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PushToGitModal;
