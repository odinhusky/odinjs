import * as routerModule from "@router/build"
import { ensureDepositQRCodeRoute } from "src/router/depositQRCodeRoute"
import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"

const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/common/pages/Error404.vue"),
  },
  {
    path: "/Maintenance",
    component: () => import("src/common/pages/Maintenance.vue"),
  },
  {
    path: "/windowClose",
    component: () => import("src/common/pages/WindowClose.vue"),
  },
  {
    path: "/auth/telegram/callback",
    name: "TelegramCallback",
    component: () => import("src/common/pages/TelegramCallback.vue"),
  },
]

// export default routes

export default async function (siteKey?: string) {
  let routes: RouteRecordRaw[] = []
  let beforeEach: NavigationGuardWithThis<undefined> | null = null

  if (siteKey) {
    routes = routerModule.routes ? routerModule.routes : []
    beforeEach = routerModule && routerModule.beforeEach ? routerModule.beforeEach : null
  }

  const templateRoutes = siteKey ? ensureDepositQRCodeRoute(routes) : routes
  const allRoutes = templateRoutes.concat(baseRoutes)
  return { routes: allRoutes, beforeEach }
}
