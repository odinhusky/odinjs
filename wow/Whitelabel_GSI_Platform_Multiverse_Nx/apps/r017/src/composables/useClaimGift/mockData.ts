import { reactive } from "vue"
import { CLAIM_GIFT_TYPE_ENUMS } from "@shared-src/lib/constants/enums/claimGiftType"
import { PENDING_STATUS_ENUMS } from "@shared-src/lib/constants/enums/pendingStatus"
import { WALLET_TYPE_ENUMS } from "@shared-src/lib/constants/enums/walletType"
import { useWalletStore } from "@shared-src/lib/stores/wallet"
import type { ClaimGiftParamsType } from "@shared-src/lib/api/apiFunctions/gift_claimGift"
import type { GiftList } from "@shared-src/lib/api/apiFunctions/gift_getGiftList"

export const createClaimGiftMockList = (): GiftList => {
  const manyGifts: GiftList = Array.from({ length: 95 }, (_, index) => ({
    id: 9000 + index,
    type: index % 2 === 0 ? CLAIM_GIFT_TYPE_ENUMS.LEVEL_UP : CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY,
    wallet_type: WALLET_TYPE_ENUMS.CASH,
    status: PENDING_STATUS_ENUMS.PENDING,
    options: [
      {
        amount: String(50 + index),
        currency_id: 1,
        currency_code: "USD"
      }
    ]
  }))

  return [
    {
      id: 8801,
      type: CLAIM_GIFT_TYPE_ENUMS.LEVEL_UP,
      wallet_type: WALLET_TYPE_ENUMS.CASH,
      status: PENDING_STATUS_ENUMS.PENDING,
      options: [
        { amount: "1.00", currency_id: 1, currency_code: "USD" },
        { amount: "2.00", currency_id: 2, currency_code: "CNY" },
        { amount: "888.00", currency_id: 3, currency_code: "PHP" }
      ]
    },
    {
      id: 8802,
      type: CLAIM_GIFT_TYPE_ENUMS.BIRTHDAY,
      wallet_type: WALLET_TYPE_ENUMS.REWARD,
      status: PENDING_STATUS_ENUMS.PENDING,
      options: [{ amount: "88.00", currency_id: 1, currency_code: "USD" }]
    },
    ...manyGifts
  ]
}

export const claimGiftMockStore = reactive({
  initialized: false,
  gifts: [] as GiftList
})

export const ensureClaimGiftMockInitialized = () => {
  if (claimGiftMockStore.initialized) return
  claimGiftMockStore.gifts = createClaimGiftMockList()
  claimGiftMockStore.initialized = true
}

const sumMockBalance = (balance: string, amount: string) => {
  const nextBalance = Number(balance || 0) + Number(amount || 0)
  return Number.isFinite(nextBalance) ? nextBalance.toFixed(2) : balance
}

const increaseClaimedWalletBalance = ({
  amount,
  currencyCode
}: {
  amount: string
  currencyCode: string
}) => {
  const walletStore = useWalletStore()
  let hasMatchedWallet = false

  const nextWalletList = walletStore.walletList.map((wallet) => {
    if (String(wallet.currency_code).toUpperCase() !== currencyCode.toUpperCase()) {
      return wallet
    }

    hasMatchedWallet = true

    return {
      ...wallet,
      balance: sumMockBalance(wallet.balance, amount),
      withdrawable_balance: sumMockBalance(wallet.withdrawable_balance, amount)
    }
  })

  if (hasMatchedWallet) {
    walletStore.setWalletList(nextWalletList)
  }
}

export const claimGiftMockGift = (payload: ClaimGiftParamsType) => {
  claimGiftMockStore.gifts = claimGiftMockStore.gifts.filter((gift) => {
    if (Number(gift.id) !== Number(payload.gift_id)) return true

    const claimedOption = gift.options.find(
      (option) => Number(option.currency_id) === Number(payload.currency)
        && Number(option.amount) === Number(payload.amount)
    )

    if (!claimedOption) return true

    increaseClaimedWalletBalance({
      amount: claimedOption.amount,
      currencyCode: claimedOption.currency_code
    })

    return false
  })
}

export const claimGiftMockAdapter = {
  ensureInitialized: ensureClaimGiftMockInitialized,
  getGiftList: () => claimGiftMockStore.gifts,
  claimGift: claimGiftMockGift
}
