import React, { useEffect } from 'react';
import { seoConfig } from '../../config/seo';
import { cleanTitle } from '../../lib/contentSanitizer';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  type?: 'website' | 'article' | 'profile'; // Friendly alias for ogType
  ogImage?: string;
  image?: string; // Friendly alias for ogImage
  twitterImage?: string;
  robots?: string;
  noIndex?: boolean; // When true, strictly prevents search engine indexing (noindex, nofollow)
  keywords?: string[];
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    section: string;
    tags?: string[];
  };
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: 'WebSite' | 'Organization' | 'LocalBusiness' | 'Service' | 'Article' | 'TechArticle' | 'NewsArticle' | 'FAQPage';
  customSchema?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Helper to update or create an HTML <meta> tag by name or property attribute.
 */
function updateMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a <link rel="..."> tag in document.head.
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Enterprise SEO & Structured Data Management Component.
 * Updates DOM head metadata, Open Graph, Twitter/X cards, canonical URLs,
 * and injects valid JSON-LD structured schemas on route transitions.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  ogType,
  type,
  ogImage,
  image,
  twitterImage,
  robots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  noIndex = false,
  keywords,
  article,
  breadcrumbs,
  schemaType = 'WebSite',
  customSchema,
}) => {
  // Resolve type & image aliases
  const resolvedOgType = (type || ogType || 'website') as 'website' | 'article' | 'profile';
  const resolvedImage = image || ogImage || seoConfig.defaultOgImage;
  const resolvedTwitterImage = twitterImage || resolvedImage || seoConfig.defaultTwitterImage;

  // Strict hashtag removal on title and description (Ensures hashtags NEVER appear in Page titles, OG titles, or structured data)
  const fullTitle = cleanTitle(title || seoConfig.defaultTitle);
  const metaDescription = cleanTitle(description || seoConfig.defaultDescription);
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${seoConfig.siteUrl}${cleanPath === '/' ? '' : cleanPath}`;
  const keywordsList = keywords && keywords.length > 0 ? keywords.join(', ') : seoConfig.defaultKeywords.join(', ');

  // Strict search engine indexing control: prevent indexing of drafts, preview pages, admin pages, etc.
  const effectiveRobots = noIndex || robots.includes('noindex')
    ? 'noindex, nofollow, noarchive'
    : robots;

  useEffect(() => {
    // 1. Update Title (sanitized without hashtags)
    document.title = fullTitle;

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', metaDescription);
    updateMetaTag('name', 'robots', effectiveRobots);
    updateMetaTag('name', 'googlebot', effectiveRobots);
    updateMetaTag('name', 'keywords', keywordsList);
    updateMetaTag('name', 'author', seoConfig.companyName);
    updateMetaTag('name', 'theme-color', seoConfig.themeColor);

    // 3. Canonical Link (only if page is allowed to be indexed)
    if (!effectiveRobots.includes('noindex')) {
      updateLinkTag('canonical', canonicalUrl);
    }

    // 4. Open Graph Tags (clean headline & valid image)
    updateMetaTag('property', 'og:site_name', seoConfig.companyName);
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', resolvedOgType);
    updateMetaTag('property', 'og:image', resolvedImage);
    updateMetaTag('property', 'og:image:alt', fullTitle);
    updateMetaTag('property', 'og:locale', seoConfig.locale);

    // 5. Twitter/X Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:site', '@kjt_technologies');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', resolvedTwitterImage);
    updateMetaTag('name', 'twitter:image:alt', fullTitle);

    // 6. Article Meta Tags (if applicable)
    if (resolvedOgType === 'article' && article) {
      updateMetaTag('property', 'article:published_time', article.publishedTime);
      if (article.modifiedTime) {
        updateMetaTag('property', 'article:modified_time', article.modifiedTime);
      }
      updateMetaTag('property', 'article:author', article.author);
      updateMetaTag('property', 'article:section', article.section);
      if (article.tags && article.tags.length > 0) {
        // Strip any remaining hash characters from tags for article:tag meta
        const cleanTagList = article.tags.map((t) => cleanTitle(t.replace(/^#+/, ''))).filter(Boolean);
        updateMetaTag('property', 'article:tag', cleanTagList.join(', '));
      }
    }

    // 7. Structured Data (JSON-LD)
    const scriptId = 'kjt-structured-data-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    // // CUSTOMIZE HERE: Set the official domain so search engines can find the complete logo URL.
    const absoluteLogoUrl = `${seoConfig.siteUrl.replace(/\/$/, '')}/images/branding/kjt-technologies-logo.png`;

    // Base Corporate Organization Schema
    const organizationSchema = {
      '@type': 'Organization',
      '@id': `${seoConfig.siteUrl}/#organization`,
      name: seoConfig.companyName,
      legalName: seoConfig.legalName,
      url: seoConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteLogoUrl,
        caption: `${seoConfig.companyName} Logo`,
      },
      slogan: seoConfig.motto, // "Accelerating Innovation, Securing Data."
      description: seoConfig.defaultDescription,
      telephone: seoConfig.telephone,
      email: seoConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${seoConfig.location.streetAddress}, ${seoConfig.location.buildingSuite}`,
        addressLocality: seoConfig.location.city,
        addressRegion: seoConfig.location.district,
        postalCode: seoConfig.location.postalCode,
        addressCountry: seoConfig.location.country,
      },
      sameAs: [
        seoConfig.socialProfiles.linkedin,
        seoConfig.socialProfiles.twitter,
        seoConfig.socialProfiles.github,
        seoConfig.socialProfiles.facebook,
        seoConfig.socialProfiles.instagram,
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: seoConfig.telephone,
          contactType: 'customer support',
          email: seoConfig.supportEmail,
          areaServed: seoConfig.location.serviceAreas,
          availableLanguage: ['English', 'Luganda', 'Swahili'],
        },
        {
          '@type': 'ContactPoint',
          telephone: seoConfig.telephone,
          contactType: 'sales and inquiries',
          email: seoConfig.email,
          areaServed: seoConfig.location.serviceAreas,
          availableLanguage: ['English'],
        },
      ],
    };

    // ProfessionalService / LocalBusiness Schema
    const localBusinessSchema = {
      '@type': 'ProfessionalService',
      '@id': `${seoConfig.siteUrl}/#localbusiness`,
      name: seoConfig.companyName,
      image: seoConfig.defaultOgImage,
      url: seoConfig.siteUrl,
      telephone: seoConfig.telephone,
      priceRange: '$$',
      slogan: seoConfig.motto,
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${seoConfig.location.streetAddress}, ${seoConfig.location.buildingSuite}`,
        addressLocality: seoConfig.location.city,
        addressRegion: seoConfig.location.district,
        postalCode: seoConfig.location.postalCode,
        addressCountry: seoConfig.location.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: seoConfig.location.latitude,
        longitude: seoConfig.location.longitude,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '14:00',
        },
      ],
      areaServed: seoConfig.location.serviceAreas.map((area) => ({
        '@type': 'AdministrativeArea',
        name: area,
      })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Technology & Security Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Software & Web Application Development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Cybersecurity Auditing & Penetration Testing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial 4K CCTV Camera Installation',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Computer Networking & Structured Cabling',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'School Management & Enterprise ERP Systems',
            },
          },
        ],
      },
    };

    // WebSite Schema
    const websiteSchema = {
      '@type': 'WebSite',
      '@id': `${seoConfig.siteUrl}/#website`,
      url: seoConfig.siteUrl,
      name: seoConfig.companyName,
      description: seoConfig.defaultDescription,
      publisher: {
        '@id': `${seoConfig.siteUrl}/#organization`,
      },
      image: absoluteLogoUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${seoConfig.siteUrl}/services?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    const graphItems: any[] = [organizationSchema, localBusinessSchema, websiteSchema];

    // Optional BreadcrumbList Schema (Clean names without hashtags)
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: cleanTitle(crumb.name),
          item: crumb.item.startsWith('http') ? crumb.item : `${seoConfig.siteUrl}${crumb.item}`,
        })),
      };
      graphItems.push(breadcrumbSchema);
    }

    // Comprehensive Article / NewsArticle / TechArticle Schema
    if (resolvedOgType === 'article' || article) {
      const articleCleanHeadline = cleanTitle(fullTitle.replace(/\s*\|\s*KJT TECHNOLOGIES.*$/i, ''));
      const articleStructuredImage = resolvedImage.startsWith('http')
        ? resolvedImage
        : `${seoConfig.siteUrl}${resolvedImage}`;

      const resolvedSchemaType =
        schemaType === 'Article' || schemaType === 'NewsArticle' || schemaType === 'TechArticle'
          ? schemaType
          : 'TechArticle';

      const articleSchema: Record<string, any> = {
        '@type': resolvedSchemaType,
        '@id': `${canonicalUrl}#article`,
        isPartOf: {
          '@id': `${seoConfig.siteUrl}/#website`,
        },
        headline: articleCleanHeadline,
        name: articleCleanHeadline,
        description: metaDescription,
        url: canonicalUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        datePublished: article?.publishedTime || new Date().toISOString().split('T')[0],
        dateModified: article?.modifiedTime || article?.publishedTime || new Date().toISOString().split('T')[0],
        author: {
          '@type': 'Person',
          name: article?.author || 'KJT Engineering Team',
          url: `${seoConfig.siteUrl}/about`,
        },
        publisher: {
          '@id': `${seoConfig.siteUrl}/#organization`,
        },
        image: {
          '@type': 'ImageObject',
          url: articleStructuredImage,
          caption: articleCleanHeadline,
        },
        articleSection: article?.section || 'Technology',
        keywords: article?.tags?.map((t) => cleanTitle(t.replace(/^#+/, ''))).join(', ') || keywordsList,
      };

      graphItems.push(articleSchema);
    }

    // Append custom schema if passed (e.g. Service, FAQPage)
    if (customSchema) {
      if (Array.isArray(customSchema)) {
        graphItems.push(...customSchema);
      } else {
        graphItems.push(customSchema);
      }
    }

    const structuredDataPayload = {
      '@context': 'https://schema.org',
      '@graph': graphItems,
    };

    scriptTag.textContent = JSON.stringify(structuredDataPayload, null, 2);
  }, [
    fullTitle,
    metaDescription,
    canonicalUrl,
    resolvedImage,
    resolvedTwitterImage,
    effectiveRobots,
    keywordsList,
    resolvedOgType,
    article,
    breadcrumbs,
    schemaType,
    customSchema,
  ]);

  return null;
};
