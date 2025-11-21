import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../supabaseHelpers';
import NewsletterSignup from './NewsletterSignup';

// Compact card for trending sidebar
const TrendingCard = ({ post, index }) => {
  const [imageError, setImageError] = useState(false);

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

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const excerpt = post.excerpt ? stripHtmlTags(post.excerpt) : '';
  const readingTime = excerpt ? Math.ceil(excerpt.split(' ').length / 200) : 5;

  return (
    <Link to={`/blog/${post.id}`} className="flex gap-3 mb-6 group">
      <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={post.title || 'Blog post'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-2xl">📖</div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors">
          {post.title || 'Untitled'}
        </h4>
        <div className="flex items-center gap-2 flex-wrap">
          {post.created_at && (
            <span className="text-purple-200 text-xs">
              {new Date(post.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
          <span className="text-purple-200 text-xs">-</span>
          <span className="text-purple-200 text-xs">{readingTime} min</span>
          {post.category && (
            <span className="bg-purple-400/30 text-purple-100 px-2 py-0.5 rounded text-xs">
              {post.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const BlogCard = ({ post, compact }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
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

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    // Remove HTML tags
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  try {
    // Fallback for excerpt - strip HTML tags if present
    let excerpt = '';
    if (typeof post.excerpt === 'string' && post.excerpt.trim()) {
      excerpt = stripHtmlTags(post.excerpt);
    } else if (typeof post.content === 'string') {
      const plainText = stripHtmlTags(post.content);
      excerpt = plainText.split(' ').slice(0, 30).join(' ') + '...';
    }
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
            {post.created_at && (
              <span className="text-accent text-xs ml-3">
                {new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
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
  "Frontline Stories",
  "Bodies & Autonomy",
  "Work, Land & Survival Power & Politics",
  "Feminist Thought & Philosophy",
  "Culture & Resistance",
  "Histories & Lineages",
  "Everyday Feminism",
  "Opinion"
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
    // Fetch posts with a reasonable limit for initial load
    fetchBlogs(100) // Limit to 100 posts initially
      .then(data => {
        const blogsData = data || [];
        setBlogs(blogsData);
        console.log('Fetched blogs:', blogsData.length);
        console.log('Categories found:', [...new Set(blogsData.map(b => b.category).filter(Boolean))]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts. Please try refreshing the page or contact us if the problem persists.');
        setLoading(false);
      });
  }, []);

  // Reset page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search]);

  // Filter posts by category and search
  const filteredBlogs = useMemo(() => {
    let posts = [...blogs];
    
    // Filter by category (normalize whitespace, handle variations)
    if (selectedCategory !== 'All') {
      const beforeCount = posts.length;
      
      // Normalize category name: replace newlines, multiple spaces with single space, trim
      const normalizeCategory = (cat) => {
        return (cat || '')
          .replace(/\n/g, ' ')  // Replace newlines with spaces
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim()
          .toLowerCase();
      };
      
      const normalizedSelected = normalizeCategory(selectedCategory);
      
      posts = posts.filter(post => {
        const postCategory = normalizeCategory(post.category);
        
        // Special case: "Work, Land & Survival Power & Politics" includes posts from both old categories
        if (normalizedSelected === normalizeCategory('Work, Land & Survival Power & Politics')) {
          const matches = 
            postCategory === normalizeCategory('Work, Land & Survival') || 
            postCategory === normalizeCategory('Power & Politics') || 
            postCategory === normalizeCategory('Work, Land & Survival Power & Politics') ||
            postCategory === normalizeCategory('Work, Land & Survival & Power & Politics') ||
            (postCategory.includes('work') && postCategory.includes('land') && postCategory.includes('survival') && 
            (postCategory.includes('power') || postCategory.includes('politics')));
          return matches;
        }
        
        // For other categories, do flexible matching
        // Check exact match first
        if (postCategory === normalizedSelected) {
          return true;
        }
        
        // Also check if categories match when normalized (handles "and" vs "&", case differences)
        const normalizeForComparison = (cat) => {
          return cat
            .replace(/\s*&\s*/g, ' and ')  // Normalize & to " and "
            .replace(/\s+/g, ' ')
            .trim();
        };
        
        return normalizeForComparison(postCategory) === normalizeForComparison(normalizedSelected);
      });
      
      console.log(`Filtering by category "${selectedCategory}": ${beforeCount} -> ${posts.length} posts`);
      if (posts.length === 0 && beforeCount > 0) {
        const availableCategories = [...new Set(blogs.map(b => (b.category || '').trim()).filter(Boolean))];
        console.log('Available categories in database:', availableCategories);
      }
    }
    
    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      posts = posts.filter(post => {
        const title = (post.title || '').toLowerCase();
        const excerpt = (post.excerpt || '').toLowerCase();
        return title.includes(searchLower) || excerpt.includes(searchLower);
      });
    }
    
    return posts;
  }, [blogs, selectedCategory, search]);

  // Sort by date descending
  const sortedBlogs = useMemo(() => {
    return [...filteredBlogs].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
  }, [filteredBlogs]);

  // Only show featured/trending if we have enough posts (more than 4)
  // Otherwise, show all posts in the grid
  const shouldShowFeatured = sortedBlogs.length > 4;
  const featured = shouldShowFeatured ? sortedBlogs[0] : null;
  const trendingPosts = shouldShowFeatured ? sortedBlogs.slice(1, 4) : []; // Next 3 posts for trending sidebar

  // Paginated posts (excluding featured and trending posts only if we're showing them)
  const filteredPosts = useMemo(() => {
    if (!shouldShowFeatured) {
      // If we have 4 or fewer posts, show them all in the grid
      return sortedBlogs;
    }
    // Otherwise, exclude the first 4 (featured + 3 trending)
    const excludedIds = sortedBlogs.slice(0, 4).map(p => p.id).filter(Boolean);
    return sortedBlogs.filter(post => !excludedIds.includes(post.id));
  }, [sortedBlogs, shouldShowFeatured]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

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

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getReadingTime = (post) => {
    const excerpt = post.excerpt ? stripHtmlTags(post.excerpt) : '';
    const content = post.content ? stripHtmlTags(post.content) : '';
    const text = excerpt || content;
    if (!text) return 5;
    return Math.ceil(text.split(' ').length / 200);
  };

  try {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Search and Filter Controls - Top */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Our Blog</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-primary bg-white w-full sm:min-w-[200px] text-sm sm:text-base"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-primary bg-white w-full sm:w-auto text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content: Featured Article + Trending Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Featured Article - Left Side (2 columns) */}
            <div className="lg:col-span-2">
              {featured && (
                <article>
                  {/* Large Featured Image */}
                  <div className="mb-4 sm:mb-6 rounded-lg overflow-hidden">
                    {getImageUrl(featured) ? (
                      <img 
                        src={getImageUrl(featured)} 
                        alt={featured.title || 'Featured blog post'} 
                        className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <div className="text-4xl sm:text-6xl text-primary">📖</div>
                      </div>
                    )}
                  </div>

                  {/* Featured Article Content */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 leading-tight">
                      <Link to={`/blog/${featured.id}`} className="hover:text-accent transition-colors">
                        {featured.title || 'Featured Article'}
                      </Link>
                    </h2>
                    
                    <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                      {(() => {
                        const excerpt = featured.excerpt ? stripHtmlTags(featured.excerpt) : '';
                        const content = featured.content ? stripHtmlTags(featured.content) : '';
                        return excerpt || (content ? content.split(' ').slice(0, 50).join(' ') + '...' : '');
                      })()}
                    </p>

                    {/* Author and Metadata */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                          {featured.author ? featured.author.charAt(0).toUpperCase() : 'W'}
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm sm:text-base">{featured.author || 'WMW Kenya'}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Author</p>
                        </div>
                      </div>
                      {featured.category && (
                        <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          {featured.category}
                        </span>
                      )}
                      {featured.created_at && (
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {new Date(featured.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })} - {getReadingTime(featured)} min
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Trending Sidebar - Right Side (1 column) */}
            <div className="lg:col-span-1">
              <div className="bg-[#43245A] rounded-lg p-4 sm:p-6 md:p-8 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300 rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-200 rounded-full blur-xl"></div>
                </div>

                {/* Trending Header */}
                <div className="relative z-10 mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Trending</h3>
                </div>

                {/* Trending Posts */}
                <div className="relative z-10">
                  {loading ? (
                    <div className="text-purple-200 text-sm">Loading trending posts...</div>
                  ) : trendingPosts.length > 0 ? (
                    trendingPosts.map((post, index) => (
                      <TrendingCard key={post.id} post={post} index={index} />
                    ))
                  ) : (
                    <div className="text-purple-200 text-sm">No trending posts available.</div>
                  )}
                </div>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 sm:space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
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
                      className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
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
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base ${
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