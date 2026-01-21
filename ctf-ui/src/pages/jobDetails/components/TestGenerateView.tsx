import React, { useRef, useEffect } from 'react';
import { Button, Input, Tag } from 'antd';
import type { InputRef } from 'antd';
import {
  ThunderboltOutlined,
  RobotOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { GeneratedTest } from '../../../components/ChatInterface/ChatInterface.interface';
import { ChatContext } from '../../../components/ChatInterface/ChatInterface.interface';
import styles from '../JobDetails.module.scss';

interface TestGenerateViewProps {
  generateInputValue: string;
  onGenerateInputChange: (value: string) => void;
  onGenerate: (prompt: string) => void;
  chatMessages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    generatedTests?: GeneratedTest[];
  }>;
  onAcceptAllTests: (tests: GeneratedTest[], messageId: string) => void;
  onRejectTests: (tests: GeneratedTest[], messageId: string) => void;
  onNavigateToReview: () => void;
  chatContext?: ChatContext;
  testReviewDataTotalTests?: number;
}

/**
 * Test Generate View Component
 * AI-powered test generation interface with chat
 */
const TestGenerateView: React.FC<TestGenerateViewProps> = ({
  generateInputValue,
  onGenerateInputChange,
  onGenerate,
  chatMessages,
  onAcceptAllTests,
  onRejectTests,
  onNavigateToReview,
  chatContext,
  testReviewDataTotalTests,
}) => {
  const generateInputRef = useRef<InputRef>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input when component mounts or becomes active
  useEffect(() => {
    if (generateInputRef.current) {
      setTimeout(() => {
        const input = generateInputRef.current?.input;
        if (input) {
          input.focus();
          input.style.borderColor = '#10b981';
          input.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
          setTimeout(() => {
            if (input) {
              input.style.borderColor = '';
              input.style.boxShadow = '';
            }
          }, 2000);
        }
      }, 100);
    }
  }, []);

  // Scroll chat to bottom when new messages are added
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleGenerateFromInput = (customPrompt?: string) => {
    const prompt = customPrompt || generateInputValue;
    if (!prompt.trim()) {
      return;
    }
    onGenerate(prompt);
    if (!customPrompt) {
      onGenerateInputChange('');
    }
  };

  return (
    <div className={styles.generateTestsTabContent}>
      <div className={styles.generateTestsLayout}>
        {/* Main Content Area */}
        <div className={styles.generateTestsMain}>
          <div className={styles.generateTestsContent}>
            {/* Welcome Message and Quick Start */}
            {chatMessages.length === 0 && (
              <>
                <div className={styles.welcomeBox}>
                  <ThunderboltOutlined className={styles.welcomeIcon} />
                  <div className={styles.welcomeText}>
                    Hi! I'm your test generation assistant. I can help you create comprehensive DBT
                    tests for your models. Tell me what you'd like to test, or try one of the quick
                    actions below.
                  </div>
                </div>

                {/* Quick Start Section */}
                <div className={styles.quickStartSection}>
                  <div className={styles.quickStartHeader}>QUICK START</div>
                  <div className={styles.quickActionsList}>
                    {[
                      {
                        id: 'customers',
                        label: 'Generate tests for customers table',
                        prompt: 'Generate tests for customers table',
                      },
                      {
                        id: 'uniqueness',
                        label: 'Create uniqueness tests',
                        prompt: 'Create uniqueness tests',
                      },
                      {
                        id: 'not-null',
                        label: 'Generate not null tests',
                        prompt: 'Generate not null tests',
                      },
                      {
                        id: 'all-models',
                        label: 'Generate tests for all models',
                        prompt: 'Generate tests for all models',
                      },
                      {
                        id: 'data-quality',
                        label: 'Create data quality tests',
                        prompt: 'Create data quality tests',
                      },
                    ].map((action) => (
                      <button
                        key={action.id}
                        className={styles.quickActionItem}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGenerateFromInput(action.prompt);
                        }}
                      >
                        <span className={styles.quickActionText}>{action.label}</span>
                        <span className={styles.quickActionArrow}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Chat Messages Area */}
            {chatMessages.length > 0 && (
              <div className={styles.chatMessagesArea}>
                <div className={styles.chatMessagesList}>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.chatMessage} ${
                        styles[`chatMessage${msg.role === 'user' ? 'User' : 'Assistant'}`]
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className={styles.messageAvatar}>
                          <RobotOutlined />
                        </div>
                      )}
                      <div className={styles.chatMessageContent}>
                        {msg.role === 'user' ? (
                          <div className={styles.userMessageBubble}>
                            <p>{msg.content}</p>
                          </div>
                        ) : (
                          <div className={styles.assistantMessageBubble}>
                            <p>{msg.content}</p>
                            {msg.generatedTests && msg.generatedTests.length > 0 && (
                              <div className={styles.generatedTestsContainer}>
                                {msg.generatedTests.map((test) => (
                                  <div key={test.id} className={styles.generatedTestCard}>
                                    <div className={styles.testCardHeader}>
                                      <div className={styles.testCardTitle}>
                                        <CodeOutlined className={styles.testIcon} />
                                        <span className={styles.testName}>{test.name}</span>
                                        <Tag className={styles.testTypeTag}>{test.type}</Tag>
                                      </div>
                                    </div>
                                    <div className={styles.testCardBody}>
                                      <div className={styles.testInfo}>
                                        <span className={styles.testInfoLabel}>Model:</span>
                                        <span className={styles.testInfoValue}>{test.model}</span>
                                        {test.column && (
                                          <>
                                            <span className={styles.testInfoLabel}>Column:</span>
                                            <span className={styles.testInfoValue}>
                                              {test.column}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      <div className={styles.testSqlContainer}>
                                        <div className={styles.testSqlLabel}>SQL Query:</div>
                                        <pre className={styles.testSqlCode}>
                                          <code>{test.sql}</code>
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className={styles.testActions}>
                                  <Button
                                    type="primary"
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => onAcceptAllTests(msg.generatedTests!, msg.id)}
                                    className={styles.acceptButton}
                                    size="small"
                                  >
                                    Accept All
                                  </Button>
                                  <Button
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => onRejectTests(msg.generatedTests!, msg.id)}
                                    className={styles.rejectButton}
                                    size="small"
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    icon={<FileTextOutlined />}
                                    onClick={() => {
                                      onAcceptAllTests(msg.generatedTests!, msg.id);
                                      onNavigateToReview();
                                    }}
                                    className={styles.reviewButton}
                                    size="small"
                                  >
                                    Accept & Review
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className={styles.messageAvatar}>
                          <span className={styles.userAvatar}>U</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatMessagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={styles.testInputSection}>
            <div className={styles.inputContainer}>
              <Input
                ref={generateInputRef}
                value={generateInputValue}
                onChange={(e) => onGenerateInputChange(e.target.value)}
                onPressEnter={(e) => {
                  if (e.shiftKey) {
                    return;
                  }
                  e.preventDefault();
                  handleGenerateFromInput();
                }}
                placeholder="Describe the tests you want to generate..."
                className={styles.testInputArea}
                size="large"
              />
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={() => handleGenerateFromInput()}
                disabled={!generateInputValue.trim()}
                className={styles.generateButtonInline}
                size="large"
              >
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.generateTestsSidebar}>
          {/* Available Models */}
          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarCardTitle}>Available Models</h4>
            <div className={styles.modelsList}>
              {chatContext?.availableModels?.map((model, idx) => (
                <div key={idx} className={styles.modelItem}>
                  <span className={styles.modelName}>{model}</span>
                  <span className={styles.modelColumns}>(8 columns)</span>
                </div>
              )) || (
                <>
                  <div className={styles.modelItem}>
                    <span className={styles.modelName}>customers</span>
                    <span className={styles.modelColumns}>(8 columns)</span>
                  </div>
                  <div className={styles.modelItem}>
                    <span className={styles.modelName}>orders</span>
                    <span className={styles.modelColumns}>(8 columns)</span>
                  </div>
                  <div className={styles.modelItem}>
                    <span className={styles.modelName}>products</span>
                    <span className={styles.modelColumns}>(8 columns)</span>
                  </div>
                  <div className={styles.modelItem}>
                    <span className={styles.modelName}>transactions</span>
                    <span className={styles.modelColumns}>(8 columns)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Generation Stats */}
          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarCardTitle}>Generation Stats</h4>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Tests this session:</span>
                <span className={styles.statValue}>{testReviewDataTotalTests || 28}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Success rate:</span>
                <span className={styles.statValueSuccess}>100%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Avg generation time:</span>
                <span className={styles.statValue}>2.3s</span>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className={`${styles.sidebarCard} ${styles.proTipsCard}`}>
            <div className={styles.proTipsHeader}>
              <ThunderboltOutlined className={styles.proTipsIcon} />
              <h4 className={styles.sidebarCardTitle}>Pro Tips</h4>
            </div>
            <ul className={styles.proTipsList}>
              <li>Specify table and column names</li>
              <li>Mention test types explicitly</li>
              <li>Include business logic context</li>
              <li>Ask for multiple tests at once</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestGenerateView;
