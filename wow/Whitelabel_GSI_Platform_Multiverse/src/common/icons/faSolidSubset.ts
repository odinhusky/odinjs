import { addIcon } from "@iconify/vue"
import type { IconifyIcon } from "@iconify/types"

/**
 * 首屏／常用 FA solid 子集（來源：Iconify fa-solid / Font Awesome 5 Solid）。
 * 刻意不 import `@iconify-json/fa-solid` 全量 icons.json，避免把整包打進 bundle。
 */
const FA_SOLID_SUBSET: Record<string, IconifyIcon> = {
  "chevron-left": {
    body: '<path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94"/>',
    width: 320,
  },
  "chevron-right": {
    body: '<path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256L34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941"/>',
    width: 320,
  },
}

let registered = false

/** 註冊子集後可用 `<Icon icon="fa-solid:chevron-left" />`，不走 Iconify API、不觸發 FA webfont */
export function ensureFaSolidSubsetRegistered(): void {
  if (registered) return
  registered = true
  for (const [name, data] of Object.entries(FA_SOLID_SUBSET)) {
    addIcon(`fa-solid:${name}`, data)
  }
}
