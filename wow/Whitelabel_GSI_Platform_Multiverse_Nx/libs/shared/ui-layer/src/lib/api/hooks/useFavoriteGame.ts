import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import { favoriteGame as favoriteGameApi, type FavoriteGameParamsType } from "@shared-lib/api/apiFunctions/game_favoriteGame"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST } from "@shared-lib/constants/tanstackQueryKeys"

export interface UseFavoriteGameOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useFavoriteGame(options: UseFavoriteGameOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(favoriteGameApi, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const favoriteGame = async (payload: FavoriteGameParamsType) => {
    return (await mutation.mutateAsync(payload)) as ApiResponse<unknown>
  }

  return {
    favoriteGame,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
