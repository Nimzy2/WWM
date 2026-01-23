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
    'Feminist Economy',
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
      // Scroll to top to ensure modal is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuccessModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center animate-popIn">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounceIn">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Application Submitted!</h2>
            <p className="mb-8 text-gray-600 text-base md:text-lg leading-relaxed">
              Thank you for your interest in joining World March of Women Kenya!<br/>
              We will contact you within 48 hours to discuss next steps.
            </p>
            <button
              className="bg-gradient-to-r from-primary to-accent text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {submitStatus === 'error' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSubmitStatus(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center animate-popIn">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Submission Error</h2>
            <p className="mb-4 text-gray-600 text-base md:text-lg">{errors.submit || 'Sorry, there was an error submitting your application. Please try again.'}</p>
            <p className="mb-8 text-gray-500 text-sm md:text-base">If the problem persists, please email us directly at worldmarchofwomenkenya@gmail.com</p>
            <button
              className="bg-gradient-to-r from-primary to-accent text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setSubmitStatus(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[#43245A] to-accent text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            ✨ Be Part of the Change
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            Join Our Movement
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
            Be part of a powerful network of women working together to create positive change in Kenya. 
            Your voice matters, and together we can make a difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>47 Counties</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span>Growing Community</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Real Impact</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 relative z-10">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 lg:p-12 border border-gray-100">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Get Started</h2>
            <p className="text-gray-600 text-base md:text-lg">Fill out the form below to join our movement</p>
          </div>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 rounded-lg animate-slideIn">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Application submitted successfully!</span>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-800 rounded-lg animate-slideIn">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">There was an error submitting your application. Please try again.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.firstName 
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 focus:ring-primary focus:border-primary hover:border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.lastName 
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 focus:ring-primary focus:border-primary hover:border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                        : 'border-gray-200 focus:ring-primary focus:border-primary hover:border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-300 transition-all duration-200"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="county" className="block text-sm font-semibold text-gray-700">
                  County <span className="text-red-500">*</span>
                </label>
                <select
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white ${
                    errors.county 
                      ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                      : 'border-gray-200 focus:ring-primary focus:border-primary hover:border-gray-300'
                  }`}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="">Select your county</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                {errors.county && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.county}
                  </p>
                )}
              </div>
            </div>

            {/* Involvement Level Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">How would you like to be involved?</h3>
                <span className="text-red-500">*</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {involvementLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.involvementLevel === level.value
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    } ${errors.involvementLevel ? 'border-red-400' : ''}`}
                  >
                    <input
                      type="radio"
                      name="involvementLevel"
                      value={level.value}
                      checked={formData.involvementLevel === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.involvementLevel === level.value
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {formData.involvementLevel === level.value && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-primary mb-1">{level.label}</div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.involvementLevel && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.involvementLevel}
                </p>
              )}
            </div>

            {/* Interests Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold text-primary">Areas of Interest</h3>
                <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 font-normal">(Select all that apply)</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {interestOptions.map((interest) => (
                  <label
                    key={interest}
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.interests}
                </p>
              )}
            </div>

            {/* Organization Section */}
            <div className="space-y-2 pt-6 border-t border-gray-200">
              <label htmlFor="organization" className="block text-sm font-semibold text-gray-700">
                Organization <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-gray-300 transition-all duration-200"
                placeholder="Enter your organization name"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Application
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { 
            transform: scale(0.7) translateY(20px); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.05) translateY(-5px); 
          }
          100% { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
          }
        }
        @keyframes bounceIn {
          0% { 
            transform: scale(0); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2); 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-popIn {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Join; 