import { AxiosResponse } from 'axios';
import { LoginRequestPayload } from '../pages/login/Login.interface';
import { SERVICE_ENDPOINT } from '../pages/shared/constants/service-endpoints';
import { apiClient } from './axios-interceptor';

export const authService = {
  login: (payload: LoginRequestPayload): Promise<AxiosResponse> => {
    return apiClient.post(SERVICE_ENDPOINT.LOGIN, null, {
      params: {
        username: payload.username,
        password: payload.password
      }
    });
  },

  getCurrentUserDetails: (): Promise<AxiosResponse> => {
    return apiClient.get(SERVICE_ENDPOINT.CURRENT_USER);
  },
  
  logout: (): Promise<AxiosResponse> => {
    return apiClient.post(SERVICE_ENDPOINT.LOGOUT);
  },

  getProjects: (): Promise<AxiosResponse> => {
    return apiClient.get(SERVICE_ENDPOINT.PROJECTS);
  },

  getActiveProject: (): Promise<AxiosResponse> => {
    return apiClient.get(SERVICE_ENDPOINT.GET_ACTIVE_PROJECT);
  },

  setActiveProject: (projectId: string): Promise<AxiosResponse> => {
    const endpoint = SERVICE_ENDPOINT.SET_ACTIVE_PROJECT.replace('{projectId}', projectId);
    return apiClient.post(endpoint);
  },

  getCommits: (): Promise<AxiosResponse> => {
    return apiClient.get(SERVICE_ENDPOINT.GET_COMMITS);
  },

  createJob: (commitId: string): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('commit_id', commitId);
    return apiClient.post(SERVICE_ENDPOINT.CREATE_JOB, formData);
  },

  clearSession: () => {
    localStorage.clear(); 
  }
};