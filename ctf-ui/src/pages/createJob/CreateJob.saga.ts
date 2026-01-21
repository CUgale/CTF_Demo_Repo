import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse, AxiosError } from 'axios';
import { createJobActions } from './CreateJob.reducer';
import { authService } from '../../services/auth.service';
import { Commit, CreateJobRequest, CreateJobResponse } from './CreateJob.interface';
import { PayloadAction } from '@reduxjs/toolkit';
import { isMockModeEnabled, mockApiResponses, simulateApiDelay } from '../../services/mock-data.service';

function* fetchCommits(): Generator<any, void, any> {
  try {
    yield put(createJobActions.fetchCommitsProgress());
    
    let response: AxiosResponse<Commit[]>;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 500);
      const mockCommits = mockApiResponses.getCommits();
      response = {
        data: mockCommits,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as AxiosResponse<Commit[]>;
    } else {
      // Use real API
      response = yield call(authService.getCommits);
    }
    
    yield put(createJobActions.fetchCommitsSuccess(response.data));
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response;
      const errorMsg = errorResponse?.data?.message || error.message || 'Failed to fetch commits';
      yield put(createJobActions.fetchCommitsFailure(errorMsg));
    } else {
      yield put(createJobActions.fetchCommitsFailure('An unexpected error occurred'));
    }
  }
}

function* createJob(action: PayloadAction<CreateJobRequest>): Generator<any, void, any> {
  try {
    yield put(createJobActions.createJobProgress());

    const commitId = action.payload.commit_id ?? '';
    
    let response: AxiosResponse<CreateJobResponse>;
    
    if (isMockModeEnabled()) {
      // Use mock data for demo mode
      yield call(simulateApiDelay, 1000);
      const mockJobResponse = mockApiResponses.createJob(commitId);
      response = {
        data: mockJobResponse,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      } as AxiosResponse<CreateJobResponse>;
    } else {
      // Use real API
      response = yield call(authService.createJob, commitId);
    }

    yield put(createJobActions.createJobSuccess(response.data));
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response;
      const errorMsg = errorResponse?.data?.message || error.message || 'Failed to create job';
      yield put(createJobActions.createJobFailure(errorMsg));
    }
  }
}

export function* watchCreateJobSaga(): Generator<any, void, any> {
  yield takeLatest(createJobActions.fetchCommits.type, fetchCommits);
  yield takeLatest(createJobActions.createJob.type, createJob);
}
