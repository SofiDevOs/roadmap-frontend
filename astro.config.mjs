// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://sofidev.blog/",

  adapter: cloudflare({
    imageService: "compile"
  }),

  output: 'server',
  integrations: [react()],
});