import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { fetchAllPublications, deletePublication, publishPublication, unpublishPublication } from '../supabaseHelpers';
import Notification from './Notification';

const PublicationManagement = () => {
  const { logout, isWriter } = useAdmin();
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, unpublished
  const [search, setSearch] = useState('');
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadPublications();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllPublications(true); // Include unpublished
      setPublications(data || []);
    } catch (err) {
      const errorMessage = err?.message || 'Unknown error';
      console.error('Error loading publications:', err);
      setError(`Failed to load publications: ${errorMessage}. Please check your database connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deletePublication(id);
      setNotification({ message: 'Publication deleted successfully!', type: 'success' });
      loadPublications();
      setTimeout(() => {
        setNotification({ message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      setNotification({ message: 'Failed to delete publication. Please try again.', type: 'error' });
      console.error(err);
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await unpublishPublication(id);
        setNotification({ message: 'Publication unpublished successfully!', type: 'success' });
      } else {
        await publishPublication(id);
        setNotification({ message: 'Publication published successfully!', type: 'success' });
      }
      loadPublications();
      setTimeout(() => {
        setNotification({ message: '', type: 'success' });
      }, 3000);
    } catch (err) {
      console.error('Publish toggle error:', err);
      setNotification({ message: `Failed to update publication status: ${err.message}`, type: 'error' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPublications = publications.filter(pub => {
    const matchesFilter = filter === 'all' || 
      (filter === 'published' && pub.published) ||
      (filter === 'unpublished' && !pub.published);
    
    const matchesSearch = !search.trim() || 
      (pub.title && pub.title.toLowerCase().includes(search.toLowerCase())) ||
      (pub.description && pub.description.toLowerCase().includes(search.toLowerCase())) ||
      (pub.author && pub.author.toLowerCase().includes(search.toLowerCase()));
    
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
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Publication Management</h1>
                <p className="text-white/80 mt-1">Manage research papers and publications</p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/admin/publications/new"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  + New Publication
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: '', type: 'success' })}
            />
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('published')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'published'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilter('unpublished')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filter === 'unpublished'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Drafts
                </button>
              </div>
            </div>
          </div>

          {/* Publications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-accent">Loading publications...</div>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-lg text-accent mb-4">
                {search || filter !== 'all' 
                  ? 'No publications match your filters.' 
                  : 'No publications yet. Create your first publication!'}
              </p>
              <Link
                to="/admin/publications/new"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Create Publication
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPublications.map((pub) => (
                      <tr key={pub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary max-w-xs truncate">
                            {pub.title || 'Untitled'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          {pub.author || (pub.authors && Array.isArray(pub.authors) ? pub.authors.join(', ') : 'N/A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          {pub.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          {formatDate(pub.publication_date || pub.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              pub.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {pub.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Link
                              to={`/admin/publications/edit/${pub.id}`}
                              className="text-primary hover:text-accent"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handlePublishToggle(pub.id, pub.published)}
                              className={`${
                                pub.published ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {pub.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleDelete(pub.id, pub.title)}
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
        </div>
      </div>
    </div>
  );
};

export default PublicationManagement;

