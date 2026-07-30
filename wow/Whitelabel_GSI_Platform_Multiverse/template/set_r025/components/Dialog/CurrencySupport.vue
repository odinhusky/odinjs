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
                        <img class="wallet-card__icon-img" :src="svgIcon(getWalletIconName(card))" alt="" />
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
import { useSiteImg } from "app/template/set_r025/hooks/useSiteImg"
import type { CurrencySupportWalletCard } from "src/common/composables/useCurrencySupportDialog"
import { useCurrencySupportDialog } from "src/common/composables/useCurrencySupportDialog"

const { svgIcon } = useSiteImg()
const { currencySupportDialog, isCash, walletGroups, selectWallet, handlePlayNowClick, handleCancelClick } =
  useCurrencySupportDialog()

const getWalletIconName = (card: CurrencySupportWalletCard): string => {
  if (card.isCash) return card.isSelected ? "moneyYellow" : "moneyWhite"

  return card.isSelected ? "giftYellow" : "giftWhite"
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r025/assets/css/_variable.sass";

.currency-support-dialog {
  display: flex;
  flex-direction: column;
  width: min(784px, calc(100vw - 32px));
  max-width: 784px !important;
  max-height: min(90vh, 820px);
  overflow: hidden;
  border-radius: 12px;
  background: $secondary-card;
  color: $neutral-01;
  font-family: "Noto Sans TC", sans-serif;
}

.dialog-header {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 59px;
  background: $background-header;
}

.dialog-title {
  margin: 0;
  color: $neutral-01;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 24px;
  width: 20px;
  height: 20px;
  padding: 0;
  color: $neutral-01;

  :deep(.q-icon) {
    font-size: 20px;
  }
}

.dialog-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 24px 28px 22px;
  background: $secondary-card;
}

.dialog-body--message {
  overflow-y: auto;
  color: $neutral-01;
  font-size: 16px;
  font-weight: 600;
}

.dialog-message {
  margin: 0 0 18px;
  color: #ffffffc4;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.wallet-popup-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(674px, calc(94vh - 340px));
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border-radius: 24px;
  background: $secondary-card-dark;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.wallet-group-list {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 18px;
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
}

.wallet-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  color: #ffffffc4;
  font-size: 24px;
  font-weight: 600;
}

.wallet-group {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 20px;
  background: $secondary-card-secondary;
}

.wallet-group__currency {
  color: $neutral-01;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.wallet-card-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}

.wallet-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 20px max-content minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 36px;
  padding: 0 16px;
  border: 1px solid $functional-line;
  border-radius: 8px;
  background: $secondary-card-secondary;
  box-shadow: 0 0 10px 0 #ffffff29;
  color: $neutral-01;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.wallet-card--active {
  border-color: transparent;
  background: linear-gradient(90deg, $primany-01 0%, $secondary-card-light-2 100%);
  box-shadow: 0 0 10px 0 $primany-01;
}

.wallet-card--disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.wallet-card__meta {
  display: flex;
  align-items: center;
  grid-column: 2;
  gap: 6px;
  min-width: 0;
  color: $neutral-02;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;

  .wallet-card--active & {
    color: $neutral-01;
  }
}

.wallet-card__icon-img {
  flex: 0 0 auto;
  display: block;
  width: 12px;
  height: 12px;
}

.wallet-card__balance {
  overflow: hidden;
  grid-column: 3;
  justify-self: start;
  max-width: 100%;
  color: $neutral-01;
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
  width: 20px;
  height: 20px;
  border: 3px solid $neutral-02;
  border-radius: 999px;

  .wallet-card--active & {
    border-color: $primany-02;

    &::after {
      content: "";
      position: absolute;
      inset: 4px;
      border-radius: inherit;
      background: $primany-02;
    }
  }
}

.dialog-actions {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  padding: 16px;
  background: $background-header;

  &.dialog-actions--single {
    grid-template-columns: minmax(0, 1fr);
  }
}

.action-btn {
  height: 50px;
  min-height: 50px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 700;
}

.action-btn--cancel {
  border: 1px solid $neutral-01;
  color: $neutral-01;
}

.action-btn--play {
  background: $primany-01;
  color: $neutral-01;
}

@include phone-width {
  .currency-support-dialog {
    width: min(100vw - 16px, 784px);
    max-height: calc(100vh - 16px);
    border-radius: 12px;
  }

  .dialog-header {
    height: 59px;
  }

  .dialog-title {
    font-size: 20px;
  }

  .dialog-close {
    top: 16px;
    right: 14px;

    :deep(.q-icon) {
      font-size: 28px;
    }
  }

  .dialog-body {
    padding: 18px 14px;
  }

  .dialog-message {
    font-size: 16px;
  }

  .wallet-popup-content {
    max-height: calc(100vh - 220px);
    padding: 18px 14px;
  }

  .wallet-group {
    gap: 12px;
    padding: 10px 12px 12px;
    border-radius: 12px;
  }

  .wallet-group__currency {
    font-size: 18px;
  }

  .wallet-card {
    min-height: 64px;
    grid-template-columns: 18px max-content minmax(0, 1fr);
    gap: 8px;
    padding: 0 12px;
    border-width: 1px;
    border-radius: 8px;
  }

  .wallet-card__state {
    width: 20px;
    height: 20px;
    border-width: 3px;

    .wallet-card--active &::after {
      inset: 4px;
    }
  }

  .wallet-card__meta {
    gap: 6px;
    font-size: 14px;
  }

  .wallet-card__icon-img {
    width: 14px;
    height: 14px;
  }

  .wallet-card__balance {
    font-size: 18px;
  }

  .dialog-actions {
    gap: 16px;
    padding: 16px;
  }
}
</style>
