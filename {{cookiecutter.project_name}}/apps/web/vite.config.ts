/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const ENV_NAMES = ['dev', 'qa', 'stage', 'prod'];

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // expose .env as process.env instead of import.meta.env
  // Reference: https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
  const envDir = __dirname;
  const envMode = ENV_NAMES.includes(mode) ? mode : '';
  const env = loadEnv(envMode, envDir, ['APP_', 'VITE_']);
  const port = Number(env.APP_LOCALHOST_PORT) || 3030;

  const APP_ENV = env.APP_ENV || envMode || 'local';
  const NODE_ENV = mode === 'development' ? mode : 'production';
  process.env.NODE_ENV = NODE_ENV;

  const viteAppEnv = Object.entries(env).reduce(
    (obj, [key, value]) => {
      if (!key.startsWith('VITE_APP')) {
        return obj;
      }

      let v: string | boolean | number = value.toLocaleLowerCase();

      if (v === 'true' || v === 'yes' || v === 'on') {
        v = true;
      } else if (v === 'false' || v === 'no' || v === 'off') {
        v = false;
      } else if (!Number.isNaN(Number(v))) {
        v = Number(v);
      } else {
        v = value;
      }

      return { [key]: v, ...obj };
    },
    { APP_ENV, NODE_ENV },
  );

  return {
    root: __dirname,
    plugins: [react(), svgr()],
    mode: NODE_ENV,
    server: {
      port,
      strictPort: true,
    },
    preview: {
      port,
      strictPort: true,
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
    envDir,
    define: {
      'process.env': JSON.stringify(viteAppEnv),
    },
  };
});
