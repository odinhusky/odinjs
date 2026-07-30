<script setup lang="ts">
import { computed } from "vue"
import BaseSelect from "../base/BaseSelect.vue"

interface CurrencyOption {
  label: string
  value: string
}

interface ClaimGiftTheme {
  primaryFrom?: string
  primaryTo?: string
  overlayBg?: string
  successCardBg?: string
  successHeaderBg?: string
  badgeBg?: string
  textColor?: string
}

interface ClaimGiftTexts {
  close: string
  claim: string
  successTitle: string
  confirm: string
  rewardPrefix: string
  pickTitle: string
}

interface Props {
  visible: boolean
  badgeCount: number
  giftTypeLabel: string
  walletTypeLabel: string
  selectedCurrency: string
  selectedAmount: string
  selectedAmountDisplay: string
  claimedAmountDisplay: string
  claimedCurrency: string
  currencyOptions: CurrencyOption[]
  imageSrc: string
  imageAlt: string
  texts: ClaimGiftTexts
  theme?: ClaimGiftTheme
  isClaiming?: boolean
  isSuccessVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({}),
  isClaiming: false,
  isSuccessVisible: false
})

const emit = defineEmits<{
  "update:visible": [value: boolean]
  "update:selectedCurrency": [value: string]
  claim: []
  close: []
  successConfirm: []
}>()

const coinDrops = [
  { left: "7%", top: "36%", size: "70px", delay: "0ms", duration: "1900ms", drift: "-18px" },
  { left: "16%", top: "28%", size: "58px", delay: "180ms", duration: "2100ms", drift: "20px" },
  { left: "31%", top: "17%", size: "64px", delay: "320ms", duration: "1800ms", drift: "-14px" },
  { left: "43%", top: "52%", size: "54px", delay: "80ms", duration: "2000ms", drift: "12px" },
  { left: "54%", top: "24%", size: "38px", delay: "260ms", duration: "2200ms", drift: "-14px" },
  { left: "69%", top: "17%", size: "64px", delay: "420ms", duration: "1900ms", drift: "18px" },
  { left: "80%", top: "46%", size: "62px", delay: "120ms", duration: "2050ms", drift: "-12px" },
  { left: "92%", top: "34%", size: "58px", delay: "520ms", duration: "2300ms", drift: "14px" },
  { left: "75%", top: "64%", size: "76px", delay: "640ms", duration: "1850ms", drift: "14px" }
]

const modelVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value)
})

const isShowingClaimedCurrency = computed(() => Boolean(props.claimedCurrency && props.claimedCurrency === props.selectedCurrency))
const hasMultipleCurrencies = computed(() => props.currencyOptions.length > 1)
const rewardCurrency = computed(() => (isShowingClaimedCurrency.value ? props.claimedCurrency : props.selectedCurrency))
const rewardAmount = computed(() =>
  isShowingClaimedCurrency.value ? props.claimedAmountDisplay || props.selectedAmountDisplay : props.selectedAmountDisplay
)
const themeStyle = computed(() => ({
  "--claim-gift-primary-from": props.theme.primaryFrom,
  "--claim-gift-primary-to": props.theme.primaryTo,
  "--claim-gift-overlay-bg": props.theme.overlayBg,
  "--claim-gift-success-card-bg": props.theme.successCardBg,
  "--claim-gift-success-header-bg": props.theme.successHeaderBg,
  "--claim-gift-badge-bg": props.theme.badgeBg,
  "--claim-gift-text-color": props.theme.textColor
}))

const handleClose = () => {
  modelVisible.value = false
  emit("close")
}

