import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import {
  getGameTypeList,
  type GetGameTypeListResponseType,
  type GameTypeItem
} from "@shared-lib/api/apiFunctions/game_getGameTypeList"
import { GAME_TYPE_I18N_KEYS, FrontendKey, GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import { TANSTACK_QUERY_KEY_GAME_TYPE_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

export interface GameTypeStateItem extends GameTypeItem {
  label: string
  frontendKey: string
}

export interface GameTypeState {
  list: GameTypeStateItem[]
  map: Record<number, GameTypeStateItem>
}

export const toGameTypeState = (list: GetGameTypeListResponseType): GameTypeState => {
  const tempList: GameTypeStateItem[] = []
  const tempMap: Record<number, GameTypeStateItem> = {}

  list.forEach((item) => {
    const id = Number(item.id)
    if (!Number.isFinite(id)) return

    const enumId = id as GAME_TYPE_ENUMS
    const obj: GameTypeStateItem = {
      ...item,
      id: enumId,
      label: GAME_TYPE_I18N_KEYS[enumId] || "",
      frontendKey: FrontendKey[enumId] || ""
    }

    tempList.push(obj)
    tempMap[id] = obj
  })

  return {
    list: tempList,
    map: tempMap
  }
}

export type GameTypeListApiResponse = Awaited<ReturnType<typeof getGameTypeList>>

interface UseGameTypeListParams<TData> {
  options?: Omit<UseQueryOptions<GameTypeListApiResponse, Error, TData, unknown[]>, "queryKey" | "queryFn">
}

function useGameTypeListQuery<TData = GameTypeListApiResponse>({
  options = {}
}: UseGameTypeListParams<TData>): UseQueryReturnType<TData, Error> {
  return useApiQuery<typeof getGameTypeList, GameTypeListApiResponse, TData>(
    [TANSTACK_QUERY_KEY_GAME_TYPE_LIST],
    getGameTypeList,
    undefined,
    {
      staleTime: 5 * 60 * 1000,
      ...options
    }
  )
}

export function useGameTypeList<TData = GameTypeListApiResponse>({ options }: UseGameTypeListParams<TData> = {}) {
  const { data, isLoading, isError, isFetching, refetch } = useGameTypeListQuery<TData>({ options })

  return {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  }
}
