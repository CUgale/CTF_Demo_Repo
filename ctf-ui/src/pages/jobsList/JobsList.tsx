import React, { useState } from 'react';
import { Button, Table, Tag, Select, Tooltip, Progress } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  CodeOutlined,
  UserOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import SidebarLayout from '../../layouts/Layout';
import { mockJobs } from './JobsList.mockdata';
import { Job, JobStatus } from './JobsList.interface';
import styles from './JobsList.module.scss';

type ViewMode = 'table';

const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [jobs] = useState<Job[]>(mockJobs);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode] = useState<ViewMode>('table');


  const getStatusColor = (status: JobStatus): string => {
    const colorMap: Record<JobStatus, string> = {
      completed: 'success',
      running: 'processing',
      failed: 'error',
      pending: 'default',
      cancelled: 'warning',
    };
    return colorMap[status] || 'default';
  };

  const getStatusIcon = (status: JobStatus) => {
    const iconMap: Record<JobStatus, React.ReactNode> = {
      completed: <CheckCircleOutlined />,
      running: <SyncOutlined spin />,
      failed: <CloseCircleOutlined />,
      pending: <PauseCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
    };
    return iconMap[status] || <ClockCircleOutlined />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getShortPhaseName = (phaseName: string): string => {
    const phaseMap: Record<string, string> = {
      'Code Sync': 'Sync',
      'dbt to SQL': 'Compile',
      'SQL to Tests Generation (AI)': 'AI Gen',
      'SQL to Data': 'Data Gen',
      'Load Data': 'Load',
      'Test Execution': 'Execute',
    };
    return phaseMap[phaseName] || phaseName;
  };

  const getJobProgress = (job: Job): number => {
    if (!job.phaseStatus || job.phaseStatus.length === 0) return 0;
    const completed = job.phaseStatus.filter(p => p.status === 'completed').length;
    return Math.round((completed / job.phaseStatus.length) * 100);
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds === 0) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }
    return `${secs}s`;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = !searchQuery || 
      job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: ColumnsType<Job> = [
    {
      title: 'Created By',
      key: 'createdBy',
      width: 160,
      render: (_: any, record: Job) => {
        if (!record.createdBy) {
          return <span style={{ color: '#94a3b8' }}>—</span>;
        }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserOutlined className='fw-600 text-muted'/>
              <span className='fw-600'>
                {record.createdBy.name}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '18px' }}>
              {formatDate(record.createdAt)}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Job',
      dataIndex: 'jobName',
      key: 'jobName',
      width: 200,
      render: (text: string, record: Job) => (
        <div className={styles.jobNameCell}>
          <div className={styles.jobName}>{text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BranchesOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>{record.branch || 'main'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CodeOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {record.sourceType.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Phases',
      key: 'phaseStatus',
      width: 250,
      render: (_: any, record: Job) => {
        if (!record.phaseStatus || record.phaseStatus.length === 0) {
          return <span style={{ color: '#94a3b8' }}>—</span>;
        }
        
        const completedPhases = record.phaseStatus.filter(p => p.status === 'completed').length;
        const totalPhases = record.phaseStatus.length;
        const progress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {record.phaseStatus.map((phase, idx) => (
                <Tooltip key={idx} title={`${phase.phase}: ${phase.status}`}>
                  <div 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      ...(phase.status === 'completed' && {
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid #10b981',
                      }),
                      ...(phase.status === 'running' && {
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                      }),
                      ...(phase.status === 'failed' && {
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                      }),
                      ...(phase.status === 'pending' && {
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        border: '1px solid #f59e0b',
                      }),
                    }}
                  >
                    {phase.status === 'completed' && <CheckCircleOutlined />}
                    {phase.status === 'running' && <SyncOutlined spin />}
                    {phase.status === 'failed' && <CloseCircleOutlined />}
                    {phase.status === 'pending' && <PauseCircleOutlined />}
                  </div>
                </Tooltip>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {completedPhases}/{totalPhases} phases
              </span>
              {record.status === 'running' && (
                <Progress 
                  percent={progress} 
                  size="small"
                  strokeColor="#10b981"
                  trailColor="#e5e7eb"
                  format={(p) => `${p}%`}
                  style={{ flex: 1, maxWidth: '120px' }}
                />
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: JobStatus) => (
        <Tag color={getStatusColor(status)} className={styles.statusTag}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Time Taken',
      key: 'duration',
      width: 100,
      render: (_: any, record: Job) => (
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          {formatDuration(record.duration)}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 130,
      align: 'right',
      render: (_: any, record: Job) => (
        <Button
          type="default"
          icon={<EyeOutlined className='fw-700'/>}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/${record.id}`);
          }}
          size="small"
          className={styles.viewDetailsButton}
        >
          View
        </Button>
      ),
    },
  ];


  return (
    <SidebarLayout>
      <div>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1>Jobs</h1>
            <p>View and manage all job executions</p>
          </div>
          <div className={styles.headerActions}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/create-job')}
              className={styles.createJobBtn}
            >
              Create Job
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <SearchOutlined className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search jobs by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className={styles.filterSelect}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'running', label: 'Running' },
              { value: 'failed', label: 'Failed' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </div>

        {/* Jobs Content */}
        {filteredJobs.length > 0 ? (
          <div className={styles.jobsTableCard}>
            <Table
              columns={columns}
              dataSource={filteredJobs}
              rowKey="id"
              onRow={(record) => ({
                onClick: () => navigate(`/jobs/${record.id}`),
                style: { cursor: 'pointer' },
              })}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `${total} jobs`,
              }}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FolderOutlined className={styles.emptyIcon} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default JobsList;
