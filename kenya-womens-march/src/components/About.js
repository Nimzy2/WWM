import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            About World March of Women Kenya
          </h1>
          <p className="text-xl text-text mb-12 max-w-4xl whitespace-nowrap mx-auto">
            We are a grassroots movement dedicated to empowering women and promoting gender <br /> 
            equality across Kenya.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
            <p className="text-lg text-text mb-8 leading-relaxed">
              Founded in 2020, World March of Women Kenya emerged from the collective desire
              to create lasting change for women across our nation. We believe that when women
              are empowered, entire communities thrive.
            </p>
            <p className="text-lg text-text mb-8 leading-relaxed">
              Our organization addresses the diverse challenges 
              faced by women in Kenya, from economic empowerment to political
              representation, education, healthcare, and environmental justice.
            </p>
          </div>
          <div className="bg-accent rounded-lg p-8 text-center">
            <div className="text-6xl font-bold text-primary mb-4">10K+</div>
            <div className="text-xl text-primary font-semibold">Active Members</div>
            <p className="text-text mt-2">Across all 47 counties</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Compassion</h3>
              <p className="text-text">
                We approach our work with empathy and understanding for all women's experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Integrity</h3>
              <p className="text-text">
                We maintain the highest standards of honesty and ethical behavior in all our actions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Inclusivity</h3>
              <p className="text-text">
                We welcome and celebrate the diversity of all women, regardless of background.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Action</h3>
              <p className="text-text">
                We believe in taking concrete steps to create positive change in our communities.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-primary font-bold">A</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Amina Ochieng</h3>
              <p className="text-accent mb-2">Executive Director</p>
              <p className="text-text text-sm">
                Leading our organization with over 15 years of experience in women's rights advocacy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-primary font-bold">S</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Sarah Muthoni</h3>
              <p className="text-accent mb-2">Programs Coordinator</p>
              <p className="text-text text-sm">
                Overseeing our community programs and grassroots initiatives across Kenya.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-primary font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Fatima Hassan</h3>
              <p className="text-accent mb-2">Advocacy Director</p>
              <p className="text-text text-sm">
                Driving our policy initiatives and government relations efforts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 