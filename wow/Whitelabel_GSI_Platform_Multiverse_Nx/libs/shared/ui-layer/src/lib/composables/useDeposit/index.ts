import { useI18n } from "#imports"
import type { DepositExtraRemark, DepositRequestType, DepositResponseType } from "@shared-lib/api/commonTypes/bankTypes"
import type {
  DepositPaymentDetailResponseType,
  ExtraRemark
} from "@shared-lib/api/apiFunctions/bank_depositPaymentDetail"
import type { DepositPromotion } from "@shared-lib/api/apiFunctions/bank_getDepositPromotionList"
import type { PlayerPaymentGatewayGroupItem } from "@shared-lib/api/apiFunctions/paymentGroup_getPlayerPaymentGatewayGroups"
import { getPaymentImg } from "@shared-lib/api/apiFunctions/bank_getPaymentImg"
import { useDepositPaymentDetail } from "@shared-lib/api/hooks/useDepositPaymentDetail"
import { useDepositPromotionList } from "@shared-lib/api/hooks/useDepositPromotionList"
import { useBankDeposit } from "@shared-lib/api/hooks/useBankDeposit"
import { usePlayerPaymentGatewayGroups } from "@shared-lib/api/hooks/usePlayerPaymentGatewayGroups"
import { DEPOSIT_REDIRECT_TYPE_ENUMS } from "@shared-lib/constants/enums/depositRedirectType"
import { FEE_TYPE_ENUMS } from "@shared-lib/constants/enums/feeType"
import {
  type DepositCategoryOption,
  type DepositGatewayMatch,
  type DepositPaymentGroupOption,
  findDepositGatewayMatch,
  getDepositCategoryOptions,
  getDepositCurrencyOptions,
  getInitialDepositCategory,
  getInitialDepositCurrency,
  getDepositPaymentGroupOptions,
  isDepositBankTransferDetail,
  shouldRequireDepositUpload,
  shouldShowDepositCategorySelector,
  shouldShowDepositCurrencySelector
} from "./depositLifecycle"

export type DepositCategory = DepositCategoryOption["value"]
export type DepositResultMode = "none" | "qrCode" | "cryptoWallet"

export interface DepositExtraRemarkState {
  id: number
  type: number
  content: string
  titles: Array<{ lang: string; title: string }>
}

type DepositPaymentDetailMap = Record<number, DepositPaymentDetailResponseType>

const MAX_DEPOSIT_UPLOAD_COUNT = 5
const MAX_DEPOSIT_UPLOAD_SIZE = 5 * 1024 * 1024
const ACCEPTED_UPLOAD_TYPES = new Set(["image/png", "image/jpeg"])
const DEPOSIT_PAYMENT_METHOD = 1
const DEFAULT_QUICK_AMOUNTS = ["500", "1000", "5000", "10000", "50000"]

