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
        setError('Failed to load blog posts. Please try refreshing the page or contact us if the problem persists.');
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

  const getImageUrl = (post) => {
    if (!post) return null;
    const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
    for (const field of possibleFields) {
      if (post[field] && typeof post[field] === 'string' && post[field].trim()) {
        return post[field].trim();
      }
    }
    return null;
  };

  try {
    return (
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent text-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Our Blog
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-4xl mx-auto">
              Stories of empowerment, advocacy, and change from our community of activists and leaders.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Featured Post */}
          {featured && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">Featured Post</h2>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-64 lg:h-full">
                    {getImageUrl(featured) ? (
                      <img 
                        src={getImageUrl(featured)} 
                        alt={featured.title || 'Featured blog post'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <div className="text-6xl text-primary">📖</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded text-sm font-semibold">
                        {featured.category || 'Featured'}
                      </span>
                      <span className="text-accent text-sm ml-4">{featured.date || ''}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-3 line-clamp-2">
                      <Link to={`/blog/${featured.id}`}>{featured.title}</Link>
                    </h3>
                    <p className="text-text mb-4 line-clamp-3 text-sm md:text-base leading-relaxed">
                      {featured.excerpt || (featured.content ? featured.content.split(' ').slice(0, 50).join(' ') + '...' : '')}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-accent font-semibold text-sm md:text-base">{featured.author || 'WMW Kenya'}</p>
                      </div>
                      <Link to={`/blog/${featured.id}`} className="text-primary hover:text-accent font-semibold text-sm md:text-base transition-colors duration-200">
                        Read Full Article →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-primary bg-background/80"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-primary bg-background/80"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="text-center text-accent py-12 md:py-16">
              <div className="text-lg md:text-xl">Loading blog posts...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">Unable to Load Blog Posts</h3>
                <p className="text-text mb-4 text-sm md:text-base">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 text-sm md:text-base"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : paginatedPosts.length === 0 ? (
            <div className="text-center text-accent py-12 md:py-16">
              <div className="text-lg md:text-xl">No blog posts found.</div>
              {search.trim() && (
                <p className="text-sm md:text-base mt-2">Try adjusting your search terms or filters.</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      page === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-accent hover:text-primary'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                        pageNum === page
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-primary hover:bg-accent hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      page === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-accent hover:text-primary'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Blogs component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Something went wrong</div>
          <div className="text-text mb-4">Please try refreshing the page</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Blogs; 