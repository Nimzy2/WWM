import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'writer'
  const { login, logout } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Get the actual user role from the result
        const userRole = (result.role || '').toLowerCase().trim();
        const selectedRole = loginType.toLowerCase().trim();
        
        // Debug logging (can be removed later)
        console.log('Login validation:', { 
          selectedRole, 
          userRole, 
          match: selectedRole === userRole,
          resultRole: result.role
        });

        // Strict validation: selected role MUST exactly match user's actual role
        // If no role is set, default to 'admin' for backwards compatibility
        const actualUserRole = userRole || 'admin';
        
        if (selectedRole !== actualUserRole) {
          // Roles don't match - show error and logout IMMEDIATELY
          let errorMessage = '';
          if (selectedRole === 'admin' && actualUserRole === 'writer') {
            errorMessage = 'Access denied. This account does not have admin privileges. Please select "Writer" to log in with this account.';
          } else if (selectedRole === 'writer' && actualUserRole === 'admin') {
            errorMessage = 'Access denied. This account has admin privileges. Please select "Admin" to log in with this account.';
          } else {
            errorMessage = `Access denied. Role mismatch. You selected "${selectedRole}" but this account is "${actualUserRole}". Please select the correct role.`;
          }
          
          setError(errorMessage);
          
          // CRITICAL: Logout BEFORE setting loading to false to prevent any navigation
          await logout();
          
          // Set loading to false and return - do NOT navigate
          setIsLoading(false);
          return; // Exit early - prevents any navigation
        }

        // Only reach here if roles match exactly
        // Role matches - proceed with login
        if (actualUserRole === 'writer') {
          navigate('/admin/posts');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(/admin-login-bg.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-text">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              loginType === 'admin'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">👨‍💼</span>
              <span>Admin</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setLoginType('writer')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              loginType === 'writer'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">✍️</span>
              <span>Writer</span>
            </div>
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-accent">
            {loginType === 'admin' 
              ? 'Full access to all admin features' 
              : 'Access to blog management only'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-accent placeholder-gray-500 text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-accent placeholder-gray-500 text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading 
                ? 'Signing in...' 
                : `Sign in as ${loginType === 'admin' ? 'Admin' : 'Writer'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

