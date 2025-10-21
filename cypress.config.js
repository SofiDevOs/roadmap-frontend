import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    supportFile: "cypress/e2e/support/e2e.js",
    baseUrl: 'http://localhost:4321/',
  }
})
