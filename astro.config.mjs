import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Netlify supplies URL at build time; set PUBLIC_SITE_URL for a custom domain.
  site: process.env.PUBLIC_SITE_URL || process.env.URL || 'https://anmin-zemi.netlify.app',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
});
