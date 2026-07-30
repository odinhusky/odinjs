<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "#imports"
import ClaimGiftDialog from "./ClaimGiftDialog.vue"
import { useClaimGiftFlow, type ClaimGiftMockAdapter } from "../../composables/useClaimGiftFlow"

interface ClaimGiftTheme {
  primaryFrom?: string
  primaryTo?: string
  overlayBg?: string
  successCardBg?: string
  successHeaderBg?: string
  badgeBg?: string
  textColor?: string
}

interface Props {
  storageKey: string
  entryImageSrc?: string
  claimImageSrc?: string
  imageAlt?: string
  theme?: ClaimGiftTheme
  mockAdapter?: ClaimGiftMockAdapter
  useMockData?: boolean
  hiddenRoutePaths?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  entryImageSrc: "/images/claim-gift/default-floating-gift.png",
  claimImageSrc: "",
  imageAlt: "",
  theme: () => ({}),
  hiddenRoutePaths: () => []
})

const { t } = useI18n()
const texts = computed(() => ({
  open: t("menu.getMoney"),
  close: t("common.close"),
  claim: t("common.btn.claim"),
  successTitle: t("promotion.congratulations"),
  confirm: t("btn.confirm"),
  rewardPrefix: t("promotion.you_get"),
  pickTitle: t("promotion.pick_and_win")
}))
const resolvedImageAlt = computed(() => props.imageAlt || texts.value.open)
const claimImageSrc = computed(() => props.claimImageSrc || props.entryImageSrc)
const themeStyle = computed(() => ({
  "--claim-gift-badge-bg": props.theme.badgeBg,
  "--claim-gift-entry-text-color": props.theme.textColor
}))

const {
  storageKey,
  badgeCount,
  shouldShowFloatingEntry,
  isDialogVisible,
  isClaiming,
  isSuccessVisible,
  currencyOptions,
  selectedCurrency,
  selectedAmount,
  selectedAmountDisplay,
  claimedAmountDisplay,
  claimedCurrency,
  giftTypeLabel,
  walletTypeLabel,
  openDialog,
  closeDialog,
  confirmSuccess,
  claimCurrentGift
} = useClaimGiftFlow({
  storageKey: props.storageKey,
  hiddenRoutePaths: props.hiddenRoutePaths,
  mockAdapter: props.mockAdapter,
  useMockData: props.useMockData
})
</script>

<template>
  <ClientOnly>
    <div class="claim-gift-floating-entry" :style="themeStyle">
      <BaseFloatingAction
        v-if="shouldShowFloatingEntry"
        :storage-key="storageKey"
        :badge="badgeCount"
        :aria-label="texts.open"
        :size="76"
        :initial-right="24"
        :initial-bottom="132"
        :mobile-bottom-offset="96"
        :class-obj="{
          badge: 'claim-gift-entry-badge'
        }"
        @click="openDialog"
      >
        <img
          :src="entryImageSrc"
          :alt="resolvedImageAlt"
          draggable="false"
          class="claim-gift-entry-image h-full w-full object-contain"
        >
      </BaseFloatingAction>

      <ClaimGiftDialog
        v-model:visible="isDialogVisible"
        v-model:selected-currency="selectedCurrency"
        :badge-count="badgeCount"
        :gift-type-label="giftTypeLabel"
        :wallet-type-label="walletTypeLabel"
        :selected-amount="selectedAmount"
        :selected-amount-display="selectedAmountDisplay"
        :claimed-amount-display="claimedAmountDisplay"
        :claimed-currency="claimedCurrency"
        :currency-options="currencyOptions"
        :image-src="claimImageSrc"
        :image-alt="resolvedImageAlt"
        :texts="texts"
        :theme="theme"
        :is-claiming="isClaiming"
        :is-success-visible="isSuccessVisible"
        @claim="claimCurrentGift"
        @close="closeDialog"
        @success-confirm="confirmSuccess"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.claim-gift-entry-image {
  animation: claim-gift-entry-float 2.6s ease-in-out infinite;
}

:deep(.claim-gift-entry-badge) {
  background: var(--claim-gift-badge-bg, var(--message-message-bg-negative));
  color: var(--claim-gift-entry-text-color, var(--brand-brand-text));
}

@keyframes claim-gift-entry-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.02);
  }
}
</style>
