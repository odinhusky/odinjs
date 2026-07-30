<script setup lang="ts">
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import type { GameWalletOption } from "@shared-lib/composables/useGameWalletSelectDialog"

const { state, closeGameWalletSelectDialog, setSelection, confirmGameWalletSelectDialog } =
  useGameWalletSelectDialog()

const isOptionSelected = (option: GameWalletOption) => {
  return (
    state.value.selectedCurrencyCode === option.currencyCode &&
    state.value.selectedWalletType === option.walletType
  )
}

const ICON_BY_WALLET_TYPE: Record<WALLET_TYPE_ENUMS, string> = {
  [WALLET_TYPE_ENUMS.CASH]: "/images/wallet/cash.svg",
  [WALLET_TYPE_ENUMS.REWARD]: "/images/wallet/gift.svg",
  [WALLET_TYPE_ENUMS.BONUS]: "/images/wallet/gift.svg"
}

const iconForWalletType = (walletType: WALLET_TYPE_ENUMS) =>
  ICON_BY_WALLET_TYPE[walletType] || ICON_BY_WALLET_TYPE[WALLET_TYPE_ENUMS.CASH]
</script>

<template>
  <BaseDialog
    :visible="state.visible"
    :class-obj="{
      root: cx(
        'max-w-[600px] !rounded-xl',
        'phone:!w-[calc(100%-32px)] phone:!max-w-[480px] phone:!h-[85dvh] phone:!max-h-[85dvh] phone:!rounded-xl phone:!m-0'
      ),
      header: cx('py-4 px-5 bg-[#301d8a]'),
      title: cx('text-xl'),
      body: cx('px-6 py-5 bg-[#1d125d] min-h-0'),
      closeBtn: cx('top-5 right-5'),
      footer: cx('bg-[#301d8a] !py-4 !px-5')
    }"
    @close="closeGameWalletSelectDialog"
  >
    <template #header>
      <h3 class="text-xl text-white font-bold leading-7 text-center">
        {{ state.title }}
      </h3>
    </template>

    <div :class="cx(FLEX_COL, 'gap-4')">
      <p class="text-base font-semibold leading-6 text-white">{{ state.message }}</p>

      <div :class="cx('rounded-lg p-3 bg-[#000025]', FLEX_COL, 'gap-4 items-start')">
        <div
          v-for="group in state.groups"
          :key="group.currencyCode"
          :class="cx('rounded-lg px-3 py-2 bg-white/[0.06] w-full', FLEX_COL, 'gap-2 items-start')"
        >
          <div class="text-sm font-bold text-white leading-5 w-[50px]">{{ group.currencyCode }}</div>

          <div :class="cx(FLEX_COL, 'gap-2 w-full items-end')">
            <BasePlainBtn
              v-for="option in group.options"
              :key="`${option.currencyCode}-${option.walletType}`"
              :class-obj="{
                button: cx(
                  'w-full rounded-lg px-3 py-2',
                  isOptionSelected(option)
                    ? 'bg-gradient-to-r from-[#f26319] to-[#d12d00] shadow-[-4px_-4px_3px_rgba(255,190,34,0.2),4px_4px_3px_rgba(255,190,34,0.2)]'
                    : 'bg-white/[0.06] border border-white/[0.09] shadow-[0_0_7px_rgba(255,255,255,0.16)]',
                  FLEX_ITEMS_CENTER,
                  'gap-2'
                )
              }"
              @click="setSelection(option)"
            >
              <span
                :class="
                  cx(
                    'w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0',
                    isOptionSelected(option) ? 'border-white' : 'border-white/40'
                  )
                "
              >
                <span v-if="isOptionSelected(option)" class="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              <div :class="cx(FLEX_ITEMS_CENTER, 'gap-1')">
                <img :src="iconForWalletType(option.walletType)" alt="" class="w-3 h-3" />
                <span
                  :class="
                    cx(
                      'text-[10px] leading-normal',
                      isOptionSelected(option) ? 'text-white' : 'text-white/[0.48]'
                    )
                  "
                >
                  {{ option.walletTypeLabel }}
                </span>
              </div>
              <span class="ml-auto text-sm font-bold text-white leading-5">{{ option.balanceLabel }}</span>
            </BasePlainBtn>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-4">
        <button
          type="button"
          class="flex-1 h-12 rounded-lg border border-[#f97316] text-base font-bold text-[#f97316] bg-transparent transition"
          @click="closeGameWalletSelectDialog"
        >
          {{ state.cancelText }}
        </button>
        <button
          type="button"
          class="flex-1 h-12 rounded-lg text-base font-bold text-white bg-gradient-to-r from-[#f97316] to-[#dc2626] shadow-[0_4px_10px_rgba(249,115,22,0.35)]"
          @click="confirmGameWalletSelectDialog"
        >
          {{ state.confirmText }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>
