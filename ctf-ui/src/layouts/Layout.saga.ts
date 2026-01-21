import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { AxiosResponse, AxiosError } from 'axios';
import { projectActions } from './Layout.reducer';
import { authService } from '../services/auth.service';
import { Project } from './Layout.interface';
import { isMockModeEnabled, mockApiResponses, simulateApiDelay } from '../services/mock-data.service';

function* fetchProjects(): Generator<any, void, any> {
  try {
    yield put(projectActions.fetchProjectsProgress());
    
    let response: AxiosResponse<Project[]>;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 400);
      const mockProjects = mockApiResponses.getProjects();
      response = {
        data: mockProjects,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Project[]>;
    } else {
      // Use real API
      response = yield call(authService.getProjects);
    }
    
    // Map API response to include default branch if not present
    const projects: Project[] = response.data.map((project) => ({
      ...project,
      branch: project.branch || 'main',
      isActive: project.isActive ?? false,
    }));
    
    yield put(projectActions.fetchProjectsSuccess(projects));
    // Don't automatically fetch active project - it will be set during login or by user selection
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response;
      const errorMsg = errorResponse?.data?.message || error.message || 'Failed to fetch projects';
      yield put(projectActions.fetchProjectsFailure(errorMsg));
    } else {
      yield put(projectActions.fetchProjectsFailure('An unexpected error occurred'));
    }
  }
}

function* fetchActiveProject(): Generator<any, void, any> {
  try {
    yield put(projectActions.fetchActiveProjectProgress());
    
    let response: AxiosResponse<Project>;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 300);
      const mockActiveProject = mockApiResponses.getActiveProject();
      response = {
        data: mockActiveProject,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Project>;
    } else {
      // Use real API
      response = yield call(authService.getActiveProject);
    }
    
    if (response.status === 200) {
      // Map API response to include default branch if not present
      const activeProject: Project = {
        ...response.data,
        branch: response.data.branch || 'main',
        isActive: response.data.isActive ?? true,
      };
      
      yield put(projectActions.fetchActiveProjectSuccess(activeProject));
      notification.success({
        message: 'Success',
        description: 'Active project loaded successfully',
      });
    }
  } catch (error) {
    // If no active project exists (404 or other error), set first project as active
    if (error instanceof AxiosError) {
      const errorResponse = error.response;
      // If 404 or no active project, try to set first project as active
      if (errorResponse?.status === 404 || !errorResponse) {
        const projects = yield select((state: any) => state.project.projects.data);
        if (projects && projects.length > 0) {
          // Set first project as active
          yield put(projectActions.setActiveProject(projects[0].id));
          return;
        }
      }
      const errorMsg = errorResponse?.data?.message || error.message || 'Failed to fetch active project';
      yield put(projectActions.fetchActiveProjectFailure(errorMsg));
      notification.error({
        message: 'Error',
        description: errorMsg,
      });
    } else {
      const errorMsg = 'An unexpected error occurred';
      yield put(projectActions.fetchActiveProjectFailure(errorMsg));
      notification.error({
        message: 'Error',
        description: errorMsg,
      });
    }
  }
}

function* setActiveProject(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield put(projectActions.setActiveProjectProgress());
    
    let response: AxiosResponse;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 300);
      mockApiResponses.setActiveProject(action.payload);
      response = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse;
    } else {
      // Use real API
      response = yield call(authService.setActiveProject, action.payload);
    }
    
    if (response.status === 200 || response.status === 201) {
      yield put(projectActions.setActiveProjectSuccess());
      // Update selected project in state
      const projects = yield select((state: any) => state.project.projects.data);
      if (projects) {
        const project = projects.find((p: Project) => p.id === action.payload);
        if (project) {
          yield put(projectActions.setSelectedProject(project));
        }
      }
      notification.success({
        message: 'Success',
        description: 'Active project updated successfully',
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response;
      const errorMsg = errorResponse?.data?.message || error.message || 'Failed to set active project';
      yield put(projectActions.setActiveProjectFailure(errorMsg));
      notification.error({
        message: 'Error',
        description: errorMsg,
      });
    } else {
      const errorMsg = 'An unexpected error occurred';
      yield put(projectActions.setActiveProjectFailure(errorMsg));
      notification.error({
        message: 'Error',
        description: errorMsg,
      });
    }
  }
}

export function* watchProjectSaga(): Generator<any, void, any> {
  yield takeLatest(projectActions.fetchProjects.type, fetchProjects);
  yield takeLatest(projectActions.fetchActiveProject.type, fetchActiveProject);
  yield takeLatest(projectActions.setActiveProject.type, setActiveProject);
}
