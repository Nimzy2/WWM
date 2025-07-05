import React, { useState, useEffect } from 'react';
import { fetchJoinRequests, addJoinRequest } from '../supabaseHelpers';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const stats = {
    totalMembers: 10450,
    newMembers: 234,
    events: 12,
    blogPosts: 45
  };

  const recentMembers = [
    { id: 1, name: 'Grace Wanjiku', email: 'grace@email.com', date: '2024-03-15', type: 'Active' },
    { id: 2, name: 'Mary Njeri', email: 'mary@email.com', date: '2024-03-14', type: 'Individual' },
    { id: 3, name: 'Jane Akinyi', email: 'jane@email.com', date: '2024-03-13', type: 'Active' },
    { id: 4, name: 'Sarah Muthoni', email: 'sarah@email.com', date: '2024-03-12', type: 'Organization' },
    { id: 5, name: 'Faith Wambui', email: 'faith@email.com', date: '2024-03-11', type: 'Individual' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Women Leadership Workshop', date: '2024-03-25', attendees: 45, status: 'Confirmed' },
    { id: 2, title: 'Community Outreach Program', date: '2024-03-28', attendees: 32, status: 'Confirmed' },
    { id: 3, title: 'Policy Advocacy Meeting', date: '2024-04-02', attendees: 18, status: 'Pending' },
    { id: 4, title: 'Youth Empowerment Seminar', date: '2024-04-05', attendees: 67, status: 'Confirmed' }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'join-requests', label: 'Join Requests', icon: '📝' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  // Fetch join requests on component mount
  useEffect(() => {
    fetchJoinRequestsData();
  }, []);

  const fetchJoinRequestsData = async () => {
    setLoading(true);
    try {
      const data = await fetchJoinRequests();
      setJoinRequests(data);
    } catch (error) {
      console.error('Error fetching join requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // Update the status in Supabase
      const { error } = await supabase
        .from('join_requests')
        .update({ status: newStatus })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Refresh the data
      fetchJoinRequestsData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-accent text-sm">Total Members</p>
              <p className="text-2xl font-bold text-primary">{stats.totalMembers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-accent text-sm">New Members</p>
              <p className="text-2xl font-bold text-primary">+{stats.newMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-accent text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold text-primary">{stats.events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-accent text-sm">Blog Posts</p>
              <p className="text-2xl font-bold text-primary">{stats.blogPosts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Recent Members</h3>
          <div className="space-y-4">
            {recentMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{member.name}</p>
                  <p className="text-sm text-accent">{member.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text">{member.date}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.type === 'Active' ? 'bg-green-100 text-green-800' :
                    member.type === 'Organization' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{event.title}</p>
                  <p className="text-sm text-accent">{event.date} • {event.attendees} attendees</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJoinRequests = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Join Requests</h3>
        <div className="flex space-x-2">
          <span className="text-sm text-accent">
            {joinRequests.filter(r => r.status === 'pending').length} pending
          </span>
          <button 
            onClick={fetchJoinRequestsData}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-accent">Loading join requests...</p>
        </div>
      ) : joinRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-accent">No join requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {joinRequests.map((request) => (
            <div key={request.id} className="border border-accent rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-primary">
                    {request.first_name} {request.last_name}
                  </h4>
                  <p className="text-accent">{request.email}</p>
                  <p className="text-sm text-text">{request.phone} • {request.county}</p>
                  {request.organization && (
                    <p className="text-sm text-text">Organization: {request.organization}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {request.status}
                  </span>
                  <p className="text-xs text-accent mt-1">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Involvement Level:</p>
                  <p className="text-sm text-text capitalize">{request.involvement_level}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Areas of Interest:</p>
                  <div className="flex flex-wrap gap-1">
                    {request.interests.map((interest, index) => (
                      <span key={index} className="text-xs bg-accent text-primary px-2 py-1 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {request.skills && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-primary mb-1">Skills Offered:</p>
                  <p className="text-sm text-text">{request.skills}</p>
                </div>
              )}
              
              {request.motivation && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-primary mb-1">Motivation:</p>
                  <p className="text-sm text-text">{request.motivation}</p>
                </div>
              )}
              
              {request.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'contacted')}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Mark Contacted
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMembers = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">All Members</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200">
          Export Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent">
              <th className="text-left py-3 px-4 text-primary font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-primary font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-primary font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-primary font-semibold">Join Date</th>
              <th className="text-left py-3 px-4 text-primary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentMembers.map((member) => (
              <tr key={member.id} className="border-b border-accent">
                <td className="py-3 px-4">{member.name}</td>
                <td className="py-3 px-4 text-accent">{member.email}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.type === 'Active' ? 'bg-green-100 text-green-800' :
                    member.type === 'Organization' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{member.date}</td>
                <td className="py-3 px-4">
                  <button className="text-primary hover:text-accent mr-2">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Event Management</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200">
          Create Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="border border-accent rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">{event.title}</h4>
            <p className="text-sm text-accent mb-2">{event.date}</p>
            <p className="text-sm text-text mb-3">{event.attendees} attendees</p>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {event.status}
              </span>
              <div>
                <button className="text-primary hover:text-accent text-sm mr-2">Edit</button>
                <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Content Management</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200">
          Create Post
        </button>
      </div>
      <div className="space-y-4">
        <div className="border border-accent rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">The Power of Women's Collective Action in Kenya</h4>
          <p className="text-sm text-accent mb-2">Published: March 15, 2024</p>
          <p className="text-sm text-text mb-3">How grassroots movements are transforming communities...</p>
          <div className="flex space-x-2">
            <button className="text-primary hover:text-accent text-sm">Edit</button>
            <button className="text-primary hover:text-accent text-sm">View</button>
            <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
          </div>
        </div>
        <div className="border border-accent rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">Economic Empowerment: Stories from Rural Women</h4>
          <p className="text-sm text-accent mb-2">Published: March 10, 2024</p>
          <p className="text-sm text-text mb-3">Meet the women who are breaking barriers...</p>
          <div className="flex space-x-2">
            <button className="text-primary hover:text-accent text-sm">Edit</button>
            <button className="text-primary hover:text-accent text-sm">View</button>
            <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Analytics Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-primary mb-4">Member Growth</h4>
          <div className="h-64 bg-background rounded-lg flex items-center justify-center">
            <p className="text-accent">Chart placeholder</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-4">Event Attendance</h4>
          <div className="h-64 bg-background rounded-lg flex items-center justify-center">
            <p className="text-accent">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Admin Settings</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-primary mb-4">General Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="World March of Women Kenya"
                className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="admin@worldmarchofwomenkenya.org"
                className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-4">Security</h4>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'join-requests':
        return renderJoinRequests();
      case 'members':
        return renderMembers();
      case 'events':
        return renderEvents();
      case 'content':
        return renderContentManagement();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-accent">Manage your organization's activities and members</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-accent hover:text-primary'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {renderMainContent()}
      </div>
    </div>
  );
};

export default Admin; 