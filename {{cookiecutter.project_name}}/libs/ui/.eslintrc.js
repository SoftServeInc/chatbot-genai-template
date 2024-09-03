const baseConfig = require('config/eslint/react.js');

module.exports = {
  ...baseConfig,
  extends: [...baseConfig.extends, 'plugin:storybook/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    sourceType: 'module',
  },
};
