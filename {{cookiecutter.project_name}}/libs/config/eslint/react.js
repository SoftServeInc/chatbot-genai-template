// Copyright 2024 SoftServe Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'react', 'react-refresh', 'prettier'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json', 'tsconfig.node.json'],
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        controlComponents: ['Checkbox'],
        depth: 3,
      },
    ],
  },
  ignorePatterns: [
    '**/*.js',
    '**/*.json',
    'node_modules',
    'public',
    'styles',
    '.next',
    '.nx/cache',
    'coverage',
    'dist',
  ],
};
