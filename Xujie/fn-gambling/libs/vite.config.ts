/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import viteCompression from 'vite-plugin-compression';
export default defineConfig({
  root: __dirname,
  cacheDir: '../node_modules/.vite/libs',

  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    viteCompression({
      //deleteOriginFile: true, 压缩后是否删除源文件
      algorithm: 'gzip',
      threshold: 10240, // 对超过10k的数据压缩
    }),
  ],
  resolve: {
    alias: {
      '@libs': path.resolve(__dirname, 'src'),
      '@commonUtils': path.resolve(__dirname, 'src/commonUtils'),
      '@mode2': path.resolve(__dirname, 'src/mode2'),
      '@mode2API': path.resolve(__dirname, 'src/mode2/external/api'),
      '@mode2Trans': path.resolve(__dirname, 'src/mode2/external/transform'),
      '@constant': path.resolve(__dirname, 'src/constant'),
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: '../dist/libs',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'libs',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/libs',
      provider: 'v8',
    },
  },
});
