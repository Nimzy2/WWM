import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';

const statsData = [
  { label: 'Members', value: 12000 },
  { label: 'Communities Reached', value: 47 },
  { label: 'Projects Initiated', value: 150 },
  { label: 'Counties Engaged', value: 47 },
];

const blogPosts = [
  {
    id: 1,
    title: "The Power of Women's Collective Action in Kenya",
    excerpt: "How grassroots movements are transforming communities and creating lasting change across the country.",
    author: "Amina Ochieng",
    date: "March 15, 2024",
    category: "Advocacy",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Economic Empowerment: Stories from Rural Women",
    excerpt: "Meet the women who are breaking barriers and building sustainable businesses in rural Kenya.",
    author: "Sarah Muthoni",
    date: "March 10, 2024",
    category: "Empowerment",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Education as a Tool for Gender Equality",
    excerpt: "Exploring the critical role of education in advancing women's rights and opportunities.",
    author: "Fatima Hassan",
    date: "March 5, 2024",
    category: "Education",
    readTime: "6 min read"
  }
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
    title: "Education",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0c-4.418 0-8-1.79-8-4V7" />
      </svg>
    ),
    desc: "Promoting girls' education, literacy, and lifelong learning opportunities."
  },
  {
    title: "Health",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm0 0V4m0 0C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
      </svg>
    ),
    desc: "Ensuring access to quality healthcare, reproductive rights, and mental wellness."
  }
];

const Home = () => {
  // Animated Counters
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const intervals = statsData.map((stat, idx) => {
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
          {statsData.map((stat, idx) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200 animate-fade-in-up">
                <div className="h-40 bg-accent flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-primary mb-2">📝</div>
                    <p className="text-primary font-semibold">{post.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-accent text-sm ml-3">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text mb-4 line-clamp-3">
                    {post.excerpt}
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
            ))}
          </div>
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
