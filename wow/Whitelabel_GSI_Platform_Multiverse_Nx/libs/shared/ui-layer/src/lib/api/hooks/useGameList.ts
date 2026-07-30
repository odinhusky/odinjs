import { computed, reactive, toValue, watch, type Ref, type ComputedRef } from "vue"
import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import type { ApiResponse } from "@shared-lib/api/types"
import { getGameList, type GameListParamsType, type GameListResponseType } from "@shared-lib/api/apiFunctions/game_getGameList"
import { TANSTACK_QUERY_KEY_GAME_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

export interface UseGameListParams {
  params: Ref<GameListParamsType | null> | ComputedRef<GameListParamsType | null>
  options?: Omit<UseQueryOptions<unknown, Error, GameListResponseType, unknown[]>, "queryKey" | "queryFn">
}

export function useGameList({
  params,
  options = {}
}: UseGameListParams): UseQueryReturnType<GameListResponseType, Error> {
  // A mutable reactive object that mirrors the current params value.
  // useApiQuery captures this reference in its queryFn closure; because it's a reactive
  // Proxy (not a Ref), reading its properties inside the closure always returns the
  // latest values at the time the query runs.
  const liveParams = reactive<Partial<GameListParamsType>>({})

  watch(
    params,
    (next) => {
      // Wipe stale keys then merge the new params in
      for (const key of Object.keys(liveParams) as (keyof GameListParamsType)[]) {
        delete (liveParams as Partial<GameListParamsType>)[key]
      }
      if (next) Object.assign(liveParams, next)
    },
    { immediate: true }
  )

  // Per-combination cache key — different game/product/tag combos get independent entries
  const queryKey = computed(() => [
    TANSTACK_QUERY_KEY_GAME_LIST,
    toValue(params)?.game_type_id ?? 0,
    toValue(params)?.integration_id ?? 0,
    toValue(params)?.product_code ?? 0,
    toValue(params)?.search_type ?? null
  ])

  return useApiQuery<typeof getGameList, GameListResponseType>(
    // @tanstack/vue-query accepts ComputedRef<QueryKey> for queryKey at runtime;
    // the cast is required because useApiQuery types it as any[] for TypeScript.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryKey as unknown as any[],
    getGameList,
    liveParams as GameListParamsType,
    {
      enabled: computed(() => {
        const p = toValue(params)
        return Boolean(p?.game_type_id && p?.product_code)
      }),
      select: (response: ApiResponse<GameListResponseType>): GameListResponseType => {
        return response.data ?? ([] as unknown as GameListResponseType)
      },
      staleTime: FIVE_MINUTES,
      ...options
    }
  )
}
