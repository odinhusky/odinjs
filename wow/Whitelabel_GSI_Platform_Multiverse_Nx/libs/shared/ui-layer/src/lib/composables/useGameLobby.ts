import type { ProductItem, GameItem } from "@shared-lib/api/commonTypes/gameTypes"
import type { GetProductListParamsType } from "@shared-lib/api/apiFunctions/game_getProductList"
import type { GameListParamsType } from "@shared-lib/api/apiFunctions/game_getGameList"
import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import { toProductLobbyRoute } from "@shared-lib/constants/routePath"
import { GAME_TAG_TYPE_ENUMS } from "@shared-lib/constants/enums/gameTagType"
import { useProductList } from "@shared-lib/api/hooks/useProductList"
import {
  useGameTypeList,
  toGameTypeState,
  type GameTypeListApiResponse,
  type GameTypeState
} from "@shared-lib/api/hooks/useGameTypeList"
import { useGameList } from "@shared-lib/api/hooks/useGameList"
import { useFavorite } from "./useFavorite"

const GAME_TAG_OPTIONS = [
  { label: "All", value: GAME_TAG_TYPE_ENUMS.ALL },
  { label: "Latest", value: GAME_TAG_TYPE_ENUMS.NEW },
  { label: "Hot", value: GAME_TAG_TYPE_ENUMS.HOT },
  { label: "Favorites", value: GAME_TAG_TYPE_ENUMS.FAVORITES }
]

const GAME_TYPE_TITLE_MAP: Record<number, string> = {
  [GAME_TYPE_ENUMS.SLOT]: "Slot",
  [GAME_TYPE_ENUMS.LIVECASINO]: "Live Casino",
  [GAME_TYPE_ENUMS.SPORTBOOK]: "Sports",
  [GAME_TYPE_ENUMS.VIRTUALSPORT]: "V-Sports",
  [GAME_TYPE_ENUMS.LOTTERY]: "Lottery",
  [GAME_TYPE_ENUMS.CARDBOARD]: "Cardboard",
  [GAME_TYPE_ENUMS.P2P]: "P2P",
  [GAME_TYPE_ENUMS.FISHING]: "Fishing",
  [GAME_TYPE_ENUMS.OTHER]: "Other",
  [GAME_TYPE_ENUMS.COCKFIGHTING]: "Cockfighting",
  [GAME_TYPE_ENUMS.ESPORT]: "E-Sports",
  [GAME_TYPE_ENUMS.POKER]: "Poker",
  [GAME_TYPE_ENUMS.CASINO_PREMIUM]: "Casino Premium"
}

