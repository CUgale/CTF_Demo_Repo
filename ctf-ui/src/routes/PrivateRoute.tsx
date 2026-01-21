import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children: React.ReactElement;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;