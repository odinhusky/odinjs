<template>
  <div class="r031-wallet-dropdown">
    <q-btn flat no-caps class="wallet-trigger" :disable="!isCash" :ripple="false">
      <span class="wallet-trigger__icon">
        <img :src="svgIcon(currentWalletIconName)" alt="" />
      </span>
      <span class="wallet-trigger__balance">{{ activeHeaderBalance }}</span>
      <span class="wallet-trigger__currency">{{ activeWalletCurrencyLabel }}</span>
      <q-icon class="wallet-trigger__chevron" :class="{ 'is-open': popupOpen }" name="keyboard_arrow_down" />

      <q-menu
        v-model="popupOpen"
        class="r031-wallet-popup"
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
                    <img class="wallet-card__transfer-icon" :src="svgIcon('bonusTransferOut')" alt="" />
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
      <span class="deposit-btn__label">{{ $t("common.btn.deposit") }}</span>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r031/hooks/useSiteImg"
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
const { userWalletList, userWalletMap, getWalletLabel, setUserActiveWallet } = useUserInfo()
const { isCash, isCredit } = useEnv()
const { isMobile } = useMediaQuery()
const eventbus = injectStrict(EventBusKey)

const popupOpen = ref(false)

const walletTypeOrder: WALLET_TYPE.Enums[] = [WALLET_TYPE.Enums.Cash, WALLET_TYPE.Enums.Reward, WALLET_TYPE.Enums.Bonus]

const walletMenuAnchor = computed((): "bottom middle" | "bottom right" =>
  isMobile.value ? "bottom middle" : "bottom right"
)
const walletMenuSelf = computed((): "top middle" | "top right" => (isMobile.value ? "top middle" : "top right"))
const walletMenuOffset = computed((): [number, number] => (isMobile.value ? [0, 16] : [0, 12]))
const walletPopupMaxHeight = "calc(100dvh - 96px)"

const isWalletInUse = (wallet: Response.UserWallet): boolean => wallet.in_use === true

