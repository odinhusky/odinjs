import { useMutation, useQueryClient, type QueryClient } from "@tanstack/vue-query"
import { useQuasar } from "quasar"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { deleteFavoriteGame, favoriteGame } from "src/api/game"
import type * as Response from "src/api/response.type"
import { useApi, unwrapUseApiData } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { providerQueryKeys } from "src/common/composables/useProviderQueries"
import { EventBusKey } from "src/symbols"

export function favoriteIdsToMap(ids: Response.FavoriteList): Response.FavoriteMap {
  const map: Response.FavoriteMap = {}
  ids.forEach((gameId) => {
    map[gameId] = true
  })
  return map
}

function patchProviderFavoriteListCache(queryClient: QueryClient, gameId: number, favorited: boolean) {
  queryClient.setQueryData<Response.FavoriteList>(providerQueryKeys.favoriteList, (current) => {
    const list = current ?? []
    if (favorited) {
      return list.includes(gameId) ? list : [...list, gameId]
    }
    return list.filter((id) => id !== gameId)
  })
}

export function isProviderGameFavorited(gameId: number, favoriteMap: Response.FavoriteMap) {
  return Boolean(favoriteMap[gameId])
}

type ProviderFavoriteMutationContext = {
  previousFavoriteList: Response.FavoriteList | undefined
}

type ProviderFavoriteMutationVars = {
  game: Response.GameItem
}

/** 收藏新增／移除（useMutation + optimistic favoriteList cache，不寫入 gameStore） */
export function useProviderFavoriteActions() {
  const queryClient = useQueryClient()
  const $q = useQuasar()
  const router = useRouter()
  const { t } = useI18n()
  const { isLogin } = useAuth()
  const eventbus = injectStrict(EventBusKey)

  function requireLogin(pup?: boolean): boolean {
    if (isLogin.value) return true

    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: t("common.alarm.pleaseLogin"),
      badgeStyle: "opacity: 0"
    })

    if (pup) {
      eventbus.emit("openLogin", true)
      return false
    }

    router.push({ name: "Login" })
    return false
  }

  function applyFavoriteListRollback(context?: ProviderFavoriteMutationContext) {
    if (context?.previousFavoriteList !== undefined) {
      queryClient.setQueryData(providerQueryKeys.favoriteList, context.previousFavoriteList)
    }
  }

  const addFavoriteMutation = useMutation({
    mutationFn: async ({ game }: ProviderFavoriteMutationVars) => {
      unwrapUseApiData(await useApi(favoriteGame, { game_id: game.game_id }), "favoriteGame")
    },
    onMutate: async ({ game }) => {
      const previousFavoriteList = queryClient.getQueryData<Response.FavoriteList>(providerQueryKeys.favoriteList)
      patchProviderFavoriteListCache(queryClient, game.game_id, true)
      return { previousFavoriteList }
    },
    onError: (_error, _vars, context) => {
      applyFavoriteListRollback(context)
    }
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: async ({ game }: ProviderFavoriteMutationVars) => {
      unwrapUseApiData(await useApi(deleteFavoriteGame, { game_id: game.game_id }), "deleteFavoriteGame")
    },
    onMutate: async ({ game }) => {
      const previousFavoriteList = queryClient.getQueryData<Response.FavoriteList>(providerQueryKeys.favoriteList)
      patchProviderFavoriteListCache(queryClient, game.game_id, false)
      return { previousFavoriteList }
    },
    onError: (_error, _vars, context) => {
      applyFavoriteListRollback(context)
    }
  })

  const isLoading = computed(
    () => addFavoriteMutation.isPending.value || removeFavoriteMutation.isPending.value
  )

  async function addFavorite(game: Response.GameItem, pup?: boolean) {
    if (!requireLogin(pup) || isLoading.value) return
    try {
      await addFavoriteMutation.mutateAsync({ game })
    } catch {
      // useApi 已處理錯誤提示；onError 會還原 favoriteList cache
    }
  }

  async function removeFavorite(game: Response.GameItem, pup?: boolean) {
    if (!requireLogin(pup) || isLoading.value) return
    try {
      await removeFavoriteMutation.mutateAsync({ game })
    } catch {
      // useApi 已處理錯誤提示；onError 會還原 favoriteList cache
    }
  }

  return {
    isLoading,
    addFavorite,
    removeFavorite
  }
}
