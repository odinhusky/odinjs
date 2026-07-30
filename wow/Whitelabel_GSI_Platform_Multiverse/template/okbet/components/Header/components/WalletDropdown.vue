<template>
  <div class="okbet-wallet-dropdown">
    <q-btn flat no-caps class="wallet-trigger" :disable="!isCash" :ripple="false">
      <span class="wallet-trigger__icon">
        <img :src="svgIcon('moneyIcon')" alt="" />
      </span>
      <span class="wallet-trigger__currency">{{ activeWalletLabel }}</span>
      <span class="wallet-trigger__balance">{{ activeHeaderBalance }}</span>
      <span
        class="wallet-trigger__refresh"
        :class="{ 'is-refreshing': isRefreshingWallet }"
        @click.stop.prevent="handleWalletRefresh"
      >
        <img class="wallet-trigger__refresh-img" :src="svgIcon('walletSpin')" alt="" />
      </span>

      <q-menu
        v-model="popupOpen"
        class="okbet-wallet-popup"
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
            <div v-for="walletGroup in walletDropdown" :key="walletGroup.value" class="wallet-group">
              <div class="wallet-group__currency">{{ walletGroup.currencyCode }}</div>
              <div class="wallet-row-list">
                <div
                  v-for="card in walletGroup.cards"
                  :key="`${walletGroup.value}-${card.walletType}`"
                  role="button"
                  tabindex="0"
                  class="wallet-row"
                  :class="{
                    'wallet-row--active': card.isActive,
                  }"
                  @click.stop="handleWalletChange(card)"
                  @keydown.enter.stop="handleWalletChange(card)"
                  @keydown.space.stop.prevent="handleWalletChange(card)"
                >
                  <span class="wallet-row__state"></span>
                  <span class="wallet-row__meta">
                    <img v-if="card.isCash" class="wallet-row__icon-img" :src="svgIcon(card.iconName)" alt="" />
                    <q-icon v-else class="wallet-row__icon" name="card_giftcard" />
                    <span class="wallet-row__label">{{ $t(card.labelKey) }}</span>
                  </span>
                  <span class="wallet-row__balance">{{ card.balance }}</span>
                  <button
                    v-if="card.hasTransferOutAction"
                    type="button"
                    class="wallet-row__transfer"
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
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
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
  cards: WalletCard[]
}

defineProps<{
  module?: string
  bgImage?: string
}>()

const { svgIcon } = useSiteImg()
const { moneyFormat } = useCommon()
const { activeWalletLabel, userWalletList, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } =
  useUserInfo()
const { isCash, isCredit } = useEnv()
const { isMobile } = useMediaQuery()
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

    return {
      value: cashWallet.currency_id,
      walletType: cashWallet.wallet_type,
      currencyCode: getWalletLabel(cashWallet),
      cards: orderedWallets.map(createWalletCard),
    }
  })
})

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
@import "app/template/okbet/assets/css/_variable.sass";

.okbet-wallet-dropdown {
  display: flex;
  align-items: center;
  min-width: 0;

  @include phone-width {
    width: 130px;
    max-height: 32px !important;
  }
}

