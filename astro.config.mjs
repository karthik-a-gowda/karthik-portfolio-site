import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://karthik-a-gowda.github.io',
  base: '/karthik-portfolio-site',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
