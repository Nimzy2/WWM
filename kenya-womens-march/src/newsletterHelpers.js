import { supabase } from './supabaseClient';

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return { success: false, message: 'This email is already subscribed to our newsletter.' };
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            is_active: true
          })
          .eq('email', email);

        if (updateError) throw updateError;
        return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          is_active: true
        });

      if (insertError) throw insertError;
      return { success: true, message: 'Thank you for subscribing! You\'ll receive our updates soon.' };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    alert(JSON.stringify(error));
    return { success: false, message: 'Something went wrong. Please try again later.' };
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (email) => {
  try {
    const trimmedEmail = email.trim();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ 
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .ilike('email', trimmedEmail);
    if (error) throw error;
    return { success: true, message: 'You have been successfully unsubscribed from our newsletter.' };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    alert(JSON.stringify(error));
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

// Resubscribe to newsletter
export const resubscribeToNewsletter = async (email) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ 
        is_active: true, 
        unsubscribed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
    return { success: true, message: 'You have been successfully resubscribed to our newsletter!' };
  } catch (error) {
    console.error('Resubscribe error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

// Get subscriber details
export const getSubscriberDetails = async (email) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, message: 'Email address not found in our subscriber list.' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error getting subscriber details:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

// Get all subscribers (for admin)
export const getAllSubscribers = async (filters = {}) => {
  try {
    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order(filters.sortBy || 'subscribed_at', { ascending: filters.sortOrder === 'asc' });

    if (filters.status === 'active') {
      query = query.eq('is_active', true);
    } else if (filters.status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (filters.search) {
      query = query.or(`email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return { success: false, message: 'Failed to load subscribers.' };
  }
};

// Bulk update subscribers (for admin)
export const bulkUpdateSubscribers = async (subscriberIds, updates) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update(updates)
      .in('id', subscriberIds);

    if (error) throw error;
    return { success: true, message: `${subscriberIds.length} subscribers updated successfully.` };
  } catch (error) {
    console.error('Bulk update error:', error);
    return { success: false, message: 'Failed to update subscribers.' };
  }
};

// Delete subscribers (for admin)
export const deleteSubscribers = async (subscriberIds) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .in('id', subscriberIds);

    if (error) throw error;
    return { success: true, message: `${subscriberIds.length} subscribers deleted successfully.` };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Failed to delete subscribers.' };
  }
};

// Get subscriber statistics
export const getSubscriberStats = async () => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('is_active, subscribed_at');

    if (error) throw error;

    const total = data.length;
    const active = data.filter(sub => sub.is_active).length;
    const inactive = total - active;

    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = data.filter(sub => new Date(sub.subscribed_at) > thirtyDaysAgo).length;

    return {
      success: true,
      stats: {
        total,
        active,
        inactive,
        recent
      }
    };
  } catch (error) {
    console.error('Error getting subscriber stats:', error);
    return { success: false, message: 'Failed to load statistics.' };
  }
};

// Validate email format
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}; 