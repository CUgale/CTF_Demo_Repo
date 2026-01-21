import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notification } from 'antd';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { authActions } from './Login.reducer';
import { projectActions } from '../../layouts/Layout.reducer';
import { authService } from '../../services/auth.service';
import { User, LoginRequestPayload } from './Login.interface';
import { Project } from '../../layouts/Layout.interface';
import { isMockModeEnabled, mockApiResponses, simulateApiDelay } from '../../services/mock-data.service';


function* handleLogin(action: PayloadAction<LoginRequestPayload>): Generator<any, void, any> {
  try {
    yield put(authActions.loginProgress());
    
    let response: AxiosResponse;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 800);
      const mockResponse = mockApiResponses.login(action.payload.username, action.payload.password);
      // Create a mock AxiosResponse-like object
      response = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse;
    } else {
      // Use real API
      response = yield call(authService.login, action.payload);
    }

    localStorage.setItem('authToken', 'true');
    localStorage.setItem('isAuthenticated', 'true');

    yield put(authActions.loginSuccess(response.data[0] || {}));
    
    notification.success({
      message: 'Success',
      description: 'Login successful based on server response.',
    });
    yield call(handleFetchCurrentUser);
    
    // Fetch projects and set first project as active after successful login
    yield call(initializeProjectsAfterLogin);

  } catch (error: any) {
    let errorMsg = 'Authentication failed';
    
    if (axios.isAxiosError(error)) {
      errorMsg = `Server returned status ${error.response?.status}`;
    } else {
      errorMsg = error.message || 'An unexpected error occurred';
    }
    
    yield put(authActions.loginFailure(errorMsg));
    notification.error({
      message: 'Login Failed',
      description: errorMsg,
    });
  }
}

function* handleFetchCurrentUser(): Generator<any, void, any> {
  try {
    yield put(authActions.fetchUserProgress());
    
    let response: AxiosResponse;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 300);
      const mockUserData = mockApiResponses.getCurrentUser();
      response = {
        data: mockUserData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse;
    } else {
      // Use real API
      response = yield call(authService.getCurrentUserDetails);
    }
    
    const userData: User = response.data; 
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    yield put(authActions.fetchUserSuccess(userData));
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      yield put(authActions.fetchUserFailure(error.message));
    } else {
      yield put(authActions.fetchUserFailure('Failed to fetch user'));
    }
  }
}

function* initializeProjectsAfterLogin(): Generator<any, void, any> {
  try {
    // Fetch projects
    yield put(projectActions.fetchProjectsProgress());
    
    let projectsResponse: AxiosResponse<Project[]>;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 400);
      const mockProjects = mockApiResponses.getProjects();
      projectsResponse = {
        data: mockProjects,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Project[]>;
    } else {
      // Use real API
      projectsResponse = yield call(authService.getProjects);
    }
    
    // Map API response to include default branch if not present
    const projects: Project[] = projectsResponse.data.map((project) => ({
      ...project,
      branch: project.branch || 'main',
      isActive: project.isActive ?? false,
    }));
    
    yield put(projectActions.fetchProjectsSuccess(projects));
    
    // If there are projects, set the first one as active
    if (projects && projects.length > 0) {
      const firstProjectId = projects[0].id;
      yield put(projectActions.setActiveProjectProgress());
      
      let setActiveResponse: AxiosResponse;
      
      if (isMockModeEnabled()) {
        // Use mock data for demo mode
        yield call(simulateApiDelay, 300);
        mockApiResponses.setActiveProject(firstProjectId);
        setActiveResponse = {
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        } as AxiosResponse;
      } else {
        // Use real API
        setActiveResponse = yield call(authService.setActiveProject, firstProjectId);
      }
      
      if (setActiveResponse.status === 200 || setActiveResponse.status === 201) {
        yield put(projectActions.setActiveProjectSuccess());
        yield put(projectActions.setSelectedProject(projects[0]));
      }
    }
  } catch (error) {
    // Silently handle errors - don't show notifications during login flow
    if (error instanceof AxiosError) {
    }
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    yield call(authService.logout);
  } catch (error) {
  } finally {
    authService.clearSession();
    yield put(authActions.logoutSuccess());
  }
}

export function* watchAuthSaga(): Generator<any, void, any> {
  yield takeLatest(authActions.requestLogin.type, handleLogin);
  yield takeLatest(authActions.requestLogout.type, handleLogout);
  yield takeLatest(authActions.requestFetchUser.type, handleFetchCurrentUser);
}