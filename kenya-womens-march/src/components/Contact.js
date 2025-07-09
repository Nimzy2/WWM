import React, { useState } from 'react';
import { addContactMessage } from '../supabaseHelpers';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters long';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const messageData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        created_at: new Date().toISOString()
      };

      await addContactMessage(messageData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setShowPopup(true);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again in a moment.';
      } else if (error.message?.includes('database') || error.message?.includes('supabase')) {
        errorMessage = 'Database connection error. Please try again or contact us directly.';
      }
      
      setSubmitStatus('error');
      setErrors({ submit: errorMessage });
      
      // Clear error message after 8 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.submit;
          return newErrors;
        });
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200";
    const errorClasses = "border-red-500 focus:ring-red-500";
    const normalClasses = "border-accent focus:ring-primary";
    
    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-text mb-6 text-sm md:text-base">
                Thank you for your message! We will get back to you soon.
              </p>
              <button
                onClick={closePopup}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text max-w-3xl mx-auto px-4">
            Get in touch with us. We'd love to hear from you and answer any questions 
            you may have about our work and how you can get involved.
          </p>
        </div>

        {/* Error Status Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium text-sm md:text-base">{errors.submit || 'Sorry, there was an error sending your message. Please try again.'}</span>
                <p className="text-sm mt-1">If the problem persists, please email us directly at worldmarchofwomenkenya@gmail.com</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" role="form" aria-labelledby="contact-form-title">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                  Full Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={getInputClassName('name')}
                  placeholder="Enter your full name"
                  aria-required="true"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClassName('email')}
                  placeholder="Enter your email address"
                  aria-required="true"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-primary mb-2">
                  Subject <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={getInputClassName('subject')}
                  placeholder="Enter message subject"
                  aria-required="true"
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                  Message <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={getInputClassName('message')}
                  placeholder="Enter your message"
                  aria-required="true"
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary text-white py-3 md:py-4 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-describedby={isSubmitting ? 'submitting-status' : undefined}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {isSubmitting && (
                <p id="submitting-status" className="text-sm text-accent text-center" role="status">
                  Sending your message...
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* General Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">Get in Touch</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-sm md:text-base">Email</h4>
                    <p className="text-text text-sm md:text-base">worldmarchofwomenkenya@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-sm md:text-base">Address</h4>
                    <p className="text-text text-sm md:text-base">P.O. Box 16049-00100<br />Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-sm md:text-base">Response Time</h4>
                    <p className="text-text text-sm md:text-base">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">Follow Us</h3>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://www.facebook.com/share/1HdcjQTSUX/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-accent hover:bg-accent/10 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm md:text-base font-semibold text-primary">Facebook</span>
                </a>
                <a 
                  href="https://www.instagram.com/wmw.kenya?igsh=eHlieHJmODh1aWg2&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-accent hover:bg-accent/10 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm md:text-base font-semibold text-primary">Instagram</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/the-world-march-of-women-kenya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-accent hover:bg-accent/10 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm md:text-base font-semibold text-primary">LinkedIn</span>
                </a>
                <a 
                  href="https://x.com/Wmwkenya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg border border-accent hover:bg-accent/10 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm md:text-base font-semibold text-primary">X (Twitter)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 