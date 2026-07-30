<template>
  <div class="set-r022-wallet-dropdown">
    <q-btn flat no-caps class="wallet-trigger" :disable="!isCash" :ripple="false">
      <div v-if="activeWallet" class="wallet-trigger__content" @click.stop.prevent="handleWalletTriggerContentClick">
        <div class="wallet-trigger__label">{{ activeWalletLabel }}</div>
        <div class="wallet-trigger__balance-row">
          <span
            class="wallet-trigger__refresh"
            :class="{ 'is-refreshing': isRefreshingWallet }"
            @click.stop.prevent="handleWalletRefresh"
          >
            <q-icon name="sync" />
          </span>
          <span class="wallet-trigger__balance">{{ activeHeaderBalance }}</span>
        </div>
      </div>
      <img :src="svgIcon('moneyIcon')" alt="" />
      <q-menu
        v-model="popupOpen"
        :class="['set-r022-wallet-popup', { 'set-r022-wallet-popup--dark': isDarkMode }]"
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
                    <span>{{ $t("cash.transferOut") }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useQuasar } from "quasar"
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

const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
const { activeWalletLabel, userWalletList, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()
const { isCash, isCredit } = useEnv()
const { isMobile } = useMediaQuery()
const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)

const popupOpen = ref(false)
const isRefreshingWallet = ref(false)

const walletTypeOrder: WALLET_TYPE.Enums[] = [WALLET_TYPE.Enums.Cash, WALLET_TYPE.Enums.Reward, WALLET_TYPE.Enums.Bonus]

const walletMenuAnchor = computed((): "bottom middle" | "bottom right" =>
  isMobile.value ? "bottom middle" : "bottom right"
)
const walletMenuSelf = computed((): "top middle" | "top right" => (isMobile.value ? "top middle" : "top right"))
const walletMenuOffset = computed((): [number, number] => (isMobile.value ? [0, 16] : [0, 12]))
const walletPopupMaxHeight = "calc(100dvh - 96px)"
const isDarkMode = computed((): boolean => $q.dark.isActive)

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
    iconName: wallet.in_use ? "moneyIcon" : "walletIcon",
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

const handleWalletTriggerContentClick = (): void => {
  popupOpen.value = !popupOpen.value
}

const handleWalletChange = async (card: WalletCard): Promise<void> => {
  popupOpen.value = false
  await setUserActiveWallet({ currency_id: card.currencyId, wallet_type: card.walletType })
}

const handleTransferOut = async (card: WalletCard): Promise<void> => {
  popupOpen.value = false
  eventbus.emit("openBonusTransferDetail", true, card.currencyId)
}

const handleWalletRefresh = async (): Promise<void> => {
  if (isRefreshingWallet.value) return

  isRefreshingWallet.value = true

  try {
    await getUserWalletList()
  } finally {
    isRefreshingWallet.value = false
  }
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.set-r022-wallet-dropdown {
  display: flex;
  align-items: center;
  min-width: 0;
  margin-right: 0.47875rem;
}

.wallet-trigger {
  min-width: 5.5rem;
  min-height: 0;
  padding: 0;
  color: var(--secondary-01);

  @include pad-large-width {
    min-width: 4.5rem;
    white-space: nowrap;
  }

  :deep(.q-btn__content) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    min-width: 0;
  }
}

.wallet-trigger__content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.2;
  margin-right: 8px;
}

