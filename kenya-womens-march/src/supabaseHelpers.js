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