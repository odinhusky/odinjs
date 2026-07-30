/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    VITE_APP_GIT_COMMIT: string;
    VITE_APP_BUILD_TIME: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_I18N_LOCALE_URL: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
