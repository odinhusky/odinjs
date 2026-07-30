import { useQueryClient } from "@tanstack/vue-query"
import { getBonusTransferStatus } from "@shared-lib/api/apiFunctions/userInfo_getBonusTransferStatus"
import { postBonusTransfer } from "@shared-lib/api/apiFunctions/userInfo_postBonusTransfer"
import { getSetting } from "@shared-lib/api/apiFunctions/setting_getSetting"
import type {
  BonusTransferStatus,
  BonusWalletTransferRule
} from "@shared-lib/api/commonTypes/bonusWalletTypes"
import { handleJwtAuthError } from "@shared-lib/api/handleApiError"
import { TANSTACK_QUERY_KEY_USER_WALLET_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import {
  isBlockedByLabel,
  parseBonusWalletTransferRule
} from "@shared-lib/utils/bonusWalletTransferRule"
import { useAuth } from "@shared-lib/composables/useAuth"

export interface BonusTransferDialogPayload {
  currencyId: number
}

interface BonusTransferDialogState {
  visible: boolean
  currencyId: number
  isLoading: boolean
  isTransferring: boolean
  status: BonusTransferStatus | null
  rule: BonusWalletTransferRule | null
}

const STATE_KEY = "r017-bonus-transfer-dialog-state"

const createInitialState = (): BonusTransferDialogState => ({
  visible: false,
  currencyId: 0,
  isLoading: false,
  isTransferring: false,
  status: null,
  rule: null
})

const normalizeAmount = (value: string | number | null | undefined): number => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 0
  return n
}

export const useBonusTransferDialog = () => {
  const state = useState<BonusTransferDialogState>(STATE_KEY, createInitialState)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { reset: resetAuth } = useAuth()

  const guardJwt = (response: { code?: number | string | null }): boolean =>
    handleJwtAuthError(response, { resetAuth, router })

  const fetchStatus = async (currencyId: number): Promise<BonusTransferStatus | null> => {
    if (currencyId <= 0) return null
    const response = await getBonusTransferStatus({ currency_id: currencyId })
    if (guardJwt(response)) return null
    return response.status ? response.data : null
  }

  const fetchRule = async (): Promise<BonusWalletTransferRule | null> => {
    const response = await getSetting()
    if (guardJwt(response)) return null
    if (!response.status) return null
    try {
      return parseBonusWalletTransferRule(response.data?.bonus_wallet_transfer_rule)
    } catch (error) {
      console.error("[useBonusTransferDialog] parse rule failed", error)
      return null
    }
  }

  const loadData = async (currencyId: number) => {
    state.value.isLoading = true
    try {
      const [status, rule] = await Promise.all([fetchStatus(currencyId), fetchRule()])
      state.value.status = status
      state.value.rule = rule
    } finally {
      state.value.isLoading = false
    }
  }

  const openBonusTransferDialog = async (payload: BonusTransferDialogPayload) => {
    state.value = {
      ...createInitialState(),
      visible: true,
      currencyId: payload.currencyId
    }
    await loadData(payload.currencyId)
  }

  const closeBonusTransferDialog = () => {
    state.value = createInitialState()
  }

  const refresh = async () => {
    if (state.value.currencyId <= 0) return
    await loadData(state.value.currencyId)
  }

  const computeTransferAmount = (status: BonusTransferStatus | null): number => {
    if (!status) return 0
    return Math.min(
      normalizeAmount(status.reward_wallet_balance),
      normalizeAmount(status.max_transfer_amount)
    )
  }

  interface SubmitResult {
    ok: boolean
    reason?: "blocked_label" | "not_eligible" | "error"
    code?: number
    msg?: string
  }

  const submitTransfer = async (): Promise<SubmitResult> => {
    const status = state.value.status
    const currencyId = state.value.currencyId
    if (!status || currencyId <= 0 || state.value.isTransferring) {
      return { ok: false, reason: "error" }
    }

    const amount = computeTransferAmount(status)
    if (!(status.enabled && status.eligible && amount > 0)) {
      return { ok: false, reason: "not_eligible" }
    }

    state.value.isTransferring = true
    try {
      const response = await postBonusTransfer({ currency_id: currencyId, amount })

      if (guardJwt(response)) {
        return { ok: false, reason: "error", code: response.code, msg: response.msg }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_WALLET_LIST] }),
        loadData(currencyId)
      ])

      if (response.status) {
        return { ok: true, code: response.code, msg: response.msg }
      }

      const refreshedStatus = state.value.status
      if (isBlockedByLabel(refreshedStatus)) {
        return { ok: false, reason: "blocked_label", code: response.code, msg: response.msg }
      }
      if (refreshedStatus && !refreshedStatus.eligible) {
        return { ok: false, reason: "not_eligible", code: response.code, msg: response.msg }
      }
      return { ok: false, reason: "error", code: response.code, msg: response.msg }
    } finally {
      state.value.isTransferring = false
    }
  }

  return {
    state,
    openBonusTransferDialog,
    closeBonusTransferDialog,
    refresh,
    submitTransfer,
    computeTransferAmount
  }
}
