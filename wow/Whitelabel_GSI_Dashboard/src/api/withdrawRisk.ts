import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import type { MaybeRefOrGetter } from "vue"
import { computed, toValue } from "vue"
import { get, put } from "@/utils/request"

export type WithdrawRiskGlobalRules = {
  is_first_withdrawal: boolean
  is_bonus_before: boolean
  is_withdrawal_gt_deposit: boolean
  is_amount_threshold: boolean
  withdrawal_amount_threshold: string
}

/** GET 回傳的群組列；id 僅供前端表格 row-key / 跨列互斥對照 */
export type WithdrawRiskGroup = {
  id: number
  level_ids: number[]
  label_ids: number[]
  rules: WithdrawRiskGlobalRules
}

/** PUT 送出群組；後端每次刪除舊群組後重建，不沿用 id */
export type WithdrawRiskGroupPayload = {
  level_ids: number[]
  label_ids: number[]
  rules: WithdrawRiskGlobalRules
}

export type GetWithdrawRiskResponse = {
  currency_id: number
  is_enabled: boolean
  global_rules: WithdrawRiskGlobalRules | null
  groups: WithdrawRiskGroup[]
}

export type SetWithdrawRiskRequest = {
  currency_id: number
  is_enabled: boolean
  global_rules: WithdrawRiskGlobalRules
  groups: WithdrawRiskGroupPayload[]
}

const QueryKey = "/platform/v1/agent/withdraw/risk"

export function useWithdrawRiskQuery(currencyId: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: computed(() => [QueryKey, toValue(currencyId)] as const),
    queryFn: async () => {
      const currency_id = toValue(currencyId)
      const res = await get<GetWithdrawRiskResponse>(
        `withdraw/risk`,
        { currency_id },
        {
          name: "getRisk",
          usePlatform: true
        }
      )
      if (res.code !== 0 || !res.data) {
        throw new Error(res.msg || "getWithdrawRisk failed")
      }
      return res.data
    },
    enabled: computed(() => toValue(currencyId) > 0)
  })
}

export function useSetWithdrawRiskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: SetWithdrawRiskRequest) => {
      const res = await put(`withdraw/risk`, params, { name: "setRisk", usePlatform: true })
      if (res.code !== 0) {
        throw new Error(res.msg || "setWithdrawRisk failed")
      }
      return res
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey, variables.currency_id] })
    }
  })
}
