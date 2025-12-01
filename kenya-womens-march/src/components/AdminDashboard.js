import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { fetchAllBlogs, getBlogStats, fetchContactMessages, fetchJoinRequests, fetchSubscribers, getPublicationStats } from '../supabaseHelpers';

const AdminDashboard = () => {
  const { logout, isWriter } = useAdmin();
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, unpublished: 0, recent: 0 },
    publications: { total: 0, published: 0, unpublished: 0, recent: 0 },
    subscribers: 0,
    messages: 0,
    joinRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [selectedJoinRequest, setSelectedJoinRequest] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [blogStats, blogs, publicationStats, subscribers, messages, joinRequestsData] = await Promise.all([
        getBlogStats(),
        fetchAllBlogs(true).catch(() => []),
        getPublicationStats().catch(() => ({ total: 0, published: 0, unpublished: 0, recent: 0 })),
        fetchSubscribers().catch(() => []),
        fetchContactMessages().catch(() => []),
        fetchJoinRequests().catch(() => [])
      ]);

      setStats({
        blogs: blogStats,
        publications: publicationStats,
        subscribers: subscribers.length,
        messages: messages.length,
        joinRequests: joinRequestsData.length
      });

      // Get recent posts
      const sortedPosts = [...blogs].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setRecentPosts(sortedPosts.slice(0, 5));

      const sortedJoinRequests = [...joinRequestsData].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setJoinRequests(sortedJoinRequests);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJoinRequest = (request) => {
    setSelectedJoinRequest(request);
  };

  const closeJoinRequestModal = () => {
    setSelectedJoinRequest(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const recentJoinRequests = joinRequests.slice(0, 5);

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', to }) => {
    const content = (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">{title}</p>
          <p className="text-3xl font-bold text-primary mt-2">{value}</p>
          {subtitle && <p className="text-xs text-accent mt-1">{subtitle}</p>}
        </div>
        <div className={`bg-${color}/10 p-4 rounded-full`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    );

    const className =
      'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 h-full';

    if (to) {
      return (
        <Link
          to={to}
          className={`${className} block focus:outline-none focus:ring-2 focus:ring-primary/40`}
        >
          {content}
        </Link>
      );
    }

    return <div className={className}>{content}</div>;
  };

  return (
    <>
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(/admin-login-bg.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{isWriter ? 'Writer Dashboard' : 'Admin Dashboard'}</h1>
              <p className="text-white/80 mt-1">
                {isWriter ? 'Create and manage blog posts' : 'Manage your content and view analytics'}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-4">
          <Link
            to="/admin/posts/new"
            className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 text-sm sm:text-base"
          >
            + Create New Post
          </Link>
          <Link
            to="/admin/posts"
            className="bg-white text-primary border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 text-sm sm:text-base"
          >
            Manage Posts
          </Link>
          <Link
            to="/admin/publications"
            className="bg-white text-primary border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 text-sm sm:text-base"
          >
            Manage Publications
          </Link>
          {!isWriter && (
            <>
              <Link
                to="/admin/join-requests"
                className="bg-white text-primary border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 text-sm sm:text-base"
              >
                View Join Requests
              </Link>
              <Link
                to="/admin/subscribers"
                className="bg-white text-primary border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 text-sm sm:text-base"
              >
                Manage Subscribers
              </Link>
              <Link
                to="/admin/messages"
                className="bg-white text-primary border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 text-sm sm:text-base"
              >
                View Messages
              </Link>
            </>
          )}
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-accent">Loading dashboard...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard
                title="Total Posts"
                value={stats.blogs.total}
                subtitle={`${stats.blogs.published} published, ${stats.blogs.unpublished} drafts`}
                icon="📝"
                color="primary"
              />
              <StatCard
                title="Published Posts"
                value={stats.blogs.published}
                subtitle={`${stats.blogs.recent} in last 30 days`}
                icon="✅"
                color="green"
              />
              <StatCard
                title="Publications"
                value={stats.publications.total}
                subtitle={`${stats.publications.published} published, ${stats.publications.unpublished} drafts`}
                icon="📄"
                color="blue"
                to="/admin/publications"
              />
              {!isWriter && (
                <>
                  <StatCard
                    title="Subscribers"
                    value={stats.subscribers}
                    subtitle="Newsletter subscribers"
                    icon="📧"
                    color="blue"
                    to="/admin/subscribers"
                  />
                  <StatCard
                    title="Messages"
                    value={stats.messages}
                    subtitle="Contact form messages"
                    icon="💬"
                    color="purple"
                    to="/admin/messages"
                  />
                  <StatCard
                    title="Join Requests"
                    value={stats.joinRequests}
                    subtitle="New member applications"
                    icon="🤝"
                    color="primary"
                    to="/admin/join-requests"
                  />
                </>
              )}
            </div>

            {/* Recent Join Requests */}
            {!isWriter && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary">Recent Join Requests</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-3 text-xs sm:text-sm">
                  <span className="text-accent">
                    Showing {recentJoinRequests.length} of {joinRequests.length}
                  </span>
                  <Link
                    to="/admin/join-requests"
                    className="text-primary hover:text-accent font-semibold"
                  >
                    View All →
                  </Link>
                </div>
              </div>
              {recentJoinRequests.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-accent text-sm sm:text-base">
                  <p>No join requests yet. Share the join form to start receiving applications.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle sm:px-0 px-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Email
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            County
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Submitted
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentJoinRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-primary font-medium">
                              <div className="flex flex-col">
                                <span>{`${request.first_name || ''} ${request.last_name || ''}`.trim() || 'Not provided'}</span>
                                <span className="text-gray-500 text-xs sm:hidden">{request.email || 'Not provided'}</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text hidden sm:table-cell">
                              {request.email || 'Not provided'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text hidden md:table-cell">
                              {request.county || 'Not specified'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text hidden lg:table-cell">
                              {request.created_at ? formatDate(request.created_at) : 'Unknown'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  request.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : request.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                              <button
                                onClick={() => handleViewJoinRequest(request)}
                                className="text-primary hover:text-accent font-semibold"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary">Recent Posts</h2>
                <Link
                  to="/admin/posts"
                  className="text-primary hover:text-accent font-semibold text-xs sm:text-sm"
                >
                  View All →
                </Link>
              </div>
              {recentPosts.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-accent text-sm sm:text-base">
                  <p>No posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle sm:px-0 px-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Category
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Created
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-4">
                              <div className="text-xs sm:text-sm font-medium text-primary max-w-xs truncate">
                                {post.title || 'Untitled'}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  post.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text hidden md:table-cell">
                              {post.category || 'Uncategorized'}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text hidden lg:table-cell">
                              {formatDate(post.created_at)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                              <Link
                                to={`/admin/posts/edit/${post.id}`}
                                className="text-primary hover:text-accent"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </div>
    {selectedJoinRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4 overflow-y-auto"
          onClick={closeJoinRequestModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4 sm:p-6 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeJoinRequestModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-accent hover:text-primary transition-colors text-xl sm:text-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
              aria-label="Close join request details"
            >
              ✕
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4 pr-8">
              Join Request Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Name</p>
                <p className="text-base sm:text-lg text-primary font-medium">
                  {`${selectedJoinRequest.first_name || ''} ${selectedJoinRequest.last_name || ''}`.trim() || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Email</p>
                <p className="text-base sm:text-lg text-primary font-medium break-words">
                  {selectedJoinRequest.email || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Phone</p>
                <p className="text-base sm:text-lg text-primary font-medium">
                  {selectedJoinRequest.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">County</p>
                <p className="text-base sm:text-lg text-primary font-medium">
                  {selectedJoinRequest.county || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Involvement Level</p>
                <p className="text-base sm:text-lg text-primary font-medium">
                  {selectedJoinRequest.involvement_level || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Status</p>
                <p className="text-base sm:text-lg text-primary font-medium capitalize">
                  {selectedJoinRequest.status || 'Pending'}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Interests</p>
              <p className="text-sm sm:text-base text-text mt-1">
                {Array.isArray(selectedJoinRequest.interests) && selectedJoinRequest.interests.length > 0
                  ? selectedJoinRequest.interests.join(', ')
                  : 'Not specified'}
              </p>
            </div>
            {selectedJoinRequest.organization && (
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Organization</p>
                <p className="text-sm sm:text-base text-text mt-1">
                  {selectedJoinRequest.organization}
                </p>
              </div>
            )}
            <div className="mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm font-semibold text-accent uppercase">Submitted</p>
              <p className="text-sm sm:text-base text-text mt-1">
                {selectedJoinRequest.created_at ? formatDate(selectedJoinRequest.created_at) : 'Unknown'}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={closeJoinRequestModal}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;

