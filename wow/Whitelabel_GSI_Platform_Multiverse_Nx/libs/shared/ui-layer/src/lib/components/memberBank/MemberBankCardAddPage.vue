<script setup lang="ts">
import { useMemberBankCard } from "../../composables/useMemberBankCard"
import { ROUTE_PATH } from "../../constants/routePath"

const {
  form,
  errors,
  typeOptions,
  currencyOptions,
  bankOptions,
  cryptoOptions,
  ewalletProviderOptions,
  paymentGatewayOptions,
  accountNameLabel,
  accountNumberLabel,
  isSubmitting,
  isLoadingForm,
  initializeCreatePage,
  onTypeChange,
  onCurrencyChange,
  onGatewayChange,
  submitCreate,
  clearErrors
} = useMemberBankCard()

const isDialogVisible = ref(true)

const getBackRoute = (paymentTypeId?: number) => {
  if (!paymentTypeId) return ROUTE_PATH.MEMBER.BANK_CARD

  return {
    path: ROUTE_PATH.MEMBER.BANK_CARD,
    query: {
      payment_type_id: String(paymentTypeId)
    }
  }
}

const goBack = async (paymentTypeId?: number) => {
  clearErrors()
  isDialogVisible.value = false
  await navigateTo(getBackRoute(paymentTypeId))
}

const handleSubmit = async () => {
  const paymentTypeId = await submitCreate()
  if (!paymentTypeId) return

  await goBack(paymentTypeId)
}

onMounted(async () => {
  await initializeCreatePage()
})
</script>

<template>
  <AddBankCardDialog
    v-model:form="form"
    :visible="isDialogVisible"
    :errors="errors"
    :type-options="typeOptions"
    :currency-options="currencyOptions"
    :bank-options="bankOptions"
    :crypto-options="cryptoOptions"
    :ewallet-provider-options="ewalletProviderOptions"
    :payment-gateway-options="paymentGatewayOptions"
    :account-name-label="accountNameLabel"
    :account-number-label="accountNumberLabel"
    :is-submitting="isSubmitting"
    :is-loading="isLoadingForm"
    @close="goBack"
    @submit="handleSubmit"
    @type-change="onTypeChange"
    @currency-change="onCurrencyChange"
    @gateway-change="onGatewayChange"
  />
</template>
