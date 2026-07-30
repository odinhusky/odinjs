import { defineConfig } from "#q-app/wrappers"

export default defineConfig((ctx) => {
  const isMock = process.env.MOCK_MODE === "true"

  return {
    eslint: {
      warnings: true,
      errors: false
    },
    boot: ["i18n", "axios", "vue-query", "number-animation", "eventbus", "env", "directives"],
    css: ["app.scss"],
    extras: ["roboto-font", "material-icons"],
    build: {
      target: {
        browser: "baseline-widely-available",
        node: "node22"
      },
      alias: {
        "@": ctx.appPaths.srcDir
      },
      env: {
        VITE_MODE: process.env.VITE_MODE,
        VITE_IS_MOCK: isMock,
        VITE_APP_MOCK_BASE_API_PATH: "18.136.136.118/mock_api",
        VITE_DEV_RESOURCE_DOMAIN: "https://api-stagingagent.gsiwl.com/"
      },
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      extendViteConf(viteConf) {
        viteConf.base = ctx.dev ? "/" : "./"
        viteConf.build ??= {}
        viteConf.build.cssMinify = "esbuild"
      },
      viteVuePluginOptions: {
        script: {
          defineModel: true
        }
      },
      typescript: {
        vueShim: true
      }
    },
    devServer: {
      env: {
        VITE_APP_BASE_API: JSON.stringify(process.env.VITE_APP_BASE_API)
      },
      proxy: {
        "/ai-kol-api": {
          target: "https://api.aimate.am",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ai-kol-api/, "")
        }
      }
    },
    framework: {
      plugins: ["Notify", "Loading", "Meta", "Dialog"]
    }
  }
})
