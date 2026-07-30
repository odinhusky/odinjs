<template>
  <q-select
    v-model="activeCurrencyId"
    :options="walletDropdown"
    @update:model-value="handleWalletChange"
    map-options
    dense
    rounded
    borderless
    dark
    popup-content-class="wallet-dropdown-menu-r027"
    class="wallet-select"
    hide-dropdown-icon
  >
    <template #selected>
      <div v-if="inUseWallet" class="flex flex-nowrap justify-start items-center w-full">
        <span class="ml-4 mr-1 currency_code">{{ activeWalletLabel }}</span>
        <span class="balance">{{ selectedBalance }}</span>
      </div>
    </template>
    <template #append>
      <span v-if="isCash" class="wallet-dropdown-icon" @click.stop.prevent="getBalance">
        <i :class="{ 'fas fa-sync-alt': !isSpinning, 'fas fa-sync-alt fa-spin': isSpinning }"></i>
      </span>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="wallet_list">
        <q-item-section side class="pup_checkbox">
          <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_balance ml-8">{{ opt.label.split(" ")[0] }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="pup_currency mr-8">{{ opt.label.split(" ")[2] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:after>
      <div class="wallet-btn-container">
        <q-btn unelevated no-caps class="wallet" @click.stop="goToDeposit">
          <img v-if="$q.platform.is.mobile" :src="svgIcon('money')" />
          <p v-else>{{ isCash ? $t("common.btn.deposit") : $t("common.btn.point") }}</p>
        </q-btn>
      </div>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { WALLET_TYPE } from "src/common/utils/constants"
import { computed, ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

type WalletDropItem = {
  label: string
  value: number
  walletType: WALLET_TYPE.Enums
}

const $q = useQuasar()
const router = useRouter()
const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
const { activeWalletLabel, inUseWallet, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()
const { isCash, isCredit } = useEnv()

const activeCurrencyId = ref(0)
const isSpinning = ref(false)
const formatWalletBalance = (amount: string | number) => {
  const numericAmount = Number(amount) || 0

  if (numericAmount >= 1000000) {
    const formattedAmount = (numericAmount / 1000000).toFixed(2).replace(/\.?0+$/, "")
    return `${formattedAmount}M`
  }

  return moneyFormat(numericAmount)
}

const selectedBalance = computed(() => formatWalletBalance(inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.balance || "0"))

const walletDropdown = computed<WalletDropItem[]>(() => {
  if (isCredit.value) return []

  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${moneyFormat(cashWallet.balance)}  ${getWalletLabel(cashWallet)}`
    const value = cashWallet.currency_id
    const walletType = cashWallet.wallet_type
    return { label, value, walletType }
  })
})

function handleWalletChange(value: WalletDropItem) {
  setUserActiveWallet({ currency_id: value.value, wallet_type: value.walletType })
}

function goToDeposit() {
  router.push({ name: "MemberDeposit" })
}

async function getBalance() {
  if (isSpinning.value) return

  isSpinning.value = true
  setTimeout(async () => {
    try {
      await getUserWalletList()
    } finally {
      isSpinning.value = false
    }
  }, 1000)
}

watchEffect(() => {
  if (inUseWallet.value && inUseWallet.value[WALLET_TYPE.Enums.Cash]) {
    activeCurrencyId.value = inUseWallet.value[WALLET_TYPE.Enums.Cash].currency_id || 0
  }
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_r027/assets/css/_variable.scss"

$wallet-text: rgba(255,255,255,0.3)
.wallet_list
  display: flex
  justify-content: center
  width: 270px
  background: var(--bg-04)
  +phone-width
    @apply w-full
    padding: 8px 2px
  :deep(.q-checkbox__inner)
      font-size: 26px
  :deep(.q-checkbox__bg)
    background-color: white
    border: 0
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg)
    background: #6FCF97
  :deep(.q-checkbox__svg)
    color: black
    opacity: 0.7
  .pup_checkbox
    +phone-width
      padding-right: 0
  .pup_balance
    color: white
    opacity: 0.7
    font-size: 12px
  .pup_currency
    text-align: center
    margin-left: 16px
    color: white
    font-size: 12px

.wallet-select
  width: 270px

  .wallet-dropdown-icon
    display: flex
    justify-content: center
    align-items: center
    width: 1rem
    height: 1rem
    cursor: pointer
    color: $wallet-text
    i
      font-size: .75rem

  .wallet-btn-container
    display: flex
    align-items: stretch
    justify-content: center
    height: 100%
    padding: 4px

  .wallet
    background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%)
    color: var(--btn-text-01)
    border-radius: 8px
    font-size: 14px
    font-weight: 700
    min-height: 100%
    min-width: 72px
    width: auto
    padding: 0 14px
    box-shadow: none
    :deep(.q-btn__content)
      flex-wrap: nowrap
      gap: 4px
    p
      margin: 0
  .balance
    padding-left: 4px
    font-size: 14px
    font-weight: 700
    color: var(--text-01)
  :deep(.q-field__after)
    padding: 0
    flex-wrap: nowrap
    align-self: stretch
    background: var(--bg-05)
    border-top-right-radius: 8px
    border-bottom-right-radius: 8px

  :deep(.q-field__inner )
    background: var(--bg-05)
    border-top-right-radius: 0
    border-bottom-right-radius: 0
    border-top-left-radius: 8px
    border-bottom-left-radius: 8px
    padding-right: .625rem
    .q-field__native
      color: $wallet-text
    .q-field__append
      color: $wallet-text
  +iphone-width
    width: 40vw

    .wallet-btn-container
      padding: 3px
    :deep(.q-field__inner )
      padding-top: 0rem
    .wallet_m
      display: block

    .wallet_pc
      display: none
    .balance
      font-size: 14px
      font-weight: 700
      color: var(--text-01)
      padding-left: 0.3rem
      padding-right: 0.5rem
      +phone-width
        padding-right: 0
        font-size: 10px
    .currency_code
      font-size: 14px
      color: var(--text-02)
      +phone-width
        font-size: 10px
    .wallet
      width: auto
      min-width: 2.75rem
      padding: 7px 10px
      top: 0px
      font-size: 14px
      :deep(.q-btn .q-spinner)
        font-size: 1.4em
    :deep(.q-select__dropdown-icon)
      font-size: 5vw
      width: 0em
      height: 0em
</style>

<style lang="sass">
.wallet-dropdown-menu-r027.q-menu--dark
  background: var(--bg-04) !important
  box-shadow: none !important
  scrollbar-width: none
  -ms-overflow-style: none
  &::-webkit-scrollbar
    display: none
    width: 0
    height: 0
</style>
