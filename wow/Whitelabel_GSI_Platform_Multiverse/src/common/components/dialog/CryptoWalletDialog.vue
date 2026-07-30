<template>
  <q-dialog v-model="show" persistent>
    <q-card class="crypto-wallet-dialog" flat>
      <div class="crypto-wallet-dialog__header">
        <div class="crypto-wallet-dialog__logo">
          <img v-if="logoUrl" :src="logoUrl" alt="logo" />
        </div>
        <q-btn dense flat icon="close" class="crypto-wallet-dialog__close" @click="onClose" />
      </div>

      <div class="crypto-wallet-dialog__title-row">
        <span class="crypto-wallet-dialog__title">{{ $t("deposit.cryptoWallet.paymentSummary") }}</span>
      </div>

      <div v-if="cryptoWallet" class="crypto-wallet-dialog__network">
        <div class="crypto-wallet-dialog__network-line">
          <span class="crypto-wallet-dialog__network-coin">{{ cryptoWallet.coin_symbol }}</span>
          <span class="crypto-wallet-dialog__network-chain">
            {{ $t("deposit.cryptoWallet.networkOnly", { chain: chainLabel }) }}
          </span>
        </div>
        <p class="crypto-wallet-dialog__network-warning">
          {{ $t("deposit.cryptoWallet.networkWarning") }}
        </p>
      </div>

      <div class="crypto-wallet-dialog__qr">
        <QRCode v-if="cryptoWallet?.wallet_address" v-model="qrValue" :size="180" />
      </div>

      <div class="crypto-wallet-dialog__details">
        <div class="crypto-wallet-dialog__row">
          <span class="crypto-wallet-dialog__row-label">{{ $t("deposit.cryptoWallet.totalPay") }}</span>
          <span class="crypto-wallet-dialog__row-value">{{ amount }} {{ currency }}</span>
        </div>
        <div class="crypto-wallet-dialog__row">
          <span class="crypto-wallet-dialog__row-label">{{ $t("deposit.cryptoWallet.cryptoToPay") }}</span>
          <span class="crypto-wallet-dialog__row-value crypto-wallet-dialog__row-value--accent">
            {{ cryptoWallet?.payable_amount }} {{ cryptoWallet?.coin_symbol }}
            <q-icon
              name="content_copy"
              class="crypto-wallet-dialog__copy-icon"
              @click="copy(cryptoWallet?.payable_amount)"
            />
          </span>
        </div>
        <div class="crypto-wallet-dialog__row">
          <span class="crypto-wallet-dialog__row-label">{{ $t("deposit.cryptoWallet.address") }}</span>
          <span class="crypto-wallet-dialog__row-value crypto-wallet-dialog__row-value--accent">
            <span class="crypto-wallet-dialog__address-text">{{ truncatedAddress }}</span>
            <q-icon
              name="content_copy"
              class="crypto-wallet-dialog__copy-icon"
              @click="copy(cryptoWallet?.wallet_address)"
            />
          </span>
        </div>
      </div>

      <div class="crypto-wallet-dialog__hint">
        {{ $t("deposit.cryptoWallet.scanHint") }}
      </div>

      <q-btn
        unelevated
        no-caps
        class="crypto-wallet-dialog__action"
        :label="$t('deposit.cryptoWallet.copyAddress')"
        @click="copy(cryptoWallet?.wallet_address)"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { storeToRefs } from "pinia"
import { useGameDialogStore } from "src/stores/gameDialogStore"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import QRCode from "src/common/components/QRCode/Index.vue"

const { t } = useI18n()
const $q = useQuasar()
const gameDialogStore = useGameDialogStore()
const { cryptoWalletDialog } = storeToRefs(gameDialogStore)

const { siteLogoImg } = useCommonImg()

const show = computed({
  get: () => cryptoWalletDialog.value.show,
  set: (val) => {
    if (!val) cryptoWalletDialog.value.closeDialog()
  }
})

const amount = computed(() => cryptoWalletDialog.value.amount)
const currency = computed(() => cryptoWalletDialog.value.currency)
const cryptoWallet = computed(() => cryptoWalletDialog.value.cryptoWallet)
const qrValue = computed(() => cryptoWallet.value?.wallet_address || "")

