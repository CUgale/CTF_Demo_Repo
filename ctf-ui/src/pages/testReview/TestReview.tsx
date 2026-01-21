import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Tag, Modal, Descriptions, message, Checkbox, Popconfirm, Tooltip, Divider, Select, Input } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CodeOutlined,
  FileTextOutlined,
  CheckOutlined,
  PushpinOutlined,
  BranchesOutlined,
  UserOutlined,
  FolderOutlined,
  EyeOutlined,
  FileOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  CloudUploadOutlined,
  MinusCircleOutlined,
  SafetyCertificateOutlined,
  LinkOutlined,
  FieldStringOutlined,
  TagOutlined,
  FilterOutlined,
  RobotOutlined,
  ToolOutlined,
  TableOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarLayout from '../../layouts/Layout';
import { mockTestReviewData } from './TestReview.mockdata';
import { TestReviewData, TestDetail, TestStatus, TestSource } from './TestReview.interface';
import styles from './TestReview.module.scss';

const TestReview: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [testReviewData, setTestReviewData] = useState<TestReviewData | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [viewingTest, setViewingTest] = useState<TestDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPushModalVisible, setIsPushModalVisible] = useState(false);
  const [rejectedTestsArtifacts, setRejectedTestsArtifacts] = useState<TestDetail[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'editor'>('editor');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (jobId) {
      const data = { ...mockTestReviewData };
      const existingRejected = data.tests.filter((t) => t.status === 'rejected');
      setRejectedTestsArtifacts(existingRejected);
      setTestReviewData(data);
      // Set first test as viewing test in editor mode
      if (data.tests.length > 0) {
        setViewingTest(data.tests[0]);
      }
    }
  }, [jobId]);

  // Filter tests based on filters
  const filteredTests = useMemo(() => {
    if (!testReviewData) return [];
    return testReviewData.tests.filter((test) => {
      const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
      const matchesType = typeFilter === 'all' || test.type === typeFilter;
      const matchesSource = sourceFilter === 'all' || test.source === sourceFilter;
      const matchesSearch = searchQuery === '' || 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.column && test.column.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesType && matchesSource && matchesSearch;
    });
  }, [testReviewData, statusFilter, typeFilter, sourceFilter, searchQuery]);

  const selectableApprovedVisibleIds = useMemo(() => {
    return filteredTests
      .filter((t) => t.status === 'approved' && !t.isPushed)
      .map((t) => t.id);
  }, [filteredTests]);

  const handleSelectAllApprovedVisible = () => {
    setSelectedTests(selectableApprovedVisibleIds);
  };

  const handleClearSelection = () => {
    setSelectedTests([]);
  };

  // Ensure a test is selected when switching to editor view or when filters change
  useEffect(() => {
    if (viewMode === 'editor' && filteredTests.length > 0) {
      // If current viewing test is not in filtered list, select first filtered test
      if (!viewingTest || !filteredTests.find(t => t.id === viewingTest.id)) {
        setViewingTest(filteredTests[0]);
      }
    } else if (viewMode === 'editor' && filteredTests.length === 0) {
      // No tests match filters, clear viewing test
      setViewingTest(null);
    }
  }, [viewMode, filteredTests, viewingTest]);

  const handleApprove = (testId: string) => {
    if (!testReviewData) return;
    const testToApprove = testReviewData.tests.find((t) => t.id === testId);
    if (!testToApprove) {
      const rejectedTest = rejectedTestsArtifacts.find((t) => t.id === testId);
      if (rejectedTest) {
        const updatedArtifacts = rejectedTestsArtifacts.filter((t) => t.id !== testId);
        setRejectedTestsArtifacts(updatedArtifacts);
        const approvedTest = { ...rejectedTest, status: 'approved' as TestStatus };
        const updatedTests = [...testReviewData.tests, approvedTest];
        setTestReviewData({
          ...testReviewData,
          tests: updatedTests,
          approvedTests: updatedTests.filter((t) => t.status === 'approved').length,
          rejectedTests: updatedTests.filter((t) => t.status === 'rejected').length,
          pendingTests: updatedTests.filter((t) => t.status === 'pending').length,
        });
        // Update viewingTest if it's the one being approved
        if (viewingTest?.id === testId) {
          setViewingTest(approvedTest);
        }
        message.success('Test approved');
        return;
      }
      return;
    }

    const updatedTests = testReviewData.tests.map((test) =>
      test.id === testId ? { ...test, status: 'approved' as TestStatus } : test
    );
    setRejectedTestsArtifacts(rejectedTestsArtifacts.filter((t) => t.id !== testId));
    setTestReviewData({
      ...testReviewData,
      tests: updatedTests,
      approvedTests: updatedTests.filter((t) => t.status === 'approved').length,
      rejectedTests: updatedTests.filter((t) => t.status === 'rejected').length,
      pendingTests: updatedTests.filter((t) => t.status === 'pending').length,
    });
    // Update viewingTest if it's the one being approved
    if (viewingTest?.id === testId) {
      const updatedViewingTest = updatedTests.find((t) => t.id === testId);
      if (updatedViewingTest) {
        setViewingTest(updatedViewingTest);
      }
    }
    message.success('Test approved');
  };

  const handleReject = (testId: string) => {
    if (!testReviewData) return;
    const testToReject = testReviewData.tests.find((t) => t.id === testId);
    if (!testToReject) return;

    const updatedTests = testReviewData.tests.map((test) =>
      test.id === testId ? { ...test, status: 'rejected' as TestStatus } : test
    );
    const rejectedTest = { ...testToReject, status: 'rejected' as TestStatus };
    if (!rejectedTestsArtifacts.find((t) => t.id === testId)) {
      setRejectedTestsArtifacts([...rejectedTestsArtifacts, rejectedTest]);
    }
    setSelectedTests(selectedTests.filter((id) => id !== testId));
    setTestReviewData({
      ...testReviewData,
      tests: updatedTests,
      approvedTests: updatedTests.filter((t) => t.status === 'approved').length,
      rejectedTests: updatedTests.filter((t) => t.status === 'rejected').length,
      pendingTests: updatedTests.filter((t) => t.status === 'pending').length,
    });
    // Update viewingTest if it's the one being rejected
    if (viewingTest?.id === testId) {
      const updatedViewingTest = updatedTests.find((t) => t.id === testId);
      if (updatedViewingTest) {
        setViewingTest(updatedViewingTest);
      }
    }
    message.success('Test rejected');
  };

  const handleSelectAllApproved = () => {
    if (!testReviewData) return;
    const approvedTestIds = testReviewData.tests
      .filter((test) => test.status === 'approved' && !test.isPushed)
      .map((test) => test.id);
    setSelectedTests(approvedTestIds);
  };

  const handleConfirmPush = () => {
    if (!testReviewData || selectedTests.length === 0) return;
    message.loading('Pushing tests to git...', 1.5);
    setTimeout(() => {
      const updatedTests = testReviewData.tests.map((test) =>
        selectedTests.includes(test.id)
          ? { ...test, isPushed: true, pushedAt: new Date().toISOString() }
          : test
      );
      setTestReviewData({ ...testReviewData, tests: updatedTests });
      message.success('Tests successfully pushed to git');
      setSelectedTests([]);
      setIsPushModalVisible(false);
    }, 2000);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined className={styles.statusIconApproved} />;
      case 'rejected':
        return <CloseCircleOutlined className={styles.statusIconRejected} />;
      default:
        return <ClockCircleOutlined className={styles.statusIconPending} />;
    }
  };

  const getStatusLabel = (status: TestStatus) => {
    return (
      <span className={`${styles.statusLabel} ${styles[status]}`}>
        {getStatusIcon(status)}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      not_null: <SafetyCertificateOutlined />,
      unique: <FieldStringOutlined />,
      relationships: <LinkOutlined />,
      accepted_values: <FilterOutlined />,
      custom: <TagOutlined />,
    };
    return iconMap[type] || <TagOutlined />;
  };

  const getTypeLabel = (type: string) => {
    return (
      <span className={styles.typeLabel}>
        {getTypeIcon(type)}
        <span>{type.replace(/_/g, ' ')}</span>
      </span>
    );
  };

  const getSourceLabel = (source: TestSource) => {
    if (source === 'ai') {
      return (
        <span className={`${styles.sourceLabel} ${styles.sourceAi}`}>
          <RobotOutlined />
          <span>AI</span>
        </span>
      );
    }
    return (
      <span className={`${styles.sourceLabel} ${styles.sourceDbt}`}>
        <ToolOutlined />
        <span>dbt</span>
      </span>
    );
  };

  const getStatusTag = (status: TestStatus) => {
    const tagMap = {
      approved: <Tag color="success" icon={<CheckCircleOutlined />}>Approved</Tag>,
      rejected: <Tag color="error" icon={<CloseCircleOutlined />}>Rejected</Tag>,
      pending: <Tag>Pending</Tag>,
    };
    return tagMap[status] || <Tag>Pending</Tag>;
  };

  const getTypeTag = (type: string) => {
    const colors: Record<string, string> = {
      not_null: 'blue',
      unique: 'green',
      relationships: 'purple',
      accepted_values: 'orange',
      custom: 'cyan',
    };
    return <Tag color={colors[type] || 'default'} className={styles.typeTag}>{type.replace('_', ' ')}</Tag>;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { date: `${month} ${day}`, time };
  };

  const columns = [
    {
      title: '',
      key: 'select',
      width: 40,
      render: (_: any, record: TestDetail) => (
        <Checkbox
          checked={selectedTests.includes(record.id)}
          disabled={record.status !== 'approved' || record.isPushed}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTests([...selectedTests, record.id]);
            } else {
              setSelectedTests(selectedTests.filter((id) => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'generatedAt',
      key: 'createdAt',
      width: 90,
      render: (generatedAt: string) => {
        const { date, time } = formatDateTime(generatedAt);
        return (
          <span className={styles.createdAtLabel}>
            <span className={styles.createdDate}>{date}</span>
            <span className={styles.createdTime}>{time}</span>
          </span>
        );
      },
    },
    {
      title: 'Test Name',
      key: 'name',
      render: (_: any, record: TestDetail) => (
        <span className={styles.testName}>{record.name}</span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: string) => getTypeLabel(type),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 120,
      render: (model: string) => (
        <span className={styles.modelLabel}>
          <TableOutlined />
          <span>{model}</span>
        </span>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 80,
      align: 'center' as const,
      render: (source: TestSource) => getSourceLabel(source),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TestStatus) => getStatusLabel(status),
    },
    {
      title: 'Git',
      key: 'pushed',
      width: 50,
      align: 'center' as const,
      render: (_: any, record: TestDetail) => (
        record.isPushed ? (
          <Tooltip title="Pushed to Git">
            <CloudUploadOutlined className={styles.gitIconPushed} />
          </Tooltip>
        ) : (
          <Tooltip title="Not Pushed">
            <MinusCircleOutlined className={styles.gitIconNotPushed} />
          </Tooltip>
        )
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: TestDetail) => (
        <div className={styles.actionButtons}>
          {!record.isPushed && record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <button
                  className={styles.actionBtnApprove}
                  onClick={() => handleApprove(record.id)}
                >
                  <CheckOutlined />
                </button>
              </Tooltip>
              <Popconfirm
                title="Reject this test?"
                onConfirm={() => handleReject(record.id)}
                okText="Reject"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Reject">
                  <button className={styles.actionBtnReject}>
                    <CloseCircleOutlined />
                  </button>
                </Tooltip>
              </Popconfirm>
            </>
          )}
          {!record.isPushed && record.status === 'approved' && (
            <Popconfirm
              title="Reject this approved test?"
              onConfirm={() => handleReject(record.id)}
              okText="Reject"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Reject">
                <button className={styles.actionBtnReject}>
                  <CloseCircleOutlined />
                </button>
              </Tooltip>
            </Popconfirm>
          )}
          {!record.isPushed && record.status === 'rejected' && (
            <Tooltip title="Approve">
              <button
                className={styles.actionBtnApprove}
                onClick={() => handleApprove(record.id)}
              >
                <CheckOutlined />
              </button>
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <button
              className={styles.actionBtnView}
              onClick={() => {
                setViewingTest(record);
                setIsModalVisible(true);
              }}
            >
              <SearchOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (!testReviewData) {
    return (
      <SidebarLayout>
        <div className={styles.loadingState}>Loading test review...</div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className={styles.testReviewPage}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate('/')}>Home</span>
          <span className={styles.breadcrumbSep}>/</span>
          <span onClick={() => navigate('/jobs')}>Jobs</span>
          <span className={styles.breadcrumbSep}>/</span>
          <span onClick={() => navigate(`/jobs/${jobId}`)}>{testReviewData.jobId}</span>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbActive}>Test Review</span>
        </div>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTitleRow}>
              <h1>Test Review</h1>
              <span className={styles.jobIdBadge}>{testReviewData.jobId}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.viewToggle}>
              <Tooltip title="Table View">
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <TableOutlined />
                </button>
              </Tooltip>
              <Tooltip title="Editor View">
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'editor' ? styles.active : ''}`}
                  onClick={() => setViewMode('editor')}
                >
                  <AppstoreOutlined />
                </button>
              </Tooltip>
            </div>
            <Button
              className={styles.backButton}
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/jobs/${jobId}`)}
            >
              Back to Job
            </Button>
          </div>
        </div>

        {/* Summary Stats - Inline */}
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <ExperimentOutlined className={styles.statIcon} />
            <span className={styles.statLabel}>Total Tests</span>
            <span className={styles.statValue}>{testReviewData.totalTests}</span>
            <span className={styles.statSubtext}>Generated by AI</span>
          </div>
          <div className={styles.statDivider} />
          <div className={`${styles.statItem} ${styles.approved}`}>
            <CheckCircleOutlined className={styles.statIcon} />
            <span className={styles.statLabel}>Approved</span>
            <span className={styles.statValue}>{testReviewData.approvedTests}</span>
            <span className={styles.statSubtext}>
              {testReviewData.totalTests > 0
                ? `${Math.round((testReviewData.approvedTests / testReviewData.totalTests) * 100)}% of total`
                : '0%'}
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={`${styles.statItem} ${styles.rejected}`}>
            <CloseCircleOutlined className={styles.statIcon} />
            <span className={styles.statLabel}>Rejected</span>
            <span className={styles.statValue}>{testReviewData.rejectedTests}</span>
            <span className={styles.statSubtext}>{rejectedTestsArtifacts.length} in artifacts</span>
          </div>
          <div className={styles.statDivider} />
          <div className={`${styles.statItem} ${styles.pending}`}>
            <ClockCircleOutlined className={styles.statIcon} />
            <span className={styles.statLabel}>Pending</span>
            <span className={styles.statValue}>{testReviewData.pendingTests}</span>
            <span className={styles.statSubtext}>Awaiting review</span>
          </div>
        </div>

        {/* Tests Table Card or Editor View */}
        {viewMode === 'table' ? (
          <div className={styles.testsCard}>
            <div className={styles.cardHeader}>
              <h2>Generated Tests</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  icon={<CheckOutlined />}
                  onClick={handleSelectAllApproved}
                  disabled={testReviewData.approvedTests === 0}
                >
                  Select All Approved
                </Button>
                <Button
                  type="primary"
                  icon={<PushpinOutlined />}
                  onClick={() => setIsPushModalVisible(true)}
                  disabled={selectedTests.length === 0}
                >
                  Push to Git ({selectedTests.length})
                </Button>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <Table
                columns={columns}
                dataSource={testReviewData.tests}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `${total} tests`,
                }}
                size="middle"
              />
            </div>
          </div>
        ) : (
          <div className={styles.editorView}>
            <div className={styles.editorContainer}>
              {/* Left Side: Test List */}
              <div className={styles.testListPanel}>
                <div className={styles.testListHeader}>
                  <div className={styles.testListHeaderTop}>
                    <div className={styles.testListTitleGroup}>
                      <span className={styles.testListTitle}>Tests</span>
                      <span className={styles.testListCount}>{filteredTests.length}</span>
                    </div>
                    <div className={styles.testListActions}>
                      {/* Search Icon/Input */}
                      {!isSearchExpanded ? (
                        <Button
                          icon={<SearchOutlined />}
                          onClick={() => setIsSearchExpanded(true)}
                          title="Search tests"
                          className={styles.searchIconBtn}
                        />
                      ) : (
                        <Input.Search
                          placeholder="Search tests..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (!e.target.value) {
                              setIsSearchExpanded(false);
                            }
                          }}
                          onBlur={() => {
                            if (!searchQuery) {
                              setIsSearchExpanded(false);
                            }
                          }}
                          allowClear
                          autoFocus
                          className={styles.searchInputWrapper}
                          style={{ width: 200 }}
                        />
                      )}
                      {/* Filter Select */}
                      <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className={styles.statusFilterSelect}
                        optionRender={(option) => option.label}
                        options={[
                          { 
                            value: 'all', 
                            label: (
                              <span className={styles.filterOption}>
                                <AppstoreOutlined className={styles.filterOptionIcon} />
                                <span>All Status</span>
                              </span>
                            )
                          },
                          { 
                            value: 'pending', 
                            label: (
                              <span className={styles.filterOption}>
                                <ClockCircleOutlined className={styles.filterOptionIcon} />
                                <span>Pending</span>
                              </span>
                            )
                          },
                          { 
                            value: 'approved', 
                            label: (
                              <span className={styles.filterOption}>
                                <CheckCircleOutlined className={styles.filterOptionIcon} />
                                <span>Approved</span>
                              </span>
                            )
                          },
                          { 
                            value: 'rejected', 
                            label: (
                              <span className={styles.filterOption}>
                                <CloseCircleOutlined className={styles.filterOptionIcon} />
                                <span>Rejected</span>
                              </span>
                            )
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Actions - Clean & Subtle */}
                <div className={styles.bulkActionsBar}>
                  <div className={styles.bulkActionsContent}>
                    <div className={styles.bulkActionsInfo}>
                      {selectedTests.length > 0 ? (
                        <span className={styles.bulkCountActive}>
                          {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected
                        </span>
                      ) : (
                        <span className={styles.bulkHintText}>
                          Select approved tests to push to Git
                        </span>
                      )}
                    </div>
                    <div className={styles.bulkActionsButtons}>
                      <button
                        className={styles.bulkSelectBtn}
                        onClick={handleSelectAllApprovedVisible}
                        disabled={selectableApprovedVisibleIds.length === 0}
                      >
                        <CheckOutlined />
                        Select all approved
                      </button>
                      {selectedTests.length > 0 && (
                        <button
                          className={styles.bulkClearBtn}
                          onClick={handleClearSelection}
                        >
                          Clear
                        </button>
                      )}
                      <button
                        className={`${styles.bulkPushBtn} ${selectedTests.length === 0 ? styles.disabled : ''}`}
                        onClick={() => setIsPushModalVisible(true)}
                        disabled={selectedTests.length === 0}
                      >
                        <PushpinOutlined />
                        Push to Git
                        {selectedTests.length > 0 && (
                          <span className={styles.bulkPushCount}>({selectedTests.length})</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>


                {/* Test List */}
                <div className={styles.testListContent}>
                  {filteredTests.length > 0 ? (
                    <>
                      {/* Helper text for user guidance */}
                      {testReviewData.pendingTests > 0 && (
                        <div className={styles.listHelperText}>
                          <span>👉 Click a test to view details, hover to approve/reject</span>
                        </div>
                      )}
                      {filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className={`${styles.testListItem} ${styles[`status${test.status.charAt(0).toUpperCase() + test.status.slice(1)}Border`]} ${viewingTest?.id === test.id ? styles.active : ''}`}
                        onClick={() => setViewingTest(test)}
                      >
                        <div className={styles.testItemContent}>
                          {/* Checkbox for approved tests - always visible */}
                          {!test.isPushed && test.status === 'approved' && (
                            <div className={styles.testItemCheckbox}>
                              <Checkbox
                                checked={selectedTests.includes(test.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedTests([...selectedTests, test.id]);
                                  } else {
                                    setSelectedTests(selectedTests.filter((id) => id !== test.id));
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          )}
                          <div className={styles.testItemMain}>
                            <span className={styles.testItemName}>{test.name}</span>
                            <div className={styles.testItemTags}>
                              <span className={`${styles.testItemType} ${styles[`type${test.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`]}`}>
                                {test.type.replace('_', ' ')}
                              </span>
                              <span className={styles.testItemModel}>{test.model}</span>
                              {test.source === 'ai' && (
                                <span className={styles.testItemAI}>
                                  <RobotOutlined />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.testItemRight}>
                            {test.isPushed ? (
                              <CloudUploadOutlined className={styles.pushedIcon} />
                            ) : (
                              <span className={`${styles.statusDot} ${styles[test.status]}`} />
                            )}
                          </div>
                        </div>
                        {/* Action Buttons - visible on hover with labels */}
                        <div className={styles.testItemActions}>
                          {!test.isPushed && (
                            <>
                              {test.status !== 'approved' && (
                                <Tooltip title="Approve">
                                  <button
                                    className={styles.quickActionApprove}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApprove(test.id);
                                    }}
                                    aria-label="Approve test"
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
                                    handleReject(test.id);
                                  }}
                                  okText="Reject"
                                  okButtonProps={{ danger: true }}
                                  onCancel={(e) => e?.stopPropagation()}
                                >
                                  <Tooltip title="Reject">
                                    <button
                                      className={styles.quickActionReject}
                                      onClick={(e) => e.stopPropagation()}
                                      aria-label="Reject test"
                                    >
                                      <CloseCircleOutlined />
                                    </button>
                                  </Tooltip>
                                </Popconfirm>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                    }
                    </>
                  ) : (
                    <div className={styles.emptyFilterState}>
                      <SearchOutlined className={styles.emptyFilterIcon} />
                      <p>No tests match your filters</p>
                      <button 
                        className={styles.clearFiltersBtn}
                        onClick={() => {
                          setStatusFilter('all');
                          setTypeFilter('all');
                          setSourceFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                {selectedTests.length > 0 && (
                  <div className={styles.selectionBar}>
                    <span className={styles.selectionCount}>{selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected</span>
                    <button
                      className={styles.selectionPushBtn}
                      onClick={() => setIsPushModalVisible(true)}
                    >
                      <PushpinOutlined />
                      Push to Git
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Test Details */}
              <div className={styles.testDetailsPanel}>
                {viewingTest ? (
                  <div className={styles.testDetailsContent}>
                    {/* Clean Header */}
                    <div className={styles.detailsHeader}>
                      <div className={styles.detailsHeaderTop}>
                        <div className={styles.detailsTitleGroup}>
                          <h2 className={styles.detailsTestName}>{viewingTest.name}</h2>
                          <span className={`${styles.detailsStatusBadge} ${styles[viewingTest.status]}`}>
                            {viewingTest.status === 'approved' && <CheckCircleOutlined />}
                            {viewingTest.status === 'rejected' && <CloseCircleOutlined />}
                            {viewingTest.status === 'pending' && <ClockCircleOutlined />}
                            {viewingTest.status}
                          </span>
                        </div>
                        {/* Prominent Action Buttons */}
                        {!viewingTest.isPushed && (
                          <div className={styles.detailsActions}>
                            {viewingTest.status !== 'approved' && (
                              <button
                                className={styles.detailsApproveBtn}
                                onClick={() => handleApprove(viewingTest.id)}
                              >
                                <CheckCircleOutlined />
                                <span>Approve</span>
                              </button>
                            )}
                            {viewingTest.status !== 'rejected' && (
                              <Popconfirm
                                title="Reject this test?"
                                onConfirm={() => handleReject(viewingTest.id)}
                                okText="Reject"
                                okButtonProps={{ danger: true }}
                              >
                                <button className={styles.detailsRejectBtn}>
                                  <CloseCircleOutlined />
                                  <span>Reject</span>
                                </button>
                              </Popconfirm>
                            )}
                          </div>
                        )}
                        {viewingTest.isPushed && (
                          <div className={styles.pushedBadge}>
                            <CloudUploadOutlined /> Pushed to Git
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SQL Code Block */}
                    <div className={styles.codeSection}>
                      <div className={styles.codeHeader}>
                        <div className={styles.codeHeaderLeft}>
                          <CodeOutlined />
                          <span>SQL Query</span>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          className={styles.copyBtn}
                          onClick={() => {
                            navigator.clipboard.writeText(viewingTest.sql);
                            message.success('Copied to clipboard');
                          }}
                        >
                          Copy Code
                        </Button>
                      </div>
                      <div className={styles.codeContainer}>
                        <div className={styles.codeWindowBar}>
                          <div className={styles.windowControls}>
                            <span className={styles.controlRed} />
                            <span className={styles.controlYellow} />
                            <span className={styles.controlGreen} />
                          </div>
                          <span className={styles.codeFileName}>{viewingTest.name}.sql</span>
                        </div>
                        <div className={styles.codeContent}>
                          <pre>{viewingTest.sql}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Meta Information - Text-based inline format */}
                    <div className={styles.detailsMeta}>
                      <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>Type:</span>
                        <span className={styles.metaValue}>{viewingTest.type.replace('_', ' ')}</span>
                      </span>
                      <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>Model:</span>
                        <span className={`${styles.metaValue} ${styles.metaValueHighlight}`}>{viewingTest.model}</span>
                      </span>
                      {viewingTest.column && (
                        <span className={styles.metaItem}>
                          <span className={styles.metaLabel}>Column:</span>
                          <span className={`${styles.metaValue} ${styles.metaValueHighlight}`}>{viewingTest.column}</span>
                        </span>
                      )}
                      <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>Source:</span>
                        <span className={styles.metaValue}>{viewingTest.source === 'ai' ? 'AI Generated' : 'dbt'}</span>
                      </span>
                      <span className={styles.metaItem}>
                        <span className={styles.metaLabel}>Created:</span>
                        <span className={`${styles.metaValue} ${styles.metaValueDate}`}>
                          {new Date(viewingTest.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyDetailsState}>
                    <div className={styles.emptyDetailsIcon}>
                      <CodeOutlined />
                    </div>
                    <h3>Select a test to view details</h3>
                    <p>Click on any test from the list to preview the SQL code and metadata</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test Details Modal */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={900}
          className={styles.testDetailsModal}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
            !viewingTest?.isPushed && viewingTest?.status !== 'approved' && (
              <Button
                key="approve"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  if (viewingTest) {
                    handleApprove(viewingTest.id);
                    setIsModalVisible(false);
                  }
                }}
              >
                Approve
              </Button>
            ),
          ]}
        >
          {viewingTest && (
            <div className={styles.modalContent}>
              {/* Compact Meta Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleRow}>
                  <h2 className={styles.modalTestName}>{viewingTest.name}</h2>
                  <span className={`${styles.modalStatus} ${styles[`status${viewingTest.status.charAt(0).toUpperCase() + viewingTest.status.slice(1)}`]}`}>
                    {viewingTest.status}
                  </span>
                </div>
                <p className={styles.modalDescription}>{viewingTest.description}</p>
              </div>

              {/* Inline Meta Info */}
              <div className={styles.metaInline}>
                <span className={styles.metaInlineItem}>
                  <label>Type:</label> <span>{viewingTest.type.replace('_', ' ')}</span>
                </span>
                <span className={styles.metaInlineDivider}>|</span>
                <span className={styles.metaInlineItem}>
                  <label>Model:</label> <code>{viewingTest.model}</code>
                </span>
                <span className={styles.metaInlineDivider}>|</span>
                <span className={styles.metaInlineItem}>
                  <label>Column:</label> <code>{viewingTest.column || '—'}</code>
                </span>
                <span className={styles.metaInlineDivider}>|</span>
                <span className={styles.metaInlineItem}>
                  <label>Source:</label> <span>{viewingTest.source === 'ai' ? 'AI Generated' : 'dbt'}</span>
                </span>
                <span className={styles.metaInlineDivider}>|</span>
                <span className={styles.metaInlineItem}>
                  <label>Created:</label> <span>{new Date(viewingTest.generatedAt).toLocaleDateString()}</span>
                </span>
              </div>

              {/* SQL Code Block */}
              <div className={styles.sqlSection}>
                <div className={styles.sqlHeader}>
                  <div className={styles.sqlHeaderLeft}>
                    <CodeOutlined />
                    <span>SQL Query</span>
                  </div>
                  <Button
                    type="default"
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(viewingTest.sql);
                      message.success('Copied to clipboard');
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
                <div className={styles.sqlContainer}>
                  <div className={styles.sqlWindowHeader}>
                    <div className={styles.windowDots}>
                      <span className={styles.dotRed} />
                      <span className={styles.dotYellow} />
                      <span className={styles.dotGreen} />
                    </div>
                    <span className={styles.fileName}>{viewingTest.name}.sql</span>
                  </div>
                  <div className={styles.sqlCodeWrapper}>
                    <pre className={styles.sqlCodeDisplay}>{viewingTest.sql}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Push Modal */}
        <Modal
          title="Push Tests to Git"
          open={isPushModalVisible}
          onCancel={() => setIsPushModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsPushModalVisible(false)}>Cancel</Button>,
            <Button key="push" type="primary" icon={<PushpinOutlined />} onClick={handleConfirmPush}>
              Confirm & Push
            </Button>,
          ]}
          width={550}
        >
          {testReviewData && (
            <div className={styles.pushModalContent}>
              <div className={styles.pushSummary}>
                <p>You are about to push <strong>{selectedTests.length}</strong> approved test(s) to git.</p>
              </div>
              <Divider />
              <div className={styles.gitMetadata}>
                <h3>Git Target Information</h3>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label={<><BranchesOutlined /> Repository</>}>
                    {testReviewData.gitMetadata?.repository || 'org/analytics-warehouse'}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><BranchesOutlined /> Branch</>}>
                    {testReviewData.gitMetadata?.branch || 'main'}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><FolderOutlined /> Target Path</>}>
                    <code className={styles.gitPath}>
                      {testReviewData.gitMetadata?.targetPath || 'tests/schema/ai_generated/'}
                    </code>
                  </Descriptions.Item>
                  <Descriptions.Item label={<><UserOutlined /> Author</>}>
                    {testReviewData.gitMetadata?.author?.name || 'System User'}
                    {' '}
                    <span className={styles.authorEmail}>
                      ({testReviewData.gitMetadata?.author?.email || 'system@example.com'})
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div className={styles.pushWarning}>
                <p>⚠️ This will create a new commit and push the selected tests to the repository.</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </SidebarLayout>
  );
};

export default TestReview;

