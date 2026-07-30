import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useApi } from "src/common/hooks/useApi"
import { getAnnouncementList, type GetAnnouncementListParams } from "src/api/announcement"
import { useAnnouncementStore } from "src/stores/announcementStore"
import { useLanguage } from "src/common/composables/useLanguage"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useEnv } from "src/common/hooks/useEnv"
import { LANGUAGE_TYPE, ANNOUNCEMENT_DISPLAY_TYPE, ANNOUNCEMENT_MEMBER_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

export const ANNOUNCEMENT_EVENTS = {
  SHOW_SINGLE: "openSingleAnnouncement",
  SHOW_ALL_CONTENT: "openAllContentAnnouncement",
  SHOW_IMAGE: "openImageAnnouncement",
  FLOW_FINISHED: "finishedAnnouncement",
} as const

export type AllContentDialogPayload = {
  showDontShowTodayCheckbox: boolean
  announcements: Response.AnnouncementList
}

export type ImageDialogPayload = {
  announcement: Response.Announcement
  index: number
  total: number
  showDontShowTodayCheckbox: boolean
}

export type AnnouncementQuickFilterValue = "all" | "7d" | "1m" | "3m" | "custom"

type UseAnnouncementOptions = {
  enableAdvancedFilters?: boolean
}

type FetchResult = {
  skipped: boolean
  announcements: Response.AnnouncementList
  pagination: Response.AnnouncementPagination
}

const ANNOUNCEMENT_PAGE_SIZE = 20
const ADVANCED_ANNOUNCEMENT_FETCH_SIZE = 100

// [上線需求 會員端] 公告中心優化 目標版型
const TARGET_ANNOUNCEMENT_SITE_KEYS = new Set([
  "okbet",
  "okbet_green",
  "okbet_blackgold",
  "set_r022",
  "set_r023",
  "set_r017",
  "set_r029",
  "set_r030",
  "set_r031",
])

function normalizeAnnouncementResponse(
  data?: Response.AnnouncementListResponse | Response.AnnouncementList | null
): Response.AnnouncementListResponse {
  if (Array.isArray(data)) {
    return {
      list: data,
      pagination: {
        offset: 0,
        size: data.length,
        total: data.length,
      },
    }
  }

  const list = Array.isArray(data?.list) ? data.list : []

  return {
    list,
    pagination: {
      offset: data?.pagination?.offset ?? 0,
      size: data?.pagination?.size ?? list.length,
      total: data?.pagination?.total ?? list.length,
    },
  }
}

function padDateUnit(value: number) {
  return String(value).padStart(2, "0")
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${padDateUnit(date.getMonth() + 1)}-${padDateUnit(date.getDate())}`
}

function createQuickFilterRange(filter: AnnouncementQuickFilterValue) {
  const end = new Date()
  const start = new Date(end)

  if (filter === "7d") {
    start.setDate(end.getDate() - 7)
  } else if (filter === "1m") {
    start.setMonth(end.getMonth() - 1)
  } else if (filter === "3m") {
    start.setMonth(end.getMonth() - 3)
  } else {
    return {
      from: "",
      to: "",
    }
  }

  return {
    from: formatDateValue(start),
    to: formatDateValue(end),
  }
}

function resolveQuickFilterFromRange(startTimeFrom: string, startTimeTo: string): AnnouncementQuickFilterValue {
  if (!startTimeFrom && !startTimeTo) {
    return "all"
  }

  const quickFilters: AnnouncementQuickFilterValue[] = ["7d", "1m", "3m"]

  for (const filter of quickFilters) {
    const range = createQuickFilterRange(filter)
    if (range.from === startTimeFrom && range.to === startTimeTo) {
      return filter
    }
  }

  return "custom"
}

function normalizeQueryDate(value?: string | null) {
  return value?.trim() || ""
}

function localizeAnnouncementList(
  list: Response.AnnouncementList,
  langKey: LANGUAGE_TYPE.Enums,
  buildImageUrl: (path: string) => string
) {
  return list
    .map((item) => {
      const newItem = { ...item }

      const details = typeof newItem.detail === "object" && newItem.detail ? newItem.detail : {}

      let langDetail = details[langKey]

      if (!langDetail) {
        langDetail = {
          title: "",
          content: "",
          image_path: "",
        }
        // const allLangDetails = Object.values(details)
        // if (allLangDetails.length > 0) {
        //   langDetail = allLangDetails[0]
        // } else {
        //   langDetail = {
        //     title: "",
        //     content: "",
        //     image_path: ""
        //   }
        // }
      }

      newItem.langDetail = { ...langDetail }

      if (newItem.langDetail.image_path) {
        newItem.langDetail.image_path = buildImageUrl(newItem.langDetail.image_path)
      }

      return newItem
    })
    .filter((e) => e.detail)
}

export function useAnnouncement(options: UseAnnouncementOptions = {}) {
  const { t } = useI18n()
  const announcementStore = useAnnouncementStore()
  const { nowLang } = useLanguage()
  const { buildImageUrl } = useDynamicImage()
  const { eventEmit } = useEventBus()
  const { envData } = useEnv()
  const { siteKey } = envData()

  const isLoading = ref(false)
  const isFlowRunning = ref(false)
  const imageIndex = ref(0)
  const announcementType = ref<ANNOUNCEMENT_MEMBER_TYPE.Enums>(ANNOUNCEMENT_MEMBER_TYPE.Enums.All)
  const announcementQuickFilter = ref<AnnouncementQuickFilterValue>("all")
  const announcementStartTimeFrom = ref("")
  const announcementStartTimeTo = ref("")
  const announcementKeyword = ref("")
  const announcementPage = ref(1)
  const advancedAnnouncementList = ref<Response.AnnouncementList>([])
  const advancedPagedAnnouncementList = ref<Response.AnnouncementList>([])
  const hasFetchedAdvancedAnnouncements = ref(false)
  const advancedAnnouncementPagination = ref<Response.AnnouncementPagination>({
    offset: 0,
    size: 0,
    total: 0,
  })

  const handleImgPath = (path: string) => {
    return buildImageUrl(path)
  }

  const announcementTypes = computed(() => {
    return Object.keys(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys).map((e) => {
      return {
        label: t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[e as any as ANNOUNCEMENT_MEMBER_TYPE.Enums]),
        value: parseInt(e),
      }
    })
  })

  const normalizedSiteKey = computed(() => siteKey.toLowerCase())
  const isScopedAnnouncementTemplate = computed(() => TARGET_ANNOUNCEMENT_SITE_KEYS.has(normalizedSiteKey.value))
  const isAdvancedFiltersEnabled = computed(() => !!options.enableAdvancedFilters && isScopedAnnouncementTemplate.value)
  const announcementPagination = computed(() =>
    isAdvancedFiltersEnabled.value ? advancedAnnouncementPagination.value : announcementStore.announcementPagination
  )
  const isAnnouncementDateRangeInvalid = computed(() => {
    if (!announcementStartTimeFrom.value || !announcementStartTimeTo.value) {
      return false
    }

    return announcementStartTimeFrom.value > announcementStartTimeTo.value
  })
  const announcementTotalPages = computed(() => {
    if (!announcementPagination.value.total) {
      return 0
    }

    return Math.ceil(announcementPagination.value.total / ANNOUNCEMENT_PAGE_SIZE)
  })

  const localizedAnnouncements = computed(() => {
    const sourceList = isAdvancedFiltersEnabled.value
      ? advancedPagedAnnouncementList.value
      : announcementStore.announcementList ?? []

    return localizeAnnouncementList(sourceList, nowLang.value as LANGUAGE_TYPE.Enums, buildImageUrl)
  })

  const allContentAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.ALL_CONTENT)
    )
  })

  const imagesAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.IMAGES)
    )
  })

  const marqueeAnnouncements = computed<Response.AnnouncementList>(() => {
    return localizedAnnouncements.value.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.MARQUEE)
    )
  })

  const showAllContentCheckbox = computed(
    () => allContentAnnouncements.value.length > 0 && imagesAnnouncements.value.length === 0
  )

  function emitShowAllContent() {
    if (!allContentAnnouncements.value.length) return

    const payload: AllContentDialogPayload = {
      announcements: allContentAnnouncements.value,
      showDontShowTodayCheckbox: showAllContentCheckbox.value,
    }

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_ALL_CONTENT, payload)
  }

  function emitShowImage(index: number) {
    const items = imagesAnnouncements.value
    if (!items.length || !items[index]) return

    imageIndex.value = index
    const payload: ImageDialogPayload = {
      announcement: items[index],
      index,
      total: items.length,
      showDontShowTodayCheckbox: index === items.length - 1,
    }

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_IMAGE, payload)
  }

  function handleShowSingleAnnouncement(id: number) {
    const items = marqueeAnnouncements.value
    if (!items.length) return

    const announcement = marqueeAnnouncements.value.find((item) => item.id === id)
    if (!announcement) return

    eventEmit(ANNOUNCEMENT_EVENTS.SHOW_SINGLE, announcement)
  }

  function emitFlowFinished() {
    isFlowRunning.value = false
    eventEmit(ANNOUNCEMENT_EVENTS.FLOW_FINISHED)
  }

  function resetAnnouncementPage() {
    announcementPage.value = 1
  }

  function buildAdvancedAnnouncementFetchQuery(offset: number): GetAnnouncementListParams {
    return {
      start_time_from: announcementStartTimeFrom.value || undefined,
      start_time_to: announcementStartTimeTo.value || undefined,
      keyword: announcementKeyword.value.trim() || undefined,
      offset,
      size: ADVANCED_ANNOUNCEMENT_FETCH_SIZE,
    }
  }

  function filterAdvancedAnnouncementList(list: Response.AnnouncementList) {
    const allContentList = list.filter((item) =>
      item.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.ALL_CONTENT)
    )

    if (announcementType.value === ANNOUNCEMENT_MEMBER_TYPE.Enums.All) {
      return allContentList
    }

    return allContentList.filter((item) => item.type === announcementType.value)
  }

  function applyAdvancedAnnouncementPage() {
    const filteredList = filterAdvancedAnnouncementList(advancedAnnouncementList.value)
    const offset = Math.max(0, (announcementPage.value - 1) * ANNOUNCEMENT_PAGE_SIZE)

    advancedPagedAnnouncementList.value = filteredList.slice(offset, offset + ANNOUNCEMENT_PAGE_SIZE)
    advancedAnnouncementPagination.value = {
      offset,
      size: ANNOUNCEMENT_PAGE_SIZE,
      total: filteredList.length,
    }
  }

  async function fetchAdvancedAnnouncementList() {
    if (!isAdvancedFiltersEnabled.value) {
      return handleGetAnnouncementList()
    }

    if (isAnnouncementDateRangeInvalid.value) {
      return {
        skipped: true,
        announcements: [],
        pagination: announcementPagination.value,
      }
    }

    return handleGetAdvancedAnnouncementList()
  }

  function setAnnouncementDateRange(payload?: { from?: string | null; to?: string | null }) {
    announcementStartTimeFrom.value = normalizeQueryDate(payload?.from)
    announcementStartTimeTo.value = normalizeQueryDate(payload?.to)
    announcementQuickFilter.value = resolveQuickFilterFromRange(
      announcementStartTimeFrom.value,
      announcementStartTimeTo.value
    )
  }

  function applyAnnouncementQuickFilter(filter: AnnouncementQuickFilterValue) {
    announcementQuickFilter.value = filter
    const range = createQuickFilterRange(filter)
    announcementStartTimeFrom.value = range.from
    announcementStartTimeTo.value = range.to
    resetAnnouncementPage()
    return fetchAdvancedAnnouncementList()
  }

  function setAnnouncementKeyword(keyword: string) {
    announcementKeyword.value = keyword
  }

  function syncAnnouncementQuickFilter() {
    announcementQuickFilter.value = resolveQuickFilterFromRange(
      announcementStartTimeFrom.value,
      announcementStartTimeTo.value
    )
  }

  function handleAnnouncementSearch() {
    syncAnnouncementQuickFilter()
    announcementKeyword.value = announcementKeyword.value.trim()
    resetAnnouncementPage()
    return fetchAdvancedAnnouncementList()
  }

  function handleAnnouncementPageChange(page: number) {
    announcementPage.value = Math.max(1, page)

    if (isAdvancedFiltersEnabled.value) {
      applyAdvancedAnnouncementPage()
      return Promise.resolve({
        skipped: !advancedPagedAnnouncementList.value.length,
        announcements: advancedPagedAnnouncementList.value,
        pagination: advancedAnnouncementPagination.value,
      })
    }

    return fetchAdvancedAnnouncementList()
  }

  function handleAnnouncementTypeChange() {
    if (!isAdvancedFiltersEnabled.value) {
      return Promise.resolve({
        skipped: false,
        announcements: announcementStore.announcementList,
        pagination: announcementStore.announcementPagination,
      })
    }

    resetAnnouncementPage()
    applyAdvancedAnnouncementPage()

    return Promise.resolve({
      skipped: !advancedPagedAnnouncementList.value.length,
      announcements: advancedPagedAnnouncementList.value,
      pagination: advancedAnnouncementPagination.value,
    })
  }

  async function handleGetAdvancedAnnouncementList(): Promise<FetchResult> {
    isLoading.value = true
    try {
      let offset = 0
      let total = 0
      const list: Response.AnnouncementList = []

      do {
        const { status, data } = await useApi(getAnnouncementList, buildAdvancedAnnouncementFetchQuery(offset))
        const normalizedData = normalizeAnnouncementResponse(data)

        if (!status) {
          advancedAnnouncementList.value = []
          advancedPagedAnnouncementList.value = []
          advancedAnnouncementPagination.value = normalizedData.pagination
          return { skipped: true, announcements: [], pagination: normalizedData.pagination }
        }

        list.push(...normalizedData.list)
        total = normalizedData.pagination.total

        if (!normalizedData.list.length) {
          break
        }

        offset += ADVANCED_ANNOUNCEMENT_FETCH_SIZE
      } while (list.length < total)

      advancedAnnouncementList.value = list
      applyAdvancedAnnouncementPage()

      if (announcementStore.shouldSkipToday) {
        return {
          skipped: true,
          announcements: [],
          pagination: advancedAnnouncementPagination.value,
        }
      }

      return {
        skipped: !advancedPagedAnnouncementList.value.length,
        announcements: advancedPagedAnnouncementList.value,
        pagination: advancedAnnouncementPagination.value,
      }
    } finally {
      hasFetchedAdvancedAnnouncements.value = true
      isLoading.value = false
    }
  }

  async function handleGetAnnouncementList(query?: GetAnnouncementListParams): Promise<FetchResult> {
    isLoading.value = true
    try {
      const requestQuery = isScopedAnnouncementTemplate.value && query ? query : undefined
      const { status, data } = await useApi(getAnnouncementList, requestQuery)
      const normalizedData = normalizeAnnouncementResponse(data)
      const list = normalizedData.list

      if (!status || !list.length) {
        announcementStore.setStoreAnnouncementList(normalizedData.list)
        announcementStore.setStoreAnnouncementPagination(normalizedData.pagination)
        return { skipped: true, announcements: [], pagination: normalizedData.pagination }
      }
      announcementStore.setStoreAnnouncementList(normalizedData.list)
      announcementStore.setStoreAnnouncementPagination(normalizedData.pagination)

      if (announcementStore.shouldSkipToday) {
        return { skipped: true, announcements: [], pagination: normalizedData.pagination }
      }

      return { skipped: false, announcements: list, pagination: normalizedData.pagination }
    } finally {
      isLoading.value = false
    }
  }

  async function initAnnouncementFlow() {
    const { skipped } = await handleGetAnnouncementList()
    if (skipped) {
      return { started: false, reason: "skip" as const }
    }

    imageIndex.value = 0

    if (allContentAnnouncements.value.length) {
      isFlowRunning.value = true
      emitShowAllContent()
      return { started: true, mode: "allContent" as const }
    }

    if (imagesAnnouncements.value.length) {
      isFlowRunning.value = true
      emitShowImage(0)
      return { started: true, mode: "images" as const }
    }

    emitFlowFinished()
    return { started: false, reason: "empty" as const }
  }

  function handleAllContentClosed(options?: { dontShowToday?: boolean }) {
    if (!isFlowRunning.value) return

    if (options?.dontShowToday) {
      announcementStore.markDontShowToday()
      emitFlowFinished()
      return
    }

    if (imagesAnnouncements.value.length) {
      emitShowImage(0)
      return
    }

    emitFlowFinished()
  }

  function handleImageClosed(options?: { dontShowToday?: boolean }) {
    if (!isFlowRunning.value) return

    if (options?.dontShowToday) {
      announcementStore.markDontShowToday()
      emitFlowFinished()
      return
    }

    const nextIndex = imageIndex.value + 1
    if (nextIndex < imagesAnnouncements.value.length) {
      emitShowImage(nextIndex)
      return
    }

    emitFlowFinished()
  }

  return {
    /** 查詢公告類型  */
    announcementType,

    /** 公告類型清單 */
    announcementTypes,

    /** 全內容公告 */
    allContentAnnouncements,

    /** 是否啟用公告進階篩選 */
    isAdvancedFiltersEnabled,

    /** 公告快速時間篩選 */
    announcementQuickFilter,

    /** 公告開始時間 */
    announcementStartTimeFrom,

    /** 公告結束時間 */
    announcementStartTimeTo,

    /** 公告關鍵字 */
    announcementKeyword,

    /** 公告當前頁 */
    announcementPage,

    /** 公告每頁筆數 */
    announcementPageSize: ANNOUNCEMENT_PAGE_SIZE,

    /** 公告總頁數 */
    announcementTotalPages,

    /** 公告日期區間是否合法 */
    isAnnouncementDateRangeInvalid,

    /** 分頁資訊 */
    announcementPagination,

    /** 是否顯示全內容公告的「今天不再顯示」勾選框 */
    showAllContentCheckbox,

    /** 圖片公告 */
    imagesAnnouncements,

    /** 跑馬燈 */
    marqueeAnnouncements,

    /** 執行API中 */
    isLoading,

    /** 是否已完成首次進階公告查詢 */
    hasFetchedAdvancedAnnouncements,

    /** 公告流程中 */
    isFlowRunning,

    /** 當前圖片公告index */
    currentImageIndex: imageIndex,

    /** 取得公告清單 */
    handleGetAnnouncementList,

    /** 設定公告日期區間 */
    setAnnouncementDateRange,

    /** 設定公告關鍵字 */
    setAnnouncementKeyword,

    /** 套用公告快捷時間 */
    applyAnnouncementQuickFilter,

    /** 搜尋公告 */
    handleAnnouncementSearch,

    /** 切換公告分頁 */
    handleAnnouncementPageChange,

    /** 切換公告類型 */
    handleAnnouncementTypeChange,

    /** 是否為此次公告改版目標版型 */
    isScopedAnnouncementTemplate,

    /** 初始化公告 */
    initAnnouncementFlow,

    /** 關閉全內容公告 */
    handleAllContentClosed,

    /** 關閉圖片公告 */
    handleImageClosed,

    /** 顯示單筆公告 */
    handleShowSingleAnnouncement,

    /** 處理圖片路徑 */
    handleImgPath,
  }
}
