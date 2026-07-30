import { defineStore } from "pinia"
import { REPORT_TIMEZONE_TYPE } from "@/utils/constants"

export const useTimeZoneStore = defineStore("timezoneStore", {
  state: () => {
    return {
      timeZone: REPORT_TIMEZONE_TYPE.Enums.Client,
      utcOffset: 0,
      offsetFormatted: ""
    }
  },
  actions: {
    setTimeZone(data: REPORT_TIMEZONE_TYPE.Enums) {
      this.timeZone = data
    },
    setUtcOffset(data: number) {
      this.utcOffset = data
      const offsetMinutes = Math.round(data * 60)
      const sign = offsetMinutes < 0 ? "-" : "+"
      const absMinutes = Math.abs(offsetMinutes)
      const hours = Math.floor(absMinutes / 60)
      const minutes = absMinutes % 60
      this.offsetFormatted = `${sign}${hours}:${minutes.toString().padStart(2, "0")}`
    }
  },
  getters: {
    isUTC0Timezone(): boolean {
      return this.timeZone === REPORT_TIMEZONE_TYPE.Enums.UTC0
    },
    isClientTimezone(): boolean {
      return this.timeZone === REPORT_TIMEZONE_TYPE.Enums.Client
    },
    offsetHours(): number {
      return this.utcOffset
    },
    /**
     * API 目的時區偏移（分鐘）
     * - Client：使用 offsetHours 換算
     * - UTC0：強制 0
     */
    targetOffsetMinutes(): number {
      return this.isClientTimezone ? Math.round(this.offsetHours * 60) : 0
    }
  },
  persist: {
    storage: sessionStorage
  }
})
