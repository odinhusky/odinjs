import { ref, reactive, computed, watch } from "vue"
import { useApi } from "src/common/hooks/useApi"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import {
  getReferralRebateSummary,
  getReferralRebateStatement,
  getReferralRebateEvents,
  getReferralRebateEventsStatements
} from "src/api/referral_rebate"
import { getReferralInfo } from "src/api/referral"

import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE, CALCULATE_TYPE } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"

export function useReferralRebate() {
  const { availCurrencyList, currencyIdMap, currencyCodeMap, getAvailCurrencyList, formatterCurrency } = useBank()
  const { moneyFormat, genEnumToArray, copyMessage } = useCommon()
  const { activeWalletCurrencyCode } = useUserInfo()

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()

  // 參數定義

  const activeTab = ref("eventStatement")
  const isLoading = ref(false)
  const referralCode = ref("-")
  const referralRebateCurrencyId = ref(1)
  const referralRebateSummary = reactive<Response.ReferralRebateSummary>({
    calculate_type: 0,
    profit: "0",
    valid_bet_amount: "0",
    revenue_amount: "0"
  })

  const selectedEventId = ref<number | null | undefined>()

  const referralRebateStatements = reactive<Response.ReferralRebateStatementsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  const referralRebateStatementsList = computed(() => {
    return referralRebateStatements.list.map((e) => {
      return {
        account: e.account,
        tier: e.tier,
        deposit_amount: moneyFormat(e.deposit_amount),
        currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
        game_type: GAME_TYPE.I18nKeys[e.game_type as GAME_TYPE.Enums]
          ? t(GAME_TYPE.I18nKeys[e.game_type as GAME_TYPE.Enums])
          : "—",
        valid_bet_amount: moneyFormat(e.valid_bet_amount),
        profit: moneyFormat(e.profit),
        rate: e.rate ?? "",
        revenue_amount: moneyFormat(e.revenue_amount)
      }
    })
  })

  const referralRebateStatementsTableColumns = computed(() => {
    const profitLabel =
      referralRebateSummary.calculate_type === CALCULATE_TYPE.Enums.NetGamingRevenue
        ? t("member.referralRebate.netGamingRevenue")
        : t("member.referralRebate.profit")

    return [
      { name: "account", label: t("member.referralRebate.account"), field: "account" },
      { name: "tier", label: t("member.referralRebate.tier"), field: "tier" },
      { name: "deposit_amount", label: t("member.referralRebate.depositAmount"), field: "deposit_amount" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "game_type", label: t("member.referralRebate.gametype"), field: "game_type" },
      { name: "valid_bet_amount", label: t("member.referralRebate.validBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: profitLabel, field: "profit" }
    ]
  })

  const referralRebateEventsStatementsTableColumns = computed(() => {
    const profitLabel =
      referralRebateSummary.calculate_type === CALCULATE_TYPE.Enums.NetGamingRevenue
        ? t("member.referralRebate.netGamingRevenue")
        : t("member.referralRebate.profit")
    return [
      { name: "account", label: t("member.referralRebate.account"), field: "account" },
      { name: "tier", label: t("member.referralRebate.tier"), field: "tier" },
      { name: "rate", label: t("member.referralRebate.rate"), field: "rate" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "valid_bet_amount", label: t("member.referralRebate.validBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: profitLabel, field: "profit" },
      { name: "revenue_amount", label: t("member.referralRebate.revenueAmount"), field: "revenue_amount" }
    ]
  })

  const referralRebateEvents = reactive<Response.ReferralRebateEventsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  const referralRebateEventsTableColumns = computed(() => {
    let columns = [
      { name: "settlement_time", label: t("member.referralRebate.settlementTime"), field: "settlement_time" },
      { name: "currency_id", label: t("common.btn.currency"), field: "currency_id" },
      { name: "valid_bet_amount", label: t("member.referralRebate.totalValidBetAmount"), field: "valid_bet_amount" },
      { name: "profit", label: t("member.referralRebate.totalProfit"), field: "profit" },
      { name: "revenue_amount", label: t("member.referralRebate.totalRevenueAmount"), field: "revenue_amount" },
      { name: "distribution_time", label: t("member.referralRebate.distributionTime"), field: "distribution_time" }
    ]

    if ($q.platform.is.mobile) {
      columns = [...columns, { name: "action", label: "action", field: "action" }]
    }

    return columns
  })

  const referralRebateEventsStatements = reactive<Response.ReferralRebateStatementsList>({
    list: [],
    pagination: {
      page: 1,
      offset: 1,
      size: 10,
      total: 0
    }
  })

  // 下級投注報表參數
  const accountNumber = ref("")
  const gameTypeId = ref(0)
  type ReferralRebateDateSelection = { from: string; to: string } | string

  const selectedDate = ref<ReferralRebateDateSelection>({
    from: "",
    to: ""
  })

  /** 部分版型第二 tab 仍用裸 q-date，同天可能為字串；DateRangePicker 則固定為 { from, to } */
  function getSelectedDateRange(): { from: string; to: string } {
    const value = selectedDate.value
    if (typeof value === "string" && value) {
      return { from: value, to: value }
    }
    if (value && typeof value === "object") {
      return { from: value.from || "", to: value.to || "" }
    }
    return { from: "", to: "" }
  }

  const displayDate = computed(() => {
    const { from, to } = getSelectedDateRange()
    if (from && to) return `${from} - ${to}`
    return ""
  })

  const currencyDropdown = computed(() => {
    if (!availCurrencyList.value.length) return []

    return availCurrencyList.value.map((e) => {
      return {
        label: formatterCurrency(e.code) || "",
        value: e.id
      }
    })
  })

  const gameTypeDropdown = computed(() => {
    return genEnumToArray(GAME_TYPE.Enums).map((e) => {
      return {
        label: t(GAME_TYPE.I18nKeys[e as GAME_TYPE.Enums]),
        value: e
      }
    })
  })

  const gameTypeDropdownWithAll = computed(() => {
    return [
      {
        label: t("menu.all"),
        value: 0
      },
      ...genEnumToArray(GAME_TYPE.Enums).map((e) => {
        return {
          label: t(GAME_TYPE.I18nKeys[e as GAME_TYPE.Enums]),
          value: e
        }
      })
    ]
  })

  const referralRebateCurrencyCode = computed(() => {
    if (!referralRebateCurrencyId.value || !currencyIdMap.value) return ""

    return formatterCurrency(currencyIdMap.value[referralRebateCurrencyId.value]?.code || "")
  })

  const gameTypeCode = computed(() => {
    return gameTypeId.value === 0 ? "menu.all" : GAME_TYPE.I18nKeys[gameTypeId.value]
  })

  function changeCurrency(item: Response.BaseListType) {
    referralRebateCurrencyId.value = item.value ? Number(item.value) : referralRebateCurrencyId.value
    getSummary()
    getEvents()

    if (router.currentRoute.value.name === "ReferralRebateEvent") {
      getEventsStatements(selectedEventId.value!, false)
    } else {
      getStatement(false)
    }
  }

  function changeGameType(item: Response.BaseListType) {
    gameTypeId.value = Number(item.value)
  }

  const initDetail = () => {
    const currentRouteName = router.currentRoute.value.name

    if (currentRouteName === "ReferralRebateEvent") {
      const eventId = Number(router.currentRoute.value.params.id)
      handleDetailClick(eventId)
    }
  }

  async function initReferralRebateCurrency() {
    isLoading.value = true
    await getAvailCurrencyList()
    isLoading.value = false

    if (activeWalletCurrencyCode.value && currencyCodeMap.value) {
      const currency = currencyCodeMap.value[activeWalletCurrencyCode.value]
      if (currency) {
        referralRebateCurrencyId.value = currency.id
        return
      }
    }

    if (availCurrencyList.value.length) {
      referralRebateCurrencyId.value = availCurrencyList.value[0].id
    }
  }

  async function initReferralRebateDate() {
    function getDates() {
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0") // 月份要 +1
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }

      return {
        today: formatDate(today),
        sevenDaysAgo: formatDate(sevenDaysAgo)
      }
    }

    const result = getDates()

    selectedDate.value = {
      from: result.sevenDaysAgo,
      to: result.today
    }
  }

  // 當期總計
  const getSummary = async () => {
    isLoading.value = true

    const payload: Request.getReferralRebateSummary = {
      currency_id: referralRebateCurrencyId.value
    }

    const { from, to } = getSelectedDateRange()
    payload.start_time = from
    payload.end_time = to

    const { status, data } = await useApi(getReferralRebateSummary, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateSummary.calculate_type = data.calculate_type
      referralRebateSummary.profit = data.profit
      referralRebateSummary.revenue_amount = data.revenue_amount
      referralRebateSummary.valid_bet_amount = data.valid_bet_amount
    }
  }

  // 當期反佣結算明細 (下級投注報表)
  const getStatement = async (showAll: boolean) => {
    isLoading.value = true

    const payload: Request.getReferralRebateStatements = {
      currency_id: referralRebateCurrencyId.value,
      account: accountNumber.value,
      game_type: gameTypeId.value,
      offset: (referralRebateStatements.pagination.page - 1) * referralRebateStatements.pagination.size,
      size: 20
    }

    const { from, to } = getSelectedDateRange()
    payload.start_time = from
    payload.end_time = to
    // 刪除 game_type、account
    if (showAll) {
      delete payload.game_type
      delete payload.account
    } else if (gameTypeId.value === 0) {
      delete payload.game_type
    }

    const { status, data } = await useApi(getReferralRebateStatement, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateStatements.list = []
      referralRebateStatements.pagination.page = 1
      referralRebateStatements.pagination.offset = 1
      referralRebateStatements.pagination.size = 10
      referralRebateStatements.pagination.total = 0

      referralRebateStatements.pagination.offset = data.pagination.offset
      referralRebateStatements.pagination.size = data.pagination.size
      referralRebateStatements.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      referralRebateStatements.list = data.list
    }
  }

  // 反佣明細
  const getEvents = async () => {
    isLoading.value = true

    const { from, to } = getSelectedDateRange()
    const payload: Request.getReferralRebateEvents = {
      currency_id: referralRebateCurrencyId.value,
      start_time: from,
      end_time: to,
      offset: (referralRebateEvents.pagination.page - 1) * referralRebateEvents.pagination.size,
      size: 20
    }

    const { status, data } = await useApi(getReferralRebateEvents, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateEvents.list.length = 0
      referralRebateEvents.pagination.page = 1
      referralRebateEvents.pagination.offset = 1
      referralRebateEvents.pagination.size = 10
      referralRebateEvents.pagination.total = 0

      const list = data.list.map((e) => {
        return {
          id: e.id,
          settlement_time: parseDate(e.settlement_time),
          currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
          valid_bet_amount: moneyFormat(e.valid_bet_amount),
          profit: moneyFormat(e.profit),
          revenue_amount: moneyFormat(e.revenue_amount),
          distribution_time: parseDate(e.distribution_time),
          action: "action"
        }
      })

      referralRebateEvents.pagination.offset = data.pagination.offset
      referralRebateEvents.pagination.size = data.pagination.size
      referralRebateEvents.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      Object.assign(referralRebateEvents.list, list)
    }
  }

  // 反佣結算明細
  const getEventsStatements = async (eventId: number, showAll: boolean) => {
    isLoading.value = true

    const payload: Request.getReferralRebateEventsStatements = {
      event_id: eventId,
      account: accountNumber.value,
      game_type: gameTypeId.value,
      currency_id: referralRebateCurrencyId.value,
      offset: (referralRebateEventsStatements.pagination.page - 1) * referralRebateEventsStatements.pagination.size,
      size: 20
    }

    // 刪除 game_type、account
    if (showAll) {
      delete payload.game_type
      delete payload.account
    } else if (gameTypeId.value === 0) {
      delete payload.game_type
    }

    const { status, data } = await useApi(getReferralRebateEventsStatements, payload)
    isLoading.value = false

    if (status && data) {
      referralRebateEventsStatements.list.length = 0
      referralRebateEventsStatements.pagination.page = 1
      referralRebateEventsStatements.pagination.offset = 1
      referralRebateEventsStatements.pagination.size = 10
      referralRebateEventsStatements.pagination.total = 0

      const list = data.list.map((e, index) => {
        return {
          index: index,
          account: e.account,
          tier: e.tier,
          rate: `${e.rate} %`,
          currency_id: formatterCurrency(currencyIdMap.value![referralRebateCurrencyId.value]?.code || ""),
          valid_bet_amount: moneyFormat(e.valid_bet_amount),
          profit: moneyFormat(e.profit),
          revenue_amount: moneyFormat(e.revenue_amount)
        }
      })
      referralRebateEventsStatements.pagination.offset = data.pagination.offset
      referralRebateEventsStatements.pagination.size = data.pagination.size
      referralRebateEventsStatements.pagination.total = Math.ceil(data.pagination.total / data.pagination.size)
      Object.assign(referralRebateEventsStatements.list, list)
    }
  }

  // 專屬推薦碼
  const getReferralCode = async () => {
    const { status, data } = await useApi(getReferralInfo)

    if (status && data) {
      referralCode.value = data.code
    }
  }

  const handleShareReferralCode = () => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        referral_code: referralCode.value
      }
    })

    copyMessage(window.location.href)
  }

  function formatDate(dateStr: string, isEnd: boolean) {
    const date = new Date(dateStr)

    if (isEnd) {
      date.setHours(23, 59, 59)
    } else {
      date.setHours(0, 0, 0)
    }

    // 設定時區 +08:00
    const offset = 8 * 60
    const tzOffset =
      (offset >= 0 ? "+" : "-") +
      String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0") +
      ":" +
      String(Math.abs(offset) % 60).padStart(2, "0")

    const isoString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}:${String(date.getSeconds()).padStart(2, "0")}${tzOffset}`

    return isoString
  }

  function parseDate(dateStr: string) {
    if (!dateStr) return "- -"
    const date = new Date(dateStr)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }

  const handleReferralRebateStatementsPagination = (page: number) => {
    referralRebateStatements.pagination.page = page
    getStatement(false)
  }

  const handleReferralRebateEventsPagination = (page: number) => {
    referralRebateEvents.pagination.page = page
    getEvents()
  }

  const eventId = ref<number>()
  const handlereferralRebateEventsStatementsPagination = (page: number) => {
    referralRebateEventsStatements.pagination.page = page
    if (eventId.value) {
      getEventsStatements(eventId.value, false)
    }
  }

  const handleEventsRowClick = (evt: Event, row: any, index: number) => {
    eventId.value = row.id

    if (eventId.value !== undefined) {
      handleDetailClick(eventId.value)
    }
  }

  const handleDetailClick = (eventId: number) => {
    selectedEventId.value = eventId

    router.push({
      path: "/referral_rebate/event/" + eventId
    })
    changeGameType({ label: "", value: 0 })
    getEventsStatements(eventId, true)
  }

  const tableRowClass = () => {
    return "cursor-pointer"
  }

  watch(route, async () => {
    if (route.name === "ReferralRebate") {
      selectedEventId.value = null

      await getSummary()
      await getStatement(false)
      await getEvents()
    }
  })

  return {
    activeTab,

    /** 查詢中 */
    isLoading,

    /** 幣別下拉選單 */
    currencyDropdown,

    /** 遊戲類別下拉選單 */
    gameTypeDropdown,

    /** 遊戲類別下拉選單含全部 */
    gameTypeDropdownWithAll,
    gameTypeId,

    /** 推薦碼 */
    referralCode,

    /** 當前幣別id */
    referralRebateCurrencyId,

    /** 總計 */
    referralRebateSummary,
    /** 返回總計 */

    /** 當前幣別code */
    referralRebateCurrencyCode,

    /** 當前遊戲名稱code */
    gameTypeCode,

    /** 初始化明細 */
    initDetail,

    /** 初始化幣別 */
    initReferralRebateCurrency,

    /** 初始化日期 */
    initReferralRebateDate,

    /** 切換幣別 */
    changeCurrency,

    /** 切換遊戲類別 */
    changeGameType,

    /** 當期總計 */
    getSummary,

    /** 當期反佣結算明細 (下級投注報表) */
    getStatement,

    /** 反佣明細 */
    getEvents,

    /** 反佣結算明細 */
    getEventsStatements,

    /** 取得專屬優惠碼 */
    getReferralCode,

    /** 會員帳號 */
    accountNumber,

    selectedDate,

    displayDate,

    referralRebateStatements,

    referralRebateStatementsList,

    referralRebateStatementsTableColumns,

    referralRebateEventsStatementsTableColumns,

    referralRebateEvents,

    referralRebateEventsStatements,

    referralRebateEventsTableColumns,

    handleReferralRebateStatementsPagination,

    handleReferralRebateEventsPagination,

    handlereferralRebateEventsStatementsPagination,

    handleShareReferralCode,

    handleEventsRowClick,

    handleDetailClick,

    tableRowClass,

    selectedEventId
  }
}
