import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-accent text-lg">Checking admin access...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      // Writers trying to access admin-only pages get sent to posts
      const fallback = role === 'writer' ? '/admin/posts' : '/admin/dashboard';
      return <Navigate to={fallback} replace state={{ from: location }} />;
    }
  }

  return children;
};

export default ProtectedRoute;

