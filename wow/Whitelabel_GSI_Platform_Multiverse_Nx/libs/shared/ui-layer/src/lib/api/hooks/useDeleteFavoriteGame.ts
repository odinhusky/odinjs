import { useNuxtApp } from "#imports"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  deleteFavoriteGame as deleteFavoriteGameApi,
  type DeleteFavoriteGameParamsType
} from "@shared-lib/api/apiFunctions/game_deleteFavoriteGame"
import { useApiMutation } from "@shared-lib/api/useApiMutation"
import { TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST } from "@shared-lib/constants/tanstackQueryKeys"

export interface UseDeleteFavoriteGameOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useDeleteFavoriteGame(options: UseDeleteFavoriteGameOptions = {}) {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(deleteFavoriteGameApi, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST] })
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const deleteFavoriteGame = async (payload: DeleteFavoriteGameParamsType) => {
    return (await mutation.mutateAsync(payload)) as ApiResponse<unknown>
  }

  return {
    deleteFavoriteGame,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
