import React, { useState, useEffect } from 'react';
import { getAllSubscribers, bulkUpdateSubscribers, deleteSubscribers, getSubscriberStats } from '../newsletterHelpers';

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [sortBy, setSortBy] = useState('subscribed_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSubscribers();
  }, [filter, sortBy, sortOrder]);

  const fetchSubscribers = async () => {
    setLoading(true);
    const result = await getAllSubscribers({
      status: filter === 'all' ? null : filter,
      sortBy,
      sortOrder
    });

    if (result.success) {
      setSubscribers(result.data);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setLoading(false);
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.first_name && subscriber.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (subscriber.last_name && subscriber.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id, checked) => {
    if (checked) {
      setSelectedSubscribers(prev => [...prev, id]);
    } else {
      setSelectedSubscribers(prev => prev.filter(subId => subId !== id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedSubscribers.length === 0) {
      setMessage({ type: 'error', text: 'Please select subscribers first.' });
      return;
    }

    setLoading(true);
    let result;

    if (action === 'delete') {
      result = await deleteSubscribers(selectedSubscribers);
    } else {
      let updateData = {};
      if (action === 'activate') {
        updateData = { is_active: true, unsubscribed_at: null };
      } else if (action === 'deactivate') {
        updateData = { is_active: false, unsubscribed_at: new Date().toISOString() };
      }
      result = await bulkUpdateSubscribers(selectedSubscribers, updateData);
    }

    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    
    if (result.success) {
      setSelectedSubscribers([]);
      fetchSubscribers();
    }
    
    setLoading(false);
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed Date', 'Source'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.first_name || '',
        sub.last_name || '',
        sub.is_active ? 'Active' : 'Inactive',
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.source || 'website'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Newsletter Subscribers</h1>
              <p className="text-sm md:text-base text-text">
                Manage your newsletter subscribers and export data
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <button
                onClick={exportSubscribers}
                className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-sm md:text-base"
              >
                Export CSV
              </button>
              <button
                onClick={fetchSubscribers}
                className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors duration-200 text-sm md:text-base"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg border text-sm md:text-base ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Filters and Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
            >
              <option value="subscribed_at">Subscribed Date</option>
              <option value="email">Email</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <div className="mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
                <span className="text-sm md:text-base font-medium text-blue-800">
                  {selectedSubscribers.length} subscriber(s) selected
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-xs md:text-sm"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-200 text-xs md:text-sm"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 text-xs md:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subscribers Table */}
          {loading ? (
            <div className="text-center text-accent py-8 md:py-12">
              <div className="text-lg md:text-xl">Loading subscribers...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={(e) => handleSelectSubscriber(subscriber.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                        {subscriber.email}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                        {subscriber.first_name && subscriber.last_name 
                          ? `${subscriber.first_name} ${subscriber.last_name}`
                          : subscriber.first_name || subscriber.last_name || '-'
                        }
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                        {formatDate(subscriber.subscribed_at)}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                        {subscriber.source || 'website'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredSubscribers.length === 0 && (
            <div className="text-center text-accent py-8 md:py-12">
              <div className="text-lg md:text-xl">No subscribers found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin; 