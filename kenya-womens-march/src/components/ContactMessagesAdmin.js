import React, { useEffect, useMemo, useState } from 'react';
import { fetchContactMessages, deleteContactMessage } from '../supabaseHelpers';
import Notification from './Notification';

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

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadMessages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
      setError('Failed to load messages. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const clearNotification = () => setNotification({ message: '', type: 'success' });

  const handleDelete = async (message) => {
    const displayName = message.name || message.email || 'this message';
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the message from ${displayName}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(message.id);
      await deleteContactMessage(message.id);
      setMessages((prev) => prev.filter((item) => item.id !== message.id));
      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }
      setNotification({
        message: `Message from ${displayName} deleted.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
      setNotification({
        message: err.message || 'Failed to delete message. Please try again.',
        type: 'error'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return messages;
    return messages.filter((msg) => {
      const fields = [msg.name, msg.email, msg.subject, msg.message];
      return fields.filter(Boolean).some((field) => field.toLowerCase().includes(term));
    });
  }, [messages, search]);

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
            <h1 className="text-3xl font-bold text-primary">Contact Messages</h1>
            <p className="text-text mt-1">Review and respond to website inquiries</p>
          </div>
          <button
            onClick={loadMessages}
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

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search name, email, subject, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="px-4 py-2 border border-accent rounded-lg bg-gray-50 text-sm flex items-center">
              Total messages: <span className="ml-2 font-semibold text-primary">{messages.length}</span>
            </div>
            <div className="px-4 py-2 border border-accent rounded-lg bg-gray-50 text-sm flex items-center">
              Showing: <span className="ml-2 font-semibold text-primary">{filteredMessages.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-accent">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-accent">
            No messages found.
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                        {message.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {message.email || 'Not provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {message.subject || 'No subject'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {formatDateTime(message.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="text-primary hover:text-accent font-semibold text-left"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(message)}
                            disabled={deletingId === message.id}
                            className="text-left text-red-600 hover:text-red-800 font-semibold disabled:opacity-60"
                          >
                            {deletingId === message.id ? 'Deleting...' : 'Delete'}
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

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedMessage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-accent hover:text-primary transition-colors"
              aria-label="Close message details"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-primary mb-4">Message Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Name</p>
                <p className="text-lg text-primary font-medium">
                  {selectedMessage.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Email</p>
                <p className="text-lg text-primary font-medium break-words">
                  {selectedMessage.email || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Subject</p>
                <p className="text-lg text-primary font-medium">
                  {selectedMessage.subject || 'No subject'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-accent uppercase">Received</p>
                <p className="text-lg text-primary font-medium">
                  {formatDateTime(selectedMessage.created_at)}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-accent uppercase">Message</p>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg text-text text-sm leading-relaxed whitespace-pre-line max-h-64 overflow-auto">
                {selectedMessage.message || 'No message content provided.'}
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedMessage)}
                disabled={deletingId === selectedMessage.id}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-semibold disabled:opacity-60"
              >
                {deletingId === selectedMessage.id ? 'Deleting...' : 'Delete Message'}
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
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

export default ContactMessagesAdmin;