export const useGameLobby = () => {
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { openGame } = useOpenGame()
  const { ensureLoggedIn } = useRequireLogin()

  const gameTypeId = computed(() => Number(route.params.gameType || 0) || 0)

  const queryParams = reactive<GetProductListParamsType>({
    game_type_id: 0
  })

  const {
    productList,
    isLoading: isProviderLoading,
    refetch: refetchProducts
  } = useProductList({
    params: queryParams,
    options: { enabled: false }
  })

  const {
    favoriteGameIds,
    syncFavoriteFlag,
    getFavoriteGames,
    mutatingGameIds,
    isFavoriteMutating,
    handleToggleFavorite: favoriteToggle
  } = useFavorite()

  const selectedProductCode = ref(0)
  const selectedIntegrationId = ref(0)
  const searchKeyword = ref("")
  const selectedTag = ref<GAME_TAG_TYPE_ENUMS>(GAME_TAG_TYPE_ENUMS.NEW)
  const gameList = ref<GameItem[]>([])

  // ── 遊戲列表 Query (reactive by params, cached per combination) ────────────────
  const gameListParams = computed<GameListParamsType | null>(() => {
    if (!gameTypeId.value || !selectedProductCode.value) return null
    return {
      game_type_id: gameTypeId.value,
      integration_id: selectedIntegrationId.value || undefined,
      product_code: selectedProductCode.value,
      search_type: selectedTag.value
    }
  })

  const { data: rawGameList, isLoading: isGameListLoading } = useGameList({ params: gameListParams })

  // Sync into writable ref so favourite-toggle mutations can still modify it locally
  watch(
    rawGameList,
    (newData) => {
      if (newData != null) {
        gameList.value = syncFavoriteFlag(Array.isArray(newData) ? newData : [])
      }
    },
    { immediate: true }
  )

  const showProviderPanel = ref(false)
  const providerListPanelRef = ref<HTMLElement | null>(null)
  const providerItemRefs = ref<Record<number, HTMLElement | null>>({})

  const { data: gameTypeStateData } = useGameTypeList<GameTypeState>({
    options: {
      select: (response: GameTypeListApiResponse) => toGameTypeState(response.data ?? [])
    }
  })

  const gameTypeState = computed<GameTypeState>(() => {
    return (
      gameTypeStateData.value || {
        list: [],
        map: {}
      }
    )
  })

  const lobbyTitle = computed(() => GAME_TYPE_TITLE_MAP[gameTypeId.value] || "Game Lobby")

  const providerOptions = computed(() => {
    return (productList.value || []) as ProductItem[]
  })

  const selectedProvider = computed(() => {
    return providerOptions.value.find((item) => item.product_code === selectedProductCode.value) || null
  })

  const { getImage } = useGetImage()

  const getProductTabImage = (productCode: number) => getImage(`/images/tabs/${productCode}.png`)

  const filteredGameList = computed(() => {
    const keyword = String(searchKeyword.value || "")
      .trim()
      .toLowerCase()
    if (!keyword) return gameList.value
    return gameList.value.filter((item) =>
      String(item.game_name || "")
        .toLowerCase()
        .includes(keyword)
    )
  })

  const getFavoriteGamesList = async () => {
    return await getFavoriteGames()
  }

  // Auth gate for FAVORITES tab — the actual fetch is driven reactively by gameListParams
  const checkFavoritesAuth = async () => {
    const isLoggedIn = await ensureLoggedIn({
      redirectPath: String(route.fullPath || toProductLobbyRoute(gameTypeId.value))
    })
    if (!isLoggedIn) {
      selectedTag.value = GAME_TAG_TYPE_ENUMS.NEW
    }
  }

  const removeFromFavoritesListIfNeeded = (gameId: number, isFavorited: boolean) => {
    if (selectedTag.value !== GAME_TAG_TYPE_ENUMS.FAVORITES) return false
    if (isFavorited) return false

    gameList.value = gameList.value.filter((item) => Number(item.game_id) !== gameId)
    return true
  }

  const applyFavoriteChangeToCurrentList = (gameId: number, isFavorited: boolean) => {
    gameList.value = syncFavoriteFlag(
      gameList.value.map((item) => {
        if (Number(item.game_id) !== gameId) return item

        // Keep favorite_count in sync with the optimistic favorite toggle result.
        const favoriteBeforeToggle = !isFavorited
        const nextFavoriteCount = favoriteBeforeToggle
          ? Math.max(0, Number(item.favorite_count || 0) - 1)
          : Number(item.favorite_count || 0) + 1

        return {
          ...item,
          is_favorite: isFavorited,
          favorite_count: nextFavoriteCount
        }
      })
    )
  }

  const handleToggleFavorite = async (game: GameItem) => {
    const toggleResult = await favoriteToggle(game)
    if (!toggleResult) return

    const removedFromFavoritesList = removeFromFavoritesListIfNeeded(toggleResult.gameId, toggleResult.isFavorited)

    if (removedFromFavoritesList) return

    applyFavoriteChangeToCurrentList(toggleResult.gameId, toggleResult.isFavorited)
  }

  const setProviderItemRef = (productCode: number, el: HTMLElement | null) => {
    providerItemRefs.value[productCode] = el
  }

  const focusActiveProvider = async () => {
    await nextTick()
    const activeEl = providerItemRefs.value[selectedProductCode.value]
    if (!activeEl) return
    activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }

  const toggleProviderPanel = async () => {
    showProviderPanel.value = !showProviderPanel.value
    if (showProviderPanel.value) {
      await focusActiveProvider()
    }
  }

  const selectProvider = async (provider: ProductItem) => {
    const nextProductCode = Number(provider.product_code)
    const nextIntegrationId = Number(provider.integration_id)

    if (selectedProductCode.value === nextProductCode && selectedIntegrationId.value === nextIntegrationId) {
      showProviderPanel.value = false
      return
    }

    selectedProductCode.value = nextProductCode
    selectedIntegrationId.value = nextIntegrationId

    await router.replace({
      params: {
        gameType: String(gameTypeId.value),
        productCode: String(selectedProductCode.value)
      }
    })

    showProviderPanel.value = false
    // Game list re-fetches automatically via the reactive gameListParams query
  }

  const handleGameCardClick = async (game: GameItem) => {
    await openGame(
      Number(game.integration_id),
      Number(game.product_code),
      String(game.game_code || ""),
      Number(gameTypeId.value),
      true
    )
  }

  const initProviders = async () => {
    if (!gameTypeId.value) return

    queryParams.game_type_id = gameTypeId.value
    await refetchProducts()

    const list = providerOptions.value
    if (!list.length) {
      selectedProductCode.value = 0
      selectedIntegrationId.value = 0
      return
    }

    const routeProductCode = Number(route.params.productCode || 0)
    const matchedProvider = list.find((item) => Number(item.product_code) === routeProductCode)
    const provider = matchedProvider || list[0]

    selectedProductCode.value = Number(provider.product_code)
    selectedIntegrationId.value = Number(provider.integration_id)

    await router.replace({
      params: {
        gameType: String(gameTypeId.value),
        productCode: String(selectedProductCode.value)
      }
    })
  }

  watch(selectedTag, async (tag) => {
    if (tag === GAME_TAG_TYPE_ENUMS.FAVORITES) {
      await checkFavoritesAuth()
    }
  })

  watch(
    () => favoriteGameIds.value,
    () => {
      gameList.value = syncFavoriteFlag(gameList.value)
    },
    { deep: true }
  )

  watch(
    () => authStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) return
      gameList.value = gameList.value.map((item) => ({ ...item, is_favorite: false }))
    }
  )

  const initialize = async () => {
    await getFavoriteGamesList()
    await initProviders()
    // Game list fetches automatically once selectedProductCode is set by initProviders
  }

  return {
    gameTypeId,
    lobbyTitle,
    gameTypeState,
    isProviderLoading,
    isGameListLoading,
    providerOptions,
    selectedProvider,
    selectedTag,
    searchKeyword,
    gameTagOptions: GAME_TAG_OPTIONS,
    filteredGameList,
    showProviderPanel,
    providerListPanelRef,
    getProductTabImage,
    toggleProviderPanel,
    selectProvider,
    setProviderItemRef,
    handleGameCardClick,
    handleToggleFavorite,
    isFavoriteMutating,
    mutatingGameIds,
    initialize,
    getFavoriteGamesList
  }
}
