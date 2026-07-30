import { DateTime } from "luxon"
import { defineStore } from "pinia"
import { useQuasar } from "quasar"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { format as formatRfcDateTime } from "src/common/composables/useRfc3339"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import {
  COLUMN_NAME,
  CREDIT_QUOTA_HISTORY_TYPE,
  INPUT_TYPE,
  MEMBER_AGENT_QUOTA_BALANCE_TYPE,
  MEMBER_AGENT_QUOTA_SEARCH_TYPE,
  WALLET_TYPE,
  ERROR_CODE_TYPE,
} from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

export const useMemberManagement = defineStore("useMemberManagement", () => {
  const { isCredit } = useEnv()
  const { nowLang } = useLanguage()
  const $q = useQuasar()
  const { t, te, locale } = useI18n()
  const { preciseMultiply, preciseDivide, moneyFormat } = useCommon()
  const {
    inUseWallet,
    getMemberAgentQuotaList,
    getLowerLevelMemberAgentQuotaList,
    getMemberAgentQuotaMoneyHistory,
    getCreditQuotaHistory,
    updateMemberAgentQuotaBalance,
    getMemberAgentCustomizeColumn,
    getMemberAgentReferralList,
    getMemberAgentTagList,
    createMemberAgent,
    updateMemberAgent,
    getMemberAgentInfo,
    getMemberAgentQuotaAmount,
    getMemberAgentBetReport,
    getMemberAgentWagerList,
    getMemberAgentWagerDetail,
  } = useUserInfo()
  const { envInfo } = useEnvInfoStore()

  const activeTab = ref("manage") // 目前選擇的頁籤（manage: 會員代理額度管理, detail: 會員代理額度明細, betReport: 投注報表, betRecordQuery: 投注紀錄查詢, agentReport: 代理報表）
  const datePickerShow = ref(false) // 日期選擇器是否顯示
  const page = ref(1) // 頁數
  const offset = ref(0) // 當前筆數
  const size = ref(10) // 每頁顯示數量
  const totalPage = ref(0) // 總共有幾頁
  const showDialog = ref(false)
  const remainQuotaAmount = ref(0)
  const dialogMemberBalance = ref("0")
  const dialogMemberRemainQuotaAmount = ref("0")
  const dialogType = ref(1) // 加減款類型
  const targetAccount = ref() // 欲加減款帳號
  const dialogAmount = ref("") // 加減款金額
  const dialogMemberIsAgent = ref(false) // 是否為會員代理
  const dialogIncreaseItem = ref(0) // 加減款項目（0: 點數, 1: 代理額度）
  const memberAccount = ref("") // 會員帳號
  const recommenderAccount = ref("") // 推薦人帳號
  const searchSubordinateMemberAccount = ref("") // 搜尋下級會員帳號
  // 保存最後一次成功搜尋的參數
  const lastSearchMemberAccount = ref("") // 最後一次搜尋的會員帳號
  const lastSearchRecommenderAccount = ref("") // 最後一次搜尋的推薦人帳號
  const lastSearchSubordinateMemberAccount = ref("") // 最後一次搜尋的下級會員帳號
  const lastSearchDateRange = ref({ from: "", to: "" }) // 最後一次搜尋的日期範圍
  const lastSearchChangeType = ref(0) // 最後一次搜尋的變更類型
  const lastSearchBetNumber = ref("") // 最後一次搜尋的注單編號
  const lastSearchSettlementDate = ref(false) // 最後一次搜尋的結算日期
  const lastSearchBetDate = ref(false) // 最後一次搜尋的投注日期
  const betNumber = ref("") // 注單編號
  const dateRange = ref<any>({ from: "", to: "" }) // 搜尋日期範圍
  const changeType = ref(0) // 搜尋類型（0: 全部, 1: 代理加款, 2: 代理減款
  const settlementDate = ref(false) // 是否搜尋結算日期
  const betDate = ref(false) // 是否搜尋投注日期
  const showAddSubordinateStatus = ref(false) // 是否顯示新增下級會員畫面
  const memberAgentCustomizeColumn = ref<Response.MemberCustomizeColumnListData[]>([]) // 後台會員資料自訂欄位
  const originalMemberAgentCustomizeColumnData = ref<Record<string, any>>({}) // api回傳的會員編輯欄位資料
  const memberAgentCustomizeColumnData = ref<Record<string, any>>({}) // 會員編輯欄位資料
  const memberAgentReferralList = ref<{ label: string; value: number }[]>([]) // 推薦人列表
  const memberAgentTagList = ref<Response.MemberAgentTagListData[]>([]) // 標籤列表
  const memberAgentCustomizeColumnId = ref(0) // 要編輯的會員id
  const memberAgentAccount = ref("") // 會員代理帳號
  const showSubordinateMemberAccount = ref<{ account: string; memberId: number } | null>(null) // 目前顯示的下級會員帳號
  const manageRows = ref<Response.GetMemberAgentQuotaList[]>([]) // 會員管理數據
  const detailRows = ref<Response.GetMemberAgentQuotaMoneyHistory[]>([]) // 會員帳變明細數據
  const creditQuotaRows = ref<Response.CreditQuotaHistoryItem[]>([]) // 額度帳變明細數據
  const betReportRows = ref<Response.GetMemberAgentBetReportItem[]>([]) // 投注報表數據
  const betRecordQueryRows = ref<Response.GetMemberAgentWagerListItemData[]>([]) // 投注紀錄查詢數據
  const betReportSummary = ref<Response.GetMemberAgentBetReportSummaryItem>() // 投注報表數據總覽
  const betRecordQuerySummary = ref<Response.GetMemberAgentWagerListItemSummary>() // 投注紀錄查詢數據總覽

  const isAgentCenterCredit = computed(() => isCredit.value)
  const tabOptions = computed(() => {
    return [
      { label: t("member.membershipManagement.title"), value: "manage" },
      // 帳變明細僅信用版顯示，現金版隱藏
      ...(isAgentCenterCredit.value ? [{ label: t("menu.memberChangeDetails"), value: "detail" }] : []),
      { label: t("member.membershipManagement.betReport"), value: "betReport" },
      { label: t("member.membershipManagement.betRecordQuery"), value: "betRecordQuery" },
      { label: t("member.membershipManagement.agentReport"), value: "agentReport" },
    ]
  })

  const changeTypeOptions = computed(() => {
    return [
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All,
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition,
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction,
      },
    ]
  })

  /** 額度帳變類型下拉（含「全部」） */
  const creditQuotaTypeOptions = computed(() => {
    return [
      CREDIT_QUOTA_HISTORY_TYPE.Enums.All,
      CREDIT_QUOTA_HISTORY_TYPE.Enums.QuotaGrant,
      CREDIT_QUOTA_HISTORY_TYPE.Enums.QuotaReclaim,
      CREDIT_QUOTA_HISTORY_TYPE.Enums.BalanceGrant,
      CREDIT_QUOTA_HISTORY_TYPE.Enums.BalanceReclaim,
    ].map((value) => ({ label: t(CREDIT_QUOTA_HISTORY_TYPE.I18nKeys[value]), value }))
  })

  const operationOptions = computed(() => {
    return [
      { label: t("common.btn.addAmount"), value: MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add },
      { label: t("common.btn.minusAmount"), value: MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Minus },
    ]
  })

  const manageColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" as const },
      { name: "level", label: t("tableHeader.level"), field: "level", align: "center" as const },
      { name: "register_date", label: t("tableHeader.registerTime"), field: "register_date", align: "center" as const },
      {
        name: "last_login_date",
        label: t("tableHeader.lastLoginTime"),
        field: "last_login_date",
        align: "center" as const,
      },
      { name: "balance", label: t("common.btn.point"), field: "balance", align: "center" as const },
      ...(isAgentCenterCredit.value
        ? [
            {
              name: "remain_quota_amount",
              label: t("tableHeader.balance"),
              field: "remain_quota_amount",
              align: "center" as const,
            },
          ]
        : []),
      { name: "actions", label: t("tableHeader.operating"), field: "actions", align: "center" as const },
    ]
  })

  const detailColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "center" as const },
      {
        name: "updated_at_unix",
        label: t("tableHeader.accountChangeTime"),
        field: "updated_at_unix",
        align: "center" as const,
      },
      { name: "action_type", label: t("tableHeader.accountType"), field: "action_type", align: "center" as const },
      {
        name: "transaction_code",
        label: t("tableHeader.accountVariableObject"),
        field: "transaction_code",
        align: "center" as const,
      },
      { name: "amount", label: t("tableHeader.amount"), field: "amount", align: "center" as const },
      {
        name: "before_balance",
        label: t("tableHeader.amountBeforeChanges"),
        field: "before_balance",
        align: "center" as const,
      },
      {
        name: "after_balance",
        label: t("tableHeader.amountAfterChange"),
        field: "after_balance",
        align: "center" as const,
      },
    ]
  })

  const creditQuotaColumns = computed(() => {
    return [
      {
        name: "member_account",
        label: t("tableHeader.creditQuotaMemberAccount"),
        field: "member_account",
        align: "center" as const,
      },
      {
        name: "created_at",
        label: t("tableHeader.accountChangeTime"),
        field: "created_at",
        align: "center" as const,
      },
      { name: "type", label: t("tableHeader.accountType"), field: "type", align: "center" as const },
      {
        name: "trans_code",
        label: t("tableHeader.creditQuotaTransCode"),
        field: "trans_code",
        align: "center" as const,
      },
      { name: "change_item", label: t("tableHeader.changeItem"), field: "change_item", align: "center" as const },
      { name: "amount", label: t("tableHeader.creditQuotaAmount"), field: "amount", align: "center" as const },
      {
        name: "before_balance",
        label: t("tableHeader.creditQuotaBeforeBalance"),
        field: "before_balance",
        align: "center" as const,
      },
      {
        name: "after_balance",
        label: t("tableHeader.creditQuotaAfterBalance"),
        field: "after_balance",
        align: "center" as const,
      },
    ]
  })

  const betReportColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "center" as const },
      {
        name: "bet_count",
        label: t("tableHeader.orderQuantity"),
        field: "bet_count",
        align: "center" as const,
      },
      {
        name: "win_count",
        label: t("tableHeader.winningNumber"),
        field: "win_count",
        align: "center" as const,
      },
      {
        name: "bet_amount",
        label: t("tableHeader.bettingAmount"),
        field: "bet_amount",
        align: "center" as const,
      },
      {
        name: "valid_bet_amount",
        label: t("tableHeader.validBetAmount"),
        field: "valid_bet_amount",
        align: "center" as const,
      },
      { name: "payout", label: t("common.payout"), field: "payout", align: "center" as const },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit", align: "center" as const },
      { name: "profit_rate", label: t("tableHeader.profitRatio"), field: "profit_rate", align: "center" as const },
      { name: "bonus", label: t("tableHeader.activityBonus"), field: "bonus", align: "center" as const },
    ]
  })

  const getBetRecordQueryColumns = (options: { showProfitRate?: boolean } = {}) => {
    const { showProfitRate = true } = options
    const columns = [
      { name: "wager_code", label: t("tableHeader.betNumber"), field: "wager_code", align: "center" as const },
      {
        name: "gaming_site",
        label: t("game.category"),
        field: "game_type",
        align: "center" as const,
      },
      { name: "member_account", label: t("menu.userAccount"), field: "member_account", align: "center" as const },
      { name: "created_at", label: t("tableHeader.bettingTime"), field: "created_at", align: "center" as const },
      {
        name: "settled_at",
        label: t("member.referralRebate.settlementTime"),
        field: "settled_at",
        align: "center" as const,
      },
      { name: "status", label: t("tableHeader.status"), field: "status", align: "center" as const },
      {
        name: "channel_code",
        label: t("tableHeader.bettingSource"),
        field: "channel_code",
        align: "center" as const,
      },
      { name: "product_title", label: t("tableHeader.product"), field: "product_title", align: "center" as const },
      { name: "game_title", label: t("common.games"), field: "game_title", align: "center" as const },
      {
        name: "bet_amount",
        label: t("tableHeader.bettingAmount"),
        field: "bet_amount",
        align: "center" as const,
      },
      {
        name: "valid_bet_amount",
        label: t("tableHeader.validBetAmount"),
        field: "valid_bet_amount",
        align: "center" as const,
      },
      { name: "payout", label: t("common.payout"), field: "payout", align: "center" as const },
      { name: "profit", label: t("member.referralRebate.profit"), field: "profit", align: "center" as const },
      ...(showProfitRate
        ? [{ name: "profit_rate", label: t("tableHeader.profitRatio"), field: "profit_rate", align: "center" as const }]
        : []),
      { name: "bonus", label: t("tableHeader.activityBonus"), field: "bonus", align: "center" as const },
    ]

    return columns
  }

  const betRecordQueryColumns = computed(() => getBetRecordQueryColumns())

  const dialogIncreaseItemOptions = computed(() => {
    if (dialogIncreaseItem.value === -1) {
      return [
        { label: t("shareholder_platform.please_select"), value: -1 },
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value },
      ]
    } else {
      return [
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value },
      ]
    }
  })

  const hasCountry = computed(() => {
    return memberAgentCustomizeColumn.value.find((item) => item.column_name === "country") ?? null
  })

  const formattedDateRange = computed(() => {
    if (typeof dateRange.value === "string") {
      if (!dateRange.value) return ""
      return `${dateRange.value} 00:00:00 ~ ${dateRange.value} 23:59:59`
    } else {
      if (!dateRange.value?.from || !dateRange.value?.to) return ""
      return `${dateRange.value.from} 00:00:00 ~ ${dateRange.value.to} 23:59:59`
    }
  })

  const formattedStartDate = computed(() => {
    if (!dateRange.value.from) return ""

    return `${dateRange.value.from} 00:00:00`
  })

  const formattedEndDate = computed(() => {
    if (!dateRange.value.to) return ""

    return `${dateRange.value.to} 23:59:59`
  })

  const toNumber = (value: string | number | null | undefined) => {
    const parsed = Number(String(value ?? 0).replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : 0
  }

  const sumBy = <T>(rows: T[], getter: (row: T) => string | number | null | undefined) =>
    rows.reduce((total, row) => total + toNumber(getter(row)), 0)

  const formatRate = (profit: number, validBetAmount: number) => {
    if (!validBetAmount) return "0"
    return String(Number(((profit / validBetAmount) * 100).toFixed(2)))
  }

  const getBetReportSummaryByRows = (rows: Response.GetMemberAgentBetReportItem[]) => {
    const validBetAmount = sumBy(rows, (row) => row.valid_bet_amount)
    const profit = sumBy(rows, (row) => row.profit)

    return {
      bet_count: sumBy(rows, (row) => row.bet_count),
      win_count: sumBy(rows, (row) => row.win_count),
      bet_amount: String(sumBy(rows, (row) => row.bet_amount)),
      valid_bet_amount: String(validBetAmount),
      payout: String(sumBy(rows, (row) => row.payout)),
      profit: String(profit),
      profit_rate: formatRate(profit, validBetAmount),
      bonus: String(sumBy(rows, (row) => row.bonus)),
    }
  }

  const getBetRecordSummaryByRows = (rows: Response.GetMemberAgentWagerListItemData[]) => {
    return {
      bet_amount: String(sumBy(rows, (row) => row.bet_amount)),
      valid_bet_amount: String(sumBy(rows, (row) => row.valid_bet_amount)),
      payout: String(sumBy(rows, (row) => row.payout)),
      profit: String(sumBy(rows, (row) => row.profit)),
      total: rows.length,
    }
  }

  const betReportSummaryList = computed(() => {
    const pageSummary = getBetReportSummaryByRows(betReportRows.value)

    return [
      pageSummary.bet_count,
      pageSummary.win_count,
      moneyFormat(pageSummary.bet_amount) ?? "-",
      moneyFormat(pageSummary.valid_bet_amount) ?? "-",
      moneyFormat(pageSummary.payout) ?? "-",
      moneyFormat(pageSummary.profit) ?? "-",
      `${pageSummary.profit_rate}%`,
      pageSummary.bonus,
    ]
  })

  const betReportSummaryTotalList = computed(() => {
    const totalProfitRate = betReportSummary?.value?.total?.profit_rate

    return [
      betReportSummary?.value?.total?.bet_count ?? "-",
      betReportSummary?.value?.total?.win_count ?? "-",
      moneyFormat(betReportSummary?.value?.total?.bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.valid_bet_amount) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.payout) ?? "-",
      moneyFormat(betReportSummary?.value?.total?.profit) ?? "-",
      totalProfitRate !== undefined && totalProfitRate !== null && totalProfitRate !== "" ? `${totalProfitRate}%` : "-",
      betReportSummary?.value?.total?.bonus ?? "-",
    ]
  })

  const betRecordQuerySummaryList = computed(() => {
    const pageSummary = getBetRecordSummaryByRows(betRecordQueryRows.value)

    return [
      moneyFormat(pageSummary.bet_amount) ?? "-",
      moneyFormat(pageSummary.valid_bet_amount) ?? "-",
      moneyFormat(pageSummary.payout) ?? "-",
      moneyFormat(pageSummary.profit) ?? "-",
    ]
  })

  const betRecordQuerySummaryTotalList = computed(() => {
    return [
      moneyFormat(betRecordQuerySummary?.value?.total?.bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.valid_bet_amount) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.payout) ?? "-",
      moneyFormat(betRecordQuerySummary?.value?.total?.profit) ?? "-",
    ]
  })

  /** 切換頁籤 */
  const handlerChangeActiveTab = (newTab: string) => {
    resetPage()

    switch (newTab) {
      case "manage":
        handlerGetMemberAgentQuotaBalance()
        handlerGetMemberAgentQuotaAmount()
        break
      default:
        // 要填搜尋條件才可以搜尋，故不做任何事情
        break
    }
  }

  /** 返回直屬下級列表 */
  const handlerBackSubordinateMember = () => {
    resetPageNumber()
    resetPage()
    handlerGetMemberAgentQuotaBalance()
    handlerGetMemberAgentQuotaAmount()
  }

  const onInputChange = (val: string | number | null) => {
    const strVal = typeof val === "string" ? val : val !== null ? String(val) : ""
    // 過濾掉非數字與小數點、限制只有一個小數點
    const cleaned = strVal
      .replace(/[^\d.]/g, "") // 移除非數字和小數點
      .replace(/^\.{1,}/g, "") // 不允許開頭是小數點
      .replace(/(\..*)\./g, "$1") // 僅保留第一個小數點

    dialogAmount.value = cleaned
  }

  const searchTypeName = (type: number) => {
    const label = changeTypeOptions.value.find((e) => e.value === type)?.label as string
    if (label) return t(label)
    return "-"
  }

  const creditQuotaTypeName = (type: number) => {
    return creditQuotaTypeOptions.value.find((e) => e.value === type)?.label ?? "-"
  }

  const creditQuotaItemName = (type: number) => {
    if (CREDIT_QUOTA_HISTORY_TYPE.QUOTA_TYPES.includes(type)) {
      return t("tableHeader.agentQuota")
    }

    return t("tableHeader.balanceItem")
  }

  const parseDate = (v: number | string | null | undefined) => formatRfcDateTime(v) || "-"

  /** 確認required欄位是否填寫 */
  const checkRequiredFields = () => {
    const requiredFields = memberAgentCustomizeColumn.value.filter((item) => item.required)
    const requiredFieldsData = requiredFields.map((item) => memberAgentCustomizeColumnData.value[item.column_name])
    if (requiredFieldsData.some((item) => !item)) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("common.validate.mustNotBeEmpty"),
        icon: "warning",
        timeout: 1000,
      })
      return false
    }

    return true
  }

  /** 返回下級列表畫面 */
  const handlerBackAddSubordinateMember = () => {
    resetPage()
    handlerGetMemberAgentQuotaBalance()
    handlerGetMemberAgentQuotaAmount()
  }

  /** 進入新增下級頁面的onMounted內容 */
  const handlerOnMountedAddSubordinateMember = async () => {
    if (!memberAgentCustomizeColumnId.value) {
      await handlerGetMemberAgentCustomizeColumn({ type: "register" })
      handlerGetMemberAgentReferralList()
    } else {
      await handlerGetMemberAgentCustomizeColumn({ type: "manage" })
      handlerGetMemberAgentInfo()
    }

    handlerGetMemberAgentTagList()
  }

  /** 重置頁數 */
  const resetPageNumber = () => {
    page.value = 1
    offset.value = 0
    totalPage.value = 0
  }

  /** 重置資料 */
  const resetPage = () => {
    resetPageNumber()
    datePickerShow.value = false
    manageRows.value = []
    detailRows.value = []
    creditQuotaRows.value = []
    betReportRows.value = []
    betRecordQueryRows.value = []
    betReportSummary.value = undefined
    betRecordQuerySummary.value = undefined
    memberAgentTagList.value = []
    memberAgentReferralList.value = []
    originalMemberAgentCustomizeColumnData.value = {}
    memberAgentCustomizeColumn.value = []
    memberAgentCustomizeColumnData.value = {}
    memberAgentCustomizeColumnId.value = 0
    showAddSubordinateStatus.value = false
    memberAccount.value = ""
    recommenderAccount.value = ""
    showSubordinateMemberAccount.value = null
    searchSubordinateMemberAccount.value = ""
    // 重置最後一次搜尋的參數
    lastSearchMemberAccount.value = ""
    lastSearchRecommenderAccount.value = ""
    lastSearchSubordinateMemberAccount.value = ""
    lastSearchDateRange.value = { from: "", to: "" }
    lastSearchChangeType.value = 0
    lastSearchBetNumber.value = ""
    lastSearchSettlementDate.value = false
    lastSearchBetDate.value = false
    betNumber.value = ""
    dateRange.value = { from: "", to: "" }
    changeType.value = 0
    settlementDate.value = false
    betDate.value = false
  }

  /** 切換data頁數 */
  const handleChangePage = (newPage: number) => {
    offset.value = (newPage - 1) * size.value

    switch (activeTab.value) {
      case "manage":
        handlerGetMemberAgentQuotaBalance()
        handlerGetMemberAgentQuotaAmount()
        break
      case "detail":
        handlerGetCreditQuotaHistory()
        break
      case "betReport":
        getMemberAgentBetReportData()
        break
      case "betRecordQuery":
        getMemberAgentWagerListData()
        break
    }
  }

  /** 搜尋下級會員 或 下級會員的下級會員 */
  const handlerSearchSubordinateMember = async () => {
    resetPageNumber()

    if (!showSubordinateMemberAccount.value?.account) {
      // 保存搜尋參數
      lastSearchMemberAccount.value = memberAccount.value
      lastSearchRecommenderAccount.value = recommenderAccount.value
      handlerGetMemberAgentQuotaBalance()
    } else {
      // 保存搜尋參數
      lastSearchSubordinateMemberAccount.value = searchSubordinateMemberAccount.value
      handlerGetLowerLevelMemberAgentQuotaList()
    }
  }

  /** 重置會員管理搜尋條件 */
  const resetManageSearch = async () => {
    resetPageNumber()

    if (!showSubordinateMemberAccount.value?.account) {
      memberAccount.value = ""
      recommenderAccount.value = ""
      lastSearchMemberAccount.value = ""
      lastSearchRecommenderAccount.value = ""
      await handlerGetMemberAgentQuotaBalance()
      await handlerGetMemberAgentQuotaAmount()
      return
    }

    searchSubordinateMemberAccount.value = ""
    lastSearchSubordinateMemberAccount.value = ""
    await handlerGetLowerLevelMemberAgentQuotaList()
    await handlerGetMemberAgentQuotaAmount()
  }

  /** 搜尋帳變明細 */
  const handlerSearchAccountAmount = async () => {
    if (!memberAccount.value) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseEnterUserAccount"),
        position: "top",
      })
      return
    }

    if (
      !dateRange.value ||
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    lastSearchChangeType.value = changeType.value
    await handlerGetMemberAgentQuotaMoneyHistory()
  }

  /** 搜尋額度帳變明細 */
  const handlerSearchCreditQuotaHistory = async () => {
    const currentDateRange = dateRange.value

    if (
      !currentDateRange ||
      (typeof currentDateRange === "string" && !currentDateRange) ||
      (typeof currentDateRange === "object" && (!currentDateRange.from || !currentDateRange.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return
    }

    let startDate = ""
    let endDate = ""

    if (typeof currentDateRange === "string") {
      startDate = currentDateRange
      endDate = currentDateRange
    } else {
      startDate = currentDateRange.from
      endDate = currentDateRange.to
    }

    if (DateTime.fromISO(startDate).toMillis() > DateTime.fromISO(endDate).toMillis()) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return
    }

    if (
      DateTime.fromISO(endDate).toMillis() >
      DateTime.fromISO(startDate).plus({ months: CREDIT_QUOTA_HISTORY_TYPE.MAX_RANGE_MONTHS }).toMillis()
    ) {
      $q.notify({
        type: "negative",
        message: t("common.validate.dateRangeExceedMonths", { num: CREDIT_QUOTA_HISTORY_TYPE.MAX_RANGE_MONTHS }),
        position: "top",
      })
      return
    }

    resetPageNumber()
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = currentDateRange
    lastSearchChangeType.value = changeType.value
    await handlerGetCreditQuotaHistory()
  }

  /** 搜尋投注報表 */
  const handlerSearchBetReport = async () => {
    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    await getMemberAgentBetReportData()
  }

  /** 在投注報表點擊帳號 */
  const resetBetReportSearch = async () => {
    resetPageNumber()
    memberAccount.value = ""
    lastSearchMemberAccount.value = ""
    lastSearchDateRange.value = dateRange.value

    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      betReportRows.value = []
      betReportSummary.value = undefined
      return
    }

    await getMemberAgentBetReportData()
  }

  const searchAccountBetReport = (account: string) => {
    activeTab.value = "betRecordQuery"
    dateRange.value = lastSearchDateRange.value
    memberAccount.value = account

    handlerSearchBetRecordQuery()
  }

  /** 搜尋投注紀錄查詢 */
  const handlerSearchBetRecordQuery = async () => {
    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top",
      })
      return
    }

    resetPageNumber()
    // 保存搜尋參數
    lastSearchMemberAccount.value = memberAccount.value
    lastSearchDateRange.value = dateRange.value
    lastSearchBetNumber.value = betNumber.value
    lastSearchSettlementDate.value = settlementDate.value
    lastSearchBetDate.value = betDate.value
    await getMemberAgentWagerListData()
  }

  /** 打開加減款彈窗 */
  const resetBetRecordQuerySearch = async () => {
    resetPageNumber()
    memberAccount.value = ""
    betNumber.value = ""
    settlementDate.value = false
    betDate.value = false
    lastSearchMemberAccount.value = ""
    lastSearchBetNumber.value = ""
    lastSearchSettlementDate.value = false
    lastSearchBetDate.value = false
    lastSearchDateRange.value = dateRange.value

    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      betRecordQueryRows.value = []
      betRecordQuerySummary.value = undefined
      return
    }

    await getMemberAgentWagerListData()
  }

  const handlerClickOperation = (
    account: string,
    memberId: number,
    type: number,
    isMemberAgent = false,
    balance = "0",
    remainQuotaAmount = "0"
  ) => {
    switch (type) {
      case 1:
      case 2:
        targetAccount.value = account
        dialogAmount.value = ""
        dialogMemberBalance.value = balance
        dialogMemberRemainQuotaAmount.value = remainQuotaAmount
        dialogType.value = type
        dialogMemberIsAgent.value = isMemberAgent
        showDialog.value = true
        handlerGetMemberAgentQuotaAmount()
        break
      case 3:
        resetPage()
        showSubordinateMemberAccount.value = { account, memberId }
        handlerGetLowerLevelMemberAgentQuotaList()
        break
      case 4:
        memberAgentCustomizeColumnId.value = memberId
        showAddSubordinateStatus.value = true
        break
    }
  }

  /** 取得會員代理額度 */
  const handlerGetMemberAgentQuotaAmount = async () => {
    if (!isAgentCenterCredit.value || !inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return

    const { data } = await getMemberAgentQuotaAmount({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
    })

    remainQuotaAmount.value = Number(data.remain_quota_amount ?? 0)
  }

  /** 加減款下級代理的額度 */
  const handlerClickSubmit = async () => {
    if (!dialogAmount.value || Number(dialogAmount.value) <= 0) {
      $q.notify({
        type: "negative",
        message: t("common.validate.mustNotBeEmpty"),
        position: "top",
      })
      return
    }

    const params: Request.UpdateMemberAgentQuotaBalance = {
      member_account: targetAccount.value,
      type: dialogIncreaseItem.value === 0 ? dialogType.value : dialogType.value + 2,
      amount: dialogAmount.value,
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
    }

    const { status } = await updateMemberAgentQuotaBalance(params)

    if (status) {
      $q.notify({
        type: "positive",
        message: t("report.success"),
        position: "top",
      })

      showDialog.value = false
      dialogIncreaseItem.value = 0
      handlerGetMemberAgentQuotaBalance()
      handlerGetMemberAgentQuotaAmount()
    }
  }

  /** 取得會員的下級會員列表 */
  const handlerGetMemberAgentQuotaBalance = async () => {
    manageRows.value = []

    if (!inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return

    const { data } = await getMemberAgentQuotaList({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      downline_member_account: lastSearchMemberAccount.value,
      recommender_account: lastSearchRecommenderAccount.value,
      size: String(size.value),
      offset: String(offset.value),
    })

    manageRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得下級會員的 下級會員列表 */
  const handlerGetLowerLevelMemberAgentQuotaList = async () => {
    const { data } = await getLowerLevelMemberAgentQuotaList({
      account: showSubordinateMemberAccount.value?.memberId,
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      downline_member_account: lastSearchSubordinateMemberAccount.value,
    })

    manageRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得後台會員資料自訂欄位 */
  const handlerGetMemberAgentCustomizeColumn = async (type: Request.GetMemberAgentCustomizeColumn) => {
    const { data } = await getMemberAgentCustomizeColumn(type)

    memberAgentCustomizeColumn.value = data.map((column) => {
      // select 選單翻譯label，國碼保留原始
      if (column.type === INPUT_TYPE.Enums.SELECT) {
        column.values = column.values.map((val) => {
          if (column.column_name === COLUMN_NAME.Enums.MEMBER_LEVEL) {
            val.label = val.label?.[nowLang.value as keyof typeof val.label] as string
          } else if (column.column_name !== COLUMN_NAME.Enums.COUNTRY) {
            val.label = t(`member_customize_column.${val.label}`)
          }
          return val
        })
      }

      // column_label、placeholder 抓欄位名或字典檔
      if (column.lang && column.lang[nowLang.value]) {
        column.column_label = column.lang[nowLang.value]
      } else {
        column.column_label = t(`member.register.${column.column_name}`)
      }

      return column
    })

    memberAgentCustomizeColumnData.value = {
      ...memberAgentCustomizeColumn.value.reduce((acc, item) => {
        acc[item.column_name] = item.column_name === "ref_account" ? memberAgentAccount.value : null
        return acc
      }, {} as Record<string, string | boolean | number | null>),
      is_enabled: false,
      is_member_agent: false,
      is_blocked: false,
    }
  }

  /** 取得推薦人列表 */
  const handlerGetMemberAgentReferralList = async () => {
    const { data } = await getMemberAgentReferralList()

    memberAgentReferralList.value = data.map((item) => ({
      label: item.member_account,
      value: item.member_id,
    }))
  }

  /** 取得標籤列表 */
  const handlerGetMemberAgentTagList = async () => {
    const { data } = await getMemberAgentTagList()

    memberAgentTagList.value = data.map((item) => ({
      ...item,
      checked: false,
    }))
  }

  /** 新增下級會員 */
  const handlerCreateMemberAgent = async () => {
    // 找到 ref_account 的值
    const refAccountLabel = memberAgentCustomizeColumnData.value.ref_account

    // 在 memberAgentReferralList 中找到對應的 value
    const referralItem = memberAgentReferralList.value.find((item) => item.label === refAccountLabel)

    if (referralItem) {
      // 將 ref_account 的值改為找到的 value
      memberAgentCustomizeColumnData.value.ref_account = referralItem.value
    }

    const params: any = {
      ...memberAgentCustomizeColumnData.value,
      label: memberAgentTagList.value.filter((item) => item.checked).map((item) => item.id),
    }

    // 新增下級會員
    const { status } = await createMemberAgent(params)

    return status
  }

  /** 編輯下級會員 */
  const handlerUpdateMemberAgent = async () => {
    const params: any = {
      member_id: originalMemberAgentCustomizeColumnData.value.id,
      ...memberAgentCustomizeColumnData.value,
      label: memberAgentTagList.value.filter((item) => item.checked).map((item) => item.id),
    }

    const { status } = await updateMemberAgent(params)

    return status
  }

  /** 取得下級會員資料 */
  const handlerGetMemberAgentInfo = async () => {
    const { data } = await getMemberAgentInfo(memberAgentCustomizeColumnId.value)

    memberAgentTagList.value.forEach((item) => {
      if (data.labels?.includes(item.id)) {
        item.checked = true
      }
    })

    originalMemberAgentCustomizeColumnData.value = data

    memberAgentCustomizeColumnData.value = {
      ...memberAgentCustomizeColumn.value.reduce((acc, item) => {
        if ((item.column_name === "gender" || item.column_name === "gaming_site") && !data[item.column_name]) {
          acc[item.column_name] = null
        } else {
          acc[item.column_name] = data[item.column_name]
        }
        return acc
      }, {} as Record<string, string | boolean | number | null>),
      is_enabled: data.enabled,
      is_member_agent: data.is_member_agent,
      is_blocked: data.block,
    }
  }

  const searchTimeRange = computed(() => {
    let startDate = ""
    let endDate = ""

    if (typeof lastSearchDateRange.value === "string") {
      // 選同一天
      startDate = lastSearchDateRange.value
      endDate = lastSearchDateRange.value
    } else {
      // 選不同天
      startDate = lastSearchDateRange.value.from
      endDate = lastSearchDateRange.value.to
    }

    const startTime = preciseDivide(new Date(startDate + "T00:00:00").getTime(), 1000)
    const endTime = preciseDivide(new Date(endDate + "T23:59:59").getTime(), 1000)
    const rangeDays = Math.ceil((endTime - startTime) / (60 * 60 * 24))

    return {
      status: startTime <= endTime,
      startDate,
      endDate,
      rangeDays,
    }
  })

  /** 取得會員帳變明細 */
  const handlerGetMemberAgentQuotaMoneyHistory = async () => {
    detailRows.value = []

    const { status, startDate, endDate } = searchTimeRange.value

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return
    }

    const params: Request.GetMemberAgentQuotaMoneyHistory = {
      member_account: lastSearchMemberAccount.value,
      str_time: startDate,
      end_time: endDate,
      search_type: lastSearchChangeType.value,
      size: String(size.value),
      offset: String(offset.value),
    }

    const { data } = await getMemberAgentQuotaMoneyHistory(params)

    if (!data?.list) return

    detailRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得額度帳變明細 */
  const handlerGetCreditQuotaHistory = async () => {
    creditQuotaRows.value = []

    const { status, startDate, endDate } = searchTimeRange.value

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return
    }

    const params: Request.GetCreditQuotaHistory = {
      member_account: lastSearchMemberAccount.value,
      start_date: startDate,
      end_date: endDate,
      search_type: String(lastSearchChangeType.value),
      size: String(size.value),
      offset: String(offset.value),
    }

    const { data } = await getCreditQuotaHistory(params)

    if (!data?.list) return

    creditQuotaRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 切換額度帳變明細頁數 */
  const handleChangeCreditQuotaPage = (newPage: number) => {
    offset.value = (newPage - 1) * size.value
    handlerGetCreditQuotaHistory()
  }

  /** 取得下級會員投注報表 */
  const getMemberAgentBetReportData = async () => {
    betReportRows.value = []
    betReportSummary.value = undefined

    const { status, startDate, endDate } = searchTimeRange.value

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return
    }

    const params: Request.GetMemberAgentBetReport = {
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      str_time: startDate,
      end_time: endDate,
      offset: offset.value,
      size: size.value,
    }

    if (lastSearchMemberAccount.value) {
      params.member_account = lastSearchMemberAccount.value
    }

    const { data } = await getMemberAgentBetReport(params)

    betReportRows.value = data.list
    betReportSummary.value = data.summary
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 取得下級會員投注紀錄 */
  const getMemberAgentWagerListData = async () => {
    betRecordQueryRows.value = []
    betRecordQuerySummary.value = undefined

    const { status, startDate, endDate } = searchTimeRange.value

    if (!status) {
      $q.notify({
        type: "negative",
        message: t("common.validate.startTimeMustBeBeforeEndTime"),
        position: "top",
      })
      return
    }

    const params: Request.GetMemberAgentWagerList = {
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      str_time: startDate,
      end_time: endDate,
      offset: offset.value,
      size: size.value,
    }

    if (lastSearchMemberAccount.value) {
      params.member_account = lastSearchMemberAccount.value
    }

    if (lastSearchBetNumber.value) {
      params.wager_code = lastSearchBetNumber.value
    }

    if (lastSearchBetDate.value && lastSearchSettlementDate.value) {
      params.date_type = [2]
    } else if (lastSearchBetDate.value) {
      params.date_type = [0]
    } else if (lastSearchSettlementDate.value) {
      params.date_type = [1]
    }

    const { data } = await getMemberAgentWagerList(params)

    betRecordQueryRows.value = data.list
    betRecordQuerySummary.value = data.summary
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  /** 打開第三方投注紀錄詳細頁面 */
  const handlerGetMemberAgentWagerDetail = async (wagerCode: string, productCode: number) => {
    const { data, status } = await getMemberAgentWagerDetail({ wager_code: wagerCode, product_code: productCode })

    // 成功且有網址 → 另開分頁打開第三方詳細頁面
    if (status && data?.content) {
      window.open(data.content, "_blank")
      return
    }

    // 失敗（如 332001 get game history failed、999 record not found 等任何錯誤）
    // → 統一顯示「該遊戲商不支援查看詳情明細」：遠端 i18n 有翻譯優先用，否則用本地後備文案
    const i18nKey = ERROR_CODE_TYPE.I18nKeys[ERROR_CODE_TYPE.Enums.P_GET_GAME_HISTORY_FAILED] as string
    const fallbackByLocale = ERROR_CODE_TYPE.LocalFallbackMessages[ERROR_CODE_TYPE.Enums.P_GET_GAME_HISTORY_FAILED]
    const message = te(i18nKey) ? t(i18nKey) : fallbackByLocale?.[locale.value] ?? fallbackByLocale?.en ?? ""

    $q.notify({
      type: "negative",
      position: "top",
      message,
      icon: "warning",
      timeout: 1000,
    })
  }

  return {
    activeTab,
    datePickerShow,
    page,
    offset,
    size,
    totalPage,
    showDialog,
    remainQuotaAmount,
    dialogMemberBalance,
    dialogMemberRemainQuotaAmount,
    dialogType,
    targetAccount,
    dialogAmount,
    dialogMemberIsAgent,
    dialogIncreaseItem,
    isAgentCenterCredit,
    tabOptions,
    dialogIncreaseItemOptions,
    hasCountry,
    memberAccount,
    recommenderAccount,
    searchSubordinateMemberAccount,
    lastSearchMemberAccount,
    lastSearchRecommenderAccount,
    lastSearchSubordinateMemberAccount,
    lastSearchDateRange,
    lastSearchChangeType,
    lastSearchBetNumber,
    lastSearchSettlementDate,
    lastSearchBetDate,
    betNumber,
    settlementDate,
    betDate,
    showAddSubordinateStatus,
    dateRange,
    formattedDateRange,
    formattedStartDate,
    formattedEndDate,
    betReportSummaryList,
    betReportSummaryTotalList,
    betRecordQuerySummaryList,
    betRecordQuerySummaryTotalList,
    changeType,
    memberAgentAccount,
    showSubordinateMemberAccount,
    manageRows,
    detailRows,
    betReportRows,
    betRecordQueryRows,
    betReportSummary,
    betRecordQuerySummary,
    creditQuotaRows,
    changeTypeOptions,
    creditQuotaTypeOptions,
    operationOptions,
    manageColumns,
    detailColumns,
    creditQuotaColumns,
    betReportColumns,
    betRecordQueryColumns,
    getBetRecordQueryColumns,
    memberAgentCustomizeColumn,
    memberAgentCustomizeColumnId,
    memberAgentCustomizeColumnData,
    memberAgentReferralList,
    memberAgentTagList,
    handlerChangeActiveTab,
    handlerBackSubordinateMember,
    onInputChange,
    searchTypeName,
    creditQuotaTypeName,
    creditQuotaItemName,
    parseDate,
    searchAccountBetReport,
    checkRequiredFields,
    handlerBackAddSubordinateMember,
    handlerOnMountedAddSubordinateMember,
    resetPage,
    resetManageSearch,
    resetBetReportSearch,
    resetBetRecordQuerySearch,
    handleChangePage,
    handleChangeCreditQuotaPage,
    handlerSearchSubordinateMember,
    handlerSearchAccountAmount,
    handlerSearchCreditQuotaHistory,
    handlerSearchBetReport,
    handlerSearchBetRecordQuery,
    handlerClickOperation,
    handlerGetMemberAgentQuotaAmount,
    handlerClickSubmit,
    handlerGetMemberAgentQuotaBalance,
    handlerGetMemberAgentQuotaMoneyHistory,
    handlerGetCreditQuotaHistory,
    handlerGetMemberAgentCustomizeColumn,
    handlerGetMemberAgentReferralList,
    handlerCreateMemberAgent,
    handlerUpdateMemberAgent,
    handlerGetMemberAgentInfo,
    handlerGetMemberAgentTagList,
    getMemberAgentBetReportData,
    getMemberAgentWagerListData,
    handlerGetMemberAgentWagerDetail,
  }
})
