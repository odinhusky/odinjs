<script setup lang="ts">
import { useMemberBankCard } from "../../composables/useMemberBankCard"
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"
import { ROUTE_PATH } from "../../constants/routePath"

const route = useRoute()

const bankCardId = computed(() => {
  const id = Number(route.params.id)
  if (!Number.isFinite(id) || id <= 0) return undefined
  return id
})

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.BANK_CARD
)

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
  initializeEditPage,
  onTypeChange,
  onCurrencyChange,
  onGatewayChange,
  submitEdit,
  clearErrors
} = useMemberBankCard()

const goBack = () => {
  clearErrors()
  navigateTo(ROUTE_PATH.MEMBER.BANK_CARD)
}

const getBankCardListRoute = (paymentTypeId: number) => ({
  path: ROUTE_PATH.MEMBER.BANK_CARD,
  query: {
    payment_type_id: String(paymentTypeId)
  }
})

const handleSubmit = async () => {
  const paymentTypeId = await submitEdit()
  if (!paymentTypeId) return

  await navigateTo(getBankCardListRoute(paymentTypeId))
}

onMounted(async () => {
  if (!bankCardId.value) {
    await navigateTo(ROUTE_PATH.MEMBER.BANK_CARD)
    return
  }
  await initializeEditPage(bankCardId.value)
})
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="提款資訊"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.BANK_CARD" @select="handleAsideSelect" />
    </template>

    <div
      v-if="isLoadingForm"
      class="w-full h-full min-h-0 flex items-center justify-center text-[var(--text-text-primary)]"
    >
      Loading...
    </div>

    <BankCardForm
      v-else
      v-model:form="form"
      title="編輯銀行卡"
      mode="edit"
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
      @cancel="goBack"
      @submit="handleSubmit"
      @type-change="onTypeChange"
      @currency-change="onCurrencyChange"
      @gateway-change="onGatewayChange"
    />
  </MemberContainer>
</template>
