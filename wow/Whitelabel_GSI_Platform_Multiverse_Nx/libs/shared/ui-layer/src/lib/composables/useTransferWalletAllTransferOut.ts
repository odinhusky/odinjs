import { useQueryClient } from "@tanstack/vue-query"
import {
  postAllTransferOut,
  type AllTransferOutItem
} from "@shared-lib/api/apiFunctions/game_postAllTransferOut"
import { handleJwtAuthError } from "@shared-lib/api/handleApiError"
import { TANSTACK_QUERY_KEY_USER_WALLET_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { useAuth } from "@shared-lib/composables/useAuth"

interface DialogState {
  visible: boolean
  isSubmitting: boolean
}

const STATE_KEY = "r017-transfer-wallet-all-transfer-out-state"

const createInitialState = (): DialogState => ({
  visible: false,
  isSubmitting: false
})

export type AllTransferOutResultKind =
  | "all_success"
  | "partial_failed"
  | "all_failed"
  | "empty"
  | "request_failed"

export interface AllTransferOutResult {
  kind: AllTransferOutResultKind
  successCount: number
  failedCount: number
  failedItems: AllTransferOutItem[]
  /** Top-level API response msg, or first failure message. */
  message?: string
  code?: number
}

const summarizeResponseData = (data: AllTransferOutItem[] | null | undefined): {
  successCount: number
  failedCount: number
  failedItems: AllTransferOutItem[]
} => {
  if (!Array.isArray(data)) {
    return { successCount: 0, failedCount: 0, failedItems: [] }
  }
  const failedItems = data.filter((item) => (item?.code ?? 0) !== 0)
  const successCount = data.length - failedItems.length
  return {
    successCount,
    failedCount: failedItems.length,
    failedItems
  }
}

export const useTransferWalletAllTransferOut = () => {
  const state = useState<DialogState>(STATE_KEY, createInitialState)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { reset: resetAuth } = useAuth()

  const openAllTransferOutDialog = () => {
    state.value = { ...createInitialState(), visible: true }
  }

  const closeAllTransferOutDialog = () => {
    if (state.value.isSubmitting) return
    state.value = createInitialState()
  }

  const submitAllTransferOut = async (): Promise<AllTransferOutResult> => {
    if (state.value.isSubmitting) {
      return { kind: "request_failed", successCount: 0, failedCount: 0, failedItems: [] }
    }
    state.value.isSubmitting = true
    try {
      const response = await postAllTransferOut()

      if (handleJwtAuthError(response, { resetAuth, router })) {
        return {
          kind: "request_failed",
          successCount: 0,
          failedCount: 0,
          failedItems: [],
          message: response.msg,
          code: response.code
        }
      }

      await queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_WALLET_LIST] })

      if (!response.status) {
        return {
          kind: "request_failed",
          successCount: 0,
          failedCount: 0,
          failedItems: [],
          message: response.msg,
          code: response.code
        }
      }

      const data = response.data
      if (!Array.isArray(data) || data.length === 0) {
        return {
          kind: "empty",
          successCount: 0,
          failedCount: 0,
          failedItems: [],
          code: response.code
        }
      }

      const { successCount, failedCount, failedItems } = summarizeResponseData(data)

      if (failedCount === 0) {
        return { kind: "all_success", successCount, failedCount: 0, failedItems: [] }
      }
      if (successCount === 0) {
        return {
          kind: "all_failed",
          successCount: 0,
          failedCount,
          failedItems,
          message: failedItems[0]?.message
        }
      }
      return {
        kind: "partial_failed",
        successCount,
        failedCount,
        failedItems,
        message: failedItems[0]?.message
      }
    } finally {
      state.value.isSubmitting = false
    }
  }

  return {
    state,
    openAllTransferOutDialog,
    closeAllTransferOutDialog,
    submitAllTransferOut
  }
}
