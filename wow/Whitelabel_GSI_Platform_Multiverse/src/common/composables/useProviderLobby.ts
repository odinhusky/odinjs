import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch, type ComputedRef, type MaybeRefOrGetter, toValue } from "vue"
import type { Router } from "vue-router"
import type * as Response from "src/api/response.type"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { GAME_TAG_TYPE, GAME_TYPE, INTEGRATION_ID } from "src/common/utils/constants"
import {
  useProviderProducts,
  useProviderGames,
  useProviderFavoriteList
} from "src/common/composables/useProviderQueries"
import {
  favoriteIdsToMap,
  isProviderGameFavorited,
  useProviderFavoriteActions
} from "src/common/composables/useProviderFavorites"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { EventBusKey } from "src/symbols"

export type FilterProviderGamesOptions = {
  integrationId?: INTEGRATION_ID.Enums
  productCode?: number
  searchType?: GAME_TAG_TYPE.Enums
  favoriteMap?: Response.FavoriteMap
}

function applyFilterProviderGames(
  games: Response.GameList,
  { integrationId, productCode, searchType, favoriteMap }: FilterProviderGamesOptions,
  isLoggedIn: boolean
): Response.GameList {
  let result = games

  if (integrationId != null) {
    result = result.filter((game) => game.integration_id === integrationId)
  }

  if (productCode != null) {
    result = result.filter((game) => game.product_code === productCode)
  }

  if (searchType == null) {
    return result
  }

  switch (searchType) {
    case GAME_TAG_TYPE.Enums.New:
      return result.filter((game) => game.newly)
    case GAME_TAG_TYPE.Enums.Hot:
      return result.filter((game) => game.hot)
    case GAME_TAG_TYPE.Enums.Favorites:
      if (!isLoggedIn || !favoriteMap) return []
      return result.filter((game) => Boolean(favoriteMap[game.game_id]))
    default:
      return result
  }
}

/** 依 integration / product / tag 從全量遊戲列表篩選；登入狀態由 composable 內讀取。 */
export function useFilterProviderGames() {
  const { isLogin } = useAuth()

  return (games: Response.GameList, options: FilterProviderGamesOptions = {}) =>
    applyFilterProviderGames(games, options, isLogin.value)
}

type ProviderGameTypeSyncOptions = {
  onGameTypeChange?: (id: GAME_TYPE.Enums) => void
  syncGameTypeUsing?: boolean
}

/** 共用 gameType 同步點，讓 template 可選擇是否同步到 store。 */
export function useProviderGameTypeSync(
  gameTypeId: MaybeRefOrGetter<GAME_TYPE.Enums>,
  { onGameTypeChange, syncGameTypeUsing = true }: ProviderGameTypeSyncOptions = {}
) {
  const { setGameTypeUsing } = useGameTypeStore()

  watch(
    () => toValue(gameTypeId),
    (id) => {
      if (!id) return

      if (syncGameTypeUsing) {
        setGameTypeUsing(id)
      }

      if (onGameTypeChange) {
        onGameTypeChange(id)
      }
    },
    { immediate: true }
  )
}

function setupProviderGameLobbyRouteSync(
  router: Router,
  gameTypeId: MaybeRefOrGetter<GAME_TYPE.Enums | number>,
  routeIntegrationId: MaybeRefOrGetter<number | undefined>,
  routeProductCode: MaybeRefOrGetter<number | undefined>,
  selectedProduct: ComputedRef<Response.ProductItem | null>
) {
  watch(
    [() => toValue(routeIntegrationId), () => toValue(routeProductCode), selectedProduct],
    ([routeIntegration, routeCode, product]) => {
      if (!product) return

      const needsSync =
        routeIntegration !== product.integration_id || routeCode !== product.product_code
      if (!needsSync) return

      router.replace({
        params: {
          integrationId: INTEGRATION_ID.resolveLobbyIntegrationId(product.integration_id),
          gameType: toValue(gameTypeId),
          productCode: product.product_code
        }
      })
    },
    { flush: "post" }
  )
}

type UseProviderProductsOptions = ProviderGameTypeSyncOptions

/** ProductLobby：僅拉 product list，不觸發 game / favorite API。 */
export function useProviderProductsLobby(
  gameTypeId: MaybeRefOrGetter<GAME_TYPE.Enums>,
  options: UseProviderProductsOptions = {}
) {
  useProviderGameTypeSync(gameTypeId, options)

  const productsQuery = useProviderProducts(gameTypeId)
  const productList = computed(() => productsQuery.data.value ?? [])

  return {
    productsQuery,
    productList,
    isProviderLoading: computed(() => productsQuery.isPending.value)
  }
}

type UseProviderGameLobbyOptions = ProviderGameTypeSyncOptions & {
  routeIntegrationId?: MaybeRefOrGetter<INTEGRATION_ID.Enums | undefined>
  routeProductCode?: MaybeRefOrGetter<number | undefined>
}

