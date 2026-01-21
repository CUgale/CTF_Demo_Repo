import { ChatMessage, ChatContext, GeneratedTest } from './ChatInterface.interface';

/**
 * Mock data service for ChatInterface
 * This file contains all mock data and test generation logic
 * to make API integration easier in the future
 */

const DEFAULT_MODELS = ['customers', 'orders', 'products'];
const DEFAULT_TEST_TYPES = ['not_null', 'unique', 'accepted_values', 'relationships'];

/**
 * Generate SQL query for a test type
 */
export const generateTestSQL = (type: string, model: string, column: string): string => {
  const sqlTemplates: Record<string, string> = {
    not_null: `SELECT *\nFROM {{ ref('${model}') }}\nWHERE ${column} IS NULL`,
    unique: `SELECT ${column}\nFROM {{ ref('${model}') }}\nGROUP BY ${column}\nHAVING COUNT(*) > 1`,
    accepted_values: `SELECT *\nFROM {{ ref('${model}') }}\nWHERE ${column} NOT IN ('value1', 'value2', 'value3')`,
    relationships: `SELECT *\nFROM {{ ref('${model}') }} a\nLEFT JOIN {{ ref('related_model') }} b ON a.${column} = b.id\nWHERE b.id IS NULL`,
  };

  return sqlTemplates[type] || sqlTemplates.not_null;
};

/**
 * Generate mock tests based on user input
 */
export const generateMockTests = (userInput: string, context?: ChatContext): GeneratedTest[] => {
  const models = context?.availableModels || DEFAULT_MODELS;
  const testTypes = context?.testTypes || DEFAULT_TEST_TYPES;
  
  const tests: GeneratedTest[] = [];
  const selectedModel = models[Math.floor(Math.random() * models.length)];
  const selectedType = testTypes[Math.floor(Math.random() * testTypes.length)];
  const column = selectedType === 'relationships' ? 'id' : 'customer_id';

  // Generate 2 tests
  for (let i = 0; i < 2; i++) {
    const testId = `test_${selectedType}_${selectedModel}_${Date.now()}_${i}`;
    
    tests.push({
      id: testId,
      name: testId,
      type: selectedType,
      description: `Ensures ${selectedType.replace('_', ' ')} constraint for ${selectedModel}`,
      column: column,
      model: selectedModel,
      sql: generateTestSQL(selectedType, selectedModel, column),
    });
  }

  return tests;
};

/**
 * Get welcome message based on context
 */
export const getWelcomeMessage = (context?: ChatContext): string => {
  if (context?.phaseName === 'Test Generation') {
    return `Hi! I'm your AI test generation assistant. I can help you generate DBT tests for your models. What type of tests would you like to create?`;
  }
  
  if (context?.phaseName === 'Tests Execution') {
    const { passedTests = 0, failedTests = 0, totalTests = 0 } = context;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    if (failedTests > 0) {
      return `I see ${failedTests} test(s) failed out of ${totalTests} total. I can help you:\n\n• Generate tests to cover the failed scenarios\n• Create additional validation tests\n• Improve test coverage for your models\n\nWhat would you like to focus on?`;
    }
    
    if (totalTests > 0) {
      return `Great! All ${passedTests} test(s) passed (${passRate}% pass rate). I can help you:\n\n• Generate additional tests to improve coverage\n• Create tests for edge cases\n• Add data quality checks\n\nWhat would you like to test next?`;
    }
    
    return `I can help you generate additional tests based on your execution results. What would you like to test?`;
  }
  
  return `Hi! I'm your AI assistant for test generation. I can help you create DBT tests for your models. How can I assist you today?`;
};

/**
 * Get contextual suggestions based on context
 */
export const getContextualSuggestions = (context?: ChatContext): string[] => {
  if (context?.phaseName === 'Tests Execution') {
    const { failedTests = 0, testingMode } = context;
    const suggestions: string[] = [];
    
    if (testingMode === 'happy_path') {
      suggestions.push(
        'Generate validation tests for positive scenarios',
        'Create tests for expected data flows'
      );
    } else if (testingMode === 'negative') {
      suggestions.push(
        'Generate error handling tests',
        'Create tests for invalid inputs'
      );
    }
    
    if (failedTests > 0) {
      suggestions.push(
        `Generate tests to fix ${failedTests} failed test(s)`,
        'Create alternative validation tests',
        'Generate tests for edge cases'
      );
    } else {
      suggestions.push(
        'Generate additional test coverage',
        'Create tests for missing scenarios',
        'Add data quality validation tests'
      );
    }
    
    if (context?.availableModels && context.availableModels.length > 0) {
      suggestions.push(`Generate tests for ${context.availableModels[0]}`);
    }
    
    return suggestions.slice(0, 4);
  }
  
  // Default suggestions for other phases
  const baseSuggestions = [
    'Generate tests for all models',
    'Create data quality tests',
    'Generate referential integrity tests',
  ];

  if (context?.availableModels && context.availableModels.length > 0) {
    return [
      `Generate tests for ${context.availableModels[0]}`,
      'Create uniqueness tests',
      'Generate not null tests',
      ...baseSuggestions,
    ];
  }

  return baseSuggestions;
};

/**
 * Generate AI response based on user input
 */
export const generateAIResponse = (userInput: string, context?: ChatContext): ChatMessage => {
  const lowerInput = userInput.toLowerCase();
  const isTestGenerationRequest = 
    lowerInput.includes('generate') ||
    lowerInput.includes('create') ||
    lowerInput.includes('make') ||
    lowerInput.includes('add');

  if (isTestGenerationRequest) {
    const tests = generateMockTests(userInput, context);
    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `I've generated ${tests.length} test(s) based on your request:\n\n${tests
        .map((t) => `• ${t.name} (${t.type}) - ${t.description}`)
        .join('\n')}\n\nThese tests have been added to your test review queue.`,
      timestamp: new Date(),
      generatedTests: tests,
      suggestions: ['Generate more tests', 'Create data quality tests', 'Add referential integrity tests'],
    };
  }

  // Default response
  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: `I understand you'd like to ${userInput}. I can help you generate DBT tests. Try asking me to:\n\n• Generate tests for specific models\n• Create data quality tests\n• Generate referential integrity tests\n• Add custom test types`,
    timestamp: new Date(),
    suggestions: getContextualSuggestions(context),
  };
};

/**
 * Create welcome message with suggestions
 */
export const createWelcomeMessage = (context?: ChatContext): ChatMessage => {
  return {
    id: 'welcome',
    role: 'assistant',
    content: getWelcomeMessage(context),
    timestamp: new Date(),
    suggestions: getContextualSuggestions(context),
  };
};