.wallet-trigger {
  width: 12.4375rem;
  min-width: 0;
  max-width: 12.4375rem;
  height: 40px;
  min-height: 0;
  padding: 0 0.75rem;
  border-radius: 50px;
  background: #7696b1;
  color: var(--text-02);

  @include pad-width {
    width: 12.4375rem;
    min-width: 0;
  }

  @include phone-width {
    width: min(220px, calc(100vw - 170px));
    max-width: min(220px, calc(100vw - 170px));
    max-height: 32px;
    padding: 0 10px;
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
  margin-right: 0.625rem;
  border-radius: 0.5rem;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  @include phone-width {
    flex-basis: 20px;
    width: 20px !important;
    height: 20px;
    margin-right: 0;

    img {
      width: 16px;
      height: 16px;
    }
  }
}

.wallet-trigger__balance {
  display: block;
  flex: 1 1 auto;
  overflow: hidden;
  min-width: 0;
  color: var(--neutral-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include phone-width {
    font-size: 12px;
    font-weight: 600;
  }
}

.wallet-trigger__currency {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  color: var(--neutral-03, #dddedf);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;

  @include phone-width {
    font-size: 12px;
    font-weight: 600;
  }
}

.wallet-trigger__refresh {
  flex: 0 0 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  cursor: pointer;

  @include phone-width {
    font-size: 12px;
    font-weight: 600;
  }
}

.wallet-trigger__refresh-img {
  display: block;
  width: 1rem;
  height: 1rem;
  transform-origin: center;

  @include phone-width {
    width: 12px;
    height: 12px;
  }
}

.wallet-trigger__refresh.is-refreshing .wallet-trigger__refresh-img {
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
  width: min(414px, calc(100vw - 16px));
  max-width: 414px;
  max-height: min(634px, calc(100dvh - 96px));
  min-height: 0;
  overflow: hidden;
  padding: 16px 8px 14px;
  background: var(--dialog-bg-02);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.current-wallet {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) 44px max-content;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 55px;
  padding: 8px 13px;
  border: 1px solid var(--primany-05, #bad5ff);
  border-radius: 8px;
  background: var(--primany-01, #e6effd);
  font-family: "Noto Sans TC", sans-serif;
}

.current-wallet__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;

  img {
    width: 24px;
    height: 24px;
  }
}

.current-wallet__gift-icon {
  width: 24px;
  height: 24px;
  color: #f5a400;
  font-size: 24px;
}

.current-wallet__label {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.current-wallet__status {
  color: var(--text-03);
  font-size: 10px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.current-wallet__name {
  overflow: hidden;
  color: #676767;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__currency {
  box-sizing: border-box;
  overflow: hidden;
  min-width: 44px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--secondary-09, #d2d2d23d);
  color: #4b5678;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__balance {
  overflow: hidden;
  color: #676767;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-popup-divider {
  flex: 0 0 auto;
  height: 1px;
  margin: 12px 0px 12px;
  background: var(--neutral-03, #dddedf);
}

.wallet-group-list {
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.wallet-group {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
  padding: 10px 12px 9px;
  border-radius: 7px;
  background: #f5f5f6;
}

.wallet-group__currency {
  color: #676767;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.wallet-row-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.wallet-row {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 16px minmax(60px, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 32px;
  padding: 7px 12px;
  border: 1px solid var(--bg-line-03);
  border-radius: 7px;
  background: var(--dialog-bg-02);
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.12);
  color: var(--text-02);
  cursor: pointer;
}

.wallet-row--active {
  border-color: transparent;
  background: linear-gradient(105.42deg, #0295e8 0%, #0063ff 100%);
  box-shadow: 0 0 6px 0 #0295e8;
}

.wallet-row__state {
  position: relative;
  box-sizing: border-box;
  display: block;
  width: 15px;
  height: 15px;
  border: 2px solid #aeb4b8;
  border-radius: 999px;

  .wallet-row--active & {
    border-color: var(--neutral-01, #ffffff);

    &::after {
      content: "";
      position: absolute;
      inset: 3px;
      border-radius: inherit;
      background: var(--neutral-01, #ffffff);
    }
  }
}

.wallet-row__meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--text-03);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-row--active & {
    color: var(--neutral-01, #ffffff);
  }
}

.wallet-row__icon-img,
.wallet-row__icon {
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  font-size: 12px;
}

.wallet-row__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-row__balance {
  overflow: hidden;
  min-width: 0;
  color: #676767;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;

  .wallet-row--active & {
    color: var(--neutral-01, #ffffff);
  }
}

.wallet-row__transfer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0295e8;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .wallet-row--active & {
    color: var(--neutral-01, #ffffff);
  }
}
</style>

<style lang="scss">
.okbet-wallet-popup {
  max-height: calc(100dvh - 96px);
  overflow: hidden;
  border-radius: 10px;
  background: var(--dialog-bg-02);
  box-shadow: 0px 0px 6px 0px #00000033;
}

@media (max-width: 768px) {
  .okbet-wallet-popup {
    left: max(8px, calc((100vw - 414px) / 2)) !important;
    width: min(414px, calc(100vw - 16px)) !important;
    max-width: min(414px, calc(100vw - 16px));
  }
}
</style>
