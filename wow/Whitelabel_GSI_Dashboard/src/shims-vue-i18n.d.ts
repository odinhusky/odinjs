import type { Composer, I18n } from "vue-i18n"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: Composer["t"]
    $te: Composer["te"]
    $d: Composer["d"]
    $n: Composer["n"]
    $i18n: I18n
  }
}
