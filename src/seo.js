// Pure helpers shared by the browser bundle, vite.config.js and the build scripts.
// Nothing in here touches the DOM or import.meta.env, so Node can import it directly.

export const SEO = {
  title: 'Sachin Sahoo | QA Engineer | Software Testing, API Testing & Automation',
  description:
    "Explore Sachin Sahoo QA Engineer portfolio featuring SaaS application testing, API testing, Selenium automation, Android testing, regression testing, and software quality assurance.",
  siteName: 'Sachin Sahoo QA',
  jobTitle: 'QA Engineer',
  personDescription:
    'QA Engineer testing web applications, SaaS platforms, REST APIs and Android applications.',
  ogImagePath: 'og-image.png',
  ogImageAlt: 'Sachin Sahoo, QA Engineer. Software testing, API testing and automation.',
  knowsAbout: [
    'Software testing',
    'Lead management system testing',
    'Functional testing',
    'Regression testing',
    'API testing',
    'Selenium WebDriver',
    'Android application testing',
    'Role-based access control testing',
    'Software quality assurance',
  ],
};

/** Returns an origin+path without trailing slash, or '' if missing, invalid or a placeholder. */
export function normalizeSiteUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    if (!/^https?:$/.test(url.protocol)) return '';
    if (/your-domain|(^|\.)example\.(com|org|net)$/i.test(url.hostname)) return '';
    return (url.origin + url.pathname).replace(/\/+$/, '');
  } catch {
    return '';
  }
}

/** Only http(s) URLs are accepted, so a typo can never become a javascript: link. */
export function safeHttpUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    return /^https?:$/.test(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function cleanEmail(value) {
  const email = String(value || '').trim();
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email) ? email : '';
}

/**
 * Accepts a phone number as you would write it (e.g. "+91 98765 43210"). Returns it unchanged for display,
 * or '' if it is missing, has no 7-15 digits, or contains anything other than digits and + ( ) . - spaces.
 */
export function cleanPhone(value) {
  const phone = String(value || '').trim();
  if (!/^\+?[\d\s().-]+$/.test(phone)) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? phone : '';
}

/** Builds a dialable tel: link: keeps a leading + and digits only. */
export function phoneHref(phone) {
  if (!phone) return '';
  return `tel:${phone.startsWith('+') ? '+' : ''}${phone.replace(/\D/g, '')}`;
}

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildJsonLd({ siteUrl, github, linkedin }) {
  const personId = siteUrl ? `${siteUrl}/#person` : undefined;
  const sameAs = [github, linkedin].filter(Boolean);
  const person = {
    '@type': 'Person',
    ...(personId && { '@id': personId }),
    name: 'Sachin Sahoo',
    jobTitle: SEO.jobTitle,
    description: SEO.personDescription,
    knowsAbout: SEO.knowsAbout,
    ...(siteUrl && { url: `${siteUrl}/` }),
    ...(sameAs.length && { sameAs }),
  };
  const graph = [person];
  if (siteUrl) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: SEO.siteName,
      url: `${siteUrl}/`,
      inLanguage: 'en',
      publisher: { '@id': personId },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildHeadTags(cfg) {
  const { siteUrl } = cfg;
  const image = siteUrl ? `${siteUrl}/${SEO.ogImagePath}` : '';
  const t = [];
  t.push(`<title>${escapeAttr(SEO.title)}</title>`);
  t.push(`<meta name="description" content="${escapeAttr(SEO.description)}" />`);
  t.push('<meta name="robots" content="index, follow, max-image-preview:large" />');
  t.push('<meta name="author" content="Sachin Sahoo" />');
  if (siteUrl) t.push(`<link rel="canonical" href="${escapeAttr(siteUrl + '/')}" />`);
  t.push('<meta property="og:type" content="website" />');
  t.push(`<meta property="og:site_name" content="${escapeAttr(SEO.siteName)}" />`);
  t.push(`<meta property="og:title" content="${escapeAttr(SEO.title)}" />`);
  t.push(`<meta property="og:description" content="${escapeAttr(SEO.description)}" />`);
  t.push('<meta property="og:locale" content="en" />');
  if (siteUrl) t.push(`<meta property="og:url" content="${escapeAttr(siteUrl + '/')}" />`);
  if (image) {
    t.push(`<meta property="og:image" content="${escapeAttr(image)}" />`);
    t.push('<meta property="og:image:width" content="1200" />');
    t.push('<meta property="og:image:height" content="630" />');
    t.push(`<meta property="og:image:alt" content="${escapeAttr(SEO.ogImageAlt)}" />`);
  }
  t.push(`<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`);
  t.push(`<meta name="twitter:title" content="${escapeAttr(SEO.title)}" />`);
  t.push(`<meta name="twitter:description" content="${escapeAttr(SEO.description)}" />`);
  if (image) {
    t.push(`<meta name="twitter:image" content="${escapeAttr(image)}" />`);
    t.push(`<meta name="twitter:image:alt" content="${escapeAttr(SEO.ogImageAlt)}" />`);
  }
  const json = JSON.stringify(buildJsonLd(cfg)).replace(/</g, '\\u003c');
  t.push(`<script type="application/ld+json">${json}</script>`);
  return t.join('\n    ');
}

export function buildSitemap(siteUrl, isoDate) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${isoDate}</lastmod>
  </url>
</urlset>
`;
}

export function buildRobots(siteUrl) {
  const lines = ['User-agent: *', 'Allow: /'];
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  return lines.join('\n') + '\n';
}
