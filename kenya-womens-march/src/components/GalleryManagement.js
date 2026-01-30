import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { fetchGalleryImages, updateGalleryImageMetadata } from '../supabaseHelpers';
import Notification from './Notification';
import ProtectedRoute from './ProtectedRoute';
import OptimizedImage from './OptimizedImage';

const GalleryManagement = () => {
  const { isAuthenticated } = useAdmin();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [editForm, setEditForm] = useState({
    caption: '',
    alt_text: '',
    category: '',
    tags: '',
    display_order: 0,
    is_featured: false
  });
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [saving, setSaving] = useState(false);

  const loadImages = async () => {
    try {
      setLoading(true);
      const imageData = await fetchGalleryImages();
      setImages(imageData);
    } catch (error) {
      console.error('Error loading images:', error);
      showNotification('Failed to load images. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- loadImages is stable, only run when isAuthenticated changes
  }, [isAuthenticated]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setEditForm({
      caption: image.caption || '',
      alt_text: image.alt_text || image.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      category: image.category || '',
      tags: Array.isArray(image.tags) ? image.tags.join(', ') : '',
      display_order: image.display_order || 0,
      is_featured: image.is_featured || false
    });
  };

  const handleCancel = () => {
    setEditingImage(null);
    setEditForm({
      caption: '',
      alt_text: '',
      category: '',
      tags: '',
      display_order: 0,
      is_featured: false
    });
  };

  const handleSave = async () => {
    if (!editingImage) return;

    try {
      setSaving(true);
      
      const tagsArray = editForm.tags
        ? editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      await updateGalleryImageMetadata(editingImage.name, {
        caption: editForm.caption || null,
        alt_text: editForm.alt_text || null,
        category: editForm.category || null,
        tags: tagsArray,
        display_order: parseInt(editForm.display_order) || 0,
        is_featured: editForm.is_featured
      });

      showNotification('Image metadata updated successfully!', 'success');
      setEditingImage(null);
      loadImages(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating image:', error);
      const message = error?.message || 'Failed to update image. Please try again.';
      showNotification(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return <ProtectedRoute allowedRoles={['admin']} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/30 to-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-primary/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
              Gallery Management
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              Manage captions, categories, and metadata for your gallery images.
            </p>
          </div>

          <Notification message={notification.message} type={notification.type} />

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
              <p className="text-xl text-accent">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text/70 text-lg">No images found. Upload images first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id || image.name}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
                    editingImage?.name === image.name
                      ? 'border-primary ring-4 ring-primary/20'
                      : 'border-gray-100 hover:border-primary/50'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={image.url}
                      alt={image.alt_text || image.name}
                      className="w-full h-full object-cover"
                    />
                    {image.is_featured && (
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {editingImage?.name === image.name ? (
                      /* Edit Form */
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1">
                            Caption
                          </label>
                          <textarea
                            value={editForm.caption}
                            onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                            className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            rows="2"
                            placeholder="Enter image caption..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={editForm.alt_text}
                            onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                            className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Alternative text for accessibility"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="e.g., Events, Team, Activities"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={editForm.tags}
                            onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                            className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-primary mb-1">
                              Display Order
                            </label>
                            <input
                              type="number"
                              value={editForm.display_order}
                              onChange={(e) => setEditForm({ ...editForm, display_order: e.target.value })}
                              className="w-20 px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                          <div className="flex items-center mt-6">
                            <input
                              type="checkbox"
                              id={`featured-${image.id}`}
                              checked={editForm.is_featured}
                              onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                              className="w-4 h-4 text-primary border-accent rounded focus:ring-primary"
                            />
                            <label htmlFor={`featured-${image.id}`} className="ml-2 text-sm font-medium text-text">
                              Featured
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-4 py-2 bg-gray-200 text-text rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <p className="text-xs text-text/60 mb-2 truncate">{image.name}</p>
                        {image.caption ? (
                          <p className="text-sm font-medium text-primary mb-2 line-clamp-2">
                            {image.caption}
                          </p>
                        ) : (
                          <p className="text-sm text-text/60 italic mb-2">No caption</p>
                        )}
                        {image.category && (
                          <span className="inline-block bg-accent/30 text-primary text-xs px-2 py-1 rounded-full mb-2">
                            {image.category}
                          </span>
                        )}
                        <button
                          onClick={() => handleEdit(image)}
                          className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 text-sm"
                        >
                          Edit Caption
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManagement;
