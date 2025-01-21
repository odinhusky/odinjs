/// <reference types='vitest' />
import path from 'path';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import basicSsl from '@vitejs/plugin-basic-ssl';
import viteCompression from 'vite-plugin-compression';
import {
  getLibsAlias,
  getLocalExternalIPv4,
  getRollupOptions,
  setupComponentsMapping,
} from '../../libs/src/plugins/build';

const localIP = getLocalExternalIPv4();

export default defineConfig(({ mode }): UserConfig => {
  const envDir = path.resolve(__dirname, './env');
  const env = loadEnv(mode, envDir, '');

  console.log('@@env==>', mode, env);
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/activity-center',
    envDir: envDir,
    server: {
      open: '/', //npm run dev自动打开浏览器
      port: 4300,

      host: localIP,
      proxy: {
        '^/api': {
          target: 'https://in-campaign-api-dev.ttgroup-dev.vip',
          secure: true, // 協議是https的時候必須要寫
          changeOrigin: true,
        },
      },
    },

    plugins: [
      react(),
      basicSsl(),
      nxViteTsPaths(),
      viteCompression({
        deleteOriginFile: true, // 压缩后是否删除源文件
        algorithm: 'gzip',
        threshold: 10240, // 对超过10k的数据压缩
      }),
    ],

    build: {
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: '../../dist/apps/activity-center',
      rollupOptions: getRollupOptions(env),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@plugins': path.resolve(__dirname, 'plugins'),
        ...getLibsAlias(),
        ...setupComponentsMapping(env, __dirname),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
           
          `,
        },
      },
    },
  };
});
