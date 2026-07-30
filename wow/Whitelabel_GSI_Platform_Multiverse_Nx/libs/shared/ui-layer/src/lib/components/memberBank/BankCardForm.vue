<script setup lang="ts">
import { useI18n } from "#imports"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import type { BankCardFormState, OptionItem } from "../../composables/useMemberBankCard/types"

interface Props {
  title: string
  mode: "create" | "edit"
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
}

const props = withDefaults(defineProps<Props>(), {
  accountNameLabel: "",
  accountNumberLabel: "帳號",
  isSubmitting: false
})
const { t } = useI18n()

const form = defineModel<BankCardFormState>("form", { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
  typeChange: [value: number]
  currencyChange: [value: string]
  gatewayChange: [value?: number]
}>()

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

const isIdentityLocked = computed(() => props.mode === "edit")
</script>

<template>
  <div class="w-full h-full min-h-0 flex flex-col">
    <div class="w-full flex items-center gap-3 mb-4">
      <BaseIconBtn icon="mdi:arrow-left" theme="secondary" size="md" @click="emit('cancel')" />
      <div class="text-2xl phone:text-[32px] leading-9 phone:leading-10 font-bold text-[var(--text-text-primary)]">
        {{ props.title }}
      </div>
    </div>

    <div class="w-full flex-1 min-h-0 overflow-y-auto pr-0.5">
      <div class="grid grid-cols-1 gap-3">
        <BaseSelect
          :model-value="form.currency"
          :options="props.currencyOptions"
          option-label="label"
          option-value="value"
          :label="t('tableHeader.currency')"
          :placeholder="t('placeholder.pleaseSelect')"
          :disabled="isIdentityLocked"
          :invalid="Boolean(props.errors.currency)"
          :error-message="props.errors.currency"
          @update:model-value="emit('currencyChange', String($event))"
        />

        <BankCardTypeSelect
          v-model="form.payment_type_id"
          :options="props.typeOptions"
          :disabled="isIdentityLocked"
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
          :disabled="isIdentityLocked"
          :invalid="Boolean(props.errors.payment_gateway_id)"
          :error-message="props.errors.payment_gateway_id"
          @update:model-value="emit('gatewayChange', Number($event))"
        />

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
            v-model="form.bank_name"
            :label="t('member.register.bank_name')"
            required
            :placeholder="t('placeholder.pleaseEnter2')"
            :invalid="Boolean(props.errors.bank_name)"
            :error-message="props.errors.bank_name"
          />

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
    </div>

    <div class="w-full mt-5 grid grid-cols-2 gap-2 phone:mb-2">
      <BaseBtn size="xl" theme="primary" category="outline" @click="emit('cancel')">
        {{ t("common.btn.cancel") }}
      </BaseBtn>
      <BaseBtn size="xl" :loading="props.isSubmitting" @click="emit('submit')">
        {{ props.mode === "edit" ? t("common.btn.confirm") : "送出" }}
      </BaseBtn>
    </div>
  </div>
</template>
