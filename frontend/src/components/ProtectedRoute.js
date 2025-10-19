import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/api';

const ProtectedRoute = ({ children, requiredUserType }) => {
  // Check if user is logged in
  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  const { userType } = getCurrentUser();
  console.log('ProtectedRoute - userType:', userType, 'requiredUserType:', requiredUserType);

  // Check if user has required role (if specified)
  if (requiredUserType && userType !== requiredUserType) {
    console.log('User type mismatch, redirecting to appropriate dashboard');
    // Redirect to appropriate dashboard based on user type
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
