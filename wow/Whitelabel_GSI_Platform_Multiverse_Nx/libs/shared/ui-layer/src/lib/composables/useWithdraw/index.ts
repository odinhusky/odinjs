import { useI18n } from "#imports"
import { FEE_TYPE_ENUMS } from "@shared-lib/constants/enums/feeType"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { MEMBER_BANK_EDIT_ENUMS } from "@shared-lib/constants/enums/memberBankEdit"
import type { WithdrawPaymentDetail } from "@shared-lib/api/apiFunctions/bank_withdrawPaymentDetail"
import { getPaymentImg } from "@shared-lib/api/apiFunctions/bank_getPaymentImg"
import { getPayoutSettingsEwalletProviderList } from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsEwalletProviderList"
import {
  getPayoutSettings,
  type GetPayoutSettingsResponseType
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettings"
import {
  getPayoutSettingsList,
  type PayoutSettingItem,
  type PayoutSettingMethodType,
  type PayoutSettingPayload
} from "@shared-lib/api/apiFunctions/bank_getPayoutSettingsList"
import type {
  AgentPaymentGatewayItem,
  PlayerPaymentGatewayGroupItem
} from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import type { UserWalletItem } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"
import type { ApiResponse } from "@shared-lib/api/types"
import { useWithdrawPaymentDetail } from "@shared-lib/api/hooks/useWithdrawPaymentDetail"
import { useBankWithdraw } from "@shared-lib/api/hooks/useBankWithdraw"
import { usePlayerPaymentGatewayGroups } from "@shared-lib/api/hooks/usePlayerPaymentGatewayGroups"

export type WithdrawCategory = "fiat" | "crypto"

interface SelectChannelOptions {
  autoCollapse: boolean
}

interface WithdrawCategoryOption {
  label: string
  value: WithdrawCategory
}

interface WithdrawChannel {
  currency: number
  currencyCode: string
  group_id: number
  id: number
  imgUrl: string
  logo_image_id: number
  max_amount: string
  min_amount: string
  name: string
  payment_gateway_id: number
  payment_type_id: FUND_METHOD_TYPE_ENUMS
  payout_method_id: number | null
  payoutSettingMethodType: PayoutSettingMethodType
  remark: string
  sort_priority: number
  type: FUND_METHOD_TYPE_ENUMS
}

interface WithdrawAccountDetailItem {
  label: string
  value: string
}

export interface WithdrawAccountCard {
  detailItems: WithdrawAccountDetailItem[]
  id: number
  isCrypto: boolean
  methodType: PayoutSettingMethodType
  name: string
  primaryText: string
}

const WITHDRAW_PAYMENT_METHOD = 2
const CRYPTO_CURRENCY_TYPE = 2
const BANK_CARD_METHOD_TYPE: PayoutSettingMethodType = 1
const EWALLET_METHOD_TYPE: PayoutSettingMethodType = 2
const CRYPTO_WALLET_METHOD_TYPE: PayoutSettingMethodType = 3
const BANK_ID_LABEL = "Bank ID"
const CRYPTO_ID_LABEL = "Crypto ID"

const PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE: Record<PayoutSettingMethodType, FUND_METHOD_TYPE_ENUMS> = {
  [BANK_CARD_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.BANK_TRANSFER,
  [EWALLET_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.E_WALLET,
  [CRYPTO_WALLET_METHOD_TYPE]: FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET
}

const getPositiveNumber = (value: unknown): number | null => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

const getDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const createApiResponseError = <T>(response: ApiResponse<T>, requestName: string): Error => {
  const responseError = response.error as { code?: number; message?: string } | undefined
  const message = response.msg || responseError?.message || "Unknown API error"
  const code = response.code ?? responseError?.code ?? "unknown"
  return new Error(`${requestName} failed: ${message} (code: ${code})`)
}

const getSuccessfulApiData = <T>(response: ApiResponse<T>, requestName: string): T => {
  if (response.status !== true) throw createApiResponseError(response, requestName)
  if (response.data === null || response.data === undefined) {
    throw new Error(`${requestName} returned empty data`)
  }

  return response.data
}

const createDetailItem = (label: string, value: unknown): WithdrawAccountDetailItem | null => {
  const displayValue = getDisplayText(value)
  return displayValue ? { label, value: displayValue } : null
}

const compactDetailItems = (items: Array<WithdrawAccountDetailItem | null>): WithdrawAccountDetailItem[] => {
  return items.filter((item): item is WithdrawAccountDetailItem => item !== null)
}

const formatAccountNumber = (value: unknown): string => {
  const source = getDisplayText(value)
  if (!source) return "-"
  if (source.length <= 8) return source

  return `${source.slice(0, 4)} ${source.slice(4, 8)} ${"*".repeat(Math.max(0, source.length - 8))}`
}

const isPayoutSettingMethodType = (value: unknown): value is PayoutSettingMethodType => {
  const numberValue = Number(value)
  return (
    numberValue === BANK_CARD_METHOD_TYPE ||
    numberValue === EWALLET_METHOD_TYPE ||
    numberValue === CRYPTO_WALLET_METHOD_TYPE
  )
}

const normalizePayoutSettingMethodType = (value: unknown): PayoutSettingMethodType | null => {
  return isPayoutSettingMethodType(value) ? (Number(value) as PayoutSettingMethodType) : null
}

const normalizePaymentType = (value: unknown): FUND_METHOD_TYPE_ENUMS | null => {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? (numberValue as FUND_METHOD_TYPE_ENUMS) : null
}

const getCurrencyCategory = (currencyType: unknown): WithdrawCategory => {
  return Number(currencyType) === CRYPTO_CURRENCY_TYPE ? "crypto" : "fiat"
}

const getMethodTypeFromPaymentType = (paymentType: FUND_METHOD_TYPE_ENUMS | null): PayoutSettingMethodType | null => {
  if (paymentType === null) return null
  if (Number(paymentType) === Number(FUND_METHOD_TYPE_ENUMS.E_WALLET)) return EWALLET_METHOD_TYPE
  if (
    Number(paymentType) === Number(FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET) ||
    Number(paymentType) === Number(FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT)
  ) {
    return CRYPTO_WALLET_METHOD_TYPE
  }
  return BANK_CARD_METHOD_TYPE
}

const resolvePayoutSettingMethodType = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem
): PayoutSettingMethodType => {
  const explicitMethodType =
    normalizePayoutSettingMethodType(gateway.method_type) || normalizePayoutSettingMethodType(group.method_type)
  if (explicitMethodType) return explicitMethodType

  const paymentType = normalizePaymentType(
    gateway.payment_type_id || gateway.type || group.payment_type_id || group.type
  )
  const methodType = getMethodTypeFromPaymentType(paymentType)
  if (methodType) return methodType

  return Number(group.currency_type) === CRYPTO_CURRENCY_TYPE ? CRYPTO_WALLET_METHOD_TYPE : BANK_CARD_METHOD_TYPE
}

const resolvePaymentType = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem,
  methodType: PayoutSettingMethodType
): FUND_METHOD_TYPE_ENUMS => {
  return (
    normalizePaymentType(gateway.payment_type_id || gateway.type || group.payment_type_id || group.type) ||
    PAYMENT_TYPE_BY_PAYOUT_METHOD_TYPE[methodType]
  )
}

const resolveCurrencyCode = (groupsCurrencyId: number, walletList: UserWalletItem[]): string => {
  return (
    walletList.find((wallet) => Number(wallet.currency_id) === groupsCurrencyId)?.currency_code || String(groupsCurrencyId)
  )
}

const getChannelLogoImageId = (group: PlayerPaymentGatewayGroupItem, gateway: AgentPaymentGatewayItem): number => {
  return getPositiveNumber(gateway.logo_image_id) || getPositiveNumber(group.logo_image_id) || 0
}

const getChannelImage = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem,
  logoMap: Record<number, string>
): string => {
  const logoImageId = getChannelLogoImageId(group, gateway)
  return logoMap[logoImageId] || getDisplayText(gateway.icon_path) || getDisplayText(group.icon_path)
}

