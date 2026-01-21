export const SERVICE_ENDPOINT = {
  LOGIN: 'ctf/login',
  CURRENT_USER: 'ctf/current-user',
  LOGOUT: 'ctf/logout',
  PROJECTS: 'ctf/projects',
  GET_ACTIVE_PROJECT: 'ctf/projects/active',
  SET_ACTIVE_PROJECT: 'ctf/projects/{projectId}/set-active',
  GET_COMMITS: 'ctf/projects/commits',
  CREATE_JOB: 'ctf/jobs/create',
} as const;

export const APP_API_BASE_URL = '/api';
