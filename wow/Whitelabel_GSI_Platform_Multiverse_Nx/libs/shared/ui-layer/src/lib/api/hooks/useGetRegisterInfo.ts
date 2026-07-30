import {
  registInputCustom,
  RegisterInputCustomParamsType,
  RegistInputCustomResponseType
} from "@shared-lib/api/apiFunctions/auth_registerCustomInput"

import { useApiQuery } from "@shared-lib/api/useApiQuery"
import type { UseQueryReturnType, UseQueryOptions } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { TANSTACK_QUERY_KEY_REGISTER_INFO_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import type { ApiResponse } from "@shared-lib/api/types"

function useGetRegisterInfoQuery({
  params,
  options = {}
}: {
  params: RegisterInputCustomParamsType
  options?: Omit<UseQueryOptions<any, Error, RegistInputCustomResponseType, any[]>, "queryKey" | "queryFn">
}): UseQueryReturnType<RegistInputCustomResponseType, Error> {
  const query = useApiQuery<typeof registInputCustom, RegistInputCustomResponseType>(
    [TANSTACK_QUERY_KEY_REGISTER_INFO_LIST, params.type, params.mode ?? ""],
    registInputCustom,
    params,
    {
      staleTime: FIVE_MINUTES,
      select: (response: ApiResponse<RegistInputCustomResponseType>): RegistInputCustomResponseType => {
        return response.data ?? []
      },
      ...options
    }
  )

  return query
}

export interface UseGetRegisterInfoParams {
  params?: RegisterInputCustomParamsType
  options?: Omit<UseQueryOptions<any, Error, RegistInputCustomResponseType, any[]>, "queryKey" | "queryFn">
}

export function useGetRegisterInfo({ params = { type: "register" }, options = {} }: UseGetRegisterInfoParams = {}) {
  const { data: registerInfoList, isLoading, isError, refetch } = useGetRegisterInfoQuery({ params, options })

  return {
    registerInfoList,
    isLoading,
    isError,
    refetch
  }
}
