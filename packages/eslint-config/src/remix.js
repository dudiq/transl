module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    './react.js',
  ],
  overrides: [
    {
      files: ['*.route.ts', '**/app/routes/**'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
