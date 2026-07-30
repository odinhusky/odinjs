<template>
  <div class="r025-wallet-dropdown">
    <q-btn flat no-caps class="wallet-trigger" :disable="!isCash" :ripple="false">
      <span class="wallet-trigger__icon">
        <img :src="svgIcon(currentWalletIconName)" alt="" />
      </span>
      <span class="wallet-trigger__currency">{{ activeWalletCurrencyLabel }}</span>
      <span class="wallet-trigger__balance">{{ activeHeaderBalance }}</span>
      <span
        class="wallet-trigger__refresh"
        :class="{ 'is-refreshing': isRefreshingWallet }"
        @click.stop.prevent="handleWalletRefresh"
      >
        <q-icon name="sync" />
      </span>

      <q-menu
        v-model="popupOpen"
        class="r025-wallet-popup"
        :anchor="walletMenuAnchor"
        :self="walletMenuSelf"
        :offset="walletMenuOffset"
        :max-height="walletPopupMaxHeight"
      >
        <div class="wallet-popup-content">
          <div v-if="activeWallet" class="current-wallet">
            <span class="current-wallet__icon">
              <img :src="svgIcon(currentWalletIconName)" alt="" />
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
                    'wallet-card--bonus': card.hasTransferOutAction,
                    'wallet-card--single': walletGroup.hasOnlyCash,
                  }"
                  @click.stop="handleWalletChange(card)"
                  @keydown.enter.stop="handleWalletChange(card)"
                  @keydown.space.stop.prevent="handleWalletChange(card)"
                >
                  <span class="wallet-card__state"></span>
                  <span class="wallet-card__meta">
                    <img class="wallet-card__icon-img" :src="svgIcon(card.iconName)" alt="" />
                    <span>{{ $t(card.labelKey) }}</span>
                  </span>
                  <span class="wallet-card__balance">{{ card.balance }}</span>
                  <button
                    v-if="card.hasTransferOutAction"
                    type="button"
                    class="wallet-card__transfer"
                    @click.stop.prevent="handleTransferOut(card)"
                  >
                    <span
                      class="wallet-card__transfer-icon"
                      :style="{ '--wallet-transfer-icon-url': `url('${svgIcon('bonusTransferOut')}')` }"
                    ></span>
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
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
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
const { userWalletList, userWalletMap, getWalletLabel, setUserActiveWallet, getUserWalletList } = useUserInfo()
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
const walletMenuOffset = computed((): [number, number] => (isMobile.value ? [0, 12] : [0, 10]))
const walletPopupMaxHeight = "calc(100dvh - 96px)"

const activeWallet = computed<Response.UserWallet | null>(() => {
  return userWalletList.value.find((wallet: Response.UserWallet) => wallet.in_use) ?? null
})

const activeWalletBalance = computed((): string | number => moneyFormat(activeWallet.value?.balance || "0"))
const activeWalletCurrencyLabel = computed((): string => (activeWallet.value ? getWalletLabel(activeWallet.value) : ""))
const currentWalletIconName = computed((): string => {
  if (!activeWallet.value) return "moneyWhite"

  return activeWallet.value.wallet_type === WALLET_TYPE.Enums.Cash ? "moneyYellow" : "giftYellow"
})

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

const resolveWalletIconName = (wallet: Response.UserWallet): string => {
  const shouldUseActiveIcon = wallet.in_use === true

  if (wallet.wallet_type === WALLET_TYPE.Enums.Cash) {
    return shouldUseActiveIcon ? "moneyYellow" : "moneyWhite"
  }

  return shouldUseActiveIcon ? "giftYellow" : "giftWhite"
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
    isActive: wallet.in_use === true,
    isCash: isCashWallet,
    iconName: resolveWalletIconName(wallet),
    hasTransferOutAction,
  }
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  if (isCredit.value) return []

  return Object.keys(userWalletMap.value)
    .map((currencyCode) => {
      const wallets = userWalletMap.value[currencyCode]
      const cashWallet = wallets[WALLET_TYPE.Enums.Cash]
      const orderedWallets = walletTypeOrder
        .map((walletType) => wallets[walletType])
        .filter((wallet): wallet is Response.UserWallet => Boolean(wallet))

      if (!cashWallet || !orderedWallets.length) return null

      return {
        value: cashWallet.currency_id,
        walletType: cashWallet.wallet_type,
        currencyCode: getWalletLabel(cashWallet),
        hasOnlyCash: orderedWallets.length === 1 && orderedWallets[0].wallet_type === WALLET_TYPE.Enums.Cash,
        cards: orderedWallets.map(createWalletCard),
      }
    })
    .filter((item): item is WalletDropItem => Boolean(item))
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
@import "app/template/set_r025/assets/css/_variable.sass";

.r025-wallet-dropdown {
  display: flex;
  align-items: center;
  min-width: 0;

  @include phone-width {
    width: min(10.5rem, calc(100vw - 12rem));
  }
}

