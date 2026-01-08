import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  build: {
    // Align behavior with the prior GitHub Pages deployment
    format: 'file'
  }
});