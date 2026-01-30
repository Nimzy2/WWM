import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { uploadGalleryImages } from '../supabaseHelpers';
import Notification from './Notification';
import ProtectedRoute from './ProtectedRoute';

const GalleryAdmin = () => {
  const { isAuthenticated } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Filter for image files only
    const imageFiles = Array.from(files).filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
    });

    if (imageFiles.length === 0) {
      showNotification('Please select image files only (jpg, jpeg, png, gif, webp, svg)', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress({ current: 0, total: imageFiles.length });

      const results = await uploadGalleryImages(imageFiles, (current, total) => {
        setUploadProgress({ current, total });
      });

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        showNotification(
          `Successfully uploaded ${successCount} ${successCount === 1 ? 'image' : 'images'}${failCount > 0 ? ` (${failCount} failed)` : ''}`,
          failCount > 0 ? 'warning' : 'success'
        );
      } else {
        showNotification('Failed to upload images. Please check your Supabase Storage configuration.', 'error');
      }

      // Reset inputs
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (folderInputRef.current) folderInputRef.current.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.message || 'Failed to upload images. Please try again.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFolderSelect = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  if (!isAuthenticated) {
    return <ProtectedRoute allowedRoles={['admin']} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/30 to-white py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-primary/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
              Upload Gallery Images
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-text/70 max-w-2xl mx-auto mb-4">
              Upload images to the gallery. You can select multiple images or upload a folder of images.
            </p>
            <Link
              to="/admin/gallery/manage"
              className="inline-flex items-center text-primary hover:text-accent font-semibold transition-colors duration-300 group"
            >
              Manage Image Captions
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <Notification message={notification.message} type={notification.type} />

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-accent/50 bg-background/50 hover:border-primary hover:bg-primary/5'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory=""
              directory=""
              accept="image/*"
              onChange={handleFolderSelect}
              className="hidden"
              id="folder-upload"
              disabled={uploading}
            />

            <div className="space-y-6">
              {/* Icon */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {dragActive ? 'Drop images here' : 'Upload Gallery Images'}
                </h3>
                <p className="text-text/70 mb-6">
                  Drag and drop images here, or click the buttons below to select files
                </p>
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label
                  htmlFor="file-upload"
                  className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg cursor-pointer hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select Images
                </label>
                <label
                  htmlFor="folder-upload"
                  className="px-8 py-4 bg-accent text-primary rounded-full font-bold text-lg cursor-pointer hover:bg-purple-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Folder
                </label>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Uploading...
                    </span>
                    <span className="text-sm text-text/70">
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="mt-8 pt-8 border-t border-accent/30">
                <p className="text-sm text-text/60">
                  Supported formats: JPG, JPEG, PNG, GIF, WEBP, SVG
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-background/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upload Tips
            </h3>
            <ul className="space-y-2 text-text/70 text-sm">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Images are automatically optimized and displayed in the gallery</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>You can upload multiple images at once</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>When uploading a folder, all images in the folder will be uploaded</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Images are stored in Supabase Storage and are publicly accessible</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryAdmin;
