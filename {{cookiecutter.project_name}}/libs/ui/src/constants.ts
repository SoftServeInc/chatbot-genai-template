/// <reference types="../declarations/react-vite" />
export const ENVIRONMENT = import.meta.env;

export const ZUSTAND_DEVTOOLS_ENABLED = !!ENVIRONMENT.VITE_ZUSTAND_DEVTOOLS;

export const AUTH_TOKEN_KEY = 'auth.token';
export const APP_THEME_KEY = 'chatbot.theme';
export const BOT_EXPLORER_CONFIG_KEY = 'bot_explorer.config';
export const DEFAULT_THEME = 'system';
export const FULLSCREEN_ROOT = 'fullscreen-enabled';
