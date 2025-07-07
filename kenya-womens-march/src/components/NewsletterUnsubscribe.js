import React, { useState } from 'react';
import { unsubscribeFromNewsletter, validateEmail } from '../newsletterHelpers';

const NewsletterUnsubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    const result = await unsubscribeFromNewsletter(email);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Unsubscribe from Newsletter</h2>
        <p className="mb-6 text-center text-text">Enter your email address to unsubscribe from our newsletter.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Unsubscribe'}
          </button>
          {message.text && (
            <div className={`mt-3 p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe; 