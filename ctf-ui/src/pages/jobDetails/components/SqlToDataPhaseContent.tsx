import React, { useState, useMemo } from 'react';
import { Button, Input, Tree, Table as AntTable } from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Phase } from '../JobDetails.interface';
import { buildTreeData } from '../JobDetails.utils';
import { message } from 'antd';
import styles from '../JobDetails.module.scss';

interface SqlToDataPhaseContentProps {
  phase: Phase;
  onDownloadData?: () => void;
}

/**
 * SQL to Data Phase Content Component
 * Displays content for Data Generation phase including data preview
 */
const SqlToDataPhaseContent: React.FC<SqlToDataPhaseContentProps> = ({
  phase,
  onDownloadData,
}) => {
  const [selectedPreviewTable, setSelectedPreviewTable] = useState<string>('');
  const [globalTableSearch, setGlobalTableSearch] = useState<string>('');

  // Set default preview table when component mounts or phase changes
  React.useEffect(() => {
    if (phase.metadata?.sqlToData?.dataPreview?.length && !selectedPreviewTable) {
      setSelectedPreviewTable(phase.metadata.sqlToData.dataPreview[0].tableName);
    }
  }, [phase.metadata?.sqlToData?.dataPreview, selectedPreviewTable]);

  const handleDownloadDataZip = () => {
    if (onDownloadData) {
      onDownloadData();
    } else {
      // Default behavior
      message.loading('Preparing data download...', 1.5);
      setTimeout(() => {
        message.success(`Download started: ${phase.id}_data.zip`);
      }, 1500);
    }
  };

  // Get current table - must be computed before early return
  const currentTable = phase.metadata?.sqlToData?.dataPreview?.find(
    (t) => t.tableName === selectedPreviewTable
  );

  // Filter rows based on global search (searches across all columns)
  // Hooks must be called unconditionally, so we compute even if no data
  const filteredRows = useMemo(() => {
    if (!currentTable || !globalTableSearch.trim()) {
      return currentTable?.rows || [];
    }
    const searchLower = globalTableSearch.toLowerCase();
    return currentTable.rows.filter((row) =>
      currentTable.columns.some((col) => {
        const cellValue = String(row[col] || '').toLowerCase();
        return cellValue.includes(searchLower);
      })
    );
  }, [currentTable, globalTableSearch]);

  // Build Ant Design Table columns
  // Hooks must be called unconditionally, so we compute even if no data
  const tableColumns = useMemo(
    () =>
      currentTable?.columns.map((col) => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (value: any) =>
          value !== null && value !== undefined ? String(value) : '—',
        width: 150,
      })) || [],
    [currentTable]
  );

  // Early return after all hooks are called
  if (!phase.metadata?.sqlToData?.dataPreview || phase.metadata.sqlToData.dataPreview.length === 0) {
    return (
      <div className={styles.phaseContent}>
        {phase.error && (
          <div className={styles.errorSection}>
            <span className={styles.errorMessage}>{phase.error}</span>
          </div>
        )}
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

      {/* Data Preview Section */}
      <div className={styles.dataPreviewSection}>
        <div className={styles.dataPreviewHeader}>
          <div className={styles.dataPreviewHeaderLeft}>
            <EyeOutlined className="ms-2 fw-bold bg-light bg-opacity-8 rounded p-2" />
            <span className={styles.dataPreviewTitle}>Data Preview</span>
          </div>
          <div className={styles.dataPreviewHeaderRight}>
            {selectedPreviewTable && (
              <Input.Search
                placeholder="Search across all columns..."
                value={globalTableSearch}
                onChange={(e) => setGlobalTableSearch(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
            )}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadDataZip}
              className={styles.downloadZipButton}
            >
              Download Data
            </Button>
          </div>
        </div>

        {/* Divider after header */}
        <div className={styles.dataPreviewDivider} />

        <div className={styles.dataPreviewTwoColumn}>
          {/* Left Column: Schema and Tables Tree */}
          <div className={styles.dataPreviewTreeColumn}>
            <Tree
              treeData={buildTreeData(phase.metadata.sqlToData.dataPreview)}
              selectedKeys={selectedPreviewTable ? [selectedPreviewTable] : []}
              onSelect={(selectedKeys) => {
                if (selectedKeys.length > 0 && typeof selectedKeys[0] === 'string') {
                  setSelectedPreviewTable(selectedKeys[0]);
                  setGlobalTableSearch(''); // Reset search when table changes
                }
              }}
              defaultExpandAll
              showIcon
            />
          </div>

          {/* Divider */}
          <div className={styles.dataPreviewDividerVertical} />

          {/* Right Column: Table Data */}
          <div className={styles.dataPreviewTableColumn}>
            {!currentTable ? (
              <div className={styles.noTableSelected}>
                <TableOutlined style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }} />
                <p>Select a table from the left to view data</p>
              </div>
            ) : (
              <>
                {globalTableSearch && (
                  <div className={styles.filteredRowsInfo}>
                    Showing {filteredRows.length} of {currentTable.rows.length} rows
                  </div>
                )}
                <AntTable
                  columns={tableColumns}
                  dataSource={filteredRows.map((row, index) => ({ ...row, key: index }))}
                  scroll={{ x: 'max-content', y: 400 }}
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} rows`,
                  }}
                  size="small"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlToDataPhaseContent;
