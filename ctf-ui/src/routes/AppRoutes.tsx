import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import CreateJob from '../pages/createJob/CreateJob';
import JobsList from '../pages/jobsList/JobsList';
import JobDetails from '../pages/jobDetails/JobDetails';
import TestReview from '../pages/testReview/TestReview';
import PrivateRoute from './PrivateRoute';

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

const AppRoutes: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-job"
        element={
          <PrivateRoute>
            <CreateJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <JobsList />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:jobId"
        element={
          <PrivateRoute>
            <JobDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:jobId/test-review"
        element={
          <PrivateRoute>
            <TestReview />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
