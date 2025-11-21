import React, { useEffect, useMemo, useState } from 'react';
import { deleteJoinRequest, fetchJoinRequests, updateJoinRequest } from '../supabaseHelpers';
import Notification from './Notification';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A-Z)' }
];

const formatDateTime = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status || 'pending';
  const styles = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[normalizedStatus] || styles.pending}`}>
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
};

const JoinRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadRequests();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchJoinRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load join requests:', err);
      setError('Failed to load join requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearNotification = () => setNotification({ message: '', type: 'success' });

  const handleStatusChange = async (request, newStatus) => {
    if (request.status === newStatus) return;

    try {
      setUpdatingId(request.id);
      const updated = await updateJoinRequest(request.id, { status: newStatus });
      setRequests((prev) =>
        prev.map((item) =>
          item.id === request.id ? { ...item, status: updated?.status ?? newStatus } : item
        )
      );
      setNotification({
        message: `Request for ${request.first_name || ''} ${request.last_name || ''} marked as ${newStatus}.`.trim(),
        type: 'success'
      });
      if (selectedRequest?.id === request.id) {
        setSelectedRequest((prev) => ({ ...prev, status: updated?.status ?? newStatus }));
      }
    } catch (err) {
      console.error('Failed to update join request status:', err);
      setNotification({
        message: err.message || 'Failed to update join request status. Please try again.',
        type: 'error'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (request) => {
    const fullName = `${request.first_name || ''} ${request.last_name || ''}`.trim() || 'this request';
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${fullName}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(request.id);
      await deleteJoinRequest(request.id);
      setRequests((prev) => prev.filter((item) => item.id !== request.id));
      if (selectedRequest?.id === request.id) {
        setSelectedRequest(null);
      }
      setNotification({
        message: `${fullName} has been deleted.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to delete join request:', err);
      setNotification({
        message: err.message || 'Failed to delete join request. Please try again.',
        type: 'error'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = requests.filter((request) => {
      const matchesSearch =
        !normalizedSearch ||
        [request.first_name, request.last_name, request.email, request.phone, request.organization]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === 'all' || (request.status || 'pending').toLowerCase() === statusFilter;

      const matchesCounty =
        selectedCounty === 'all' ||
        (request.county ? request.county.toLowerCase() === selectedCounty.toLowerCase() : false);

      return matchesSearch && matchesStatus && matchesCounty;
    });

    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === 'name') {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      }
      // Default to newest
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sorted;
  }, [requests, search, statusFilter, selectedCounty, sortBy]);

  const counties = useMemo(() => {
    const countySet = new Set();
    requests.forEach((request) => {
      if (request.county) countySet.add(request.county);
    });
    return Array.from(countySet).sort((a, b) => a.localeCompare(b));
  }, [requests]);

  return (
    <div 
      className="min-h-screen relative py-8"
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
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Join Requests</h1>
            <p className="text-text mt-1">Review and manage membership applications</p>
          </div>
          <button
            onClick={loadRequests}
            className="self-start md:self-auto bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-accent">Total Requests</p>
            <p className="text-2xl font-bold text-primary mt-1">{requests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-accent">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {requests.filter((r) => (r.status || 'pending') === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-accent">Approved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {requests.filter((r) => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-accent">Rejected</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {requests.filter((r) => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone, or organization"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All counties</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-accent">Loading join requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-accent">
            No join requests found. Adjust your filters or share the join form to receive applications.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      County
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Involvement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                        {`${request.first_name || ''} ${request.last_name || ''}`.trim() || 'Not provided'}
                        {request.organization && (
                          <p className="text-xs text-accent mt-1">{request.organization}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-text">
                        <div>{request.email || 'No email'}</div>
                        {request.phone && <div className="text-xs text-accent mt-1">{request.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {request.county || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text capitalize">
                        {request.involvement_level || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {formatDateTime(request.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-primary hover:text-accent font-semibold text-left"
                          >
                            View Details
                          </button>
                          <select
                            value={(request.status || 'pending').toLowerCase()}
                            onChange={(e) => handleStatusChange(request, e.target.value)}
                            disabled={updatingId === request.id}
                            className="text-sm border border-accent rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                              <option key={option.value} value={option.value}>
                                Mark as {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDelete(request)}
                            disabled={deletingId === request.id}
                            className="text-left text-red-600 hover:text-red-800 font-semibold disabled:opacity-60"
                          >
                            {deletingId === request.id ? 'Deleting...' : 'Delete Request'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedRequest(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-accent hover:text-primary transition-colors"
              aria-label="Close join request details"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-primary mb-4">Join Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Name</p>
                <p className="text-lg text-primary font-medium">
                  {`${selectedRequest.first_name || ''} ${selectedRequest.last_name || ''}`.trim() || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Email</p>
                <p className="text-lg text-primary font-medium break-words">
                  {selectedRequest.email || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Phone</p>
                <p className="text-lg text-primary font-medium">
                  {selectedRequest.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">County</p>
                <p className="text-lg text-primary font-medium">
                  {selectedRequest.county || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Involvement Level</p>
                <p className="text-lg text-primary font-medium capitalize">
                  {selectedRequest.involvement_level || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Status</p>
                <div className="mt-1 flex items-center space-x-2">
                  <StatusBadge status={selectedRequest.status} />
                  <select
                    value={(selectedRequest.status || 'pending').toLowerCase()}
                    onChange={(e) => handleStatusChange(selectedRequest, e.target.value)}
                    disabled={updatingId === selectedRequest.id}
                    className="text-sm border border-accent rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {STATUS_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                      <option key={option.value} value={option.value}>
                        Mark as {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-accent uppercase">Interests</p>
              <p className="text-base text-text mt-1">
                {Array.isArray(selectedRequest.interests) && selectedRequest.interests.length > 0
                  ? selectedRequest.interests.join(', ')
                  : typeof selectedRequest.interests === 'string' && selectedRequest.interests
                  ? selectedRequest.interests
                  : 'Not specified'}
              </p>
            </div>
            {selectedRequest.organization && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-accent uppercase">Organization</p>
                <p className="text-base text-text mt-1">{selectedRequest.organization}</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm font-semibold text-accent uppercase">Submitted</p>
              <p className="text-base text-text mt-1">
                {formatDateTime(selectedRequest.created_at)}
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedRequest)}
                disabled={deletingId === selectedRequest.id}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-semibold disabled:opacity-60"
              >
                {deletingId === selectedRequest.id ? 'Deleting...' : 'Delete Request'}
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default JoinRequestManagement;

