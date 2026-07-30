import type { BankCardItemType } from "@shared-lib/api/apiFunctions/bank_getBankCardList"
import type { EwalletProvider } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsEwalletProviderList"
import { getPayoutSettings } from "@shared-lib/api/apiFunctions/bank_getPayoutSettings"
import { getPayoutSettingsList } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import { usePayoutSettingsCreate } from "@shared-lib/api/hooks/usePayoutSettingsCreate"
import { usePayoutSettingsDelete } from "@shared-lib/api/hooks/usePayoutSettingsDelete"
import { usePayoutSettingsEwalletProviderList } from "@shared-lib/api/hooks/usePayoutSettingsEwalletProviderList"
import { usePayoutSettingsUpdate } from "@shared-lib/api/hooks/usePayoutSettingsUpdate"
import { usePlayerPaymentGatewayGroups } from "@shared-lib/api/hooks/usePlayerPaymentGatewayGroups"
import { useWithdrawBankList } from "@shared-lib/api/hooks/useWithdrawBankList"
import { useWithdrawCryptoCurrency } from "@shared-lib/api/hooks/useWithdrawCryptoCurrency"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { MEMBER_BANK_EDIT_ENUMS } from "@shared-lib/constants/enums/memberBankEdit"
import { TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST } from "@shared-lib/constants/tanstackQueryKeys/payoutSettingsKeys"
import { BANK_GATEWAY_TYPE_SET, WITHDRAW_PAYMENT_METHOD } from "./constants"
import {
  buildPayoutSettingsCreatePayload,
  buildPayoutSettingsUpdatePayload,
  clearFormErrors,
  createDefaultForm,
  resetFormState,
  resetTypeRelatedFormFields,
  validateFormState
} from "./form"
import { createMemberBankCardFlow } from "./flow.main"
import { createMemberBankCardSubmit } from "./submit"
import {
  isBankType,
  isCryptoType,
  isEWalletType,
  isVirtualType,
  parseEnvBoolean,
  resolveCurrencyCodeByIdFromSources,
  resolveCurrencyIdByCodeFromSources,
  resolveHeaderCurrencyCodeFromSources,
  resolveHeaderCurrencyIdFromSources,
  shouldUseCustomLabel
} from "./utils"
import type { BankCardCreateSeed, BankCardFormState, CurrencyOption, OptionItem, PaymentGatewayOption } from "./types"

