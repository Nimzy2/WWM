import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVlMmUyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2M1MzUzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=',
  loading = 'lazy',
  sizes = '100vw',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageStatus, setImageStatus] = useState('loading');
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setImageStatus('error');
      return;
    }

    setImageStatus('loading');
    setImageSrc(placeholder);

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageStatus('loaded');
    };
    img.onerror = () => {
      setImageSrc(fallback);
      setImageStatus('error');
    };
    img.src = src;
  }, [src, placeholder, fallback]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading !== 'lazy' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [loading]);

  const baseClasses = 'transition-opacity duration-300';
  const statusClasses = {
    loading: 'opacity-50',
    loaded: 'opacity-100',
    error: 'opacity-75'
  };

  return (
    <img
      ref={imgRef}
      src={loading === 'lazy' ? placeholder : imageSrc}
      data-src={loading === 'lazy' ? src : undefined}
      alt={alt}
      className={`${baseClasses} ${statusClasses[imageStatus]} ${className}`}
      loading={loading}
      sizes={sizes}
      {...props}
    />
  );
};

export default OptimizedImage; 