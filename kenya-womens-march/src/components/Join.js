import React, { useState } from 'react';
import { addJoinRequest } from '../supabaseHelpers';

const Join = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    county: '',
    involvementLevel: '',
    interests: [],
    organization: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri', 'Kakamega',
    'Kisii', 'Kericho', 'Machakos', 'Kitui', 'Garissa', 'Wajir', 'Mandera', 'Marsabit',
    'Isiolo', 'Meru', 'Embu', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Laikipia', 'Nyahururu',
    'Narok', 'Kajiado', 'Bomet', 'Baringo', 'Elgeyo Marakwet', 'West Pokot',
    'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Nandi', 'Vihiga', 'Bungoma', 'Busia',
    'Siaya', 'Homa Bay', 'Migori', 'Nyamira', 'Taita Taveta', 'Kwale', 'Kilifi',
    'Tana River', 'Lamu'
  ];

  const involvementLevels = [
    { value: 'volunteer', label: 'Volunteer', description: 'Help with events and community outreach' },
    { value: 'activist', label: 'Activist', description: 'Lead campaigns and advocacy efforts' },
    { value: 'supporter', label: 'Supporter', description: 'Attend events and spread awareness' },
    { value: 'donor', label: 'Donor', description: 'Provide financial support to our programs' }
  ];

  const interestOptions = [
    'Women\'s Rights Advocacy',
    'Economic Empowerment',
    'Education & Training',
    'Health & Wellness',
    'Leadership Development',
    'Community Outreach',
    'Policy & Legislation',
    'Youth Programs',
    'Rural Development',
    'Digital Literacy',
    'Environmental Justice',
    'Gender-Based Violence Prevention',
    'Maternal Health',
    'Financial Literacy',
    'Entrepreneurship Support'
  ];



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.county) newErrors.county = 'Please select your county';
    if (!formData.involvementLevel) newErrors.involvementLevel = 'Please select your involvement level';
    if (formData.interests.length === 0) newErrors.interests = 'Please select at least one area of interest';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const joinRequest = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        county: formData.county,
        involvement_level: formData.involvementLevel,
        interests: formData.interests,
        organization: formData.organization,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      await addJoinRequest(joinRequest);
      setSubmitStatus('success');
      setShowSuccessModal(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        county: '',
        involvementLevel: '',
        interests: [],
        organization: ''
      });
    } catch (error) {
      console.error('Error submitting join request:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Sorry, there was an error submitting your application. Please try again.';
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again in a moment.';
      } else if (error.message?.includes('database') || error.message?.includes('supabase')) {
        errorMessage = 'Database connection error. Please try again or contact us directly.';
      } else if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        errorMessage = 'It looks like you may have already submitted an application. Please contact us if you need to update your information.';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Application Submitted!</h2>
            <p className="mb-6 text-text text-sm md:text-base">Thank you for your interest in joining World March of Women Kenya!<br/>We will contact you within 48 hours to discuss next steps.</p>
            <button
              className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {submitStatus === 'error' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Submission Error</h2>
            <p className="mb-6 text-text text-sm md:text-base">{errors.submit || 'Sorry, there was an error submitting your application. Please try again.'}</p>
            <p className="mb-6 text-text text-xs md:text-sm">If the problem persists, please email us directly at worldmarchofwomenkenya@gmail.com</p>
            <button
              className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
              onClick={() => setSubmitStatus(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Join Our Movement
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-4xl mx-auto">
            Be part of a powerful network of women working together to create positive change in Kenya. 
            Your voice matters, and together we can make a difference.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:gap-12">
          {/* Join Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Join Our Movement</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Application submitted successfully!</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">There was an error submitting your application. Please try again.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-primary mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-accent focus:ring-primary'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-primary mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-accent focus:ring-primary'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-accent focus:ring-primary'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="county" className="block text-sm font-semibold text-primary mb-2">
                  County *
                </label>
                <select
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                    errors.county ? 'border-red-500 focus:ring-red-500' : 'border-accent focus:ring-primary'
                  }`}
                >
                  <option value="">Select your county</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                {errors.county && (
                  <p className="mt-1 text-sm text-red-600">{errors.county}</p>
                )}
              </div>

              <div>
                <label htmlFor="involvementLevel" className="block text-sm font-semibold text-primary mb-2">
                  How would you like to be involved? *
                </label>
                <select
                  id="involvementLevel"
                  name="involvementLevel"
                  value={formData.involvementLevel}
                  onChange={handleChange}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                    errors.involvementLevel ? 'border-red-500 focus:ring-red-500' : 'border-accent focus:ring-primary'
                  }`}
                >
                  <option value="">Select involvement level</option>
                  {involvementLevels.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.involvementLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.involvementLevel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Areas of Interest * (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="rounded border-accent text-primary focus:ring-primary"
                      />
                      <span className="text-sm md:text-base text-text">{interest}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
                )}
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-semibold text-primary mb-2">
                  Organization (Optional)
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your organization name"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary text-white py-3 md:py-4 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* Testimonials and Info */}
          {/* Entire What to Expect section removed */}
        </div>
      </div>
    </div>
  );
};

export default Join; 