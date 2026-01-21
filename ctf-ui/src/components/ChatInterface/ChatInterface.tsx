import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Input, message, Tooltip } from 'antd';
import {
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  MinusOutlined,
  ExpandOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { ChatMessage, ChatContext, GeneratedTest } from './ChatInterface.interface';
import { createWelcomeMessage, generateAIResponse } from './ChatInterface.mockdata';
import styles from './ChatInterface.module.scss';

interface ChatInterfaceProps {
  context?: ChatContext;
  onGenerateTests?: (tests: GeneratedTest[]) => void;
  inline?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  context, 
  onGenerateTests, 
  inline = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 420, height: 600 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      try {
        const welcomeMessage = createWelcomeMessage(context);
        setMessages([welcomeMessage]);
      } catch (error) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: 'Hi! I\'m your AI test generation assistant. How can I help you?',
          timestamp: new Date(),
        }]);
      }
    }
  }, [isOpen, context]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Handle window resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current || !chatWindowRef.current) return;

      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      const newWidth = Math.max(320, Math.min(800, resizeRef.current.startWidth + deltaX));
      const newHeight = Math.max(400, Math.min(window.innerHeight - 100, resizeRef.current.startHeight + deltaY));

      setWindowSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!chatWindowRef.current) return;

    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height,
    };
  }, [windowSize]);

  const processAIResponse = useCallback((response: ChatMessage) => {
    setMessages((prev) => [...prev, response]);
    setIsTyping(false);

    if (response.generatedTests && response.generatedTests.length > 0 && onGenerateTests) {
      try {
        onGenerateTests(response.generatedTests);
        message.success(`${response.generatedTests.length} test(s) generated!`);
      } catch (error) {
        message.error('Failed to process generated tests');
      }
    }
  }, [onGenerateTests]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with delay
    try {
      setTimeout(() => {
        const response = generateAIResponse(trimmedInput, context);
        processAIResponse(response);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      message.error('Failed to generate response. Please try again.');
    }
  }, [inputValue, isTyping, context, processAIResponse]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputValue(suggestion);
    
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: suggestion,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        try {
          const response = generateAIResponse(suggestion, context);
          processAIResponse(response);
        } catch (error) {
          setIsTyping(false);
          message.error('Failed to generate response. Please try again.');
        }
      }, 1500);
    }, 100);
  }, [context, processAIResponse]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setIsMinimized(false);
      return !prev;
    });
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return (
    <>
      {/* Chat Button - Inline or Floating */}
      {inline ? (
        <button 
          className={`${styles.chatButtonInline} ${isOpen ? styles.chatButtonActive : ''}`}
          onClick={toggleChat}
          aria-label="Open AI test generation assistant"
        >
          <WechatOutlined className={styles.chatButtonInlineIcon} />
          <span className={styles.chatButtonInlineText}>Generate Tests</span>
          <span className={styles.chatButtonBadgeInline}>AI</span>
        </button>
      ) : (
        <button 
          className={`${styles.chatButton} ${isOpen ? styles.chatButtonActive : ''}`}
          onClick={toggleChat}
          aria-label="Open AI test generation assistant"
        >
          <WechatOutlined className={styles.chatButtonIcon} />
          <span className={styles.chatButtonBadge}>AI</span>
          <div className={styles.chatButtonRipple}></div>
          <div className={styles.chatButtonRipple2}></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className={`${styles.chatWindow} ${isMinimized ? styles.chatWindowMinimized : ''}`}
          style={{ 
            width: `${windowSize.width}px`, 
            height: isMinimized ? 'auto' : `${windowSize.height}px` 
          }}
        >
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.chatHeaderIconWrapper}>
                <WechatOutlined className={styles.chatHeaderIcon} />
              </div>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatHeaderTitle}>
                  <span>AI Test Assistant</span>
                  <span className={styles.chatHeaderBadge}>AI</span>
                </div>
                <div className={styles.chatHeaderSubtitle}>
                  {context?.phaseName || 'Ready to help'}
                </div>
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              <Tooltip title={isMinimized ? "Restore" : "Minimize"}>
                <Button
                  type="text"
                  icon={isMinimized ? <ExpandOutlined /> : <MinusOutlined />}
                  onClick={toggleMinimize}
                  className={styles.chatHeaderButton}
                  aria-label={isMinimized ? "Restore chat" : "Minimize chat"}
                />
              </Tooltip>
              <Tooltip title="Close">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={closeChat}
                  className={styles.chatCloseButton}
                  aria-label="Close chat"
                />
              </Tooltip>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <>
              <div className={styles.messagesContainer}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${styles[`message${msg.role === 'user' ? 'User' : 'Assistant'}`]}`}
                  >
                    <div className={styles.messageAvatar}>
                      {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>{msg.content}</div>
                      {msg.generatedTests && msg.generatedTests.length > 0 && (
                        <div className={styles.generatedTestsPreview}>
                          <div className={styles.generatedTestsHeader}>
                            <ThunderboltOutlined />
                            <span>Generated Tests</span>
                          </div>
                          {msg.generatedTests.map((test) => (
                            <div key={test.id} className={styles.generatedTestItem}>
                              <CheckCircleOutlined className={styles.testIcon} />
                              <div className={styles.testInfo}>
                                <div className={styles.testName}>{test.name}</div>
                                <div className={styles.testMeta}>
                                  {test.type} • {test.model}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className={styles.suggestions}>
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className={styles.suggestionButton}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className={styles.messageTime}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className={`${styles.message} ${styles.messageAssistant}`}>
                    <div className={styles.messageAvatar}>
                      <RobotOutlined />
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={styles.inputArea}>
                <Input.TextArea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me to generate tests or specify test types..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className={styles.chatInput}
                  disabled={isTyping}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className={styles.sendButton}
                >
                  Send
                </Button>
              </div>
            </>
          )}

          {/* Resize Handle */}
          {!isMinimized && (
            <div 
              className={styles.resizeHandle}
              onMouseDown={handleResizeStart}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ChatInterface;
