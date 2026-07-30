import { useQuery, type QueryClient } from "@tanstack/vue-query"
import { computed, type MaybeRefOrGetter, toValue } from "vue"
import { getFavoriteGameList, getGameList, getProductList } from "src/api/game"
import type * as Response from "src/api/response.type"
import { useApi, unwrapUseApiData } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { GAME_TYPE } from "src/common/utils/constants"
import { FIVE_MINUTES, HOUR } from "src/common/utils/constants/durationTime"

/** Provider 相關 vue-query keys（遊戲全列表與登入無關；收藏另用 favoriteList） */
export const providerQueryKeys = {
  products: (gameTypeId: number) => ["platform", "v1", "player", "product", gameTypeId] as const,
  games: (gameTypeId: number) => ["platform", "v1", "player", "product", "game", gameTypeId] as const,
  favoriteList: ["player", "game", "favorite", "list"] as const
}

/** 登出時清除收藏快取（遊戲全列表可共用，不必因登入狀態重打） */
export function invalidateProviderQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: providerQueryKeys.favoriteList })
}

/**
 * GET /platform/v1/player/product?game_type_id=
 * 以 game_type_id 作為 vue-query cache key。
 */
export function useProviderProducts(game_type_id: MaybeRefOrGetter<GAME_TYPE.Enums>) {
  const gameTypeId = computed(() => toValue(game_type_id))
  const enabled = computed(() => gameTypeId.value in GAME_TYPE.I18nKeys)

  return useQuery<Response.ProductList, Error>({
    queryKey: computed(() => providerQueryKeys.products(gameTypeId.value)),
    enabled,
    queryFn: async () => {
      const res = await useApi(getProductList, {
        game_type_id: gameTypeId.value
      })
      const data = unwrapUseApiData(res, "getProductList")
      return data?.length ? data : []
    },
    staleTime: HOUR
  })
}

/**
 * GET /platform/v1/player/product/game?game_type_id=
 * 一次取得該 game_type 下全部遊戲，供前端依 product / tag 篩選。
 * 與登入狀態共用同一份快取；收藏分頁請用 useProviderFavoriteList + favoriteMap。
 */
export function useProviderGames(game_type_id: MaybeRefOrGetter<GAME_TYPE.Enums>) {
  const gameTypeId = computed(() => toValue(game_type_id))
  const enabled = computed(() => gameTypeId.value in GAME_TYPE.I18nKeys)

  return useQuery<Response.GameList, Error>({
    queryKey: computed(() => providerQueryKeys.games(gameTypeId.value)),
    enabled,
    queryFn: async () => {
      const res = await useApi(getGameList, {
        game_type_id: gameTypeId.value
      })
      const data = unwrapUseApiData(res, "getGameList")
      return data?.length ? data : []
    },
    staleTime: HOUR
  })
}

/** GET /v1/player/game/favorite/list — 收藏 id 列表，僅登入時啟用 */
export function useProviderFavoriteList() {
  const { isLogin } = useAuth()

  return useQuery<Response.FavoriteList, Error>({
    queryKey: providerQueryKeys.favoriteList,
    enabled: computed(() => isLogin.value),
    queryFn: async () => {
      const res = await useApi(getFavoriteGameList)
      const data = unwrapUseApiData(res, "getFavoriteGameList")
      return data?.length ? data : []
    },
    staleTime: FIVE_MINUTES
  })
}
