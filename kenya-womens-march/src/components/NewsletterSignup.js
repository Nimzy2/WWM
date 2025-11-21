import React, { useState } from 'react';
import { subscribeToNewsletter, validateEmail } from '../newsletterHelpers';

const NewsletterSignup = ({ 
  variant = 'default', 
  title = "Stay Updated", 
  subtitle = "Subscribe to our newsletter for the latest updates, stories, and opportunities.",
  showNameFields = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate email
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }

    const result = await subscribeToNewsletter(
      formData.email, 
      formData.first_name, 
      formData.last_name
    );

    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    // Clear form on success
    if (result.success) {
      setFormData({ email: '', first_name: '', last_name: '' });
    }

    setLoading(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: "bg-transparent rounded-lg p-0",
          title: "text-base md:text-lg font-bold text-primary mb-2",
          subtitle: "text-xs md:text-sm text-text mb-3 md:mb-4",
          input: "w-full px-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm md:text-base bg-white",
          button: "w-full sm:w-auto bg-gradient-to-r from-primary to-purple-700 text-white px-8 py-3 md:py-4 rounded-xl font-bold hover:from-purple-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
        };
      case 'footer':
        return {
          container: "bg-primary/10 rounded-lg p-3 md:p-4",
          title: "text-base md:text-lg font-bold text-primary mb-2",
          subtitle: "text-xs md:text-sm text-text mb-3 md:mb-4",
          input: "w-full px-3 py-2 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base",
          button: "w-full bg-primary text-white px-4 py-2 md:py-3 rounded-md font-semibold hover:bg-accent transition-colors duration-200 text-sm md:text-base"
        };
      default:
        return {
          container: "bg-primary text-white py-8 md:py-12 px-4 md:px-6 rounded-lg",
          title: "text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-white",
          subtitle: "text-sm md:text-base text-accent mb-4 md:mb-6",
          input: "flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm md:text-base",
          button: "bg-white text-primary px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200 text-sm md:text-base"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {showNameFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              className={styles.input}
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              className={styles.input}
            />
          </div>
        )}
        
        <div className={variant === 'default' ? "flex flex-col sm:flex-row gap-3 md:gap-4" : variant === 'compact' ? "flex flex-col sm:flex-row gap-4" : "space-y-3 md:space-y-4"}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={styles.input}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {message.text && (
          <div className={`mt-3 p-3 rounded-md text-xs md:text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsletterSignup; 