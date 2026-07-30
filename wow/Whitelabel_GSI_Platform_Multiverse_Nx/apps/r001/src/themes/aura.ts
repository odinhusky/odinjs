// apps/r001/src/primevue-theme/index.ts
import { definePreset } from "@primeuix/themes"
import { SharedAuraPreset } from "@shared-src/lib/prime-presets/shared-aura"

// console.log("!! SharedAuraPreset ", SharedAuraPreset)

export const AuraPresent = definePreset(SharedAuraPreset, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: "{indigo.50}",
          100: "{indigo.100}",
          200: "{indigo.200}",
          300: "{indigo.300}",
          400: "{indigo.400}",
          500: "var(--emotional-04)",
          600: "var(--primary-04)",
          700: "var(--primary-04)",
          800: "var(--primary-04)",
          900: "var(--primary-04)",
          950: "var(--primary-04)"
        },
        surface: {
          50: "{lime.50}",
          100: "{lime.100}",
          200: "{lime.200}",
          300: "{lime.300}",
          400: "{lime.400}",
          500: "{lime.500}",
          600: "{lime.600}",
          700: "{lime.700}",
          800: "{lime.800}",
          900: "{lime.900}",
          950: "{lime.950}"
        }
      },
      dark: {
        primary: {
          50: "{pink.50}",
          100: "{pink.100}",
          200: "{pink.200}",
          300: "{pink.300}",
          400: "{pink.400}",
          500: "{pink.500}",
          600: "{pink.600}",
          700: "{pink.700}",
          800: "{pink.800}",
          900: "{pink.900}",
          950: "{pink.950}"
        },
        surface: {
          50: "{yellow.50}",
          100: "{yellow.100}",
          200: "{yellow.200}",
          300: "{yellow.300}",
          400: "{yellow.400}",
          500: "{yellow.500}",
          600: "{yellow.600}",
          700: "{yellow.700}",
          800: "{yellow.800}",
          900: "{yellow.900}",
          950: "{yellow.950}"
        }
      }
    }
  },
  components: {
    button: {
      root: {
        gap: "0.5rem" // 圖標與文字的間距
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              // background: "var(--primary-04)",
              // hoverBackground: "var(--emotional-01)",
              // activeBackground: "{primary.active.color}",
              // borderColor: "{primary.color}",
              // hoverBorderColor: "var(--emotional-01)",
              // activeBorderColor: "{primary.active.color}",
              // color: "{primary.contrast.color}",
              // hoverColor: "{indigo.400}",
              // activeColor: "{primary.contrast.color}",
              // focusRing: {
              //   color: "{primary.color}",
              //   shadow: "none"
              // }
            }
          }
        },
        dark: {
          root: {
            primary: {
              background: "{primary.color}",
              hoverBackground: "{primary.hover.color}",
              activeBackground: "{primary.active.color}",
              borderColor: "{primary.color}",
              hoverBorderColor: "{primary.hover.color}",
              activeBorderColor: "{primary.active.color}",
              // color: "{primary.contrast.color}",
              color: "{surface.500}",

              hoverColor: "{primary.contrast.color}",
              activeColor: "{primary.contrast.color}",
              focusRing: {
                color: "{primary.color}",
                shadow: "none"
              }
            }
          }
        }
      }
    }
  }
})

export default {
  preset: AuraPresent,
  options: {
    ripple: true,
    darkModeSelector: ".dark"
  }
}