export const useMemberBankCard = () => {
  const { $queryClient } = useNuxtApp() as any
  const { t } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const { selectedWallet, walletList, refetch: refetchWalletList } = useCurrencyInfo()
  const { setting: memberBankEditSetting } = useSetting<number | undefined>({ selector: (s) => s.member_bank_edit })
  const { pushToast } = useToastQueue()
  const { refetch: fetchPlayerPaymentGatewayGroups, isFetching: isLoadingPaymentGroups } =
    usePlayerPaymentGatewayGroups({
      params: { payment_method: WITHDRAW_PAYMENT_METHOD }
    })
  const { refetch: fetchEwalletProviders, isFetching: isLoadingEwalletProviders } =
    usePayoutSettingsEwalletProviderList()
  const { createPayoutSettings, isPending: isCreatingPayoutSettings } = usePayoutSettingsCreate()
  const { updatePayoutSettings, isPending: isUpdatingPayoutSettings } = usePayoutSettingsUpdate()
  const { removePayoutSettings, isPending: isDeletingBankCard } = usePayoutSettingsDelete()
  const { fetchWithdrawBankList } = useWithdrawBankList()
  const { fetchWithdrawCryptoCurrency } = useWithdrawCryptoCurrency()

  const cards = ref<BankCardItemType[]>([])
  const selectedType = ref(FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER)
  const typeOptions = ref<OptionItem[]>([])
  const currencyOptions = ref<OptionItem[]>([])
  const bankOptions = ref<OptionItem[]>([])
  const cryptoOptions = ref<OptionItem[]>([])
  const ewalletProviders = ref<EwalletProvider[]>([])
  const ewalletProviderOptions = ref<OptionItem[]>([])
  const allGateways = ref<PaymentGatewayOption[]>([])
  const availableCurrencies = ref<CurrencyOption[]>([])
  const form = reactive<BankCardFormState>(createDefaultForm())
  const errors = reactive<Record<string, string>>({})
  const isDeleteDialogVisible = ref(false)
  const isLoadingBankCards = ref(false)
  const isLoadingFormState = ref(false)
  const pendingDeleteCardId = ref<number | null>(null)

  const pendingDeleteCardName = computed(() => {
    if (pendingDeleteCardId.value === null) return "銀行卡"
    const target = cards.value.find((card) => Number(card.id) === Number(pendingDeleteCardId.value))
    return target?.name?.trim() || target?.bank_name?.trim() || "銀行卡"
  })

  const shouldShowMockData = computed(() => parseEnvBoolean(runtimeConfig.public.SHOW_MOCK_DATA))
  const canEditBankCard = computed(() => Number(memberBankEditSetting.value) === MEMBER_BANK_EDIT_ENUMS.OPEN)
  const isSubmitting = computed(() => isCreatingPayoutSettings.value || isUpdatingPayoutSettings.value)
  const isLoadingForm = computed(
    () => isLoadingFormState.value || isLoadingPaymentGroups.value || isLoadingEwalletProviders.value
  )
  const paymentGatewayOptions = computed(() =>
    allGateways.value.filter((item) => {
      const matchesType = Number(item.type) === Number(form.payment_type_id)
      const matchesCurrency = !form.currency || !item.currency_code || item.currency_code === form.currency
      return matchesType && matchesCurrency
    })
  )
  const selectedGateway = computed(() => {
    return (
      paymentGatewayOptions.value.find((item) => Number(item.value) === Number(form.payment_gateway_id)) ||
      paymentGatewayOptions.value.find((item) => Number(item.payout_method_id) === Number(form.payout_method_id))
    )
  })
  const showGatewaySelect = computed(
    () => BANK_GATEWAY_TYPE_SET.has(Number(form.payment_type_id)) && paymentGatewayOptions.value.length > 0
  )
  const accountNameLabel = computed(() =>
    shouldUseCustomLabel(selectedGateway.value?.payment_gateway_name, selectedGateway.value?.pg_code)
      ? "Full Name"
      : t("member.bank.accountName")
  )
  const accountNumberLabel = computed(() =>
    shouldUseCustomLabel(selectedGateway.value?.payment_gateway_name, selectedGateway.value?.pg_code)
      ? "CPF Number"
      : "帳號"
  )

  const clearErrors = () => clearFormErrors(errors)
  const resetForm = () => {
    resetFormState(form)
    clearErrors()
  }
  const resetTypeRelatedFields = () => resetTypeRelatedFormFields(form)

  const resolveCurrencyCodeById = (currencyId?: number) =>
    resolveCurrencyCodeByIdFromSources({
      currencyId,
      availableCurrencies: availableCurrencies.value,
      walletList: walletList.value
    })
  const resolveCurrencyIdByCode = (currencyCode?: string) =>
    resolveCurrencyIdByCodeFromSources({
      currencyCode,
      availableCurrencies: availableCurrencies.value,
      walletList: walletList.value
    })
  const resolveHeaderCurrencyCode = () =>
    resolveHeaderCurrencyCodeFromSources({
      selectedWallet: selectedWallet.value,
      availableCurrencies: availableCurrencies.value,
      walletList: walletList.value
    })
  const resolveHeaderCurrencyId = () =>
    resolveHeaderCurrencyIdFromSources({
      selectedWallet: selectedWallet.value,
      availableCurrencies: availableCurrencies.value,
      walletList: walletList.value
    })

  const invalidateBankCardListQuery = async () => {
    await $queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_KEY_PAYOUT_SETTINGS_LIST] })
  }

  const flow = createMemberBankCardFlow({
    shouldShowMockData,
    form,
    cards,
    selectedType,
    typeOptions,
    currencyOptions,
    bankOptions,
    cryptoOptions,
    ewalletProviders,
    ewalletProviderOptions,
    allGateways,
    availableCurrencies,
    paymentGatewayOptions,
    showGatewaySelect,
    translate: t,
    walletList,
    refetchWalletList,
    isLoadingBankCards,
    isLoadingForm: isLoadingFormState,
    fetchPlayerPaymentGatewayGroups,
    fetchEwalletProviders,
    fetchWithdrawBankList,
    fetchWithdrawCryptoCurrency,
    fetchPayoutSettingsList: getPayoutSettingsList,
    fetchPayoutSettings: getPayoutSettings,
    resolveCurrencyCodeById,
    resolveCurrencyIdByCode,
    resolveHeaderCurrencyCode,
    resolveHeaderCurrencyId,
    resetTypeRelatedFields
  })

  const buildCreatePayload = () =>
    buildPayoutSettingsCreatePayload({
      form,
      isEWallet: isEWalletType(form.payment_type_id),
      isCrypto: isCryptoType(form.payment_type_id),
      bankOptions: bankOptions.value
    })

  const buildUpdatePayload = () =>
    buildPayoutSettingsUpdatePayload({
      form,
      isEWallet: isEWalletType(form.payment_type_id),
      isCrypto: isCryptoType(form.payment_type_id),
      bankOptions: bankOptions.value
    })

  const isValidForm = () =>
    validateFormState({
      form,
      errors,
      showGateway: showGatewaySelect.value,
      isEWallet: isEWalletType(form.payment_type_id),
      isCrypto: isCryptoType(form.payment_type_id),
      messages: {
        enterCardNumberFirst: t("enter_card_number_first"),
        selectPaymentMethod: t("error_msg.please_select_payment_method"),
        selectPaymentProvider: t("error_msg.please_select_payment_method")
      }
    })

  const submit = createMemberBankCardSubmit({
    shouldShowMockData,
    form,
    allGateways,
    ensureMockCardsInitialized: flow.ensureMockCardsInitialized,
    resolveCurrencyIdByCode,
    resolveHeaderCurrencyId,
    buildCreatePayload,
    buildUpdatePayload,
    isValidForm,
    createPayoutSettings,
    updatePayoutSettings,
    removePayoutSettings,
    invalidateBankCardListQuery,
    pushToast
  })

  watch(
    () => selectedWallet.value?.currency_id,
    async (nextCurrencyId, previousCurrencyId) => {
      if (!nextCurrencyId || Number(nextCurrencyId) === Number(previousCurrencyId)) return
      await flow.handleHeaderCurrencyChange(Number(nextCurrencyId))
    }
  )

  const handleSearch = async () => {
    await flow.loadCards()
  }

  // Delete dialog state
  const openDeleteDialog = (id: number) => {
    if (isDeletingBankCard.value) return
    pendingDeleteCardId.value = id
    isDeleteDialogVisible.value = true
  }

  const closeDeleteDialog = () => {
    isDeleteDialogVisible.value = false
    pendingDeleteCardId.value = null
  }

  const confirmDelete = async () => {
    if (isDeletingBankCard.value || pendingDeleteCardId.value === null) return

    await submit.submitDelete(Number(pendingDeleteCardId.value))
    await flow.loadCards()
    closeDeleteDialog()
  }

  return {
    cards,
    selectedType,
    typeOptions,
    currencyOptions,
    bankOptions,
    cryptoOptions,
    ewalletProviderOptions,
    paymentGatewayOptions,
    accountNameLabel,
    accountNumberLabel,
    showGatewaySelect,
    form,
    errors,
    canEditBankCard,
    isLoadingBankCards,
    isLoadingForm,
    isSubmitting,
    isDeletingBankCard,
    isVirtualType,
    isBankType,
    loadCards: flow.loadCards,
    initializeListPage: flow.initializeListPage,
    initializeCreatePage: async (seed?: BankCardCreateSeed) => {
      resetForm()
      await flow.initializeCreatePage(seed)
    },
    initializeEditPage: async (id: number) => {
      resetForm()
      await flow.initializeEditPage(id)
    },
    onTypeChange: flow.onTypeChange,
    onCurrencyChange: flow.onCurrencyChange,
    onGatewayChange: flow.onGatewayChange,
    submitCreate: submit.submitCreate,
    submitEdit: submit.submitEdit,
    resetForm,
    clearErrors,
    handleSearch,

    // Delete dialog
    isDeleteDialogVisible,
    pendingDeleteCardName,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete
  }
}
