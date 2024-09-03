'use strict';

const path = require('path');

// This is a custom Jest transformer turning file imports into filenames.
module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg?$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = toPascalCase(path.parse(filename).name);
      const componentName = `Svg${pascalCaseFilename}`;
      const code = `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;

      return { code };
    }

    return {
      code: `module.exports = ${assetFilename};`,
    };
  },
};

function toPascalCase(str) {
  return str
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}
