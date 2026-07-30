import { computed, onMounted, ref, unref, watch, type Ref } from "vue"
import { useStorage } from "@vueuse/core"
import { useI18n } from "#imports"
import { useAnnouncementList } from "../api/hooks/useAnnouncementList"
import {
  type Announcement,
  type AnnouncementItem,
  type NormalizedAnnouncementListResponseType
} from "../api/apiFunctions/announcement_getAnnouncementList"
import { ANNOUNCEMENT_DISPLAY_TYPE_ENUMS } from "../constants/enums/announcementDisplayType"
import {
  ANNOUNCEMENT_MEMBER_TYPE_ENUMS,
  ANNOUNCEMENT_MEMBER_TYPE_I18N_KEYS
} from "../constants/enums/announcementMemberType"

export interface NormalizedAnnouncement extends Announcement {
  langDetail: AnnouncementItem
}

export interface AnnouncementCenterFilters {
  type: ANNOUNCEMENT_MEMBER_TYPE_ENUMS
  dateRange: string[] | null
  keyword: string
}

export interface AnnouncementCenterPagination {
  page: number
  pageSize: number
  total: number
}

export interface UseAnnouncementCenterFlowOptions {
  storageKey?: string | Ref<string>
  pageSize?: number
  autoOpen?: boolean | Ref<boolean>
}

const DEFAULT_STORAGE_KEY = "announcementCenter.dontShowUntilTs"
const DEFAULT_PAGE_SIZE = 20

const emptyDetail: AnnouncementItem = {
  title: "",
  content: "",
  image_path: ""
}

const stripHtmlTags = (value: string | undefined) => {
  return (value ?? "").replace(/<[^>]*>/g, "")
}

const getNextLocalMidnightTs = () => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime()
}

const isWithinDateRange = (announcement: NormalizedAnnouncement, dateRange: string[] | null) => {
  const [startDate, endDate] = dateRange ?? []
  const publishDate = announcement.start_time?.slice(0, 10) || ""

  if (startDate && publishDate < startDate) return false
  if (endDate && publishDate > endDate) return false
  return true
}

const matchesKeyword = (announcement: NormalizedAnnouncement, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) return true

  return `${announcement.langDetail.title} ${announcement.langDetail.content}`.toLowerCase().includes(normalizedKeyword)
}

const normalizeLocaleCode = (locale: string) => locale.toLowerCase().replace("_", "-")

const getLocaleCandidates = (locale: string) => {
  const normalizedLocale = normalizeLocaleCode(locale)
  const language = normalizedLocale.split("-")[0]

  return Array.from(new Set([normalizedLocale, language, "zh-tw", "zh-cn", "en"]))
}

const resolveAnnouncementDetail = (announcement: Announcement, locale: string): AnnouncementItem => {
  const normalizedLocale = normalizeLocaleCode(locale)
  const candidates = getLocaleCandidates(normalizedLocale)
  const detailEntries = Object.entries(announcement.detail ?? {})
  const matchedEntry = detailEntries.find(([key]) => candidates.includes(normalizeLocaleCode(key)))

  const detail = announcement.detail?.[normalizedLocale] ?? matchedEntry?.[1] ?? detailEntries[0]?.[1] ?? emptyDetail

  return {
    title: stripHtmlTags(detail.title),
    content: stripHtmlTags(detail.content),
    image_path: detail.image_path ?? ""
  }
}

