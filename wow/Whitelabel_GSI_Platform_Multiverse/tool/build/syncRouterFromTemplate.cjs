/**
 * 將 template/<siteKey>/router/routes.ts 複製到 src/router/build.ts（建置產物，不應納入版控）。
 * 供 build:onlyCode / buildApk:onlyCode，或手動執行本檔（--from-env 或 SITE_KEY=）使用。
 */
"use strict"

const fs = require("fs")
const path = require("path")

const projectRoot = path.resolve(__dirname, "../..")
const destFile = path.join(projectRoot, "src/router/build.ts")

function safeSiteKey(key) {
  if (typeof key !== "string" || !key) return null
  return /^[a-zA-Z0-9_-]+$/.test(key) ? key : null
}

function readSiteKeyFromEnvJson() {
  const envPath = path.join(projectRoot, "src/env/environment.json")
  if (!fs.existsSync(envPath)) return null
  try {
    const parsed = JSON.parse(fs.readFileSync(envPath, "utf8"))
    return safeSiteKey(parsed?.siteKey)
  } catch {
    return null
  }
}

function parseSiteKeyFromArgv(argv) {
  for (const arg of argv) {
    if (arg.startsWith("SITE_KEY=")) {
      return safeSiteKey(arg.slice("SITE_KEY=".length))
    }
  }
  return null
}

/**
 * @param {string} siteKey
 */
function syncRouterToBuild(siteKey) {
  const key = safeSiteKey(siteKey)
  if (!key) {
    throw new Error(`syncRouterFromTemplate: 無效的 siteKey: ${String(siteKey)}`)
  }
  const sourceFile = path.join(projectRoot, "template", key, "router", "routes.ts")
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`syncRouterFromTemplate: 找不到來源檔 ${sourceFile}`)
  }
  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.copyFileSync(sourceFile, destFile)
  console.log(`syncRouterFromTemplate: ${sourceFile} → ${destFile}`)
}

/**
 * CLI：node tool/build/syncRouterFromTemplate.cjs [--from-env] [SITE_KEY=xxx]
 * --from-env：未傳 SITE_KEY 時改讀 src/env/environment.json
 */
function main() {
  const argv = process.argv.slice(2)
  const fromEnv = argv.includes("--from-env")
  const filtered = argv.filter((a) => a !== "--from-env")
  let siteKey = parseSiteKeyFromArgv(filtered)
  if (!siteKey && fromEnv) {
    siteKey = readSiteKeyFromEnvJson()
  }
  if (!siteKey) {
    if (fromEnv) {
      console.warn(
        "syncRouterFromTemplate: 已指定 --from-env 但無 SITE_KEY 且 environment.json 無 siteKey，略過。"
      )
      process.exit(0)
    }
    console.error("syncRouterFromTemplate: 請傳 SITE_KEY=版型目錄名，或加上 --from-env 讀取 src/env/environment.json")
    process.exit(1)
  }
  syncRouterToBuild(siteKey)
}

module.exports = { syncRouterToBuild, readSiteKeyFromEnvJson, destFile, projectRoot }

if (require.main === module) {
  main()
}
