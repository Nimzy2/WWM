import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../supabaseHelpers';
import NewsletterSignup from './NewsletterSignup';

const NewsletterBox = () => (
  <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center gap-4 mb-12 border border-white/20">
    <input
      type="email"
      placeholder="Enter your email"
      className="flex-1 px-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary text-primary bg-background/80"
    />
    <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200">
      Subscribe
    </button>
  </div>
);

const BlogCard = ({ post, compact }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug logging for image data
  useEffect(() => {
    console.log('BlogCard post data:', {
      id: post.id,
      title: post.title,
      image: post.image,
      imageUrl: post.image_url,
      imageField: post.image_field,
      allFields: Object.keys(post)
    });
  }, [post]);

  const handleImageError = () => {
    console.error('Image failed to load for post:', post.id, 'Image URL:', post.image);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Try different possible image field names
  const getImageUrl = () => {
    const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
    for (const field of possibleFields) {
      if (post[field] && typeof post[field] === 'string' && post[field].trim()) {
        return post[field].trim();
      }
    }
    return null;
  };

  const imageUrl = getImageUrl();

  try {
    // Fallback for excerpt
    const excerpt = typeof post.excerpt === 'string' && post.excerpt.trim()
      ? post.excerpt
      : (typeof post.content === 'string'
          ? post.content.split(' ').slice(0, 30).join(' ') + '...'
          : '');
    return (
      <article className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex ${compact ? 'flex-row h-36' : 'flex-col'}`}>
        <div className={`${compact ? 'w-36 h-36 flex-shrink-0' : 'h-48'} flex items-center justify-center relative p-0`}>
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={typeof post.title === 'string' ? post.title : 'Blog post'} 
              className={`${compact ? 'object-cover w-36 h-36' : 'object-cover h-full w-full'} transition-opacity duration-300`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{display: imageLoading ? 'none' : 'block'}}
            />
          ) : (
            <div className={`w-full h-full ${compact ? 'w-36 h-36' : 'h-48'} bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center`}>
              <div className="text-4xl text-primary mb-2">📖</div>
            </div>
          )}
        </div>
        <div className={`p-4 flex flex-col flex-1 min-w-0 ${compact ? 'justify-center' : ''}`}>
          <div className="flex items-center mb-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {typeof post.category === 'string' ? post.category : ''}
            </span>
            <span className="text-accent text-xs ml-3">{typeof post.date === 'string' ? post.date : ''}</span>
          </div>
          <h3 className={`text-lg font-bold text-primary mb-1 line-clamp-2 ${compact ? '' : 'md:text-xl'}`}>
            <Link to={`/blog/${post.id}`}>{typeof post.title === 'string' ? post.title : ''}</Link>
          </h3>
          <p className="text-text mb-2 line-clamp-2 flex-1">{excerpt}</p>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-accent font-semibold text-xs">{typeof post.author === 'string' ? post.author : ''}</p>
            </div>
            <Link to={`/blog/${post.id}`} className="text-primary hover:text-accent font-semibold text-xs transition-colors duration-200">
              Read More →
            </Link>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error rendering BlogCard:', error, 'Post data:', post);
    return (
      <article className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden p-4">
        <div className="text-red-500 text-sm">Error rendering blog card</div>
        <div className="text-xs text-gray-500 mt-2">
          {error.message}
        </div>
      </article>
    );
  }
};

const categories = [
  "All",
  "Rights",
  "Health",
  "Economy",
  "Education",
  "Politics"
];

const POSTS_PER_PAGE = 6;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchBlogs()
      .then(data => {
        console.log('Blog data received:', data);
        // Debug: Log each blog post's image field
        if (data && Array.isArray(data)) {
          data.forEach((post, index) => {
            console.log(`Post ${index + 1}:`, {
              id: post.id,
              title: post.title,
              image: post.image,
              image_url: post.image_url,
              imageUrl: post.imageUrl,
              cover_image: post.cover_image,
              thumbnail: post.thumbnail,
              allFields: Object.keys(post)
            });
          });
        }
        setBlogs(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts.');
        setLoading(false);
      });
  }, []);

  // Filtered and searched posts
  const filteredPosts = useMemo(() => {
    let posts = blogs;
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.category === selectedCategory);
    }
    if (search.trim()) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }
    return posts;
  }, [blogs, selectedCategory, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Sort by date descending
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [blogs]);

  const featured = sortedBlogs[0];
  const others = sortedBlogs.slice(1, 5); // Next 4 posts

  // Debug: log the featured post to check for object fields
  console.log('FEATURED POST:', featured);

  try {
    return (
      <div className="relative min-h-screen">
        {/* Background image and overlay */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <img
            src="https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?q=80&w=809&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '100vh', minWidth: '100vw' }}
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        </div>
        {/* Main content */}
        <div className="relative z-30 py-12">
        <div className="max-w-4xl mx-auto px-4">
            {/* Header section */}
          <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Inside Kenyan Women: Stories and Interviews
              </h1>
            <p className="text-lg text-text max-w-2xl mx-auto">Subscribe to learn about new articles, the latest in advocacy, and updates.</p>
          </div>
          {/* Recent blog posts */}
          <h2 className="text-xl font-bold text-primary mb-6">Recent blog posts</h2>
          {loading ? (
            <div className="text-center text-accent py-12">Loading blog posts...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Featured post */}
              {featured && (
                <div className="md:row-span-2">
                    <article className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-white/20 hover:shadow-xl transition-all duration-300">
                      {(() => {
                        // Try different possible image field names for featured post
                        const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
                        let imageUrl = null;
                        for (const field of possibleFields) {
                          if (featured[field] && typeof featured[field] === 'string' && featured[field].trim()) {
                            imageUrl = featured[field].trim();
                            break;
                          }
                        }
                        return imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={typeof featured.title === 'string' ? featured.title : 'Featured blog post'} 
                            className="object-cover w-full h-64"
                            onError={(e) => {
                              console.error('Featured image failed to load:', imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <span className="text-5xl text-primary">📰</span>
                      </div>
                        );
                      })()}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center mb-2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold mr-3">{typeof featured.category === 'string' ? featured.category : ''}</span>
                        <span className="text-accent text-xs">{typeof featured.date === 'string' ? featured.date : ''}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-primary mb-2 line-clamp-2">
                        <Link to={`/blog/${featured.id}`}>{typeof featured.title === 'string' ? featured.title : ''}</Link>
                      </h2>
                      <div className="text-accent font-semibold mb-1">{typeof featured.author === 'string' ? featured.author : ''}</div>
                      <div className="text-text text-sm mb-4">{typeof featured.excerpt === 'string' ? featured.excerpt : ''}</div>
                      {featured.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(Array.isArray(featured.tags) ? featured.tags : typeof featured.tags === 'string' ? featured.tags.split(',') : []).map((tag, index) => {
                            // Ensure tag is a string and handle edge cases
                            const tagString = typeof tag === 'string' ? tag.trim() : String(tag).trim();
                            if (!tagString) return null;
                            return (
                                <span key={`${tagString}-${index}`} className="bg-background/80 text-primary border border-accent rounded-full px-3 py-1 text-xs font-semibold">
                                {tagString}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <Link to={`/blog/${featured.id}`} className="text-primary hover:text-accent font-semibold text-sm transition-colors duration-200 mt-auto">Read More →</Link>
                    </div>
                  </article>
                </div>
              )}
              {/* Other recent posts */}
              <div className="flex flex-col gap-6">
                {others.filter(post => post && post.id).map(post => (
                  <BlogCard key={post.id} post={post} compact />
                ))}
              </div>
            </div>
          )}
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded border font-semibold transition-colors duration-150 ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded border font-semibold transition-colors duration-150 ${num === page ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded border font-semibold transition-colors duration-150 ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-accent hover:text-white'}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Newsletter Signup */}
        <div className="mt-16">
          <NewsletterSignup 
            variant="compact"
            title="Stay Updated with Our Stories"
            subtitle="Get the latest blog posts, news, and updates delivered to your inbox."
            showNameFields={true}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Blogs component:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Blog Page</h1>
          <p className="text-text">There was an error rendering the blog page. Please try refreshing.</p>
          <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }
};

export default Blogs; 