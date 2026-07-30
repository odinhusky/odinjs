<script setup lang="ts">
import { useI18n } from "#imports"
import type { DepositResultMode } from "../../composables/useDeposit/index"
import { useDeposit } from "../../composables/useDeposit/index"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { renderSVG } from "uqr"

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "success"): void
}>()

const { t } = useI18n()
const { copy } = useClipboard()
const { pushToast } = useToastQueue()
const router = useRouter()
const deposit = useDeposit()

const {
  isLoading,
  isLoadingDetail,
  isSubmitting,
  isPaymentGroupExpanded,
  currencyOptions,
  categoryOptions,
  paymentGroupOptions,
  selectedPaymentGroup,
  selectedCurrency,
  selectedCategory,
  selectedPaymentGroupId,
  paymentDetail,
  promotionList,
  selectedPromotionId,
  amount,
  uploadImages,
  depositResult,
  resultMode,
  maxUploadCount,
  depositMin,
  depositMax,
  quickAmounts,
  showCurrencySelector,
  showCategorySelector,
  hasPaymentMethods,
  isBankTransfer,
  needUploadDetailFundType,
  hasFee,
  feeText,
  cryptoAmountText,
  cryptoCurrencyBrand,
  selectedPaymentGroupRangeText,
  selectedPaymentGroupRangeOptions,
  isFormReady,
  isResultVisible,
  init,
  handleCurrencyChange,
  handleCategoryChange,
  handlePaymentGroupSelect,
  handleAmountChange,
  handleQuickAmountSelect,
  handlePromotionToggle,
  togglePaymentGroupExpand,
  addUploadImage,
  removeUploadImage,
  handleSubmit,
  resetDialog
} = deposit

const isPromoExpanded = ref(false)

watch(
  () => promotionList.value,
  (list) => {
    if (list.length > 0) isPromoExpanded.value = true
  }
)

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      isPromoExpanded.value = false
      await init()
      return
    }

    resetDialog()
  }
)

const amountNumber = computed(() => {
  const nextAmount = Number(String(amount.value || "").replace(/,/g, ""))
  return Number.isFinite(nextAmount) && nextAmount > 0 ? nextAmount : null
})

const qrResultContent = computed(() => depositResult.value?.redirect_content || "")
const qrSvgDataUrl = computed(() => {
  if (!qrResultContent.value) return ""

  const svg = renderSVG(qrResultContent.value, {
    ecc: "M",
    border: 2,
    pixelSize: 6,
    whiteColor: "#ffffff",
    blackColor: "#09002c"
  })

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})
const cryptoWallet = computed(() => depositResult.value?.crypto_wallet || null)
const resultTitle = computed(() => {
  if (resultMode.value === "cryptoWallet") return "加密貨幣付款資訊"
  if (resultMode.value === "qrCode") return "掃碼付款資訊"
  return ""
})

const resultAmountText = computed(() => {
  if (!depositResult.value) return ""
  return `${depositResult.value.amount} ${depositResult.value.currency}`
})

const hasPaymentDetailQr = computed((): boolean => {
  return Boolean(paymentDetail.value && paymentDetail.value.qrcode_image_id !== 0 && paymentDetail.value.imgUrl)
})

const blockchainNetworkText = computed((): string => String(paymentDetail.value?.chain || "").trim())
const blockchainWalletAddressText = computed((): string => String(paymentDetail.value?.wallet_address || "").trim())
const hasBlockchainPaymentDetail = computed((): boolean => {
  const chain = blockchainNetworkText.value
  const walletAddress = blockchainWalletAddressText.value
  return Boolean(chain && walletAddress)
})

const bankTransferNetworkLabel = computed((): string => {
  return t("bank_column.client_bank")
})

const bankTransferNetworkText = computed((): string => {
  if (!paymentDetail.value) return ""
  return paymentDetail.value.bank_name
})

const bankTransferWalletAddressLabel = computed((): string => {
  return t("deposit_account_name")
})

const bankTransferWalletAddressText = computed((): string => {
  if (!paymentDetail.value) return ""
  return paymentDetail.value.bank_account_name || ""
})

const handleClose = () => {
  handleGlobalClick({
    target: "depositDialogClose",
    callback: () => emit("close")
  })
}

