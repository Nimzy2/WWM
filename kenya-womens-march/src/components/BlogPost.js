import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, fetchBlogs } from '../supabaseHelpers';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import NewsletterSignup from './NewsletterSignup';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchBlogById(id),
      fetchBlogs()
    ])
      .then(([blog, blogs]) => {
        console.log('Blog post data:', blog);
        console.log('Blog content type:', typeof blog?.content);
        console.log('Blog content value:', blog?.content);
        
        // Clean the blog data to ensure content is a string
        if (blog) {
          // Deep clean all fields to ensure they are strings
          Object.keys(blog).forEach(key => {
            if (typeof blog[key] === 'object' && blog[key] !== null) {
              console.warn(`Found object in blog field ${key}:`, blog[key]);
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
                  console.error('Error cleaning content:', e);
                  blog[key] = '';
                }
              } else {
                blog[key] = String(blog[key] || '');
              }
            }
          });
        }
        
        console.log('Cleaned blog data:', blog);
        setPost(blog);
        setRecentPosts(
          blogs
            .filter(b => b.id !== blog.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4)
        );
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

  try {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background image and overlay */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1716836677180-dd1df630230d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '100vh', minWidth: '100vw' }}
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
        </div>
        {/* Main content */}
        <div className="relative z-30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="flex-1 bg-white rounded-lg shadow-md p-8">
              <div className="mb-4">
                <Link to="/blogs" className="text-accent hover:text-primary text-sm">← Back to Blogs</Link>
              </div>
              {(() => {
                // Try different possible image field names
                const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
                let imageUrl = null;
                for (const field of possibleFields) {
                  if (post[field] && typeof post[field] === 'string' && post[field].trim()) {
                    imageUrl = post[field].trim();
                    break;
                  }
                }
                return imageUrl ? (
                  <img src={imageUrl} alt={typeof post.title === 'string' ? post.title : ''} className="w-full h-64 object-cover rounded mb-6" />
                ) : null;
              })()}
              <div className="flex items-center mb-2">
                <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-semibold mr-3">{typeof post.category === 'string' ? post.category : ''}</span>
                <span className="text-accent text-xs">{typeof post.readTime === 'string' ? post.readTime : ''}</span>
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">{typeof post.title === 'string' ? post.title : ''}</h1>
              <div className="text-accent font-semibold mb-1">{typeof post.author === 'string' ? post.author : ''}</div>
              <div className="text-text text-sm mb-6">{typeof post.date === 'string' ? post.date : ''}</div>
              <div className="text-text leading-relaxed mb-8">
                {(() => {
                  try {
                    let content = post.content;
                    
                    // Handle different content types
                    if (typeof content === 'object' && content !== null) {
                      console.log('Content is object, attempting to extract text:', content);
                      
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
                    
                    console.log('Final content for rendering:', content);
                    console.log('Content length:', content.length);
                    
                    if (!content.trim()) {
                      return <p className="text-gray-500 italic">No content available.</p>;
                    }
                    
                    // Render markdown as HTML using marked and sanitize with DOMPurify
                    const html = marked.parse(content);
                    const sanitizedHtml = DOMPurify.sanitize(html);
                    return (
                      <div 
                        className="prose prose-lg prose-headings:text-primary prose-headings:font-bold prose-p:text-text prose-strong:text-primary prose-a:text-primary hover:prose-a:text-accent max-w-none"
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
              </div>
            </article>
            {/* Sidebar: Recent Posts */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-primary mb-4">Recent Posts</h2>
                <ul className="space-y-4">
                  {recentPosts.map(rp => {
                    const possibleFields = ['image', 'image_url', 'imageUrl', 'cover_image', 'thumbnail', 'featured_image'];
                    let imageUrl = null;
                    for (const field of possibleFields) {
                      if (rp[field] && typeof rp[field] === 'string' && rp[field].trim()) {
                        imageUrl = rp[field].trim();
                        break;
                      }
                    }
                    return (
                      <li key={rp.id} className="flex items-start gap-3">
                        <div className="bg-accent rounded w-12 h-12 flex items-center justify-center text-2xl text-primary">
                          {imageUrl ? <img src={imageUrl} alt={typeof rp.title === 'string' ? rp.title : ''} className="object-cover w-12 h-12 rounded" /> : null}
                        </div>
                        <div>
                          <Link to={`/blog/${rp.id}`} className="text-primary font-semibold text-sm line-clamp-2 hover:underline">{typeof rp.title === 'string' ? rp.title : ''}</Link>
                          <div className="text-xs text-accent">{typeof rp.date === 'string' ? rp.date : ''}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-12">
          <NewsletterSignup 
            variant="compact"
            title="Stay Connected"
            subtitle="Get the latest stories, updates, and opportunities delivered to your inbox."
            showNameFields={true}
          />
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