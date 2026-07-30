/* eslint-env node */

const { configure } = require("quasar/wrappers")
const path = require("path")
const fs = require("fs")
const { execSync } = require("child_process")

// siteKey：僅用於 dev 時 @router/build 指向 template；正式包由 tool/build/onlyCode 注入 SITE_KEY
const devEnvironmentPath = path.resolve(__dirname, "./src/env/environment.json")
const prodEnvironmentPath = path.resolve(__dirname, "./environment.json")
const environmentPath = process.env.NODE_ENV === "development" ? devEnvironmentPath : prodEnvironmentPath

let siteKey = "okbet"
const envSiteKey = process.env.SITE_KEY && String(process.env.SITE_KEY).trim()
if (envSiteKey) {
  siteKey = envSiteKey
} else if (fs.existsSync(environmentPath)) {
  try {
    const environment = JSON.parse(fs.readFileSync(environmentPath, "utf-8"))
    if (environment?.siteKey) {
      siteKey = environment.siteKey
    }
  } catch (error) {
    console.warn(`無法讀取 environment.json: ${error.message}`)
  }
}

module.exports = configure(function (/* ctx */) {
  const versionArg = process.argv.find((arg) => arg.startsWith("--env.VITE_APP_SITE_VERSION="))
  const version = versionArg ? versionArg.split("=")[1] : "unknown"
  const enviromentArg = process.argv.find((arg) => arg.startsWith("--env.VITE_APP_SITE_ENV="))
  const enviroment = enviromentArg ? enviromentArg.split("=")[1] : "production"
  console.log(`編譯版本: ${version}`)
  console.log(`打包環境: ${enviroment}`)
  console.log(`編譯模板名稱: ${siteKey}`)

  // 打包時取 git commit hash 與打包時間（台北時間），注入給前端寫進 body 供查版本
  let gitCommit = "unknown"
  try {
    gitCommit = execSync("git rev-parse --short HEAD", { cwd: __dirname }).toString().trim()
  } catch (error) {
    console.warn(`無法取得 git commit: ${error.message}`)
  }
  const buildTime = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Taipei" })
  console.log(`Git Commit: ${gitCommit}`)
  console.log(`打包時間(台北): ${buildTime}`)

  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: [
      "pwaInstall",
      "i18n",
      "axios",
      "dayjs",
      "eventbus",
      "directives",
      "cx",
      "vue-query",
      "appVersion",
      "fontsOptional",
    ],

    css: ["app.sass"],

    // 字型：首屏自託管 OpenSans-Core；Google 僅 Noto Sans TC；DMSans/Century 由 fontsOptional idle 載入
    extras: [],

    build: {
      publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
      distDir: "dist/spa",
      extendWebpack(cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          "@": path.resolve(__dirname, "./src"),
        }
      },
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16",
      },

      vueRouterMode: "history",
      env: {
        VITE_APP_BASE_API: JSON.stringify(process.env.VITE_APP_BASE_API),
        SITE_KEY: process.env.SITE_KEY,
        VITE_APP_STATIC_RESOURCE_URL: JSON.stringify(process.env.VITE_APP_STATIC_RESOURCE_URL),
        VITE_APP_SITE_VERSION: version || "unknown",
        VITE_APP_SITE_ENV: enviroment || "production",
        VITE_APP_GIT_COMMIT: gitCommit,
        VITE_APP_BUILD_TIME: buildTime,
      },
      minify: true,

      extendViteConf(viteConf) {
        // 確保 resolve.alias 物件存在
        viteConf.resolve = viteConf.resolve || {}
        viteConf.resolve.alias = viteConf.resolve.alias || {}

        viteConf.resolve.alias["@router/build"] =
          process.env.NODE_ENV === "development"
            ? path.resolve(__dirname, `./template/${siteKey}/router/routes.ts`)
            : path.resolve(__dirname, "./src/router/build")
      },
      viteVuePluginOptions: {
        script: {
          defineModel: true,
        },
      },
    },

    htmlVariables: {
      meta: "meta",
    },

    devServer: {
      env: {
        VITE_APP_BASE_API: JSON.stringify(process.env.VITE_APP_BASE_API),
      },
      proxy: {
        "/api": {
          target: `${process.env.VITE_APP_BASE_API}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "admin/api": {
          target: `${process.env.VITE_APP_BASE_API}/admin`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/socket.io": {
          target: "ws://localhost:3000",
          ws: true,
        },
        "/statics/staging": {
          target: "https://dobt-dev.gsiwl.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    framework: {
      config: {
        dark: "true",
        brand: {
          accent: "#FFFFFF",
          white: "#FFFFFF",
        },
      },

      iconSet: "material-icons",
      plugins: ["Notify", "Loading", "Dialog"],
    },

    animations: ["fadeIn", "fadeOut", "fadeInLeft", "fadeInRight", "slideInDown"],

    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },
  }
})
