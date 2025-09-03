import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "ENKI-REALTY - Immobilier Premium à Chypre",
  description = "Découvrez les meilleurs projets immobiliers à Chypre avec ENKI-REALTY. Appartements, villas et penthouses premium dans les meilleures localités.",
  keywords = "immobilier chypre, appartement chypre, villa chypre, penthouse chypre, investissement immobilier, immobilier premium",
  image = "/og-image.jpg",
  url,
  type = "website",
  canonical
}) => {
  const siteTitle = "ENKI-REALTY";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="ENKI-REALTY" />
      <meta name="language" content="fr" />
      <meta name="geo.region" content="CY" />
      <meta name="geo.country" content="Cyprus" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "ENKI-REALTY",
          "description": description,
          "url": "https://enki-realty.com",
          "logo": "https://enki-realty.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+357-XX-XXXXXX",
            "contactType": "Customer Service",
            "availableLanguage": ["French", "English", "Greek"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CY",
            "addressRegion": "Cyprus"
          },
          "sameAs": [
            "https://facebook.com/enki-realty",
            "https://instagram.com/enki-realty"
          ]
        })}
      </script>
    </Helmet>
  );
};