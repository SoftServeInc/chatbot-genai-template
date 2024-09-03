/// <reference types="../declarations/react-vite" />
import InlayBigImg from '@/assets/images/dataviz/inlay-big.svg';
import OverlayBigImg from '@/assets/images/dataviz/overlay-big.svg';
import InlaySmallImg from '@/assets/images/dataviz/inlay-small.svg';
import OverlaySmallImg from '@/assets/images/dataviz/overlay-small.svg';

export const ENVIRONMENT = import.meta.env;

export const ZUSTAND_DEVTOOLS_ENABLED = !!ENVIRONMENT.VITE_ZUSTAND_DEVTOOLS;

export const AUTH_TOKEN_KEY = 'auth.token';
export const APP_THEME_KEY = 'chatbot.theme';
export const DEFAULT_THEME = 'system';
export const APP_ROUTES = {
  auth: {
    signIn: {},
  },
  app: {
    route: '/app',
    children: {
      contents: {
        name: 'Contents',
        details: '',
        route: '/app/contents',
      },
      templates: {
        inlayBig: {
          img: InlayBigImg,
          name: 'Template 01',
          details: 'Chatbot Big Inlay',
          route: '/app/inlay/big',
        },
        overlayBig: {
          img: OverlayBigImg,
          name: 'Template 02',
          details: 'Chatbot Big Overlay',
          route: '/app/overlay/big',
        },
        inlaySmall: {
          img: InlaySmallImg,
          name: 'Template 03',
          details: 'Chatbot Small Inlay',
          route: '/app/inlay/small',
        },
        overlaySmall: {
          img: OverlaySmallImg,
          name: 'Template 04',
          details: 'Chatbot Small Overlay',
          route: '/app/overlay/small',
        },
      },
      knowledgeBase: {
        name: 'Knowledge Base',
        details: '',
        route: '/app/knowledge-base',
      },
      botExplorer: {
        name: 'Bot Explorer',
        details: '',
        route: '/app/tools/configure',
      },
    },
  },
};
