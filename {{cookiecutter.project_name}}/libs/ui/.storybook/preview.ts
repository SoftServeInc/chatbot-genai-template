import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../src/assets/styles/colors.scss';
import '../src/assets/styles/global.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    viewport: {
      viewports: {
        'sm': {
          name: 'Desktop sm:640px',
          styles: { height: '100%', width: '640px' },
          type: 'desktop',
        },
        'md': {
          name: 'Desktop md:768px',
          styles: { height: '100%', width: '768px' },
          type: 'desktop',
        },
        'lg': {
          name: 'Desktop lg:1024px',
          styles: { height: '100%', width: '1024px' },
          type: 'desktop',
        },
        'xl': {
          name: ' Desktop xl:1280px',
          styles: { height: '100%', width: '1280px' },
          type: 'desktop',
        },
        '2xl': {
          name: 'Desktop 2xl:1536px',
          styles: { height: '100%', width: '1536px' },
          type: 'desktop',
        },
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'responsive',
      defaultOrientation: 'portrait',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
