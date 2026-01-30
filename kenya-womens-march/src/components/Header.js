import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Helper function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e, path) => {
    // Only scroll if we're navigating to a different page
    if (location.pathname !== path) {
      e.preventDefault();
      navigate(path);
      setTimeout(() => {
        scrollToTop();
      }, 100);
    } else {
      // If already on the page, just scroll to top
      e.preventDefault();
      scrollToTop();
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
    { path: '/join', label: 'Join' },
    { path: '/gallery', label: 'Gallery' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-50 bg-primary shadow-lg">
      <header className="bg-primary text-white shadow-xl" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center" aria-label="World March of Women Kenya - Home">
                <img 
                  src="/WMW-New Logo.jpg" 
                  alt="World March of Women Kenya Logo" 
                  className="h-8 w-auto sm:h-10 md:h-12 mr-2 sm:mr-3 object-contain"
                />
                <span className="text-sm sm:text-lg md:text-xl font-bold hidden sm:block">
                  World March of Women Kenya
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block" role="navigation" aria-label="Main navigation">
              <div className="ml-6 lg:ml-10 flex items-baseline space-x-2 lg:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className={`px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary ${
                      isActive(item.path)
                        ? 'bg-accent text-primary'
                        : 'text-white hover:bg-accent hover:text-primary'
                    }`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={handleMenuToggle}
                onKeyDown={handleMenuKeyDown}
                className="text-white hover:text-accent focus:outline-none focus:text-accent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary p-2"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div 
              className="md:hidden" 
              id="mobile-menu"
              role="navigation" 
              aria-label="Mobile navigation"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      handleLinkClick(e, item.path);
                      handleMenuClose();
                    }}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary ${
                      isActive(item.path)
                        ? 'bg-accent text-primary'
                        : 'text-white hover:bg-accent hover:text-primary'
                    }`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header; 