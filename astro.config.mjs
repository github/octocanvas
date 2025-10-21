// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

// Load environment variables
const { SITE, BASE_URL } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  // Configure for static site generation
  output: 'static',

  // GitHub Pages deployment configuration
  // Set the base to your repository name for GitHub Pages
  site: SITE || 'https://githubuniverse.github.io',
  base: BASE_URL || '/octocanvas',

  // Integrations
  integrations: [
    tailwind(),
    preact({ compat: true })
  ],
});
