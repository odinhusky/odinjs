<template>
  <div class="user-mobile-wallet">
    <div class="wallet-panel wallet-panel--left">
      <q-select
        :model-value="activeCurrencyId"
        :options="walletOptions"
        emit-value
        map-options
        borderless
        dense
        dark
        behavior="menu"
        popup-content-class="user-mobile-wallet-menu"
        class="wallet-select"
        :class="{ 'wallet-select--interactive': hasMultipleWallets }"
        :dropdown-icon="hasMultipleWallets ? 'keyboard_arrow_down' : 'null'"
        @update:model-value="handleWalletChange"
      >
        <template #selected>
          <div class="wallet-selected-content">
            <div class="wallet-profile-row">
              <div class="wallet-avatar-frame">
                <img :src="getUserAvatar(svgIcon('orange_user'))" class="wallet-avatar-image" alt="user-avatar" />
              </div>
              <div class="wallet-profile-copy">
                <p class="wallet-greeting">Hi</p>
                <p class="wallet-account">{{ displayAccount }}</p>
              </div>
            </div>
            <div class="wallet-balance-row">
              <div class="wallet-balance-copy">
                <p class="wallet-balance-title">{{ $t("member.cash-Wallet") }}</p>
                <div class="wallet-balance-arrow-container">
                  <div class="wallet-balance-value">
                    <span class="wallet-balance-amount">{{ balanceAmount }}</span>
                    <span class="wallet-balance-currency">{{ activeWalletLabel }}</span>
                  </div>
                  <q-icon
                    v-if="hasMultipleWallets"
                    name="keyboard_arrow_down"
                    class="wallet-balance-arrow"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #option="{ itemProps, opt }">
          <q-item v-bind="itemProps" class="wallet-option">
            <q-item-section>
              <q-item-label class="wallet-option-balance">{{ opt.balance }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="wallet-option-currency">{{ opt.currencyLabel }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="wallet-panel wallet-panel--right">
      <div class="wallet-actions">
        <button type="button" class="wallet-action-button" @click="goToMemberRoute('MemberDeposit')">
          <img :src="svgIcon('mobileDeposit')" class="wallet-action-icon" alt="deposit-icon" />
          <span class="wallet-action-label">{{ $t("menu.deposit") }}</span>
        </button>
        <button type="button" class="wallet-action-button" @click="goToMemberRoute('MemberWithdraw')">
          <img :src="svgIcon('mobileWithdraw')" class="wallet-action-icon" alt="withdraw-icon" />
          <span class="wallet-action-label">{{ $t("menu.withdrawal") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"

type WalletOption = {
  label: string
  value: number
  walletType: WALLET_TYPE.Enums
  balance: number | string
  currencyLabel: string
}

const router = useRouter()
const { auth } = useAuth()
const { moneyFormat } = useCommon()
const { svgIcon } = useSiteImg()
const {
  userInfo2,
  userWalletMap,
  activeWalletLabel,
  activeWalletCurrencyId,
  inUseWallet,
  getWalletLabel,
  setUserActiveWallet,
  getUserAvatar
} = useUserInfo()

const formatWalletBalance = (amountStr: string | number) => {
  const num = Number(amountStr) || 0
  if (num >= 1000000) {
    // Format to millions with up to 2 decimal places, removing trailing zeros
    const formatted = (num / 1000000).toFixed(2).replace(/\.?0+$/, "")
    return `${formatted}M`
  }
  return moneyFormat(num)
}

const walletOptions = computed<WalletOption[]>(() => {
  return Object.keys(userWalletMap.value).reduce((result, key) => {
    const cashWallet = userWalletMap.value[key]?.[WALLET_TYPE.Enums.Cash]

    if (!cashWallet) return result

    const balance = moneyFormat(cashWallet.balance || "0")
    const currencyLabel = getWalletLabel(cashWallet)

    result.push({
      label: `${balance} ${currencyLabel}`,
      value: cashWallet.currency_id,
      walletType: cashWallet.wallet_type,
      balance,
      currencyLabel
    })

    return result
  }, [] as WalletOption[])
})

// Just display arrow icon, this is a feature not a bug
const hasMultipleWallets = true
const activeCurrencyId = computed(() => activeWalletCurrencyId.value || null)
const displayAccount = computed(() => {
  const account = userInfo2.value?.account || auth.value.account || ""
  return account ? `ID:${account}` : ""
})
const balanceAmount = computed(() => formatWalletBalance(inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.balance || "0"))

const handleWalletChange = (value: number | null) => {
  if (!value || value === activeWalletCurrencyId.value) return

  const selectedWallet = walletOptions.value.find((wallet) => wallet.value === value)

  if (!selectedWallet) return

  setUserActiveWallet({ currency_id: selectedWallet.value, wallet_type: selectedWallet.walletType })
}

const goToMemberRoute = (name: "MemberDeposit" | "MemberWithdraw") => {
  router.push({ name })
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

.user-mobile-wallet {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;
  border-radius: 12px;
  margin-top: 12px;
  min-height: 76px;
}

.wallet-panel {
  min-width: 0;
  min-height: 76px;
}

.wallet-panel--left {
  background: var(--btn-bg-05);
}

.wallet-panel--right {
  display: flex;
  background: var(--bg-09);
}

.wallet-select {
  height: 100%;
  min-width: 0;
}

.wallet-select--interactive {
  cursor: pointer;
}

.wallet-selected-content {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wallet-profile-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.wallet-avatar-frame {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  padding: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, #765c19 0%, #fcefcf 45.67%, #f2b519 63.94%, #765c19 100%);
}

.wallet-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.wallet-profile-copy {
  min-width: 0;
}

.wallet-greeting {
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
}

.wallet-account {
  margin-top: 2px;
  overflow: hidden;
  color: var(--text-07);
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-balance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  min-width: 0;
}

.wallet-balance-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.wallet-balance-title {
  flex: 0 0 auto;
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
}

.wallet-balance-value {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.wallet-balance-arrow-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.wallet-balance-amount {
  overflow: hidden;
  color: var(--text-07);
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-balance-currency {
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}

.wallet-balance-arrow {
  color: var(--text-02);
  font-size: 20px;
  flex: 0 0 auto;
}

.wallet-actions {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wallet-action-button {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 12px 8px;
  border: 0;
  background: transparent;
  color: var(--btn-text-01);
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
}

.wallet-action-label {
  display: block;
  width: 100%;
}

.wallet-action-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.wallet-option {
  min-width: 11rem;
  color: var(--text-01);
  background: var(--bg-05);
}

.wallet-option-balance,
.wallet-option-currency {
  color: inherit;
  font-size: 12px;
}

:deep(.wallet-select .q-field__inner) {
  min-height: 100%;
  background: transparent;
}

:deep(.wallet-select .q-field__control) {
  min-height: 100%;
  padding: 0;
  color: var(--text-01);
}

:deep(.wallet-select .q-field__native) {
  min-height: 100%;
  padding: 0;
}

:deep(.wallet-select .q-field__append) {
  display: none;
}

:deep(.wallet-select .q-field__marginal) {
  height: auto;
}

:deep(.wallet-select .q-field__control::before),
:deep(.wallet-select .q-field__control::after) {
  display: none;
}

:deep(.user-mobile-wallet-menu) {
  border: 1px solid var(--card-border-01);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-04);
}

@media (max-width: $iphone-media) {
  .wallet-selected-content {
    padding: 8px 12px;
  }

  .wallet-avatar-frame {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
  }

  .wallet-action-button {
    padding: 12px 6px;
    font-size: 11px;
  }

  .wallet-action-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
