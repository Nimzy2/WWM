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
  const [focusedField, setFocusedField] = useState(null);

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
    const baseClasses = "w-full px-5 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-text placeholder:text-accent/60";
    const errorClasses = "border-red-400 focus:border-red-500 focus:ring-red-500/50";
    const normalClasses = "border-accent/30 focus:border-primary focus:ring-primary/30";
    const focusedClasses = focusedField === fieldName ? "shadow-lg scale-[1.01]" : "";
    
    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses} ${focusedClasses}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Success Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100 animate-fade-in-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Message Sent Successfully!
              </h3>
              <p className="text-text mb-8 text-base">
                Thank you for your message! We will get back to you soon.
              </p>
              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-block mb-6">
            <span className="text-sm md:text-base font-semibold text-primary/80 uppercase tracking-wider px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text/80 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you and answer any questions 
            you may have about our work and how you can get involved.
          </p>
        </div>

        {/* Error Status Message */}
        {submitStatus === 'error' && (
          <div className="mb-8 p-5 bg-red-50/90 backdrop-blur-sm border-2 border-red-300 text-red-700 rounded-xl shadow-lg animate-fade-in-up">
            <div className="flex items-start">
              <div className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-base block mb-1">{errors.submit || 'Sorry, there was an error sending your message. Please try again.'}</span>
                <p className="text-sm text-red-600/80">If the problem persists, please email us directly at worldmarchofwomenkenya@gmail.com</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 animate-fade-in-up animation-delay-200">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Send us a Message</h2>
              </div>
              <p className="text-text/70 text-xs sm:text-sm md:text-base ml-0 sm:ml-13 md:ml-16">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="contact-form-title">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-bold text-primary mb-2 ml-1">
                  Full Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={getInputClassName('name')}
                  placeholder="John Doe"
                  aria-required="true"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-sm text-red-600 font-medium flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-2 ml-1">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={getInputClassName('email')}
                  placeholder="john.doe@example.com"
                  aria-required="true"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-600 font-medium flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-bold text-primary mb-2 ml-1">
                  Subject <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  className={getInputClassName('subject')}
                  placeholder="What's this about?"
                  aria-required="true"
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-2 text-sm text-red-600 font-medium flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="message" className="block text-sm font-bold text-primary mb-2 ml-1">
                  Message <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows="6"
                  className={getInputClassName('message')}
                  placeholder="Tell us more about your inquiry..."
                  aria-required="true"
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-sm text-red-600 font-medium flex items-center" role="alert">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isSubmitting ? '' : 'hover:from-primary/90 hover:via-primary/80 hover:to-primary/90'
                }`}
                aria-describedby={isSubmitting ? 'submitting-status' : undefined}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Send Message
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                )}
              </button>
              {isSubmitting && (
                <p id="submitting-status" className="text-sm text-accent text-center font-medium" role="status">
                  Sending your message...
                </p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up animation-delay-400">
            {/* General Contact Info */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Get in Touch</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="group flex items-start space-x-3 sm:space-x-5 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:bg-white/50 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-primary text-base sm:text-lg mb-2 sm:mb-3">Email</h4>
                    <div className="mb-2 sm:mb-3">
                      <p className="text-xs sm:text-sm font-semibold text-primary/80 mb-1">General Email:</p>
                      <a href="mailto:worldmarchofwomenkenya@gmail.com" className="text-text/80 hover:text-primary transition-colors duration-200 text-sm sm:text-base break-all">
                        worldmarchofwomenkenya@gmail.com
                      </a>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-primary/80 mb-1">Communications Email:</p>
                      <a href="mailto:communications@worldmarchofwomenkenya.co.ke" className="text-text/80 hover:text-primary transition-colors duration-200 text-sm sm:text-base break-all">
                        communications@worldmarchofwomenkenya.co.ke
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group flex items-start space-x-3 sm:space-x-5 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:bg-white/50 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base sm:text-lg mb-1">Address</h4>
                    <p className="text-text/80 text-sm sm:text-base">P.O. Box 16049-00100<br />Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-3 sm:space-x-5 p-4 sm:p-5 rounded-lg sm:rounded-xl hover:bg-white/50 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base sm:text-lg mb-1">Response Time</h4>
                    <p className="text-text/80 text-sm sm:text-base">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Follow Us</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <a 
                  href="https://www.facebook.com/share/1HdcjQTSUX/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-accent/30 hover:border-primary/50 bg-white/50 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary group-hover:text-primary/80">Facebook</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/wmw.kenya?igsh=eHlieHJmODh1aWg2&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-accent/30 hover:border-primary/50 bg-white/50 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary group-hover:text-primary/80">Instagram</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/company/the-world-march-of-women-kenya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-accent/30 hover:border-primary/50 bg-white/50 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary group-hover:text-primary/80">LinkedIn</span>
                </a>
                
                <a 
                  href="https://x.com/Wmwkenya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-accent/30 hover:border-primary/50 bg-white/50 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary group-hover:text-primary/80">X (Twitter)</span>
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