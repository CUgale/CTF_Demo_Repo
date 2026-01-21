import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Select, Input, message, Flex, Form } from 'antd';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  CodeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import SidebarLayout from '../../layouts/Layout';
import { useProject } from '../../context/ProjectContext';
import { createJobActions } from './CreateJob.reducer';
import { Commit, CreateJobFormValues } from './CreateJob.interface';
import styles from './CreateJob.module.scss';

const { Option } = Select;

const COMMIT_SHA_MIN_LENGTH = 7;
const COMMIT_SHA_MAX_LENGTH = 40;

/**
 * Formats a date string to a readable format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Validates commit SHA format
 */
const isValidCommitSha = (sha: string): boolean => {
  if (!sha || sha.trim().length === 0) {
    return false;
  }
  const trimmedSha = sha.trim();
  return trimmedSha.length >= COMMIT_SHA_MIN_LENGTH && trimmedSha.length <= COMMIT_SHA_MAX_LENGTH;
};

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProject } = useProject();
  const [form] = Form.useForm<CreateJobFormValues>();
  const [selectedCommit, setSelectedCommit] = useState<string>('');
  const [useCustomCommit, setUseCustomCommit] = useState<boolean>(false);
  const [commitDetails, setCommitDetails] = useState<Commit | null>(null);

  // Get commits from Redux state
  const projectCommits = useAppSelector(state => state.createJob.commits.data) || [];
  const commitsLoading = useAppSelector(state => state.createJob.commits.loading);
  const commitsError = useAppSelector(state => state.createJob.commits.error);
  
  // Get create job state from Redux
  const createJobLoading = useAppSelector(state => state.createJob.createJob.loading);
  const createJobError = useAppSelector(state => state.createJob.createJob.error);
  const createJobData = useAppSelector(state => state.createJob.createJob.data);

  // Clear create job state on component mount to prevent stale success messages
  useEffect(() => {
    dispatch(createJobActions.clearCreateJobData());
  }, [dispatch]);

  // Fetch commits on component mount
  useEffect(() => {
    if (selectedProject) {
      dispatch(createJobActions.fetchCommits());
    }
  }, [dispatch, selectedProject]);

  // Show error message if commits fetch fails
  useEffect(() => {
    if (commitsError) {
      message.error(`Failed to load commits: ${commitsError}`);
    }
  }, [commitsError]);

  // Handle create job success/error
  useEffect(() => {
    if (createJobData) {
      message.success('Job created successfully');
      // Clear the state before navigating to prevent re-triggering on return
      dispatch(createJobActions.clearCreateJobData());
      setTimeout(() => navigate('/jobs'), 1000);
    }
  }, [createJobData, navigate, dispatch]);

  useEffect(() => {
    if (createJobError) {
      message.error(`Failed to create job: ${createJobError}`);
    }
  }, [createJobError]);

  // Update commit details when selection changes
  useEffect(() => {
    if (selectedCommit && !useCustomCommit && projectCommits.length > 0) {
      const commit = projectCommits.find(
        (c: Commit) => c.sha === selectedCommit || c.id === selectedCommit
      );
      setCommitDetails(commit || null);
    } else if (!selectedCommit && !useCustomCommit) {
      setCommitDetails(null);
    }
  }, [selectedCommit, useCustomCommit, projectCommits]);

  // Watch custom commit input for real-time validation
  const customCommitId = Form.useWatch('customCommitId', form);

  // Handle custom commit input
  useEffect(() => {
    if (useCustomCommit && customCommitId) {
      if (isValidCommitSha(customCommitId)) {
        setCommitDetails({
          id: 'custom',
          sha: customCommitId.trim(),
          message: 'Custom commit',
          author: { name: 'User', email: 'user@example.com' },
          timestamp: new Date().toISOString(),
          branch: 'main',
        });
      } else {
        setCommitDetails(null);
      }
    } else if (useCustomCommit && !customCommitId) {
      setCommitDetails(null);
    }
  }, [useCustomCommit, customCommitId]);

  const handleCommitSelect = useCallback((value: string | null) => {
    if (value === 'custom') {
      setUseCustomCommit(true);
      setSelectedCommit('');
      form.setFieldsValue({ commitSha: undefined, customCommitId: '' });
      setCommitDetails(null);
    } else if (value) {
      setUseCustomCommit(false);
      setSelectedCommit(value);
      form.setFieldsValue({ customCommitId: '' });
    } else {
      setUseCustomCommit(false);
      setSelectedCommit('');
      form.setFieldsValue({ commitSha: undefined, customCommitId: '' });
      setCommitDetails(null);
    }
  }, [form]);

  const handleCustomCommitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ customCommitId: value });
    // Commit details will be updated by useEffect watching customCommitId
  }, [form]);

  const handleTrigger = useCallback(() => {
    if (!commitDetails) {
      message.error('Please select or enter a valid commit');
      return;
    }

    // Always use SHA from commit list response, fallback to custom commit input
    const commitSha = commitDetails.sha;
    if (!commitSha) {
      message.error('Invalid commit SHA');
      return;
    }

    dispatch(createJobActions.createJob({
      commit_id: commitSha,
    }));
  }, [commitDetails, dispatch]);

  const handleCancel = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const filterCommitOptions = useCallback((input: string, option: any) => {
    const commit = projectCommits.find((c: Commit) => c.sha === option?.value);
    if (!commit) return false;
    const searchText = input.toLowerCase();
    return (
      commit.sha.toLowerCase().includes(searchText) ||
      commit.message.toLowerCase().includes(searchText) ||
      commit.author.name.toLowerCase().includes(searchText)
    );
  }, [projectCommits]);

  const jobNameValue = Form.useWatch('jobName', form);

  return (
    <SidebarLayout>
      <div>
        {/* Page Header */}
        <Flex justify="space-between" align="center" className="mb-4">
          <div>
            <span className="mb-0 fs-5 fw-bold p-0">Create Job</span>
            <p className={styles.titleDescription}>
              Configure and trigger a new test execution job
            </p>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
            Back
          </Button>
        </Flex>

        {/* Job Configuration */}
        <div className={`${styles.formCard} mb-3`}>
          <Form form={form} layout="horizontal">
            {/* Job Name Field */}
            <Form.Item
              name="jobName"
              label={
                <span>
                  <EditOutlined className={styles.labelIcon} /> Job Name
                </span>
              }
            >
              <Input
                placeholder="Enter job name or leave empty to use commit message"
                maxLength={200}
              />
              {!jobNameValue && commitDetails && (
                <div className={styles.inputHint}>
                  Will use: &quot;{commitDetails.message}&quot;
                </div>
              )}
            </Form.Item>

            {/* Commit Selection Field */}
            <Form.Item
              name="commitSha"
              label={
                <span>
                  <CodeOutlined className={styles.labelIcon} /> Commit
                </span>
              }
              rules={[
                {
                  validator: () => {
                    if (!commitDetails) {
                      return Promise.reject(new Error('Please select or enter a commit'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {!useCustomCommit ? (
                <div style={{ width: '100%' }}>
                  <Select
                    placeholder="Select from recent commits or enter custom commit ID"
                    value={selectedCommit || undefined}
                    onChange={handleCommitSelect}
                    showSearch
                    allowClear
                    loading={commitsLoading}
                    filterOption={filterCommitOptions}
                    notFoundContent={
                      commitsLoading 
                        ? 'Loading commits...' 
                        : projectCommits.length === 0 
                        ? 'No commits available' 
                        : undefined
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div className={styles.customCommitOption}>
                          <Button
                            type="link"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommitSelect('custom');
                            }}
                          >
                            <CodeOutlined /> Enter custom commit ID
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {projectCommits.map((commit: Commit) => (
                      <Option key={commit.id} value={commit.sha}>
                        <Flex align="center" gap={8} className={styles.commitOption}>
                          <span className={styles.commitSha}>
                            {commit.sha.substring(0, 7)}
                          </span>
                          <span className={`${styles.commitMessage} flex-grow-1`}>
                            {commit.message}
                          </span>
                        </Flex>
                      </Option>
                    ))}
                  </Select>

                  {!selectedCommit && (
                    <div className={`${styles.hintBox} mt-3`}>
                      <InfoCircleOutlined className={styles.hintIcon} />
                      <span className={styles.hintText}>
                        <strong>Get Started</strong> – Select a commit from the dropdown above
                        or enter a custom commit ID to begin
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Flex gap={8} align="center">
                  <Form.Item
                    name="customCommitId"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a commit SHA',
                      },
                      {
                        validator: (_, value) => {
                          if (!value || !isValidCommitSha(value)) {
                            return Promise.reject(
                              new Error(
                                `Commit SHA must be between ${COMMIT_SHA_MIN_LENGTH} and ${COMMIT_SHA_MAX_LENGTH} characters`
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter commit SHA or ID (e.g., abc1234)"
                      prefix={<CodeOutlined style={{ color: '#94a3b8' }} />}
                      onPressEnter={() => {
                        form.validateFields(['customCommitId']).then(() => {
                          if (commitDetails) {
                            handleTrigger();
                          }
                        });
                      }}
                      onChange={handleCustomCommitChange}
                      className="flex-grow-1"
                    />
                  </Form.Item>
                  <Button
                    type="link"
                    onClick={() => {
                      setUseCustomCommit(false);
                      form.setFieldsValue({ customCommitId: '', commitSha: undefined });
                      setCommitDetails(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
              )}
            </Form.Item>
          </Form>
        </div>

        {/* Commit Details */}
        {commitDetails && (
          <div className={`${styles.commitDetails} mb-3`}>
            <div className={styles.commitDetailsHeader}>
              <span className={styles.commitDetailsTitle}>Commit Information</span>
            </div>
            <div className={styles.commitDetailsBody}>
              {/* Primary row: SHA and Message */}
              <Flex align="center" gap={10} className="mb-2">
                <code className={styles.commitShaCode}>{commitDetails.sha}</code>
                <span className={styles.commitMessage}>{commitDetails.message}</span>
              </Flex>

              {/* Meta row: Author, Branch, Time */}
              <Flex align="center" gap={6} wrap="wrap">
                <Flex align="center" gap={4} className={styles.commitMetaItem}>
                  <UserOutlined className={styles.metaIcon} />
                  <span className={styles.metaValue}>{commitDetails.author.name}</span>
                  <span className={styles.metaEmail}>{commitDetails.author.email}</span>
                </Flex>
                <span className={styles.metaSeparator}>·</span>
                <Flex align="center" gap={4} className={styles.commitMetaItem}>
                  <BranchesOutlined className={styles.metaIcon} />
                  <span className={styles.metaValue}>{commitDetails.branch}</span>
                </Flex>
                <span className={styles.metaSeparator}>·</span>
                <Flex align="center" gap={4} className={styles.commitMetaItem}>
                  <ClockCircleOutlined className={styles.metaIcon} />
                  <span className={styles.metaValue}>
                    {formatDate(commitDetails.timestamp)}
                  </span>
                </Flex>
              </Flex>
            </div>
          </div>
        )}

        {/* Action Section */}
        <Flex justify="flex-end" gap={8} className="pt-1">
          <Button type="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleTrigger}
            disabled={!commitDetails || createJobLoading}
            loading={createJobLoading}
            className={styles.triggerButton}
          >
            Trigger Job
          </Button>
        </Flex>
      </div>
    </SidebarLayout>
  );
};

export default CreateJob;