.wallet-trigger {
  width: 12.25rem;
  min-width: 0;
  height: 2.5rem;
  min-height: 0;
  padding: 0 0.75rem;
  border-radius: 3.125rem;
  background: $functional-input;
  color: $neutral-01;

  @include phone-width {
    width: 100%;
    height: 2rem;
    padding: 0 0.5rem;
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
  flex: 0 0 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  @include phone-width {
    flex-basis: 1rem;
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;

    img {
      width: 1rem;
      height: 1rem;
    }
  }
}

.wallet-trigger__currency {
  flex: 0 0 auto;
  max-width: 3.5rem;
  overflow: hidden;
  margin-right: 0.5rem;
  color: $neutral-02;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include phone-width {
    max-width: 2.5rem;
    margin-right: 0.25rem;
    font-size: 0.75rem;
  }
}

.wallet-trigger__balance {
  display: block;
  flex: 1 1 auto;
  overflow: hidden;
  min-width: 0;
  color: $neutral-01;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include phone-width {
    font-size: 0.75rem;
  }
}

.wallet-trigger__refresh {
  flex: 0 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  color: $neutral-01;
  cursor: pointer;

  :deep(.q-icon) {
    font-size: 1rem;
  }

  @include phone-width {
    margin-left: 0.25rem;
  }
}

.wallet-trigger__refresh.is-refreshing {
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
  width: min(26rem, calc(100vw - 1rem));
  max-width: 26rem;
  max-height: calc(100dvh - 6rem);
  overflow: hidden;
  padding: 1rem 0.75rem;
  background: $secondary-card;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.current-wallet {
  box-sizing: border-box;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1.625rem minmax(0, 1fr) 3.5rem max-content;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 3.5rem;
  padding: 0.5rem 0.8125rem;
  border: 1px solid $functional-line;
  border-radius: 0.5rem;
  background: $secondary-card-secondary;
}

.current-wallet__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.current-wallet__label {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.current-wallet__status {
  color: $neutral-02;
  font-size: 0.625rem;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.current-wallet__name {
  overflow: hidden;
  color: $neutral-01;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__currency {
  box-sizing: border-box;
  overflow: hidden;
  min-width: 2.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: $neutral-04;
  color: $neutral-01;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__balance {
  overflow: hidden;
  color: $neutral-01;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-popup-divider {
  flex: 0 0 auto;
  height: 0;
  margin: 0.75rem 0;
  border-top: 1px solid $functional-line;
}

.wallet-group-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.75rem;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: $secondary-card-dark;
}

.wallet-group__currency {
  color: $neutral-01;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
}

.wallet-card-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
}

.wallet-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1rem minmax(3.75rem, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 2.25rem;
  padding: 0 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid $functional-line;
  background: $secondary-card-secondary;
  color: $neutral-01;
  cursor: pointer;
}

.wallet-card--active:not(.wallet-card--bonus) {
  border-color: transparent;
  background: linear-gradient(90deg, $primany-01 0%, $secondary-card-light-2 100%);
}

.wallet-card__state {
  position: relative;
  box-sizing: border-box;
  grid-column: 1;
  grid-row: 1;
  width: 1rem;
  height: 1rem;
  border: 2px solid $neutral-02;
  border-radius: 999px;

  .wallet-card--active & {
    border-color: $primany-02;

    &::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      background: $primany-02;
    }
  }
}

.wallet-card__meta {
  display: flex;
  align-items: center;
  grid-column: 2;
  gap: 0.375rem;
  min-width: 0;
  color: $neutral-02;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: $neutral-01;
  }
}

.wallet-card__icon-img {
  flex: 0 0 auto;
  display: block;
  width: 0.75rem;
  height: 0.75rem;
}

.wallet-card__balance {
  overflow: hidden;
  grid-column: 3;
  justify-self: start;
  max-width: 100%;
  color: $neutral-01;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-card__transfer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 4;
  gap: 0.25rem;
  min-width: 2rem;
  height: 1.125rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: $primany-02;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.wallet-card__transfer-icon {
  flex: 0 0 auto;
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  background: $primany-02;
  mask-image: var(--wallet-transfer-icon-url);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  -webkit-mask-image: var(--wallet-transfer-icon-url);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
}
</style>

<style lang="scss">
@import "app/template/set_r025/assets/css/_variable.sass";

.r025-wallet-popup {
  max-height: calc(100dvh - 96px);
  overflow: hidden;
  border-radius: 0.75rem;
  background: $secondary-card;
  box-shadow: 0 0 15px 0 rgba($primany-01, 0.6);
}

@media (max-width: 768px) {
  .r025-wallet-popup {
    left: max(8px, calc((100vw - 416px) / 2)) !important;
    width: min(416px, calc(100vw - 16px)) !important;
    max-width: min(416px, calc(100vw - 16px));
  }
}
</style>
