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

const esmNodeModules = ['react-markdown', 'remark-gfm', 'remark-math'];
const envVars = JSON.stringify({ NODE_ENV: 'unittest', APP_ENV: 'unittest' });

module.exports = {
  roots: ['<rootDir>/src'],
  coverageReporters: ['text', 'json', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/constants.ts', // ignore this file as it uses imports.meta.env which could not be properly interpreted by istanbul
    '!src/mocks/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/stories/**',
  ],
  coveragePathIgnorePatterns: [],
  coverageProvider: 'v8',
  setupFilesAfterEnv: [`${__dirname}/react.setup.js`],
  testEnvironment: `${__dirname}/react.jsdom.js`,
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': [
      'jest-chain-transform',
      {
        transformers: [
          [`${__dirname}/transform/svgr.js`],
          [
            '@swc/jest',
            {
              jsc: {
                transform: {
                  optimizer: {
                    globals: {
                      vars: {
                        'import.meta.env': envVars,
                        'process.env': envVars,
                      },
                    },
                  },
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          ],
        ],
      },
    ],
    '^.+\\.css$': `${__dirname}/transform/css.js`,
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': `${__dirname}/transform/asset.js`,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+(?<!(' +
      getModuleDependencies(esmNodeModules) +
      ')[/\\\\].+)\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*?)$': '<rootDir>/src/$1',
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: [
    // Place tsx and ts to beginning as suggestion from Jest team
    // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
    'tsx',
    'ts',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  resetMocks: true,
  maxWorkers: '50%',
  workerThreads: true,
};

/**
 * Recursively collect all dependencies of the given modules.
 * The result is a string of dependencies separated by '|' to be used in a RegExp.
 *
 * @param {string[]} modules
 * @returns {string}
 */
function getModuleDependencies(modules) {
  const { dirname, join } = require('path');
  const dependencies = [];

  modules.forEach(function collectDeps(module) {
    if (dependencies.includes(module) || module.startsWith('@types/')) {
      return;
    }

    dependencies.push(module);
    let modulePath = dirname(require.resolve(module));

    while (!modulePath.endsWith(join('node_modules', module))) {
      modulePath = dirname(modulePath);
    }

    Object.keys(require(join(modulePath, 'package.json')).dependencies || {}).forEach(collectDeps);
  });

  return dependencies.join('|');
}
