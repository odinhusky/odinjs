<script setup lang="ts">
import { useI18n } from "#imports"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { BankCardFormState, OptionItem } from "../../composables/useMemberBankCard/types"

interface Props {
  visible: boolean
  errors: Record<string, string>
  typeOptions: OptionItem[]
  currencyOptions: OptionItem[]
  bankOptions: OptionItem[]
  cryptoOptions: OptionItem[]
  ewalletProviderOptions: OptionItem[]
  paymentGatewayOptions: OptionItem[]
  accountNameLabel?: string
  accountNumberLabel?: string
  isSubmitting?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accountNameLabel: "",
  accountNumberLabel: "帳號",
  isSubmitting: false,
  isLoading: false
})

const form = defineModel<BankCardFormState>("form", { required: true })

const emit = defineEmits<{
  close: []
  submit: []
  typeChange: [value: number]
  currencyChange: [value: string]
  gatewayChange: [value?: number]
}>()

const { t } = useI18n()

const showGatewaySelect = computed(() => {
  return (
    (form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.E_WALLET ||
      form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT) &&
    props.paymentGatewayOptions.length > 0
  )
})

const isBankType = computed(() => {
  return form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER
})

const isEWalletType = computed(() => {
  return form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.E_WALLET
})

const isVirtualType = computed(() => {
  return (
    form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET ||
    form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT
  )
})

const cryptoSelectLabel = computed(() => {
  return form.value.payment_type_id === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT ? "貨幣" : t("tableHeader.currency")
})

const resolvedAccountNameLabel = computed((): string => props.accountNameLabel || t("member.bank.accountName"))
</script>

<template>
  <BaseDialog
    :visible="props.visible"
    :class-obj="{
      root: cx('max-w-[775px]'),
      body: cx('gap-4 p-5 phone:p-4')
    }"
    @close="emit('close')"
  >
    <template #header>
      {{ t("add_bank_card") }}
    </template>

    <div v-if="props.isLoading" :class="cx(FLEX_CENTER, 'py-16')">
      <BaseIcon name="mdi:loading" class="animate-spin text-[var(--text-text-primary)]" size="32px" />
    </div>

    <template v-else>
      <div
        :class="
          cx(
            'flex items-start gap-2 rounded-lg bg-[var(--message-message-bg-negative)] px-3 py-2.5 text-sm font-medium leading-5 text-[var(--message-message-title-negative)]'
          )
        "
      >
        <BaseIcon name="si:warning-fill" size="18px" class="mt-0.5 shrink-0" />
        <span>{{ t("add_bank_card_missing_hint") }}</span>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <BaseSelect
          :model-value="form.currency"
          :options="props.currencyOptions"
          option-label="label"
          option-value="value"
          :label="t('member.register.currency')"
          :placeholder="t('placeholder.pleaseSelect')"
          :invalid="Boolean(props.errors.currency)"
          :error-message="props.errors.currency"
          @update:model-value="emit('currencyChange', String($event))"
        />

        <BankCardTypeSelect
          v-model="form.payment_type_id"
          :options="props.typeOptions"
          :invalid="Boolean(props.errors.payment_type_id)"
          :error-message="props.errors.payment_type_id"
          @change="emit('typeChange', Number($event))"
        />

        <BaseSelect
          v-if="showGatewaySelect"
          :model-value="form.payment_gateway_id"
          :options="props.paymentGatewayOptions"
          option-label="label"
          option-value="value"
          :label="t('bank_column.gateway')"
          :placeholder="t('placeholder.pleaseSelect')"
          :invalid="Boolean(props.errors.payment_gateway_id)"
          :error-message="props.errors.payment_gateway_id"
          @update:model-value="emit('gatewayChange', Number($event))"
        />

        <template v-if="isBankType">
          <BaseInput
            v-model="form.bank_name"
            :label="t('member.register.bank_name')"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.bank_name)"
            :error-message="props.errors.bank_name"
          />
        </template>

        <BaseInput
          v-model="form.name"
          :label="t('member.bank.name')"
          required
          :placeholder="t('placeholder.pleaseEnter2')"
          :invalid="Boolean(props.errors.name)"
          :error-message="props.errors.name"
        />

        <template v-if="isBankType">
          <BaseInput
            v-model="form.account_name"
            :label="t('member.bank.accountName')"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.account_name)"
            :error-message="props.errors.account_name"
          />

          <BaseInput
            v-model="form.account_number"
            :label="t('member.register.account_number')"
            required
            placeholder="0000 0000 0000 0000"
            :invalid="Boolean(props.errors.account_number)"
            :error-message="props.errors.account_number"
          />
        </template>

        <template v-if="isEWalletType">
          <BaseSelect
            v-model="form.ewallet_provider_id"
            :options="props.ewalletProviderOptions"
            option-label="label"
            option-value="value"
            :label="t('table_header.payment_provider')"
            :placeholder="t('placeholder.pleaseSelect')"
            :invalid="Boolean(props.errors.ewallet_provider_id)"
            :error-message="props.errors.ewallet_provider_id"
          />

          <BaseInput
            v-model="form.account_name"
            :label="resolvedAccountNameLabel"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.account_name)"
            :error-message="props.errors.account_name"
          />

          <BaseInput
            v-model="form.account_number"
            :label="props.accountNumberLabel"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.account_number)"
            :error-message="props.errors.account_number"
          />
        </template>

        <template v-if="isVirtualType">
          <BaseSelect
            v-model="form.crypto_id"
            :options="props.cryptoOptions"
            option-label="label"
            option-value="value"
            :label="cryptoSelectLabel"
            :placeholder="t('placeholder.pleaseSelect')"
            :invalid="Boolean(props.errors.crypto_id)"
            :error-message="props.errors.crypto_id"
          />

          <BaseSelect
            v-model="form.bank_id"
            :options="props.bankOptions"
            option-label="label"
            option-value="value"
            :label="t('deposit_network')"
            :placeholder="t('placeholder.pleaseSelect')"
            :invalid="Boolean(props.errors.bank_id)"
            :error-message="props.errors.bank_id"
          />

          <BaseInput
            v-model="form.wallet_address"
            :label="t('member.deposit.walletAddress')"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.wallet_address)"
            :error-message="props.errors.wallet_address"
          />
        </template>
      </div>
    </template>

    <template #footer>
      <div class="w-full grid grid-cols-2 gap-4 phone:gap-3">
        <BaseBtn size="xl" theme="primary" category="outline" :disabled="props.isSubmitting" @click="emit('close')">
          {{ t("common.btn.cancel") }}
        </BaseBtn>
        <BaseBtn
          size="xl"
          :loading="props.isSubmitting"
          :disabled="props.isSubmitting || props.isLoading"
          @click="emit('submit')"
        >
          {{ t("common.btn.confirm") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>
