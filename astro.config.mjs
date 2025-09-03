// @ts-check
import { defineConfig, envField } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";


import react from "@astrojs/react";


// https://astro.build/config
export default defineConfig({
  site: "https://sofidev.blog/",

  adapter: cloudflare({
    imageService: "compile"
  }),
  env: {
    schema:{BASE_API_URL: envField.string({context: "client", access:"public"})}
  },
  output: 'server',
  vite: {
    define: {
      "process.env": process.env
    }
  },
  integrations: [react()],
});