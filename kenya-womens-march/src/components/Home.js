import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';
import SEOHead from './SEOHead';
import { fetchBlogs } from '../supabaseHelpers';

const actionAreas = [
  {
    title: "Women's Rights",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    desc: "Advocating for gender equality, legal rights, and protection from violence.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Feminist Economy",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    desc: "Supporting women entrepreneurs, access to finance, and fair employment.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Popular Education",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    desc: "Collective learning rooted in lived experience, dialogue, and political consciousness helps communities understand oppression and organize for change.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Grassroot Mobilization",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    desc: "Building power from the ground up by organizing with communities most affected by injustice, and centering their voices in the struggle for social transformation.",
    gradient: "from-orange-500 to-red-500"
  }
];

const Home = () => {
  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);

  // Fetch blog posts
  useEffect(() => {
    setBlogLoading(true);
    fetchBlogs()
      .then(data => {
        setBlogPosts(Array.isArray(data) ? data.slice(0, 3) : []);
        setBlogLoading(false);
      })
      .catch(error => {
        setBlogError('Failed to load blog posts.');
        setBlogLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Home"
        description="Join us, a movement for equality, justice, and opportunity for every woman in Kenya. World March of Women Kenya empowers women through advocacy, education, and grassroots mobilization."
        keywords="women's rights Kenya, gender equality, women empowerment, social justice, grassroots mobilization, feminist movement, women's advocacy, community development"
      />
      
      {/* Hero Section - Modern Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-purple-700 to-accent">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(/women.jpeg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/50 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 py-12 sm:py-16 md:py-20 lg:py-32">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-md text-white border border-white/30 mb-4 sm:mb-6 animate-fade-in">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Empowering Women Across Kenya
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl animate-fade-in-up px-2">
              <span className="block mb-1 sm:mb-2">Empowering</span>
              <span className="block bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                Kenyan Women,
              </span>
              <span className="block mt-1 sm:mt-2">Transforming Communities</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 px-4">
              Join the movement for equality, justice, and opportunity for every woman in Kenya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 animate-fade-in-up animation-delay-400 px-4">
              <Link
                to="/join"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto text-center"
              >
                <span className="relative z-10">Join Our Movement</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/about"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white/80 rounded-full font-bold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 w-full sm:w-auto text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Action Areas Grid - Modern Cards */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden mt-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4">
              Our Focus Areas
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            <p className="mt-6 text-xl text-text/70 max-w-2xl mx-auto">
              Driving change through targeted initiatives that empower women across Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {actionAreas.map((area, idx) => (
              <div
                key={area.title}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${area.gradient} text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {area.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-black text-primary mb-4 group-hover:text-white transition-colors duration-500">
                    {area.title}
                  </h3>
                  <p className="text-sm text-text/80 leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                    {area.desc}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts - Modern Cards */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background/30 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4">
              Latest Stories
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <Link 
              to="/blogs" 
              className="inline-flex items-center text-primary hover:text-accent font-semibold transition-colors duration-300 group"
            >
              View All Posts
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {blogLoading ? (
            <div className="text-center text-accent py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4">Loading blog posts...</p>
            </div>
          ) : blogError ? (
            <div className="text-center text-red-500 py-12">{blogError}</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center text-accent py-12">No blog posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, idx) => {
                const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
                let imageUrl = null;
                for (const field of possibleFields) {
                  if (post[field] && typeof post[field] === 'string' && post[field].trim()) {
                    imageUrl = post[field].trim();
                    break;
                  }
                }
                return (
                  <article 
                    key={post.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  >
                    <Link to={`/blog/${post.id}`} className="block">
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.title || 'Blog post'}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                            <div className="text-6xl opacity-50">📖</div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            {post.category || 'General'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8">
                        <div className="flex items-center mb-3 text-xs text-text/60">
                          <span className="font-semibold">{post.date || ''}</span>
                          <span className="mx-2">•</span>
                          <span>{post.author || 'WMW Kenya'}</span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-black text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-text/70 mb-6 line-clamp-3 text-sm leading-relaxed">
                          {post.excerpt || (post.content ? post.content.split(' ').slice(0, 30).join(' ') + '...' : '')}
                        </p>
                        
                        <div className="flex items-center text-primary font-bold text-sm group-hover:text-accent transition-colors duration-300">
                          Read Article
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup - Modern Design */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-white via-background to-background/50">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/40 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-10 right-10 w-64 h-64 border-2 border-primary/10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-accent/20 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rotate-45 bg-primary/5 rounded-lg"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #43245A 1px, transparent 1px), linear-gradient(to bottom, #43245A 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">
              Stay Connected
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-text/80 max-w-2xl mx-auto">
              Join our community and get the latest updates, stories of empowerment, and opportunities to make a difference.
            </p>
          </div>
          
          {/* Newsletter Form Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-primary/10">
            <NewsletterSignup 
              title=""
              subtitle=""
              variant="compact"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
