import React from 'react';
import { Button, Tag } from 'antd';
import {
  SafetyOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { TestReviewData } from '../../testReview/TestReview.interface';
import styles from '../JobDetails.module.scss';

interface TestTemplatesViewProps {
  testReviewData: TestReviewData | null;
  onTemplateSelect: (templateType: string) => void;
  onViewTests: (templateType: string) => void;
}

/**
 * Test Templates View Component
 * Displays test templates/categories for Test Generation phase
 */
const TestTemplatesView: React.FC<TestTemplatesViewProps> = ({
  testReviewData,
  onTemplateSelect,
  onViewTests,
}) => {
  const allTemplates = [
    {
      id: 'not-null',
      name: 'Not Null Test',
      description:
        "This test validates that specified columns contain no NULL values, which is critical for maintaining data integrity. It's commonly used for primary keys, required fields, and essential business data.",
      icon: 'SafetyOutlined',
      category: 'validation',
      categoryLabel: 'Data Validation',
      testCount: testReviewData
        ? testReviewData.tests.filter((t) => t.type === 'not_null').length
        : 0,
      type: 'not_null',
      difficulty: 'Beginner',
    },
    {
      id: 'unique',
      name: 'Unique Test',
      description:
        'Validates that column values are unique across all rows. Perfect for IDs, emails, and unique identifiers.',
      icon: 'ThunderboltOutlined',
      category: 'validation',
      categoryLabel: 'Data Validation',
      testCount: testReviewData
        ? testReviewData.tests.filter((t) => t.type === 'unique').length
        : 0,
      type: 'unique',
      difficulty: 'Beginner',
    },
    {
      id: 'relationships',
      name: 'Relationships Test',
      description:
        'Checks referential integrity between models. Ensures foreign keys reference valid records.',
      icon: 'LinkOutlined',
      category: 'integrity',
      categoryLabel: 'Data Integrity',
      testCount: testReviewData
        ? testReviewData.tests.filter((t) => t.type === 'relationships').length
        : 0,
      type: 'relationships',
      difficulty: 'Intermediate',
    },
    {
      id: 'accepted-values',
      name: 'Accepted Values Test',
      description:
        'Validates that column values match a predefined set of acceptable values.',
      icon: 'CheckCircleOutlined',
      category: 'validation',
      categoryLabel: 'Data Validation',
      testCount: testReviewData
        ? testReviewData.tests.filter((t) => t.type === 'accepted_values').length
        : 0,
      type: 'accepted_values',
      difficulty: 'Beginner',
    },
  ];

  // Find template with most tests
  const heroTemplate = allTemplates.reduce((prev, current) =>
    current.testCount > prev.testCount ? current : prev
  );
  const otherTemplates = allTemplates.filter((t) => t.id !== heroTemplate.id);

  // Calculate stats for hero template
  const heroTests = testReviewData
    ? testReviewData.tests.filter((t) => t.type === heroTemplate.type)
    : [];
  const modelsCovered = new Set(heroTests.map((t) => t.model)).size;
  const successRate =
    heroTests.length > 0
      ? Math.round(
          (heroTests.filter(
            (t) => t.status === 'approved' || t.executionStatus === 'passed'
          ).length /
            heroTests.length) *
            100
        )
      : 0;

  const HeroIconComponent =
    heroTemplate.icon === 'SafetyOutlined'
      ? SafetyOutlined
      : heroTemplate.icon === 'ThunderboltOutlined'
        ? ThunderboltOutlined
        : heroTemplate.icon === 'LinkOutlined'
          ? LinkOutlined
          : CheckCircleOutlined;
  const heroCategoryColor = heroTemplate.category === 'validation' ? '#8b5cf6' : '#ec4899';

  return (
    <div className={styles.testTemplatesView}>
      {/* Hero Card */}
      <div className={styles.heroTemplateCard}>
        <div className={styles.heroCardContent}>
          <div className={styles.heroCardTop}>
            <div className={styles.heroBadges}>
              <Tag className={styles.mostPopularBadge}>
                <span className={styles.starIcon}>★</span> Most Popular
              </Tag>
              <Tag
                className={styles.categoryBadge}
                style={{
                  backgroundColor:
                    heroTemplate.category === 'validation'
                      ? 'rgba(139, 92, 246, 0.1)'
                      : 'rgba(236, 72, 153, 0.1)',
                  color: heroCategoryColor,
                  border: `1px solid ${heroCategoryColor}20`,
                }}
              >
                {heroTemplate.categoryLabel}
              </Tag>
            </div>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              className={styles.heroViewButton}
              onClick={() => {
                onTemplateSelect(heroTemplate.type);
                onViewTests(heroTemplate.type);
              }}
            >
              View Tests
            </Button>
          </div>
          <div className={styles.heroCardMain}>
            <div className={styles.heroTitleRow}>
              <div className={styles.heroTitleWithIcon}>
                <HeroIconComponent className={styles.heroTitleIcon} />
                <h2 className={styles.heroTitle}>{heroTemplate.name}</h2>
              </div>
            </div>
            <p className={styles.heroDescription}>{heroTemplate.description}</p>
            <div className={styles.heroStats}>
              <div className={styles.heroStatItem}>
                <div className={styles.heroStatValue}>{heroTemplate.testCount}</div>
                <div className={styles.heroStatLabel}>Tests Generated</div>
              </div>
              <div className={styles.heroStatItem}>
                <div className={styles.heroStatValue}>{modelsCovered}</div>
                <div className={styles.heroStatLabel}>Models Covered</div>
              </div>
              <div className={styles.heroStatItem}>
                <div className={styles.heroStatValue}>{successRate}%</div>
                <div className={styles.heroStatLabel}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Templates Section */}
      {otherTemplates.length > 0 && (
        <div className={styles.templatesGrid}>
          {otherTemplates.map((template) => {
            const IconComponent =
              template.icon === 'SafetyOutlined'
                ? SafetyOutlined
                : template.icon === 'ThunderboltOutlined'
                  ? ThunderboltOutlined
                  : template.icon === 'LinkOutlined'
                    ? LinkOutlined
                    : CheckCircleOutlined;
            const categoryColor = template.category === 'validation' ? '#8b5cf6' : '#ec4899';

            return (
              <div key={template.id} className={styles.templateCard}>
                <div className={styles.templateCardHeader}>
                  <div className={styles.templateHeaderLeft}>
                    <div className={styles.templateIcon} style={{ color: categoryColor }}>
                      <IconComponent style={{ fontSize: 20 }} />
                    </div>
                    <h4 className={styles.templateCardTitle}>{template.name}</h4>
                  </div>
                  <Tag
                    className={styles.templateTag}
                    style={{
                      backgroundColor:
                        template.category === 'validation'
                          ? 'rgba(139, 92, 246, 0.1)'
                          : 'rgba(236, 72, 153, 0.1)',
                      color: categoryColor,
                      border: `1px solid ${categoryColor}20`,
                    }}
                  >
                    {template.categoryLabel}
                  </Tag>
                </div>
                <div className={styles.templateCardBody}>
                  <p className={styles.templateCardDescription}>{template.description}</p>
                  <div className={styles.templateCardFooter}>
                    <span className={styles.templateTestCount}>{template.testCount} tests</span>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      className={styles.templateViewButton}
                      onClick={() => {
                        onTemplateSelect(template.type);
                        onViewTests(template.type);
                      }}
                    >
                      View Tests
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestTemplatesView;
