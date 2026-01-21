import React from 'react';
import { Button, Input, Select, Tag } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { getTemplateTypeDisplayName } from '../JobDetails.utils';
import testReviewStyles from '../../testReview/TestReview.module.scss';

interface TestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchExpanded: boolean;
  onSearchExpand: (expanded: boolean) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  selectedTemplateFilter: string | null;
  onTemplateFilterClear: () => void;
  filteredTestsCount: number;
}

/**
 * Test Filters Component
 * Handles search and status filtering for tests
 */
const TestFilters: React.FC<TestFiltersProps> = ({
  searchQuery,
  onSearchChange,
  isSearchExpanded,
  onSearchExpand,
  statusFilter,
  onStatusFilterChange,
  selectedTemplateFilter,
  onTemplateFilterClear,
  filteredTestsCount,
}) => {
  return (
    <div className={testReviewStyles.testListHeader}>
      <div className={testReviewStyles.testListHeaderTop}>
        <div className={testReviewStyles.testListTitleGroup}>
          <span className={testReviewStyles.testListTitle}>Tests</span>
          <span className={testReviewStyles.testListCount}>{filteredTestsCount}</span>
          {selectedTemplateFilter && (
            <Tag
              color="purple"
              closable
              onClose={onTemplateFilterClear}
              style={{ marginLeft: 8 }}
            >
              Filtered by: {getTemplateTypeDisplayName(selectedTemplateFilter)}
            </Tag>
          )}
        </div>
        <div className={testReviewStyles.testListActions}>
          {/* Search Icon/Input */}
          {!isSearchExpanded ? (
            <Button
              icon={<SearchOutlined />}
              onClick={() => onSearchExpand(true)}
              title="Search tests"
              className={testReviewStyles.searchIconBtn}
            />
          ) : (
            <Input.Search
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (!e.target.value) {
                  onSearchExpand(false);
                }
              }}
              onBlur={() => {
                if (!searchQuery) {
                  onSearchExpand(false);
                }
              }}
              allowClear
              autoFocus
              className={testReviewStyles.searchInputWrapper}
              style={{ width: 200 }}
            />
          )}
          {/* Filter Select */}
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            className={testReviewStyles.statusFilterSelect}
            size="small"
            optionRender={(option) => option.label}
            options={[
              {
                value: 'all',
                label: (
                  <span className={testReviewStyles.filterOption}>
                    <AppstoreOutlined className={testReviewStyles.filterOptionIcon} />
                    <span>All Status</span>
                  </span>
                ),
              },
              {
                value: 'pending',
                label: (
                  <span className={testReviewStyles.filterOption}>
                    <ClockCircleOutlined className={testReviewStyles.filterOptionIcon} />
                    <span>Pending</span>
                  </span>
                ),
              },
              {
                value: 'approved',
                label: (
                  <span className={testReviewStyles.filterOption}>
                    <CheckCircleOutlined className={testReviewStyles.filterOptionIcon} />
                    <span>Approved</span>
                  </span>
                ),
              },
              {
                value: 'rejected',
                label: (
                  <span className={testReviewStyles.filterOption}>
                    <CloseCircleOutlined className={testReviewStyles.filterOptionIcon} />
                    <span>Rejected</span>
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default TestFilters;
