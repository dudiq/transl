const baseRules = require('./rules/base')
const { getRestrictedRules } = require('./utils/getRestrictedRules')

module.exports = {
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
  ],
  ignorePatterns: ['node_modules', 'build', 'dist', '.cache', '.turbo'],
  plugins: ['import', 'security', 'prettier'],
  env: {
    jest: true,
    node: true,
    es2021: true,
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    ...baseRules,

    // control the usage of eslint-disable comments
    'eslint-comments/no-restricted-disable': [
      'warn',
      ...getRestrictedRules(baseRules),
    ],
  },
  overrides: [
    {
      files: ['tsup.config.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
