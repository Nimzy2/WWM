import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({ 
  title = "World March of Women Kenya",
  description = "Empowering women through advocacy, education, and grassroots mobilization for gender equality and social justice in Kenya.",
  keywords = "women's rights, gender equality, Kenya, women empowerment, social justice, grassroots mobilization, feminist movement, women's advocacy, community development, women's education",
  image = "/WMW-New Logo.jpg",
  url = "https://worldmarchofwomenkenya.org",
  type = "website",
  author = "World March of Women Kenya"
}) => {
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
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="World March of Women Kenya" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}${image}`} />
      <meta name="twitter:creator" content="@Wmwkenya" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead; 