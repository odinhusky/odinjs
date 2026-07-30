import { useNuxtApp } from "#imports"
import { putReferralSetting, type UpdateReferralSettingParamTypes } from "../apiFunctions/referral_putReferralSetting"
import { useApiMutation } from "../useApiMutation"
import {
  TANSTACK_QUERY_KEY_REFERRAL_SETTING,
  TANSTACK_QUERY_KEY_REFERRAL_SETTING_DETAIL
} from "../../constants/tanstackQueryKeys"

export function useUpdateReferralSettingMutation() {
  const { $queryClient } = useNuxtApp()

  const mutation = useApiMutation(putReferralSetting, {
    onSuccess: async () => {
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_REFERRAL_SETTING] })
      await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_REFERRAL_SETTING_DETAIL] })
    }
  })

  const updateReferralSetting = async (params: UpdateReferralSettingParamTypes) => {
    return mutation.mutateAsync(params)
  }

  return {
    updateReferralSetting,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
