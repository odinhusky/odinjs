import { computed } from "vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import {
  SPORTBET_PRODUCT_LOBBY_GAME_TYPE,
  SPORTBET_PRODUCT_LOBBY_USERNAME,
  canAccessProductLobbyByUsername,
  isSportbetRestrictedProductLobby
} from "app/template/set_amuse/utils/productLobbyAccess"

export function useProductLobbyAccess() {
  const { userInfo } = useUserInfo()

  const canAccessSportbetProductLobbyRoute = computed(() =>
    canAccessProductLobbyByUsername(SPORTBET_PRODUCT_LOBBY_GAME_TYPE, userInfo.value.username)
  )

  const filterAccessibleGameTypes = <T extends { id?: number }>(list: T[]) =>
    list.filter((item) => canAccessProductLobbyByUsername(item.id ?? 0, userInfo.value.username))

  return {
    SPORTBET_PRODUCT_LOBBY_GAME_TYPE,
    SPORTBET_PRODUCT_LOBBY_USERNAME,
    canAccessSportbetProductLobbyRoute,
    canAccessProductLobby: (gameType: number) => canAccessProductLobbyByUsername(gameType, userInfo.value.username),
    isSportbetRestrictedProductLobby,
    filterAccessibleGameTypes
  }
}
