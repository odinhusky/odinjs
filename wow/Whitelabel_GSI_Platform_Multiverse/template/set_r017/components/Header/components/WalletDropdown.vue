<template>
  <div class="r017-wallet-dropdown">
    <q-btn flat no-caps class="wallet-trigger" :disable="!isCash" :ripple="false">
      <span class="wallet-trigger__icon">
        <img :src="svgIcon('moneyIcon')" alt="" />
      </span>
      <span class="wallet-trigger__balance">{{ activeHeaderBalance }}</span>
      <span class="wallet-trigger__currency">{{ activeWalletLabel }}</span>
      <q-icon class="wallet-trigger__chevron" :class="{ 'is-open': popupOpen }" name="keyboard_arrow_down" />

      <q-menu
        v-model="popupOpen"
        class="r017-wallet-popup"
        :anchor="walletMenuAnchor"
        :self="walletMenuSelf"
        :offset="walletMenuOffset"
        :max-height="walletPopupMaxHeight"
      >
        <div class="wallet-popup-content">
          <div v-if="activeWallet" class="current-wallet">
            <span class="current-wallet__icon">
              <img v-if="activeWallet.wallet_type === WALLET_TYPE.Enums.Cash" :src="svgIcon('moneyIcon')" alt="" />
              <q-icon v-else class="current-wallet__gift-icon" name="card_giftcard" />
            </span>
            <div class="current-wallet__label">
              <span class="current-wallet__status">{{ $t("current_active_wallet") }}</span>
              <span class="current-wallet__name">{{ $t(WALLET_TYPE.I18nKeys[activeWallet.wallet_type]) }}</span>
            </div>
            <span class="current-wallet__currency">{{ activeWalletCurrencyLabel }}</span>
            <span class="current-wallet__balance">{{ activeWalletBalance }}</span>
          </div>

          <div class="wallet-popup-divider"></div>

          <div class="wallet-group-list">
            <div
              v-for="walletGroup in walletDropdown"
              :key="walletGroup.value"
              class="wallet-group"
              :class="{ 'wallet-group--single-cash': walletGroup.hasOnlyCash }"
            >
              <div class="wallet-group__currency">{{ walletGroup.currencyCode }}</div>
              <div class="wallet-card-grid">
                <div
                  v-for="card in walletGroup.cards"
                  :key="`${walletGroup.value}-${card.walletType}`"
                  role="button"
                  tabindex="0"
                  class="wallet-card"
                  :class="{
                    'wallet-card--active': card.isActive,
                    'wallet-card--single': walletGroup.hasOnlyCash,
                  }"
                  @click.stop="handleWalletChange(card)"
                  @keydown.enter.stop="handleWalletChange(card)"
                  @keydown.space.stop.prevent="handleWalletChange(card)"
                >
                  <span class="wallet-card__meta">
                    <img v-if="card.isCash" class="wallet-card__icon-img" :src="svgIcon(card.iconName)" alt="" />
                    <q-icon v-else class="wallet-card__icon" name="card_giftcard" />
                    <span>{{ $t(card.labelKey) }}</span>
                  </span>
                  <span class="wallet-card__balance">{{ card.balance }}</span>
                  <span class="wallet-card__state"></span>
                  <button
                    v-if="card.hasTransferOutAction"
                    type="button"
                    class="wallet-card__transfer"
                    @click.stop.prevent="handleTransferOut(card)"
                  >
                    <q-icon class="wallet-card__transfer-icon" name="history" />
                    <span>{{ $t("cash.transferOut") }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>

    <q-btn flat no-caps class="deposit-btn" :ripple="false" @click="handleDepositClick">
      <img class="deposit-btn__icon" :src="svgIcon('deposit')" alt="" />
      <span class="deposit-btn__label">{{ $t("common.btn.deposit") }}</span>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import type * as Response from "src/api/response.type"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { WALLET_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, ref } from "vue"

type WalletCard = {
  currencyId: number
  walletType: WALLET_TYPE.Enums
  labelKey: string
  balance: string | number
  rawBalance: number
  isActive: boolean
  isCash: boolean
  iconName: string
  hasTransferOutAction: boolean
}

type WalletDropItem = {
  value: number
  walletType: WALLET_TYPE.Enums
  currencyCode: string
  hasOnlyCash: boolean
  cards: WalletCard[]
}

const props = defineProps<{
  onAction?: () => void
}>()

const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
const { activeWalletLabel, userWalletList, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()
const { isCash, isCredit } = useEnv()
const { isMobile } = useMediaQuery()
const eventbus = injectStrict(EventBusKey)

const popupOpen = ref(false)

const walletTypeOrder: WALLET_TYPE.Enums[] = [WALLET_TYPE.Enums.Cash, WALLET_TYPE.Enums.Reward, WALLET_TYPE.Enums.Bonus]

const walletMenuAnchor = computed(() => (isMobile.value ? "bottom middle" : "bottom right"))
const walletMenuSelf = computed(() => (isMobile.value ? "top middle" : "top right"))
const walletMenuOffset = computed((): [number, number] => (isMobile.value ? [0, 16] : [0, 12]))
const walletPopupMaxHeight = "calc(100dvh - 96px)"

const activeWallet = computed<Response.UserWallet | null>(() => {
  return userWalletList.value.find((wallet: Response.UserWallet) => wallet.in_use) ?? null
})

const activeWalletBalance = computed((): string | number => moneyFormat(activeWallet.value?.balance || "0"))
const activeWalletCurrencyLabel = computed((): string => (activeWallet.value ? getWalletLabel(activeWallet.value) : ""))

const formatCompactBalanceUnit = (value: number, divisor: number, suffix: string): string => {
  const compactValue = value / divisor
  const roundedValue = Math.round(compactValue * 10) / 10
  return `${roundedValue.toString()}${suffix}`
}

const formatHeaderBalance = (balance: string | number | undefined): string => {
  const numericBalance = Number(balance)

  if (!Number.isFinite(numericBalance) || numericBalance <= 0) {
    return "0"
  }

  if (numericBalance >= 1000000) {
    return formatCompactBalanceUnit(numericBalance, 1000000, "M")
  }

  if (numericBalance >= 1000) {
    return formatCompactBalanceUnit(numericBalance, 1000, "k")
  }

  return String(moneyFormat(numericBalance))
}

const activeHeaderBalance = computed((): string => formatHeaderBalance(activeWallet.value?.balance))

const normalizeBalance = (balance: string | number | undefined): number => {
  const normalizedBalance = Number(balance)

  if (!Number.isFinite(normalizedBalance) || normalizedBalance <= 0) {
    return 0
  }

  return normalizedBalance
}

const createWalletCard = (wallet: Response.UserWallet): WalletCard => {
  const isCashWallet = wallet.wallet_type === WALLET_TYPE.Enums.Cash
  const rawBalance = normalizeBalance(wallet.balance)
  const hasTransferOutAction = wallet.wallet_type === WALLET_TYPE.Enums.Reward

  return {
    currencyId: wallet.currency_id,
    walletType: wallet.wallet_type,
    labelKey: WALLET_TYPE.I18nKeys[wallet.wallet_type],
    balance: moneyFormat(wallet.balance || "0"),
    rawBalance,
    isActive: wallet.in_use,
    isCash: isCashWallet,
    iconName: wallet.in_use ? "moneyIcon" : "moneyIconWhite",
    hasTransferOutAction,
  }
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  if (isCredit.value) return []

  return Object.keys(userWalletMap.value).map((currencyCode) => {
    const wallets = userWalletMap.value[currencyCode]
    const cashWallet = wallets[WALLET_TYPE.Enums.Cash]
    const orderedWallets = walletTypeOrder
      .map((walletType) => wallets[walletType])
      .filter((wallet): wallet is Response.UserWallet => Boolean(wallet))
    const hasOnlyCash = orderedWallets.length === 1 && orderedWallets[0].wallet_type === WALLET_TYPE.Enums.Cash

    return {
      value: cashWallet.currency_id,
      walletType: cashWallet.wallet_type,
      currencyCode: getWalletLabel(cashWallet),
      hasOnlyCash,
      cards: orderedWallets.map(createWalletCard),
    }
  })
})

const handleWalletChange = async (card: WalletCard) => {
  popupOpen.value = false
  await setUserActiveWallet({ currency_id: card.currencyId, wallet_type: card.walletType })
}

const handleTransferOut = async (card: WalletCard): Promise<void> => {
  popupOpen.value = false
  eventbus.emit("openBonusTransferDetail", true, card.currencyId)
}

const handleDepositClick = () => {
  props.onAction?.()
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.r017-wallet-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  @include phone-width {
    gap: 0;
    width: 130px;
  }
}

.wallet-trigger,
.deposit-btn {
  height: 40px;
  border-radius: 0.5rem;
  color: var(--text-01, #ffffff);
}

.wallet-trigger {
  width: 12.4375rem;
  min-width: 0;
  max-width: 12.4375rem;
  padding: 0 0.75rem;
  background: linear-gradient(0deg, var(--bg-14, #ffffff1a), var(--bg-14, #ffffff1a)), var(--bg-04, #000025);

  @include pad-width {
    width: 12.4375rem;
    min-width: 0;
  }

  @include phone-width {
    width: min(220px, calc(100vw - 170px));
    max-width: min(220px, calc(100vw - 170px));
    height: 40px;
    padding: 0 10px;
    border-radius: 10px;
  }

  :deep(.q-btn__content) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    width: 100%;
    min-width: 0;
  }
}

.wallet-trigger__icon {
  flex: 0 0 2.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  height: 2.125rem;
  margin-right: 0.75rem;
  border-radius: 0.5rem;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  @include phone-width {
    flex-basis: 20px;
    width: 20px !important;
    height: 20px;
    margin-right: 0px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}

.wallet-trigger__balance {
  display: block;
  flex: 1 1 0;
  overflow: hidden;
  min-width: 0;
  color: var(--text-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-trigger__currency {
  flex: 0 0 auto;
  margin-left: 4px;
  color: var(--neutral-03, #ffffff78);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.wallet-trigger__chevron {
  flex: 0 0 20px;
  width: 20px;
  margin-left: 4px;
  color: var(--text-01, #ffffff);
  font-size: 20px;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

.deposit-btn {
  box-sizing: border-box;
  width: 72px;
  min-width: 0;
  max-width: 72px;
  height: 40px;
  min-height: 40px;
  padding: 10px;
  background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);
  font-family: "Noto Sans", sans-serif;
  font-size: 14px;
  font-weight: 700;

  :deep(.q-btn__content) {
    justify-content: center;
    flex-wrap: nowrap;
    width: 100%;
    line-height: 1;
  }

  @include phone-width {
    display: none;
  }
}

.deposit-btn__icon {
  display: none;
}

.deposit-btn__label {
  overflow: hidden;
  display: block;
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-popup-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(466px, calc(100vw - 32px));
  max-width: 466px;
  max-height: min(670px, calc(100dvh - 96px));
  overflow: hidden;
  padding: 16px;
  background: #000025;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @include phone-width {
    width: 100%;
    max-width: none;
    max-height: min(670px, calc(100dvh - 96px));
    padding: 14px;
  }
}

.current-wallet {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 42px max-content;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 54px;
  padding: 8px 12px;
  border: 1px solid var(--bg-line-01, #ffffff1a);
  border-radius: 8px;
  background: var(--bg-14, #ffffff1a);
  font-family: "Noto Sans TC", sans-serif;
}

.current-wallet__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  img {
    width: 20px;
    height: 20px;
  }

  @include phone-width {
    width: 20px;
    height: 20px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}

.current-wallet__gift-icon {
  width: 20px;
  height: 20px;
  color: #f5a400;
  font-size: 20px;
}

.current-wallet__label {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.current-wallet__status {
  color: var(--neutral-03, #ffffff78);
  font-size: 10px;
  line-height: 1.2;

  @include phone-width {
    font-size: 10px;
  }
}

.current-wallet__name {
  overflow: hidden;
  color: var(--text-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include phone-width {
    font-size: 14px;
  }
}

.current-wallet__currency {
  box-sizing: border-box;
  overflow: hidden;
  width: 42px;
  height: 22px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: var(--text-01, #ffffff);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__balance {
  color: var(--text-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;

  @include phone-width {
    font-size: 14px;
  }
}

.wallet-popup-divider {
  flex: 0 0 auto;
  height: 0;
  margin: 12px 0 12px;
  border-top: 1px solid var(--bg-line-01, #ffffff1a);
}

.wallet-group-list {
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0;
  scrollbar-width: none;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @include phone-width {
    gap: 8px;
  }
}

.wallet-group {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 8px;
  padding: 10px 12px 12px;
  border-radius: 8px;
  background: var(--bg-14, #ffffff1a);

  @include phone-width {
    gap: 8px;
    padding: 10px 10px 12px;
  }
}

.wallet-group__currency {
  color: var(--text-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;

  @include phone-width {
    font-size: 14px;
  }
}

.wallet-card-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}

.wallet-group--single-cash {
  .wallet-card-grid {
    width: 100%;
  }

  .wallet-card {
    width: 100%;
  }

  .wallet-card__meta {
    gap: 8px;
    font-size: 10px;
    height: 24px;
  }

  .wallet-card__icon-img,
  .wallet-card__icon {
    width: 12px;
    height: 12px;
    font-size: 12px;
  }

  .wallet-card__balance {
    font-size: 14px;
  }

  .wallet-card__state {
    top: 24px;
    right: 12px;
    width: 16px;
    height: 16px;
    border-width: 3px;
  }
}

.wallet-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 16px minmax(60px, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 2px;
  column-gap: 10px;
  min-height: 34px;
  width: 100%;
  height: auto;
  padding: 7px 10px;
  border: 1px solid var(--bg-line-01, #ffffff1a);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 7px 0 #ffffff29 inset, 0 0 7px 0 #ffffff1a;
  color: var(--text-01, #ffffff);
  cursor: pointer;

  @include phone-width {
    min-height: 34px;
    height: auto;
    padding: 7px 10px;
  }
}

.wallet-card--active {
  border-color: transparent;
  background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);
  box-shadow: 4px 4px 6px 0 #ffbe2233, -4px -4px 6px 0 #ffbe2233;
}

.wallet-card--single {
  padding-top: 8px;
  padding-bottom: 8px;
}

.wallet-card__meta {
  display: inline-flex;
  align-items: center;
  grid-column: 2;
  gap: 8px;
  min-width: 0;
  color: var(--neutral-03, #ffffff78);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: var(--text-01, #ffffff);
  }

  @include phone-width {
    gap: 8px;
    font-size: 10px;
  }
}

.wallet-card__icon-img,
.wallet-card__icon {
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  font-size: 12px;

  @include phone-width {
    width: 12px;
    height: 12px;
    font-size: 12px;
  }
}

.wallet-card__balance {
  overflow: hidden;
  grid-column: 3;
  min-width: 0;
  max-width: 100%;
  color: var(--text-01, #ffffff);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include phone-width {
    font-size: 14px;
  }
}

.wallet-card__state {
  position: relative;
  box-sizing: border-box;
  grid-column: 1;
  grid-row: 1;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;

  .wallet-card--active & {
    border-color: #ffcab5;

    &::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      background: #ffffff;
    }
  }

  @include phone-width {
    width: 16px;
    height: 16px;
    border-width: 3px;
  }
}

.wallet-card__transfer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 4;
  gap: 4px;
  min-width: 42px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #c4a3ff;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;

  .wallet-card--active & {
    color: var(--text-01, #ffffff);
  }
}

.wallet-card__transfer-icon {
  width: 14px;
  height: 14px;
  font-size: 14px;
}

.wallet-group--single-cash {
  .wallet-card__meta {
    height: auto;
  }

  .wallet-card__state {
    top: auto;
    right: auto;
  }
}
</style>

<style lang="scss">
.r017-wallet-popup {
  max-height: calc(100dvh - 96px);
  border-radius: 1rem;
  background: var(--dialog-bg-02, #1d125d);
  box-shadow: 0 0 15px 0 var(--bg01, var(--bg-01, #8139ff));
  overflow: hidden;
}

@media (max-width: 768px) {
  .r017-wallet-popup {
    left: max(16px, calc((100vw - 466px) / 2)) !important;
    width: min(466px, calc(100vw - 32px)) !important;
    max-width: min(466px, calc(100vw - 32px));
  }
}
</style>
