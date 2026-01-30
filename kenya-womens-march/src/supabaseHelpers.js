import { supabase } from './supabaseClient';

// BLOGS CRUD
export async function fetchBlogs(limit = null) {
  // Only fetch published blogs for public view
  // Exclude content field for better performance when listing
  let query = supabase
    .from('blogs')
    .select('id, title, excerpt, category, author, image, image_url, tags, published, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  let { data, error } = await query;
  if (error) {
    // If optimized query fails, fallback to select all
    console.warn('Optimized query failed, falling back to select all:', error.message);
    let fallbackQuery = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit);
    }
    
    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  return data;
}

export async function fetchBlogById(id) {
  // For public view, only fetch published blogs
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();
  if (error) {
    // If published column doesn't exist, fall back to fetching without filter
    const { data: allData, error: allError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    if (allError) throw allError;
    return allData;
  }
  return data;
}

export async function createBlog(blog) {
  try {
    const { data, error } = await supabase.from('blogs').insert([blog]).select().single();
    if (error) {
      console.error('Create blog error:', error);
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        throw new Error(`Database column error: ${error.message}. Please run the migration script (supabase_blogs_table_complete.sql) to add missing columns.`);
      }
      throw new Error(error.message || 'Failed to create blog post');
    }
    return data;
  } catch (err) {
    // Re-throw with more context
    if (err.message) throw err;
    throw new Error('Failed to create blog post: ' + (err.message || 'Unknown error'));
  }
}

export async function updateBlog(id, updates) {
  try {
    const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).select().single();
    if (error) {
      console.error('Update blog error:', error);
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        throw new Error(`Database column error: ${error.message}. Please run the migration script (supabase_blogs_table_complete.sql) to add missing columns.`);
      }
      throw new Error(error.message || 'Failed to update blog post');
    }
    return data;
  } catch (err) {
    // Re-throw with more context
    if (err.message) throw err;
    throw new Error('Failed to update blog post: ' + (err.message || 'Unknown error'));
  }
}

export async function deleteBlog(id) {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
}