const logoUrl = computed(() => {
  try {
    return siteLogoImg?.value || ""
  } catch {
    return ""
  }
})

const chainLabel = computed(() => {
  const chain = cryptoWallet.value?.chain
  if (!chain) return ""
  // TRON → TRC20 / ETH → ERC20 等常見對應
  const map: Record<string, string> = {
    TRON: "TRC20",
    ETH: "ERC20",
    ETHEREUM: "ERC20",
    BSC: "BEP20",
    BNB: "BEP20"
  }
  return map[chain.toUpperCase()] || chain
})

const truncatedAddress = computed(() => {
  const addr = cryptoWallet.value?.wallet_address || ""
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 8)}...${addr.slice(-4)}`
})

function copy(value?: string) {
  if (!value) return
  $q.notify.dismiss?.()
  navigator.clipboard
    ?.writeText(value)
    .then(() => {
      $q.notify({ type: "positive", message: t("common.alarm.copySuccess"), position: "top", timeout: 1500 })
    })
    .catch(() => {
      $q.notify({ type: "negative", message: t("common.alarm.copyFailed"), position: "top", timeout: 1500 })
    })
}

function onClose() {
  cryptoWalletDialog.value.closeDialog()
}
</script>

<!-- 預設 CSS 變數放在非 scoped 區塊（低 specificity），讓各版型 .crypto-wallet-dialog 全域覆寫能勝出 -->
<style lang="scss">
:root {
  --cwd-bg: #ffffff;
  --cwd-text: #1f2937;
  --cwd-muted: #6b7280;
  --cwd-card: #f3f4f6;
  --cwd-accent: #2563eb;
  --cwd-warning: #ef4444;
  --cwd-border: #e5e7eb;
  --cwd-action-bg: #2563eb;
  --cwd-action-text: #ffffff;
}
</style>

<style scoped lang="scss">
/* 樣式以 CSS 變數設計，各版型可在外層 root / 此元件樣式覆寫變數實作配色客製 */
.crypto-wallet-dialog {
  width: 320px;
  max-width: 92vw;
  padding: 20px;
  border-radius: 16px;
  background: var(--cwd-bg);
  color: var(--cwd-text);

  &__header {
    @apply flex items-center justify-between;
    margin-bottom: 8px;
  }

  &__logo img {
    height: 22px;
    width: auto;
  }

  &__close {
    color: var(--cwd-muted);
  }

  &__title-row {
    @apply flex items-center justify-between;
    margin-bottom: 10px;
  }

  &__title {
    font-weight: 600;
    font-size: 14px;
  }

  &__network {
    background: var(--cwd-card);
    border-radius: 12px;
    padding: 10px 12px;
    text-align: center;
    margin-bottom: 12px;

    &-line {
      @apply flex items-center justify-center gap-1;
      font-weight: 600;
      font-size: 14px;
    }

    &-coin {
      color: var(--cwd-text);
    }

    &-chain {
      color: var(--cwd-muted);
      font-weight: 500;
    }

    &-warning {
      margin: 4px 0 0;
      font-size: 11px;
      color: var(--cwd-warning);
    }
  }

  &__qr {
    @apply flex items-center justify-center;
    background: #ffffff;
    border: 1px solid var(--cwd-border);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 14px;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  &__row {
    @apply flex items-center justify-between;
    background: var(--cwd-card);
    border-radius: 8px;
    padding: 10px 12px;

    &-label {
      font-size: 12px;
      color: var(--cwd-muted);
    }

    &-value {
      @apply flex items-center gap-1;
      font-size: 13px;
      font-weight: 600;

      &--accent {
        color: var(--cwd-accent);
      }
    }
  }

  &__address-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__copy-icon {
    cursor: pointer;
    font-size: 16px;
  }

  &__hint {
    text-align: center;
    font-size: 12px;
    color: var(--cwd-muted);
    margin-bottom: 10px;
  }

  &__action {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    background: var(--cwd-action-bg);
    color: var(--cwd-action-text);
    font-weight: 600;
  }
}
</style>
