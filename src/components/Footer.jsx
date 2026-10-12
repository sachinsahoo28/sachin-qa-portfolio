import { useEffect, useState } from 'react';
import { NAV_ITEMS, site } from '../data/site.js';
import { GitHubIcon, LinkedInIcon } from './BrandIcons.jsx';

export default function Footer() {
  // The year is rendered at build time for crawlers and refreshed in the browser,
  // so the notice stays current without a hydration mismatch.
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-name">{site.name}</p>
          <p className="footer-role">{site.role}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        {(site.github || site.linkedin) && (
          <ul className="footer-social" role="list" aria-label="Profiles">
            {site.github && (
              <li>
                <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                  <GitHubIcon />
                </a>
              </li>
            )}
            {site.linkedin && (
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                  <LinkedInIcon />
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="container footer-legal">
        <p>
          &copy; <span suppressHydrationWarning>{year}</span> {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
