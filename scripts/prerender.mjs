// Runs after `vite build` and `vite build --ssr`. It:
//  1. renders the React app to HTML and writes it into dist/index.html (so crawlers see real content),
//  2. writes sitemap.xml and robots.txt for the configured production domain.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';
import { buildRobots, buildSitemap, normalizeSiteUrl } from '../src/seo.js';

const root = process.cwd();
const dist = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-server');

const env = loadEnv('production', root, 'VITE_');
const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);

const serverFile = (await readdir(serverDir)).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!serverFile) throw new Error('dist-server/entry-server.js was not found. Did the SSR build run?');
const { render } = await import(pathToFileURL(path.join(serverDir, serverFile)).href);

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const marker = '<div id="root"><!--app-html--></div>';
if (!template.includes(marker)) throw new Error('Could not find the root marker in dist/index.html.');
await writeFile(path.join(dist, 'index.html'), template.replace(marker, `<div id="root">${render()}</div>`));

await writeFile(path.join(dist, 'robots.txt'), buildRobots(siteUrl));
if (siteUrl) {
  await writeFile(path.join(dist, 'sitemap.xml'), buildSitemap(siteUrl, new Date().toISOString().slice(0, 10)));
}
await rm(serverDir, { recursive: true, force: true });

console.log('Pre-rendered dist/index.html');
if (siteUrl) {
  console.log(`Wrote sitemap.xml and robots.txt for ${siteUrl}`);
} else {
  console.warn(
    '\n[seo] VITE_SITE_URL is not set, so canonical, og:url, og:image, sitemap.xml and the robots.txt sitemap line were skipped.\n' +
      '      Copy .env.example to .env, set VITE_SITE_URL, and rebuild before publishing.\n',
  );
}
