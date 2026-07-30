import { getMemberAgentQuotaList } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentQuotaList"
import { getLowerLevelMemberAgentQuotaList } from "@shared-src/lib/api/apiFunctions/userInfo_getLowerLevelMemberAgentQuotaList"
import { getMemberAgentQuotaAmount } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentQuotaAmount"
import { updateMemberAgentQuotaBalance } from "@shared-src/lib/api/apiFunctions/userInfo_updateMemberAgentQuotaBalance"
import { getMemberAgentCustomizeColumn } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentCustomizeColumn"
import { getMemberAgentReferralList } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentReferralList"
import { getMemberAgentTagList } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentTagList"
import { getMemberAgentInfo } from "@shared-src/lib/api/apiFunctions/userInfo_getMemberAgentInfo"
import { createMemberAgent } from "@shared-src/lib/api/apiFunctions/userInfo_createMemberAgent"
import { updateMemberAgent } from "@shared-src/lib/api/apiFunctions/userInfo_updateMemberAgent"
import {
  TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_LIST,
  TANSTACK_QUERY_KEY_MEMBER_AGENT_LOWER_LEVEL_QUOTA_LIST,
  TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_AMOUNT
} from "@shared-src/lib/constants/tanstackQueryKeys"
import { COLUMN_NAME_ENUMS } from "@shared-src/lib/constants/enums/columnName"
import { INPUT_TYPE_ENUMS } from "@shared-src/lib/constants/enums/inputType"
import { useApiQuery } from "@shared-src/lib/api/useApiQuery"
import { useApiMutation } from "@shared-src/lib/api/useApiMutation"
import { handleGlobalClick } from "../../utils/handleGlobalClick"

const DEFAULT_SIZE = 10