.wallet-trigger__label {
  max-width: 100%;
  overflow: hidden;
  color: var(--primary-02, #6c7890);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-trigger__balance-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 100%;
  min-width: 0;
}

.wallet-trigger__balance {
  display: block;
  overflow: hidden;
  min-width: 0;
  color: var(--secondary-01);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-trigger__refresh {
  flex: 0 0 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.25rem;
  color: var(--primary-01);
  cursor: pointer;

  .q-icon {
    font-size: 0.75rem;
    transform-origin: center;
  }
}

.wallet-trigger__refresh.is-refreshing .q-icon {
  animation: walletRefreshSpin 0.8s linear infinite;
}

@keyframes walletRefreshSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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
  background: var(--bg-side);
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
  border: 1px solid #025be814;
  border-radius: 8px;
  background: var(--primary-07, #f6f7f8);
  font-family: "Noto Sans TC", sans-serif;

  @include phone-width {
    grid-template-columns: 20px minmax(0, 1fr) 42px max-content;
    gap: 12px;
    width: calc(100% + 24px);
    height: 54px;
    margin: 0 -12px;
    padding: 8px 12px;
  }
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
}

.current-wallet__status {
  margin-bottom: 4px;
  color: var(--text-03);
  font-size: 10px;
  line-height: 1.2;
}

.current-wallet__name {
  overflow: hidden;
  color: var(--primary-02, #6c7890);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__currency {
  box-sizing: border-box;
  overflow: hidden;
  width: 42px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--neutral-08, #0000003d);
  color: var(--neutral-01, #ffffff);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__balance {
  color: var(--text-02);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.wallet-popup-divider {
  flex: 0 0 auto;
  height: 0;
  margin: 12px 0;
  border-top: 1px solid var(--bg-line-03);

  @include phone-width {
    box-sizing: border-box;
    width: calc(100% + 40px);
    height: 1px;
    margin: 12px -20px;
    padding: 0 8px;
    border-top: 0;
    background: var(--bg-line-03);
    background-clip: content-box;
  }
}

.wallet-group-list {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
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
  background: var(--primary-07, #f6f7f8);

  @include phone-width {
    gap: 8px;
    padding: 10px 10px 12px;
  }
}

.wallet-group__currency {
  color: var(--text-02);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
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
    grid-template-columns: minmax(0, 1fr);
  }

  .wallet-card {
    width: 100%;
  }

  .wallet-card__meta {
    gap: 8px;
    height: 24px;
    font-size: 10px;
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
  gap: 10px;
  width: 100%;
  min-height: 34px;
  height: auto;
  padding: 7px 10px;
  border: 1px solid var(--bg-line-03);
  border-radius: 8px;
  background: var(--neutral-01);
  box-shadow: 0 0 7px 0 var(--neutral-07);
  color: var(--text-02);
  cursor: pointer;

  @include phone-width {
    min-height: 34px;
    height: auto;
    padding: 7px 10px;
  }
}

.wallet-card--active {
  border-color: transparent;
  background: linear-gradient(105.42deg, var(--primary-03) 0%, var(--primary-01) 100%);
  box-shadow: 0 0 6px 0 var(--primary-01);
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
  color: var(--text-03);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: var(--text-01);
  }
}

.wallet-card__icon-img,
.wallet-card__icon {
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  font-size: 12px;
}

.wallet-card__balance {
  overflow: hidden;
  grid-column: 3;
  min-width: 0;
  max-width: 100%;
  color: var(--text-02);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;

  .wallet-card--active & {
    color: var(--text-01);
  }
}

.wallet-card__state {
  position: relative;
  box-sizing: border-box;
  grid-column: 1;
  grid-row: 1;
  width: 16px;
  height: 16px;
  border: 2px solid var(--neutral-05, #8a8a8a);
  border-radius: 999px;

  .wallet-card--active & {
    border-color: var(--text-01);

    &::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      background: var(--text-01);
    }
  }
}

.wallet-card__transfer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 4;
  min-width: 30px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--primary-01);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;

  .wallet-card--active & {
    color: var(--text-01);
  }
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
.set-r022-wallet-popup {
  max-height: calc(100dvh - 96px);
  overflow: hidden;
  border-radius: 1rem;
  background: var(--bg-side);
  box-shadow: 0 0 10px 0 var(--neutral-08);
}

.set-r022-wallet-popup--dark {
  .wallet-popup-content {
    background: #143241;
  }

  .current-wallet {
    background: #0d2533;
  }

  .wallet-group {
    background: #0d2533;
  }

  .wallet-card:not(.wallet-card--active) {
    background: #143241;
  }
}

@media (max-width: 768px) {
  .set-r022-wallet-popup {
    left: max(4px, calc((100vw - 466px) / 2)) !important;
    width: min(466px, calc(100vw - 8px)) !important;
    max-width: min(466px, calc(100vw - 8px)) !important;
  }
}
</style>
