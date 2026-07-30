import type { MailListParamsType, ResponseMailItem } from "@shared-lib/api/apiFunctions/mail_getMailList"
import type { MailDetailResponseType } from "@shared-lib/api/apiFunctions/mail_getMailDetail"
import { useMailList } from "@shared-lib/api/hooks/useMailList"
import { useMailDetail } from "@shared-lib/api/hooks/useMailDetail"
import { MAIL_STATUS_ENUMS } from "@shared-lib/constants/enums/mailStatus"
import { MAIL_TYPE_ENUMS, MAILTYPE_I18N_KEYS } from "@shared-lib/constants/enums/mailType"
import { useLocalStorage } from "@vueuse/core"
import { MEMBER_INBOX_MOCK_ROWS } from "./mockData"

interface InboxRowView {
  id: number
  title: string
  type: MAIL_TYPE_ENUMS
  typeLabel: string
  sendAt: string
  body: string
  isRead: boolean
  isMock: boolean
}

const INBOX_ROWS_PER_PAGE = 8
const INBOX_MAX_ROWS_PER_PAGE = 100

const parsePositiveQueryNumber = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined
  return Math.floor(parsed)
}

export const useMemberInbox = () => {
  const { t, te } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const runtimeConfig = useRuntimeConfig()

  const page = ref(1)
  const requestParams = reactive<MailListParamsType>({
    size: INBOX_ROWS_PER_PAGE,
    offset: 0
  })

  const localReadState = useLocalStorage<Record<number, boolean>>("r017-member-inbox-read-state", {})
  const detailBodyById = ref<Record<number, string>>({})
  const isDialogVisible = ref(false)
  const selectedMailIndex = ref(-1)

  const { mailList, refetch, isFetching } = useMailList({
    params: requestParams
  })
  const { fetchMailDetail, isPending: isMailDetailPending } = useMailDetail()

  const shouldShowMockData = computed(() => {
    const rawValue = runtimeConfig.public.SHOW_MOCK_DATA
    if (typeof rawValue === "boolean") return rawValue
    return ["true", "1", "yes", "on"].includes(String(rawValue).trim().toLowerCase())
  })

  const sourceRows = computed<ResponseMailItem[]>(() => {
    const list = mailList.value?.list || []
    if (list.length > 0) return list
    return shouldShowMockData.value ? MEMBER_INBOX_MOCK_ROWS : []
  })

  const resolveTypeLabel = (type: MAIL_TYPE_ENUMS) => {
    const i18nKey = MAILTYPE_I18N_KEYS[type as MAIL_TYPE_ENUMS]
    if (i18nKey && te(i18nKey)) return t(i18nKey)

    if (type === MAIL_TYPE_ENUMS.WINNING) return "中獎通知"
    return "優惠通知"
  }

  const rows = computed<InboxRowView[]>(() => {
    return sourceRows.value.map((item) => {
      const initialRead = Number(item.status) === MAIL_STATUS_ENUMS.COMPLETED
      const isRead = localReadState.value[item.id] ?? initialRead

      return {
        id: Number(item.id),
        title: String(item.mail_title || "-"),
        type: item.mail_type,
        typeLabel: resolveTypeLabel(item.mail_type),
        sendAt: formatHistoryDateTime(String(item.send_at || "")),
        body: String(item.mail_body || ""),
        isRead,
        isMock: MEMBER_INBOX_MOCK_ROWS.some((mockItem) => Number(mockItem.id) === Number(item.id))
      }
    })
  })

  const selectedMail = computed(() => {
    if (selectedMailIndex.value < 0 || selectedMailIndex.value >= rows.value.length) return null

    const row = rows.value[selectedMailIndex.value]
    const detailBody = detailBodyById.value[row.id]
    if (!detailBody) return row

    return {
      ...row,
      body: detailBody
    }
  })

  const totalRecords = computed(() => {
    const apiRows = mailList.value?.list || []
    if (apiRows.length > 0) {
      return mailList.value?.pagination?.total || rows.value.length
    }

    return rows.value.length
  })

  const canNavigatePrev = computed(() => selectedMailIndex.value > 0)
  const canNavigateNext = computed(
    () => selectedMailIndex.value >= 0 && selectedMailIndex.value < rows.value.length - 1
  )

  const markAsRead = (mailId: number) => {
    localReadState.value = {
      ...localReadState.value,
      [mailId]: true
    }
  }

  const ensureMailDetail = async (row: InboxRowView | undefined | null) => {
    if (!row || row.isMock || detailBodyById.value[row.id]) return

    const response = await fetchMailDetail(row.id)
    if (!response?.status) return

    detailBodyById.value = {
      ...detailBodyById.value,
      [row.id]: String((response.data as MailDetailResponseType | undefined)?.mail_body || row.body || "")
    }
  }

  const openMailDetailById = async (mailId: number) => {
    const nextIndex = rows.value.findIndex((item) => item.id === mailId)
    if (nextIndex < 0) return

    selectedMailIndex.value = nextIndex
    markAsRead(mailId)
    await ensureMailDetail(rows.value[nextIndex])
    isDialogVisible.value = true
  }

  const closeDialog = () => {
    isDialogVisible.value = false
  }

  const openPrev = async () => {
    if (!canNavigatePrev.value) return
    const nextIndex = selectedMailIndex.value - 1
    selectedMailIndex.value = nextIndex

    const row = rows.value[nextIndex]
    if (row) {
      markAsRead(row.id)
      await ensureMailDetail(row)
    }
  }

  const openNext = async () => {
    if (!canNavigateNext.value) return
    const nextIndex = selectedMailIndex.value + 1
    selectedMailIndex.value = nextIndex

    const row = rows.value[nextIndex]
    if (row) {
      markAsRead(row.id)
      await ensureMailDetail(row)
    }
  }

  const syncQueryToRoute = async () => {
    await router.replace({
      query: {
        page: String(page.value),
        rowsPerPage: String(requestParams.size)
      }
    })
  }

  const initFromRoute = () => {
    const queryPage = parsePositiveQueryNumber(route.query.page)
    if (queryPage !== undefined) {
      page.value = queryPage
    }

    const queryRowsPerPage = parsePositiveQueryNumber(route.query.rowsPerPage)
    if (queryRowsPerPage !== undefined) {
      requestParams.size = Math.min(queryRowsPerPage, INBOX_MAX_ROWS_PER_PAGE)
    }
  }

  const loadInbox = async ({ syncQuery = true }: { syncQuery?: boolean } = {}) => {
    requestParams.offset = (page.value - 1) * requestParams.size
    await refetch()

    if (syncQuery) {
      await syncQueryToRoute()
    }
  }

  initFromRoute()

  onMounted(async () => {
    await loadInbox({ syncQuery: true })
  })

  const handlePageChange = (nextPage: number) => {
    handleGlobalClick({
      target: `handleMemberInboxPage${nextPage}ChangeClick`,
      debounceTimer: 120,
      callback: async () => {
        page.value = nextPage
        await loadInbox({ syncQuery: true })
      }
    })
  }

  const handleOpenDetail = (mailId: number) => {
    handleGlobalClick({
      target: `handleMemberInboxOpenDetail${mailId}Click`,
      debounceTimer: 120,
      callback: async () => {
        await openMailDetailById(mailId)
      }
    })
  }

  return {
    rows,
    page,
    rowsPerPage: computed(() => requestParams.size),
    totalRecords,
    isLoading: computed(() => isFetching.value),
    selectedMail,
    selectedMailIndex,
    isDialogVisible,
    isDetailLoading: computed(() => isMailDetailPending.value),
    canNavigatePrev,
    canNavigateNext,
    handlePageChange,
    handleOpenDetail,
    closeDialog,
    openPrev,
    openNext
  }
}