export const useMemberManagementTab = () => {
  const { pushToast } = useToastQueue()
  const { selectedWallet } = useCurrencyInfo()
  const { t, locale } = useI18n()
  const { accountInfo } = useAccountInfo()

  const cashCurrencyId = computed(() => Number(selectedWallet.value?.currency_id ?? 0))

  // ── 搜尋狀態 ──
  const page = ref(1)
  const offset = computed(() => (page.value - 1) * DEFAULT_SIZE)
  const size = ref(DEFAULT_SIZE)
  const totalRecords = ref(0)

  const memberAccount = ref("")
  const recommenderAccount = ref("")
  const searchSubordinateMemberAccount = ref("")

  const lastSearchMemberAccount = ref("")
  const lastSearchRecommenderAccount = ref("")
  const lastSearchSubordinateMemberAccount = ref("")

  // 查看下級模式。null = 顯示直屬下級；set = 顯示指定帳號的下級
  const showSubordinateMemberAccount = ref<{ account: string; memberId: number } | null>(null)

  const isLowerLevelMode = computed(() => showSubordinateMemberAccount.value !== null)

  // ── 列表資料 ──
  const manageRows = ref<any[]>([])

  // ── 代理剩餘額度 ──
  const remainQuotaAmount = ref<string | number>(0)

  // ── 加減款 Dialog ──
  const showQuotaDialog = ref(false)
  const dialogType = ref<1 | 2>(1)
  const targetAccount = ref("")
  const dialogAmount = ref("")
  const dialogMemberAccount = ref("")
  const dialogMemberBalance = ref("")
  const dialogMemberRemainQuotaAmount = ref("")
  const dialogMemberIsAgent = ref(false)
  const dialogIncreaseItem = ref(0)

  // ── 新增/編輯下級 ──
  const showAddSubordinateStatus = ref(false)
  const memberAgentCustomizeColumnId = ref(0)
  const memberAgentCustomizeColumn = ref<any[]>([])
  const memberAgentCustomizeColumnData = ref<Record<string, any>>({})
  const originalMemberAgentCustomizeColumnData = ref<Record<string, any>>({})
  const memberAgentReferralList = ref<any[]>([])
  const memberAgentTagList = ref<any[]>([])
  const isAddSubordinateLoading = ref(false)

  // ── API: 直屬下級列表 ──
  const quotaListParams = computed(() => ({
    currency_id: cashCurrencyId.value,
    downline_member_account: lastSearchMemberAccount.value,
    recommender_account: lastSearchRecommenderAccount.value,
    size: String(size.value),
    offset: String(offset.value)
  }))

  const {
    data: quotaListData,
    isFetching: isQuotaListFetching,
    refetch: refetchQuotaList
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_LIST, quotaListParams],
    getMemberAgentQuotaList,
    quotaListParams,
    {
      enabled: computed(() => !isLowerLevelMode.value && cashCurrencyId.value > 0),
      select: (res: any) => res.data
    }
  )

  // ── API: 下級的下級列表 ──
  const lowerLevelParams = computed(() => ({
    currency_id: cashCurrencyId.value,
    downline_member_account: lastSearchSubordinateMemberAccount.value,
    account: showSubordinateMemberAccount.value?.memberId
  }))

  const {
    data: lowerLevelData,
    isFetching: isLowerLevelFetching,
    refetch: refetchLowerLevel
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_LOWER_LEVEL_QUOTA_LIST, lowerLevelParams],
    getLowerLevelMemberAgentQuotaList,
    lowerLevelParams,
    {
      enabled: computed(() => isLowerLevelMode.value && cashCurrencyId.value > 0 && !!showSubordinateMemberAccount.value?.memberId),
      select: (res: any) => res.data
    }
  )

  // ── API: 自己的代理額度 ──
  const quotaAmountParams = computed(() => ({ currency_id: cashCurrencyId.value }))

  const {
    data: quotaAmountData,
    refetch: refetchQuotaAmount
  } = useApiQuery(
    [TANSTACK_QUERY_KEY_MEMBER_AGENT_QUOTA_AMOUNT, quotaAmountParams],
    getMemberAgentQuotaAmount,
    quotaAmountParams,
    {
      enabled: computed(() => cashCurrencyId.value > 0),
      select: (res: any) => res.data
    }
  )

  // ── API: 加減款 Mutation ──
  const { mutate: submitQuotaBalance, isPending: isQuotaBalanceSubmitting } = useApiMutation(
    updateMemberAgentQuotaBalance,
    {
      onSuccess: async () => {
        showQuotaDialog.value = false
        dialogIncreaseItem.value = 0
        pushToast({ severity: "success", summary: "Success", detail: "操作成功", life: 2000 })
        await refetchCurrentList()
        await refetchQuotaAmount()
      }
    }
  )

  // ── 同步列表資料到 manageRows ──
  // data 短暫變 undefined（query key 變動導致 TanStack 重新建立 query）時不覆蓋，避免已載入的資料被清空
  watch(quotaListData, (data) => {
    if (!isLowerLevelMode.value && data != null) {
      manageRows.value = data.list ?? []
      totalRecords.value = data.total ?? 0
    }
  })

  watch(lowerLevelData, (data) => {
    if (isLowerLevelMode.value && data != null) {
      manageRows.value = data.list ?? []
      totalRecords.value = data.total ?? 0
    }
  })

  watch(quotaAmountData, (data) => {
    if (data != null) remainQuotaAmount.value = data.remain_quota_amount
  })

  const isLoading = computed(() => isQuotaListFetching.value || isLowerLevelFetching.value)

  // ── Helpers ──
  const refetchCurrentList = async () => {
    if (isLowerLevelMode.value) {
      await refetchLowerLevel()
    } else {
      await refetchQuotaList()
    }
  }

  // ── 搜尋直屬下級 ──
  const handleSearch = () => {
    handleGlobalClick({
      target: "handleMemberManagementSearchClick",
      debounceTimer: 200,
      callback: async () => {
        page.value = 1
        lastSearchMemberAccount.value = memberAccount.value
        lastSearchRecommenderAccount.value = recommenderAccount.value
        await refetchQuotaList()
      }
    })
  }

  // ── 搜尋下級的下級 ──
  const handleLowerLevelSearch = () => {
    handleGlobalClick({
      target: "handleMemberManagementLowerLevelSearchClick",
      debounceTimer: 200,
      callback: async () => {
        page.value = 1
        lastSearchSubordinateMemberAccount.value = searchSubordinateMemberAccount.value
        await refetchLowerLevel()
      }
    })
  }

  // ── 查看下級 ──
  const handleViewLowerLevel = (row: any) => {
    handleGlobalClick({
      target: `handleViewLowerLevel${row.member_id}Click`,
      debounceTimer: 150,
      callback: async () => {
        page.value = 1
        manageRows.value = []
        showSubordinateMemberAccount.value = { account: row.member_account, memberId: row.member_id }
        lastSearchSubordinateMemberAccount.value = ""
        searchSubordinateMemberAccount.value = ""
        await refetchLowerLevel()
      }
    })
  }

  // ── 返回直屬列表 ──
  const handleBackToDirectList = async () => {
    showSubordinateMemberAccount.value = null
    page.value = 1
    memberAccount.value = ""
    recommenderAccount.value = ""
    lastSearchMemberAccount.value = ""
    lastSearchRecommenderAccount.value = ""
    manageRows.value = []
    await refetchQuotaList()
    await refetchQuotaAmount()
  }

  // ── 分頁 ──
  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleMemberManagementPage${nextPage}Click`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await refetchCurrentList()
      }
    })
  }

  // ── 打開加減款 Dialog ──
  const handleOpenQuotaDialog = async (row: any, type: 1 | 2) => {
    targetAccount.value = row.member_account
    dialogMemberAccount.value = row.member_account
    dialogMemberBalance.value = row.balance
    dialogMemberRemainQuotaAmount.value = row.remain_quota_amount
    dialogMemberIsAgent.value = !!row.is_member_agent
    dialogType.value = type
    dialogAmount.value = ""
    dialogIncreaseItem.value = 0
    showQuotaDialog.value = true
    await refetchQuotaAmount()
  }

  // ── 金額輸入清洗（只允許正整數/小數，不允許開頭小數點）──
  const sanitizeAmount = (val: string) => {
    let v = val.replace(/[^0-9.]/g, "")
    const dotIdx = v.indexOf(".")
    if (dotIdx === 0) v = v.slice(1)
    if (dotIdx !== -1) v = v.slice(0, dotIdx + 1) + v.slice(dotIdx + 1).replace(/\./g, "")
    return v
  }

  const handleAmountInput = (val: string) => {
    dialogAmount.value = sanitizeAmount(val)
  }

  // ── 送出加減款 ──
  const handleSubmitQuotaBalance = () => {
    if (!dialogAmount.value || Number(dialogAmount.value) <= 0) {
      pushToast({ severity: "warn", summary: "Validation", detail: "請輸入有效金額", life: 2200 })
      return
    }
    const type = dialogIncreaseItem.value === 0 ? dialogType.value : dialogType.value + 2
    submitQuotaBalance({
      member_account: targetAccount.value,
      currency_id: cashCurrencyId.value,
      amount: dialogAmount.value,
      type
    })
  }

  // ── 欄位正規化（label 翻譯、column_label 對應）──
  const normalizeColumns = (columns: any[]) => {
    return columns.map((column) => {
      if (column.type === INPUT_TYPE_ENUMS.SELECT) {
        column.values = column.values.map((val: any) => {
          if (column.column_name === COLUMN_NAME_ENUMS.MEMBER_LEVEL) {
            val.label = (val.label as any)?.[locale.value] ?? val.label
          } else if (column.column_name !== COLUMN_NAME_ENUMS.COUNTRY) {
            val.label = t(`member_customize_column.${val.label}`)
          }
          return val
        })
      }
      if (column.lang && column.lang[locale.value]) {
        column.column_label = column.lang[locale.value]
      } else {
        column.column_label = t(`member.register.${column.column_name}`)
      }
      return column
    })
  }

  // ── 初始化新增/編輯面板（在 AddSubordinateMemberPanel onMounted 呼叫）──
  const handleInitAddSubordinate = async () => {
    isAddSubordinateLoading.value = true
    try {
      const isAdd = memberAgentCustomizeColumnId.value === 0

      if (isAdd) {
        const { data: columns } = await getMemberAgentCustomizeColumn({ type: "register" })
        memberAgentCustomizeColumn.value = normalizeColumns(columns)

        memberAgentCustomizeColumnData.value = {
          ...memberAgentCustomizeColumn.value.reduce((acc: Record<string, any>, item: any) => {
            acc[item.column_name] = item.column_name === COLUMN_NAME_ENUMS.REF_ACCOUNT
              ? (accountInfo.value?.account ?? null)
              : null
            return acc
          }, {}),
          is_enabled: false,
          is_member_agent: false,
          is_blocked: false
        }

        const { data: referralData } = await getMemberAgentReferralList()
        memberAgentReferralList.value = referralData.map((item: any) => ({
          label: item.member_account,
          value: item.member_id
        }))
      } else {
        const { data: columns } = await getMemberAgentCustomizeColumn({ type: "manage" })
        memberAgentCustomizeColumn.value = normalizeColumns(columns)
      }

      const { data: tagData } = await getMemberAgentTagList()
      memberAgentTagList.value = tagData.map((item: any) => ({ ...item, checked: false }))

      if (!isAdd) {
        const { data: memberInfo } = await getMemberAgentInfo(memberAgentCustomizeColumnId.value)

        memberAgentTagList.value.forEach((item: any) => {
          if (memberInfo.labels?.includes(item.id)) item.checked = true
        })

        originalMemberAgentCustomizeColumnData.value = memberInfo

        memberAgentCustomizeColumnData.value = {
          ...memberAgentCustomizeColumn.value.reduce((acc: Record<string, any>, item: any) => {
            if ((item.column_name === "gender" || item.column_name === "gaming_site") && !memberInfo[item.column_name]) {
              acc[item.column_name] = null
            } else {
              acc[item.column_name] = memberInfo[item.column_name]
            }
            return acc
          }, {}),
          is_enabled: memberInfo.enabled,
          is_member_agent: memberInfo.is_member_agent,
          is_blocked: memberInfo.block
        }
      }
    } catch {
      pushToast({ severity: "error", summary: "Error", detail: "資料載入失敗", life: 2500 })
    } finally {
      isAddSubordinateLoading.value = false
    }
  }

  // ── 返回列表（關閉面板、重置狀態、refetch）──
  const handleBackFromAddSubordinate = async () => {
    showAddSubordinateStatus.value = false
    memberAgentCustomizeColumnId.value = 0
    memberAgentCustomizeColumn.value = []
    memberAgentCustomizeColumnData.value = {}
    originalMemberAgentCustomizeColumnData.value = {}
    memberAgentReferralList.value = []
    memberAgentTagList.value = []
    await refetchCurrentList()
    await refetchQuotaAmount()
  }

  // ── 必填驗證 ──
  const checkRequiredFields = () => {
    return memberAgentCustomizeColumn.value
      .filter((item: any) => item.required)
      .every((item: any) => {
        const val = memberAgentCustomizeColumnData.value[item.column_name]
        return val !== null && val !== undefined && val !== ""
      })
  }

  // ── Mutation: 新增下級 ──
  const { mutate: submitCreateMemberAgent, isPending: isCreateSubmitting } = useApiMutation(
    createMemberAgent,
    {
      onSuccess: async () => {
        pushToast({ severity: "success", summary: "Success", detail: "新增成功", life: 2000 })
        await handleBackFromAddSubordinate()
      }
    }
  )

  // ── Mutation: 編輯下級 ──
  const { mutate: submitUpdateMemberAgent, isPending: isUpdateSubmitting } = useApiMutation(
    updateMemberAgent,
    {
      onSuccess: async () => {
        pushToast({ severity: "success", summary: "Success", detail: "修改成功", life: 2000 })
        await handleBackFromAddSubordinate()
      }
    }
  )

  const isAddSubordinateSubmitting = computed(() => isCreateSubmitting.value || isUpdateSubmitting.value)

  // ── 送出新增/編輯 ──
  const handleSubmitAddSubordinate = () => {
    if (!checkRequiredFields()) {
      pushToast({ severity: "warn", summary: "Validation", detail: "請填寫所有必填欄位", life: 2200 })
      return
    }

    const isAdd = memberAgentCustomizeColumnId.value === 0
    const selectedTagIds = memberAgentTagList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.id)

    if (isAdd) {
      const refAccountLabel = memberAgentCustomizeColumnData.value[COLUMN_NAME_ENUMS.REF_ACCOUNT]
      const referralItem = memberAgentReferralList.value.find((item: any) => item.label === refAccountLabel)
      const params: Record<string, any> = {
        ...memberAgentCustomizeColumnData.value,
        label: selectedTagIds
      }
      if (referralItem) {
        params[COLUMN_NAME_ENUMS.REF_ACCOUNT] = referralItem.value
      }
      submitCreateMemberAgent(params)
    } else {
      submitUpdateMemberAgent({
        member_id: originalMemberAgentCustomizeColumnData.value.id,
        ...memberAgentCustomizeColumnData.value,
        label: selectedTagIds
      })
    }
  }

  return {
    // state
    page,
    size,
    totalRecords,
    memberAccount,
    recommenderAccount,
    searchSubordinateMemberAccount,
    showSubordinateMemberAccount,
    isLowerLevelMode,
    manageRows,
    remainQuotaAmount,
    showQuotaDialog,
    dialogType,
    targetAccount,
    dialogAmount,
    dialogMemberAccount,
    dialogMemberBalance,
    dialogMemberRemainQuotaAmount,
    dialogMemberIsAgent,
    dialogIncreaseItem,
    showAddSubordinateStatus,
    memberAgentCustomizeColumnId,
    memberAgentCustomizeColumn,
    memberAgentCustomizeColumnData,
    originalMemberAgentCustomizeColumnData,
    memberAgentReferralList,
    memberAgentTagList,
    isAddSubordinateLoading,
    isAddSubordinateSubmitting,
    // derived
    isLoading,
    isQuotaBalanceSubmitting,
    cashCurrencyId,
    // handlers
    handleSearch,
    handleLowerLevelSearch,
    handleViewLowerLevel,
    handleBackToDirectList,
    handlePageChange,
    handleOpenQuotaDialog,
    handleAmountInput,
    handleSubmitQuotaBalance,
    handleInitAddSubordinate,
    handleBackFromAddSubordinate,
    handleSubmitAddSubordinate
  }
}

export type MemberManagementTabReturn = ReturnType<typeof useMemberManagementTab>
