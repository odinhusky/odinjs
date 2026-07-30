import fs from "fs"
import path from "path"
import sharp from "sharp"
import { glob } from "glob"

const CSV_FILE = "large_images.csv"
const SRC_DIR = "src"

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function main() {
  console.log("Starting image optimization...")

  // 1. Parse CSV
  const csvContent = fs.readFileSync(CSV_FILE, "utf-8")
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "")
  lines.shift() // Remove header

  const imagesToProcess = []
  for (const line of lines) {
    const match = line.match(/"(.*)","(.*)"/)
    if (match) {
      imagesToProcess.push({ fullPath: match[1], length: parseInt(match[2], 10) })
    }
  }
  console.log(`Found ${imagesToProcess.length} images to process.`)

  // 2. Load all source files
  const sourceFilePaths = await glob(`${SRC_DIR}/**/*.{vue,js,ts,json,scss,css,html}`, { ignore: "node_modules/**" })
  console.log(`Found ${sourceFilePaths.length} source files.`)

  const filesCache = new Map()
  for (const filePath of sourceFilePaths) {
    filesCache.set(filePath, fs.readFileSync(filePath, "utf-8"))
  }

  // 3. Process images
  let convertedCount = 0

  for (const image of imagesToProcess) {
    const { fullPath } = image

    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`)
      continue
    }

    const dir = path.dirname(fullPath)
    const ext = path.extname(fullPath)
    const name = path.basename(fullPath, ext)
    const newFileName = `${name}.webp`
    const newFullPath = path.join(dir, newFileName)

    // Convert
    try {
      if (!fs.existsSync(newFullPath)) {
        await sharp(fullPath).webp({ quality: 80 }).toFile(newFullPath)
        convertedCount++
        console.log(`Converted: ${path.basename(fullPath)} -> ${newFileName}`)
      } else {
        console.log(`Skipped conversion (already exists): ${newFileName}`)
      }
    } catch (err) {
      console.error(`Error converting ${fullPath}:`, err)
      continue
    }

    // Prepare replacement logic
    const originalFileName = path.basename(fullPath)
    const parentDir = path.basename(dir)

    // Pattern 1: Long filenames (likely UUIDs) -> safe to replace globally
    // Pattern 2: Short filenames -> require parent dir context
    let patterns = []

    if (originalFileName.length > 15) {
      // Match if preceded by path separator, quote, or (
      // Also handle simple usage where it might be just the filename string
      patterns.push(new RegExp(escapeRegExp(originalFileName), "g"))
    } else {
      // Require parent directory context
      // Matches: parentDir/filename
      patterns.push(new RegExp(`${escapeRegExp(parentDir)}/${escapeRegExp(originalFileName)}`, "g"))
      // Matches: parentDir\filename (windows style in code? rare but possible in strings)
      // patterns.push(new RegExp(`${escapeRegExp(parentDir)}\\\${escapeRegExp(originalFileName)}`, 'g'));
    }

    // Apply replacements in memory
    for (const [filePath, content] of filesCache.entries()) {
      let newContent = content
      let modified = false

      for (const pattern of patterns) {
        if (pattern.test(newContent)) {
          // For simple filename replacement
          if (originalFileName.length > 15) {
            newContent = newContent.replace(pattern, newFileName)
          } else {
            // For parent/file replacement, we need to keep the parent part
            // The pattern matches "parent/file.png"
            // Replacement should be "parent/file.webp"
            const replacement = `${parentDir}/${newFileName}`
            newContent = newContent.replace(pattern, replacement)
          }
          modified = true
        }
      }

      if (modified) {
        filesCache.set(filePath, newContent)
      }
    }
  }

  // 4. Write back modified files
  let updatedFilesCount = 0
  for (const [filePath, content] of filesCache.entries()) {
    const originalContent = fs.readFileSync(filePath, "utf-8")
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf-8")
      updatedFilesCount++
      // console.log(`Updated references in: ${filePath}`);
    }
  }

  console.log(`Done! Converted ${convertedCount} images. Updated references in ${updatedFilesCount} files.`)
}

main().catch(console.error)
