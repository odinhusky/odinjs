import { computed, type ComputedRef } from "vue"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import type * as Response from "src/api/response.type"
import { GAME_TYPE, INTEGRATION_ID } from "src/common/utils/constants"
import { useGameLobbyRouteGuard } from "src/common/hooks/useProviderLobbyRouteGuards"

export function parseRouteParamNumber(raw: unknown): number | null {
  if (raw == null || raw === "") return null
  const value = Number(raw)
  return Number.isNaN(value) ? null : value
}

export function buildGameLobbyRouteParams(
  gameType: number,
  productCode: number,
  integrationId?: number | null
) {
  return {
    integrationId: INTEGRATION_ID.resolveLobbyIntegrationId(integrationId),
    gameType,
    productCode
  }
}

export function buildGameLobbyParamsFromProduct(
  gameType: number,
  product: Pick<Response.ProductItem, "integration_id" | "product_code">
) {
  return buildGameLobbyRouteParams(gameType, product.product_code, product.integration_id)
}

export type ParsedGameLobbyRoute = {
  parsedIntegrationId: ComputedRef<number | null>
  parsedGameType: ComputedRef<number | null>
  parsedProductCode: ComputedRef<number | null | undefined>
  safeGameType: ComputedRef<GAME_TYPE.Enums>
  routeIntegrationId: ComputedRef<INTEGRATION_ID.Enums>
  routeProductCode: ComputedRef<number | undefined>
}

export type UseProviderGameLobbyRouteOptions = {
  fallbackGameType?: GAME_TYPE.Enums
}

export function useProviderGameLobbyRoute(
  route: RouteLocationNormalizedLoaded,
  router: Router,
  options: UseProviderGameLobbyRouteOptions = {}
): ParsedGameLobbyRoute {
  const { fallbackGameType = GAME_TYPE.Enums.SLOT } = options

  const parsedIntegrationId = computed(() => parseRouteParamNumber(route.params.integrationId))
  const parsedGameType = computed(() => parseRouteParamNumber(route.params.gameType))
  const parsedProductCode = computed(() => {
    const raw = route.params.productCode
    if (raw == null || raw === "") return undefined
    const code = Number(raw)
    return Number.isNaN(code) ? null : code
  })

  const safeGameType = computed(() =>
    parsedGameType.value != null && parsedGameType.value in GAME_TYPE.I18nKeys
      ? (parsedGameType.value as GAME_TYPE.Enums)
      : fallbackGameType
  )

  const routeIntegrationId = computed(() =>
    INTEGRATION_ID.resolveLobbyIntegrationId(parsedIntegrationId.value)
  )

  const routeProductCode = computed(() =>
    parsedProductCode.value == null ? undefined : parsedProductCode.value
  )

  useGameLobbyRouteGuard({
    route,
    router,
    parsedIntegrationId,
    parsedGameType,
    parsedProductCode,
    fallbackGameType
  })

  return {
    parsedIntegrationId,
    parsedGameType,
    parsedProductCode,
    safeGameType,
    routeIntegrationId,
    routeProductCode
  }
}
