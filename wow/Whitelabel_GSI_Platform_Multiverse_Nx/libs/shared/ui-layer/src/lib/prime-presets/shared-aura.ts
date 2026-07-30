import { definePreset } from "@primeuix/themes"
import Aura from "@primeuix/themes/aura"

// 繼承 Aura 骨架，但神經網路對接你的 CSS 變數
export const SharedAuraPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "var(--emotional-01)",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}"
    }
  }
  // semantic: {
  //   primary: {
  //     50: "var(--primary-01)",
  //     500: "var(--primary-03)",
  //     600: "var(--primary-04)", // 按鈕與主色調
  //     700: "var(--primary-04)"
  //   },
  //   colorScheme: {
  //     light: {
  //       surface: {
  //         0: "var(--neutral-01)",
  //         50: "var(--neutral-02)",
  //         900: "var(--neutral-08)"
  //       }
  //     }
  //   }
  // },
  // components: {
  //   // 滿足老闆要求的語意化映射
  //   datatable: {
  //     header: {
  //       background: "var(--bg-header)",
  //       color: "var(--text-02)"
  //     }
  //   }
  // }
})

export default SharedAuraPreset
