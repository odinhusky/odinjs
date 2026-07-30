// CommonJS 形式：相容 Node 16 / ts-node 載入問題
const autoprefixer = require("autoprefixer")
const postcssImport = require("postcss-import")
const tailwindcss = require("tailwindcss")

module.exports = {
  plugins: [
    postcssImport,
    tailwindcss,
    // https://github.com/postcss/autoprefixer
    autoprefixer({
      overrideBrowserslist: [
        "last 4 Chrome versions",
        "last 4 Firefox versions",
        "last 4 Edge versions",
        "last 4 Safari versions",
        "last 4 Android versions",
        "last 4 ChromeAndroid versions",
        "last 4 FirefoxAndroid versions",
        "last 4 iOS versions"
      ]
    })
  ]
}
