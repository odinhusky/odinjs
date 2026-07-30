import { ref, Ref } from "vue"
import { date } from "quasar"

/**
 * 日期範圍選擇器配置選項
 */
interface DateRangePickerConfig {
  /** 最大天數限制，預設為 3 */
  maxDays?: number
  /** 是否禁用未來日期，預設為 true */
  disableFutureDates?: boolean
}

/**
 * 日期範圍型別，格式為 { from: 'YYYY/MM/DD', to: 'YYYY/MM/DD' }
 */
interface DateRange {
  from: string
  to: string
}

/**
 * 日期物件型別（Quasar Q-Date 格式）
 */
export interface DateObject {
  year: number
  month: number
  day: number
}

/**
 * 日期範圍物件型別
 */
export interface DateRangeObject {
  from: DateObject
  to: DateObject
}

/**
 * 日期範圍選擇器 Composable 返回型別
 */
interface UseDateRangePickerReturn {
  /** 日期範圍狀態 */
  dateRange: Ref<DateRange | null>
  /** 範圍選擇開始時的回調，參數格式：{ year: number, month: number, day: number } */
  onRangeStart: (dateInput: DateObject) => void
  /** 範圍選擇結束時的回調（雖然事件會傳入參數，但此函數不使用） */
  onRangeEnd: () => void
  /** 日期選項過濾函數 */
  options: (dateStr: string | number | null | undefined) => boolean
}

/**
 * 日期範圍選擇器 Composable
 * @param config - 配置選項
 * @returns 返回日期範圍選擇器的狀態和方法
 */
export function useDateRangePicker(config: DateRangePickerConfig = {}): UseDateRangePickerReturn {
  const { maxDays = 3, disableFutureDates = true } = config

  // 日期範圍，格式為 { from: 'YYYY/MM/DD', to: 'YYYY/MM/DD' }
  const dateRange = ref<DateRange | null>(null)
  const rangeStartDate = ref<string | null>(null) // 追蹤範圍選擇的開始日期

  // 將日期字串轉換為 Date 物件
  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString || typeof dateString !== "string") {
      return null
    }
    // Quasar date utils 可以直接處理 'YYYY/MM/DD' 格式
    // 使用 buildDate 或直接解析字串
    const [year, month, day] = dateString.split("/").map(Number)
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null
    }
    const parsed = new Date(year, month - 1, day)
    // Quasar date.isValid 實際上可以接受 Date 物件，但型別定義可能不完整
    return date.isValid(parsed as unknown as string | number) ? parsed : null
  }

  // 獲取今天的開始時間
  const getToday = (): Date => {
    return date.startOfDate(new Date(), "day")
  }

  const onRangeStart = (dateInput: DateObject): void => {
    // 將日期物件轉換為 YYYY/MM/DD 格式並記錄
    if (dateInput.year && dateInput.month && dateInput.day) {
      const year = String(dateInput.year)
      const month = String(dateInput.month).padStart(2, "0")
      const day = String(dateInput.day).padStart(2, "0")
      rangeStartDate.value = `${year}/${month}/${day}`
    } else {
      rangeStartDate.value = null
    }
  }

  const onRangeEnd = (): void => {
    rangeStartDate.value = null
  }

  // 選項：限制只能選擇今天及之前的日期，並且範圍不能超過指定天數
  // 這是唯一控制哪些日期可以被選擇的地方
  const options = (dateStr: string | number | null | undefined): boolean => {
    const today = getToday()

    const dateString = typeof dateStr === "string" ? dateStr : dateStr ? String(dateStr) : null
    if (!dateString) {
      return false
    }

    const selectedDate = parseDate(dateString)
    if (!selectedDate) {
      return false
    }

    // 如果啟用禁用未來日期，則不允許選擇今天之後的日期
    if (disableFutureDates && selectedDate > today) {
      return false
    }

    if (rangeStartDate.value) {
      const fromDate = parseDate(rangeStartDate.value)
      if (!fromDate) {
        return true
      }
      const diff = Math.abs(date.getDateDiff(selectedDate, fromDate, "days"))
      return diff <= maxDays - 1
    }

    if (dateRange.value && dateRange.value.from && !dateRange.value.to) {
      const fromDate = parseDate(dateRange.value.from)
      if (!fromDate) {
        return true
      }
      const maxDate = date.addToDate(fromDate, { days: maxDays - 1 })
      return date.isBetweenDates(selectedDate, fromDate, maxDate, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true
      })
    }

    if (dateRange.value && dateRange.value.to && !dateRange.value.from) {
      const toDate = parseDate(dateRange.value.to)
      if (!toDate) {
        return true
      }
      const minDate = date.subtractFromDate(toDate, { days: maxDays - 1 })
      return date.isBetweenDates(selectedDate, minDate, toDate, {
        inclusiveFrom: true,
        inclusiveTo: true,
        onlyDate: true
      })
    }

    return true
  }

  return {
    // 狀態
    dateRange,

    // 方法
    onRangeStart,
    onRangeEnd,
    options
  }
}
