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
    dark
    class="wallet-container"
    ref="selectRef"
    :menu-offset="[120, 10]"
    hide-dropdown-icon
    :readonly="!isCash"
    :popup-content-class="`wallet-popup wallet-popup--cols-${visibleColumnCount}`"
  >
    <template #selected>
      <div v-if="inUseWallet" class="selected-content">
        <span class="mr-2 currency-code">{{ activeWalletLabel }}</span>
        <span class="balance">{{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0") }}</span>
      </div>
    </template>
    <template #append>
      <span class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="wallet_list" :style="walletListStyle">
        <q-item-section side class="pup_checkbox">
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
        <q-item-section class="pup_currency">
          <q-item-label>{{ opt.currencyCode }}</q-item-label>
        </q-item-section>
        <q-item-section class="pup_wallet-cell">
          <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Cash]) }}</div>
          <div class="pup_wallet-value">{{ opt.cashBalance }}</div>
        </q-item-section>
        <q-item-section v-if="hasRewardColumn" class="pup_wallet-cell">
          <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Reward]) }}</div>
          <div class="pup_wallet-value">{{ opt.rewardBalance ?? "—" }}</div>
        </q-item-section>
        <q-item-section v-if="hasBonusColumn" class="pup_wallet-cell">
          <div class="pup_wallet-label">{{ $t(WALLET_TYPE.I18nKeys[WALLET_TYPE.Enums.Bonus]) }}</div>
          <div class="pup_wallet-value">{{ opt.bonusBalance ?? "—" }}</div>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { useCommonImg } from "src/common/hooks/useCommonImg"
import type { QSelect } from "quasar"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, nextTick, ref, watchEffect } from "vue"

type WalletDropItem = {
  label: string
  value: number
  walletType: WALLET_TYPE.Enums
  currencyCode: string
  cashBalance: string | number
  rewardBalance: string | number | null
  bonusBalance: string | number | null
}

const props = defineProps<{
  bgImage?: string
}>()

const walletListStyle = computed(() =>
  props.bgImage
    ? { backgroundImage: `url(${props.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}
)

const $q = useQuasar()
const { commonSvgIcon } = useCommonImg()
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()
const { isCash, isCredit } = useEnv()

const selectRef = ref<InstanceType<typeof QSelect> | null>(null)
const activeCurrencyId = ref(0)

const walletDropdown = computed<WalletDropItem[]>(() => {
  if (isCredit.value) return []

  return Object.keys(userWalletMap.value).map((e) => {
    const wallets = userWalletMap.value[e]
    const cashWallet = wallets[WALLET_TYPE.Enums.Cash]
    const label = `${moneyFormat(cashWallet.balance)}  ${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    const walletType = cashWallet.wallet_type
    const currencyCode = getWalletLabel(cashWallet)
    const cashBalance = moneyFormat(cashWallet?.balance || "0")
    const rewardBalance = wallets[WALLET_TYPE.Enums.Reward]
      ? moneyFormat(wallets[WALLET_TYPE.Enums.Reward].balance || "0")
      : null
    const bonusBalance = wallets[WALLET_TYPE.Enums.Bonus]
      ? moneyFormat(wallets[WALLET_TYPE.Enums.Bonus].balance || "0")
      : null
    return { label, value, walletType, currencyCode, cashBalance, rewardBalance, bonusBalance }
  })
})

const hasRewardColumn = computed(() => walletDropdown.value.some((w) => w.rewardBalance !== null))
const hasBonusColumn = computed(() => walletDropdown.value.some((w) => w.bonusBalance !== null))
const visibleColumnCount = computed(() => 1 + (hasRewardColumn.value ? 1 : 0) + (hasBonusColumn.value ? 1 : 0))

function handleWalletChange(value: WalletDropItem) {
  setUserActiveWallet({ currency_id: value.value, wallet_type: value.walletType })
}

const isSpinning = ref(false)
const getBalance = () => {
  isSpinning.value = true
  setTimeout(() => {
    getUserWalletList()
    isSpinning.value = false
  }, 1000)
}

