import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectState, Project, ProjectInitialState, SetActiveProjectState, FetchActiveProjectState } from './Layout.interface';

const initialProjectsState: ProjectInitialState = {
  data: null,
  loading: false,
  error: null,
};

const initialSetActiveProjectState: SetActiveProjectState = {
  loading: false,
  error: null,
  success: false,
};

const initialFetchActiveProjectState: FetchActiveProjectState = {
  data: null,
  loading: false,
  error: null,
};

export const initialState: ProjectState = {
  projects: initialProjectsState,
  selectedProject: null,
  setActiveProject: initialSetActiveProjectState,
  fetchActiveProject: initialFetchActiveProjectState,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    fetchProjectsProgress: (state) => {
      state.projects = {
        ...state.projects,
        loading: true,
        error: null,
      };
    },
    fetchProjectsSuccess: (state, action: PayloadAction<Project[]>) => {
      state.projects = {
        loading: false,
        data: action.payload,
        error: null,
      };
      // Don't set selected project here - it will be set by fetchActiveProject
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.projects = {
        loading: false,
        data: null,
        error: action.payload,
      };
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearProjectErrors: (state) => {
      state.projects.error = null;
    },
    setActiveProjectProgress: (state) => {
      state.setActiveProject = {
        ...state.setActiveProject,
        loading: true,
        error: null,
        success: false,
      };
    },
    setActiveProjectSuccess: (state) => {
      state.setActiveProject = {
        loading: false,
        error: null,
        success: true,
      };
    },
    setActiveProjectFailure: (state, action: PayloadAction<string>) => {
      state.setActiveProject = {
        loading: false,
        error: action.payload,
        success: false,
      };
    },
    resetSetActiveProject: (state) => {
      state.setActiveProject = initialSetActiveProjectState;
    },
    fetchActiveProjectProgress: (state) => {
      state.fetchActiveProject = {
        ...state.fetchActiveProject,
        loading: true,
        error: null,
      };
    },
    fetchActiveProjectSuccess: (state, action: PayloadAction<Project>) => {
      state.fetchActiveProject = {
        loading: false,
        data: action.payload,
        error: null,
      };
      // Set the active project as selected
      state.selectedProject = action.payload;
    },
    fetchActiveProjectFailure: (state, action: PayloadAction<string>) => {
      state.fetchActiveProject = {
        loading: false,
        data: null,
        error: action.payload,
      };
    },
  },
});

export const projectActions = {
  fetchProjects: createAction(`${projectSlice.name}/fetchProjects`),
  fetchProjectsProgress: projectSlice.actions.fetchProjectsProgress,
  fetchProjectsSuccess: projectSlice.actions.fetchProjectsSuccess,
  fetchProjectsFailure: projectSlice.actions.fetchProjectsFailure,
  setSelectedProject: projectSlice.actions.setSelectedProject,
  clearProjectErrors: projectSlice.actions.clearProjectErrors,
  fetchActiveProject: createAction(`${projectSlice.name}/fetchActiveProject`),
  fetchActiveProjectProgress: projectSlice.actions.fetchActiveProjectProgress,
  fetchActiveProjectSuccess: projectSlice.actions.fetchActiveProjectSuccess,
  fetchActiveProjectFailure: projectSlice.actions.fetchActiveProjectFailure,
  setActiveProject: createAction<string>(`${projectSlice.name}/setActiveProject`),
  setActiveProjectProgress: projectSlice.actions.setActiveProjectProgress,
  setActiveProjectSuccess: projectSlice.actions.setActiveProjectSuccess,
  setActiveProjectFailure: projectSlice.actions.setActiveProjectFailure,
  resetSetActiveProject: projectSlice.actions.resetSetActiveProject,
};

export default projectSlice.reducer;
