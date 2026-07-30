import { useClaimGiftFlow } from "@shared-src/lib/composables/useClaimGiftFlow"
import { claimGiftMockAdapter } from "./mockData"

export const FLOATING_GIFT_STORAGE_KEY = "r017.claimGift.floatingPosition"

export const useR017ClaimGift = () => {
  const flow = useClaimGiftFlow({
    storageKey: FLOATING_GIFT_STORAGE_KEY,
    mockAdapter: claimGiftMockAdapter
  })

  return {
    FLOATING_GIFT_STORAGE_KEY,
    ...flow
  }
}
