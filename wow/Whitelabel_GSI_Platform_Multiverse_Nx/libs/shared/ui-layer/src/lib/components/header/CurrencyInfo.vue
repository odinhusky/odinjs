<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { setUserActiveWallet } from "@shared-lib/api/apiFunctions/userInfo_setUserActiveWallet"
import { TANSTACK_QUERY_KEY_USER_WALLET_LIST } from "@shared-lib/constants/tanstackQueryKeys"
import { formatMoney } from "@shared-lib/utils/formatMoney"
import { useQueryClient } from "@tanstack/vue-query"
import type { WalletCardViewModel } from "@shared-lib/composables/useWalletGroups"

const { walletList } = useCurrencyInfo()
const { t } = useI18n()
const queryClient = useQueryClient()
const { openBonusTransferDialog } = useBonusTransferDialog()
const { openAllTransferOutDialog } = useTransferWalletAllTransferOut()

const { groups, activeCard } = useWalletGroups({
  walletList,
  t
})

const displayBalance = computed(() => {
  const val = Number(activeCard.value?.balance ?? 0)
  if (Number.isNaN(val)) return "0.00"
  return formatMoney(val)
})

const displayCurrency = computed(() => activeCard.value?.currencyCode || "")

const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  handleGlobalClick({
    target: "handleHeaderWalletDropdownToggle",
    debounceTimer: 150,
    callback: () => {
      isOpen.value = !isOpen.value
    }
  })
}

const handleSelectCard = async (card: WalletCardViewModel) => {
  isOpen.value = false
  try {
    await setUserActiveWallet({
      currency_id: card.currencyId,
      wallet_type: card.walletType
    })
  } finally {
    await queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_USER_WALLET_LIST] })
  }
}

const handleTransfer = async (card: WalletCardViewModel) => {
  isOpen.value = false
  await openBonusTransferDialog({ currencyId: card.currencyId })
}

const handleOneClickTransfer = () => {
  // 一鍵轉回 = 轉帳錢包 all_transfer_out（spec: transfer-wallet-all-transfer-out.md）
  // 不是贈金錢包轉出，不可接 openBonusTransferDialog。
  isOpen.value = false
  openAllTransferOutDialog()
}

const handleWalletBtnClick = () => {
  handleGlobalClick({
    target: "handleHeaderWalletBtnClick",
    debounceTimer: 250,
    callback: async () => {
      await navigateTo(ROUTE_PATH.DEPOSIT)
    }
  })
}

onMounted(() => {
  const onDocClick = (event: MouseEvent) => {
    if (!isOpen.value) return
    const target = event.target as Node
    if (!wrapperRef.value?.contains(target)) {
      isOpen.value = false
    }
  }
  document.addEventListener("click", onDocClick)
  onUnmounted(() => document.removeEventListener("click", onDocClick))
})
</script>

<template>
  <div ref="wrapperRef" class="relative">
    <div :class="cx(FLEX_ITEMS_CENTER, 'h-12 phone:h-8', 'rounded-lg')">
      <BasePlainBtn
        :class-obj="{
          button: cx(
            FLEX_ITEMS_CENTER,
            'gap-2 h-full px-3 phone:px-2',
            'bg-[var(--card-card-bg-secondary-enabled)] rounded-l-lg',
            'cursor-pointer'
          )
        }"
        @click="toggleDropdown"
      >
        <img src="/images/wallet/wallet-active.svg" alt="" class="w-5 h-5 phone:w-4 phone:h-4 shrink-0" />
        <span
          :class="
            cx(
              'text-sm leading-none font-bold text-[var(--text-text-primary)]',
              'max-w-[140px] truncate'
            )
          "
        >
          {{ displayBalance }}
        </span>
        <span
          :class="
            cx(
              'text-white/[0.48] font-bold text-sm leading-none capitalize'
            )
          "
        >
          {{ displayCurrency }}
        </span>
        <BaseIcon
          name="mdi:chevron-right"
          size="1.25rem"
          :class="
            cx('text-white transition-transform', {
              'rotate-90': isOpen
            })
          "
        />
      </BasePlainBtn>

      <BaseBtn
        :class-obj="{ button: cx('p-3 phone:px-2 phone:py-3', 'h-full', 'rounded-tl-none rounded-bl-none') }"
        @click="handleWalletBtnClick"
      >
        <div :class="FLEX_CENTER">
          <span :class="cx('phone:hidden', 'text-base leading-6 text-[var(--button-button-title-primary-enabled)]')">
            Ｗallet
          </span>
          <BaseIcon
            name="ph:money"
            size="1.25rem"
            class="text-[var(--button-button-icon-primary-enabled)] hidden phone:inline-block"
          />
        </div>
      </BaseBtn>
    </div>

    <div
      v-if="isOpen"
      :class="
        cx(
          'absolute z-30 top-[calc(100%+8px)]',
          'right-0',
          'phone:right-auto phone:left-1/2 phone:-translate-x-1/2 phone:fixed phone:top-[64px]'
        )
      "
    >
      <WalletDropdownPanel
        :groups="groups"
        :active-card="activeCard"
        @select="handleSelectCard"
        @transfer="handleTransfer"
        @one-click-transfer="handleOneClickTransfer"
      />
    </div>
  </div>
</template>
