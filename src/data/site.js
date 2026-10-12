import { cleanEmail, cleanPhone, normalizeSiteUrl, safeHttpUrl } from '../seo.js';

const env = import.meta.env;
const base = env.BASE_URL || '/';

function resolveResume(value) {
  const v = (value || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return safeHttpUrl(v);
  if (/^[\w\-./ ]+\.pdf$/i.test(v)) return base + v.replace(/^\/+/, '');
  return '';
}

/** Everything personal and configurable lives here, driven by .env (see .env.example). */
export const site = {
  name: 'Sachin Sahoo',
  brand: 'Sachin Sahoo QA',
  role: 'QA Engineer',
  fullRole: 'Software Quality Assurance Engineer',
  siteUrl: normalizeSiteUrl(env.VITE_SITE_URL),
  email: cleanEmail(env.VITE_CONTACT_EMAIL),
  /** Set VITE_CONTACT_PHONE in .env (e.g. +91 98765 43210). Until then Contact shows the placeholder below. */
  phone: cleanPhone(env.VITE_CONTACT_PHONE),
  github: safeHttpUrl(env.VITE_GITHUB_URL),
  linkedin: safeHttpUrl(env.VITE_LINKEDIN_URL),
  resumeUrl: resolveResume(env.VITE_RESUME_URL),
  placeholders: {
    email: 'your.email@example.com',
    phone: 'YOUR_PHONE_NUMBER',
    github: 'github.com/your-username',
    linkedin: 'linkedin.com/in/your-profile',
  },
};

/**
 * Optional portrait for the hero (right-hand column on desktop, below the intro on mobile).
 * Files live in /public: 320w and 640w versions in WebP with JPEG fallbacks, all cropped 4:5 from your photo.
 * Set `profilePhoto = null` to hide it; the test-run panel then takes its place in the hero.
 */
export const profilePhoto = {
  webpSet: `${base}profile-320.webp 320w, ${base}profile-640.webp 640w`,
  src: base + 'profile-640.jpg',
  jpgSet: `${base}profile-320.jpg 320w, ${base}profile-640.jpg 640w`,
  width: 640,
  height: 800,
  alt: 'Portrait of Sachin Sahoo, QA Engineer, wearing glasses and a navy suit against a grey background',
};

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'approach', label: 'Testing Approach' },
  { id: 'game', label: 'QA Game' },
  { id: 'contact', label: 'Contact' },
];

// Sections that exist on the page but are not in the nav map to the nav item before them.
export const SECTION_TO_NAV = { expertise: 'approach' };
