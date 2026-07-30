import autoprefixer from "autoprefixer"
import postcssImport from "postcss-import"
import tailwindcssNesting from "tailwindcss/nesting/index.js"
import tailwindcss from "tailwindcss"

export default {
  plugins: [
    postcssImport(),
    tailwindcssNesting(),
    tailwindcss(),
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
