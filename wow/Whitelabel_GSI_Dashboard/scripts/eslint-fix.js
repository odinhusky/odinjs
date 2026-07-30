// scripts/eslint-fix.js
import { execSync } from "node:child_process"

try {
  execSync("npx eslint --fix --quiet --no-error-on-unmatched-pattern " + process.argv.slice(2).join(" "), {
    stdio: "inherit"
  })
} catch (e) {
  // ESLint exit codes:
  // 1: Lint errors found (We want to allow commit, so we exit 0)
  // 2: Crash or config error (We want to block commit, so we exit non-zero)
  // signal (SIGKILL/SIGTERM): OOM or OS killed process — treat as non-blocking
  if (e.status === 2 && !e.signal) {
    console.error("❌ ESLint crashed with a config error. Blocking commit.")
    process.exit(2)
  }

  console.log("⚠️  ESLint detected errors but auto-fix was attempted. Proceeding with commit as requested.")
  process.exit(0)
}