export const useAnnouncementCenterFlow = (options: UseAnnouncementCenterFlowOptions = {}) => {
  const { t, locale } = useI18n()
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY
  const autoOpen = computed(() => unref(options.autoOpen ?? true))

  const isDialogVisible = ref(false)
  const dontShowToday = ref(false)
  const selectedAnnouncementId = ref<number | null>(null)
  const hasHandledInitialOpen = ref(false)
  const filters = ref<AnnouncementCenterFilters>({
    type: ANNOUNCEMENT_MEMBER_TYPE_ENUMS.ALL,
    dateRange: null,
    keyword: ""
  })
  const page = ref(1)
  const dontShowUntilTs = useStorage<number | null>(storageKey, null)

  const {
    announcementList,
    isLoading,
    isFetching,
    isError,
    refetch: refetchAnnouncementList
  } = useAnnouncementList({
    params: {
      offset: 0,
      size: 100
    }
  })

  const rawAnnouncementResponse = computed<NormalizedAnnouncementListResponseType>(() => ({
    list: announcementList.value?.list ?? [],
    pagination: announcementList.value?.pagination ?? {
      offset: 0,
      size: pageSize,
      total: 0
    }
  }))

  const allContentAnnouncements = computed<NormalizedAnnouncement[]>(() =>
    rawAnnouncementResponse.value.list
      .filter((announcement) =>
        announcement.display_options?.includes(ANNOUNCEMENT_DISPLAY_TYPE_ENUMS.ALL_CONTENT)
      )
      .map((announcement) => ({
        ...announcement,
        langDetail: resolveAnnouncementDetail(announcement, String(locale.value))
      }))
  )

  const filteredAnnouncements = computed(() =>
    allContentAnnouncements.value.filter((announcement) => {
      if (filters.value.type !== ANNOUNCEMENT_MEMBER_TYPE_ENUMS.ALL && announcement.type !== filters.value.type) {
        return false
      }

      if (!isWithinDateRange(announcement, filters.value.dateRange)) return false
      if (!matchesKeyword(announcement, filters.value.keyword)) return false
      return true
    })
  )

  const pagination = computed<AnnouncementCenterPagination>(() => ({
    page: page.value,
    pageSize,
    total: filteredAnnouncements.value.length
  }))

  const pagedAnnouncements = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredAnnouncements.value.slice(start, start + pageSize)
  })

  const selectedAnnouncement = computed(() => {
    return (
      filteredAnnouncements.value.find((announcement) => announcement.id === selectedAnnouncementId.value) ??
      pagedAnnouncements.value[0] ??
      null
    )
  })

  const shouldSkipToday = computed(() => {
    return dontShowUntilTs.value != null && dontShowUntilTs.value > Date.now()
  })

  const announcementTypeOptions = computed(() =>
    Object.values(ANNOUNCEMENT_MEMBER_TYPE_ENUMS)
      .filter((value): value is ANNOUNCEMENT_MEMBER_TYPE_ENUMS => typeof value === "number")
      .map((value) => ({
        label: t(ANNOUNCEMENT_MEMBER_TYPE_I18N_KEYS[value]),
        value
      }))
  )

  const openDialog = () => {
    if (allContentAnnouncements.value.length === 0 || shouldSkipToday.value) return
    selectedAnnouncementId.value = selectedAnnouncement.value?.id ?? allContentAnnouncements.value[0]?.id ?? null
    isDialogVisible.value = true
  }

  const closeDialog = () => {
    if (dontShowToday.value) {
      dontShowUntilTs.value = getNextLocalMidnightTs()
    }

    isDialogVisible.value = false
  }

  const updateFilters = (nextFilters: Partial<AnnouncementCenterFilters>) => {
    filters.value = {
      ...filters.value,
      ...nextFilters
    }
    page.value = 1
  }

  const clearFilters = () => {
    filters.value = {
      type: ANNOUNCEMENT_MEMBER_TYPE_ENUMS.ALL,
      dateRange: null,
      keyword: ""
    }
    page.value = 1
  }

  const search = () => {
    page.value = 1
  }

  const selectAnnouncement = (id: number) => {
    selectedAnnouncementId.value = id
  }

  const updatePage = (nextPage: number) => {
    page.value = Math.max(1, nextPage)
    selectedAnnouncementId.value = pagedAnnouncements.value[0]?.id ?? null
  }

  watch(
    [allContentAnnouncements, autoOpen],
    (announcements) => {
      const [announcementList, canAutoOpen] = announcements

      if (selectedAnnouncementId.value == null) {
        selectedAnnouncementId.value = announcementList[0]?.id ?? null
      }

      if (canAutoOpen && !hasHandledInitialOpen.value && announcementList.length > 0) {
        hasHandledInitialOpen.value = true
        openDialog()
      }
    },
    { immediate: true }
  )

  watch(filteredAnnouncements, (announcements) => {
    if (page.value > Math.max(1, Math.ceil(filteredAnnouncements.value.length / pageSize))) {
      page.value = 1
    }

    if (!announcements.some((announcement) => announcement.id === selectedAnnouncementId.value)) {
      selectedAnnouncementId.value = announcements[0]?.id ?? null
    }
  })

  onMounted(() => {
    refetchAnnouncementList()
  })

  return {
    isDialogVisible,
    dontShowToday,
    filters,
    pagination,
    announcementTypeOptions,
    announcements: pagedAnnouncements,
    allContentAnnouncements,
    selectedAnnouncement,
    isLoading,
    isFetching,
    isError,
    openDialog,
    closeDialog,
    updateFilters,
    clearFilters,
    search,
    selectAnnouncement,
    updatePage
  }
}
