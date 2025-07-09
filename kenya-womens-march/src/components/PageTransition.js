import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {displayChildren}
    </div>
  );
};

export default PageTransition; 