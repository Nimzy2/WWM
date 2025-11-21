import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { fetchAllBlogs, deleteBlog, publishBlog, unpublishBlog } from '../supabaseHelpers';
import Notification from './Notification';

const PostManagement = () => {
  const { logout, isWriter } = useAdmin();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, unpublished
  const [search, setSearch] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    loadPosts();
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllBlogs(true); // Include unpublished
      setPosts(data || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      const errorMessage = err?.message || 'Unknown error';
      console.error('Error loading posts:', err);
      setError(`Failed to load posts: ${errorMessage}. Please check your database connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteBlog(id);
      setNotification({ message: 'Post deleted successfully!', type: 'success' });
      setMessage({ type: 'success', text: 'Post deleted successfully.' });
      loadPosts();
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setNotification({ message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      setNotification({ message: 'Failed to delete post. Please try again.', type: 'error' });
      setMessage({ type: 'error', text: 'Failed to delete post. Please try again.' });
      console.error(err);
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await unpublishBlog(id);
        setNotification({ message: 'Post unpublished successfully!', type: 'success' });
        setMessage({ type: 'success', text: 'Post unpublished successfully.' });
      } else {
        await publishBlog(id);
        setNotification({ message: 'Post published successfully!', type: 'success' });
        setMessage({ type: 'success', text: 'Post published successfully.' });
      }
      loadPosts();
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setNotification({ message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      console.error('Publish toggle error:', err);
      const errorMsg = err.message || 'Failed to update post status. Please try again.';
      const displayMsg = errorMsg.includes('column') || errorMsg.includes('migration')
        ? errorMsg
        : `Failed to update post status: ${errorMsg}`;
      setNotification({ message: displayMsg, type: 'error' });
      setMessage({ 
        type: 'error', 
        text: displayMsg
      });
      // Don't clear the error message automatically if it's about missing columns
      if (!errorMsg.includes('column') && !errorMsg.includes('migration')) {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
          setNotification({ message: '', type: 'success' });
        }, 5000);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      setMessage({ type: 'error', text: 'Please select posts to delete.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} post(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(selectedPosts.map(id => deleteBlog(id)));
      setMessage({ type: 'success', text: `${selectedPosts.length} post(s) deleted successfully.` });
      setSelectedPosts([]);
      loadPosts();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete posts. Please try again.' });
      console.error(err);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(p => p.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (id, checked) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, id]);
    } else {
      setSelectedPosts(prev => prev.filter(postId => postId !== id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && post.published) ||
      (filter === 'unpublished' && !post.published);
    
    const matchesSearch = !search.trim() ||
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      post.category?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{isWriter ? 'Writer Dashboard' : 'Post Management'}</h1>
              <p className="text-white/80 mt-1">
                {isWriter ? 'Create and manage blog posts' : 'Manage all your blog posts'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/posts/new"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                + Create New Post
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: 'success' })}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Posts</option>
              <option value="published">Published Only</option>
              <option value="unpublished">Drafts Only</option>
            </select>
            <button
              onClick={loadPosts}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-medium">
                {selectedPosts.length} post(s) selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Posts Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-accent">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={loadPosts}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-lg text-accent mb-4">No posts found.</div>
            <Link
              to="/admin/posts/new"
              className="text-primary hover:text-accent font-semibold"
            >
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-accent text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                          className="rounded border-accent text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-primary">
                          {post.title || 'Untitled'}
                        </div>
                        {post.excerpt && (
                          <div className="text-xs text-text mt-1 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {post.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="text-primary hover:text-accent"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handlePublishToggle(post.id, post.published)}
                            className={`${
                              post.published
                                ? 'text-yellow-600 hover:text-yellow-800'
                                : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

          {/* Stats Footer */}
          <div className="mt-6 text-sm text-text">
            Showing {filteredPosts.length} of {posts.length} post(s)
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostManagement;

