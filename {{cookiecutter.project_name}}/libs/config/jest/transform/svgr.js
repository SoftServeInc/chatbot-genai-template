'use strict';

module.exports = {
  process(src, filename) {
    const code = src.replace(
      /import (.+?) from ['"](.+?\.svg)\?react['"]/g,
      'import { ReactComponent as $1 } from "$2"',
    );

    return { code };
  },
};
