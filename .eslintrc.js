
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect', // Automatically detect the react version
    },
  },
  ignorePatterns: [ '**/build/**', '**/node_modules/**', '**/extra/**','dist',
    '.eslintrc.cjs',
    'nodejs',
    'node_modules',
    'jaksec',
    'extra',
    'ecosystem.config.cjs',
    'package-lock.json',
    'package.json',
    'build-date.cjs', ],

  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
};
