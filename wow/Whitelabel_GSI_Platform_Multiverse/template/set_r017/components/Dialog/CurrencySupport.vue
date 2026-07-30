<template>
  <div v-if="currencySupportDialog.show" class="q-pa-md q-gutter-sm">
    <q-dialog v-model="currencySupportDialog.show" persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card class="currency-support-dialog">
        <q-card-section class="dialog-header">
          <h3 class="dialog-title">{{ $t("in_game_currency") }}</h3>
          <q-btn
            v-if="currencySupportDialog.isAllowSkip"
            class="dialog-close"
            flat
            round
            dense
            icon="close"
            @click="handleCancelClick"
          />
        </q-card-section>

        <template v-if="isCash">
          <q-card-section class="dialog-body">
            <p class="dialog-message">{{ $t("game.currency_modal_title") }}</p>

            <div class="wallet-popup-content">
              <div v-if="walletGroups.length" class="wallet-group-list">
                <div
                  v-for="walletGroup in walletGroups"
                  :key="walletGroup.value"
                  class="wallet-group"
                  :class="{ 'wallet-group--single-cash': walletGroup.hasOnlyCash }"
                >
                  <div class="wallet-group__currency">{{ walletGroup.currencyCode }}</div>
                  <div class="wallet-card-grid">
                    <button
                      v-for="card in walletGroup.cards"
                      :key="`${walletGroup.value}-${card.walletType}`"
                      type="button"
                      class="wallet-card"
                      :class="{
                        'wallet-card--active': card.isSelected,
                        'wallet-card--single': walletGroup.hasOnlyCash,
                        'wallet-card--disabled': card.isDisabled,
                      }"
                      :disabled="card.isDisabled"
                      @click.stop="selectWallet(card)"
                    >
                      <span class="wallet-card__state"></span>
                      <span class="wallet-card__meta">
                        <img
                          v-if="card.isCash"
                          class="wallet-card__icon-img"
                          :src="svgIcon(getCashIconName(card))"
                          alt=""
                        />
                        <q-icon v-else class="wallet-card__icon" name="card_giftcard" />
                        <span>{{ $t(card.labelKey) }}</span>
                      </span>
                      <span class="wallet-card__balance">{{ card.balance }}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="wallet-empty-state">{{ $t("tableHeader.no_data") }}</div>
            </div>
          </q-card-section>

          <q-card-section
            class="dialog-actions"
            :class="{ 'dialog-actions--single': !currencySupportDialog.isAllowSkip }"
          >
            <q-btn
              v-if="currencySupportDialog.isAllowSkip"
              class="action-btn action-btn--cancel"
              flat
              no-caps
              :ripple="false"
              @click="handleCancelClick"
            >
              {{ $t("common.btn.cancel") }}
            </q-btn>
            <q-btn class="action-btn action-btn--play" flat no-caps :ripple="false" @click="handlePlayNowClick">
              {{ $t("game.play_now") }}
            </q-btn>
          </q-card-section>
        </template>

        <q-card-section v-else class="dialog-body dialog-body--message">
          {{ $t("common.alarm.currencyNotSupport") }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import type { CurrencySupportWalletCard } from "src/common/composables/useCurrencySupportDialog"
import { useCurrencySupportDialog } from "src/common/composables/useCurrencySupportDialog"

const { svgIcon } = useSiteImg()
const { currencySupportDialog, isCash, walletGroups, selectWallet, handlePlayNowClick, handleCancelClick } =
  useCurrencySupportDialog()

const getCashIconName = (card: CurrencySupportWalletCard): string => (card.isSelected ? "moneyIcon" : "moneyIconWhite")
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.currency-support-dialog {
  display: flex;
  flex-direction: column;
  width: min(640px, calc(100vw - 32px));
  max-width: 640px !important;
  max-height: min(90vh, 720px);
  overflow: hidden;
  border-radius: 16px;
  background: var(--dialog-bg-02, #1d125d);
  color: var(--text-01, #ffffff);
  box-shadow: 0 0 15px 0 var(--bg01, var(--bg-01, #8139ff));
  font-family: "Noto Sans TC", sans-serif;
}

.dialog-header {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  padding: 18px 56px;
  background: var(--dialog-bg-02, #1d125d);
}

.dialog-title {
  margin: 0;
  color: var(--text-01, #ffffff);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.dialog-close {
  position: absolute;
  top: 18px;
  right: 18px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  color: var(--text-01, #ffffff);

  :deep(.q-icon) {
    font-size: 30px;
  }
}

.dialog-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 0 20px 20px;
  background: #000025;
}

.dialog-body--message {
  padding: 24px;
  color: var(--text-01, #ffffff);
  font-size: 16px;
  font-weight: 700;
}

.dialog-message {
  margin: 0;
  padding: 18px 0;
  color: var(--text-01, #ffffff);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}

.wallet-popup-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(430px, calc(90vh - 220px));
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border-radius: 12px;
  background: #000025;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.wallet-group-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 17px;
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
}

.wallet-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  color: var(--text-01, #ffffff);
  font-size: 16px;
  font-weight: 700;
}

.wallet-group {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  padding: 10px 12px 12px;
  border-radius: 8px;
  background: var(--bg-14, #ffffff1a);
}

.wallet-group__currency {
  color: var(--text-01, #ffffff);
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
  }

  .wallet-card {
    width: 100%;
  }

  .wallet-card__meta {
    gap: 8px;
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
    width: 16px;
    height: 16px;
    border-width: 3px;
  }
}

.wallet-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 16px minmax(60px, auto) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid var(--bg-line-01, #ffffff1a);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 7px 0 #ffffff29 inset, 0 0 7px 0 #ffffff1a;
  color: var(--text-01, #ffffff);
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.wallet-card--active {
  border-color: transparent;
  background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);
  box-shadow: 4px 4px 6px 0 #ffbe2233, -4px -4px 6px 0 #ffbe2233;
}

.wallet-card--disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.wallet-card__meta {
  display: flex;
  align-items: center;
  grid-column: 2;
  gap: 8px;
  min-width: 0;
  color: var(--neutral-03, #ffffff78);
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: var(--text-01, #ffffff);
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
  color: var(--text-01, #ffffff);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wallet-card__state {
  position: relative;
  box-sizing: border-box;
  grid-column: 1;
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
}

.dialog-actions {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  padding: 18px 20px 20px;
  background: var(--dialog-bg-02, #1d125d);
}

.dialog-actions--single {
  grid-template-columns: minmax(0, 1fr);
}

.action-btn {
  min-height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
}

.action-btn--cancel {
  border: 1px solid #f26319;
  color: #f26319;
}

.action-btn--play {
  background: linear-gradient(90deg, #f26319 0%, #d12d00 100%);
  color: var(--text-01, #ffffff);
}

@include phone-width {
  .currency-support-dialog {
    width: min(100vw - 16px, 640px);
    max-height: calc(100vh - 16px);
  }

  .dialog-header {
    min-height: 64px;
    padding: 16px 50px;
  }

  .dialog-title {
    font-size: 20px;
  }

  .dialog-close {
    top: 16px;
    right: 14px;
  }

  .dialog-body {
    padding: 0 14px 14px;
  }

  .dialog-message {
    font-size: 15px;
  }

  .wallet-popup-content {
    max-height: calc(100vh - 216px);
    padding: 14px;
  }

  .wallet-group-list {
    gap: 18px;
    padding-right: 0;
  }

  .wallet-group {
    gap: 8px;
    padding: 10px 10px 12px;
  }

  .wallet-card {
    padding: 7px 10px;
  }

  .dialog-actions {
    gap: 10px;
    padding: 14px;
  }
}
</style>
