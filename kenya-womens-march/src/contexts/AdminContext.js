import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('admin'); // default to admin to prevent accidental lockout

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user ?? null;
        if (!isMounted) return;

        setIsAuthenticated(!!sessionUser);
        setAdminUser(sessionUser);
        // Prefer user-defined metadata role; fallback to admin for backward compatibility
        const userRole =
          sessionUser?.user_metadata?.role ||
          sessionUser?.app_metadata?.role ||
          'admin';
        setRole(userRole);
      } catch (error) {
        console.error('Failed to fetch admin session:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setIsAuthenticated(!!sessionUser);
      setAdminUser(sessionUser);
      const userRole =
        sessionUser?.user_metadata?.role ||
        sessionUser?.app_metadata?.role ||
        'admin';
      setRole(userRole);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid credentials. Please try again.'
        };
      }

      setIsAuthenticated(true);
      setAdminUser(data.user);
      
      // Get user role from metadata (must be explicitly set)
      const userRole =
        data.user?.user_metadata?.role ||
        data.user?.app_metadata?.role ||
        null; // Don't default to 'admin' - require explicit role
      setRole(userRole || 'admin'); // Only default in state, but return actual role

      return { success: true, role: userRole || 'admin' }; // Return actual role or 'admin' if not set
    } catch (error) {
      console.error('Admin login failed:', error);
      return {
        success: false,
        error: 'Unable to sign in at this time. Please try again later.'
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Admin logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  };

  const value = {
    isAuthenticated,
    adminUser,
    role,
    isAdmin: role === 'admin',
    isWriter: role === 'writer',
    isLoading,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

