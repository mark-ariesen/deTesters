const { defineConfig } = require('cypress')
const cyGrep = require('@bahmutov/cy-grep/src/plugin')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://test-rpg.vercel.app/',
    setupNodeEvents(on, config) {
      cyGrep(config)
      return config
    },
  },
})
