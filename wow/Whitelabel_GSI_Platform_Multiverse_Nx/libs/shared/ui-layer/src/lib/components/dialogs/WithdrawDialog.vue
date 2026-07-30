<script setup lang="ts">
import { useI18n } from "#imports"
import { useMemberBankCard } from "../../composables/useMemberBankCard"
import { useWithdraw, type WithdrawCategory } from "../../composables/useWithdraw/index"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { getCurrencyFlagSrc } from "@shared-lib/constants/currencyFlagMap"
import AddBankCardDialog from "../memberBank/AddBankCardDialog.vue"
import MemberBankCardInfoItem from "../memberBank/MemberBankCardInfoItem.vue"

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: "close"): void
  (e: "success"): void
}>()

const { pushToast } = useToastQueue()
const router = useRouter()

const withdrawCategoryIconSrcMap: Record<WithdrawCategory, string> = {
  fiat: new URL("../../../assets/images/deposit/fiat-method.png", import.meta.url).href,
  crypto: new URL("../../../assets/images/deposit/crypto-method.png", import.meta.url).href
}

const withdraw = useWithdraw()
const addBankCard = useMemberBankCard()

const {
  isLoading,
  isLoadingPayoutSettings,
  isLoadingDetail,
  isSubmitting,
  isChannelExpanded,
  currencyOptions,
  categoryOptions,
  channelList,
  selectedChannel,
  selectedCurrency,
  selectedCategory,
  selectedGatewayId,
  selectedBankCardId,
  paymentDetail,
  bankCards,
  amount,
  selectedBankCard,
  isCrypto,
  cryptoRate,
  cryptoReceiveAmount,
  withdrawMin,
  withdrawMax,
  hasFee,
  feeText,
  quickAmounts,
  showCurrencySelector,
  showCategorySelector,
  canEditBankCard,
  selectedWallet,
  isFormReady,
  init,
  handleCurrencyChange,
  handleCategoryChange,
  handleChannelSelect,
  handleBankCardSelect,
  handleAmountChange,
  reloadBankCards,
  toggleChannelExpand,
  handleSubmit,
  resetDialog
} = withdraw

const {
  form: addBankCardForm,
  errors: addBankCardErrors,
  typeOptions: addBankCardTypeOptions,
  currencyOptions: addBankCardCurrencyOptions,
  bankOptions: addBankCardBankOptions,
  cryptoOptions: addBankCardCryptoOptions,
  ewalletProviderOptions: addBankCardEwalletProviderOptions,
  paymentGatewayOptions: addBankCardPaymentGatewayOptions,
  accountNameLabel: addBankCardAccountNameLabel,
  accountNumberLabel: addBankCardAccountNumberLabel,
  isSubmitting: isAddingBankCard,
  isLoadingForm: isLoadingAddBankCardForm,
  initializeCreatePage: initializeAddBankCardCreatePage,
  onTypeChange: handleAddBankCardTypeChange,
  onCurrencyChange: handleAddBankCardCurrencyChange,
  onGatewayChange: handleAddBankCardGatewayChange,
  submitCreate: submitAddBankCard,
  clearErrors: clearAddBankCardErrors,
  resetForm: resetAddBankCardForm
} = addBankCard

const hasSubmitted = ref(false)
const isAddBankCardDialogVisible = ref(false)

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      hasSubmitted.value = false
      await init()
    } else {
      hasSubmitted.value = false
      isAddBankCardDialogVisible.value = false
      resetAddBankCardForm()
      resetDialog()
    }
  }
)

const handleClose = () => {
  handleGlobalClick({
    target: "withdrawDialogClose",
    callback: () => emit("close")
  })
}

const handleConfirm = () => {
  handleGlobalClick({
    target: "withdrawDialogConfirm",
    debounceTimer: 300,
    callback: async () => {
      hasSubmitted.value = true
      if (hasAmountRangeError.value) {
        pushToast({ severity: "error", detail: amountErrorMessage.value, life: 3000 })
        return
      }

      const result = await handleSubmit()
      if (result?.status) {
        emit("success")
        await router.push(`${ROUTE_PATH.MEMBER.ORDERS}?search_type=2`)
      }
    }
  })
}

// BaseNumberInput uses number while the withdraw composable stores amount as string.
const amountNumber = computed(() => {
  const source = String(amount.value || "").replace(/,/g, "")
  if (!source) return null

  const n = Number(source)
  return Number.isFinite(n) ? n : null
})

const handleAmountNumberChange = (val: number | null) => {
  handleAmountChange(val !== null ? String(val) : "")
}

const getWithdrawCategoryIconSrc = (value: WithdrawCategory): string => {
  return withdrawCategoryIconSrcMap[value]
}

const isGatewayScopedAddAccountType = (type?: number): boolean => {
  return (
    Number(type) === Number(FUND_METHOD_TYPE_ENUMS.E_WALLET) ||
    Number(type) === Number(FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT)
  )
}

