import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { createBlog, updateBlog, fetchBlogById } from '../supabaseHelpers';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import Notification from './Notification';

// Configure PDF.js worker - use .mjs format (ES modules) for version 5.4.394+
if (typeof window !== 'undefined') {
  const version = pdfjsLib.version || '5.4.394';
  
  // Version 5.4.394+ uses .mjs format instead of .js
  // Try local file first (most reliable), then fallback to CDN
  // To download the worker file manually:
  // 1. Visit: https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs
  // 2. Save the file as pdf.worker.min.mjs in the public folder
  const localWorkerPath = '/pdf.worker.min.mjs';
  
  // Use local file if available, otherwise use CDN
  // The browser will automatically try the local file first
  pdfjsLib.GlobalWorkerOptions.workerSrc = localWorkerPath;
  
  // If local file doesn't exist, the code will try CDN as fallback in handlePDFUpload
}

const PostEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { logout, isWriter } = useAdmin();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author: 'WMW Kenya',
    image: '',
    tags: '',
    published: false,
    date: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  const categories = [
    'Rights',
    'Health',
    'Economy',
    'Education',
    'Politics',
    'Community',
    'Events',
    'News'
  ];

  useEffect(() => {
    if (isEditing) {
      loadPost();
    } else {
      // Set default date to today for new posts
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await fetchBlogById(id);
      
      // Format date for input field (YYYY-MM-DD)
      let dateValue = '';
      if (post.created_at) {
        const date = new Date(post.created_at);
        dateValue = date.toISOString().split('T')[0];
      } else if (post.date) {
        // If there's a date field, use it
        const date = new Date(post.date);
        dateValue = date.toISOString().split('T')[0];
      }
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        author: post.author || 'WMW Kenya',
        image: post.image || post.image_url || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        published: post.published || false,
        date: dateValue
      });
    } catch (err) {
      setError('Failed to load post. Please try again.');
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

  const handleImageUrlChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll use a local preview
      // In production, you'd upload to Supabase Storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Processing document...');
    setError('');

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'docx' || fileExtension === 'doc') {
        // Handle Word document
        await handleWordUpload(file);
      } else if (fileExtension === 'pdf') {
        // Handle PDF document
        await handlePDFUpload(file);
      } else {
        throw new Error('Unsupported file format. Please upload a .docx, .doc, or .pdf file.');
      }
    } catch (err) {
      setError(err.message || 'Failed to process document. Please try again.');
      setUploadStatus('');
      console.error('Document upload error:', err);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleWordUpload = async (file) => {
    try {
      setUploadStatus('Reading Word document...');
      const arrayBuffer = await file.arrayBuffer();
      
      setUploadStatus('Converting to text...');
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      // Also try to get HTML for better formatting
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      
      // Use HTML if available, otherwise use plain text
      const content = htmlResult.value || result.value;
      
      // Convert HTML to markdown-like format or keep as HTML
      // For simplicity, we'll store it as-is and it will be rendered
      setFormData(prev => ({
        ...prev,
        content: content || result.value
      }));
      
      // Try to extract title from first line if title is empty
      if (!formData.title && result.value) {
        const firstLine = result.value.split('\n')[0].trim();
        if (firstLine && firstLine.length < 100) {
          setFormData(prev => ({
            ...prev,
            title: firstLine
          }));
        }
      }
      
      setUploadStatus('Document processed successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      throw new Error('Failed to read Word document: ' + err.message);
    }
  };

  const handlePDFUpload = async (file) => {
    try {
      setUploadStatus('Reading PDF document...');
      const arrayBuffer = await file.arrayBuffer();
      
      setUploadStatus('Extracting text from PDF...');
      
      // Ensure worker is configured - use .mjs format for version 5.4.394+
      const version = pdfjsLib.version || '5.4.394';
      const localWorkerPath = '/pdf.worker.min.mjs';
      
      // Try multiple CDN sources as fallbacks
      const cdnOptions = [
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
        `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
      ];
      
      // Set worker source - try local first, update if using old .js format
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc || pdfjsLib.GlobalWorkerOptions.workerSrc.includes('.js')) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = localWorkerPath;
      }
      
      let pdf;
      let lastError = null;
      
      // Try local file first
      try {
        pdf = await pdfjsLib.getDocument({ 
          data: arrayBuffer
        }).promise;
      } catch (workerError) {
        lastError = workerError;
        // If local worker fails, try CDN fallbacks
        if (workerError.message && (workerError.message.includes('worker') || workerError.message.includes('Failed to fetch'))) {
          for (const cdnPath of cdnOptions) {
            try {
              pdfjsLib.GlobalWorkerOptions.workerSrc = cdnPath;
              pdf = await pdfjsLib.getDocument({ 
                data: arrayBuffer
              }).promise;
              break; // Success, exit loop
            } catch (cdnError) {
              lastError = cdnError;
              continue; // Try next CDN
            }
          }
        }
        
        // If all attempts failed, throw the last error
        if (!pdf) {
          throw lastError;
        }
      }
      
      let fullText = '';
      const numPages = pdf.numPages;
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setUploadStatus(`Processing page ${pageNum} of ${numPages}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No text could be extracted from the PDF. The PDF might be image-based or encrypted.');
      }
      
      setFormData(prev => ({
        ...prev,
        content: fullText.trim()
      }));
      
      // Try to extract title from first line if title is empty
      if (!formData.title && fullText) {
        const firstLine = fullText.split('\n')[0].trim();
        if (firstLine && firstLine.length < 100) {
          setFormData(prev => ({
            ...prev,
            title: firstLine
          }));
        }
      }
      
      setUploadStatus('PDF processed successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      // Provide more helpful error messages
      let errorMessage = 'Failed to read PDF: ';
      
      if (err.message && (err.message.includes('worker') || err.message.includes('Failed to fetch') || err.message.includes('dynamically imported'))) {
        errorMessage += 'PDF.js worker failed to load. To fix this:\n\n1. Download the worker file from: https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs\n2. Save it as "pdf.worker.min.mjs" in the public folder\n3. Refresh the page and try again.\n\nNote: Version 5.4.394 uses .mjs format (not .js). See DOWNLOAD_PDF_WORKER.md for detailed instructions.';
      } else if (err.message && err.message.includes('Invalid PDF')) {
        errorMessage += 'The file appears to be corrupted or not a valid PDF.';
      } else if (err.message && err.message.includes('password')) {
        errorMessage += 'This PDF is password protected and cannot be processed.';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Prepare tags
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Build post data - start with only the most basic required fields
      // This ensures compatibility even if some columns don't exist
      const postData = {
        title: formData.title,
        content: formData.content
      };

      // Add optional fields only if they have values
      if (formData.excerpt && formData.excerpt.trim()) {
        postData.excerpt = formData.excerpt.trim();
      }
      if (formData.category && formData.category.trim()) {
        postData.category = formData.category.trim();
      }
      if (formData.author && formData.author.trim()) {
        postData.author = formData.author.trim();
      }
      // Only add image if it exists and has a value (don't fail if column doesn't exist)
      // We'll catch the error and retry without it if needed
      if (formData.image && formData.image.trim()) {
        postData.image = formData.image.trim();
      }

      // Only add timestamp if the column exists - try without it first if needed
      // For now, let's try without updated_at to see if that's the issue
      // postData.updated_at = new Date().toISOString();

      // Try to add published field, but don't fail if column doesn't exist
      // We'll catch the error and retry without it if needed
      if (formData.published !== undefined && formData.published !== null) {
        postData.published = Boolean(formData.published);
      }

      // Only add tags if we have tags (avoid sending empty arrays)
      if (tagsArray.length > 0) {
        postData.tags = tagsArray;
      }

      // Handle date - use custom date if provided, otherwise use current date
      const postDate = formData.date 
        ? new Date(formData.date + 'T00:00:00').toISOString()
        : new Date().toISOString();
      
      if (!isEditing) {
        postData.created_at = postDate;
        // Only add published_at if published is true and column might exist
        if (formData.published && postData.published) {
          postData.published_at = postDate;
        }
      } else {
        // For editing, update created_at if date is changed
        if (formData.date) {
          postData.created_at = postDate;
        }
      }

      console.log('Saving post data:', postData);

      try {
        if (isEditing) {
          await updateBlog(id, postData);
        } else {
          await createBlog(postData);
        }
        // Show success notification
        setNotification({ 
          message: isEditing ? 'Post updated successfully!' : 'Post created successfully!', 
          type: 'success' 
        });
        // Navigate after a short delay to show notification
        setTimeout(() => {
          navigate('/admin/posts');
          // Scroll to top after navigation
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
      } catch (dbError) {
        // If we get a column error, try again without optional fields
        if (dbError.message?.includes('column') || dbError.message?.includes('does not exist') || dbError.message?.includes('400')) {
          console.log('Retrying with minimal fields (excluding problematic columns)...');
          // Retry with only essential fields, excluding image if it's causing issues
          const minimalData = {
            title: formData.title,
            content: formData.content
          };
          
          // Add optional fields that are likely to exist
          if (formData.excerpt) minimalData.excerpt = formData.excerpt;
          if (formData.category) minimalData.category = formData.category;
          if (formData.author) minimalData.author = formData.author;
          
          // Only add image if the error wasn't specifically about image column
          if (formData.image && !dbError.message?.includes('image')) {
            minimalData.image = formData.image;
          }
          
          // Add date
          const postDate = formData.date 
            ? new Date(formData.date + 'T00:00:00').toISOString()
            : new Date().toISOString();
          
          if (!isEditing) {
            minimalData.created_at = postDate;
          } else if (formData.date) {
            minimalData.created_at = postDate;
          }

          if (isEditing) {
            await updateBlog(id, minimalData);
          } else {
            await createBlog(minimalData);
          }
          // Show success notification
          setNotification({ 
            message: isEditing ? 'Post updated successfully!' : 'Post created successfully!', 
            type: 'success' 
          });
          // Navigate after a short delay to show notification
          setTimeout(() => {
            navigate('/admin/posts');
            // Scroll to top after navigation
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1500);
        } else {
          throw dbError; // Re-throw if it's a different error
        }
      }
    } catch (err) {
      console.error('Save error details:', err);
      // Show more detailed error message
      const errorMessage = err.message || err.error?.message || err.toString() || 'Failed to save post. Please try again.';
      setError(`Error: ${errorMessage}. Check the browser console (F12) for details. If you see column errors, run the migration script: supabase_blogs_table_complete.sql`);
      setNotification({ 
        message: errorMessage.includes('column') 
          ? 'Database column missing. Please run the migration script.' 
          : 'Failed to save post. Please try again.', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    // Check if content is already HTML (from Word document)
    const isHTML = formData.content && (
      formData.content.includes('<p>') || 
      formData.content.includes('<div>') || 
      formData.content.includes('<h1>') ||
      formData.content.includes('<br>')
    );

    let html;
    if (isHTML) {
      // Content is already HTML from Word document
      html = formData.content;
    } else {
      // Content is markdown, convert it
      html = marked.parse(formData.content || '');
    }
    
    const sanitizedHtml = DOMPurify.sanitize(html);

    return (
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-accent">Loading post...</div>
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
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-white/80 mt-1">
                {isWriter ? 'Create and manage your blog post' : 'Write and manage your blog post'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/posts')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                ← Back to Posts
              </button>
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-primary mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter post title"
                />
              </div>

              {/* Document Upload */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-primary mb-2">
                  Upload Document (Word or PDF)
                </label>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleDocumentUpload}
                  disabled={uploading}
                  className="w-full text-sm text-text mb-2"
                />
                {uploadStatus && (
                  <p className={`text-xs mt-2 ${
                    uploadStatus.includes('successfully') 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`}>
                    {uploadStatus}
                  </p>
                )}
                <p className="text-xs text-accent mt-1">
                  Upload a Word (.docx, .doc) or PDF (.pdf) file to automatically populate the content field.
                </p>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-sm font-semibold text-primary">
                    Content * (Markdown supported, or upload Word/PDF above)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="text-sm text-primary hover:text-accent font-semibold"
                    disabled={uploading}
                  >
                    {preview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {preview ? (
                  <div className="border border-accent rounded-lg p-4 min-h-[400px] bg-gray-50">
                    {renderPreview()}
                  </div>
                ) : (
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={20}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Write your post content here, use Markdown formatting, or upload a Word/PDF document above..."
                  />
                )}
                <p className="text-xs text-accent mt-2">
                  Markdown tips: Use **bold**, *italic*, # for headings, - for lists
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-semibold text-primary mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief summary of the post (optional)"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-4">Publish Settings</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="rounded border-accent text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text">Publish immediately</span>
                </label>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-primary mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-semibold text-primary mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Author name"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-primary mb-2">
                  Publication Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-accent mt-1">Leave empty to use current date</p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-primary mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-accent mt-1">Separate tags with commas</p>
              </div>

              {/* Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-semibold text-primary mb-2">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-accent mb-2">Or upload an image:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-sm text-text"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-accent"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="px-6 py-2 border border-accent text-primary rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostEditor;

