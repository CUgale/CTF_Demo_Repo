import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hooks';
import { projectActions } from '../layouts/Layout.reducer';
import { Project } from '../layouts/Layout.interface';

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (projectId: string) => void;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const projects = useAppSelector(state => state.project.projects.data) || [];
  const selectedProject = useAppSelector(state => state.project.selectedProject);

  // Fetch projects on mount
  useEffect(() => {
    if (!projects || projects.length === 0) {
      dispatch(projectActions.fetchProjects());
    } else if (!selectedProject) {
      // If projects are loaded but no active project is selected, fetch it
      dispatch(projectActions.fetchActiveProject());
    }
  }, [dispatch, projects, selectedProject]);

  const setSelectedProject = (projectId: string) => {
    // Dispatch setActiveProject action which will call the API and update the selected project
    dispatch(projectActions.setActiveProject(projectId));
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};



