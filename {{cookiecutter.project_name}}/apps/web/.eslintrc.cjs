module.exports = {
  ...require('config/eslint/react.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    EXPERIMENTAL_useProjectService: true,
    project: './tsconfig.json',
    sourceType: 'module',
  },
};
