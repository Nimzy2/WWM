import { supabase } from './supabaseClient';

// BLOGS CRUD
export async function fetchBlogs() {
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchBlogById(id) {
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createBlog(blog) {
  const { data, error } = await supabase.from('blogs').insert([blog]).single();
  if (error) throw error;
  return data;
}

export async function updateBlog(id, updates) {
  const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteBlog(id) {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
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