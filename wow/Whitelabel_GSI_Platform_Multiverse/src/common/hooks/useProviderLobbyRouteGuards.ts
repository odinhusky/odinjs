import { watchEffect, type ComputedRef } from "vue"
import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import { GAME_TYPE, INTEGRATION_ID } from "src/common/utils/constants"

type GuardBaseOptions = {
  route: RouteLocationNormalizedLoaded
  router: Router
  fallbackGameType?: GAME_TYPE.Enums
}

type ProductLobbyGuardOptions = GuardBaseOptions & {
  parsedGameType: ComputedRef<number | null>
  productLobbyRouteName?: string
}

type GameLobbyGuardOptions = GuardBaseOptions & {
  parsedIntegrationId: ComputedRef<number | null>
  parsedGameType: ComputedRef<number | null>
  parsedProductCode: ComputedRef<number | undefined | null>
  gameLobbyRouteName?: string
}

function isValidGameTypeId(value: number | null): value is GAME_TYPE.Enums {
  if (value == null) return false
  return value in GAME_TYPE.I18nKeys
}

function createSafeRouteParams(route: RouteLocationNormalizedLoaded, gameType: GAME_TYPE.Enums) {
  return {
    ...route.params,
    gameType,
  }
}

/** ProductLobby 路由參數防呆：確保 gameType 合法，否則 fallback replace。 */
export function useProductLobbyRouteGuard({
  route,
  router,
  parsedGameType,
  fallbackGameType = GAME_TYPE.Enums.SLOT,
  productLobbyRouteName = "ProductLobby",
}: ProductLobbyGuardOptions) {
  watchEffect(() => {
    if (route.name !== productLobbyRouteName) return
    if (isValidGameTypeId(parsedGameType.value)) return

    router.replace({
      name: productLobbyRouteName,
      params: createSafeRouteParams(route, fallbackGameType),
      query: route.query,
    })
  })
}

/** GameLobby 路由參數防呆：gameType / integrationId / productCode 非法時，回退到安全路由。 */
export function useGameLobbyRouteGuard({
  route,
  router,
  parsedIntegrationId,
  parsedGameType,
  parsedProductCode,
  fallbackGameType = GAME_TYPE.Enums.SLOT,
  gameLobbyRouteName = "GameLobby",
}: GameLobbyGuardOptions) {
  watchEffect(() => {
    if (route.name !== gameLobbyRouteName) return

    const resolvedGameType = isValidGameTypeId(parsedGameType.value) ? parsedGameType.value : fallbackGameType
    const hasInvalidGameType = !isValidGameTypeId(parsedGameType.value)
    const hasInvalidIntegrationId = parsedIntegrationId.value === null
    const hasInvalidProductCode = parsedProductCode.value === null

    if (!hasInvalidGameType && !hasInvalidIntegrationId && !hasInvalidProductCode) return

    const params = createSafeRouteParams(route, resolvedGameType) as Record<string, unknown>
    if (hasInvalidIntegrationId) {
      params.integrationId = INTEGRATION_ID.Default
    }
    if (hasInvalidProductCode) delete params.productCode

    router.replace({
      name: gameLobbyRouteName,
      params,
      query: route.query,
    })
  })
}
