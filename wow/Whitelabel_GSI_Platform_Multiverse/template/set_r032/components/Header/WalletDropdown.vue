<template>
  <q-select
    v-model="activeCurrencyId"
    :options="walletDropdown"
    @update:model-value="handleWalletChange"
    transition-show="flip-up"
    transition-hide="flip-down"
    map-options
    dense
    rounded
    borderless
    class="wallet-container"
    ref="selectRef"
    :menu-offset="[120, 10]"
    :popup-content-class="walletPopupClass"
    hide-dropdown-icon
    :readonly="!isCash"
  >
    <template #selected>
      <div v-if="inUseWallet" class="wallet-balance">
        <div class="balance-label">{{ activeWalletLabel }}</div>
        <div class="flex items-center justify-end">
          <span class="balance-amount">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance) }}</span>
        </div>
      </div>
    </template>
    <template #append>
      <span v-if="inUseWallet" class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item
        v-bind="itemProps"
        :class="['wallet-list', 'wallet-bg-image', { 'wallet-list--compact': isAllCashWalletDropdown }]"
      >
        <q-item-section side class="pup_checkbox">
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
        <q-item-section class="pup_currency">
          <q-item-label>{{ opt.currencyCode }}</q-item-label>
        </q-item-section>
        <div :class="['wallet-cell-container', { 'wallet-cell-container--compact': !hasExtraWallet(opt) }]">
          <q-item-section class="pup_wallet-cell">
            <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Cash]) }}</div>
            <div class="pup_wallet-value">{{ formatWalletBalance(opt.cashBalance, opt.currencySign) }}</div>
          </q-item-section>
          <q-item-section v-if="opt.rewardBalance !== null" class="pup_wallet-cell">
            <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Reward]) }}</div>
            <div class="pup_wallet-value">{{ formatWalletBalance(opt.rewardBalance, opt.currencySign) }}</div>
          </q-item-section>
          <q-item-section v-if="opt.bonusBalance !== null" class="pup_wallet-cell">
            <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Bonus]) }}</div>
            <div class="pup_wallet-value">{{ formatWalletBalance(opt.bonusBalance, opt.currencySign) }}</div>
          </q-item-section>
        </div>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import type { QSelect } from "quasar"
import { computed, ref, watchEffect } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { breakpoints } from "src/common/utils/constants/breakpoints"
import { useUserInfo } from "src/common/composables/useUserInfo"

type WalletDropItem = {
  label: string
  value: number
  walletType: WALLET_TYPE.Enums
  currencyCode: string
  currencySign: string
  cashBalance: string | number
  rewardBalance: string | number | null
  bonusBalance: string | number | null
}

const { isCash } = useEnv()
const { moneyFormat } = useCommon()
const { width } = useMediaQuery()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()

const selectRef = ref<InstanceType<typeof QSelect> | null>(null)
const activeCurrencyId = ref(0)
const isSpinning = ref(false)