const normalizeWithdrawChannel = (
  group: PlayerPaymentGatewayGroupItem,
  gateway: AgentPaymentGatewayItem,
  currencyCode: string,
  logoMap: Record<number, string>
): WithdrawChannel => {
  const gatewayId = getPositiveNumber(gateway.payment_gateway_id) || getPositiveNumber(gateway.id)
  const groupId = getPositiveNumber(group.id)
  if (!gatewayId || !groupId) {
    throw new Error(`Missing withdrawal gateway id or group id for group ${group.id} and gateway ${gateway.id}`)
  }

  const methodType = resolvePayoutSettingMethodType(group, gateway)
  const paymentType = resolvePaymentType(group, gateway, methodType)
  const payoutMethodId = getPositiveNumber(gateway.payout_method_id) || getPositiveNumber(group.payout_method_id)
  const logoImageId = getChannelLogoImageId(group, gateway)

  return {
    currency: Number(group.currency),
    currencyCode,
    group_id: groupId,
    id: gatewayId,
    imgUrl: getChannelImage(group, gateway, logoMap),
    logo_image_id: logoImageId,
    max_amount: getDisplayText(gateway.max_amount || group.max_amount || "0"),
    min_amount: getDisplayText(gateway.min_amount || group.min_amount || "0"),
    name: getDisplayText(gateway.name || group.name || "-"),
    payment_gateway_id: gatewayId,
    payment_type_id: paymentType,
    payout_method_id: payoutMethodId,
    payoutSettingMethodType: methodType,
    remark: getDisplayText(gateway.payment_gateway_name || gateway.pg_code || ""),
    sort_priority: Number(gateway.sort_priority || group.sort_priority || 0),
    type: paymentType
  }
}

