import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const ProtectedRoute = ({ children, requiredUserType }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const { userType } = getCurrentUser();

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to={userType === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
