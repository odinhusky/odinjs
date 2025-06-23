/// <reference types='vitest' />
import path from 'path';
import { defineConfig, loadEnv, PluginOption, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { shakeTreeImage } from './build/plugins';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import {
  getLibsAlias,
  getLocalExternalIPv4,
  getRollupOptions,
  // setupComponentsMapping,
  setupComponentsUi2Mapping,
} from '../../libs/src/plugins/build';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';

const localIP = getLocalExternalIPv4();
console.log('@@ localIP', localIP);

export default defineConfig(({ mode }): UserConfig => {
  const envDir = path.resolve(__dirname, './env');
  const env = loadEnv(mode, envDir, '');
  console.log(
    '@@@===> env',
    `\nmode: ${mode}`,
    `\n${JSON.stringify(env, null, 2)}`
  );
  const {
    VITE_S3_PATH,
    VITE_PACKAGENAME,
    VITE_PLATFORM,
    VITE_PWA_THEME_COLOR,
    VITE_PWA_THEME_BACKGROUND_COLOR,
  } = env;

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/india-game',

    define: {
      // 'process.env.MODE': JSON.stringify(env.VITE_TEST),
      // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
      // If you want to exposes all env variables, which is not recommended
      // 'process.env': env
    },
    worker: {
      format: 'es', // 'es' 或 iife
    },
    server: {
      open: '/hall', //npm run dev自动打开浏览器
      // port: 4200,
      host: localIP,
      proxy: {
        '/ws': {
          target: 'wss://in-dev.ttgroup-dev.vip', // 目标 WebSocket 服务器
          ws: true, // 启用 WebSocket 代理
          changeOrigin: true,
        },
        '^/v(1|2|3)': {
          // target: 'https://neerg.7ind.com', // V6
          target: 'https://in-dev.ttgroup-dev.vip',
          secure: true, // 協議是https的時候必須要寫
          changeOrigin: true,
        },
        '^(/static|/resources)': {
          // NOTE 轉發 [S3]
          target: 'https://in-dev.ttgroup-dev.vip',
          secure: true, // 協議是https的時候必須要寫
          changeOrigin: true,
        },
        // '^/resources': {
        //   // NOTE 轉發 [S3]
        //   target: 'https://in-dev.ttgroup-dev.vip',
        //   secure: true, // 協議是https的時候必須要寫
        //   changeOrigin: true,
        // },
        '^/sensors_event': {
          // NOTE BI [神策]
          target: 'https://in-dev.ttgroup-dev.vip',
          secure: true, // 協議是https的時候必須要寫
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 4300,
      host: localIP,
    },

    envDir: envDir,

    plugins: [
      react(),
      basicSsl(),
      nxViteTsPaths(),
      shakeTreeImage({
        version: `${env.VITE_V_VERSION}`,
      }),
      // shakeTreeUIMapping({
      //   version: `${env.VITE_V_VERSION}`,
      //   projectName: 'india-game',
      // }),
      VitePWA({
        manifest: {
          name: `${VITE_PLATFORM}`, // App 名稱
          short_name: `${VITE_PLATFORM}`, // App 簡短名稱
          theme_color: `${VITE_PWA_THEME_COLOR}`, // 應用程式的主要顏色
          background_color: `${VITE_PWA_THEME_BACKGROUND_COLOR}`, // 啟動畫面（splash screen）的背景色
          display: 'standalone', // 應用程式的顯示模式
          scope: '/', // 應用程式的使用範圍 這項如果有填，那應用程式的作用域就會限在指定的目錄裡，超過指定目錄，就會當成一般的網頁瀏覽。
          start_url: '/', // 如果有設定的話，開啟應用程式時就會進到設定的網址。沒設定的話就是使用者按加入主畫面時的那個網址。 如果填寫的是相對路徑，是以 manifest 所在的位置為基準。建議可以在網址上加入 Google Analytics 的 utm 參數，這樣在 GA 上就可以看見多少來源是來自於 PWA，可以檢測成效。如果要 Chrome主 動提示加入主畫面的話，這項必須填寫。
          id: '/',
          icons: [
            {
              src: `${VITE_S3_PATH}/pwa/${VITE_PACKAGENAME.toLowerCase()}/logo_72.png`,
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: `${VITE_S3_PATH}/pwa/${VITE_PACKAGENAME.toLowerCase()}/logo_128.png`,
              sizes: '128x128',
              type: 'image/png',
            },
            {
              src: `${VITE_S3_PATH}/pwa/${VITE_PACKAGENAME.toLowerCase()}/logo_144.png`,
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: `${VITE_S3_PATH}/pwa/${VITE_PACKAGENAME.toLowerCase()}/logo_192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${VITE_S3_PATH}/pwa/${VITE_PACKAGENAME.toLowerCase()}/logo_512.png`,
              sizes: '512x512',
              type: 'image/png',
            },
          ],
          orientation: 'portrait', // 強制手機直立顯示，要橫向則是 landscape
          description: '', // TODO 應用程式的描述
        },
        devOptions: {
          enabled: true,
        },
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /\.(?:woff2?|eot|ttf|otf|json|css)$/i, // 僅緩存字體和 JSON 檔案
              handler: 'NetworkOnly',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 24 * 60 * 60, // 1 天
                },
              },
            },
          ],
          // 排除圖片和 HTML 的預設緩存
          globPatterns: ['**/*.{woff2,eot,ttf,otf,json,css}'], // 僅緩存這些資源類型
        },
      }),
      nodePolyfills(),
      // viteCompression({
      //   deleteOriginFile: false, // 压缩后是否删除源文件
      //   algorithm: 'gzip',
      //   threshold: 10240, // 对超过10k的数据压缩
      // }),

      visualizer({
        open: true, // 打包後自動打開報告
        filename: 'stats.html', // 生成報告檔名
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption, // 可視化打包分析
    ],
    esbuild: {
      // TODO Evan test
      // drop: env.VITE_MODE === 'prod' ? ['console', 'debugger'] : [],
      pure: env.VITE_MODE === 'prod' ? ['console', 'debugger'] : [],
    },
    build: {
      reportCompressedSize: false, // 禁用 gzip 壓縮大小報告，可略微減少打包時間
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: '../../dist/apps/india-game',
      rollupOptions: getRollupOptions(env),
      minify: 'esbuild',
      sourcemap: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@langs': path.resolve(
          __dirname,
          `plugins/${env.VITE_PLUGIN_LANGS_PATH}`
        ),
        '@plugins': path.resolve(__dirname, `plugins/`),
        '@transform': path.resolve(__dirname, 'src/external/transform'),
        ...getLibsAlias(),
        // ...setupComponentsMapping(env, __dirname),
        ...setupComponentsUi2Mapping(env, __dirname),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `
          //   @import "@styles/mixin.scss";
          //   @import "@styles/components/select.scss";
          //   @import "@styles/components/input.scss";
          //   @import "@styles/components/table.scss";
          // `,
          api: 'modern-compiler', // or "modern",
          additionalData: `@use "@styles/index.scss" as *;`,
        },
      },
    },
    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/brazil-game',
        provider: 'v8',
      },
    },
  };
});