// Admin functions for blog management
export async function publishBlog(id) {
  try {
    // Try with published and published_at first
    let updateData = { published: true };
    
    // Only add published_at if the column might exist
    // We'll try without it if it fails
    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      // If error is about published column, try a different approach
      if (error.message?.includes('column') || error.message?.includes('does not exist') || error.code === 'PGRST116') {
        throw new Error('The "published" column does not exist in your database. Please run the migration script: supabase_blogs_table_complete.sql');
      }
      throw error;
    }
    
    // Try to update published_at separately (don't fail if it doesn't exist)
    try {
      await supabase
        .from('blogs')
        .update({ published_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {
      // Ignore if published_at column doesn't exist
      console.log('published_at column may not exist, continuing...');
    }
    
    return data;
  } catch (err) {
    console.error('Publish blog error:', err);
    throw new Error(err.message || 'Failed to publish blog post');
  }
}

export async function unpublishBlog(id) {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .update({ published: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      // If error is about published column, provide helpful message
      if (error.message?.includes('column') || error.message?.includes('does not exist') || error.code === 'PGRST116') {
        throw new Error('The "published" column does not exist in your database. Please run the migration script: supabase_blogs_table_complete.sql');
      }
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Unpublish blog error:', err);
    throw new Error(err.message || 'Failed to unpublish blog post');
  }
}

export async function fetchAllBlogs(includeUnpublished = false, limit = null) {
  // Try optimized query first (exclude content for better performance)
  // Only select essential fields for list view
  let query = supabase.from('blogs').select('id, title, excerpt, category, author, image, image_url, tags, published, created_at');
  
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  let { data, error } = await query;
  
  // If optimized query fails (maybe some columns don't exist), fallback to select all
  if (error) {
    console.warn('Optimized query failed, falling back to select all:', error.message);
    let fallbackQuery = supabase.from('blogs').select('*');
    
    if (!includeUnpublished) {
      fallbackQuery = fallbackQuery.eq('published', true);
    }
    
    fallbackQuery = fallbackQuery.order('created_at', { ascending: false });
    
    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit);
    }
    
    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  
  return data;
}

export async function getBlogStats() {
  const { data: allBlogs, error } = await supabase
    .from('blogs')
    .select('id, published, created_at');
  
  if (error) throw error;
  
  const total = allBlogs?.length || 0;
  const published = allBlogs?.filter(b => b.published)?.length || 0;
  const unpublished = total - published;
  
  // Get recent posts (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = allBlogs?.filter(b => 
    new Date(b.created_at) >= thirtyDaysAgo
  )?.length || 0;
  
  return {
    total,
    published,
    unpublished,
    recent
  };
}

// Image upload helper (for Supabase Storage - if configured)
export async function uploadImage(file, path = 'blog-images') {
  // For now, we'll return a placeholder URL
  // In production, you would upload to Supabase Storage
  // This is a simplified version that expects image URLs
  return {
    url: URL.createObjectURL(file), // Temporary local URL
    path: `${path}/${Date.now()}-${file.name}`
  };
}

// Publication file upload helper (PDF, Word documents)
export async function uploadPublicationFile(file) {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to upload files. Please log in and try again.');
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedTypes = ['pdf', 'doc', 'docx'];
    
    if (!allowedTypes.includes(fileExtension)) {
      throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit. Please upload a smaller file.');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `publications/${timestamp}-${sanitizedFileName}`;

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Path:', filePath);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('publications')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      
      // Provide specific error messages
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found') || error.statusCode === 404) {
        throw new Error('Storage bucket "publications" not found. Please create it in Supabase Storage (Storage → New bucket → Name: "publications" → Public).');
      }
      
      if (error.message?.includes('new row violates row-level security') || error.message?.includes('permission denied') || error.statusCode === 403) {
        throw new Error('Permission denied. Please check your Supabase Storage policies. The bucket needs policies to allow authenticated users to upload files.');
      }
      
      if (error.message?.includes('duplicate') || error.statusCode === 409) {
        throw new Error('A file with this name already exists. Please rename your file and try again.');
      }
      
      // Generic error with details
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}. Please check your Supabase Storage configuration.`);
    }

    if (!data) {
      throw new Error('Upload failed: No data returned from storage.');
    }

    console.log('File uploaded successfully:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('publications')
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file.');
    }

    console.log('Public URL:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath,
      fileName: file.name,
      fileSize: file.size
    };
  } catch (err) {
    console.error('File upload error details:', {
      message: err.message,
      error: err,
      fileName: file?.name,
      fileSize: file?.size
    });
    
    // Re-throw with user-friendly message
    if (err.message) {
      throw err;
    }
    throw new Error('Failed to upload file. Please try again or check your Supabase Storage configuration.');
  }
}

// NEWSLETTER SUBSCRIBERS CRUD
export async function fetchSubscribers() {
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addSubscriber(email) {
  const { data, error } = await supabase.from('newsletter_subscribers').insert([{ email, is_active: true }]).single();
  if (error) throw error;
  return data;
}

export async function removeSubscriber(id) {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) throw error;
}

// CONTACT MESSAGES CRUD
export async function fetchContactMessages() {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addContactMessage(message) {
  const { data, error } = await supabase.from('contact_messages').insert([message]).single();
  if (error) throw error;
  return data;
}

export async function deleteContactMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

// JOIN REQUESTS CRUD
export async function fetchJoinRequests() {
  const { data, error } = await supabase.from('join_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addJoinRequest(request) {
  const { data, error } = await supabase.from('join_requests').insert([request]).single();
  if (error) throw error;
  return data;
} 

export async function updateJoinRequest(id, updates) {
  const { data, error } = await supabase
    .from('join_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJoinRequest(id) {
  const { error } = await supabase
    .from('join_requests')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// COMMENTS CRUD
export async function fetchCommentsByBlogId(blogId) {
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('blog_id', blogId)
    .order('created_at', { ascending: true });
  
  if (error) {
    // If table doesn't exist, return empty array
    if (error.code === '42P01') {
      console.warn('blog_comments table does not exist yet');
      return [];
    }
    throw error;
  }
  return data || [];
}

export async function createComment(comment) {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert([{
      blog_id: comment.blogId,
      name: comment.name,
      email: comment.email,
      comment: comment.comment
    }])
    .select()
    .single();
  
  if (error) {
    // If table doesn't exist, log warning
    if (error.code === '42P01') {
      console.warn('blog_comments table does not exist. Please create it first.');
      throw new Error('Comments feature is not set up yet. Please contact the administrator.');
    }
    throw error;
  }
  return data;
}

// PUBLICATIONS CRUD
export async function fetchPublications(limit = null) {
  let query = supabase
    .from('publications')
    .select('id, title, description, author, authors, publication_date, category, file_url, file_name, thumbnail_url, tags, published, created_at')
    .eq('published', true)
    .order('publication_date', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  if (error) {
    console.warn('Publications query failed:', error.message);
    // Fallback to select all
    let fallbackQuery = supabase
      .from('publications')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit);
    }
    
    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  return data;
}

export async function fetchPublicationById(id, includeUnpublished = false) {
  let query = supabase
    .from('publications')
    .select('*')
    .eq('id', id);
  
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }
  
  const { data, error } = await query.single();
  
  if (error) {
    // Fallback without published filter if needed
    if (!includeUnpublished) {
      const { data: allData, error: allError } = await supabase
        .from('publications')
        .select('*')
        .eq('id', id)
        .single();
      if (allError) throw allError;
      return allData;
    }
    throw error;
  }
  return data;
}

export async function createPublication(publication) {
  try {
    const { data, error } = await supabase
      .from('publications')
      .insert([publication])
      .select()
      .single();
    
    if (error) {
      console.error('Create publication error:', error);
      throw new Error(error.message || 'Failed to create publication');
    }
    return data;
  } catch (err) {
    if (err.message) throw err;
    throw new Error('Failed to create publication: ' + (err.message || 'Unknown error'));
  }
}

export async function updatePublication(id, updates) {
  try {
    const { data, error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update publication error:', error);
      throw new Error(error.message || 'Failed to update publication');
    }
    return data;
  } catch (err) {
    if (err.message) throw err;
    throw new Error('Failed to update publication: ' + (err.message || 'Unknown error'));
  }
}

export async function deletePublication(id) {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function fetchAllPublications(includeUnpublished = false, limit = null) {
  let query = supabase
    .from('publications')
    .select('id, title, description, author, authors, publication_date, category, file_url, file_name, thumbnail_url, tags, published, created_at');
  
  if (!includeUnpublished) {
    query = query.eq('published', true);
  }
  
  query = query.order('publication_date', { ascending: false });
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.warn('Publications query failed, falling back:', error.message);
    let fallbackQuery = supabase.from('publications').select('*');
    
    if (!includeUnpublished) {
      fallbackQuery = fallbackQuery.eq('published', true);
    }
    
    fallbackQuery = fallbackQuery.order('created_at', { ascending: false });
    
    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit);
    }
    
    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw fallbackResult.error;
    return fallbackResult.data;
  }
  
  return data;
}

export async function publishPublication(id) {
  try {
    const { data, error } = await supabase
      .from('publications')
      .update({ published: true, published_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Publish publication error:', err);
    throw new Error(err.message || 'Failed to publish publication');
  }
}

export async function unpublishPublication(id) {
  try {
    const { data, error } = await supabase
      .from('publications')
      .update({ published: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Unpublish publication error:', err);
    throw new Error(err.message || 'Failed to unpublish publication');
  }
}

export async function getPublicationStats() {
  const { data: allPublications, error } = await supabase
    .from('publications')
    .select('id, published, created_at');
  
  if (error) throw error;
  
  const total = allPublications?.length || 0;
  const published = allPublications?.filter(p => p.published)?.length || 0;
  const unpublished = total - published;
  
  // Get recent publications (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = allPublications?.filter(p => 
    new Date(p.created_at) >= thirtyDaysAgo
  )?.length || 0;
  
  return {
    total,
    published,
    unpublished,
    recent
  };
}

// GALLERY IMAGES CRUD
export async function fetchGalleryImages() {
  try {
    // List all images from the gallery bucket
    const { data, error: listError } = await supabase.storage
      .from('gallery')
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      // If bucket doesn't exist, return empty array with helpful message
      if (listError.message?.includes('not found') || 
          listError.message?.includes('Bucket') || 
          listError.statusCode === 404 ||
          listError.message?.includes('does not exist')) {
        console.warn('Gallery bucket not found. Please create it in Supabase Storage.');
        // Return empty array instead of throwing to show "No Images" message
        return [];
      }
      // For other errors, throw to show error message
      throw new Error(listError.message || 'Failed to fetch gallery images');
    }

    // If no data, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Filter for image files only
    const imageFiles = data.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
    });

    // Fetch metadata from database (captions, etc.)
    let metadataMap = {};
    try {
      const { data: metadata, error: metadataError } = await supabase
        .from('gallery_images')
        .select('*');
      
      if (!metadataError && metadata) {
        metadata.forEach(item => {
          metadataMap[item.file_name] = item;
        });
      }
    } catch (metadataErr) {
      // If table doesn't exist yet, continue without metadata
      console.warn('Gallery metadata table not found. Captions will not be available until table is created.');
    }

    // Get public URLs for all images and merge with metadata
    const imageUrls = imageFiles.map(file => {
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(file.name);

      const metadata = metadataMap[file.name] || {};

      return {
        id: metadata.id || file.id || file.name,
        name: file.name,
        url: urlData.publicUrl,
        caption: metadata.caption || null,
        alt_text: metadata.alt_text || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: metadata.category || null,
        tags: metadata.tags || [],
        display_order: metadata.display_order || 0,
        is_featured: metadata.is_featured || false,
        created_at: file.created_at,
        updated_at: file.updated_at
      };
    });

    // Sort by display_order, then by created_at
    imageUrls.sort((a, b) => {
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return imageUrls;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    // Re-throw with more context
    throw new Error(error.message || 'Failed to fetch gallery images from Supabase Storage');
  }
}

export async function uploadGalleryImages(files, onProgress = null) {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to upload images. Please log in and try again.');
    }

    const results = [];
    const fileArray = Array.isArray(files) ? files : [files];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      // Validate file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      
      if (!allowedTypes.includes(fileExtension)) {
        results.push({
          fileName: file.name,
          success: false,
          error: 'Invalid file type. Only image files are allowed.'
        });
        if (onProgress) onProgress(i + 1, fileArray.length);
        continue;
      }

      // Validate file size (max 10MB per image)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        results.push({
          fileName: file.name,
          success: false,
          error: 'File size exceeds 10MB limit.'
        });
        if (onProgress) onProgress(i + 1, fileArray.length);
        continue;
      }

      // Create a unique filename
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${timestamp}-${sanitizedFileName}`;

      try {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error(`Upload error for ${file.name}:`, error);
          
          // Provide specific error messages
          if (error.message?.includes('Bucket not found') || error.message?.includes('not found') || error.statusCode === 404) {
            results.push({
              fileName: file.name,
              success: false,
              error: 'Gallery bucket not found. Please create it in Supabase Storage.'
            });
          } else if (error.message?.includes('new row violates row-level security') || error.message?.includes('permission denied') || error.statusCode === 403) {
            results.push({
              fileName: file.name,
              success: false,
              error: 'Permission denied. Please check your Supabase Storage policies.'
            });
          } else if (error.message?.includes('duplicate') || error.statusCode === 409) {
            results.push({
              fileName: file.name,
              success: false,
              error: 'A file with this name already exists.'
            });
          } else {
            results.push({
              fileName: file.name,
              success: false,
              error: error.message || 'Upload failed'
            });
          }
        } else {
          // Create database entry for the image
          try {
            const { error: dbError } = await supabase
              .from('gallery_images')
              .insert({
                file_name: data.path, // Use the full path as stored in storage
                file_path: data.path,
                alt_text: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
              });

            if (dbError && !dbError.message?.includes('duplicate')) {
              console.warn(`Failed to create database entry for ${file.name}:`, dbError);
              // Continue anyway - image is uploaded, just no metadata
            }
          } catch (dbErr) {
            // If table doesn't exist yet, continue without metadata
            console.warn('Gallery metadata table not found. Image uploaded but no metadata created.');
          }

          results.push({
            fileName: file.name,
            success: true,
            path: data.path
          });
        }
      } catch (uploadError) {
        console.error(`Upload error for ${file.name}:`, uploadError);
        results.push({
          fileName: file.name,
          success: false,
          error: uploadError.message || 'Upload failed'
        });
      }

      if (onProgress) onProgress(i + 1, fileArray.length);
    }

    return results;
  } catch (err) {
    console.error('Gallery upload error:', err);
    throw new Error(err.message || 'Failed to upload images. Please try again or check your Supabase Storage configuration.');
  }
}

