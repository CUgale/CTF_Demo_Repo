/**
 * Mock Data Service for Demo Mode
 * This file contains all mock API responses for demo purposes
 */

import { User, LoginResponse } from '../pages/login/Login.interface';
import { Project } from '../layouts/Layout.interface';
import { Commit, CreateJobResponse } from '../pages/createJob/CreateJob.interface';

// Mock User Data
const mockUser: User = {
  user: {
    id: 1,
    username: 'demo_user',
    email: 'demo@example.com',
    roles: ['user', 'admin'],
    updated_at: new Date().toISOString(),
  },
};

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'dbt_analytics_warehouse',
    repository: 'https://github.com/example/dbt_analytics_warehouse',
    description: 'Main analytics warehouse project with customer and order models',
    branch: 'main',
    isActive: true,
  },
  {
    id: 'project-2',
    name: 'dbt_marketing_analytics',
    repository: 'https://github.com/example/dbt_marketing_analytics',
    description: 'Marketing analytics project with campaign and conversion models',
    branch: 'main',
    isActive: false,
  },
  {
    id: 'project-3',
    name: 'dbt_finance_reporting',
    repository: 'https://github.com/example/dbt_finance_reporting',
    description: 'Finance reporting project with revenue and expense models',
    branch: 'main',
    isActive: false,
  },
];

// Mock Commits Data
export const mockCommits: Commit[] = [
  {
    id: 'commit-1',
    sha: 'a1b2c3d4e5f6789012345678901234567890abcd',
    message: 'Add customer analytics ETL pipeline',
    author: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    branch: 'main',
  },
  {
    id: 'commit-2',
    sha: 'b2c3d4e5f6a789012345678901234567890abcde',
    message: 'Update order analytics models',
    author: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    branch: 'main',
  },
  {
    id: 'commit-3',
    sha: 'c3d4e5f6a7b89012345678901234567890abcdef',
    message: 'Add product catalog models',
    author: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    branch: 'main',
  },
  {
    id: 'commit-4',
    sha: 'd4e5f6a7b8c9012345678901234567890abcdef1',
    message: 'Fix data quality issues in customer dimension',
    author: {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    branch: 'main',
  },
  {
    id: 'commit-5',
    sha: 'e5f6a7b8c9d012345678901234567890abcdef12',
    message: 'Add new test cases for order validation',
    author: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    branch: 'main',
  },
  {
    id: 'commit-6',
    sha: 'f6a7b8c9d0e12345678901234567890abcdef123',
    message: 'Refactor SQL models for better performance',
    author: {
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
    },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    branch: 'main',
  },
];

// Helper function to generate a job ID
const generateJobId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `job-${timestamp}-${random}`;
};

// Mock API Response Functions
export const mockApiResponses = {
  /**
   * Mock login response
   * Accepts any username/password for demo purposes
   */
  login: (username: string, password: string): LoginResponse => {
    // Simulate a small delay
    return [mockUser];
  },

  /**
   * Mock get current user response
   */
  getCurrentUser: (): User => {
    return mockUser;
  },

  /**
   * Mock get projects response
   */
  getProjects: (): Project[] => {
    return mockProjects;
  },

  /**
   * Mock get active project response
   */
  getActiveProject: (): Project => {
    const activeProject = mockProjects.find(p => p.isActive) || mockProjects[0];
    return { ...activeProject, isActive: true };
  },

  /**
   * Mock set active project response
   */
  setActiveProject: (projectId: string): { success: boolean } => {
    // Update mock projects to set the selected one as active
    mockProjects.forEach(p => {
      p.isActive = p.id === projectId;
    });
    return { success: true };
  },

  /**
   * Mock get commits response
   */
  getCommits: (): Commit[] => {
    return mockCommits;
  },

  /**
   * Mock create job response
   */
  createJob: (commitId: string): CreateJobResponse => {
    const commit = mockCommits.find(c => c.sha === commitId || c.id === commitId);
    const jobId = generateJobId();
    
    return {
      job_id: jobId,
      job_name: commit?.message || `Job for commit ${commitId.substring(0, 7)}`,
      status: 'pending',
      project_id: mockProjects.find(p => p.isActive)?.id || mockProjects[0].id,
      commit_sha: commitId,
      created_at: new Date().toISOString(),
      created_by: {
        id: mockUser.user.id.toString(),
        name: mockUser.user.username,
        email: mockUser.user.email,
      },
    };
  },
};

/**
 * Check if mock mode is enabled
 * Can be enabled via:
 * 1. Environment variable VITE_USE_MOCK_DATA=true
 * 2. localStorage key 'useMockData' = 'true'
 * 3. URL parameter ?mock=true
 */
export const isMockModeEnabled = (): boolean => {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mock') === 'true') {
    return true;
  }

  // Check localStorage
  if (localStorage.getItem('useMockData') === 'true') {
    return true;
  }

  // Check environment variable
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return true;
  }

  return false;
};

/**
 * Simulate API delay for realistic demo experience
 */
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
