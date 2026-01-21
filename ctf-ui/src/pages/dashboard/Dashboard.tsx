import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Flex } from 'antd';
import {
  PlusOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FolderOutlined,
  MoreOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Chart from 'react-apexcharts';
import SidebarLayout from '../../layouts/Layout';
import { useProject } from '../../context/ProjectContext';
import {
  getProjectStatCards,
  testResultsOverTimeData,
  testStatusByModelData,
  testTypeDistributionData,
  recentExecutionsData,
  automatedReportsData,
  mockDbtProjectStatsMap,
} from './Dashboard.mockdata';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProject } = useProject();

  const projectStats = selectedProject
    ? (mockDbtProjectStatsMap[selectedProject.id] || mockDbtProjectStatsMap['project-1'])
    : mockDbtProjectStatsMap['project-1'];

  const statCardsData = selectedProject
    ? getProjectStatCards(selectedProject.id)
    : getProjectStatCards('project-1');

  const getTimeAgo = (dateString: string): string => {
    if (!dateString) return 'Never';
    try {
      const now = new Date();
      const past = new Date(dateString);
      if (isNaN(past.getTime())) return 'Invalid date';
      const diffMs = now.getTime() - past.getTime();
      if (diffMs < 0) return 'Just now';
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return 'Just now';
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeUntil = (dateString: string): string => {
    if (!dateString) return 'Not scheduled';
    try {
      const now = new Date();
      const future = new Date(dateString);
      if (isNaN(future.getTime())) return 'Invalid date';
      const diffMs = future.getTime() - now.getTime();
      if (diffMs < 0) return 'Overdue';
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays > 0) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      if (diffHours > 0) return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      return 'Soon';
    } catch {
      return 'Invalid date';
    }
  };

  const getStatIcon = (label: string, colorClass: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'TOTAL TESTS': <BarChartOutlined />,
      'PASS RATE': <CheckCircleOutlined />,
      'AVG DURATION': <ClockCircleOutlined />,
      'RUNS TODAY': <PlayCircleOutlined />,
    };
    return (
      <div className={`${styles.statIconWrapper} ${styles[colorClass]}`}>
        {iconMap[label] || <BarChartOutlined />}
      </div>
    );
  };

  const getStatColor = (index: number) => {
    const colors = ['success', 'info', 'warning', 'purple'];
    return colors[index % colors.length];
  };

  // Chart configurations
  const chartHeight = 280;

  const lineChartOptions = {
    chart: { type: 'area' as const, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth' as const, width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: testResultsOverTimeData.map(item => item.date),
      labels: { style: { colors: '#6b7280', fontSize: '10px' } },
    },
    yaxis: { labels: { style: { colors: '#6b7280', fontSize: '10px' } } },
    legend: { position: 'top' as const, horizontalAlign: 'right' as const, fontSize: '11px' },
    colors: ['#10b981', '#ef4444'],
    grid: { borderColor: '#e5e7eb', strokeDashArray: 3 },
    tooltip: { theme: 'light' as const },
  };

  const lineChartSeries = [
    { name: 'Passed', data: testResultsOverTimeData.map(item => item.passed) },
    { name: 'Failed', data: testResultsOverTimeData.map(item => item.failed) },
  ];

  const barChartOptions = {
    chart: { type: 'bar' as const, toolbar: { show: false }, stacked: true },
    plotOptions: { bar: { horizontal: false, borderRadius: 3, columnWidth: '50%' } },
    xaxis: {
      categories: testStatusByModelData.map(item => item.model),
      labels: { style: { colors: '#6b7280', fontSize: '10px' } },
    },
    yaxis: { labels: { style: { colors: '#6b7280', fontSize: '10px' } } },
    legend: { position: 'top' as const, horizontalAlign: 'right' as const, fontSize: '11px' },
    colors: ['#10b981', '#ef4444'],
    grid: { borderColor: '#e5e7eb', strokeDashArray: 3 },
    tooltip: { theme: 'light' as const },
  };

  const barChartSeries = [
    { name: 'Passed', data: testStatusByModelData.map(item => item.passed) },
    { name: 'Failed', data: testStatusByModelData.map(item => item.failed) },
  ];

  const donutChartOptions = {
    chart: { type: 'donut' as const },
    labels: testTypeDistributionData.map(item => item.name),
    colors: testTypeDistributionData.map(item => item.color),
    legend: { position: 'bottom' as const, fontSize: '11px' },
    plotOptions: { pie: { donut: { size: '70%' } } },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(0)}%`, style: { fontSize: '10px' } },
  };

  const donutChartSeries = testTypeDistributionData.map(item => item.value);

  return (
    <SidebarLayout>
      <div>
        {/* Page Header */}
        <Flex justify="space-between" align="center" className="mb-4">
          <div>
            <span className="mb-0 fs-5 fw-bold p-0">Dashboard</span>
            <p className={styles.titleDescription}>Monitor and analyze your DBT test execution metrics</p>
          </div>
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/create-job')}
              className={styles.createJobBtn}
            >
              Create Job
            </Button>
          </div>
        </Flex>

        {/* Project Overview Card */}
        {selectedProject && (
          <div className={`${styles.projectCard} mb-4`}>
            <Flex justify="space-between" align="center" gap={24} wrap="wrap">
              <Flex align="center" gap={16} className="flex-grow-1">
                <div className={styles.projectIcon}>
                  <AppstoreOutlined />
                </div>
                <div>
                  <div className={styles.projectLabel}>SELECTED PROJECT</div>
                  <div className={styles.projectName}>{selectedProject.name}</div>
                  <Flex align="center" gap={14} className={styles.metaInfo}>
                    <Flex align="center" gap={4}>
                      <FolderOutlined className={styles.icon} />
                      <span>{selectedProject.repository}</span>
                    </Flex>
                  </Flex>
                </div>
              </Flex>

              <Flex gap={28}>
                <div className="text-center">
                  <div className={styles.metricLabel}>Models</div>
                  <div className={styles.metricValue}>{projectStats.totalModels}</div>
                  <div className={styles.metricSubtext}>dbt models</div>
                </div>
                <div className="text-center">
                  <div className={styles.metricLabel}>Coverage</div>
                  <div className={`${styles.metricValue} ${styles.success}`}>{projectStats.testCoverage}%</div>
                  <div className={styles.metricSubtext}>test coverage</div>
                </div>
                <div className="text-center">
                  <div className={styles.metricLabel}>Failed</div>
                  <div className={`${styles.metricValue} ${styles.danger}`}>{projectStats.failedTests}</div>
                  <div className={styles.metricSubtext}>tests failed</div>
                </div>
              </Flex>

              <div className={styles.projectLastRun}>
                <div className={styles.lastRunLabel}>Last Run</div>
                <div className={styles.lastRunTime}>{getTimeAgo(projectStats.lastRunAt)}</div>
                {projectStats.nextRunAt && (
                  <div className={styles.nextRunTime}>{getTimeUntil(projectStats.nextRunAt)}</div>
                )}
              </div>
            </Flex>
          </div>
        )}

        {/* Stats Cards Grid */}
        <div className="row g-3 mb-4">
          {statCardsData.map((stat, index) => {
            const colorClass = getStatColor(index);
            return (
              <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                <div className={styles.statCard}>
                  <Flex justify="space-between" align="flex-start" className="mb-3">
                    {getStatIcon(stat.label, colorClass)}
                    <div className={`${styles.statTrend} ${styles[stat.trend]}`}>
                      {stat.trend === 'up' ? <ArrowUpOutlined /> : stat.trend === 'down' ? <ArrowDownOutlined /> : null}
                      {stat.change}
                    </div>
                  </Flex>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statSubtext}>{stat.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="row g-3 mb-3">
          <div className="col-lg-6 col-md-12">
            <div className={styles.chartCard}>
              <Flex justify="space-between" align="center" className={styles.chartCardHeader}>
                <h3 className={`${styles.chartTitle} mb-0`}>
                  <BarChartOutlined className={styles.chartIcon} />
                  Test Results Over Time
                </h3>
                <Dropdown menu={{ items: [{ key: '1', label: '7 days' }, { key: '2', label: '30 days' }] }}>
                  <Button type="text" icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </Flex>
              <div className={styles.chartBody}>
                <Chart options={lineChartOptions} series={lineChartSeries} type="area" height={chartHeight} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className={styles.chartCard}>
              <Flex justify="space-between" align="center" className={styles.chartCardHeader}>
                <h3 className={`${styles.chartTitle} mb-0`}>
                  <BarChartOutlined className={styles.chartIcon} />
                  Test Status by Model
                </h3>
                <Dropdown menu={{ items: [{ key: '1', label: 'All models' }, { key: '2', label: 'Top 10' }] }}>
                  <Button type="text" icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </Flex>
              <div className={styles.chartBody}>
                <Chart options={barChartOptions} series={barChartSeries} type="bar" height={chartHeight} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="row g-3">
          <div className="col-lg-6 col-md-12">
            <div className={styles.chartCard}>
              <Flex justify="space-between" align="center" className={styles.chartCardHeader}>
                <h3 className={`${styles.chartTitle} mb-0`}>
                  <BarChartOutlined className={styles.chartIcon} />
                  Test Type Distribution
                </h3>
              </Flex>
              <div className={styles.chartBody}>
                <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={chartHeight} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className={styles.chartCard}>
              <Flex justify="space-between" align="center" className={styles.chartCardHeader}>
                <h3 className={`${styles.chartTitle} mb-0`}>
                  <FileTextOutlined className={styles.chartIcon} />
                  Recent Executions
                </h3>
                <Button type="link" onClick={() => navigate('/jobs')} size="small">View All</Button>
              </Flex>
              <div className={`${styles.chartBody} ${styles.executionsList}`}>
                {recentExecutionsData.map((execution) => (
                  <Flex key={execution.id} align="center" gap={12} className={styles.executionItem}>
                    <span className={styles.executionId}>{execution.id}</span>
                    <span className={`${styles.executionModel} flex-grow-1`}>{execution.model}</span>
                    <span className={`${styles.executionStatus} ${styles[execution.status]}`}>
                      {execution.status}
                    </span>
                    <span className={styles.executionTime}>{execution.time}</span>
                  </Flex>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        {/* <div className={styles.chartCard} style={{ marginTop: 16 }}>
          <div className={styles.chartCardHeader}>
            <h3 className={styles.chartTitle}>
              <FileTextOutlined className={styles.chartIcon} />
              Automated Reports
            </h3>
            <Button type="primary" icon={<PlusOutlined />} size="small">Generate Report</Button>
          </div>
          <div className={`${styles.chartBody} ${styles.reportsList}`}>
            {automatedReportsData.map((report) => (
              <div key={report.id} className={styles.reportItem}>
                <div className={styles.reportInfo}>
                  <h4 className={styles.reportTitle}>{report.title}</h4>
                  <p className={styles.reportDescription}>{report.description}</p>
                  <span className={styles.reportDate}>Last generated: {report.lastGenerated}</span>
                </div>
                <div className={styles.reportActions}>
                  <Button type="default" icon={<EyeOutlined />} size="small">View</Button>
                  <Button type="primary" icon={<DownloadOutlined />} size="small">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
