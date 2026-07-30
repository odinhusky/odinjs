import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { getFavoriteGameList, type GetFavoriteGameListResponseType } from "@shared-lib/api/apiFunctions/game_getFavoriteGameList"
import { TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"

function useFavoriteGameListQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<any, Error, GetFavoriteGameListResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetFavoriteGameListResponseType, Error> {
  const query = useApiQuery<typeof getFavoriteGameList, GetFavoriteGameListResponseType>(
    [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST],
    getFavoriteGameList,
    undefined,
    {
      select: (response: ApiResponse<GetFavoriteGameListResponseType>): GetFavoriteGameListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )

  return query
}

export interface UseFavoriteGameListParams {
  options?: Omit<UseQueryOptions<any, Error, GetFavoriteGameListResponseType, any[]>, "queryKey" | "queryFn">
}

export function useFavoriteGameList({ options }: UseFavoriteGameListParams = {}) {
  const { data: favoriteGameList, isLoading, isError, refetch } = useFavoriteGameListQuery({ options })

  return {
    favoriteGameList,
    isLoading,
    isError,
    refetch
  }
}
