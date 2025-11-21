import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../supabaseClient';

const UserManagement = () => {
  const { isAdmin } = useAdmin();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('writer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter an email.' });
      return;
    }
    setLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setMessage({ type: 'error', text: 'You must be logged in to perform this action.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('set-user-role', {
        body: { email, role }
      });
      
      if (error) {
        console.error('Edge Function error:', error);
        // Provide more specific error messages
        if (error.message?.includes('Failed to fetch') || error.message?.includes('network') || error.message?.includes('Failed to send')) {
          setMessage({ 
            type: 'error', 
            text: 'Edge Function not deployed. Deploy it using: supabase functions deploy set-user-role (See USER_MANAGEMENT_GUIDE.md)' 
          });
        } else if (error.message?.includes('404') || error.message?.includes('not found')) {
          setMessage({ 
            type: 'error', 
            text: 'Edge Function not found. Deploy using: supabase functions deploy set-user-role' 
          });
        } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          setMessage({ type: 'error', text: 'Authentication failed. Please log out and log back in.' });
        } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
          setMessage({ type: 'error', text: 'Access denied. You must be an admin to perform this action.' });
        } else {
          setMessage({ type: 'error', text: error.message || 'Failed to send a request to the Edge Function. Please ensure the function is deployed.' });
        }
      } else if (data?.error) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: `Role set to ${role} for ${email}` });
        setEmail('');
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
        backgroundImage: `url(/admin-login-bg.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10">
      <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-white/80 mt-1">Assign roles to users by email</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Set User Role</h2>
          {message.text && (
            <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="writer">writer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-70"
              >
                {loading ? 'Saving…' : 'Set Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UserManagement;