const createWindowCloseUrl = (): string => {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}/windowClose`
}

const openHtmlContent = (htmlContent: string): void => {
  if (typeof window === "undefined" || !htmlContent) return

  const popup = window.open("", "_blank", "noopener,noreferrer")
  if (!popup) {
    window.location.href = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
    return
  }

  popup.document.write(htmlContent)
  popup.document.close()
}

const openUrl = (url: string): void => {
  if (typeof window === "undefined" || !url) return

  const popup = window.open(url, "_blank", "noopener,noreferrer")
  if (!popup) window.location.href = url
}

const readFileAsDataUrl = async (file: File): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getNumericAmount = (value: string): number => {
  const amount = Number(value.replace(/,/g, ""))
  return Number.isFinite(amount) ? amount : 0
}

const formatDepositRange = (detail: DepositPaymentDetailResponseType | null): string => {
  if (!detail) return ""
  return `${detail.deposit_min} ~ ${detail.deposit_max}`
}

const createPromotionPayload = (
  amount: string,
  selectedCurrency: string,
  selectedGatewayId: number,
  selectedGroupId: number
): DepositRequestType => ({
  amount,
  group_id: selectedGroupId,
  payment_gateway_id: selectedGatewayId,
  currency: selectedCurrency,
  promotion_id: 0,
  images: [],
  extra_remark: []
})

export function useDeposit() {
  const { t } = useI18n()
  const { refetch: fetchPlayerPaymentGatewayGroups, isFetching: isLoadingList } = usePlayerPaymentGatewayGroups({
    params: { payment_method: DEPOSIT_PAYMENT_METHOD }
  })
  const { fetchDepositPaymentDetail, isFetching: isLoadingDetail } = useDepositPaymentDetail()
  const { fetchDepositPromotionList } = useDepositPromotionList()
  const { submitDeposit, isPending: isSubmitting } = useBankDeposit()
  const { pushToast } = useToastQueue()
  const { openAlertDialog } = useAlertDialog()
  const { selectedCurrencyCode, walletList, refetch: fetchWalletList } = useCurrencyInfo({ enabled: false })

  const isInitialized = ref(false)
  const isLoading = ref(false)
  const paymentGroups = ref<PlayerPaymentGatewayGroupItem[]>([])
  const logoMap = ref<Record<number, string>>({})
  const paymentDetailMap = ref<DepositPaymentDetailMap>({})

  const selectedCurrency = ref("")
  const selectedCategory = ref<DepositCategory | "">("")
  const selectedPaymentGroupId = ref(0)
  const selectedGatewayId = ref(0)
  const isPaymentGroupExpanded = ref(true)

  const paymentDetail = ref<DepositPaymentDetailResponseType | null>(null)
  const promotionList = ref<DepositPromotion[]>([])
  const selectedPromotionId = ref(0)
  const depositResult = ref<DepositResponseType | null>(null)
  const resultMode = ref<DepositResultMode>("none")

  const amount = ref("")
  const extraRemarks = ref<DepositExtraRemarkState[]>([])
  const uploadImages = ref<string[]>([])

  const filteredCurrencies = computed(() => getDepositCurrencyOptions(paymentGroups.value, walletList.value))
  const currencyOptions = computed(() => filteredCurrencies.value.map((currency) => ({ label: currency, value: currency })))
  const categoryOptions = computed(() => getDepositCategoryOptions(paymentGroups.value, selectedCurrency.value, walletList.value))
  const showCurrencySelector = computed(() => shouldShowDepositCurrencySelector(filteredCurrencies.value))
  const showCategorySelector = computed(() => shouldShowDepositCategorySelector(categoryOptions.value))
  const hasPaymentMethods = computed(() => categoryOptions.value.length > 0 && filteredCurrencies.value.length > 0)

  const paymentGroupOptions = computed((): DepositPaymentGroupOption[] => {
    if (!selectedCategory.value) return []
    return getDepositPaymentGroupOptions(
      paymentGroups.value,
      selectedCurrency.value,
      selectedCategory.value,
      walletList.value,
      logoMap.value
    )
  })

  const selectedPaymentGroup = computed(
    () => paymentGroupOptions.value.find((group) => group.id === selectedPaymentGroupId.value) || null
  )

  const depositMin = computed(() => paymentDetail.value?.deposit_min || selectedPaymentGroup.value?.minAmount || "0")
  const depositMax = computed(() => paymentDetail.value?.deposit_max || selectedPaymentGroup.value?.maxAmount || "0")
  const apiQuickAmounts = computed(() => paymentDetail.value?.quick_amounts?.filter((value) => String(value || "").trim()) || [])
  const quickAmounts = computed(() => (apiQuickAmounts.value.length > 0 ? apiQuickAmounts.value : DEFAULT_QUICK_AMOUNTS))
  const isBankTransfer = computed(() => isDepositBankTransferDetail(paymentDetail.value))
  const isCryptoWallet = computed(() => false)
  const isCryptoPayment = computed(() => false)
  const needUploadDetailFundType = computed(() => shouldRequireDepositUpload(paymentDetail.value))
  const isResultVisible = computed(() => resultMode.value !== "none" && Boolean(depositResult.value))

  const hasFee = computed(() => {
    const detail = paymentDetail.value
    if (!detail) return false
    return Number(detail.fee_amount || "0") > 0 || Number(detail.fee_rate || "0") > 0
  })

  const feeText = computed(() => {
    const detail = paymentDetail.value
    if (!detail || !hasFee.value) return ""
    return detail.fee_type === FEE_TYPE_ENUMS.AMOUNT ? detail.fee_amount : `${detail.fee_rate}%`
  })

  const cryptoAmountText = computed(() => {
    const rate = Number(paymentDetail.value?.usdt_rate || "0")
    const depositAmount = getNumericAmount(amount.value)
    if (!rate || !depositAmount) return ""
    return (depositAmount / rate).toFixed(2)
  })

  const cryptoCurrencyBrand = computed(() => String(paymentDetail.value?.currency_brand || "").trim())
  const depositRangeText = computed(() => formatDepositRange(paymentDetail.value))
  const selectedPaymentGroupRangeText = computed(() => selectedPaymentGroup.value?.rangeText || depositRangeText.value)
  const selectedPaymentGroupRangeOptions = computed(() => selectedPaymentGroup.value?.rangeOptions || [])
  const isFormReady = computed(() => isInitialized.value && Boolean(selectedPaymentGroup.value))

  const notify = (severity: "success" | "info" | "warn" | "error", detail: string, life: number): void => {
    pushToast({ severity, detail, life })
  }

  const resetResultState = (): void => {
    depositResult.value = null
    resultMode.value = "none"
  }

  const resetFormState = (): void => {
    amount.value = ""
    extraRemarks.value = []
    uploadImages.value = []
    selectedPromotionId.value = 0
    promotionList.value = []
    resetResultState()
  }

  const resetSelectedGateway = (): void => {
    selectedGatewayId.value = 0
    paymentDetail.value = null
    extraRemarks.value = []
    uploadImages.value = []
    selectedPromotionId.value = 0
    promotionList.value = []
    resetResultState()
  }

  const resetSelectedPaymentGroup = (): void => {
    selectedPaymentGroupId.value = 0
    isPaymentGroupExpanded.value = true
    resetSelectedGateway()
    resetFormState()
  }

  const selectInitialPaymentGroup = (): void => {
    const initialPaymentGroup = paymentGroupOptions.value[0] || null
    selectedPaymentGroupId.value = initialPaymentGroup?.id || 0
    isPaymentGroupExpanded.value = !initialPaymentGroup
  }

  const resetToInitialPaymentGroup = (): void => {
    resetSelectedPaymentGroup()
    selectInitialPaymentGroup()
  }

  const setInitialCategoryAndCurrency = (preferredCurrency: string): void => {
    selectedCurrency.value = getInitialDepositCurrency(paymentGroups.value, walletList.value, preferredCurrency)
    selectedCategory.value = getInitialDepositCategory(paymentGroups.value, selectedCurrency.value, walletList.value)
    selectedCurrencyCode.value = selectedCurrency.value
  }

  const ensureWalletList = async (): Promise<void> => {
    if (walletList.value.length > 0) return
    await fetchWalletList()
  }

  const loadLogos = async (groups: DepositPaymentGroupOption[]): Promise<void> => {
    const missingGroups = groups.filter(
      (group) => group.logo_image_id > 0 && !logoMap.value[group.logo_image_id]
    )

    await Promise.allSettled(
      missingGroups.map(async (group) => {
        const result = await getPaymentImg(group.logo_image_id)
        if (result.status && result.data) {
          logoMap.value[group.logo_image_id] = String(result.data)
        }
      })
    )
  }

  const setPaymentDetailCache = (gatewayId: number, detail: DepositPaymentDetailResponseType): void => {
    paymentDetailMap.value = {
      ...paymentDetailMap.value,
      [gatewayId]: detail
    }
  }

  const loadPaymentGroupDisplayData = async (): Promise<void> => {
    await loadLogos(paymentGroupOptions.value)
  }

  const fetchDepositPaymentGroups = async (): Promise<PlayerPaymentGatewayGroupItem[]> => {
    const result = await fetchPlayerPaymentGatewayGroups()
    return (result.data || []) as PlayerPaymentGatewayGroupItem[]
  }

  const fetchSelectedPaymentDetail = async (gatewayId: number): Promise<DepositPaymentDetailResponseType | null> => {
    const cachedDetail = paymentDetailMap.value[gatewayId]
    if (cachedDetail) return cachedDetail

    const result = await fetchDepositPaymentDetail(gatewayId)
    if (!result?.data) return null

    const detail = result.data as DepositPaymentDetailResponseType
    setPaymentDetailCache(gatewayId, detail)
    return detail
  }

  const applyPaymentDetail = (gatewayId: number, detail: DepositPaymentDetailResponseType): void => {
    setPaymentDetailCache(gatewayId, detail)

    paymentDetail.value = {
      ...detail,
      imgUrl: detail.imgUrl || ""
    }

    extraRemarks.value = (detail.extra_remark || []).map((remark: ExtraRemark) => ({
      id: remark.id,
      type: remark.type,
      content: remark.content || "",
      titles: remark.titles || []
    }))
  }

  const loadPaymentDetailImage = async (gatewayId: number, qrcodeImageId: number): Promise<void> => {
    if (!qrcodeImageId) return

    const imageResult = await getPaymentImg(qrcodeImageId)
    if (!imageResult.status || !imageResult.data) return
    const currentDetail = paymentDetail.value
    if (!currentDetail || selectedGatewayId.value !== gatewayId || currentDetail.qrcode_image_id !== qrcodeImageId) return

    paymentDetail.value = {
      ...currentDetail,
      imgUrl: String(imageResult.data)
    }
  }

  const loadPromotions = async (): Promise<void> => {
    if (!selectedGatewayId.value || !selectedCurrency.value || !selectedPaymentGroup.value) return

    const payload = createPromotionPayload(
      amount.value || "0",
      selectedCurrency.value,
      selectedGatewayId.value,
      selectedPaymentGroup.value.id
    )

    const result = await fetchDepositPromotionList(
      payload
    )
    promotionList.value = (result?.data as DepositPromotion[]) || []

    if (selectedPromotionId.value && !promotionList.value.find((promotion) => promotion.id === selectedPromotionId.value)) {
      selectedPromotionId.value = 0
    }
  }

  const getSelectedGatewayMatch = (): DepositGatewayMatch | null => {
    return findDepositGatewayMatch({
      amount: amount.value,
      paymentGroups: paymentGroups.value,
      selectedCurrency: selectedCurrency.value,
      selectedGroupId: selectedPaymentGroupId.value,
      walletList: walletList.value
    })
  }

  const openGatewayRefreshDialog = (): void => {
    openAlertDialog({
      title: t("common.deposit_limit"),
      message: t("common.validate.amountExceedLimit"),
      cancelText: t("common.btn.cancel"),
      confirmText: t("common.refresh"),
      options: [],
      onConfirm: async () => {
        await refreshPaymentGroups()
      }
    })
  }

  const applySelectedGatewayMatch = async (match: DepositGatewayMatch): Promise<void> => {
    if (selectedGatewayId.value !== match.gatewayId) {
      selectedGatewayId.value = match.gatewayId
      paymentDetail.value = null
      extraRemarks.value = []
      uploadImages.value = []
      selectedPromotionId.value = 0
      promotionList.value = []
      resetResultState()
    }

    const currentAmount = amount.value
    const currentGroupId = selectedPaymentGroupId.value
    const detail = await fetchSelectedPaymentDetail(match.gatewayId)
    if (!detail || amount.value !== currentAmount || selectedPaymentGroupId.value !== currentGroupId) return

    applyPaymentDetail(match.gatewayId, detail)
    await loadPaymentDetailImage(match.gatewayId, detail.qrcode_image_id)
    await loadPromotions()
  }

  const resolveGatewayForAmount = async (): Promise<void> => {
    const match = getSelectedGatewayMatch()
    if (!match) {
      resetSelectedGateway()
      return
    }

    await applySelectedGatewayMatch(match)
  }

  const debouncedResolveGatewayForAmount = useDebounceFn(resolveGatewayForAmount, 500)

  const init = async (): Promise<void> => {
    if (isLoading.value) return

    isLoading.value = true
    isInitialized.value = false

    try {
      await ensureWalletList()
      const groups = (await fetchDepositPaymentGroups()).filter((group) => group.agent_payment_gateways.length > 0)

      if (groups.length === 0) {
        paymentGroups.value = []
        selectedCurrency.value = ""
        selectedCategory.value = ""
        resetSelectedPaymentGroup()
        notify("error", t("common.validate.noDataAvailable"), 3000)
        return
      }

      paymentGroups.value = groups
      setInitialCategoryAndCurrency(selectedCurrencyCode.value)
      resetToInitialPaymentGroup()
      await loadPaymentGroupDisplayData()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const refreshPaymentGroups = async (): Promise<void> => {
    paymentGroups.value = (await fetchDepositPaymentGroups()).filter((group) => group.agent_payment_gateways.length > 0)
    await loadPaymentGroupDisplayData()
    await resolveGatewayForAmount()
  }

  const handleCurrencyChange = async (currency: string): Promise<void> => {
    if (selectedCurrency.value === currency) return

    selectedCurrency.value = currency
    selectedCurrencyCode.value = currency
    selectedCategory.value = getInitialDepositCategory(paymentGroups.value, selectedCurrency.value, walletList.value)
    resetToInitialPaymentGroup()
    await loadPaymentGroupDisplayData()
  }

  const handleCategoryChange = async (category: DepositCategory): Promise<void> => {
    if (selectedCategory.value === category) return

    selectedCategory.value = category
    resetToInitialPaymentGroup()
    await loadPaymentGroupDisplayData()
  }

  const handlePaymentGroupSelect = async (id: number): Promise<void> => {
    selectedPaymentGroupId.value = id
    isPaymentGroupExpanded.value = false
    resetSelectedGateway()
    resetFormState()
  }

  const handleAmountChange = (value: string): void => {
    amount.value = value
    debouncedResolveGatewayForAmount()
  }

  const handleQuickAmountSelect = (value: string): void => {
    amount.value = value
    debouncedResolveGatewayForAmount()
  }

  const handlePromotionToggle = (id: number): void => {
    selectedPromotionId.value = selectedPromotionId.value === id ? 0 : id
  }

  const togglePaymentGroupExpand = (): void => {
    isPaymentGroupExpanded.value = !isPaymentGroupExpanded.value
  }

  const addUploadImage = async (file: File): Promise<void> => {
    if (uploadImages.value.length >= MAX_DEPOSIT_UPLOAD_COUNT) {
      notify("warn", `最多上傳 ${MAX_DEPOSIT_UPLOAD_COUNT} 張圖片`, 3000)
      return
    }

    if (!ACCEPTED_UPLOAD_TYPES.has(file.type)) {
      notify("error", "僅限 PNG、JPG 文件", 3000)
      return
    }

    if (file.size > MAX_DEPOSIT_UPLOAD_SIZE) {
      notify("error", "圖片大小不可超過 5MB", 3000)
      return
    }

    uploadImages.value.push(await readFileAsDataUrl(file))
  }

  const removeUploadImage = (index: number): void => {
    uploadImages.value.splice(index, 1)
  }

  const validateSubmit = (): boolean => {
    if (!selectedCurrency.value) {
      notify("error", t("error_msg.please_select_currency"), 3000)
      return false
    }

    if (!selectedPaymentGroup.value) {
      notify("error", t("error_msg.please_select_payment_method"), 3000)
      return false
    }

    const depositAmount = getNumericAmount(amount.value)
    if (!depositAmount) {
      notify("error", "請輸入存款金額", 3000)
      return false
    }

    const minimum = Number(depositMin.value || "0")
    const maximum = Number(depositMax.value || "0")
    if (minimum && depositAmount < minimum) {
      notify("error", `存款金額不可低於 ${depositMin.value}`, 3000)
      return false
    }

    if (maximum && depositAmount > maximum) {
      notify("error", `存款金額不可高於 ${depositMax.value}`, 3000)
      return false
    }

    if (!selectedGatewayId.value || !paymentDetail.value) {
      openGatewayRefreshDialog()
      return false
    }

    return true
  }

  const buildDepositPayload = (): DepositRequestType | null => {
    const paymentGroup = selectedPaymentGroup.value
    if (!paymentGroup) return null

    const remarkPayload: DepositExtraRemark[] = extraRemarks.value
      .filter((remark) => remark.content.trim())
      .map((remark) => ({ id: remark.id, type: remark.type, content: remark.content.trim() }))

    const params: DepositRequestType = {
      amount: amount.value,
      group_id: paymentGroup.id,
      payment_gateway_id: selectedGatewayId.value,
      currency: selectedCurrency.value,
      promotion_id: selectedPromotionId.value,
      images: needUploadDetailFundType.value ? uploadImages.value : [],
      extra_remark: remarkPayload,
      return_url: createWindowCloseUrl(),
      failed_return_url: createWindowCloseUrl()
    }

    return params
  }

  const applySubmitResult = (data: DepositResponseType): DepositResultMode => {
    depositResult.value = data

    switch (data.redirect_type) {
      case DEPOSIT_REDIRECT_TYPE_ENUMS.OPEN_URL:
        openUrl(data.redirect_content)
        resultMode.value = "none"
        notify("success", "存款申請成功", 3000)
        return "none"

      case DEPOSIT_REDIRECT_TYPE_ENUMS.OPEN_HTML:
        openHtmlContent(data.redirect_content)
        resultMode.value = "none"
        notify("success", "存款申請成功", 3000)
        return "none"

      case DEPOSIT_REDIRECT_TYPE_ENUMS.OPEN_QR_CODE:
        resultMode.value = "qrCode"
        return "qrCode"

      case DEPOSIT_REDIRECT_TYPE_ENUMS.CRYPTO_WALLET:
        if (data.crypto_wallet) {
          resultMode.value = "cryptoWallet"
          return "cryptoWallet"
        }

        resultMode.value = "none"
        notify("error", "缺少加密錢包資訊", 3000)
        return "none"

      case DEPOSIT_REDIRECT_TYPE_ENUMS.ALERT_MESSAGE:
      case DEPOSIT_REDIRECT_TYPE_ENUMS.POPUP_MESSAGE:
        resultMode.value = "none"
        notify("success", data.redirect_content || "存款申請成功", 4000)
        return "none"

      default:
        resultMode.value = "none"
        notify("success", "存款申請成功，請等候審核", 4000)
        return "none"
    }
  }

  const handleSubmit = async (): Promise<{ status: boolean; data?: DepositResponseType; resultMode: DepositResultMode } | null> => {
    if (!validateSubmit()) return null

    const params = buildDepositPayload()
    if (!params) return null

    const result = await submitDeposit(params)
    if (!result?.data) return null

    const data = result.data as DepositResponseType
    const nextResultMode = applySubmitResult(data)

    return { status: true, data, resultMode: nextResultMode }
  }

  const resetDialog = (): void => {
    resetSelectedPaymentGroup()
    isInitialized.value = false
  }

  return {
    isLoading,
    isLoadingList,
    isLoadingDetail,
    isSubmitting,
    isInitialized,
    isPaymentGroupExpanded,
    selectedCurrency,
    selectedCategory,
    selectedPaymentGroupId,
    selectedGatewayId,
    paymentDetail,
    promotionList,
    selectedPromotionId,
    amount,
    extraRemarks,
    uploadImages,
    depositResult,
    resultMode,
    maxUploadCount: MAX_DEPOSIT_UPLOAD_COUNT,
    currencyOptions,
    categoryOptions,
    paymentGroupOptions,
    selectedPaymentGroup,
    depositMin,
    depositMax,
    quickAmounts,
    showCurrencySelector,
    showCategorySelector,
    hasPaymentMethods,
    isBankTransfer,
    isCryptoWallet,
    isCryptoPayment,
    needUploadDetailFundType,
    hasFee,
    feeText,
    cryptoAmountText,
    cryptoCurrencyBrand,
    depositRangeText,
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
    resetDialog,
    resetResultState
  }
}