const updateSelectedCurrency = (value: string) => {
  emit("update:selectedCurrency", value)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="claim-gift-overlay">
      <div v-if="visible" :class="['claim-gift-overlay', { 'claim-gift-overlay--success': isSuccessVisible }]" :style="themeStyle">
        <div class="claim-gift-claim-stage">
          <button class="claim-gift-stage-close" type="button" :aria-label="texts.close" @click="handleClose">
            ×
          </button>

          <div class="claim-gift-coins" aria-hidden="true">
            <span
              v-for="(coin, index) in coinDrops"
              :key="index"
              class="claim-gift-coin"
              :style="{
                '--coin-left': coin.left,
                '--coin-top': coin.top,
                '--coin-size': coin.size,
                '--coin-delay': coin.delay,
                '--coin-duration': coin.duration,
                '--coin-drift': coin.drift
              }"
            />
          </div>

          <div class="claim-gift-pick-card" :aria-hidden="isSuccessVisible">
            <div class="claim-gift-title">{{ texts.pickTitle }}</div>

            <button
              class="claim-gift-present-wrap"
              type="button"
              :disabled="isClaiming || isSuccessVisible"
              :aria-label="texts.claim"
              @click="emit('claim')"
            >
              <img :src="imageSrc" :alt="imageAlt" draggable="false" class="claim-gift-present">
              <span class="claim-gift-count">{{ badgeCount }}</span>
            </button>

            <button
              class="claim-gift-primary-button"
              type="button"
              :disabled="isClaiming || isSuccessVisible"
              @click="emit('claim')"
            >
              {{ texts.claim }}
            </button>
          </div>

          <Transition name="claim-gift-panel">
            <div
              v-if="isSuccessVisible"
              class="claim-gift-success-card claim-gift-success-panel"
              role="dialog"
              aria-modal="true"
            >
              <div class="claim-gift-success-header">
                <span>{{ texts.successTitle }}</span>
                <button class="claim-gift-close-button" type="button" :aria-label="texts.close" @click="handleClose">
                  ×
                </button>
              </div>

              <div class="claim-gift-success-body">
                <div v-if="hasMultipleCurrencies" class="claim-gift-currency-row">
                  <BaseSelect
                    :model-value="selectedCurrency"
                    :options="currencyOptions"
                    option-label="label"
                    option-value="value"
                    :disabled="isClaiming"
                    :class-obj="{
                      wrapper: 'gap-0',
                      select:
                        '!min-h-[48px] !h-[48px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)] !text-white',
                      selectLabel: '!py-0 !pl-4 !pr-0 !text-base !leading-[46px] !text-white',
                      dropdown: '!ml-auto !mr-3 !w-6 !text-white',
                      panel: '!z-[1205] !bg-[var(--select-select-bg-secondary-enabled)] !border-[var(--brand-brand-secondary-contrast)] !rounded-md !shadow-xl',
                      item: '!h-9 !px-4 !py-0 !text-sm !text-white'
                    }"
                    @update:model-value="updateSelectedCurrency(String($event || ''))"
                  />
                </div>

                <p class="claim-gift-reward-text">
                  {{ texts.rewardPrefix }} <strong>{{ rewardAmount }}</strong> {{ rewardCurrency }}
                </p>
              </div>

              <div class="claim-gift-success-footer">
                <button
                  class="claim-gift-primary-button"
                  type="button"
                  :disabled="isClaiming"
                  @click="emit('successConfirm')"
                >
                  {{ texts.confirm }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.claim-gift-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--claim-gift-overlay-bg, var(--surface-surface-container-mask));
}

.claim-gift-overlay--success .claim-gift-coins,
.claim-gift-overlay--success .claim-gift-pick-card,
.claim-gift-overlay--success .claim-gift-stage-close {
  display: none;
}

.claim-gift-claim-stage {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
}

.claim-gift-pick-card {
  position: absolute;
  top: clamp(270px, 35vh, 380px);
  left: 50%;
  z-index: 2;
  display: flex;
  width: 260px;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.claim-gift-title {
  position: relative;
  z-index: 2;
  margin-bottom: 4px;
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  font-size: 36px;
  font-weight: 900;
  line-height: 44px;
  text-align: center;
  text-shadow: 0 2px 8px rgb(0 0 0 / 55%);
}

.claim-gift-stage-close {
  position: absolute;
  top: clamp(250px, 32vh, 350px);
  left: calc(50% + 152px);
  z-index: 3;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgb(255 255 255 / 72%);
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
  transition:
    background 160ms ease,
    transform 160ms ease,
    opacity 160ms ease;
}

.claim-gift-stage-close:hover {
  background: rgb(255 255 255 / 10%);
  color: var(--brand-brand-text);
}

.claim-gift-stage-close:active {
  transform: scale(0.96);
}

.claim-gift-present-wrap {
  position: relative;
  display: grid;
  width: 210px;
  height: 196px;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
  filter: drop-shadow(0 18px 26px rgb(255 60 220 / 26%));
  padding: 0;
  transition:
    filter 160ms ease,
    transform 160ms ease,
    opacity 160ms ease;
}

.claim-gift-present-wrap:hover:not(:disabled) {
  filter:
    brightness(1.08)
    drop-shadow(0 18px 26px rgb(255 60 220 / 32%));
}

.claim-gift-present-wrap:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}

.claim-gift-present-wrap:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.claim-gift-present {
  width: 210px;
  height: 210px;
  object-fit: contain;
  animation: claim-gift-present-float 2.4s ease-in-out infinite;
}

.claim-gift-count {
  position: absolute;
  top: 30px;
  right: -6px;
  display: grid;
  min-width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 999px;
  background: var(--claim-gift-badge-bg, var(--message-message-bg-negative));
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 2px 6px rgb(0 0 0 / 35%);
}

.claim-gift-primary-button {
  width: 240px;
  height: 36px;
  border: 0;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--claim-gift-primary-from, var(--button-button-bg-primary-left-enabled)) 0%,
    var(--claim-gift-primary-to, var(--button-button-bg-primary-right-enabled)) 100%
  );
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  transition:
    filter 160ms ease,
    transform 160ms ease,
    opacity 160ms ease;
}

