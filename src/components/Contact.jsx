import { FileDown, Mail, Phone } from 'lucide-react';
import { site } from '../data/site.js';
import { phoneHref } from '../seo.js';
import { GitHubIcon, LinkedInIcon } from './BrandIcons.jsx';

const stripProtocol = (url) => url.replace(/^https?:\/\//i, '').replace(/\/$/, '');

function ContactRow({ icon, label, href, text, placeholder, external, download, valueClass = '' }) {
  return (
    <li className="contact-row">
      <span className="contact-icon">{icon}</span>
      <span className="contact-label">{label}</span>
      {href ? (
        <a
          className={`contact-value ${valueClass}`.trim()}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...(download ? { download: true } : {})}
        >
          {text}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      ) : (
        <span className={`contact-value contact-placeholder ${valueClass}`.trim()}>{placeholder}</span>
      )}
    </li>
  );
}

export default function Contact() {
  const mailto = `mailto:${site.email || 'YOUR_EMAIL_ADDRESS'}?subject=${encodeURIComponent('QA Engineer Portfolio Inquiry')}`;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div>
          <h2 id="contact-title" className="section-title">
            Contact Sachin Sahoo, QA Engineer
          </h2>
          <p className="section-lead">
            If you are hiring a software testing engineer, or need a web, API or Android application tested, send me an
            email and tell me what you are building.
          </p>
          <a className="btn btn-primary contact-cta" href={mailto}>
            <Mail size={18} aria-hidden="true" />
            <span>Email me</span>
          </a>
        </div>
        <ul className="contact-list" role="list">
          <ContactRow
            icon={<Mail size={20} aria-hidden="true" />}
            label="Email"
            href={mailto}
            text={site.email}
            placeholder={site.placeholders.email}
          />
          <ContactRow
            icon={<Phone size={20} aria-hidden="true" />}
            label="Phone"
            href={phoneHref(site.phone)}
            text={site.phone}
            placeholder={site.placeholders.phone}
            valueClass="contact-phone"
          />
          <ContactRow
            icon={<GitHubIcon />}
            label="GitHub"
            href={site.github}
            text={site.github && stripProtocol(site.github)}
            placeholder={site.placeholders.github}
            external
          />
          <ContactRow
            icon={<LinkedInIcon />}
            label="LinkedIn"
            href={site.linkedin}
            text={site.linkedin && stripProtocol(site.linkedin)}
            placeholder={site.placeholders.linkedin}
            external
          />
          {site.resumeUrl && (
            <ContactRow
              icon={<FileDown size={20} aria-hidden="true" />}
              label="Resume"
              href={site.resumeUrl}
              text="Download resume"
              download
            />
          )}
        </ul>
      </div>
    </section>
  );
}