const getAddBankCardSeed = () => {
  return {
    currency: selectedCurrency.value || undefined,
    currencyId: selectedChannel.value?.currency,
    paymentTypeId: selectedChannel.value?.type,
    payoutMethodId: selectedChannel.value?.payout_method_id,
    paymentGatewayId: isGatewayScopedAddAccountType(selectedChannel.value?.type) ? selectedChannel.value?.id : undefined
  }
}

const getLimitNumber = (value: string): number | null => {
  const amountValue = Number(String(value || "").replace(/,/g, ""))
  return Number.isFinite(amountValue) && amountValue > 0 ? amountValue : null
}

const formatLimitText = (value: string): string => {
  const amountValue = getLimitNumber(value)
  if (amountValue === null) return value

  return amountValue.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

const withdrawRangeLabel = computed((): string => {
  if (!paymentDetail.value && !selectedChannel.value) return ""
  return `${formatLimitText(withdrawMin.value)} ~ ${formatLimitText(withdrawMax.value)}`
})

const withdrawLimitLabel = computed((): string => {
  if (!withdrawRangeLabel.value) return ""

  return t("member.withdrawal.withdraw_limit", {
    min: formatLimitText(withdrawMin.value),
    max: formatLimitText(withdrawMax.value)
  })
})

const amountPlaceholder = computed((): string => {
  return withdrawLimitLabel.value
})

const isAmountRequiredError = computed((): boolean => hasSubmitted.value && !String(amount.value || "").trim())

const hasAmountRangeError = computed((): boolean => {
  if (amountNumber.value === null) return false

  const minimum = getLimitNumber(withdrawMin.value)
  const maximum = getLimitNumber(withdrawMax.value)

  return Boolean(
    (minimum !== null && amountNumber.value < minimum) || (maximum !== null && amountNumber.value > maximum)
  )
})

const shouldShowNoAccountHelper = computed((): boolean => {
  return Boolean(
    isFormReady.value && !isLoadingPayoutSettings.value && selectedChannel.value && bankCards.value.length === 0
  )
})

const isAmountInvalid = computed(
  (): boolean => isAmountRequiredError.value || hasAmountRangeError.value || shouldShowNoAccountHelper.value
)

const amountInputClass = computed((): string =>
  cx("withdraw-amount-input__control", isAmountInvalid.value && "withdraw-amount-input__control--invalid")
)

const amountErrorMessage = computed((): string => {
  if (isAmountRequiredError.value) return t("shareholder_platform.please_enter_amount")
  if (!hasAmountRangeError.value) return ""

  return withdrawLimitLabel.value
})

const bankCardErrorMessage = computed((): string => {
  return hasSubmitted.value && !selectedBankCardId.value ? t("please_select_withdrawal_account") : ""
})

const openAddBankCardDialog = () => {
  handleGlobalClick({
    target: "withdrawAddBankCard",
    callback: async () => {
      await initializeAddBankCardCreatePage(getAddBankCardSeed())
      isAddBankCardDialogVisible.value = true
    }
  })
}

const closeAddBankCardDialog = () => {
  if (isAddingBankCard.value) return
  isAddBankCardDialogVisible.value = false
  clearAddBankCardErrors()
  resetAddBankCardForm()
}

const handleAddBankCardSubmit = async () => {
  const paymentTypeId = await submitAddBankCard()
  if (!paymentTypeId) return

  isAddBankCardDialogVisible.value = false
  resetAddBankCardForm()
  await reloadBankCards()
}
</script>

<template>
  <BaseDialog
    :visible="props.visible"
    :class-obj="{
      root: cx('withdraw-dialog-root'),
      header: cx('withdraw-dialog-header'),
      title: cx('withdraw-dialog-title'),
      closeBtn: cx('withdraw-dialog-close'),
      body: cx('withdraw-dialog-body'),
      footer: cx('withdraw-dialog-footer-shell')
    }"
    @close="handleClose"
  >
    <template #header>
      <span>{{ t("common.btn.withdraw") }}</span>
    </template>

    <div v-if="isLoading" :class="cx(FLEX_CENTER, 'withdraw-dialog-loading')">
      <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="32px" />
    </div>

    <template v-else>
      <div class="withdraw-dialog-content">
        <div v-if="selectedWallet" class="withdraw-summary-grid">
          <div class="withdraw-summary-card withdraw-summary-card--available">
            <span class="withdraw-summary-card__label">{{ t("withdrawal.availableWithdrawalAmount") }}</span>
            <span class="withdraw-summary-card__value">{{ formatLimitText(selectedWallet.withdrawable_balance) }}</span>
          </div>
          <div class="withdraw-summary-card withdraw-summary-card--turnover">
            <span class="withdraw-summary-card__label">{{ t("withdrawal.wageringRequirement") }}</span>
            <span class="withdraw-summary-card__value">{{ formatLimitText(selectedWallet.remaining_turnover) }}</span>
          </div>
          <div class="withdraw-summary-card withdraw-summary-card--balance">
            <span class="withdraw-summary-card__label">{{ t("common.btn.point") }}</span>
            <span class="withdraw-summary-card__value">{{ formatLimitText(selectedWallet.balance) }}</span>
          </div>
        </div>

        <div v-if="showCurrencySelector" class="withdraw-section withdraw-currency-section">
          <span class="withdraw-section-title">{{ t("tableHeader.currency") }}</span>
          <div class="withdraw-currency-scroll">
            <div v-for="opt in currencyOptions" :key="opt.value" class="withdraw-currency-scroll__item">
              <BasePlainBtn
                type="button"
                :class="
                  cx('withdraw-currency-chip', selectedCurrency === opt.value && 'withdraw-currency-chip--active')
                "
                @click="
                  handleGlobalClick({
                    target: `withdrawCurrencySelect_${opt.value}`,
                    payload: opt.value,
                    callback: (v) => handleCurrencyChange(v as string)
                  })
                "
              >
                <img
                  v-if="getCurrencyFlagSrc(opt.value)"
                  :src="getCurrencyFlagSrc(opt.value)"
                  :alt="opt.value"
                  class="withdraw-currency-chip__flag"
                />
                <span>{{ opt.label }}</span>
              </BasePlainBtn>
            </div>
          </div>
        </div>

        <div v-if="showCategorySelector" class="withdraw-section">
          <span class="withdraw-section-title">{{ t("dialog_select_method") }}</span>
          <div class="withdraw-method-grid">
            <BasePlainBtn
              v-for="opt in categoryOptions"
              :key="opt.value"
              type="button"
              :class="cx('withdraw-method-card', selectedCategory === opt.value && 'withdraw-method-card--active')"
              @click="
                handleGlobalClick({
                  target: `withdrawCategorySelect_${opt.value}`,
                  payload: opt.value as string,
                  callback: (v) => handleCategoryChange(v as 'fiat' | 'crypto')
                })
              "
            >
              <span class="withdraw-method-card__icon">
                <img
                  :src="getWithdrawCategoryIconSrc(opt.value)"
                  :alt="opt.label"
                  class="withdraw-method-card__icon-image"
                />
              </span>
              <span>{{ opt.label }}</span>
            </BasePlainBtn>
          </div>
        </div>

        <div class="withdraw-section">
          <div :class="cx(FLEX_ITEMS_CENTER, 'withdraw-channel-header')">
            <span class="withdraw-section-title">{{ t("bank_column.gateway") }}</span>
            <BasePlainBtn
              v-if="canEditBankCard"
              type="button"
              class="withdraw-account-add"
              @click="openAddBankCardDialog"
            >
              {{ t("withdrawal.addWithdrawalAccount") }}
            </BasePlainBtn>
          </div>

          <BasePlainBtn
            v-if="selectedChannel"
            type="button"
            :class="cx(FLEX_ITEMS_CENTER, 'withdraw-channel-summary')"
            @click="
              handleGlobalClick({
                target: 'withdrawChannelToggle',
                callback: toggleChannelExpand
              })
            "
          >
            <div :class="cx(FLEX_ITEMS_CENTER, 'withdraw-channel-summary__meta')">
              <div class="withdraw-channel-summary__logo">
                <BaseImage
                  :src="selectedChannel.imgUrl"
                  :default-src="'/images/default/default.webp'"
                  :class-obj="{ image: 'w-full h-full object-contain' }"
                />
              </div>
              <span class="withdraw-channel-summary__name">
                {{ selectedChannel.name }}
              </span>
            </div>
            <div :class="cx(FLEX_ITEMS_CENTER, 'withdraw-channel-summary__range-wrap')">
              <span class="withdraw-channel-summary__range">
                {{ withdrawRangeLabel }}
              </span>
              <BaseIcon
                name="mdi:chevron-down"
                size="18px"
                class="withdraw-channel-summary__chevron"
                :class="isChannelExpanded ? 'rotate-180' : ''"
              />
            </div>
          </BasePlainBtn>

          <div v-show="isChannelExpanded || !selectedChannel" class="withdraw-channel-list">
            <div v-if="channelList.length === 0 && !isLoadingDetail" class="withdraw-channel-empty">
              <NoData type="empty" :class-obj="{ root: 'min-h-[120px]' }" />
            </div>
            <div v-else class="withdraw-channel-grid">
              <BasePlainBtn
                v-for="channel in channelList"
                :key="channel.id"
                type="button"
                :class="
                  cx(
                    FLEX_ITEMS_CENTER,
                    'withdraw-channel-card',
                    selectedGatewayId === channel.id && 'withdraw-channel-card--active'
                  )
                "
                @click="
                  handleGlobalClick({
                    target: `withdrawChannelSelect_${channel.id}`,
                    payload: channel.id,
                    callback: (id) => handleChannelSelect(id as number)
                  })
                "
              >
                <div class="withdraw-channel-card__logo">
                  <BaseImage
                    :src="channel.imgUrl"
                    :default-src="'/images/default/default.webp'"
                    :class-obj="{ image: 'w-full h-full object-contain' }"
                  />
                </div>
                <div class="withdraw-channel-card__content">
                  <span class="withdraw-channel-card__name">
                    {{ channel.name }}
                  </span>
                  <span class="withdraw-channel-card__remark">
                    {{ channel.remark || "" }}
                  </span>
                </div>
              </BasePlainBtn>
            </div>
          </div>
        </div>

        <template v-if="isLoadingDetail">
          <div :class="cx(FLEX_CENTER, 'withdraw-detail-loading')">
            <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="24px" />
          </div>
        </template>

        <template v-else-if="isFormReady">
          <div class="withdraw-section">
            <span class="withdraw-section-title">{{ t("member.deposit.withdrawAmount") }}</span>
            <BaseNumberInput
              :model-value="amountNumber"
              :max-fraction-digits="0"
              :placeholder="amountPlaceholder"
              :invalid="isAmountInvalid"
              :input-attrs="{
                autocomplete: 'off',
                'data-1p-ignore': 'true',
                'data-form-type': 'other',
                'data-lpignore': 'true',
                inputmode: 'numeric',
                name: 'withdraw_transaction_amount',
                type: 'tel'
              }"
              :class-obj="{
                root: 'w-full withdraw-amount-input',
                input: amountInputClass
              }"
              @input="handleAmountNumberChange"
              @update:model-value="handleAmountNumberChange"
            />
            <BaseErrorMessage
              v-if="amountErrorMessage"
              :error-message="amountErrorMessage"
              :class-obj="{ root: 'withdraw-error-message withdraw-amount-error-message' }"
            />
            <div v-if="shouldShowNoAccountHelper" class="withdraw-no-account-helper">
              <BaseIcon name="si:warning-fill" size="14px" class="withdraw-no-account-helper__icon" />
              <span>{{ t("no_bank_withdrawal_account") }}</span>
              <BasePlainBtn type="button" class="withdraw-no-account-helper__link" @click="openAddBankCardDialog">
                {{ t("withdrawal.addWithdrawalAccount") }}
              </BasePlainBtn>
            </div>
          </div>

          <div v-if="quickAmounts.length > 0" class="withdraw-quick-amounts">
            <BaseBtn
              v-for="qa in quickAmounts"
              :key="qa"
              category="number"
              :active="String(amount) === qa"
              :class-obj="{ button: 'withdraw-quick-amount' }"
              @click="
                handleGlobalClick({
                  target: `withdrawQuickAmount_${qa}`,
                  payload: qa,
                  callback: (v) => handleAmountChange(v as string)
                })
              "
            >
              {{ formatLimitText(qa) }}
            </BaseBtn>
          </div>

          <div v-if="hasFee" class="withdraw-fee-row">
            <span>{{ t("member.deposit.handlingFee") }}</span>
            <strong>{{ feeText }}</strong>
          </div>

          <div class="withdraw-section">
            <div v-if="isLoadingPayoutSettings" :class="cx(FLEX_CENTER, 'withdraw-detail-loading')">
              <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="24px" />
            </div>
            <div v-else-if="bankCards.length === 0" class="withdraw-account-empty">
              <NoData
                type="empty"
                :class-obj="{
                  root: 'withdraw-account-empty__root',
                  imageWrap: 'withdraw-account-empty__image-wrap',
                  title: 'withdraw-account-empty__title'
                }"
              />
            </div>
            <div v-else class="withdraw-bank-card-list">
              <BasePlainBtn
                v-for="card in bankCards"
                :key="card.id"
                type="button"
                :class="
                  cx(
                    'withdraw-payout-card',
                    card.isCrypto && 'withdraw-payout-card--crypto',
                    selectedBankCardId === card.id && 'withdraw-payout-card--active'
                  )
                "
                @click="
                  handleGlobalClick({
                    target: `withdrawBankCardSelect_${card.id}`,
                    payload: card.id,
                    callback: (id) => handleBankCardSelect(id as number)
                  })
                "
              >
                <div class="withdraw-payout-card__inner">
                  <div class="withdraw-payout-card__header">
                    <div class="withdraw-payout-card__title-wrap">
                      <BaseIcon
                        name="mdi:credit-card-outline"
                        size="18px"
                        gradient-class="bg-[linear-gradient(180deg,var(--color-yellow-50)_0%,var(--color-yellow-500)_100%)]"
                      />
                      <span class="withdraw-payout-card__title">{{ card.name }}</span>
                    </div>
                  </div>

                  <div class="withdraw-payout-card__primary">
                    {{ card.primaryText }}
                  </div>

                  <div
                    class="withdraw-payout-card__details"
                    :class="card.detailItems.length === 1 && 'withdraw-payout-card__details--single'"
                  >
                    <MemberBankCardInfoItem
                      v-for="item in card.detailItems"
                      :key="`${card.id}-${item.label}`"
                      :label="item.label"
                      :value="item.value"
                    />
                  </div>
                </div>
                <BaseRadio
                  :model-value="selectedBankCardId"
                  :value="card.id"
                  :class-obj="{
                    root: 'withdraw-payout-card__radio',
                    box: cx(
                      'withdraw-payout-card__radio-box',
                      selectedBankCardId === card.id && 'withdraw-payout-card__radio-box--active'
                    )
                  }"
                  @update:model-value="
                    handleGlobalClick({
                      target: `withdrawBankCardRadio_${card.id}`,
                      payload: card.id,
                      callback: (id) => handleBankCardSelect(id as number)
                    })
                  "
                />
              </BasePlainBtn>
            </div>
            <BaseErrorMessage
              v-if="bankCardErrorMessage"
              :error-message="bankCardErrorMessage"
              :class-obj="{ root: 'withdraw-error-message' }"
            />
          </div>

          <!-- <div v-if="isCrypto && selectedBankCard && amount && cryptoRate" class="withdraw-crypto-rate">
            <div>{{ t("member.withdrawal.rate") }}：{{ cryptoRate }}</div>
            <div>實際到帳：{{ cryptoReceiveAmount }}</div>
          </div> -->
        </template>
      </div>
    </template>

    <template #footer>
      <div :class="cx(FLEX_ITEMS_CENTER, 'withdraw-dialog-footer')">
        <BaseBtn
          theme="primary"
          category="outline"
          size="md"
          :class-obj="{ button: 'withdraw-footer-btn' }"
          @click="handleClose"
        >
          {{ t("common.btn.cancel") }}
        </BaseBtn>
        <BaseBtn
          theme="primary"
          size="md"
          :loading="isSubmitting"
          :disabled="isSubmitting || isLoading || isLoadingDetail || isLoadingPayoutSettings"
          :class-obj="{ button: 'withdraw-footer-btn' }"
          @click="handleConfirm"
        >
          {{ t("common.btn.confirm") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>

  <AddBankCardDialog
    v-model:form="addBankCardForm"
    :visible="isAddBankCardDialogVisible"
    :errors="addBankCardErrors"
    :type-options="addBankCardTypeOptions"
    :currency-options="addBankCardCurrencyOptions"
    :bank-options="addBankCardBankOptions"
    :crypto-options="addBankCardCryptoOptions"
    :ewallet-provider-options="addBankCardEwalletProviderOptions"
    :payment-gateway-options="addBankCardPaymentGatewayOptions"
    :account-name-label="addBankCardAccountNameLabel"
    :account-number-label="addBankCardAccountNumberLabel"
    :is-submitting="isAddingBankCard"
    :is-loading="isLoadingAddBankCardForm"
    @close="closeAddBankCardDialog"
    @submit="handleAddBankCardSubmit"
    @type-change="handleAddBankCardTypeChange"
    @currency-change="handleAddBankCardCurrencyChange"
    @gateway-change="handleAddBankCardGatewayChange"
  />
</template>

<style>
.withdraw-dialog-root {
  max-width: min(
    var(--withdraw-dialog-width, 500px),
    calc(100vw - var(--withdraw-dialog-window-margin, 8px))
  ) !important;
  border-radius: var(--withdraw-dialog-radius, 10px) !important;
}

.withdraw-dialog-header {
  min-height: var(--withdraw-dialog-header-height, 60px);
  background: var(--withdraw-dialog-header-bg, var(--dialog-dialog-bg-header));
}

.withdraw-dialog-title {
  font-size: var(--withdraw-dialog-title-size, 16px);
  line-height: 1.5;
}

.withdraw-dialog-close {
  color: var(--withdraw-dialog-close-color, var(--dialog-dialog-title-header));
}

.withdraw-dialog-body {
  position: relative;
  isolation: isolate;
  padding: var(--withdraw-dialog-body-padding, 34px 20px 30px) !important;
  background: var(--withdraw-dialog-body-bg, var(--dialog-dialog-bg-content)) !important;
}

.withdraw-dialog-body::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: "";
  background-image: var(--withdraw-dialog-bg-image, none);
  background-repeat: no-repeat;
  background-position: var(--withdraw-dialog-bg-position, center bottom);
  background-size: var(--withdraw-dialog-bg-size, cover);
  opacity: var(--withdraw-dialog-bg-opacity, 0);
}

.withdraw-dialog-body > * {
  position: relative;
  z-index: 1;
}

.withdraw-dialog-loading,
.withdraw-detail-loading {
  min-height: var(--withdraw-loading-min-height, 180px);
}

.withdraw-dialog-content {
  display: flex;
  flex-direction: column;
  gap: var(--withdraw-dialog-section-gap, 18px);
}

.withdraw-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.withdraw-summary-card {
  display: flex;
  min-width: 0;
  min-height: var(--withdraw-summary-card-height, 68px);
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: var(--withdraw-summary-card-padding, 10px 12px);
  border-radius: var(--withdraw-card-radius, 8px);
}

.withdraw-summary-card--available {
  border: 1px solid var(--withdraw-summary-available-border, var(--color-green-900, #14532d));
  background: var(
    --withdraw-summary-available-bg,
    color-mix(in srgb, var(--color-green-900, #14532d) 34%, transparent)
  );
}

.withdraw-summary-card--turnover {
  border: 1px solid var(--withdraw-summary-turnover-border, var(--color-pink-800, #9d174d));
  background: var(--withdraw-summary-turnover-bg, color-mix(in srgb, var(--color-pink-500, #ec4899) 34%, transparent));
}

.withdraw-summary-card--balance {
  border: 1px solid var(--withdraw-summary-balance-border, var(--bg-line-03));
  background: var(
    --withdraw-summary-balance-bg,
    color-mix(in srgb, var(--brand-brand-secondary-contrast) 34%, transparent)
  );
}

.withdraw-summary-card__label {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.35;
  color: var(--withdraw-summary-label-color, var(--withdraw-text-secondary, var(--text-text-secondary)));
}

.withdraw-summary-card__value {
  overflow: hidden;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--withdraw-text-primary, var(--text-text-primary));
  text-overflow: ellipsis;
  white-space: nowrap;
}

.withdraw-section {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.withdraw-currency-section {
  width: 100%;
  max-width: var(--withdraw-currency-section-max-width, 100%);
  min-width: 0;
  overflow: hidden;
}

.withdraw-section-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.35;
  color: var(--withdraw-section-title-color, var(--withdraw-text-primary, var(--text-text-primary)));
}

.withdraw-currency-scroll {
  display: flex;
  align-items: center;
  gap: var(--withdraw-selector-gap, 8px);
  width: 100%;
  max-width: 100%;
  min-height: var(--withdraw-selector-height, 48px);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.withdraw-currency-scroll::-webkit-scrollbar {
  display: none;
}

.withdraw-currency-scroll__item {
  flex: 0 0 auto;
  min-width: var(--withdraw-currency-tab-min-width, 92px);
}

.withdraw-currency-scroll__item:not(:only-child) {
  flex: 1 1 0;
  min-width: max(var(--withdraw-currency-tab-min-width, 92px), 120px);
}

.withdraw-currency-scroll__item:not(:only-child) .withdraw-currency-chip {
  width: 100%;
}

.withdraw-currency-chip,
.withdraw-method-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--withdraw-selector-height, 48px);
  gap: var(--withdraw-selector-content-gap, 10px);
  color: var(--withdraw-selector-text, var(--text-text-primary));
  border: 1px solid var(--withdraw-selector-border, var(--bg-line-03));
  background: var(--withdraw-selector-bg, color-mix(in srgb, var(--brand-brand-secondary-contrast) 18%, transparent));
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.withdraw-currency-chip {
  min-width: var(--withdraw-currency-tab-min-width, 92px);
  padding: var(--withdraw-currency-chip-padding, 7px 18px);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.withdraw-currency-chip__flag {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 999px;
}

.withdraw-currency-chip:hover,
.withdraw-currency-chip--active,
.withdraw-method-card:hover,
.withdraw-method-card--active {
  color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
  border-color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
  background: var(
    --withdraw-selector-active-bg,
    color-mix(in srgb, var(--button-button-bg-primary-left-enabled) 14%, transparent)
  );
}

.withdraw-method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--withdraw-selector-gap, 10px);
}

.withdraw-method-card {
  width: 100%;
  min-height: var(--withdraw-method-card-height, var(--withdraw-selector-height, 48px));
  padding: 10px 14px;
  border-radius: var(--withdraw-card-radius, 8px);
  font-size: 14px;
  font-weight: 700;
}

.withdraw-method-card__icon {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  background: var(--withdraw-method-icon-bg, color-mix(in srgb, var(--color-light-500) 22%, transparent));
}

.withdraw-method-card__icon-image {
  display: block;
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.withdraw-channel-header {
  justify-content: space-between;
}

.withdraw-channel-summary {
  justify-content: space-between;
  width: 100%;
  min-height: var(--withdraw-channel-summary-height, 54px);
  gap: 12px;
  padding: var(--withdraw-channel-summary-padding, 10px 12px);
  color: var(--withdraw-text-primary, var(--text-text-primary));
  border: 1px solid var(--withdraw-panel-border, var(--bg-line-03));
  border-radius: var(--withdraw-channel-summary-radius, var(--withdraw-card-radius, 8px));
  background: var(--withdraw-panel-bg, var(--dialog-dialog-bg-content));
  transition: border-color 0.2s ease;
}

.withdraw-channel-summary:hover {
  border-color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
}

.withdraw-channel-summary__meta {
  min-width: 0;
  gap: 12px;
}

.withdraw-channel-summary__logo,
.withdraw-channel-card__logo {
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 4px;
  background: var(--withdraw-logo-bg, color-mix(in srgb, var(--color-light-500) 14%, transparent));
}

.withdraw-channel-summary__logo {
  width: var(--withdraw-channel-summary-logo-width, 64px);
  height: var(--withdraw-channel-summary-logo-height, 32px);
}

.withdraw-channel-summary__name,
.withdraw-channel-card__name {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--withdraw-text-primary, var(--text-text-primary));
  text-overflow: ellipsis;
  white-space: nowrap;
}

.withdraw-channel-summary__range-wrap {
  flex: 0 0 auto;
  gap: 6px;
}

.withdraw-channel-summary__range,
.withdraw-channel-card__remark {
  font-size: 12px;
  line-height: 1.35;
  color: var(--withdraw-text-secondary, var(--text-text-secondary));
  white-space: nowrap;
}

.withdraw-channel-summary__chevron {
  color: var(--withdraw-text-secondary, var(--text-text-secondary));
  transition: transform 0.2s ease;
}

.withdraw-channel-list {
  min-width: 0;
}

.withdraw-channel-empty {
  padding: 8px 0;
}

.withdraw-channel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--withdraw-selector-gap, 10px);
}

.withdraw-channel-card {
  width: 100%;
  min-height: 68px;
  gap: 12px;
  padding: 12px 14px;
  text-align: left;
  border: 2px solid transparent;
  border-radius: var(--withdraw-card-radius, 8px);
  background: var(--withdraw-card-bg, color-mix(in srgb, var(--color-abyss-950) 66%, transparent));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.withdraw-channel-card:hover,
.withdraw-channel-card--active {
  border-color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
  background: var(
    --withdraw-card-active-bg,
    color-mix(in srgb, var(--brand-brand-secondary-contrast) 38%, transparent)
  );
}

.withdraw-channel-card--active .withdraw-channel-card__name {
  color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
}

.withdraw-channel-card__logo {
  width: 42px;
  height: 28px;
}

.withdraw-channel-card__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.withdraw-channel-card__remark {
  overflow: hidden;
  text-overflow: ellipsis;
}

.withdraw-detail-loading {
  padding: 24px 0;
}

.withdraw-amount-input {
  min-height: 44px;
}

.withdraw-amount-input__control {
  min-height: var(--withdraw-input-height, 48px);
  background: var(--withdraw-input-bg, var(--input-input-bg-primary-enabled));
  border-color: var(--withdraw-input-border, var(--input-input-border-primary-enabled));
  box-shadow: var(--withdraw-input-shadow, none);
}

.withdraw-amount-input__control--invalid {
  border-color: var(--withdraw-error-text, var(--input-input-negative)) !important;
}

.withdraw-amount-error-message {
  margin-top: 2px;
}

.withdraw-quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.withdraw-quick-amount {
  min-width: var(--withdraw-quick-amount-min-width, 72px);
  white-space: nowrap;
}

.withdraw-fee-row,
.withdraw-crypto-rate {
  color: var(--withdraw-text-secondary, var(--text-text-secondary));
}

.withdraw-fee-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.withdraw-fee-row strong {
  font-weight: 700;
  color: var(--withdraw-text-primary, var(--text-text-primary));
}

.withdraw-account-add {
  flex: 0 0 auto;
  font-size: var(--withdraw-account-add-font-size, 14px);
  font-weight: 700;
  line-height: 1.35;
  color: var(--withdraw-accent, var(--button-button-bg-primary-left-enabled));
}

.withdraw-account-add:hover {
  text-decoration: underline;
}

.withdraw-account-empty {
  padding: 18px 0 2px;
}

.withdraw-account-empty__root {
  min-height: 176px !important;
}

.withdraw-account-empty__image-wrap {
  width: 116px !important;
}

.withdraw-account-empty__title {
  font-size: 18px !important;
  font-weight: 700 !important;
}

.withdraw-bank-card-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--withdraw-bank-card-width, 314px)), var(--withdraw-bank-card-width, 314px))
  );
  gap: var(--withdraw-bank-card-gap, 12px);
}

.withdraw-payout-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: var(--withdraw-payout-card-padding, 16px);
  text-align: left;
  color: var(--card-card-title-primary-enabled);
  border: 1px solid var(--card-card-border-secondary-enabled, rgba(255, 255, 255, 0.06));
  border-radius: var(--withdraw-payout-card-radius, 16px);
  background: var(--surface-surface-contrainer);
  transition: border-color 0.2s ease;
}

.withdraw-payout-card::before,
.withdraw-payout-card::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  background-repeat: no-repeat;
}

