import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, fetchBlogs, fetchCommentsByBlogId, createComment } from '../supabaseHelpers';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchBlogById(id),
      fetchBlogs(6), // Only fetch 6 recent posts for the sidebar
      fetchCommentsByBlogId(id) // Fetch comments for this blog post
    ])
      .then(([blog, blogs, commentsData]) => {
        // Clean the blog data to ensure content is a string
        if (blog) {
          // Deep clean all fields to ensure they are strings
          Object.keys(blog).forEach(key => {
            if (typeof blog[key] === 'object' && blog[key] !== null) {
              if (key === 'content') {
                // For content, try to extract text from React elements
                try {
                  if (blog[key] && typeof blog[key] === 'object' && blog[key].props) {
                    // This might be a React element, try to get its children
                    blog[key] = String(blog[key].props?.children || '');
                  } else {
                    blog[key] = String(blog[key] || '');
                  }
                } catch (e) {
                  blog[key] = '';
                }
              } else {
                blog[key] = String(blog[key] || '');
              }
            }
          });
        }
        setPost(blog);
        setRecentPosts(
          blogs
            .filter(b => b.id !== blog.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4)
        );
        // Set comments from database
        setComments(commentsData || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading blog post:', error);
        setError('Failed to load blog post.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-20 text-center text-accent">Loading blog post...</div>;
  }
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-accent">
        Blog post not found.<br />
        <Link to="/blogs" className="text-primary underline">Back to Blogs</Link>
      </div>
    );
  }

  // Helper functions
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


  const getExcerpt = () => {
    if (post.excerpt) {
      return stripHtmlTags(post.excerpt);
    }
    if (post.content) {
      const content = stripHtmlTags(post.content);
      return content.split(' ').slice(0, 30).join(' ') + '...';
    }
    return '';
  };

  const imageUrl = getImageUrl(post);
  const excerpt = getExcerpt();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingComment(true);
    
    try {
      const newComment = await createComment({
        blogId: id,
        name: commentForm.name,
        email: commentForm.email,
        comment: commentForm.comment
      });
      
      // Add the new comment to the list
      setComments([...comments, newComment]);
      setCommentForm({ name: '', email: '', comment: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  try {
    return (
      <div className="min-h-screen bg-white">
        {/* Dark Content Area - Riverside Style */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Link to="/blogs" className="text-gray-400 hover:text-white text-sm transition-colors">
                Blog
              </Link>
              <span className="text-gray-400 text-sm mx-2">›</span>
              <span className="text-gray-400 text-sm truncate max-w-md inline-block">
                {typeof post.title === 'string' ? post.title.substring(0, 30) + '...' : 'Article'}
              </span>
            </div>

            {/* Two Column Layout: Content Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
              {/* Left Column: Content */}
              <div className="order-2 lg:order-1">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                  {typeof post.title === 'string' ? post.title : 'Untitled'}
                </h1>

                {/* Description/Excerpt */}
                {excerpt && (
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
                    {excerpt}
                  </p>
                )}

                {/* Author Information */}
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-base md:text-lg flex-shrink-0">
                    {post.author ? post.author.charAt(0).toUpperCase() : 'W'}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base md:text-lg">
                      {typeof post.author === 'string' ? post.author : 'WMW Kenya'}
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm">Author</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mb-6 md:mb-8">
                  {post.created_at && (
                    <p className="text-gray-400 text-xs md:text-sm mb-2">
                      Last Updated: {new Date(post.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Featured Image */}
              <div className="order-1 lg:order-2">
                {imageUrl ? (
                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      alt={typeof post.title === 'string' ? post.title : 'Blog post'} 
                      className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover md:object-contain"
                    />
                    {/* Optional Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white line-clamp-2">
                        {typeof post.title === 'string' ? post.title : 'Featured Article'}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <div className="text-4xl md:text-6xl">📖</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Article Content - White Background */}
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <article className="prose prose-sm sm:prose-base md:prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-a:no-underline hover:prose-a:underline max-w-none prose-img:rounded-lg prose-img:w-full">
              {(() => {
                try {
                  let content = post.content;
                  
                  // Handle different content types
                  if (typeof content === 'object' && content !== null) {
                    // If it's a React element, try to extract text from props
                    if (content.props) {
                      if (Array.isArray(content.props.children)) {
                        content = content.props.children
                          .map(child => {
                            if (typeof child === 'string') return child;
                            if (typeof child === 'object' && child.props) {
                              return String(child.props.children || '');
                            }
                            return String(child || '');
                          })
                          .join(' ');
                      } else {
                        content = String(content.props.children || '');
                      }
                    } else {
                      content = String(content);
                    }
                  } else if (typeof content !== 'string') {
                    content = String(content || '');
                  }
                  
                  if (!content.trim()) {
                    return <p className="text-gray-500 italic">No content available.</p>;
                  }
                  
                  // Check if content is already HTML (from Word document)
                  const isHTML = content && (
                    content.includes('<p>') || 
                    content.includes('<div>') || 
                    content.includes('<h1>') ||
                    content.includes('<br>')
                  );

                  let html;
                  if (isHTML) {
                    // Content is already HTML from Word document
                    html = content;
                  } else {
                    // Content is markdown, convert it
                    html = marked.parse(content);
                  }
                  
                  const sanitizedHtml = DOMPurify.sanitize(html);
                  return (
                    <div 
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
                    />
                  );
                } catch (error) {
                  console.error('Error rendering content:', error);
                  return (
                    <div className="text-red-500">
                      <p>Error rendering content. Please try refreshing the page.</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm">Technical details</summary>
                        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                          {error.message}
                        </pre>
                      </details>
                    </div>
                  );
                }
              })()}
            </article>
          </div>
        </div>

        {/* Sidebar: Recent Posts - Dark Theme */}
        <div className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recentPosts.map(rp => {
                  const rpImageUrl = getImageUrl(rp);
                  return (
                    <Link 
                      key={rp.id} 
                      to={`/blog/${rp.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                    >
                      {rpImageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={rpImageUrl} 
                            alt={typeof rp.title === 'string' ? rp.title : ''} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <div className="text-4xl">📖</div>
                        </div>
                      )}
                      <div className="p-6">
                        {rp.category && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold mb-2 inline-block">
                            {rp.category}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {typeof rp.title === 'string' ? rp.title : 'Untitled'}
                        </h3>
                        {rp.created_at && (
                          <p className="text-sm text-gray-500">
                            {new Date(rp.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Comments</h2>
            
            {/* Comment Form */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 md:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Leave a Comment</h3>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="comment-name"
                      required
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="comment-email"
                      required
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Comment *
                  </label>
                  <textarea
                    id="comment-text"
                    required
                    rows={5}
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="Share your thoughts..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Submitting...' : 'Post Comment'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4 md:space-y-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-6 md:py-8 text-sm md:text-base">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 md:pb-6 last:border-b-0">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{comment.name}</h4>
                          {comment.created_at && (
                            <span className="text-xs md:text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base break-words">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering BlogPost component:', error);
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Blog Post</h1>
          <p className="text-text mb-4">There was an error rendering the blog post. Please try refreshing.</p>
          <Link to="/blogs" className="text-primary underline">← Back to Blogs</Link>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm">Technical details</summary>
            <pre className="text-xs mt-2 bg-gray-100 p-4 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
};

export default BlogPost; 