import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminEntry = () => {
  const { isAuthenticated, isLoading, role } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-accent text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: { pathname: '/admin' } }} />;
  }

  const destination = role === 'writer' ? '/admin/posts' : '/admin/dashboard';
  return <Navigate to={destination} replace />;
};

export default AdminEntry;
