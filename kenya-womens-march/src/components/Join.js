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

  const testimonials = [
    {
      name: 'Amina Hassan',
      location: 'Mombasa',
      role: 'Community Activist',
      story: 'Joining WMWK transformed my life. I went from being a quiet observer to leading women\'s rights campaigns in my community. The support and training I received gave me the confidence to speak up and make real change.',
      image: '👩🏾‍🦱'
    },
    {
      name: 'Grace Wanjiku',
      location: 'Nairobi',
      role: 'Entrepreneur',
      story: 'Through WMWK\'s economic empowerment programs, I learned business skills that helped me start my own tailoring business. Now I employ three other women and can support my family.',
      image: '👩🏾‍💼'
    },
    {
      name: 'Sarah Akinyi',
      location: 'Kisumu',
      role: 'Youth Leader',
      story: 'As a young woman, I felt isolated in my advocacy work. WMWK connected me with mentors and other young activists. Together, we\'re creating programs that empower teenage girls in our community.',
      image: '👩🏾‍🎓'
    },
    {
      name: 'Mary Njeri',
      location: 'Nakuru',
      role: 'Health Educator',
      story: 'I joined WMWK to help other women access healthcare information. The organization provided me with training and resources to conduct health workshops in rural areas. The impact we\'ve made is incredible.',
      image: '🏾‍⚕️'
    }
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
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Application Submitted!</h2>
            <p className="mb-6 text-text">Thank you for your interest in joining World March of Women Kenya!<br/>We will contact you within 48 hours to discuss next steps.</p>
            <button
              className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Our Movement
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Be part of a powerful network of women working together to create positive change in Kenya. 
            Your voice matters, and together we can make a difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Solidarity</h3>
              <p>Connect with like-minded women and build lasting relationships</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p>Access workshops, training programs, and educational resources</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
              <p>Discover new opportunities and develop leadership skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Error!</strong> There was a problem submitting your application. Please try again or contact us directly.
          </div>
        )}

        {/* Membership Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Apply for Membership</h2>
          
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6 border-b border-accent pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.firstName ? 'border-red-500' : 'border-accent'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.lastName ? 'border-red-500' : 'border-accent'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-accent'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                    className="w-full px-4 py-3 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.county ? 'border-red-500' : 'border-accent'
                    }`}
                  >
                    <option value="">Select your county</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                  {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-semibold text-primary mb-2">
                    Organization (if applicable)
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Company, NGO, or community group"
                  />
                </div>
              </div>
            </div>

            {/* Involvement Level */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6 border-b border-accent pb-2">
                How would you like to be involved? *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {involvementLevels.map((level) => (
                  <label key={level.value} className="flex items-start p-4 border border-accent rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="involvementLevel"
                      value={level.value}
                      checked={formData.involvementLevel === level.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-semibold text-primary">{level.label}</div>
                      <div className="text-sm text-text">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.involvementLevel && <p className="text-red-500 text-sm mt-2">{errors.involvementLevel}</p>}
            </div>

            {/* Areas of Interest */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-6 border-b border-accent pb-2">
                Areas of Interest (Select all that apply) *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center p-3 border border-accent rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-text">{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && <p className="text-red-500 text-sm mt-2">{errors.interests}</p>}
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white py-4 px-12 rounded-lg font-semibold text-lg hover:bg-accent hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        {/* Member Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">What Our Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-accent">
                <div className="flex items-start mb-4">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{testimonial.name}</h3>
                    <p className="text-accent">{testimonial.role}</p>
                    <p className="text-sm text-text">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-text italic">"{testimonial.story}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-accent rounded-lg p-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-text mb-6 max-w-2xl mx-auto">
            Join thousands of women across Kenya who are working together to create positive change. 
            Your voice, your skills, and your passion are needed in our movement.
          </p>
          <a
            href="#top"
            className="bg-primary text-white py-3 px-8 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 inline-block"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Join; 