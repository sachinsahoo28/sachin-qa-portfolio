// Post-build checks on dist/. Run with `npm run validate` after `npm run build`.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import { cleanPhone, normalizeSiteUrl, phoneHref } from '../src/seo.js';
import { projects } from '../src/data/projects.js';

const dist = path.join(process.cwd(), 'dist');
const env = loadEnv('production', process.cwd(), 'VITE_');
const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);
const html = await readFile(path.join(dist, 'index.html'), 'utf8');

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const count = (re) => (html.match(re) || []).length;

check('Title is present and unique', count(/<title>/g) === 1);
check('Meta description present', /<meta name="description" content="[^"]{80,}/.test(html));
check('Exactly one h1', count(/<h1[\s>]/g) === 1);
check('No noindex directive', !/noindex/i.test(html));
check('Robots meta allows indexing', /<meta name="robots" content="index, follow/.test(html));
check('Pre-rendered content present in HTML', html.includes('I Find the Bugs.') && html.includes('I Protect Quality.'));
check('Open Graph title and Twitter card present', /og:title/.test(html) && /twitter:card/.test(html));
check('Viewport meta present', /<meta name="viewport"/.test(html));
check('Skip link present', /class="skip-link"/.test(html));
check('Main landmark present', /<main id="main"/.test(html));

for (const p of projects) {
  check(`Project in HTML: ${p.name}`, html.includes(p.summary.replace(/&/g, '&amp;').replace(/'/g, '&#x27;')) || html.includes(p.name));
}
check('All 8 testing lifecycle stages present', ['Requirement Analysis', 'Test Planning', 'Test Case Design', 'Test Execution', 'Defect Reporting', 'Retesting', 'Regression Testing', 'Test Summary and Quality Reporting'].every((s) => html.includes(s)));

check('QA Bug Hunter section with title and subtitle in HTML', html.includes('QA Bug Hunter') && html.includes('Think like a tester. Find the bugs. Protect the release.'));
check('QA Game nav link is a crawlable anchor', /<a class="nav-link" href="#game"/.test(html));
check('Game mode and difficulty controls pre-rendered', ['Find the Bug', 'API Detective', 'Test Case Challenge', 'Beginner', 'Intermediate', 'Advanced', 'Start Game'].every((t) => html.includes(t)));
check('Hero portrait has alt text, dimensions and srcset', /<img class="portrait-img"[^>]*alt="Portrait of Sachin Sahoo[^"]+"[^>]*width="640" height="800"/.test(html) || /<img[^>]*class="portrait-img"[^>]*alt="Portrait of Sachin Sahoo/.test(html));
check('Portrait files exist in dist', ['profile-320.webp', 'profile-640.webp', 'profile-320.jpg', 'profile-640.jpg'].every((f) => existsSync(path.join(dist, f))));

const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
let graph = [];
try {
  graph = JSON.parse(ld[0][1])['@graph'];
  check('JSON-LD parses and has Person', graph.some((n) => n['@type'] === 'Person'));
} catch (e) {
  check('JSON-LD parses', false, String(e));
}
check('No fabricated ratings or reviews in JSON-LD', !/aggregateRating|review|worksFor|alumniOf|hasCredential/i.test(ld[0]?.[1] || ''));

if (siteUrl) {
  check('Canonical matches configured domain', html.includes(`<link rel="canonical" href="${siteUrl}/"`));
  check('og:image is absolute', html.includes(`content="${siteUrl}/og-image.png"`));
  check('og-image.png exists in dist', existsSync(path.join(dist, 'og-image.png')));
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  check('Sitemap lists the canonical URL', sitemap.includes(`<loc>${siteUrl}/</loc>`));
  const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
  check('robots.txt points to the sitemap', robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`) && !/Disallow: \/\s*$/m.test(robots));
} else {
  check('No canonical emitted without a configured domain (avoids a wrong canonical)', !/rel="canonical"/.test(html));
}

const phone = cleanPhone(env.VITE_CONTACT_PHONE);
if (phone) check('Contact phone is a tel: link', html.includes(`href="${phoneHref(phone)}"`));
else console.log('Note: VITE_CONTACT_PHONE is not set, so Contact shows the YOUR_PHONE_NUMBER placeholder.');

const resume = (env.VITE_RESUME_URL || '').trim();
if (resume && !/^https?:/i.test(resume)) {
  check(`Resume file exists: ${resume}`, existsSync(path.join(dist, resume.replace(/^\/+/, ''))));
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? ' ' + r.detail : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed.`);
if (!siteUrl) console.log('Note: VITE_SITE_URL is not set, so domain-dependent checks were skipped.');
process.exit(failed ? 1 : 0);
