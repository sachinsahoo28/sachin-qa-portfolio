import { useEffect, useState } from 'react';
import { profilePhoto, site } from '../data/site.js';
import { GitHubIcon, LinkedInIcon } from './BrandIcons.jsx';
import TestRunPanel from './TestRunPanel.jsx';

// Displayed width: 21rem (336px) on desktop, up to 17rem (272px) on small screens.
const PHOTO_SIZES = '(min-width: 960px) 336px, 272px';
const ROLE_PHRASES = ['QA Engineer', 'Software Testing', 'API Testing'];

export default function Hero() {
  const [typedRole, setTypedRole] = useState('');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return undefined;

    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = ROLE_PHRASES[phraseIndex];
      if (!deleting && characterIndex < phrase.length) {
        characterIndex += 1;
        setTypedRole(phrase.slice(0, characterIndex));
        timer = window.setTimeout(tick, 70 + Math.floor(Math.random() * 31));
      } else if (!deleting) {
        deleting = true;
        timer = window.setTimeout(tick, 1200);
      } else if (characterIndex > 0) {
        characterIndex -= 1;
        setTypedRole(phrase.slice(0, characterIndex));
        timer = window.setTimeout(tick, 42);
      } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % ROLE_PHRASES.length;
        timer = window.setTimeout(tick, 220);
      }
    };

    timer = window.setTimeout(tick, 220);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-label">
            <span>QA ENGINEER</span>
            <span aria-hidden="true"> · </span>
            <span>SOFTWARE TESTING</span>
            <span aria-hidden="true"> · </span>
            <span>API VALIDATION</span>
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line">I Find the Bugs.</span>{' '}
            <span className="hero-title-line">I Validate the Logic.</span>{' '}
            <span className="hero-title-line">I Protect Quality.</span>
          </h1>
          <p className="hero-role">
            <span className="sr-only">QA Engineer | Software Testing | API Testing</span>
            <span className="hero-role-animated" aria-hidden="true">
              <span className="hero-role-measure">Software Testing</span>
              <span className="hero-role-typed">{typedRole || '\u00a0'}</span>
            </span>
            <span className="hero-role-static" aria-hidden="true">QA Engineer | Software Testing | API Testing</span>
          </p>
          <p className="hero-lead">
            I'm Sachin Sahoo, a QA Engineer focused on SaaS applications, web platforms, REST APIs, and Android testing. I
            validate business workflows, uncover defects, and help teams deliver more reliable software through
            structured testing.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              Explore My Projects
            </a>
            <a className="btn btn-ghost" href="#contact">
              Contact Me
            </a>
          </div>
          {(site.github || site.linkedin) && (
            <ul className="social-list" aria-label="Profiles">
              {site.github && (
                <li>
                  <a className="social-link" href={site.github} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                    <span>GitHub</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {site.linkedin && (
                <li>
                  <a className="social-link" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="hero-visual">
          {profilePhoto ? (
            <figure className="portrait">
              <picture>
                <source srcSet={profilePhoto.webpSet} sizes={PHOTO_SIZES} type="image/webp" />
                <source srcSet={profilePhoto.jpgSet} sizes={PHOTO_SIZES} type="image/jpeg" />
                <img
                  className="portrait-img"
                  src={profilePhoto.src}
                  alt={profilePhoto.alt}
                  width={profilePhoto.width}
                  height={profilePhoto.height}
                  decoding="async"
                />
              </picture>
            </figure>
          ) : (
            <TestRunPanel />
          )}
        </div>
      </div>
      {profilePhoto && (
        <div className="container hero-run">
          <TestRunPanel wide />
        </div>
      )}
    </section>
  );
}