const handleCopyText = (text: string) => {
  if (!text) return

  handleGlobalClick({
    target: "depositDialogCopy",
    payload: text,
    callback: async (value) => {
      await copy(String(value))
      pushToast({ severity: "success", detail: t("message.copy_completed"), life: 2000 })
    }
  })
}

const handleAmountNumberChange = (value: number | null) => {
  handleAmountChange(value !== null ? String(value) : "")
}

const handleSelectFile = async (file: File) => {
  await addUploadImage(file)
}

const goToDepositOrders = async () => {
  emit("success")
  await router.push(`${ROUTE_PATH.MEMBER.ORDERS}?search_type=1`)
}

const handleConfirm = () => {
  handleGlobalClick({
    target: "depositDialogConfirm",
    debounceTimer: 300,
    callback: async () => {
      if (isResultVisible.value) {
        await goToDepositOrders()
        return
      }

      const result = await handleSubmit()
      if (!result?.status) return

      if (result.resultMode === "none") {
        await goToDepositOrders()
      }
    }
  })
}

const getResultModeClass = (mode: DepositResultMode) => {
  if (mode === "cryptoWallet") return "deposit-result--crypto"
  if (mode === "qrCode") return "deposit-result--qr"
  return ""
}
</script>

<template>
  <BaseDialog
    :visible="props.visible"
    :class-obj="{
      root: cx('deposit-dialog-root'),
      header: cx('deposit-dialog-header'),
      title: cx('deposit-dialog-title'),
      closeBtn: cx('deposit-dialog-close'),
      body: cx('deposit-dialog-body')
    }"
    @close="handleClose"
  >
    <template #header>
      <span>{{ t("action_type.deposit") }}</span>
    </template>

    <div v-if="isLoading" :class="cx(FLEX_CENTER, 'deposit-dialog-loading')">
      <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="32px" />
    </div>

    <template v-else-if="isResultVisible">
      <section class="deposit-result" :class="getResultModeClass(resultMode)">
        <div class="deposit-result__icon">
          <BaseIcon :name="resultMode === 'cryptoWallet' ? 'mdi:wallet-outline' : 'mdi:qrcode'" size="34px" />
        </div>

        <div class="deposit-result__content">
          <h3 class="deposit-result__title">{{ resultTitle }}</h3>
          <p class="deposit-result__amount">{{ resultAmountText }}</p>

          <template v-if="resultMode === 'cryptoWallet' && cryptoWallet">
            <div class="deposit-info-panel">
              <div class="deposit-info-row">
                <span>{{ t("deposit_network") }}</span>
                <strong>{{ cryptoWallet.chain }}</strong>
              </div>
              <div class="deposit-info-row">
                <span>Coin</span>
                <strong>{{ cryptoWallet.coin_symbol }}</strong>
              </div>
              <div class="deposit-info-row">
                <span>Payable Amount</span>
                <strong>{{ cryptoWallet.payable_amount }}</strong>
              </div>
              <div class="deposit-info-row deposit-info-row--copy">
                <span>{{ t("member.bank.walletAddress") }}</span>
                <strong>{{ cryptoWallet.wallet_address }}</strong>
                <BasePlainBtn type="button" @click="handleCopyText(cryptoWallet.wallet_address)">
                  <BaseIcon name="mdi:content-copy" size="16px" />
                </BasePlainBtn>
              </div>
            </div>
          </template>

          <template v-else-if="resultMode === 'qrCode'">
            <div class="deposit-info-panel">
              <div class="deposit-info-row">
                <span>Channel</span>
                <strong>{{ depositResult?.channel || "-" }}</strong>
              </div>
              <div class="deposit-result__qr-placeholder">
                <img v-if="qrSvgDataUrl" :src="qrSvgDataUrl" alt="deposit QR code" class="deposit-result__qr-image" />
                <span>{{ qrResultContent }}</span>
              </div>
              <BasePlainBtn class="deposit-copy-command" type="button" @click="handleCopyText(qrResultContent)">
                <BaseIcon name="mdi:content-copy" size="16px" />
                <span>複製付款資訊</span>
              </BasePlainBtn>
            </div>
          </template>
        </div>
      </section>
    </template>

    <template v-else>
      <div v-if="!hasPaymentMethods" class="deposit-empty-state">
        <NoData type="empty" :class-obj="{ root: 'min-h-[180px]' }" />
      </div>

      <div v-else class="deposit-dialog-content">
        <DepositCurrencySelector
          v-if="showCurrencySelector"
          :currency-options="currencyOptions"
          :selected-currency="selectedCurrency"
          @change="handleCurrencyChange"
        />

        <DepositCategorySelector
          v-if="showCategorySelector"
          :category-options="categoryOptions"
          :selected-category="selectedCategory"
          @change="handleCategoryChange"
        />

        <DepositPaymentGroupSelector
          :payment-group-options="paymentGroupOptions"
          :selected-payment-group="selectedPaymentGroup"
          :selected-payment-group-id="selectedPaymentGroupId"
          :selected-payment-group-range-options="selectedPaymentGroupRangeOptions"
          :is-loading-detail="isLoadingDetail"
          :is-payment-group-expanded="isPaymentGroupExpanded"
          @toggle="togglePaymentGroupExpand"
          @select="handlePaymentGroupSelect"
        />

        <template v-if="isFormReady">
          <DepositAmountSection
            :amount-number="amountNumber"
            :amount="amount"
            :deposit-min="depositMin"
            :deposit-max="depositMax"
            :amount-range-text="selectedPaymentGroupRangeText"
            :quick-amounts="quickAmounts"
            @update-amount-number="handleAmountNumberChange"
            @quick-select="handleQuickAmountSelect"
          />

          <div v-if="isLoadingDetail" :class="cx(FLEX_CENTER, 'deposit-detail-loading')">
            <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="24px" />
          </div>

          <template v-else-if="paymentDetail">
            <div v-if="paymentDetail?.usdt_rate && cryptoAmountText && cryptoCurrencyBrand" class="deposit-rate-panel">
              <div>
                {{ t("table_header.exchange_rate") }}: 1 {{ cryptoCurrencyBrand }} / {{ paymentDetail.usdt_rate }}
                {{ selectedCurrency }}
              </div>
              <div>Cash(Deposit Amount): {{ cryptoAmountText }} {{ cryptoCurrencyBrand }}</div>
            </div>

            <div v-if="hasFee" class="deposit-fee-row">
              <span>{{ t("member.deposit.handlingFee") }}</span>
              <strong>{{ feeText }}</strong>
            </div>

            <DepositPromotionSection
              :promotion-list="promotionList"
              :selected-promotion-id="selectedPromotionId"
              :is-promo-expanded="isPromoExpanded"
              :amount="amount"
              @toggle-expanded="isPromoExpanded = !isPromoExpanded"
              @select="handlePromotionToggle"
            />

            <div
              v-if="hasBlockchainPaymentDetail && paymentDetail"
              :class="
                cx(
                  'deposit-info-panel',
                  'deposit-info-panel--bank-transfer',
                  hasPaymentDetailQr && 'deposit-info-panel--with-qr',
                  'deposit-info-panel--crypto-like'
                )
              "
            >
              <div class="deposit-info-bank-fields">
                <div class="deposit-info-row">
                  <span>{{ t("deposit_network") }}</span>
                  <div class="deposit-info-value">
                    <strong>{{ blockchainNetworkText }}</strong>
                  </div>
                </div>
                <div class="deposit-info-row">
                  <span>{{ t("member.bank.walletAddress") }}</span>
                  <div class="deposit-info-value deposit-info-value--copy">
                    <strong>{{ blockchainWalletAddressText }}</strong>
                    <BasePlainBtn
                      class="deposit-info-copy-btn"
                      type="button"
                      @click="handleCopyText(blockchainWalletAddressText)"
                    >
                      <BaseIcon name="mdi:content-copy" size="16px" />
                    </BasePlainBtn>
                  </div>
                </div>
              </div>
              <div v-if="hasPaymentDetailQr" class="deposit-info-qr">
                <BaseImage
                  :src="paymentDetail.imgUrl || ''"
                  :class-obj="{ container: 'deposit-info-qr__container', image: 'deposit-info-qr__image' }"
                />
              </div>
              <p class="deposit-warning-text deposit-warning-text--bank-transfer">
                {{ t("deposit_blockchain_hint") }}
              </p>
            </div>

            <div
              v-else-if="isBankTransfer && paymentDetail"
              :class="
                cx(
                  'deposit-info-panel',
                  'deposit-info-panel--bank-transfer',
                  hasPaymentDetailQr && 'deposit-info-panel--with-qr'
                )
              "
            >
              <div class="deposit-info-bank-fields">
                <div class="deposit-info-row">
                  <span>{{ bankTransferNetworkLabel }}</span>
                  <div class="deposit-info-value">
                    <strong>{{ bankTransferNetworkText }}</strong>
                  </div>
                </div>
                <div class="deposit-info-row">
                  <span>{{ bankTransferWalletAddressLabel }}</span>
                  <div class="deposit-info-value deposit-info-value--copy">
                    <strong>{{ bankTransferWalletAddressText }}</strong>
                    <BasePlainBtn
                      v-if="bankTransferWalletAddressText"
                      class="deposit-info-copy-btn"
                      type="button"
                      @click="handleCopyText(bankTransferWalletAddressText)"
                    >
                      <BaseIcon name="mdi:content-copy" size="16px" />
                    </BasePlainBtn>
                  </div>
                </div>
                <div class="deposit-info-row deposit-info-row--copy">
                  <span>{{ t("common.account") }}</span>
                  <div class="deposit-info-value deposit-info-value--copy">
                    <strong>{{ paymentDetail.bank_account }}</strong>
                    <BasePlainBtn
                      class="deposit-info-copy-btn"
                      type="button"
                      @click="handleCopyText(paymentDetail.bank_account)"
                    >
                      <BaseIcon name="mdi:content-copy" size="16px" />
                    </BasePlainBtn>
                  </div>
                </div>
              </div>
              <div v-if="hasPaymentDetailQr" class="deposit-info-qr">
                <BaseImage
                  :src="paymentDetail.imgUrl || ''"
                  :class-obj="{ container: 'deposit-info-qr__container', image: 'deposit-info-qr__image' }"
                />
              </div>
            </div>

            <div v-if="needUploadDetailFundType" :class="cx(FLEX_COL, 'gap-2')">
              <div v-if="uploadImages.length > 0" class="deposit-upload-grid">
                <div v-for="(image, index) in uploadImages" :key="`${image}-${index}`" class="deposit-upload-preview">
                  <img :src="image" alt="upload preview" />
                  <BasePlainBtn
                    type="button"
                    class="deposit-upload-preview__remove"
                    @click="
                      handleGlobalClick({
                        target: `depositRemoveImage_${index}`,
                        payload: index,
                        callback: (imageIndex) => removeUploadImage(Number(imageIndex))
                      })
                    "
                  >
                    <BaseIcon name="mdi:close" size="12px" />
                  </BasePlainBtn>
                </div>
              </div>

              <BaseUploadZone
                v-if="uploadImages.length < maxUploadCount"
                :title="t('clicks_drag_file')"
                :hint="t('member.deposit.depositDetailUploadWarning')"
                :class-obj="{ root: 'deposit-upload-zone', dropZone: 'deposit-upload-zone__drop' }"
                @select-file="handleSelectFile"
              />
            </div>
          </template>
        </template>
      </div>
    </template>

    <template #footer>
      <div :class="cx(FLEX_ITEMS_CENTER, 'deposit-dialog-footer')">
        <BaseBtn
          theme="primary"
          category="outline"
          size="xl"
          :class-obj="{ button: 'deposit-footer-btn' }"
          @click="handleClose"
        >
          {{ t("common.btn.cancel") }}
        </BaseBtn>

        <BaseBtn
          theme="primary"
          size="xl"
          :loading="isSubmitting"
          :disabled="isSubmitting || isLoading || isLoadingDetail || !hasPaymentMethods"
          :class-obj="{ button: 'deposit-footer-btn' }"
          @click="handleConfirm"
        >
          {{ isResultVisible ? t("menu.order") : t("common.btn.confirm") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>

<style>
.deposit-dialog-root {
  max-width: min(930px, calc(100vw - 32px)) !important;
  border-radius: var(--deposit-dialog-radius, 10px) !important;
}

.deposit-dialog-header {
  min-height: var(--deposit-dialog-header-height, 60px);
  background: var(--deposit-dialog-header-bg, var(--dialog-dialog-bg-header));
}

.deposit-dialog-title {
  font-size: 20px;
  line-height: 1.25;
}

.deposit-dialog-close {
  color: var(--deposit-dialog-close-color, var(--dialog-dialog-title-header));
}

.deposit-dialog-body {
  position: relative;
  isolation: isolate;
  padding: var(--deposit-dialog-body-padding, 40px 36px 32px) !important;
  background: var(--deposit-dialog-body-bg, var(--dialog-dialog-bg-content)) !important;
}

.deposit-dialog-body::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: "";
  background-image: var(--deposit-dialog-bg-image, url("/images/bg-dialog.png"));
  background-repeat: no-repeat;
  background-position: var(--deposit-dialog-bg-position, center bottom);
  background-size: var(--deposit-dialog-bg-size, cover);
  opacity: var(--deposit-dialog-bg-opacity, 0.2);
}

.deposit-dialog-body > * {
  position: relative;
  z-index: 1;
}

.deposit-dialog-loading,
.deposit-detail-loading {
  min-height: 220px;
}

.deposit-dialog-content {
  display: flex;
  flex-direction: column;
  gap: var(--deposit-dialog-section-gap, 18px);
}

.deposit-currency-section {
  width: 100%;
  max-width: var(--deposit-currency-section-max-width, 100%);
  min-width: 0;
  overflow: hidden;
}

.deposit-currency-scroll {
  display: flex;
  align-items: center;
  gap: var(--deposit-selector-gap, 8px);
  width: 100%;
  max-width: 100%;
  min-height: var(--deposit-selector-height, 48px);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.deposit-currency-scroll::-webkit-scrollbar {
  display: none;
}

.deposit-currency-scroll__item {
  flex: 0 0 auto;
  min-width: var(--deposit-currency-tab-min-width, 132px);
}

.deposit-currency-scroll__item:not(:only-child) {
  flex: 1 1 0;
  min-width: var(--deposit-currency-tab-min-width, 132px);
}

.deposit-currency-tab-root {
  width: 100%;
  min-width: 0;
}

.deposit-currency-tab,
.deposit-method-tab {
  width: 100%;
  min-height: var(--deposit-selector-height, 48px);
  white-space: nowrap;
}

.deposit-currency-tab__flag {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  object-fit: cover;
  border-radius: 999px;
}

.deposit-selector-tab--active {
  border: 2px solid var(--border-border-accent, #f97316) !important;
}

.deposit-method-grid,
.deposit-channel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--deposit-selector-gap, 10px);
}

.deposit-method-icon {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 999px;
  color: var(--deposit-method-icon-color, var(--button-button-title-primary-enabled));
  background: var(--deposit-method-icon-bg, color-mix(in srgb, var(--color-light-500) 25%, transparent));
}

.deposit-method-icon__image {
  display: block;
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.deposit-channel-summary,
.deposit-promotion-summary {
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  gap: 12px;
  padding: 10px 14px;
  border: 2px solid var(--select-select-border-primary-enabled, #ffffff33);
  border-radius: var(--deposit-panel-radius, 8px);
  box-shadow: 0 2px 4px 0 #00000080;
  color: var(--deposit-text-primary, var(--text-text-primary));
  background: var(--deposit-panel-bg, var(--dialog-dialog-bg-content));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.deposit-amount-input {
  border: 2px solid var(--select-select-border-primary-enabled, #ffffff33);
  box-shadow: 0 2px 4px 0 #00000080;
}

.deposit-promotion-section__title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--deposit-text-primary, var(--text-text-primary));
}

.deposit-channel-summary:hover,
.deposit-promotion-summary:hover {
  border-color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
}

.deposit-channel-summary__logo,
.deposit-channel-card__logo {
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 6px;
  background: var(--deposit-logo-bg, color-mix(in srgb, var(--color-light-500) 18%, transparent));
}

.deposit-channel-summary__logo {
  width: 38px;
  height: 26px;
}

.deposit-channel-card__logo {
  width: 154px;
  max-width: 42%;
  height: 58px;
}

.deposit-channel-summary__name,
.deposit-channel-card__name {
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--deposit-text-primary, var(--text-text-primary));
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-channel-summary__placeholder,
.deposit-channel-summary__range,
.deposit-channel-card__remark {
  font-size: 12px;
  line-height: 1.35;
  color: var(--deposit-text-secondary, var(--text-text-secondary));
}

.deposit-promotion-card__condition,
.deposit-promotion-summary__selected,
.deposit-promotion-summary__placeholder {
  font-size: 12px;
  line-height: 1.35;
  color: var(--text-text-primary, #ffffff);
}

.deposit-promotion-card__reward-label,
.deposit-promotion-summary__selected-label {
  font-size: 12px;
  line-height: 1.35;
  color: var(--list-list-subtitle-enabled, #a3a3a3);
}

.deposit-channel-summary__chevron,
.deposit-promotion-summary__chevron {
  color: var(--deposit-text-secondary, var(--text-text-secondary));
  transition: transform 0.2s ease;
}

.deposit-promotion-summary__selected {
  min-width: 0;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-channel-list {
  padding: var(--deposit-channel-list-padding, 12px);
  border-radius: var(--deposit-panel-radius, 8px);
  background: var(--deposit-channel-list-bg, color-mix(in srgb, var(--color-abyss-950) 72%, transparent));
}

.deposit-channel-card {
  gap: 20px;
  width: 100%;
  padding: 16px;
  text-align: left;
  border: 2px solid transparent;
  border-radius: var(--deposit-channel-card-radius, 20px);
  background: var(--deposit-card-bg, color-mix(in srgb, var(--brand-brand-secondary-strong) 72%, transparent));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.deposit-channel-card:hover,
.deposit-channel-card--active {
  border-color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
  background: var(--deposit-card-active-bg, color-mix(in srgb, var(--brand-brand-secondary-contrast) 48%, transparent));
}

.deposit-channel-card--active .deposit-channel-card__name {
  color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
}

.deposit-channel-card__range {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--deposit-text-primary, var(--text-text-primary));
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-channel-range-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.deposit-channel-range-pill {
  display: inline-flex;
  min-height: 22px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--tag-tag-title-secondary-enabled, #ffffff);
  white-space: nowrap;
  background: var(--tag-tag-bg-default, #ffffff33);
}

.deposit-channel-range-notice {
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
  color: var(--card-card-subtitle-primary-enabled, #a3a3a3);
}

.deposit-quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.deposit-quick-amount {
  min-width: 72px;
  white-space: nowrap;
}

.deposit-rate-panel,
.deposit-fee-row,
.deposit-info-panel {
  border-radius: var(--deposit-panel-radius, 8px);
  color: var(--deposit-text-primary, var(--text-text-primary));
  background: var(--deposit-panel-bg, color-mix(in srgb, var(--color-abyss-950) 78%, transparent));
}

.deposit-rate-panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: var(--deposit-text-secondary, var(--text-text-secondary));
  background: transparent;
}

.deposit-fee-row,
.deposit-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.deposit-fee-row {
  padding: 12px 14px;
  font-size: 14px;
}

.deposit-info-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: var(--deposit-info-panel-padding, 16px);
}

.deposit-info-panel--bank-transfer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 16px;
}

.deposit-info-panel--bank-transfer.deposit-info-panel--with-qr {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 28px;
}

.deposit-info-panel--bank-transfer.deposit-info-panel--crypto-like {
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

.deposit-info-bank-fields {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.deposit-info-panel--bank-transfer .deposit-info-row {
  display: grid;
  grid-template-columns: minmax(92px, 132px) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.deposit-info-value {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  justify-self: start;
  gap: 8px;
}

.deposit-info-value strong {
  text-align: left;
}

.deposit-info-copy-btn {
  display: grid;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  place-items: center;
  color: var(--deposit-text-secondary, var(--text-text-secondary));
}

.deposit-info-row span {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--deposit-text-secondary, var(--text-text-secondary));
}

.deposit-info-row strong {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

.deposit-info-qr {
  display: flex;
  justify-content: flex-end;
}

.deposit-info-panel--bank-transfer .deposit-info-qr {
  align-self: center;
  justify-self: end;
}

.deposit-info-panel--crypto-like .deposit-info-qr,
.deposit-info-panel--crypto-wallet .deposit-info-qr {
  justify-content: center;
}

.deposit-info-panel--crypto-like .deposit-info-qr {
  grid-column: 1 / -1;
  justify-self: center;
  order: -1;
}

.deposit-info-qr__container {
  display: block;
  width: 112px;
  height: 112px;
  overflow: hidden;
  border-radius: var(--deposit-card-radius, 8px);
  background: var(--color-dark-white);
}

.deposit-info-qr__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: inherit;
  background: var(--color-dark-white);
}

.deposit-warning-text {
  font-size: 12px;
  line-height: 1.4;
  color: var(--deposit-warning-text, var(--text-text-danger));
}

.deposit-warning-text--bank-transfer {
  grid-column: 1 / -1;
}

.deposit-promotion-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--deposit-panel-radius, 8px);
  background: var(--deposit-channel-list-bg, color-mix(in srgb, var(--color-abyss-950) 72%, transparent));
}

.deposit-promotion-card {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) minmax(92px, auto);
  align-items: start;
  width: 100%;
  min-height: 104px;
  gap: 8px 12px;
  padding: 16px 20px;
  cursor: pointer;
  text-align: left;
  border: 2px solid transparent;
  border-radius: var(--deposit-card-radius, 8px);
  background: var(--deposit-card-bg, var(--dialog-dialog-bg-content));
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.deposit-promotion-card:hover,
.deposit-promotion-card--active {
  background: var(--deposit-card-bg, var(--dialog-dialog-bg-content));
}

.deposit-promotion-card--active {
  border-color: var(--border-border-accent, #f97316);
}

.deposit-promotion-card--ineligible {
  opacity: 1;
}

.deposit-promotion-card__checkbox {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1px solid var(--deposit-promotion-checkbox-border, var(--deposit-panel-border, var(--bg-line-03)));
  border-radius: 4px;
  background: var(--deposit-promotion-checkbox-bg, var(--checkbox-checkbox-bg-enabled, var(--color-dark-white)));
}

.deposit-promotion-card--ineligible .deposit-promotion-card__checkbox {
  border-color: var(--list-list-subtitle-enabled, #a3a3a3);
  background: var(--list-list-subtitle-enabled, #a3a3a3);
}

.deposit-promotion-card__checkbox--active {
  border-color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
  background: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
}

.deposit-promotion-card__content {
  min-width: 0;
}

.deposit-promotion-card__title {
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-text-primary, #ffffff);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deposit-promotion-card__conditions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 10px 0 0;
  list-style: none;
}

.deposit-promotion-card__conditions--without-title {
  margin-top: 0;
}

.deposit-promotion-card__reward-box {
  display: flex;
  min-width: 92px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  padding-left: 14px;
  border-left: 1px solid var(--deposit-panel-border, var(--bg-line-03));
  text-align: center;
}

.deposit-promotion-section__title,
.deposit-promotion-card__reward {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-text-primary, #ffffff);
}

.deposit-promotion-card__reward {
  font-size: 18px;
  line-height: 1.25;
  text-align: center;
}

.deposit-promotion-summary__selected {
  color: var(--text-text-primary, #ffffff);
}

.deposit-promotion-card__ineligible {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-text-primary, #ffffff);
}

.deposit-upload-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.deposit-upload-preview {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  border: 1px solid var(--deposit-panel-border, var(--bg-line-03));
  border-radius: var(--deposit-card-radius, 8px);
  background: var(--deposit-upload-preview-bg, color-mix(in srgb, var(--color-abyss-950) 72%, transparent));
}

.deposit-upload-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.deposit-upload-preview__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  color: var(--color-dark-white);
  border-radius: 999px;
  background: var(--button-button-bg-danger-enabled, var(--color-red-500));
}

.deposit-upload-zone {
  width: 100%;
}

.deposit-upload-zone__drop {
  border: 1px dashed var(--upload-upload-border, #ffffff33) !important;
  border-radius: var(--deposit-card-radius, 8px) !important;
}

.deposit-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  min-height: 420px;
  padding: 28px 0;
}

.deposit-result__icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 999px;
  color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
  background: var(--deposit-card-active-bg, color-mix(in srgb, var(--brand-brand-secondary-contrast) 48%, transparent));
}

.deposit-result__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(520px, 100%);
}

.deposit-result__title,
.deposit-result__amount {
  text-align: center;
}

.deposit-result__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--deposit-text-primary, var(--text-text-primary));
}

.deposit-result__amount {
  font-size: 16px;
  color: var(--deposit-text-secondary, var(--text-text-secondary));
}

.deposit-result__qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px;
  overflow-wrap: anywhere;
  text-align: center;
  border: 1px dashed var(--deposit-panel-border, var(--bg-line-03));
  border-radius: var(--deposit-panel-radius, 8px);
}

.deposit-result__qr-image {
  width: min(240px, 100%);
  aspect-ratio: 1;
  border-radius: var(--deposit-card-radius, 8px);
  background: var(--color-dark-white);
}

.deposit-copy-command {
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  color: var(--deposit-accent, var(--button-button-bg-primary-left-enabled));
}

.deposit-dialog-footer {
  gap: 16px;
  width: 100%;
}

.deposit-footer-btn {
  flex: 1 1 0;
}

@media (max-width: 992px) {
  .deposit-dialog-root {
    max-width: min(760px, calc(100vw - 24px)) !important;
  }

  .deposit-dialog-body {
    padding: var(--deposit-dialog-body-padding-tablet, 28px 24px) !important;
  }
}

@media (max-width: 768px) {
  .deposit-dialog-root {
    max-width: none !important;
  }

  .deposit-dialog-header {
    min-height: var(--deposit-dialog-header-height-mobile, 60px);
  }

  .deposit-dialog-title {
    font-size: var(--deposit-dialog-title-size-mobile, 16px);
  }

  .deposit-dialog-close {
    margin-top: 0;
  }

  .deposit-dialog-body {
    padding: var(--deposit-dialog-body-padding-mobile, 18px 16px 22px) !important;
  }

  .deposit-dialog-content {
    gap: var(--deposit-dialog-section-gap-mobile, 14px);
  }

  .deposit-currency-scroll__item {
    min-width: 132px;
  }

  .deposit-method-grid,
  .deposit-channel-grid {
    grid-template-columns: 1fr;
  }

  .deposit-channel-card {
    min-height: 64px;
    padding: 10px 12px;
    gap: 12px;
    border-radius: var(--deposit-card-radius, 8px);
  }

  .deposit-channel-card__logo {
    width: 104px;
    height: 46px;
  }

  .deposit-channel-card__range {
    font-size: 14px;
  }

  .deposit-promotion-list {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .deposit-promotion-card {
    grid-template-columns: 16px minmax(0, 1fr);
    min-height: auto;
    padding: 16px;
  }

  .deposit-promotion-card__title {
    font-size: 16px;
  }

  .deposit-promotion-card__conditions {
    margin-top: 8px;
  }

  .deposit-promotion-card__conditions--without-title {
    margin-top: 0;
  }

  .deposit-promotion-card__reward-box {
    grid-column: 2;
    min-width: 0;
    align-items: flex-start;
    margin-top: 10px;
    padding-left: 0;
    border-left: 0;
    text-align: left;
  }

  .deposit-promotion-card__reward,
  .deposit-promotion-card__ineligible {
    font-size: 16px;
    text-align: left;
  }

  .deposit-info-panel--bank-transfer,
  .deposit-info-panel--bank-transfer.deposit-info-panel--with-qr {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .deposit-info-panel--bank-transfer .deposit-info-row {
    grid-template-columns: minmax(84px, 112px) minmax(0, 1fr);
    gap: 10px;
  }

  .deposit-info-panel--bank-transfer.deposit-info-panel--with-qr .deposit-info-row,
  .deposit-info-panel--crypto-wallet .deposit-info-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .deposit-info-panel--bank-transfer.deposit-info-panel--with-qr .deposit-info-value,
  .deposit-info-panel--crypto-wallet .deposit-info-value {
    width: 100%;
    justify-self: start;
  }

  .deposit-info-panel--bank-transfer.deposit-info-panel--with-qr .deposit-info-row strong,
  .deposit-info-panel--crypto-wallet .deposit-info-row strong {
    text-align: left;
  }

  .deposit-info-panel--bank-transfer .deposit-info-qr {
    justify-self: end;
  }

  .deposit-info-panel--bank-transfer.deposit-info-panel--with-qr .deposit-info-qr {
    grid-column: 1 / -1;
    justify-content: center;
    justify-self: center;
    order: -1;
  }

  .deposit-info-qr__container {
    width: 96px;
    height: 96px;
  }

  .deposit-upload-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .deposit-dialog-footer {
    gap: 10px;
  }
}
</style>
