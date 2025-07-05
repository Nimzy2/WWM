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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Newsletter Subscribers</h1>
              <p className="text-text">
                Manage your newsletter subscribers and export data
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <button
                onClick={exportSubscribers}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                Export CSV
              </button>
              <button
                onClick={fetchSubscribers}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="subscribed_at">Subscribed Date</option>
              <option value="email">Email</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-blue-800 font-semibold">
                  {selectedSubscribers.length} subscriber(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors duration-200"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subscribers Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Email</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Status</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Subscribed</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={(e) => handleSelectSubscriber(subscriber.id, e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        {subscriber.email}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {subscriber.first_name && subscriber.last_name 
                          ? `${subscriber.first_name} ${subscriber.last_name}`
                          : subscriber.first_name || subscriber.last_name || '-'
                        }
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          subscriber.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {formatDate(subscriber.subscribed_at)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {subscriber.source || 'website'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-text">
            <p>Total subscribers: {filteredSubscribers.length}</p>
            <p>Active subscribers: {filteredSubscribers.filter(s => s.is_active).length}</p>
            <p>Inactive subscribers: {filteredSubscribers.filter(s => !s.is_active).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin; 