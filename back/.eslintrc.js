module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error', // Enforce explicit function return types
    '@typescript-eslint/explicit-module-boundary-types': 'error', // Enforce explicit return types for public API functions
    '@typescript-eslint/no-explicit-any': 'error', // Disallow the any type
    '@typescript-eslint/no-inferrable-types': 'error', // Disallow explicit types where they can be easily inferred
    '@typescript-eslint/no-unused-vars': 'error', // Enforce that variables must be used and can't be declared without a type
  },
};
