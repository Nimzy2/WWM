import React from 'react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again.",
  showHomeButton = true,
  showRefreshButton = true,
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${className}`}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">
          {title}
        </h1>
        
        <p className="text-text mb-6 text-sm md:text-base">
          {message}
        </p>

        <div className="space-y-3">
          {showRefreshButton && (
            <button
              onClick={resetErrorBoundary || (() => window.location.reload())}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors duration-200 text-sm md:text-base"
            >
              Try Again
            </button>
          )}
          
          {showHomeButton && (
            <Link
              to="/"
              className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm md:text-base"
            >
              Go to Homepage
            </Link>
          )}
        </div>

        {/* Show error details in development */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-40">
              <div className="font-semibold mb-1">Error:</div>
              <div>{error.toString()}</div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback; 