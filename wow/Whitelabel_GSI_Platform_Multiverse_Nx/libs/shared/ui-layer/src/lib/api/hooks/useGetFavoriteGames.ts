import type { ApiResponse } from "@shared-lib/api/types"
import { getFavoriteGameList, type GetFavoriteGameListResponseType } from "@shared-lib/api/apiFunctions/game_getFavoriteGameList"
import { useApiMutation } from "@shared-lib/api/useApiMutation"

export interface UseGetFavoriteGamesOptions {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useGetFavoriteGames(options: UseGetFavoriteGamesOptions = {}) {
  const mutation = useApiMutation(getFavoriteGameList, {
    onSuccess: async () => {
      await options.onSuccess?.()
    },
    onError: async (error: Error) => {
      await options.onError?.(error)
    }
  })

  const getFavoriteGames = async () => {
    return (await mutation.mutateAsync(undefined)) as ApiResponse<GetFavoriteGameListResponseType>
  }

  return {
    getFavoriteGames,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
