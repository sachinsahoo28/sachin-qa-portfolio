import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { buildHeadTags, normalizeSiteUrl, safeHttpUrl } from './src/seo.js';

function normalizeBase(value) {
  if (!value) return '/';
  let base = value.trim();
  if (!base.startsWith('/')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  return base;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const seoConfig = {
    siteUrl: normalizeSiteUrl(env.VITE_SITE_URL),
    github: safeHttpUrl(env.VITE_GITHUB_URL),
    linkedin: safeHttpUrl(env.VITE_LINKEDIN_URL),
  };

  return {
    base: normalizeBase(env.VITE_BASE_PATH),
    plugins: [
      react(),
      {
        // Injects title, description, canonical, Open Graph, Twitter and JSON-LD
        // in both `vite dev` and `vite build`, from one source of truth (src/seo.js).
        name: 'inject-seo-head',
        transformIndexHtml(html) {
          return html.replace('<!--seo-head-->', buildHeadTags(seoConfig));
        },
      },
    ],
    build: { target: 'es2020' },
  };
});