export async function deleteGalleryImage(fileName) {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to delete images.');
    }

    // Delete from storage
    const { error } = await supabase.storage
      .from('gallery')
      .remove([fileName]);

    if (error) {
      throw error;
    }

    // Delete from database
    try {
      await supabase
        .from('gallery_images')
        .delete()
        .eq('file_name', fileName);
    } catch (dbErr) {
      // If table doesn't exist, continue anyway
      console.warn('Could not delete from metadata table:', dbErr);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
}

// Update gallery image metadata (caption, alt_text, etc.)
export async function updateGalleryImageMetadata(fileName, metadata) {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to update image metadata.');
    }

    const row = {
      file_name: fileName,
      file_path: fileName,
      caption: metadata.caption || null,
      alt_text: metadata.alt_text || null,
      category: metadata.category || null,
      tags: metadata.tags || [],
      display_order: metadata.display_order || 0,
      is_featured: metadata.is_featured || false
    };

    // Upsert: insert or update on conflict (file_name is UNIQUE)
    const { data, error } = await supabase
      .from('gallery_images')
      .upsert(row, {
        onConflict: 'file_name',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      // Give a clearer message for common issues
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        throw new Error('Gallery captions table not set up. Run the SQL in supabase_gallery_images_table.sql in your Supabase SQL Editor.');
      }
      if (error.message?.includes('permission') || error.message?.includes('policy') || error.code === '42501') {
        throw new Error('Permission denied. Make sure you are logged in and the gallery_images table has policies for authenticated users.');
      }
      throw new Error(error.message || 'Failed to save caption.');
    }

    return data;
  } catch (error) {
    console.error('Error updating gallery image metadata:', error);
    throw error;
  }
}

// Get gallery image metadata
export async function getGalleryImageMetadata(fileName) {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('file_name', fileName)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching gallery image metadata:', error);
    throw error;
  }
}