.withdraw-payout-card::before {
  z-index: 2;
  background-image: url("/images/bankCard/bank-lines-bg.png");
  background-position: bottom;
  background-size: 100% 100%;
}

.withdraw-payout-card::after {
  z-index: 3;
  background-image: url("/images/bankCard/bank-card-light-bg.png");
  background-position: center;
  background-size: cover;
}

.withdraw-payout-card--crypto::before {
  background-image: none;
}

.withdraw-payout-card--crypto::after {
  background-image: url("/images/bankCard/virtaul-bank-card-light-bg.png");
}

.withdraw-payout-card:hover,
.withdraw-payout-card--active {
  border: 1px solid var(--card-card-border-primary-active, #f97316);
}

.withdraw-payout-card__inner {
  position: relative;
  z-index: 4;
  display: flex;
  min-height: var(--withdraw-payout-card-min-height, 128px);
  flex-direction: column;
  gap: var(--withdraw-payout-card-gap, 18px);
}

.withdraw-payout-card__header,
.withdraw-payout-card__title-wrap {
  display: flex;
  align-items: center;
}

.withdraw-payout-card__header {
  justify-content: space-between;
  gap: 12px;
  padding-right: 32px;
}

.withdraw-payout-card__title-wrap {
  min-width: 0;
  gap: 8px;
}

.withdraw-payout-card__title {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: var(--card-card-title-primary-enabled);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.withdraw-payout-card__radio {
  position: absolute !important;
  z-index: 5;
  top: 16px;
  right: 16px;
}

.withdraw-payout-card__radio-box--active {
  border: 2px solid var(--radio-radio-border-active, #f97316) !important;
}

.withdraw-payout-card__primary {
  overflow-wrap: anywhere;
  text-align: center;
  font-size: var(--withdraw-payout-card-primary-font-size, 16px);
  font-weight: 600;
  line-height: 24px;
  color: var(--card-card-title-primary-enabled);
}

.withdraw-payout-card--crypto .withdraw-payout-card__primary {
  text-align: left;
  font-size: var(--withdraw-payout-card-crypto-primary-font-size, 14px);
  line-height: 20px;
}

.withdraw-payout-card__details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.withdraw-payout-card__details--single {
  grid-template-columns: minmax(0, 1fr);
}

.withdraw-error-message {
  color: var(--withdraw-error-text, var(--input-input-negative)) !important;
}

.withdraw-no-account-helper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.35;
  color: var(--withdraw-error-text, var(--input-input-negative));
}

.withdraw-no-account-helper__icon {
  flex: 0 0 auto;
}

.withdraw-no-account-helper__link {
  display: inline-flex;
  align-items: center;
  color: var(--link, #38bdf8);
  font-size: inherit;
  font-weight: 400;
  line-height: inherit;
}

.withdraw-no-account-helper__link:hover {
  text-decoration: underline;
}

.withdraw-crypto-rate {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  line-height: 1.4;
}

.withdraw-dialog-footer {
  width: 100%;
  gap: var(--withdraw-footer-gap, 12px);
}

.withdraw-dialog-footer-shell {
  padding: var(--withdraw-dialog-footer-padding, 14px 18px) !important;
  background: var(--withdraw-dialog-footer-bg, var(--dialog-dialog-bg-header)) !important;
}

.withdraw-footer-btn {
  flex: 1 1 0;
  min-height: var(--withdraw-footer-button-height, 44px);
}

.deposit-promotion-card__checkbox {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .withdraw-dialog-root {
    max-width: none !important;
  }

  .withdraw-dialog-header {
    min-height: var(--withdraw-dialog-header-height-mobile, 60px);
  }

  .withdraw-dialog-body {
    padding: var(--withdraw-dialog-body-padding-mobile, 34px 20px 30px) !important;
  }

  .withdraw-dialog-title {
    font-size: var(--withdraw-dialog-title-size-mobile, var(--withdraw-dialog-title-size, 16px));
  }

  .withdraw-dialog-content {
    gap: var(--withdraw-dialog-section-gap-mobile, 18px);
  }
}

@media (max-width: 520px) {
  .withdraw-summary-grid {
    gap: 8px;
  }

  .withdraw-summary-card {
    min-height: var(--withdraw-summary-card-height-mobile, 58px);
    padding: var(--withdraw-summary-card-padding-mobile, 8px 6px);
    align-items: center;
    text-align: center;
  }

  .withdraw-summary-card__label {
    max-width: 100%;
    font-size: 11px;
  }

  .withdraw-summary-card__value {
    font-size: 14px;
  }

  .withdraw-currency-chip {
    min-width: var(--withdraw-currency-tab-min-width-mobile, 120px);
  }

  .withdraw-channel-grid {
    grid-template-columns: 1fr;
  }

  .withdraw-channel-summary {
    min-height: var(--withdraw-channel-summary-height-mobile, 54px);
  }

  .withdraw-channel-summary__range {
    max-width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .withdraw-channel-card {
    min-height: 66px;
  }

  .withdraw-dialog-footer {
    gap: 10px;
  }

  .withdraw-bank-card-list {
    grid-template-columns: 1fr;
  }
}
</style>
