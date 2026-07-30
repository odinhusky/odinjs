import {
  format,
  addMinutes,
  subMinutes,
  addHours,
  parse,
  isValid,
  startOfDay,
  endOfDay,
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth
} from "date-fns"
import { useTimeZoneStore } from "@/stores/timezoneStore"

export function useCommon() {
  function arrMove(arr: any, oldIndex: number, newIndex: number) {
    if (newIndex >= arr.length) {
      let i = newIndex - arr.length + 1
      while (i--) {
        arr.push(undefined)
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    return arr
  }

  /**
   * 大小駝峰轉換
   * @params str: 欲轉換的字符串
   * @params type: lower(轉小駝峰) / upper(轉大駝峰)
   */
  function camelCaseConversion(str: string | null | undefined, type: "lower" | "upper" = "upper") {
    if (!str) {
      return ""
    }
    if (type === "upper") {
      return str.toString().substr(0, 1).toUpperCase() + str.toString().substr(1)
    }

    if (type === "lower") {
      return str.toString().substr(0, 1).toLowerCase() + str.toString().substr(1)
    }

    return str
  }

  /**
   * 防抖函數，用法: debounce(function)
   * @param {function} func 要執行的函數
   * @param {Number} waitFor 延遲執行時間
   */
  function debounce<F extends (...args: any[]) => any>(func: F, waitFor = 300) {
    let timeout: ReturnType<typeof setTimeout> | null = null
    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => func(...args), waitFor)
    }
    return debounced as (...args: Parameters<F>) => ReturnType<F>
  }

  /**
   * 轉換千分位金錢
   * @params money: 欲轉換的金額
   * @params roundingOff: 四捨五入到小數點下第幾位，0: 原值直接顯示
   */
  function moneyFormat(money: string | number | undefined, roundingOff = 0): string | number {
    if (!money) {
      return 0
    }
    let tempData = 0
    if (typeof money === "string") {
      try {
        tempData = Number(money)
      } catch (e) {
        return 0
      }
    } else {
      tempData = money
    }

    if (roundingOff > 0) {
      // 四捨五入到小數點下第 roundingOff 位
      tempData = Math.round(tempData * Math.pow(10, roundingOff)) / Math.pow(10, roundingOff)
    }

    const returnData = tempData.toString().split(".")
    returnData[0] = returnData[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return returnData.join(".")
  }

  /**
   * 將 Enum 轉為 Array
   * @param currentEnum 欲使用的 Enum
   * @returns Enum List
   */
  function enumToArray<T>(currentEnum: any): T[] {
    return Object.keys(currentEnum)
      .filter((item) => !isNaN(Number(item)))
      .map((key) => currentEnum[key])
  }

  function numberEnumToArray(enums: Record<string, number | string>): (number | string)[] {
    return Object.values(enums).filter((v) => !isNaN(Number(v)))
  }

  function stringEnumToArray(enums: Record<string, string>): string[] {
    return Object.values(enums)
  }

  /**
   * 指定時間
   * @params date: 欲轉換的時間戳或時間
   * @params syntax: 轉換的格式
   */
  function genDate(date: Date, format: string): string | undefined {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return format.replace("yyyy", String(year)).replace("MM", month).replace("dd", day)
  }

  /**
   * 時間轉換成格式
   * @params date: 欲轉換的時間戳或時間
   * @params syntax: 轉換的格式
   * @params useTimezoneOffset: 是否依照 timezoneStore 裡的 utcOffset 做時差的計算
   */
  function genTimeFormat(
    date: number | Date | string,
    syntax = "yyyy-MM-dd HH:mm:ss",
    useTimezoneOffset = true
  ): string | undefined {
    const timezoneStore = useTimeZoneStore()
    let returnValue: string | undefined = undefined
    try {
      let parsedDate: Date

      if (typeof date === "string") {
        parsedDate = parseISO(date)
      } else {
        parsedDate = new Date(date)
      }

      if (useTimezoneOffset) {
        const localOffsetMinutes = new Date().getTimezoneOffset()
        const targetOffsetMinutes = timezoneStore.offsetHours * 60
        if (timezoneStore.isClientTimezone) {
          // 加上本地偏移 + 目標偏移
          returnValue = format(addMinutes(parsedDate, localOffsetMinutes + targetOffsetMinutes), syntax)
        } else {
          returnValue = format(addMinutes(parsedDate, localOffsetMinutes), syntax)
        }
      } else {
        returnValue = format(parsedDate, syntax)
      }
    } catch (e: any) {
      console.warn(`genTimeFormat error, date: ${date}, message: ${e.message}`)
    }
    return returnValue
  }

  /**
   * 取得今天往前推三天前的開始與結束時間
   */
  function genThreeDayBefore() {
    try {
      const now = new Date()
      // 當天也計算在內，因此需扣除一天
      const startOfDate = format(startOfDay(addDays(now, 1 - 3)), "yyyy-MM-dd")
      const endOfDate = format(endOfDay(now), "yyyy-MM-dd")
      return {
        from: startOfDate,
        to: endOfDate
      }
    } catch (e: any) {
      console.warn(e?.message)
      return {
        from: "",
        to: ""
      }
    }
  }

  /**
   * 取得當周的開始與結束時間
   */
  function genThisWeek() {
    try {
      const now = new Date()
      const startOfDate = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")
      const endOfDate = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")
      return {
        from: startOfDate,
        to: endOfDate
      }
    } catch (e: any) {
      console.warn(e?.message)
      return {
        from: "",
        to: ""
      }
    }
  }

  /**
   * 取得今天往前推前一周的開始與結束時間
   */
  function genLastWeek() {
    try {
      const now = new Date()
      const startOfDate = format(startOfWeek(addWeeks(now, -1), { weekStartsOn: 1 }), "yyyy-MM-dd")
      const endOfDate = format(endOfWeek(addWeeks(now, -1), { weekStartsOn: 1 }), "yyyy-MM-dd")
      return {
        from: startOfDate,
        to: endOfDate
      }
    } catch (e: any) {
      console.warn(e?.message)
      return {
        from: "",
        to: ""
      }
    }
  }

  /**
   * 取得當月的開始與結束時間
   */
  function genThisMonth() {
    try {
      const now = new Date()
      const startOfDate = format(startOfMonth(now), "yyyy-MM-dd")
      const endOfDate = format(endOfMonth(now), "yyyy-MM-dd")
      return {
        from: startOfDate,
        to: endOfDate
      }
    } catch (e: any) {
      console.warn(e?.message)
      return {
        from: "",
        to: ""
      }
    }
  }

  /**
   * 取得今天往前推前一月的開始與結束時間
   */
  function genLastMonth(useHms = false) {
    try {
      const now = new Date()
      const startOfDate = format(startOfMonth(addMonths(now, -1)), "yyyy-MM-dd")
      const endOfDate = format(endOfMonth(addMonths(now, -1)), "yyyy-MM-dd")
      return {
        from: startOfDate,
        to: endOfDate
      }
    } catch (e: any) {
      console.warn(e?.message)
      return {
        from: "",
        to: ""
      }
    }
  }

  /**
   * 取得當前 UTC+0 的時間
   * @params date: 欲轉換的時間戳或時間
   * @params syntax: 轉換的格式
   */
  function getNowUtc(syntax = "yyyy-MM-dd HH:mm:ss"): string {
    const date = new Date()
    const offset = date.getTimezoneOffset()

    const nowUtc = Math.sign(offset) !== -1 ? addMinutes(date, offset) : subMinutes(date, Math.abs(offset))
    return format(nowUtc, syntax)
  }

  /**
   * 產生一個隨機數字
   * @params min: 最小值
   * @params max: 最大值
   */
  function generateRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * 無條件捨去到小數點第n位
   * @params num: 值
   * @params decimal: 位數
   */
  function roundDown(num: number, decimal: number) {
    return Math.floor((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal)
  }

  /**
   * 四捨五入到小數點第n位
   * @params num: 值
   * @params decimal: 位數
   */
  function roundTo(num: number, decimal: number) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal)
  }

  /**
   * 產生週陣列
   * @params useFull: true: 週一、週二...等
   * @params useFull: false: 一、二...等
   */
  function genWeeks(useFull = false): { label: string; value: number }[] {
    const weekendLabelI18nKey = useFull
      ? [
          "week_full.monday",
          "week_full.tuesday",
          "week_full.wednesday",
          "week_full.thursday",
          "week_full.friday",
          "week_full.saturday",
          "week_full.sunday"
        ]
      : [
          "week_abridge.monday",
          "week_abridge.tuesday",
          "week_abridge.wednesday",
          "week_abridge.thursday",
          "week_abridge.friday",
          "week_abridge.saturday",
          "week_abridge.sunday"
        ]
    let returnArr = []
    for (let i = 1; i <= 7; i++) {
      returnArr.push({
        label: weekendLabelI18nKey[i - 1],
        value: i
      })
    }
    return returnArr
  }

  /**
   * 產生週陣列
   * @params useFull: true: 週日、週一、週二...等
   * @params useFull: false: 日、一、二...等
   */
  function genWeeksStartSun(useFull = false): { label: string; value: number }[] {
    const weekendLabelI18nKey = useFull
      ? [
          "week_full.sunday",
          "week_full.monday",
          "week_full.tuesday",
          "week_full.wednesday",
          "week_full.thursday",
          "week_full.friday",
          "week_full.saturday"
        ]
      : [
          "week_abridge.sunday",
          "week_abridge.monday",
          "week_abridge.tuesday",
          "week_abridge.wednesday",
          "week_abridge.thursday",
          "week_abridge.friday",
          "week_abridge.saturday"
        ]
    let returnArr = []
    for (let i = 1; i <= 7; i++) {
      returnArr.push({
        label: weekendLabelI18nKey[i - 1],
        value: i
      })
    }
    return returnArr
  }

  /**
   * 產生 01~30
   */
  function genMonths() {
    let returnArr = []
    for (let i = 1; i <= 30; i++) {
      returnArr.push({
        label: i.toString().length < 2 ? `0${i.toString()}` : i.toString(),
        value: i
      })
    }
    return returnArr
  }

  function copyToClipboard(text: string) {
    const input = document.createElement("input")

    input.value = text
    document.body.appendChild(input)
    input.select()
    // 貼上動作
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Error", err)
    })

    document.body.removeChild(input)
  }

  function objectFilterEmptyValues(obj: { [key: string]: string }): { [key: string]: string } {
    const filteredObj: { [key: string]: string } = {}

    for (const key in obj) {
      if (obj[key]) {
        // 過濾掉空字符串
        filteredObj[key] = obj[key]
      }
    }

    return filteredObj
  }

  /**
   * 轉當天時間搓
   * start 00:00:00
   * end 23:59:59
   */
  function convertToTimestamp(dateString: string, format: string, isStart: boolean): number {
    const date = parse(dateString, format, new Date())
    const adjustedDate = isStart ? startOfDay(date) : endOfDay(date)
    return Math.floor(adjustedDate.getTime())
  }

  function isValidDateFormat(dateString: string) {
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date())
    return isValid(parsedDate) && dateString === format(parsedDate, "yyyy-MM-dd")
  }

  function formatDate(dateStr: string, isEnd: boolean, useTimezoneOffset = true) {
    const timezoneStore = useTimeZoneStore()

    const date = new Date(dateStr)

    if (isEnd) {
      date.setHours(23, 59, 59)
    } else {
      date.setHours(0, 0, 0)
    }

    // 設定時區
    let offset = 0 * 60
    if (useTimezoneOffset) {
      if (timezoneStore.isClientTimezone) {
        offset = timezoneStore.offsetHours * 60
      }
    }
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

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  function isBase64Image(str: string): boolean {
    if (!str) return false
    // 帶有 data:image 前綴的
    if (/^data:image\/[a-zA-Z]+;base64,/.test(str)) return true

    // 純 base64 編碼
    if (str.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(str)) return true

    return false
  }

  return {
    arrMove,
    enumToArray,
    numberEnumToArray,
    stringEnumToArray,
    genTimeFormat,
    genThreeDayBefore,
    genThisWeek,
    genLastWeek,
    genThisMonth,
    genLastMonth,
    getNowUtc,
    camelCaseConversion,
    debounce,
    moneyFormat,
    generateRandom,
    roundDown,
    roundTo,
    genWeeks,
    genWeeksStartSun,
    genMonths,
    copyToClipboard,
    genDate,
    objectFilterEmptyValues,
    convertToTimestamp,
    isValidDateFormat,
    formatDate,
    parseDate,
    isBase64Image
  }
}
