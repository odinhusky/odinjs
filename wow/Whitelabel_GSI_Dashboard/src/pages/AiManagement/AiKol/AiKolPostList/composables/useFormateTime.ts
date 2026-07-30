import { useI18n } from "vue-i18n"

export function useFormateTime() {
  const { t } = useI18n()

  // 格式化時間：例如 "2023-08-28 12:05" 或 "5分鐘前"
  const formatDuration = (val: string) => {
    if (!val) return ""

    const now = new Date().getTime()
    const created = new Date(val).getTime()
    const diffInSeconds = Math.floor((now - created) / 1000)

    const minute = 60
    const hour = minute * 60
    const day = hour * 24

    // 1. 秒：需帶入參數 {num}
    if (diffInSeconds < minute) {
      const num = diffInSeconds < 1 ? 1 : diffInSeconds
      return `${t("query_params.x_second", { num })} ${t("table_header.ago")}`
    }

    // 2. 分
    if (diffInSeconds < hour) {
      const num = Math.floor(diffInSeconds / minute)
      return `${num} ${t("common.minutes")} ${t("table_header.ago")}`
    }

    // 3. 時
    if (diffInSeconds < day) {
      const num = Math.floor(diffInSeconds / hour)
      return `${num} ${t("common.hour")} ${t("table_header.ago")}`
    }

    // 4. 日（1-3 日）
    if (diffInSeconds < day * 4) {
      const num = Math.floor(diffInSeconds / day)
      return `${num} ${t("common.day")} ${t("table_header.ago")}`
    }

    // 5. 超過 4 日：顯示格式 MM/DD hh:mm By Sally
    const date = new Date(val)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const dayNum = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${month}/${dayNum} ${hours}:${minutes}`
  }

  return {
    formatDuration
  }
}
