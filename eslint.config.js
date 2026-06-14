// ESLint flat config — static analysis for the backend (Node, ES modules).
// Run with `npm run lint`. Used as the project's static-analysis tool for the
// SVVT report: it finds unused variables, undeclared globals, unreachable
// code and other defects without executing the program.
export default [
  {
    files: ['backend/**/*.js'],
    ignores: ['backend/__tests__/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
      'no-dupe-keys': 'error',
      'no-var': 'warn',
      'prefer-const': 'warn',
      eqeqeq: ['warn', 'smart'],
    },
  },
];
