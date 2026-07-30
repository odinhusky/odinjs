import { addMinutes, format, isValid, parseISO } from "date-fns"

import { useTimeZoneStore } from "@/stores/timezoneStore"

const memberAnnouncementUtcDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

export function isMemberAnnouncementUtcDateTime(value: string): boolean {
  return memberAnnouncementUtcDateTimeRegex.test(value)
}

export function formatMemberAnnouncementUtcDateTime(value: string, outputFormat: string): string {
  const parsedDate = parseISO(value)
  if (!isValid(parsedDate)) {
    throw new Error(`Invalid member announcement UTC date time: ${value}`)
  }

  const timezoneStore = useTimeZoneStore()
  const localOffsetMinutes = -parsedDate.getTimezoneOffset()
  const agentOffsetMinutes = Math.round(timezoneStore.utcOffset * 60)
  return format(addMinutes(parsedDate, agentOffsetMinutes - localOffsetMinutes), outputFormat)
}
