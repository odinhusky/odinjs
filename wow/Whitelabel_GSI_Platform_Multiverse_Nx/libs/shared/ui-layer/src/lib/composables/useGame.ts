import type { ProductItem } from "@shared-lib/api/commonTypes/gameTypes"
import type { GetProductListParamsType } from "@shared-lib/api/apiFunctions/game_getProductList"
import { CATEGORY_ENUMS, Category, GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import {
  useGameTypeList,
  toGameTypeState,
  type GameTypeListApiResponse,
  type GameTypeState
} from "@shared-lib/api/hooks/useGameTypeList"
import { OPEN_LOBBY_MODE_ENUMS } from "@shared-lib/constants/enums/openLobbyMode"
import { ROUTE_PATH, toGameLobbyRoute } from "@shared-lib/constants/routePath"
import { POST_LOGIN_RETURN_ROUTE } from "@shared-lib/constants/sessionStorageKeys"
import { useProductList } from "@shared-lib/api/hooks/useProductList"
import { useSetting } from "@shared-lib/api/hooks/useSetting"

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

export const useGame = () => {
  const route = useRoute()
  const authStore = useAuthStore()
  const { pushToast } = useToastQueue()
  const postLoginReturnRoute = useSessionStorage<string>(POST_LOGIN_RETURN_ROUTE, "")
  const { openGame } = useOpenGame()
  const { setting } = useSetting({ selector: (data) => data })

  const gameTypeId = computed(() => {
    const value = Number(route.params.gameType)
    return Number.isFinite(value) ? value : 0
  })

  const queryParams = reactive<GetProductListParamsType>({
    game_type_id: 0
  })

  const { productList, isLoading, isFetching, refetch } = useProductList({
    params: queryParams,
    options: {
      enabled: false
    }
  })

  const { data: gameTypeStateData } = useGameTypeList<GameTypeState>({
    options: {
      select: (response: GameTypeListApiResponse) => {
        return toGameTypeState(response.data ?? [])
      }
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

  const lobbyTitle = computed(() => GAME_TYPE_TITLE_MAP[gameTypeId.value] || "Product Lobby")

  const refreshProductList = async () => {
    if (!gameTypeId.value) return

    queryParams.game_type_id = gameTypeId.value

    await refetch()
  }

  const handleProductClick = async (integrationId: number, productCode: number, pup = false, lang?: number) => {
    if (!gameTypeId.value || !productCode) return

    const redirectPath = sanitizeInternalPath(String(route.fullPath || ""))
    const gameTypeCategory = Category[gameTypeId.value as GAME_TYPE_ENUMS]

    if (!authStore.isLoggedIn && gameTypeCategory !== CATEGORY_ENUMS.LOBBYOPEN) {
      if (redirectPath) {
        postLoginReturnRoute.value = redirectPath
      }

      pushToast({
        severity: TOAST_SEVERITY_ENUMS.ERROR,
        summary: "Login Required",
        detail: "請先登入",
        life: 2500
      })
      await navigateTo(ROUTE_PATH.LOGIN.PASSWORD)
      return
    }

    if (gameTypeCategory === CATEGORY_ENUMS.LOBBYOPEN) {
      await openGame(integrationId, productCode, "", gameTypeId.value, pup, lang)
      return
    }

    const openLobbyMode = setting.value?.open_lobby_mode
    const routePath = toGameLobbyRoute(gameTypeId.value, productCode)
    if (openLobbyMode === OPEN_LOBBY_MODE_ENUMS.NEW_TAB) {
      if (process.client) {
        window.open(routePath, "_blank", "noopener,noreferrer")
      }
      return
    }

    await navigateTo(routePath)
  }

  const handleProductCardClick = (product: ProductItem) => {
    if (!product?.product_code || !product?.integration_id) return

    handleGlobalClick({
      target: `handleProductLobbyProduct${String(product.product_code)}Click`,
      debounceTimer: 150,
      callback: async () => {
        await handleProductClick(Number(product.integration_id), Number(product.product_code))
      }
    })
  }

  watch(
    [gameTypeId],
    async () => {
      await refreshProductList()
    },
    { immediate: true }
  )

  return {
    gameTypeId,
    gameTypeState,
    lobbyTitle,
    productList: computed(() => productList.value || []),
    isLoading: computed(() => isLoading.value || isFetching.value),
    handleProductClick,
    handleProductCardClick,
    refreshProductList
  }
}
