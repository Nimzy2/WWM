import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../supabaseClient';

const UserManagement = () => {
  const { isAdmin } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const describeError = useCallback((error) => {
    if (error.message?.includes('Failed to fetch') || error.message?.includes('network') || error.message?.includes('Failed to send')) {
      return 'Edge Function not deployed. Deploy it using: supabase functions deploy set-user-role (See USER_MANAGEMENT_GUIDE.md)';
    }
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      return 'Edge Function not found. Deploy using: supabase functions deploy set-user-role';
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return 'Authentication failed. Please log out and log back in.';
    }
    if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
      return 'Access denied. You must be an admin to perform this action.';
    }
    return error.message || 'Failed to send a request to the Edge Function. Please ensure the function is deployed.';
  }, []);

  const readInvokeError = useCallback(async (error, data) => {
    if (data?.error) return data.error;
    if (error?.context && typeof error.context.json === 'function') {
      try {
        const body = await error.context.json();
        if (body?.error) return body.error;
      } catch (parseError) {
        console.error('Could not read function error:', parseError);
      }
    }
    return describeError(error);
  }, [describeError]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setMessage({ type: 'error', text: 'You must be logged in to view admin logins.' });
        return;
      }

      const { data, error } = await supabase.functions.invoke('set-user-role', {
        body: { action: 'list' }
      });

      if (error) {
        setMessage({ type: 'error', text: await readInvokeError(error, data) });
        return;
      }
      if (data?.error) {
        setMessage({ type: 'error', text: data.error });
        return;
      }

      const nextUsers = Array.isArray(data?.users) ? data.users : [];
      nextUsers.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
      setUsers(nextUsers);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not load existing logins.' });
    } finally {
      setUsersLoading(false);
    }
  }, [readInvokeError]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, loadUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setMessage({ type: 'error', text: 'Email and password are required.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setMessage({ type: 'error', text: 'You must be logged in to perform this action.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('set-user-role', {
        body: { action: 'create', email: trimmedEmail, password, role }
      });

      if (error) {
        console.error('Edge Function error:', error);
        setMessage({ type: 'error', text: await readInvokeError(error, data) });
      } else if (data?.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        const verb = data?.updated ? 'updated' : 'created';
        setMessage({ type: 'success', text: `Login ${verb} for ${trimmedEmail} as ${role}.` });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('admin');
        await loadUsers();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage({ type: 'error', text: err.message || 'Unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-accent text-lg">Admins only</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(/codioful.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admins</h1>
              <p className="text-white/80 mt-1">Add a new admin or writer login</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Add login</h2>
            {message.text && (
              <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-text mb-1">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="admin@example.com"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-text mb-1">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 px-3 text-sm font-semibold text-primary"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="admin-confirm-password" className="block text-sm font-medium text-text mb-1">Confirm password</label>
                <input
                  id="admin-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-role" className="block text-sm font-medium text-text mb-1">Role</label>
                <select
                  id="admin-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="admin">admin</option>
                  <option value="writer">writer</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-70"
                >
                  {loading ? 'Saving…' : 'Add login'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Existing logins</h2>
            {usersLoading ? (
              <p className="text-accent">Loading logins...</p>
            ) : users.length === 0 ? (
              <p className="text-text">No logins found yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-text">
                      <th className="py-2 pr-4 font-semibold">Email</th>
                      <th className="py-2 pr-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 pr-4">{user.email}</td>
                        <td className="py-3 pr-4 capitalize">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
