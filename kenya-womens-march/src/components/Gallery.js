import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGalleryImages } from '../supabaseHelpers';
import SEOHead from './SEOHead';
import OptimizedImage from './OptimizedImage';

const IMAGES_PER_PAGE = 12;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // first toggle (grid) shows on first load
  const galleryContentRef = useRef(null);
  const isInitialPageMount = useRef(true);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout. Please check your Supabase configuration.')), 15000)
      );

      const imageUrls = await Promise.race([
        fetchGalleryImages(),
        timeoutPromise
      ]);

      setImages(imageUrls);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      
      // Provide more specific error messages
      if (err.message?.includes('timeout')) {
        setError('Connection timeout. Please check your internet connection and Supabase configuration.');
      } else if (err.message?.includes('not found') || err.message?.includes('Bucket')) {
        setError('Gallery bucket not found. Please create the "gallery" bucket in Supabase Storage.');
      } else {
        setError('Failed to load gallery images. Please check your Supabase configuration or try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryImages();
  }, []);

  // Reset page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search]);

  // Scroll to top of gallery when page changes (including back to page 1)
  useEffect(() => {
    if (isInitialPageMount.current) {
      isInitialPageMount.current = false;
      return;
    }
    if (galleryContentRef.current) {
      galleryContentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [page]);

  // Get unique categories from images
  const categories = ['all', ...new Set(images.map(img => img.category).filter(Boolean))];

  // Get featured images
  const featuredImages = images.filter(img => img.is_featured).slice(0, 6);

  // Filter images by category and search
  const filteredImages = images.filter(img => {
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch = !search.trim() || 
      (img.caption && img.caption.toLowerCase().includes(search.toLowerCase())) ||
      (img.name && img.name.toLowerCase().includes(search.toLowerCase())) ||
      (img.tags && Array.isArray(img.tags) && img.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (page - 1) * IMAGES_PER_PAGE;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = useCallback((direction) => {
    if (!selectedImage || filteredImages.length === 0) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  }, [selectedImage, filteredImages]);

  // Swipe handlers for mobile
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateImage('next');
    }
    if (isRightSwipe) {
      navigateImage('prev');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateImage('next');
        if (e.key === 'ArrowLeft') navigateImage('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateImage]);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Gallery"
        description="Browse our photo gallery showcasing the work and events of World March of Women Kenya."
        keywords="gallery, photos, events, women's rights, Kenya, World March of Women"
      />

      {/* Editorial Hero — full-width, immersive, high-end */}
      <section 
        className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end overflow-hidden text-white"
        aria-label="Photo Gallery"
      >
        {/* Background image — full bleed, subtle parallax feel */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/women.jpeg)' }}
        />
        {/* Layered overlays — depth and brand */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a24] via-[#2d1542]/85 to-[#43245A]/60" />
        <div className="absolute inset-0 bg-[#43245A]/40 mix-blend-multiply" />
        {/* Soft blur strip at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Grain texture */}
        <div className="gallery-hero-grain z-[1]" />

        {/* Content — asymmetric, editorial */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 pb-16 md:pb-24 pt-32 md:pt-40">
          <div className="max-w-2xl">
            {/* Eyebrow / label */}
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-white/70 mb-6 animate-fade-in-up">
              Stories in focus
            </p>
            {/* Main title — bold, spaced, confident */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.02em] leading-[0.95] mb-6 animate-fade-in-up animation-delay-200 uppercase">
              Photo Gallery
            </h1>
            {/* Subtitle — poetic, editorial */}
            <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/90 max-w-xl mb-10 animate-fade-in-up animation-delay-400">
              Where movement meets memory. Moments of resistance, solidarity, and transformation across Kenya.
            </p>
            {/* CTA — sleek pill, ghost style */}
            <div className="animate-fade-in-up animation-delay-600 group">
              <a
                href="#gallery-content"
                className="gallery-hero-cta inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/5 px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white backdrop-blur-sm"
              >
                Explore the Gallery
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Images Section — same editorial card language */}
      {featuredImages.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 md:mb-10">
              <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-primary/70 mb-2">Highlighted</p>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-primary">Featured moments</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredImages.map((image, index) => (
                <div
                  key={image.id || image.name}
                  className={`gallery-card group relative aspect-square overflow-hidden cursor-pointer bg-white ${index < 6 ? 'gallery-reveal' : ''}`}
                  style={index < 6 ? { animationDelay: `${index * 0.06}s` } : {}}
                  onClick={() => openLightbox(image)}
                >
                  <OptimizedImage
                    src={image.url}
                    alt={image.alt_text || image.name}
                    className="w-full h-full object-cover"
                  />
                  {(image.caption || image.category) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      {image.category && (
                        <p className="text-white/80 text-[10px] md:text-xs font-medium uppercase tracking-wider mb-1">
                          {image.category}
                        </p>
                      )}
                      {image.caption && (
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Content — editorial grid */}
      <section id="gallery-content" ref={galleryContentRef} className="py-12 md:py-20 bg-white scroll-mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal pill filter bar */}
          <div className="mb-10 md:mb-14 space-y-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`gallery-pill px-4 py-2 rounded-full text-sm md:text-base ${
                    selectedCategory === category
                      ? 'gallery-pill-active bg-primary text-white'
                      : 'bg-[#f5f0f8] text-primary/90 hover:bg-primary/10'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm md:text-base text-primary/70 font-light tracking-tight">
                {filteredImages.length === 0 ? (
                  'No moments in this view'
                ) : totalPages <= 1 ? (
                  <>{filteredImages.length} {filteredImages.length === 1 ? 'moment' : 'moments'}{selectedCategory !== 'all' && <> in {selectedCategory}</>}</>
                ) : (
                  <>{filteredImages.length} {filteredImages.length === 1 ? 'moment' : 'moments'} · {paginatedImages.length} in frame{selectedCategory !== 'all' && <> · {selectedCategory}</>}</>
                )}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`gallery-pill p-2.5 rounded-full transition-colors duration-300 ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-[#f5f0f8] text-primary/80 hover:bg-primary/10'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`gallery-pill p-2.5 rounded-full transition-colors duration-300 ${
                    viewMode === 'masonry' ? 'bg-primary text-white' : 'bg-[#f5f0f8] text-primary/80 hover:bg-primary/10'
                  }`}
                  aria-label="Masonry view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
              <p className="text-xl text-accent">Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-lg font-semibold mb-2">Error Loading Gallery</p>
                <p className="text-red-600 mb-4">{error}</p>
                {error.includes('bucket') || error.includes('Bucket') ? (
                  <div className="bg-white rounded-lg p-4 mb-4 text-left text-sm text-red-700">
                    <p className="font-semibold mb-2">To fix this:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to Supabase Dashboard → Storage</li>
                      <li>Create a new bucket named "gallery"</li>
                      <li>Set it to Public</li>
                      <li>Set up storage policies (see GALLERY_STORAGE_SETUP.md)</li>
                    </ol>
                  </div>
                ) : null}
                <button
                  onClick={loadGalleryImages}
                  className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : paginatedImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-[#faf8fc] rounded-2xl p-12 max-w-md mx-auto border border-primary/5">
                <svg className="w-20 h-20 text-primary/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg text-primary/80 font-medium mb-2 tracking-tight">No moments here</p>
                <p className="text-sm text-primary/60 font-light">
                  {search.trim() || selectedCategory !== 'all'
                    ? 'Try another filter or search.'
                    : 'Check back soon — more of the archive is on its way.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Image Grid — masonry / grid with editorial cards */}
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6'
                : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-5 md:gap-6 space-y-4 sm:space-y-5 md:space-y-6'
              }>
                {paginatedImages.map((image, index) => (
                  <div
                    key={image.id || image.name}
                    className={`gallery-card gallery-reveal group relative break-inside-avoid cursor-pointer bg-white ${
                      viewMode === 'grid' ? 'aspect-square' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => openLightbox(image)}
                  >
                    <OptimizedImage
                      src={image.url}
                      alt={image.alt_text || image.name}
                      className={`w-full ${viewMode === 'grid' ? 'h-full object-cover' : 'h-auto object-cover'}`}
                      loading="lazy"
                    />
                    {/* Soft overlay on hover — title, moment, expand */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-stretch justify-end p-4 md:p-5">
                      <div className="mt-auto">
                        {image.caption && (
                          <p className="text-white/95 text-sm md:text-base font-medium line-clamp-2 mb-1.5 leading-snug">
                            {image.caption}
                          </p>
                        )}
                        {image.category && (
                          <span className="text-white/70 text-[11px] md:text-xs font-medium uppercase tracking-wider">
                            {image.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Expand / view icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md inline-flex" aria-hidden="true">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6m0 0v6m0-6l-3 3m18-3l-3-3m3 18v-6m0 6h-6m6 0l3-3m-18 3l3-3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination — minimal pill bar */}
              {totalPages > 1 && (
                <nav className="mt-14 flex flex-wrap justify-center items-center gap-2 sm:gap-3" aria-label="Gallery pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`gallery-pill px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                      page === 1
                        ? 'bg-[#e8e4ec] text-primary/40 cursor-not-allowed'
                        : 'bg-[#f5f0f8] text-primary hover:bg-primary/10'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`gallery-pill px-3.5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                            page === pageNum
                              ? 'gallery-pill-active bg-primary text-white'
                              : 'bg-[#f5f0f8] text-primary/90 hover:bg-primary/10'
                          }`}
                          aria-label={`Page ${pageNum}`}
                          aria-current={page === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-1 text-primary/40 text-sm">…</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`gallery-pill px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                      page === totalPages
                        ? 'bg-[#e8e4ec] text-primary/40 cursor-not-allowed'
                        : 'bg-[#f5f0f8] text-primary hover:bg-primary/10'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300 group"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          {filteredImages.length > 1 && (
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <p className="text-white text-sm font-medium">
                {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
              </p>
            </div>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.alt_text || selectedImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Caption */}
            {selectedImage.caption && (
              <div className="mt-4 max-w-2xl px-4">
                <p className="text-white text-center text-lg font-medium">
                  {selectedImage.caption}
                </p>
                {selectedImage.category && (
                  <p className="text-white/80 text-center text-sm mt-2">
                    Category: {selectedImage.category}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
