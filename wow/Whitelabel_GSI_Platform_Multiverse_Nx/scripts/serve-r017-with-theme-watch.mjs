import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(scriptDir, "..")
const appCwd = path.join(workspaceRoot, "apps", "r017")

const themeWatcherScript = path.join(workspaceRoot, "scripts", "generate-r017-runtime-themes.mjs")
const nuxiCommand = process.platform === "win32" ? "nuxi.cmd" : "nuxi"

const env = {
  ...process.env,
  NODE_OPTIONS: process.env.NODE_OPTIONS || "--max-old-space-size=8192"
}

let shuttingDown = false
let prepareProcess = null
let watcherProcess = null
let devProcess = null

const spawnNuxi = (args) =>
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", `nuxi ${args.join(" ")}`], {
        cwd: appCwd,
        stdio: "inherit",
        env
      })
    : spawn(nuxiCommand, args, {
        cwd: appCwd,
        stdio: "inherit",
        env
      })

const waitForProcess = (label, childProcess) =>
  new Promise((resolve, reject) => {
    childProcess.on("error", reject)
    childProcess.on("exit", (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      const reason = signal ? `signal ${signal}` : `code ${code}`
      reject(new Error(`${label} exited with ${reason}`))
    })
  })

const shutdown = (signal = "SIGTERM") => {
  if (shuttingDown) return
  shuttingDown = true

  prepareProcess?.kill(signal)
  watcherProcess?.kill(signal)
  devProcess?.kill(signal)
}

const main = async () => {
  try {
    prepareProcess = spawnNuxi(["prepare"])
    await waitForProcess("Nuxt prepare", prepareProcess)
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    prepareProcess = null
  }

  watcherProcess = spawn(process.execPath, [themeWatcherScript, "--watch"], {
    cwd: appCwd,
    stdio: "inherit",
    env
  })

  devProcess = spawnNuxi(["dev"])

  watcherProcess.on("exit", (code, signal) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`Theme watcher exited with code ${code}`)
      shutdown(signal || "SIGTERM")
      process.exit(code)
    }
  })

  devProcess.on("exit", (code, signal) => {
    shutdown(signal || "SIGTERM")
    process.exit(code || 0)
  })
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))

main()