/** GameLobby：product + game 全列表、收藏、前端篩選；不寫入 productStore / gameStore。 */
export function useProviderGameLobby(
  router: Router,
  gameTypeId: MaybeRefOrGetter<GAME_TYPE.Enums>,
  {
    routeIntegrationId,
    routeProductCode,
    onGameTypeChange,
    syncGameTypeUsing = true
  }: UseProviderGameLobbyOptions = {}
) {
  const eventbus = injectStrict(EventBusKey)
  const { isLogin } = useAuth()
  const { productList } = useProviderProductsLobby(gameTypeId, { onGameTypeChange, syncGameTypeUsing })

  const gamesQuery = useProviderGames(gameTypeId)
  const favoriteListQuery = useProviderFavoriteList()
  const { addFavorite, removeFavorite } = useProviderFavoriteActions()
  const filterProviderGames = useFilterProviderGames()

  const allGames = computed(() => gamesQuery.data.value ?? [])
  const gamesByProductCode = computed(() => {
    const map = new Map<number, Response.GameList>()
    for (const game of allGames.value) {
      const key = game.product_code
      const bucket = map.get(key)
      if (bucket) {
        bucket.push(game)
      } else {
        map.set(key, [game])
      }
    }
    return map
  })
  const favoriteMap = computed(() => favoriteIdsToMap(favoriteListQuery.data.value ?? []))
  const gameSearchType = ref(GAME_TAG_TYPE.Enums.All)
  const searchKeyword = ref("")
  const debouncedSearchKeyword = ref("")

  function clearSearchKeyword() {
    searchKeyword.value = ""
    debouncedSearchKeyword.value = ""
  }

  watch(
    () => toValue(gameTypeId),
    (_id, prevId) => {
      if (prevId == null) return
      gameSearchType.value = GAME_TAG_TYPE.Enums.All
      clearSearchKeyword()
    }
  )

  watchDebounced(
    searchKeyword,
    (value) => {
      // Quasar clearable emits null; coerce before trim
      const trimmed = (value ?? "").trim()
      debouncedSearchKeyword.value = trimmed ? trimmed.toLowerCase() : ""
    },
    { debounce: 500 }
  )

  watch(searchKeyword, (value) => {
    // Clear button sets null — normalize and reset filter immediately
    if (value == null) {
      searchKeyword.value = ""
      debouncedSearchKeyword.value = ""
      return
    }
    if (!value.trim()) {
      debouncedSearchKeyword.value = ""
    }
  })

  const selectedProductCode = computed(() => {
    const list = productList.value
    if (!list.length) return null

    const routeCode = routeProductCode != null ? toValue(routeProductCode) : undefined
    const routeIntegration = routeIntegrationId != null ? toValue(routeIntegrationId) : undefined
    if (routeCode != null && !Number.isNaN(routeCode)) {
      const fromRoute = list.find((product) => {
        if (product.product_code !== routeCode) return false
        if (routeIntegration != null) return product.integration_id === routeIntegration
        return true
      })
      if (fromRoute) return fromRoute.product_code
    }

    return list[0]?.product_code ?? null
  })

  const selectedProduct = computed(() => {
    const code = selectedProductCode.value
    if (code == null) return null
    return productList.value.find((product) => product.product_code === code) ?? null
  })

  if (routeIntegrationId != null || routeProductCode != null) {
    setupProviderGameLobbyRouteSync(
      router,
      gameTypeId,
      routeIntegrationId ?? (() => undefined),
      routeProductCode ?? (() => undefined),
      selectedProduct
    )
  }

  const productCodeOption = computed(() =>
    productList.value.map((item) => ({
      label: item.product_name,
      value: item.product_code
    }))
  )

  const filteredGameList = computed(() => {
    const productCode = selectedProductCode.value
    if (productCode == null) return []

    const bucket = gamesByProductCode.value.get(productCode) ?? []
    return filterProviderGames(bucket, {
      searchType: gameSearchType.value,
      favoriteMap: favoriteMap.value
    })
  })

  const showGameList = computed(() => {
    if (!debouncedSearchKeyword.value) {
      return filteredGameList.value
    }
    return filteredGameList.value.filter((game) =>
      game.game_name.toLowerCase().includes(debouncedSearchKeyword.value)
    )
  })

  function selectProductCode(code: number) {
    const product = productList.value.find((item) => item.product_code === code)
    if (!product) return

    clearSearchKeyword()
    router.replace({
      params: {
        integrationId: INTEGRATION_ID.resolveLobbyIntegrationId(product.integration_id),
        gameType: toValue(gameTypeId),
        productCode: product.product_code
      }
    })
  }

  function isGameFavorited(game: Response.GameItem) {
    return isProviderGameFavorited(game.game_id, favoriteMap.value)
  }

  function blockFavoritesTabWhenLoggedOut(tagValue: GAME_TAG_TYPE.Enums, pup = false): boolean {
    if (tagValue !== GAME_TAG_TYPE.Enums.Favorites || isLogin.value) {
      return false
    }

    if (pup) {
      eventbus.emit("openLogin", true)
      return true
    }

    router.push({ name: "Login" })
    return true
  }

  watch(gameSearchType, (newValue, oldValue) => {
    if (!selectedProduct.value) return
    if (blockFavoritesTabWhenLoggedOut(newValue, true)) {
      gameSearchType.value = oldValue
    }
  })

  return {
    selectedProductCode,
    selectedProduct,
    productList,
    productCodeOption,
    gameSearchType,
    searchKeyword,
    showGameList,
    selectProductCode,
    isGameFavorited,
    addFavorite,
    removeFavorite
  }
}
