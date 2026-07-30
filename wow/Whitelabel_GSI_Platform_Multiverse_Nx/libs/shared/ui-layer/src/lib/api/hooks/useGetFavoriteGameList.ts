import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import {
  getFavoriteGameList as getFavoriteGameListApi,
  type GetFavoriteGameListResponseType
} from "@shared-lib/api/apiFunctions/game_getFavoriteGameList"
import { TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

function useGetFavoriteGameListQuery({
  options = {}
}: {
  options?: Omit<UseQueryOptions<unknown, Error, GetFavoriteGameListResponseType, unknown[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<GetFavoriteGameListResponseType, Error> {
  return useApiQuery<typeof getFavoriteGameListApi, GetFavoriteGameListResponseType>(
    [TANSTACK_QUERY_KEY_FAVORITE_GAME_LIST],
    getFavoriteGameListApi,
    undefined,
    {
      enabled: false,
      select: (response: ApiResponse<GetFavoriteGameListResponseType>): GetFavoriteGameListResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )
}

export interface UseGetFavoriteGameListParams {
  options?: Omit<UseQueryOptions<unknown, Error, GetFavoriteGameListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useGetFavoriteGameList({ options }: UseGetFavoriteGameListParams = {}) {
  const {
    data: favoriteGameList,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetFavoriteGameListQuery({ options })

  return {
    favoriteGameList,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  }
}
