import { watchEffect, type MaybeRefOrGetter, toValue } from "vue"
import type { Router } from "vue-router"
import type * as Response from "src/api/response.type"
import { buildGameLobbyParamsFromProduct } from "src/common/composables/useProviderGameLobbyRoute"
import { GAME_TYPE } from "src/common/utils/constants"

type UseRedirectGameOpenProductLobbyOptions = {
  /** 為 false 時略過導向（例如 template 額外的 access gate）。預設 true。 */
  enabled?: MaybeRefOrGetter<boolean>
  gameLobbyRouteName?: string
}

/**
 * ProductLobby 對 GameOpen 類型：取得第一個 product 後 replace 到 GameLobby。
 * 使用 replace 避免 ProductLobby 留在 history，造成上一頁與自動導向互相循環。
 */
export function useRedirectGameOpenProductLobby(
  router: Router,
  gameTypeId: MaybeRefOrGetter<GAME_TYPE.Enums>,
  productList: MaybeRefOrGetter<Response.ProductItem[]>,
  { enabled = true, gameLobbyRouteName = "GameLobby" }: UseRedirectGameOpenProductLobbyOptions = {}
) {
  watchEffect(() => {
    if (!toValue(enabled)) return

    const typeId = toValue(gameTypeId)
    if (GAME_TYPE.Category[typeId] !== GAME_TYPE.CategoryEnums.GameOpen) return

    const first = toValue(productList)[0]
    if (!first) return

    router.replace({
      name: gameLobbyRouteName,
      params: buildGameLobbyParamsFromProduct(typeId, first)
    })
  })
}
