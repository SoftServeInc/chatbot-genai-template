/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />
/// <reference types="./assets" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ZUSTAND_DEVTOOLS: boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
