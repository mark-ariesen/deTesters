import cypress from 'eslint-plugin-cypress';

export default [
  // App / general JS rules (optional)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Cypress test files
  {
    files: ['cypress/**/*.js'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
];