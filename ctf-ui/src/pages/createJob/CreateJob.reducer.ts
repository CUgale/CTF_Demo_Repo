import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import type { CreateJobState, Commit, CommitsInitialState, CreateJobInitialState, CreateJobRequest, CreateJobResponse } from './CreateJob.interface';

const initialCommitsState: CommitsInitialState = {
  data: null,
  loading: false,
  error: null,
};

const initialCreateJobState: CreateJobInitialState = {
  data: null,
  loading: false,
  error: null,
};

export const initialState: CreateJobState = {
  commits: initialCommitsState,
  createJob: initialCreateJobState,
};

const createJobSlice = createSlice({
  name: 'createJob',
  initialState,
  reducers: {
    fetchCommitsProgress: (state) => {
      state.commits = {
        ...state.commits,
        loading: true,
        error: null,
      };
    },
    fetchCommitsSuccess: (state, action: PayloadAction<Commit[]>) => {
      state.commits = {
        loading: false,
        data: action.payload,
        error: null,
      };
    },
    fetchCommitsFailure: (state, action: PayloadAction<string>) => {
      state.commits = {
        loading: false,
        data: null,
        error: action.payload,
      };
    },
    clearCommitsErrors: (state) => {
      state.commits.error = null;
    },
    createJobProgress: (state) => {
      state.createJob = {
        ...state.createJob,
        loading: true,
        error: null,
      };
    },
    createJobSuccess: (state, action: PayloadAction<CreateJobResponse>) => {
      state.createJob = {
        loading: false,
        data: action.payload,
        error: null,
      };
    },
    createJobFailure: (state, action: PayloadAction<string>) => {
      state.createJob = {
        loading: false,
        data: null,
        error: action.payload,
      };
    },
    clearCreateJobErrors: (state) => {
      state.createJob.error = null;
    },
    clearCreateJobData: (state) => {
      state.createJob = {
        ...state.createJob,
        data: null,
      };
    },
  },
});

export const createJobActions = {
  fetchCommits: createAction(`${createJobSlice.name}/fetchCommits`),
  fetchCommitsProgress: createJobSlice.actions.fetchCommitsProgress,
  fetchCommitsSuccess: createJobSlice.actions.fetchCommitsSuccess,
  fetchCommitsFailure: createJobSlice.actions.fetchCommitsFailure,
  clearCommitsErrors: createJobSlice.actions.clearCommitsErrors,

  createJob: createAction<CreateJobRequest>(`${createJobSlice.name}/createJob`),
  createJobProgress: createJobSlice.actions.createJobProgress,
  createJobSuccess: createJobSlice.actions.createJobSuccess,
  createJobFailure: createJobSlice.actions.createJobFailure,
  clearCreateJobErrors: createJobSlice.actions.clearCreateJobErrors,
  clearCreateJobData: createJobSlice.actions.clearCreateJobData,
};

export default createJobSlice.reducer;
