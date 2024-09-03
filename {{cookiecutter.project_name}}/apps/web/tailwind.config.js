const uiKitConfig = require('ui/tailwind.config');

module.exports = {
  ...uiKitConfig,
  content: [...uiKitConfig.content, `${__dirname}/src/**/*.{ts,tsx}`],
};
