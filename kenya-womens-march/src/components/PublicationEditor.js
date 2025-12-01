import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { createPublication, updatePublication, fetchPublicationById } from '../supabaseHelpers';
import Notification from './Notification';

const PublicationEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    authors: [],
    publication_date: '',
    category: '',
    file_url: '',
    file_name: '',
    thumbnail_url: '',
    tags: [],
    published: false
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [authorsInput, setAuthorsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const categories = [
    'Research Paper',
    'Policy Brief',
    'Report',
    'Working Paper',
    'Case Study',
    'Analysis',
    'Other'
  ];

  useEffect(() => {
    if (isEditing) {
      loadPublication();
    } else {
      // Set default date to today for new publications
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        publication_date: today
      }));
    }
  }, [id]);

  const loadPublication = async () => {
    try {
      setLoading(true);
      const pub = await fetchPublicationById(id, true); // Include unpublished for admin editing
      
      // Format date for input field (YYYY-MM-DD)
      let dateValue = '';
      if (pub.publication_date) {
        const date = new Date(pub.publication_date);
        dateValue = date.toISOString().split('T')[0];
      } else if (pub.created_at) {
        const date = new Date(pub.created_at);
        dateValue = date.toISOString().split('T')[0];
      }
      
      setFormData({
        title: pub.title || '',
        description: pub.description || '',
        author: pub.author || '',
        authors: Array.isArray(pub.authors) ? pub.authors : [],
        publication_date: dateValue,
        category: pub.category || '',
        file_url: pub.file_url || '',
        file_name: pub.file_name || '',
        thumbnail_url: pub.thumbnail_url || '',
        tags: Array.isArray(pub.tags) ? pub.tags : [],
        published: pub.published || false
      });

      setAuthorsInput(Array.isArray(pub.authors) ? pub.authors.join(', ') : '');
      setTagsInput(Array.isArray(pub.tags) ? pub.tags.join(', ') : '');
    } catch (err) {
      setError('Failed to load publication. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleAuthorsChange = (e) => {
    const value = e.target.value;
    setAuthorsInput(value);
    const authorsArray = value.split(',').map(a => a.trim()).filter(a => a);
    setFormData(prev => ({
      ...prev,
      authors: authorsArray
    }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tagsArray = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleFileUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      file_url: url
    }));
    
    // Try to extract filename from URL
    if (url && !formData.file_name) {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop();
        if (filename) {
          setFormData(prev => ({
            ...prev,
            file_name: filename
          }));
        }
      } catch (e) {
        // Not a valid URL, ignore
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.file_url.trim()) {
      setError('File URL is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const publicationData = {
        ...formData,
        // Ensure arrays are properly formatted
        authors: formData.authors.length > 0 ? formData.authors : (formData.author ? [formData.author] : []),
        tags: formData.tags,
        // Set published_at if publishing
        published_at: formData.published ? (formData.published_at || new Date().toISOString()) : null
      };

      if (isEditing) {
        await updatePublication(id, publicationData);
        setNotification({ message: 'Publication updated successfully!', type: 'success' });
      } else {
        await createPublication(publicationData);
        setNotification({ message: 'Publication created successfully!', type: 'success' });
      }

      setTimeout(() => {
        navigate('/admin/publications');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save publication. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-accent">Loading publication...</p>
        </div>
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
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? 'Edit Publication' : 'Create New Publication'}
                </h1>
                <p className="text-white/80 mt-1">Upload and manage research papers</p>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/admin/publications"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Back to Publications
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter publication title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter a brief description of the publication"
                />
              </div>

              {/* Author and Authors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
                    All Authors (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="authors"
                    value={authorsInput}
                    onChange={handleAuthorsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Author 1, Author 2, Author 3"
                  />
                </div>
              </div>

              {/* Publication Date and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    id="publication_date"
                    name="publication_date"
                    value={formData.publication_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File URL */}
              <div>
                <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
                  File URL (PDF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="file_url"
                  name="file_url"
                  value={formData.file_url}
                  onChange={handleFileUrlChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/publication.pdf"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload your PDF to a file hosting service (e.g., Google Drive, Dropbox) and paste the direct link here.
                </p>
              </div>

              {/* File Name */}
              <div>
                <label htmlFor="file_name" className="block text-sm font-medium text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  id="file_name"
                  name="file_name"
                  value={formData.file_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="publication.pdf"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image URL (optional)
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="women's rights, policy, research"
                />
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Publication' : 'Create Publication')}
                </button>
                <Link
                  to="/admin/publications"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicationEditor;

