<script setup lang="ts">
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import type { WalletCardViewModel, WalletCurrencyGroup } from "@shared-lib/composables/useWalletGroups"

interface Props {
  groups: WalletCurrencyGroup[]
  activeCard: WalletCardViewModel | null
}

defineProps<Props>()

defineEmits<{
  (e: "select", card: WalletCardViewModel): void
  (e: "transfer", card: WalletCardViewModel): void
  (e: "one-click-transfer"): void
}>()

const { t, te } = useI18n()

const safeT = (key: string, fallback: string) => (te(key) ? t(key) : fallback)

const ICON_BY_WALLET_TYPE: Record<WALLET_TYPE_ENUMS, string> = {
  [WALLET_TYPE_ENUMS.CASH]: "/images/wallet/cash.svg",
  [WALLET_TYPE_ENUMS.REWARD]: "/images/wallet/gift.svg",
  [WALLET_TYPE_ENUMS.BONUS]: "/images/wallet/gift.svg"
}

const iconForWalletType = (walletType: WALLET_TYPE_ENUMS) =>
  ICON_BY_WALLET_TYPE[walletType] || ICON_BY_WALLET_TYPE[WALLET_TYPE_ENUMS.CASH]
</script>

<template>
  <div
    :class="
      cx(
        'w-[320px] max-h-[80vh] rounded-lg',
        'bg-[#000025]',
        'shadow-[0_0_7.5px_#6d5ce7]',
        FLEX_COL,
        'overflow-hidden'
      )
    "
  >
    <!-- Sticky top: 目前使用中 + divider + 一鍵轉回 -->
    <div
      :class="
        cx('shrink-0 px-2 pt-4 pb-3', FLEX_COL, 'gap-3 items-center')
      "
    >
      <div
        v-if="activeCard"
        :class="
          cx(
            'w-full rounded-lg px-4 py-2',
            'bg-white/20 border border-white/[0.09]',
            FLEX_ITEMS_CENTER,
            'justify-between'
          )
        "
      >
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3 min-w-0')">
          <img src="/images/wallet/wallet-active.svg" alt="" class="w-5 h-5 shrink-0" />
          <div :class="cx(FLEX_COL, 'gap-1 items-start min-w-0')">
            <span class="text-[10px] text-white/[0.48] leading-none font-normal">
              {{ safeT("common.in_use", "目前使用中") }}
            </span>
            <span class="text-sm font-bold text-white leading-none truncate">
              {{ activeCard.walletTypeLabel }}
            </span>
          </div>
        </div>
        <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2 self-stretch shrink-0')">
          <span
            class="h-6 px-2 py-1 rounded-full bg-white/20 inline-flex items-center justify-center text-xs font-bold leading-[18px] text-white"
          >
            {{ activeCard.currencyCode }}
          </span>
          <span class="text-sm font-bold text-white text-right min-w-[76px]">{{ activeCard.balanceLabel }}</span>
        </div>
      </div>

      <div class="h-px w-full bg-white/[0.09]" />

      <!-- 一鍵轉回 -->
      <div class="w-full flex justify-end">
        <BasePlainBtn
          :class-obj="{
            button: cx(
              'h-8 px-3 rounded-lg',
              'bg-gradient-to-b from-[#573edc] to-[#301d8a]',
              FLEX_ITEMS_CENTER,
              'gap-2'
            )
          }"
          @click="$emit('one-click-transfer')"
        >
          <img src="/images/wallet/oneclick-icon.svg" alt="" class="w-5 h-5" />
          <span class="text-base font-bold leading-6 text-white">
            {{ safeT("wallet.oneClickTransferBack", "一鍵轉回") }}
          </span>
        </BasePlainBtn>
      </div>
    </div>

    <!-- Scrollable currency groups -->
    <div
      :class="
        cx(
          'flex-1 overflow-y-auto px-2 pb-4',
          FLEX_COL,
          'gap-3 items-center',
          SCROLLBAR_HIDDEN
        )
      "
    >
      <div v-if="!groups.length" class="w-full p-6 text-center text-sm text-white/40">
        {{ safeT("common.noData", "No Data") }}
      </div>

      <div v-for="group in groups" :key="group.currencyCode" class="w-full">
      <div
        :class="
          cx(
            'rounded-lg px-3 py-2 bg-white/[0.06]',
            FLEX_COL,
            'gap-2 items-start'
          )
        "
      >
        <div class="text-sm font-bold text-white leading-5">{{ group.currencyCode }}</div>

        <div :class="cx(FLEX_COL, 'gap-2 w-full items-end')">
          <template v-for="card in group.cards" :key="`${card.currencyCode}-${card.walletType}`">
            <!-- Active card -->
            <BasePlainBtn
              v-if="card.isActive"
              :class-obj="{
                button: cx(
                  'w-full rounded-lg px-3 py-2',
                  'bg-gradient-to-r from-[#f26319] to-[#d12d00]',
                  'shadow-[-4px_-4px_3px_rgba(255,190,34,0.2),4px_4px_3px_rgba(255,190,34,0.2)]',
                  FLEX_ITEMS_CENTER,
                  'gap-2'
                )
              }"
              @click="$emit('select', card)"
            >
              <span
                class="w-4 h-4 rounded-full border-[1.5px] border-white flex items-center justify-center shrink-0"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              <div :class="cx(FLEX_ITEMS_CENTER, 'gap-1')">
                <img :src="iconForWalletType(card.walletType)" alt="" class="w-3 h-3" />
                <span class="text-[10px] text-white leading-normal">{{ card.walletTypeLabel }}</span>
              </div>
              <span class="ml-auto text-sm font-bold text-white leading-5">{{ card.balanceLabel }}</span>
            </BasePlainBtn>

            <!-- Inactive card -->
            <div
              v-else
              :class="
                cx(
                  'w-full rounded-lg px-3 py-2',
                  'bg-white/[0.06] border border-white/[0.09]',
                  'shadow-[0_0_7px_rgba(255,255,255,0.16)]',
                  FLEX_ITEMS_CENTER,
                  'justify-between gap-2'
                )
              "
            >
              <BasePlainBtn
                :class-obj="{
                  button: cx(FLEX_ITEMS_CENTER, 'gap-2 flex-1 min-w-0 cursor-pointer')
                }"
                @click="$emit('select', card)"
              >
                <span class="w-4 h-4 rounded-full border-[1.5px] border-white/40 shrink-0" />
                <div :class="cx(FLEX_ITEMS_CENTER, 'gap-1')">
                  <img :src="iconForWalletType(card.walletType)" alt="" class="w-3 h-3" />
                  <span class="text-[10px] text-white/[0.48] leading-normal">{{ card.walletTypeLabel }}</span>
                </div>
                <span class="ml-2 text-sm font-bold text-white leading-5">{{ card.balanceLabel }}</span>
              </BasePlainBtn>

              <BasePlainBtn
                v-if="card.canTransferOut"
                :class-obj="{
                  button: cx(
                    'h-6 px-2 rounded-lg',
                    'border border-[#573edc] bg-transparent',
                    FLEX_ITEMS_CENTER,
                    'gap-1 shrink-0'
                  )
                }"
                @click.stop="$emit('transfer', card)"
              >
                <img src="/images/wallet/transfer-out.svg" alt="" class="w-4 h-4" />
                <span class="text-sm font-bold text-[#573edc] leading-5">
                  {{ safeT("cash.transferOut", "轉出") }}
                </span>
              </BasePlainBtn>
            </div>
          </template>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
