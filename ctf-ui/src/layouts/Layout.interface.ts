export interface Project {
  id: string;
  name: string;
  repository: string;
  description?: string;
  branch?: string;
  isActive?: boolean;
}

export interface ProjectInitialState {
  data: Project[] | null;
  loading: boolean;
  error: string | null;
}

export interface SetActiveProjectState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface FetchActiveProjectState {
  data: Project | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: ProjectInitialState;
  selectedProject: Project | null;
  setActiveProject: SetActiveProjectState;
  fetchActiveProject: FetchActiveProjectState;
}
