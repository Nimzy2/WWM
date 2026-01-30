import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        backgroundImage: `url(/codioful.jpg)`,
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
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-11 border border-accent placeholder-gray-500 text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary/60 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-b-md"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
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

