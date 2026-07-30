import type { RouteRecordRaw } from "vue-router"

export const DEPOSIT_QR_CODE_ROUTE_NAME = "DepositQRCode"
export const DEPOSIT_QR_CODE_ROUTE_PATH = "/deposit-qr-code"

export const sharedDepositQRCodeRoute: RouteRecordRaw = {
  path: DEPOSIT_QR_CODE_ROUTE_PATH,
  name: DEPOSIT_QR_CODE_ROUTE_NAME,
  component: () => import("src/common/pages/DepositQRCode.vue"),
}

type ExistingMatch = { kind: "none" } | { kind: "match" } | { kind: "conflict"; reason: string }

function findExistingDepositQRCodeRoute(routes: RouteRecordRaw[]): ExistingMatch {
  for (const route of routes) {
    const nameMatches = route.name === DEPOSIT_QR_CODE_ROUTE_NAME
    const pathMatches = route.path === DEPOSIT_QR_CODE_ROUTE_PATH

    if (nameMatches && pathMatches) return { kind: "match" }
    if (nameMatches && !pathMatches) {
      return {
        kind: "conflict",
        reason: `route name "${DEPOSIT_QR_CODE_ROUTE_NAME}" exists with path "${String(
          route.path
        )}" (expected "${DEPOSIT_QR_CODE_ROUTE_PATH}")`,
      }
    }
    if (!nameMatches && pathMatches) {
      return {
        kind: "conflict",
        reason: `route path "${DEPOSIT_QR_CODE_ROUTE_PATH}" exists with name "${String(
          route.name
        )}" (expected "${DEPOSIT_QR_CODE_ROUTE_NAME}")`,
      }
    }

    if (route.children && route.children.length) {
      const nested = findExistingDepositQRCodeRoute(route.children as RouteRecordRaw[])
      if (nested.kind !== "none") return nested
    }
  }
  return { kind: "none" }
}

export function ensureDepositQRCodeRoute(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const existing = findExistingDepositQRCodeRoute(routes)
  if (existing.kind === "conflict") {
    throw new Error(`[depositQRCodeRoute] shared fallback aborted: ${existing.reason}`)
  }
  if (existing.kind === "match") return routes
  return [...routes, sharedDepositQRCodeRoute]
}