const activeWallet = computed<Response.UserWallet | null>(() => {
  return userWalletList.value.find(isWalletInUse) ?? null
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
  const shouldUseActiveIcon = isWalletInUse(wallet)

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
    isActive: isWalletInUse(wallet),
    isCash: isCashWallet,
    iconName: resolveWalletIconName(wallet),
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

const handleWalletChange = async (card: WalletCard): Promise<void> => {
  popupOpen.value = false
  await setUserActiveWallet({ currency_id: card.currencyId, wallet_type: card.walletType })
}

const handleTransferOut = async (card: WalletCard): Promise<void> => {
  popupOpen.value = false
  eventbus.emit("openBonusTransferDetail", true, card.currencyId)
}

const handleDepositClick = (): void => {
  props.onAction?.()
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r031/assets/css/_variable.scss";

.r031-wallet-dropdown {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background: var(--bg-05, #180e20);

  @include phone-width {
    border-radius: 0.375rem;
  }
}

.wallet-trigger,
.deposit-btn {
  height: 100%;
  border-radius: 0;
  color: var(--text-01);
}

.wallet-trigger {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  padding: 0 10px;
  background: var(--bg-05, #180e20);

  @include phone-width {
    padding: 0 0.75rem;
  }

  :deep(.q-btn__content) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    width: 100%;
    min-width: 0;
    gap: 10px;

    @include phone-width {
      gap: 4px;
    }
  }
}

.wallet-trigger__icon {
  flex: 0 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1.125rem;

  img {
    width: 1.25rem;
    height: 1.25rem;
  }

  @include phone-width {
    flex-basis: 20px;
    width: 20px !important;
    height: 20px;
    margin-right: 0rem;

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
  color: var(--text-01);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-trigger__currency {
  flex: 0 0 auto;
  margin-left: 4px;
  color: var(--text-01);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.wallet-trigger__chevron {
  flex: 0 0 2rem;
  width: 20px;
  margin-left: 4px;
  color: var(--text-01);
  font-size: 20px;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

.deposit-btn {
  box-sizing: border-box;
  width: 80px;
  min-width: 0;
  height: 40px;
  min-height: 40px;
  padding: 10px;
  background: var(--btn-bg-01, #ce4388);
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
  max-height: min(560px, calc(100vh - 96px));
  overflow: hidden;
  padding: 16px 13px;
  background: var(--card-bg-02, #1e1335);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @include phone-width {
    width: 100%;
    max-width: none;
    max-height: calc(100vh - 96px);
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
  border: 1px solid var(--bg-line-01);
  border-radius: 8px;
  background: var(--card-bg-06, #9333ea80);
  font-family: "Noto Sans TC", sans-serif;

  @include phone-width {
    grid-template-columns: 20px minmax(0, 1fr) 42px max-content;
    gap: 12px;
    // width: calc(100% + 24px);
    height: 54px;
    margin: 0px;
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

  @include phone-width {
    width: 20px;
    height: 20px;

    img {
      width: 20px;
      height: 20px;
    }
  }
}

.current-wallet__label {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.current-wallet__status {
  color: var(--neutral-03);
  font-size: 10px;
  line-height: 1.2;

  @include phone-width {
    font-size: 10px;
  }
}

.current-wallet__name {
  overflow: hidden;
  color: var(--text-01);
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
  min-width: 42px;
  max-width: 54px;
  height: 22px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--bg-14);
  color: var(--text-01);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-wallet__balance {
  color: var(--text-01);
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
  border-top: 1px solid var(--bg-line-01);
}

.wallet-group-list {
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  gap: 16px;
  max-height: 410px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;
  scrollbar-width: none;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @include phone-width {
    gap: 18px;
    padding-right: 0;
  }
}

.wallet-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  background: #1a0530;
  border-radius: 8px;
  padding: 10px 12px 12px;

  @include phone-width {
    gap: 10px;
  }
}

.wallet-group__currency {
  color: var(--text-01);
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
    gap: 8px;
  }
}

.wallet-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 16px minmax(60px, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--bg-line-01, #ffffff1a);
  background: var(--card-bg-01, #1a0530);
  box-shadow: 0px 0px 4px 0px #ffffff26;
  color: var(--text-01);
  cursor: pointer;

  @include phone-width {
    height: 36px;
    padding: 0 10px;
  }
}

.wallet-card--active:not(.wallet-card--bonus) {
  border-color: transparent;
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
}

.wallet-card--single {
  padding-top: 0;
  padding-bottom: 0;
}

.wallet-card__meta {
  display: flex;
  align-items: center;
  grid-column: 2;
  gap: 6px;
  min-width: 0;
  color: var(--neutral-03);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: var(--text-01);
  }

  @include phone-width {
    gap: 8px;
    font-size: 10px;
  }
}

.wallet-card__icon-img,
.wallet-card__icon {
  flex: 0 0 auto;
  display: block;
  width: 11px;
  height: 11px;
  font-size: 12px;

  @include phone-width {
    width: 11px;
    height: 11px;
    font-size: 12px;
  }
}

.wallet-card__balance {
  overflow: hidden;
  justify-self: start;
  grid-column: 3;
  max-width: 100%;
  color: var(--text-01);
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
  border: 2px solid var(--neutral-03);
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

  @include phone-width {
    width: 16px;
    height: 16px;
    border-width: 2px;
  }
}

.wallet-card__transfer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 4;
  gap: 4px;
  min-width: 30px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--icon-04, #ce4388);
  font-family: "Noto Sans TC", sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.wallet-card__transfer-icon {
  flex: 0 0 auto;
  display: block;
  width: 14px;
  height: 14px;
}
</style>

<style lang="scss">
.r031-wallet-popup {
  max-height: calc(100dvh - 96px);
  overflow: hidden;
  border-radius: 1rem;
  background: var(--dialog-bg-02);
  box-shadow: 0 0 15px 0 var(--primany-01);
}

@media (max-width: 768px) {
  .r031-wallet-popup {
    left: max(16px, calc((100vw - 466px) / 2)) !important;
    width: min(466px, calc(100vw - 32px)) !important;
    max-width: min(466px, calc(100vw - 32px));
  }
}
</style>
