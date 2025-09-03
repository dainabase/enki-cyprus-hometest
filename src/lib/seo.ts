// SEO utilities and structured data

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const generateStructuredData = {
  // Real Estate Listing Schema
  property: (property: any) => ({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://enki-cyprus-homes.com/project/${property.id}`,
    "image": property.photos?.[0],
    "price": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": property.price
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location?.city,
      "addressCountry": "CY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.location?.coordinates?.lat,
      "longitude": property.location?.coordinates?.lng
    }
  }),

  // Organization Schema
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "ENKI Cyprus Homes",
    "url": "https://enki-cyprus-homes.com",
    "description": "Expert en immobilier à Chypre - Trouvez votre propriété de rêve",
    "areaServed": {
      "@type": "Country",
      "name": "Cyprus"
    },
    "serviceType": "Real Estate Services"
  }),

  // Website Schema
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ENKI Cyprus Homes",
    "url": "https://enki-cyprus-homes.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://enki-cyprus-homes.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  })
};

export const generatePageMetadata = (type: string, data?: any): SEOMetadata => {
  const baseMetadata = {
    title: "ENKI Cyprus Homes - Immobilier à Chypre",
    description: "Découvrez les meilleures propriétés à Chypre avec ENKI. Expertise immobilière, recherche avancée et accompagnement personnalisé.",
    keywords: ["immobilier chypre", "propriété chypre", "villa chypre", "appartement chypre"],
    canonical: "https://enki-cyprus-homes.com"
  };

  switch (type) {
    case 'home':
      return {
        ...baseMetadata,
        structuredData: generateStructuredData.website()
      };

    case 'property':
      return {
        title: `${data?.title} - ENKI Cyprus Homes`,
        description: `${data?.description?.substring(0, 150)}... | Prix: ${data?.price?.toLocaleString('fr-FR')}€`,
        keywords: [...baseMetadata.keywords, data?.type, data?.location?.city],
        canonical: `https://enki-cyprus-homes.com/project/${data?.id}`,
        ogImage: data?.photos?.[0],
        structuredData: generateStructuredData.property(data)
      };

    case 'search':
      return {
        title: "Recherche Propriétés - ENKI Cyprus Homes",
        description: "Recherchez parmi notre sélection exclusive de propriétés à Chypre. Filtres avancés et carte interactive.",
        keywords: [...baseMetadata.keywords, "recherche", "filtres"],
        canonical: "https://enki-cyprus-homes.com/search"
      };

    default:
      return baseMetadata;
  }
};

export const generateSitemap = (properties: any[]) => {
  const baseUrls = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/search', priority: '0.9', changefreq: 'daily' },
    { url: '/projects', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' }
  ];

  const propertyUrls = properties.map(property => ({
    url: `/project/${property.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: property.updated_at
  }));

  return [...baseUrls, ...propertyUrls];
};