/**
 * ChatInterface Type Definitions
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  generatedTests?: GeneratedTest[];
}

export interface GeneratedTest {
  id: string;
  name: string;
  type: string;
  description: string;
  column?: string;
  model: string;
  sql: string;
}

export interface ChatContext {
  jobId?: string;
  jobName?: string;
  phaseName?: string;
  availableModels?: string[];
  currentTests?: number;
  testTypes?: string[];
  // Test execution specific context
  passedTests?: number;
  failedTests?: number;
  totalTests?: number;
  testingMode?: 'all' | 'happy_path' | 'negative';
}