function openPopup() {
  nextTick(() => {
    if (selectRef.value) {
      selectRef.value.showPopup()
    }
  })
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

$wallet-text: rgba(255,255,255,0.3)

.wallet-container
  background: var(--secondary-04)
  @apply min-w-[11.4375rem] px-[10px] rounded-[3.125rem]
  @include iphone-width
    height: 2rem
    @apply min-w-[6.25rem] text-[.75rem]
    @apply flex whitespace-nowrap items-center justify-center
    :deep(.q-field__native)
      min-height: unset
      padding: 0
    :deep(.q-field__control)
      min-height: 2rem
      height: 2rem
    :deep(.q-field__marginal)
      height: 2rem

  .selected-content
    @apply flex items-center w-full overflow-hidden whitespace-nowrap
    color: var(--bg-main-bg)

  .wallet-dropdown-icon
    @apply flex items-center justify-center
    @include iphone-width
      height: 2rem
    i
      font-size: 12px

/* 幣別行 */
.wallet_list
  border-radius: 0.5rem
  display: flex
  align-items: center
  width: 100%
  padding: 8px 16px

  &:not(:last-child)
    margin-bottom: 0.625rem

  +phone-width
    padding: 8px 4px
  :deep(.q-checkbox__inner)
      font-size: 26px
  :deep(.q-checkbox__bg)
    background-color: var(--primary-04)
    border: 0
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg)
    background: var(--primary-04)
  :deep(.q-checkbox__svg)
    color: var(--neutral-01)
    opacity: 0.7
  .pup_checkbox
    flex: 0 0 40px
    +phone-width
      padding-right: 0
  .pup_wallet-cell
    flex: 1 1 0% !important
    min-width: 0
    overflow: hidden
    text-align: left
    color: white
    &:nth-child(n+5)
      padding-left: 16px
    &:nth-child(n+5)
      border-left: 1px solid rgba(255, 255, 255, 0.1)
    .pup_wallet-label
      font-size: 11px
      color: rgba(255, 255, 255, 0.5)
      margin-bottom: 2px
      white-space: nowrap
    .pup_wallet-value
      font-size: 14px
      font-weight: 600
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      width: 100%
  .pup_currency
    flex: 0 0 60px
    text-align: center
    color: white
    font-weight: bold
    font-size: 14px

.wallet-select
  width: 270px

  .wallet
    background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%)
    color: var(--neutral-01)
    height: 100%
    padding: 0 1rem
    border-top-left-radius: 0
    border-bottom-left-radius: 0
    border-top-right-radius: 4px
    border-bottom-right-radius: 4px
    font-size: 0.875rem
    font-weight: 700
  .balance
    padding-left: 1rem
    padding-right: 1rem
    color: $neutral01
    opacity: 0.7
  :deep(.q-field__after)
    padding: 0
    flex-wrap: wrap


  :deep(.q-field__inner )
    background: #0F0F10
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    border-top-left-radius: 10px
    border-bottom-left-radius: 10px
    padding-right: .625rem
    .q-field__native
      color: $wallet-text
    .q-field__append
      color: $wallet-text
  +iphone-width
    width: 40vw

    :deep(.q-field__inner )
      padding-top: 0rem
    .wallet_m
      display: block

    .wallet_pc
      display: none
    .balance
      padding-left: 0.3rem
      padding-right: 0.5rem
      font-size: 2.7vw
      +phone-width
        padding-right: 0
        font-size: 10px
    .currency_code
      font-size: 2.7vw
      +phone-width
        font-size: 10px
    .wallet
      padding: 7px 0
      top: 0px
      font-size: 14px
      :deep(.q-btn .q-spinner)
        font-size: 1.4em
    :deep(.q-select__dropdown-icon)
      font-size: 5vw
      width: 0em
      height: 0em

:global(.wallet-popup)
  background: var(--bg-side)
  border-radius: 0.5rem
  padding: 0.625rem
  .pup_wallet-label
    white-space: nowrap

:global(.wallet-popup--cols-1)
  min-width: 280px !important
  +phone-width
    min-width: 220px !important

:global(.wallet-popup--cols-2)
  min-width: 380px !important
  +phone-width
    min-width: 280px !important

:global(.wallet-popup--cols-3)
  min-width: 480px !important
  +phone-width
    min-width: 330px !important

// 隱藏quasar q-select在mobile端會自動出現的label
:global(.q-select__dialog > .q-field)
  display: none
</style>