.claim-gift-pick-card > .claim-gift-primary-button {
  margin-top: 14px;
}

.claim-gift-primary-button:hover:not(:disabled) {
  filter: brightness(1.08);
}

.claim-gift-primary-button:active:not(:disabled) {
  transform: translateY(1px);
}

.claim-gift-primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.claim-gift-coins {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(100vw, 1360px);
  height: 100%;
  pointer-events: none;
  transform: translateX(-50%);
}

.claim-gift-coin {
  position: absolute;
  top: var(--coin-top);
  left: var(--coin-left);
  width: var(--coin-size);
  height: var(--coin-size);
  border: 4px solid #ffef6a;
  border-radius: 999px;
  background:
    radial-gradient(circle at 35% 28%, #fff8a5 0 9%, transparent 10%),
    radial-gradient(circle, #ffd83d 0 44%, #ff9f1a 45% 64%, #f87414 65% 100%);
  box-shadow:
    inset 0 0 0 4px rgb(255 255 255 / 24%),
    0 4px 8px rgb(0 0 0 / 32%);
  animation: claim-gift-coin-fall var(--coin-duration) ease-in-out var(--coin-delay) infinite;
}

.claim-gift-coin::before {
  position: absolute;
  inset: 18%;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgb(255 244 95 / 72%);
  color: #ff9a16;
  content: "$";
  font-size: calc(var(--coin-size) * 0.36);
  font-weight: 900;
}

.claim-gift-coin:nth-child(2n) {
  transform: scaleX(0.42);
}

.claim-gift-success-card {
  width: min(550px, calc(100vw - 32px));
  overflow: hidden;
  border-radius: 4px;
  background: var(--claim-gift-success-card-bg, var(--dialog-dialog-bg-content));
  box-shadow: 0 18px 40px rgb(0 0 0 / 30%);
}

.claim-gift-success-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 4;
  transform: translate(-50%, -50%);
}

.claim-gift-success-header {
  position: relative;
  display: grid;
  height: 60px;
  place-items: center;
  background: var(--claim-gift-success-header-bg, var(--dialog-dialog-bg-header));
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
}

.claim-gift-close-button {
  position: absolute;
  top: 50%;
  right: 20px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  cursor: pointer;
  font-size: 28px;
  line-height: 28px;
  transform: translateY(-50%);
}

.claim-gift-success-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 16px 20px 18px;
}

.claim-gift-currency-row {
  position: relative;
  display: block;
  color: var(--claim-gift-text-color, var(--brand-brand-text));
}

.claim-gift-currency-row::after {
  content: none;
}

.claim-gift-reward-text {
  color: var(--claim-gift-text-color, var(--brand-brand-text));
  font-size: 24px;
  font-weight: 800;
  line-height: 34px;
  text-align: center;
}

.claim-gift-reward-text strong {
  font-size: 36px;
  font-weight: 900;
}

.claim-gift-success-footer {
  padding: 16px 20px;
  background: var(--claim-gift-success-header-bg, var(--dialog-dialog-bg-header));
}

.claim-gift-success-footer .claim-gift-primary-button {
  width: 100%;
  height: 48px;
}

.claim-gift-overlay-enter-active,
.claim-gift-overlay-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.claim-gift-overlay-enter-from,
.claim-gift-overlay-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.claim-gift-panel-enter-active,
.claim-gift-panel-leave-active {
  transition: opacity 160ms ease;
}

.claim-gift-panel-enter-from,
.claim-gift-panel-leave-to {
  opacity: 0;
}

@keyframes claim-gift-present-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-5px) scale(1.03);
  }
}

@keyframes claim-gift-coin-fall {
  0% {
    opacity: 0;
    transform: translate3d(0, -42px, 0) rotateY(0deg) rotateZ(-8deg);
  }

  18% {
    opacity: 1;
  }

  68% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--coin-drift), 76px, 0) rotateY(360deg) rotateZ(8deg);
  }
}

@media (width <= 768px) {
  .claim-gift-pick-card {
    top: clamp(170px, 31vh, 240px);
    width: 184px;
  }

  .claim-gift-title {
    margin-bottom: 2px;
    font-size: 22px;
    line-height: 30px;
  }

  .claim-gift-stage-close {
    top: clamp(148px, 27vh, 216px);
    left: calc(50% + 102px);
    width: 32px;
    height: 32px;
    font-size: 24px;
  }

  .claim-gift-present-wrap {
    width: 148px;
    height: 136px;
  }

  .claim-gift-present {
    width: 148px;
    height: 148px;
  }

  .claim-gift-count {
    top: 20px;
    right: -4px;
    min-width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .claim-gift-primary-button {
    height: 34px;
    width: 172px;
  }

  .claim-gift-pick-card > .claim-gift-primary-button {
    margin-top: 10px;
  }
}
</style>
