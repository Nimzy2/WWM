import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSubscriberDetails, unsubscribeFromNewsletter, resubscribeToNewsletter } from '../newsletterHelpers';

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [subscriber, setSubscriber] = useState(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      checkSubscription(emailParam);
    }
  }, [searchParams]);

  const checkSubscription = async (emailAddress) => {
    const result = await getSubscriberDetails(emailAddress);
    
    if (result.success) {
      setSubscriber(result.data);
      if (!result.data.is_active) {
        setMessage({ type: 'info', text: 'This email is already unsubscribed from our newsletter.' });
      }
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setMessage({ type: '', text: '' });
    setSubscriber(null);
  };

  const handleCheckSubscription = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter an email address.' });
      return;
    }
    checkSubscription(email);
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    const result = await unsubscribeFromNewsletter(email);
    
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    
    if (result.success) {
      setSubscriber(prev => prev ? { ...prev, is_active: false } : null);
    }
    
    setLoading(false);
  };

  const handleResubscribe = async () => {
    setLoading(true);
    const result = await resubscribeToNewsletter(email);
    
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    
    if (result.success) {
      setSubscriber(prev => prev ? { ...prev, is_active: true } : null);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Newsletter Preferences</h1>
            <p className="text-text">
              Manage your newsletter subscription preferences
            </p>
          </div>

          {/* Email Input Form */}
          <form onSubmit={handleCheckSubscription} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
              >
                Check Subscription
              </button>
            </div>
          </form>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : message.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Subscription Details */}
          {subscriber && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Subscription Details</h3>
              <div className="space-y-2 text-text">
                <p><strong>Email:</strong> {subscriber.email}</p>
                {subscriber.first_name && <p><strong>Name:</strong> {subscriber.first_name} {subscriber.last_name}</p>}
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    subscriber.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscriber.is_active ? 'Subscribed' : 'Unsubscribed'}
                  </span>
                </p>
                <p><strong>Subscribed:</strong> {new Date(subscriber.subscribed_at).toLocaleDateString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {subscriber.is_active ? (
                  <button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                  </button>
                ) : (
                  <button
                    onClick={handleResubscribe}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Resubscribing...' : 'Resubscribe'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="text-center text-sm text-text">
            <p className="mb-2">
              Need help? Contact us at{' '}
              <a href="mailto:info@worldmarchofwomenkenya.org" className="text-primary hover:text-accent">
                info@worldmarchofwomenkenya.org
              </a>
            </p>
            <p>
              You can also{' '}
              <a href="/" className="text-primary hover:text-accent">
                return to our homepage
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe; 