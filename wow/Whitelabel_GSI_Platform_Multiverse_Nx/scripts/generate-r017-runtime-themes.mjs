import { readFileSync, watch } from "node:fs"
import { access, mkdir, readdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { compileAsync } from "sass-embedded"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(scriptDir, "..")
const appRoot = path.join(workspaceRoot, "apps", "r017")
const sourceDir = path.join(appRoot, "src", "assets", "styles")
const outputDir = path.join(appRoot, "src", "public", "themes")
const THEME_SOURCE_FILE_RE = /^_variables(?:_[a-z0-9-]+)?\.scss$/i

const aliases = {
  "@shared-src/": path.join(workspaceRoot, "libs", "shared", "ui-layer", "src") + path.sep,
  "@shared-lib/": path.join(workspaceRoot, "libs", "shared", "ui-layer", "src", "lib") + path.sep
}

const aliasImporter = {
  canonicalize(url) {
    for (const [prefix, target] of Object.entries(aliases)) {
      if (url.startsWith(prefix)) {
        return pathToFileURL(path.join(target, url.slice(prefix.length)))
      }
    }

    return null
  },
  load(canonicalUrl) {
    const filePath = fileURLToPath(canonicalUrl)
    return {
      contents: readFileSync(filePath, "utf8"),
      syntax: "scss"
    }
  }
}

const toThemeName = (fileName) => {
  if (fileName === "_variables.scss") return "default"
  return fileName
    .replace(/^_variables_/, "")
    .replace(/\.scss$/, "")
    .toLowerCase()
}

const getSourceFiles = async () => {
  return (await readdir(sourceDir))
    .filter((fileName) => THEME_SOURCE_FILE_RE.test(fileName))
    .sort((a, b) => toThemeName(a).localeCompare(toThemeName(b)))
}

const sourceFileExists = async (fileName) => {
  try {
    await access(path.join(sourceDir, fileName))
    return true
  } catch {
    return false
  }
}

const renderThemeFile = async (fileName) => {
  const themeName = toThemeName(fileName)
  const inputFile = path.join(sourceDir, fileName)
  const outputFile = path.join(outputDir, `${themeName}.css`)
  const result = await compileAsync(inputFile, {
    importers: [aliasImporter],
    style: "expanded",
    sourceMap: false
  })

  const banner = [
    "/*",
    ` * Generated from apps/r017/src/assets/styles/${fileName}.`,
    " * Run `nx run r017:prepare` after changing runtime theme SCSS.",
    " */",
    ""
  ].join("\n")

  await writeFile(outputFile, `${banner}${result.css.trim()}\n`, "utf8")
  console.log(`Generated ${path.relative(workspaceRoot, outputFile)} from ${fileName}`)
}

const removeThemeFile = async (fileName) => {
  const themeName = toThemeName(fileName)
  const outputFile = path.join(outputDir, `${themeName}.css`)

  try {
    await unlink(outputFile)
    console.log(`Removed ${path.relative(workspaceRoot, outputFile)} because ${fileName} was removed`)
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return
    throw error
  }
}

const generateThemes = async () => {
  const sourceFiles = await getSourceFiles()

  await mkdir(outputDir, { recursive: true })

  const staleThemeFiles = (await readdir(outputDir)).filter((fileName) => fileName.endsWith(".css"))
  await Promise.all(staleThemeFiles.map((fileName) => unlink(path.join(outputDir, fileName))))

  for (const fileName of sourceFiles) {
    await renderThemeFile(fileName)
  }
}

const runWatchMode = async () => {
  await generateThemes()
  console.log(`Watching ${path.relative(workspaceRoot, sourceDir)} for theme SCSS changes...`)

  let timer = null
  let isGenerating = false
  let runFullRegenerate = false
  const pendingFiles = new Set()

  const triggerGenerate = (fileName) => {
    if (!fileName) {
      runFullRegenerate = true
    } else {
      pendingFiles.add(fileName)
    }

    if (timer) clearTimeout(timer)

    timer = setTimeout(async () => {
      if (isGenerating) {
        return
      }

      isGenerating = true
      try {
        if (runFullRegenerate) {
          runFullRegenerate = false
          pendingFiles.clear()
          await generateThemes()
        } else {
          const files = Array.from(pendingFiles)
          pendingFiles.clear()

          for (const changedFile of files) {
            if (await sourceFileExists(changedFile)) {
              await renderThemeFile(changedFile)
            } else {
              await removeThemeFile(changedFile)
            }
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        isGenerating = false
        if (runFullRegenerate || pendingFiles.size > 0) {
          triggerGenerate()
        }
      }
    }, 120)
  }

  const watcher = watch(sourceDir, (_eventType, fileName) => {
    if (!fileName) return
    const normalizedName = String(fileName)
    if (!THEME_SOURCE_FILE_RE.test(normalizedName)) return
    triggerGenerate(normalizedName)
  })

  const closeWatcher = () => {
    watcher.close()
    process.exit(0)
  }

  process.on("SIGINT", closeWatcher)
  process.on("SIGTERM", closeWatcher)
}

if (process.argv.includes("--watch")) {
  await runWatchMode()
} else {
  await generateThemes()
}
