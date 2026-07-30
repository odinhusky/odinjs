import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import globals from "globals"
import vue from "eslint-plugin-vue"
import tseslint from "typescript-eslint"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default [
  {
    ignores: [
      "dist/**",
      ".quasar/**",
      "node_modules/**",
      ".eslintrc.js",
      "src-ssr/**",
      "quasar.config.*.temporary.compiled*",
      "tool/**"
    ]
  },
  js.configs.recommended,
  ...vue.configs["flat/essential"],
  ...compat.config({
    extends: ["plugin:quasar/legacy", "plugin:prettier/recommended", "eslint-config-prettier"]
  }),
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      ecmaVersion: 13,
      sourceType: "module",
      parserOptions: {
        parser: tseslint.parser,
        ecmaFeatures: {
          modules: true,
          jsx: true
        },
        requireConfigFile: false
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ga: "readonly",
        __statics: "readonly",
        __QUASAR_SSR__: "readonly",
        __QUASAR_SSR_SERVER__: "readonly",
        __QUASAR_SSR_CLIENT__: "readonly",
        __QUASAR_SSR_PWA__: "readonly",
        process: "readonly",
        chrome: "readonly",
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly"
      }
    },
    rules: {
      semi: ["warn", "never"],
      "no-console": process.env.VITE_NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.VITE_NODE_ENV === "production" ? "warn" : "off",
      "no-duplicate-case": "off",
      "no-empty": "off",
      "no-extra-parens": "off",
      "no-func-assign": "off",
      "no-unreachable": "off",
      "no-else-return": "off",
      "no-empty-function": "off",
      "no-lone-blocks": "off",
      "no-multi-spaces": "off",
      "no-redeclare": "off",
      "no-return-assign": "off",
      "no-return-await": "off",
      "no-self-compare": "off",
      "no-useless-catch": "off",
      "no-useless-return": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-multiple-empty-lines": "off",
      "no-trailing-spaces": "off",
      "no-useless-call": "off",
      "no-var": "off",
      "no-delete-var": "off",
      "no-unused-vars": "off",
      "no-shadow": "off",
      "dot-notation": "off",
      "default-case": "off",
      eqeqeq: "off",
      curly: "off",
      "space-before-blocks": "off",
      "space-in-parens": "off",
      "space-infix-ops": "off",
      "space-unary-ops": "off",
      "switch-colon-spacing": "off",
      "arrow-spacing": "off",
      "array-bracket-spacing": "off",
      "brace-style": "off",
      camelcase: "off",
      "max-statements": ["off", 300],
      "max-statements-per-line": ["off", { max: 1 }],
      "vue/require-default-prop": 0,
      "vue/singleline-html-element-content-newline": 0,
      "vue/multiline-html-element-content-newline": 0,
      "vue/max-attributes-per-line": 0,
      "vue/html-indent": [
        "off",
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: []
        }
      ],
      "vue/html-self-closing": [
        "off",
        {
          html: {
            void: "always",
            normal: "never",
            component: "always"
          },
          svg: "always",
          math: "always"
        }
      ],
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/no-var-requires": 0,
      "@typescript-eslint/no-require-imports": 0,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": 0,
      "@typescript-eslint/no-wrapper-object-types": 0,
      "@typescript-eslint/no-empty-object-type": 0,
      "@typescript-eslint/no-unsafe-function-type": 0,
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "vue/multi-word-component-names": 0,
      "vue/first-attribute-linebreak": 0,
      "vue/no-child-content": 0,
      "vue/no-expose-after-await": 0,
      "vue/no-reserved-props": 0,
      "vue/no-v-text-v-html-on-component": 0,
      "vue/prefer-import-from-vue": 0,
      "vue/valid-attribute-name": 0,
      "vue/require-explicit-emits": 0,
      "no-async-promise-executor": 0,
      "vue/require-prop-types": 0,
      "vue/no-mutating-props": 0,
      "no-irregular-whitespace": 0,
      "@typescript-eslint/no-this-alias": 0,
      "vue/no-template-shadow": 0,
      "vue/v-on-event-hyphenation": 0,
      "@typescript-eslint/no-non-null-assertion": 0,
      "prefer-const": "off",
      "@typescript-eslint/ban-types": 0,
      "vue/attributes-order": 0
    }
  },
  {
    files: ["**/*.ts", "**/*.vue"],
    rules: {
      "no-undef": "off"
    }
  }
]
