import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublications } from '../supabaseHelpers';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await fetchPublications(6); // Show latest 6 publications
      setPublications(data || []);
    } catch (err) {
      console.error('Error loading publications:', err);
      setError('Failed to load publications.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">
            Our Publications
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            Research papers, policy briefs, and reports from World March of Women Kenya
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-accent">Loading publications...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : publications.length === 0 ? (
          <div className="text-center text-accent py-12">
            <p className="text-lg">No publications available at the moment.</p>
            <p className="text-sm mt-2">Check back soon for new research and reports.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                {pub.thumbnail_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pub.thumbnail_url}
                      alt={pub.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-6">
                  {pub.category && (
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-3">
                      {pub.category}
                    </span>
                  )}
                  
                  <h3 className="text-xl font-black text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {pub.title}
                  </h3>
                  
                  {pub.description && (
                    <p className="text-text/70 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {pub.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-2 mb-4 text-xs text-text/60">
                    {pub.author && (
                      <div>
                        <span className="font-semibold">Author:</span> {pub.author}
                      </div>
                    )}
                    {pub.authors && Array.isArray(pub.authors) && pub.authors.length > 0 && (
                      <div>
                        <span className="font-semibold">Authors:</span> {pub.authors.join(', ')}
                      </div>
                    )}
                    {pub.publication_date && (
                      <div>
                        <span className="font-semibold">Published:</span> {formatDate(pub.publication_date)}
                      </div>
                    )}
                  </div>
                  
                  {pub.file_url && (
                    <a
                      href={pub.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors group/link"
                    >
                      <svg className="w-5 h-5 mr-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;






