module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "ignoredNodes": ["PropertyDefinition"]
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-trailing-spaces": [
      "error",
      { "ignoreComments": true }
    ],
    "max-statements-per-line": [
      "error",
      { "max": 1 }
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-useless-catch": [
      "off",
      "always"
    ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "no-var": [
      "error",
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 1,
        "maxBOF": 0
      }
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    "one-var": [
      "error",
      "never"
    ],
  },
};