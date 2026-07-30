import { useQueryClient } from "@tanstack/vue-query"
import { useRouter } from "vue-router"
import type * as Response from "src/api/response.type"
import { providerQueryKeys } from "src/common/composables/useProviderQueries"
import { buildGameLobbyParamsFromProduct } from "src/common/composables/useProviderGameLobbyRoute"
import { GAME_TYPE } from "src/common/utils/constants"

export function useNavigateGameLobby() {
  const router = useRouter()
  const queryClient = useQueryClient()

  function navigateToGameLobby(gameTypeId: GAME_TYPE.Enums) {
    const products = queryClient.getQueryData<Response.ProductList>(providerQueryKeys.products(gameTypeId))
    const first = products?.[0]
    if (first) {
      router.push({
        name: "GameLobby",
        params: buildGameLobbyParamsFromProduct(gameTypeId, first)
      })
      return
    }

    router.push({ name: "ProductLobby", params: { gameType: gameTypeId } })
  }

  return { navigateToGameLobby }
}
