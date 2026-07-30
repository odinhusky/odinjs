// apps/r017/src/primevue-theme/index.ts
import { definePreset } from "@primeuix/themes"
import { SharedAuraPreset } from "@shared-lib/prime-presets/shared-aura"

// console.log("!! SharedAuraPreset ", SharedAuraPreset)

export const AuraPresent = definePreset(SharedAuraPreset, {

  primitive: {
    // 客製化新增的 primitive
    abyss: {
      50: "var(--color-abyss-50)",
      100: "var(--color-abyss-100)",
      200: "var(--color-abyss-200)",
      300: "var(--color-abyss-300)",
      400: "var(--color-abyss-400)",
      500: "var(--color-abyss-500)",
      600: "var(--color-abyss-600)",
      700: "var(--color-abyss-700)",
      800: "var(--color-abyss-800)",
      900: "var(--color-abyss-900)",
      950: "var(--color-abyss-950)"
    },

    navy: {
      50: "var(--color-navy-50)",
      100: "var(--color-navy-100)",
      200: "var(--color-navy-200)",
      300: "var(--color-navy-300)",
      400: "var(--color-navy-400)",
      500: "var(--color-navy-500)",
      600: "var(--color-navy-600)",
      700: "var(--color-navy-700)",
      800: "var(--color-navy-800)",
      900: "var(--color-navy-900)",
      950: "var(--color-navy-950)"
    }
  },

  semantic: {

    // Primary 以及 Surface 是特殊調色盤，可以直接在內部寫50~950的色階
    colorScheme: {
      light: {
        primary: {
          50: "var(--color-orange-50)",
          100: "var(--color-orange-100)",
          200: "var(--color-orange-200)",
          300: "var(--color-orange-300)",
          400: "var(--color-orange-400)",
          500: "var(--color-orange-500)",
          600: "var(--color-orange-600)",
          700: "var(--color-orange-700)",
          800: "var(--color-orange-800)",
          900: "var(--color-orange-900)",
          950: "var(--color-orange-950)"
        },
        surface: {
          50: "var(--color-surface-50)",
          100: "var(--color-surface-100)",
          200: "var(--color-surface-200)",
          300: "var(--color-surface-300)",
          400: "var(--color-surface-400)",
          500: "var(--color-surface-500)",
          600: "var(--color-surface-600)",
          700: "var(--color-surface-700)",
          800: "var(--color-surface-800)",
          900: "var(--color-surface-900)",
          950: "var(--color-surface-950)"
        },
      },
      dark: {
        primary: {
          50: "var(--color-orange-50)",
          100: "var(--color-orange-100)",
          200: "var(--color-orange-200)",
          300: "var(--color-orange-300)",
          400: "var(--color-orange-400)",
          500: "var(--color-orange-500)",
          600: "var(--color-orange-600)",
          700: "var(--color-orange-700)",
          800: "var(--color-orange-800)",
          900: "var(--color-orange-900)",
          950: "var(--color-orange-950)"
        },
        surface: {
          50: "var(--color-surface-50)",
          100: "var(--color-surface-100)",
          200: "var(--color-surface-200)",
          300: "var(--color-surface-300)",
          400: "var(--color-surface-400)",
          500: "var(--color-surface-500)",
          600: "var(--color-surface-600)",
          700: "var(--color-surface-700)",
          800: "var(--color-surface-800)",
          900: "var(--color-surface-900)",
          950: "var(--color-surface-950)"
        },
      }
    }
  },
  components: {
    button: {
      // root: {
      //   gap: "0.5rem" // 圖標與文字的間距
      // },
      // 改動 Severity 的顏色，這裡以 danger 為例
      // colorScheme: {
      //   light: {
      //     root: {
      //       danger: {
      //         background: "{navy.500}",
      //         hoverBackground: "{navy.600}",
      //         activeBackground: "{navy.700}",
      //         borderColor: "{navy.500}",
      //         hoverBorderColor: "{navy.600}",
      //         activeBorderColor: "{navy.700}",
      //         color: "{surface.0}",
      //         hoverColor: "{surface.0}",
      //         activeColor: "{surface.0}",
      //         focusRing: {
      //           color: "{navy.500}",
      //           shadow: "none"
      //         }
      //       }
      //     }
      //   },
      //   dark: {
      //     root: {
      //       danger: {
      //         background: "{navy.400}",
      //         hoverBackground: "{navy.300}",
      //         activeBackground: "{navy.200}",
      //         borderColor: "{navy.400}",
      //         hoverBorderColor: "{navy.300}",
      //         activeBorderColor: "{navy.200}",
      //         color: "{surface.950}",
      //         hoverColor: "{surface.950}",
      //         activeColor: "{surface.950}",
      //         focusRing: {
      //           color: "{navy.400}",
      //           shadow: "none"
      //         }
      //       }
      //     }
      //   }
      // }
      // 改動 Pallet 的顏色，這裡以 primary 為例
      // colorScheme: {
        // light: {
        //   root: {
        //     primary: {
        //       background: "var(--primary-04)",
        //       hoverBackground: "var(--emotional-01)",
        //       activeBackground: "{primary.active.color}",
        //       borderColor: "{primary.color}",
        //       hoverBorderColor: "var(--emotional-01)",
        //       activeBorderColor: "{primary.active.color}",
        //       color: "{primary.contrast.color}",
        //       hoverColor: "{indigo.400}",
        //       activeColor: "{primary.contrast.color}",
        //       focusRing: {
        //         color: "{primary.color}",
        //         shadow: "none"
        //       }
        //     }
        //   }
        // },
        // dark: {
        //   root: {
        //     primary: {
        //       background: "{primary.color}",
        //       hoverBackground: "{primary.hover.color}",
        //       activeBackground: "{primary.active.color}",
        //       borderColor: "{primary.color}",
        //       hoverBorderColor: "{primary.hover.color}",
        //       activeBorderColor: "{primary.active.color}",
        //       // color: "{primary.contrast.color}",
        //       color: "{surface.500}",

        //       hoverColor: "{primary.contrast.color}",
        //       activeColor: "{primary.contrast.color}",
        //       focusRing: {
        //         color: "{primary.color}",
        //         shadow: "none"
        //       }
        //     }
        //   }
        // }
      // }
    }
  }
})

export default {
  preset: AuraPresent,
  options: {
    ripple: true,
    darkModeSelector: ".dark",
    cssLayer: {
      name: "primevue",
      order: "tailwind-base, primevue, tailwind-utilities"
    }
  }
}
