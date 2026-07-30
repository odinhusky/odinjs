import { defineStore } from "pinia"
import type { DefineStoreOptions } from "pinia"
import type * as Response from "src/api/response.type"

type AnnouncementState = {
  announcementList: Response.AnnouncementList
  announcementPagination: Response.AnnouncementPagination
  dontShowUntilTs: number | null
}

type AnnouncementGetters = {
  hasAnnouncements: (state: AnnouncementState) => boolean
  shouldSkipToday: (state: AnnouncementState) => boolean
}

type AnnouncementActions = {
  setStoreAnnouncementList(list: Response.AnnouncementList): void
  setStoreAnnouncementPagination(pagination?: Partial<Response.AnnouncementPagination>): void
  markDontShowToday(baseDate?: Date | number): void
  clearDontShowToday(): void
}

function calcNextMidnightTs(baseDate?: Date | number) {
  const reference = baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate ?? Date.now())
  const next = new Date(reference)
  next.setHours(24, 0, 0, 0)
  return next.getTime()
}

const announcementStoreOptions: Omit<
  DefineStoreOptions<"announcementStore", AnnouncementState, AnnouncementGetters, AnnouncementActions>,
  "id"
> & {
  persist?: boolean
} = {
  state: (): AnnouncementState => ({
    announcementList: [],
    announcementPagination: {
      offset: 0,
      size: 0,
      total: 0
    },
    dontShowUntilTs: null
  }),
  getters: {
    hasAnnouncements: (state) => state.announcementList.length > 0,
    shouldSkipToday: (state) => {
      if (!state.dontShowUntilTs) return false
      return state.dontShowUntilTs > Date.now()
    }
  },
  actions: {
    setStoreAnnouncementList(list: Response.AnnouncementList) {
      this.announcementList = Array.isArray(list) ? [...list] : []
    },
    setStoreAnnouncementPagination(pagination?: Partial<Response.AnnouncementPagination>) {
      this.announcementPagination = {
        offset: pagination?.offset ?? 0,
        size: pagination?.size ?? this.announcementList.length,
        total: pagination?.total ?? this.announcementList.length
      }
    },
    markDontShowToday(baseDate?: Date | number) {
      this.dontShowUntilTs = calcNextMidnightTs(baseDate)
    },
    clearDontShowToday() {
      this.dontShowUntilTs = null
    }
  },
  persist: true
}

export const useAnnouncementStore = defineStore<
  "announcementStore",
  AnnouncementState,
  AnnouncementGetters,
  AnnouncementActions
>("announcementStore", announcementStoreOptions)

export { calcNextMidnightTs }