const sortChannels = (channels: WithdrawChannel[]): WithdrawChannel[] => {
  return [...channels].sort((a, b) => a.sort_priority - b.sort_priority || a.name.localeCompare(b.name))
}

export function useWithdraw() {
  const { t } = useI18n()
  const { refetch: fetchPlayerPaymentGatewayGroups, isFetching: isLoadingList } = usePlayerPaymentGatewayGroups({
    params: { payment_method: WITHDRAW_PAYMENT_METHOD }
  })
  const { fetchWithdrawPaymentDetail, isFetching: isLoadingDetail } = useWithdrawPaymentDetail()
  const { submitWithdraw, isPending: isSubmitting } = useBankWithdraw()
  const { pushToast } = useToastQueue()
  const walletStore = useWalletStore()

  const { setting: memberBankEditSetting } = useSetting<number | undefined>({ selector: (s) => s.member_bank_edit })

  const isInitialized = ref(false)
  const isLoading = ref(false)
  const isLoadingPayoutSettings = ref(false)
  const paymentGroups = ref<PlayerPaymentGatewayGroupItem[]>([])
  const payoutSettings = ref<PayoutSettingItem[]>([])
  const payoutSettingDetails = ref<Record<number, PayoutSettingItem>>({})
  const ewalletProviderNameMap = ref<Record<number, string>>({})
  const isEwalletProviderNameMapLoaded = ref(false)
  const logoMap = ref<Record<number, string>>({})
  const supportedCurrencies = ref<string[]>([])
  let ewalletProviderNameMapPromise: Promise<void> | null = null

  const selectedCurrency = ref("")
  const selectedCategory = ref<WithdrawCategory>("fiat")
  const selectedGatewayId = ref<number>(0)
  const selectedBankCardId = ref<number>(0)
  const isChannelExpanded = ref(true)

  const paymentDetail = ref<WithdrawPaymentDetail | null>(null)
  const amount = ref("")

  const currencyOptions = computed(() => supportedCurrencies.value.map((currency) => ({ label: currency, value: currency })))

  const groupsForSelectedCurrency = computed(() => {
    return paymentGroups.value.filter(
      (group) => resolveCurrencyCode(Number(group.currency), walletStore.walletList) === selectedCurrency.value
    )
  })

  const categoryOptions = computed((): WithdrawCategoryOption[] => {
    const categories = new Set(groupsForSelectedCurrency.value.map((group) => getCurrencyCategory(group.currency_type)))
    const options: WithdrawCategoryOption[] = []
    if (categories.has("fiat")) options.push({ label: "法幣", value: "fiat" })
    if (categories.has("crypto")) options.push({ label: "加密貨幣", value: "crypto" })
    return options
  })

  const showCurrencySelector = computed((): boolean => currencyOptions.value.length > 1)
  const showCategorySelector = computed((): boolean => categoryOptions.value.length > 1)

  const channelList = computed((): WithdrawChannel[] => {
    const channels = groupsForSelectedCurrency.value
      .filter((group) => getCurrencyCategory(group.currency_type) === selectedCategory.value)
      .flatMap((group) => {
        const currencyCode = resolveCurrencyCode(Number(group.currency), walletStore.walletList)
        return (group.agent_payment_gateways || []).map((gateway) =>
          normalizeWithdrawChannel(group, gateway, currencyCode, logoMap.value)
        )
      })

    return sortChannels(channels)
  })

  const selectedChannel = computed(() => channelList.value.find((channel) => channel.id === selectedGatewayId.value) || null)

  const selectedWallet = computed(
    () => walletStore.walletList.find((wallet) => wallet.currency_code === selectedCurrency.value) || null
  )

  const isCrypto = computed(() => {
    const channel = selectedChannel.value
    if (!channel) return false
    return (
      channel.type === FUND_METHOD_TYPE_ENUMS.CRYPTO_WALLET ||
      channel.type === FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT ||
      channel.payoutSettingMethodType === CRYPTO_WALLET_METHOD_TYPE
    )
  })

  const cryptoRate = computed(() => 0)

  const cryptoReceiveAmount = computed(() => {
    const num = Number(String(amount.value || "0").replace(/,/g, ""))
    return Number.isFinite(num) ? String(num * cryptoRate.value) : "0"
  })

  const withdrawMin = computed(() => paymentDetail.value?.withdraw_min || selectedChannel.value?.min_amount || "0")
  const withdrawMax = computed(() => paymentDetail.value?.withdraw_max || selectedChannel.value?.max_amount || "0")

  const hasFee = computed(() => {
    const detail = paymentDetail.value
    if (!detail) return false
    return parseFloat(detail.fee_amount || "0") > 0 || parseFloat(detail.fee_rate || "0") > 0
  })

  const feeText = computed(() => {
    const detail = paymentDetail.value
    if (!detail || !hasFee.value) return ""
    return detail.fee_type === FEE_TYPE_ENUMS.AMOUNT ? detail.fee_amount : `${detail.fee_rate}%`
  })

  const quickAmounts = computed(() => {
    const fromApi = paymentDetail.value?.quick_amounts
    return fromApi?.filter((value) => String(value || "").trim()) || []
  })

  const canEditBankCard = computed(() => Number(memberBankEditSetting.value) === MEMBER_BANK_EDIT_ENUMS.OPEN)

  const isFormReady = computed(() => isInitialized.value && selectedGatewayId.value > 0 && !isLoadingDetail.value)

  const getPayoutSettingPayload = (setting: PayoutSettingItem): PayoutSettingPayload => setting.payload || {}

  const getEwalletProviderName = (providerId: unknown): string => {
    const id = getPositiveNumber(providerId)
    if (!id) return ""
    return ewalletProviderNameMap.value[id] || String(id)
  }

  const createBankAccountDetailItems = (
    payload: PayoutSettingPayload,
    channelName: string
  ): WithdrawAccountDetailItem[] => {
    return compactDetailItems([
      createDetailItem(t("edit_form.bank_account"), payload.bank_name),
      createDetailItem(BANK_ID_LABEL, payload.bank_id),
      createDetailItem(t("bank_column.gateway"), channelName)
    ])
  }

  const createEwalletAccountDetailItems = (
    setting: PayoutSettingItem,
    channelName: string
  ): WithdrawAccountDetailItem[] => {
    return compactDetailItems([
      createDetailItem(t("table_header.payment_provider"), getEwalletProviderName(setting.ewallet_provider_id)),
      createDetailItem(t("bank_column.gateway"), channelName)
    ])
  }

  const createCryptoAccountDetailItems = (
    payload: PayoutSettingPayload,
    channelName: string
  ): WithdrawAccountDetailItem[] => {
    return compactDetailItems([
      createDetailItem(t("deposit_network"), payload.chain),
      createDetailItem(CRYPTO_ID_LABEL, payload.crypto_id),
      createDetailItem(t("bank_column.gateway"), channelName)
    ])
  }

  const createAccountDetailItems = (
    setting: PayoutSettingItem,
    methodType: PayoutSettingMethodType
  ): WithdrawAccountDetailItem[] => {
    const payload = getPayoutSettingPayload(setting)
    const channelName = selectedChannel.value?.name || ""

    if (methodType === CRYPTO_WALLET_METHOD_TYPE) {
      return createCryptoAccountDetailItems(payload, channelName)
    }

    if (methodType === EWALLET_METHOD_TYPE) {
      return createEwalletAccountDetailItems(setting, channelName)
    }

    return createBankAccountDetailItems(payload, channelName)
  }

  const getAccountCardName = (
    setting: PayoutSettingItem,
    payload: PayoutSettingPayload,
    methodType: PayoutSettingMethodType
  ): string => {
    if (methodType === CRYPTO_WALLET_METHOD_TYPE) return getDisplayText(setting.name) || "-"
    return getDisplayText(payload.account_name) || "-"
  }

  const createWithdrawAccountCard = (setting: PayoutSettingItem): WithdrawAccountCard | null => {
    const id = getPositiveNumber(setting.id)
    const methodType = normalizePayoutSettingMethodType(setting.method_type)
    if (!id || !methodType) return null

    const payload = getPayoutSettingPayload(setting)
    const name = getAccountCardName(setting, payload, methodType)
    const primaryText =
      methodType === CRYPTO_WALLET_METHOD_TYPE
        ? getDisplayText(payload.wallet_address) || "-"
        : formatAccountNumber(payload.account_number)

    return {
      detailItems: createAccountDetailItems(setting, methodType),
      id,
      isCrypto: methodType === CRYPTO_WALLET_METHOD_TYPE,
      methodType,
      name,
      primaryText
    }
  }

  const bankCards = computed(() => {
    return payoutSettings.value
      .map((setting) => createWithdrawAccountCard(setting))
      .filter((account): account is WithdrawAccountCard => account !== null)
  })

  const selectedBankCard = computed(() => bankCards.value.find((card) => card.id === selectedBankCardId.value) || null)

  const loadLogos = async (channels: WithdrawChannel[]): Promise<void> => {
    const missing = channels.filter((channel) => channel.logo_image_id > 0 && !logoMap.value[channel.logo_image_id])
    await Promise.allSettled(
      missing.map(async (channel) => {
        const result = await getPaymentImg(channel.logo_image_id)
        if (result.status && result.data) {
          logoMap.value[channel.logo_image_id] = String(result.data)
        }
      })
    )
  }

  const loadEwalletProviders = async (): Promise<void> => {
    if (isEwalletProviderNameMapLoaded.value) return
    if (ewalletProviderNameMapPromise) return ewalletProviderNameMapPromise

    ewalletProviderNameMapPromise = (async () => {
      const data = getSuccessfulApiData(
        await getPayoutSettingsEwalletProviderList(),
        "getPayoutSettingsEwalletProviderList"
      )
      if (!Array.isArray(data)) throw new Error("getPayoutSettingsEwalletProviderList returned invalid provider list")

      ewalletProviderNameMap.value = data.reduce<Record<number, string>>((resultMap, provider) => {
        const id = getPositiveNumber(provider.id)
        if (!id) return resultMap

        return {
          ...resultMap,
          [id]: getDisplayText(provider.name || provider.code || id)
        }
      }, {})
      isEwalletProviderNameMapLoaded.value = true
    })().finally(() => {
      ewalletProviderNameMapPromise = null
    })

    return ewalletProviderNameMapPromise
  }

  const resetFormState = () => {
    amount.value = ""
    selectedBankCardId.value = 0
    payoutSettings.value = []
  }

  const applyPayoutSettingDetail = (detail: GetPayoutSettingsResponseType | null) => {
    const id = getPositiveNumber(detail?.id)
    if (!detail || !id) return

    payoutSettingDetails.value = {
      ...payoutSettingDetails.value,
      [id]: detail
    }
    payoutSettings.value = payoutSettings.value.map((setting) => (Number(setting.id) === id ? detail : setting))
  }

  const loadPayoutSettingDetail = async (settingId: number): Promise<PayoutSettingItem | null> => {
    const existing = payoutSettingDetails.value[settingId]
    if (existing) return existing

    const detail = getSuccessfulApiData(await getPayoutSettings({ id: settingId }), "getPayoutSettings")
    applyPayoutSettingDetail(detail)
    return detail
  }

  const handleBankCardSelect = async (cardId: number) => {
    selectedBankCardId.value = cardId
    await loadPayoutSettingDetail(cardId)
  }

  const loadPayoutSettings = async () => {
    const channel = selectedChannel.value
    if (!channel) return

    selectedBankCardId.value = 0
    payoutSettings.value = []
    isLoadingPayoutSettings.value = true
    try {
      if (channel.payoutSettingMethodType === EWALLET_METHOD_TYPE) {
        await loadEwalletProviders()
      }

      const data = getSuccessfulApiData(
        await getPayoutSettingsList({ method_type: channel.payoutSettingMethodType }),
        "getPayoutSettingsList"
      )
      if (!Array.isArray(data.list)) throw new Error("getPayoutSettingsList returned invalid list")

      const list = data.list
      const filtered =
        channel.payout_method_id === null
          ? list
          : list.filter((setting) => Number(setting.payout_method_id) === channel.payout_method_id)
      payoutSettings.value = filtered

      const firstId = getPositiveNumber(filtered[0]?.id)
      if (firstId) await handleBankCardSelect(firstId)
    } finally {
      isLoadingPayoutSettings.value = false
    }
  }

  const selectChannel = async (id: number, options: SelectChannelOptions) => {
    selectedGatewayId.value = id
    paymentDetail.value = null
    resetFormState()

    const result = await fetchWithdrawPaymentDetail(id)
    if (result?.data) {
      paymentDetail.value = result.data as WithdrawPaymentDetail
    }

    if (options.autoCollapse) isChannelExpanded.value = false

    await loadPayoutSettings()
  }

  const resetChannel = async () => {
    const channels = channelList.value
    await loadLogos(channels)
    if (channels.length > 0) {
      await selectChannel(channels[0].id, { autoCollapse: true })
    } else {
      selectedGatewayId.value = 0
      paymentDetail.value = null
      resetFormState()
    }
  }

  const resetCategoryAndChannel = async () => {
    const options = categoryOptions.value
    if (options.length > 0 && !options.find((option) => option.value === selectedCategory.value)) {
      selectedCategory.value = options[0].value
    }
    await resetChannel()
  }

  const setSupportedCurrencies = (groups: PlayerPaymentGatewayGroupItem[]) => {
    const currencies = Array.from(
      new Set(groups.map((group) => resolveCurrencyCode(Number(group.currency), walletStore.walletList)).filter(Boolean))
    )
    supportedCurrencies.value = currencies
  }

  const init = async () => {
    if (isLoading.value) return
    isLoading.value = true
    isInitialized.value = false
    try {
      const result = await fetchPlayerPaymentGatewayGroups()
      const groups = (result.data || []) as PlayerPaymentGatewayGroupItem[]
      paymentGroups.value = groups
      setSupportedCurrencies(groups)
      if (supportedCurrencies.value.length > 0) {
        const activeWallet = walletStore.walletList.find((wallet) => wallet.in_use)
        selectedCurrency.value =
          activeWallet && supportedCurrencies.value.includes(activeWallet.currency_code)
            ? activeWallet.currency_code
            : supportedCurrencies.value[0]
        isChannelExpanded.value = true
        await resetCategoryAndChannel()
      }
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const handleCurrencyChange = async (currency: string) => {
    if (selectedCurrency.value === currency) return
    selectedCurrency.value = currency
    paymentDetail.value = null
    isChannelExpanded.value = true
    resetFormState()
    await resetCategoryAndChannel()
  }

  const handleCategoryChange = async (category: WithdrawCategory) => {
    if (selectedCategory.value === category) return
    selectedCategory.value = category
    paymentDetail.value = null
    isChannelExpanded.value = true
    resetFormState()
    await resetChannel()
  }

  const handleChannelSelect = async (id: number) => {
    await selectChannel(id, { autoCollapse: true })
  }

  const reloadBankCards = async () => {
    await loadPayoutSettings()
  }

  const handleAmountChange = (val: string) => {
    amount.value = val
  }

  const toggleChannelExpand = () => {
    isChannelExpanded.value = !isChannelExpanded.value
  }

  const handleSubmit = async (): Promise<{ status: boolean } | null> => {
    const channel = selectedChannel.value

    if (!selectedGatewayId.value || !selectedCurrency.value || !channel) {
      pushToast({ severity: "error", detail: "請選擇出金渠道", life: 3000 })
      return null
    }
    if (!amount.value) {
      pushToast({ severity: "error", detail: "請輸入出金金額", life: 3000 })
      return null
    }
    if (!selectedBankCardId.value) {
      pushToast({ severity: "error", detail: t("please_select_withdrawal_account"), life: 3000 })
      return null
    }
    const wallet = selectedWallet.value
    if (!wallet) {
      pushToast({ severity: "error", detail: "無法取得幣種錢包資訊", life: 3000 })
      return null
    }

    await loadPayoutSettingDetail(selectedBankCardId.value)

    const params = {
      amount: amount.value,
      group_id: channel.group_id,
      payment_gateway_id: selectedGatewayId.value,
      payment_type_id: channel.type,
      currency: selectedCurrency.value,
      id: selectedBankCardId.value,
      bank_id: selectedBankCardId.value,
      remaining_turnover: wallet.remaining_turnover,
      balance: wallet.balance,
      withdrawal_password: "",
      crypto_rate: undefined,
      images: []
    }

    try {
      const result = await submitWithdraw(params)
      if (result?.status) {
        pushToast({ severity: "success", detail: "提款申請成功", life: 4000 })
        return { status: true }
      }
      return null
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "提款申請失敗"
      pushToast({ severity: "error", detail: message, life: 3000 })
      return null
    }
  }

  const resetDialog = () => {
    resetFormState()
    isChannelExpanded.value = true
  }

  return {
    isLoading,
    isLoadingList,
    isLoadingPayoutSettings,
    isLoadingDetail,
    isSubmitting,
    isInitialized,
    isChannelExpanded,
    supportedCurrencies,
    selectedCurrency,
    selectedCategory,
    selectedGatewayId,
    selectedBankCardId,
    paymentDetail,
    bankCards,
    amount,
    currencyOptions,
    categoryOptions,
    channelList,
    selectedChannel,
    selectedBankCard,
    selectedWallet,
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
  }
}
