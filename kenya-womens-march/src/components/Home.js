import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';
import { supabase } from '../supabaseClient';
import { fetchBlogs } from '../supabaseHelpers';

const statOrder = [
  'Active Members',
  'Counties Reached',
  'Women Empowered',
  'Grassroots Projects',
];

const actionAreas = [
  {
    title: "Women's Rights",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 0v4m0 0c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
    desc: "Advocating for gender equality, legal rights, and protection from violence."
  },
  {
    title: "Economic Empowerment",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 0V4m0 0C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
      </svg>
    ),
    desc: "Supporting women entrepreneurs, access to finance, and fair employment."
  },
  {
    title: "Popular Education",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0c-4.418 0-8-1.79-8-4V7" />
      </svg>
    ),
    desc: "Collective learning rooted in lived experience, dialogue, and political consciousness helps communities understand oppression and organize for change. "
  },
  {
    title: "Grassroot Mobilization",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 0V4m0 0C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
      </svg>
    ),
    desc: "building power from the ground up by organizing with communities most affected by injustice, and centering their voices in the struggle for social transformation."
  }
];

const Home = () => {
  // Animated Counters
  const [stats, setStats] = useState([
    { label: 'Active Members', value: 0 },
    { label: 'Counties Reached', value: 0 },
    { label: 'Women Empowered', value: 0 },
    { label: 'Grassroots Projects', value: 0 },
  ]);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*');
      if (!error && data) {
        const sorted = statOrder.map(label => data.find(s => s.label === label) || { label, value: 0 });
        setStats(sorted);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    // Animate counters when stats change
    const intervals = stats.map((stat, idx) => {
      return setInterval(() => {
        setCounts(prev => {
          const next = [...prev];
          if (next[idx] < stat.value) {
            next[idx] = Math.min(next[idx] + Math.ceil(stat.value / 60), stat.value);
          }
          return next;
        });
      }, 20);
    });
    return () => intervals.forEach(clearInterval);
  }, [stats]);

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-accent text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow mb-6 animate-fade-in">
              Empowering Kenyan Women, Transforming Communities
            </h1>
            <p className="text-xl md:text-2xl text-accent mb-8 mx-auto animate-fade-in delay-200">
              Join the movement for equality, justice, and opportunity for every woman in Kenya.
            </p>
            <div className="space-x-4 animate-fade-in delay-400">
              <Link
                to="/join"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold shadow hover:bg-accent hover:text-white transition-colors duration-200"
              >
                Join Our Movement
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Counters */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="p-6 rounded-lg shadow bg-white hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{counts[idx].toLocaleString()}</div>
              <div className="text-lg font-semibold text-accent">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Areas Grid */}
      <section className="py-16 bg-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-fade-in">Our Focus Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {actionAreas.map((area, idx) => (
              <div
                key={area.title}
                className="bg-white rounded-xl p-8 text-center shadow hover:scale-105 hover:bg-primary/10 transition-all duration-300 group animate-fade-in-up"
              >
                <div className="flex items-center justify-center mb-4">
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-200">{area.title}</h3>
                <p className="text-text group-hover:text-primary transition-colors duration-200">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 animate-fade-in">Latest from Our Blog</h2>
          {blogLoading ? (
            <div className="text-center text-accent py-12">Loading blog posts...</div>
          ) : blogError ? (
            <div className="text-center text-red-500 py-12">{blogError}</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center text-accent py-12">No blog posts found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => {
                // Find the first available image field
                const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
                let imageUrl = null;
                for (const field of possibleFields) {
                  if (post[field] && typeof post[field] === 'string' && post[field].trim()) {
                    imageUrl = post[field].trim();
                    break;
                  }
                }
                return (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 animate-fade-in-up">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={typeof post.title === 'string' ? post.title : 'Blog post'}
                        className="h-40 w-full object-cover bg-accent"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="h-40 bg-accent flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl text-primary mb-2">📝</div>
                          <p className="text-primary font-semibold">{post.category}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                          {post.category}
                        </span>
                        <span className="text-accent text-sm ml-3">{post.readTime || post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-text mb-4 line-clamp-3">
                        {post.excerpt || (typeof post.content === 'string' ? post.content.split(' ').slice(0, 30).join(' ') + '...' : '')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-accent font-semibold text-sm">{post.author}</p>
                          <p className="text-text text-xs">{post.date}</p>
                        </div>
                        <Link to="/blogs" className="text-primary hover:text-accent font-semibold text-sm transition-colors duration-200">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <NewsletterSignup 
            variant="default"
            title="Stay Updated"
            subtitle="Subscribe to our newsletter for the latest updates, stories, and opportunities."
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
