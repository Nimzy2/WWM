import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  title = "World March of Women Kenya",
  description = "Empowering women through advocacy, education, and grassroots mobilization for gender equality and social justice in Kenya.",
  keywords = "women's rights, gender equality, Kenya, women empowerment, social justice, grassroots mobilization, feminist movement, women's advocacy, community development, women's education",
  image = "/WMW-New Logo.jpg",
  url,
  type = "website",
  author = "World March of Women Kenya"
}) => {
  const location = useLocation();
  
  // Get base URL from environment variable or default to production URL
  const baseUrl = process.env.REACT_APP_SITE_URL || "https://www.worldmarchofwomenkenya.co.ke";
  
  // Construct full URL with current path if not provided
  const fullUrl = url || `${baseUrl}${location.pathname}`;
  
  const fullTitle = title === "World March of Women Kenya" 
    ? title 
    : `${title} - World March of Women Kenya`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="World March of Women Kenya" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:creator" content="@Wmwkenya" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEOHead; 