const formatCompactMillionBalance = (balance: string | number) => {
  const numericBalance = Number(String(balance).replace(/,/g, ""))
  const absBalance = Math.abs(numericBalance)

  if (!Number.isFinite(numericBalance) || absBalance < 1000) {
    return moneyFormat(balance || "0")
  }

  if (absBalance < 1000000) {
    return `${(numericBalance / 1000).toFixed(2)} K`
  }

  return `${Number((numericBalance / 1000000).toFixed(1))}M`
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const wallets = userWalletMap.value[e]
    const cashWallet = wallets[WALLET_TYPE.Enums.Cash]
    const label = `${moneyFormat(cashWallet.balance)}  ${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    const walletType = cashWallet.wallet_type
    const currencyCode = getWalletLabel(cashWallet)
    const currencySign = (cashWallet as any)?.currency_sign || (cashWallet as any)?.currency_symbol || "$ "
    const cashBalance = formatCompactMillionBalance(cashWallet.balance || "0")
    const rewardBalance = wallets[WALLET_TYPE.Enums.Reward]
      ? formatCompactMillionBalance(wallets[WALLET_TYPE.Enums.Reward].balance || "0")
      : null
    const bonusBalance = wallets[WALLET_TYPE.Enums.Bonus]
      ? formatCompactMillionBalance(wallets[WALLET_TYPE.Enums.Bonus].balance || "0")
      : null

    return { label, value, walletType, currencyCode, currencySign, cashBalance, rewardBalance, bonusBalance }
  })
})

const walletPopupClass = computed(() =>
  [
    "wallet-popup-22",
    walletDropdown.value.length > 5 ? "wallet-popup-22--with-fade" : "",
    width.value < breakpoints.phone ? "wallet-popup-22--mobile" : "",
    width.value >= breakpoints.phone && width.value < breakpoints.pad ? "wallet-popup-22--tablet" : ""
  ]
    .filter(Boolean)
    .join(" ")
)
const hasExtraWallet = (wallet: WalletDropItem) => wallet.rewardBalance !== null || wallet.bonusBalance !== null
const isAllCashWalletDropdown = computed(
  () => walletDropdown.value.length > 0 && walletDropdown.value.every((wallet) => !hasExtraWallet(wallet))
)

const formatWalletBalance = (balance: string | number | null, currencySign: string) => {
  if (balance === null) return "—"
  return `${currencySign}${balance}`
}

const handleWalletChange = (value: WalletDropItem) => {
  setUserActiveWallet({ currency_id: value.value, wallet_type: value.walletType })
}

const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.wallet-container {
  margin-right: 0.47875rem;

  @include pad-large-width {
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .wallet-balance {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    font-weight: 400;
    font-size: 0.75rem;

    .balance-label {
      color: var(--primary-02);
    }

    .balance-amount {
      color: var(--secondary-01);
      margin-right: 1rem;
    }
  }
}

:deep(.q-field__append) {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(-25%);
  padding-left: 0;
  align-items: flex-end;

  .wallet-dropdown-icon {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    color: var(--primary-01);
    width: 0.75rem;
    height: 0.75rem;

    i {
      position: absolute;
      font-size: 0.75rem;
    }
  }
}

.wallet-list {
  @apply w-[363px];

  @media (max-width: 767px) {
    @apply w-full;
  }
}

.wallet-list--compact {
  width: 17rem;
}

@media (max-width: 767px) {
  .wallet-list--compact {
    width: 100%;
  }
}

.wallet-bg-image {
  @apply mb-3;
  border-radius: 0.5rem;
  background-image: url("../../assets/images/wallet-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  color: rgba(255, 255, 255, 1);
  padding: 0.75rem 1rem;

  @include pad-large-width {
    padding: 0.75rem 0.5rem;
  }

  :deep(.q-checkbox__inner) {
    font-size: 1.625rem;
  }

  :deep(.q-checkbox__bg) {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.85);
    top: 18% !important;
    left: 20% !important;
    width: 1rem !important;
    height: 1rem !important;
    border: 1px solid rgba(255, 255, 255, 0.85);
  }

  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.85);
  }

  :deep(.q-checkbox__svg) {
    color: rgba(255, 255, 255, 1);
  }

  :deep(.q-checkbox__truthy) {
  }

  :deep(.q-checkbox__inner--truthy .q-checkbox__svg) {
  }

  .pup_checkbox {
    flex: 0 0 2.5rem;
  }

  .pup_currency {
    flex: 0 0 3.5rem;
    color: rgba(255, 255, 255, 1);
    font-size: 1rem !important;
    font-weight: 400;

    @include pad-large-width {
      flex-basis: 4.5rem;
      font-size: 1.125rem;
    }
  }

  .wallet-cell-container {
    display: flex;
    width: 100%;
    margin-left: 12px;
  }

  .wallet-cell-container--compact {
    width: auto;
    flex: 0 0 auto;
  }

  .wallet-cell-container--compact .pup_wallet-cell {
    flex: 0 0 auto;
  }

  .pup_wallet-cell {
    min-width: 0;
    color: rgba(255, 255, 255, 1);
  }

  .pup_wallet-label {
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    line-height: 1.1;
    margin-bottom: 0.375rem;
    font-weight: 600;
    white-space: nowrap;

    @include pad-large-width {
      font-size: 0.75rem;
    }
  }

  .pup_wallet-value {
    color: rgba(255, 255, 255, 1);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include pad-large-width {
      font-size: 0.75rem;
    }
  }

  &:last-child {
    @apply mb-0;
  }
}
</style>

<style lang="scss">
.wallet-popup-22 {
  max-height: 558px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 16px;
  background: var(--neutral-03);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;

  .body--dark & {
    background: var(--secondary-04);
  }

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  &::after {
    content: "";
    display: none;
    position: sticky;
    left: 0;
    bottom: -17px;
    width: 100%;
    height: 25px;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  }

  &.wallet-popup-22--with-fade::after {
    display: block;
  }

  &.wallet-popup-22--mobile {
    top: 58.5px !important;
    left: auto !important;
    visibility: visible;
    min-width: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }

  &.wallet-popup-22--tablet {
    max-width: none !important;
  }
}

.body--dark .wallet-popup-22::after {
  display: none;
}
</style>
