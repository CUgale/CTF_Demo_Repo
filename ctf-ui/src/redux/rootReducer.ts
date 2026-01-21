import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../pages/login/Login.reducer';
import projectReducer from '../layouts/Layout.reducer';
import createJobReducer from '../pages/createJob/CreateJob.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  createJob: createJobReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
