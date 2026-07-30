import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { getSetting, type GetSettingResponseType } from "@shared-lib/api/apiFunctions/setting_getSetting"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { TANSTACK_QUERY_KEY_SETTING } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"
import { useApiQuery } from "@shared-lib/api/useApiQuery"

type SettingSelector<TData> = (setting: GetSettingResponseType) => TData

function useSettingQuery<TData = GetSettingResponseType>({
  selector,
  options = {}
}: {
  selector?: SettingSelector<TData>
  options?: Omit<UseQueryOptions<any, Error, TData, any[]>, "queryKey" | "queryFn" | "select">
}): UseQueryReturnType<TData, Error> {
  const query = useApiQuery<typeof getSetting, GetSettingResponseType, TData>(
    [TANSTACK_QUERY_KEY_SETTING],
    getSetting,
    undefined,
    {
      staleTime: FIVE_MINUTES,
      select: (response: ApiResponse<GetSettingResponseType>): TData => {
        const setting = response.data ?? ({} as GetSettingResponseType)
        return selector ? selector(setting) : (setting as TData)
      },
      ...options
    }
  )

  return query
}

export interface UseSettingParams<TData = GetSettingResponseType> {
  selector?: SettingSelector<TData>
  options?: Omit<UseQueryOptions<any, Error, TData, any[]>, "queryKey" | "queryFn" | "select">
}

export function useSetting<TData = GetSettingResponseType>({ selector, options }: UseSettingParams<TData> = {}) {
  const { data: setting, isLoading, isError, refetch } = useSettingQuery<TData>({ selector, options })

  return {
    setting,
    isLoading,
    isError,
    refetch
  }
}
