import { useAgentCode } from "src/common/hooks/useAgentCode"
import { applyFBSportsColor, applyFBSportsColorToContent, FB_SPORTS_COLOR } from "src/common/utils/fbSportsLaunch"
import { computed } from "vue"

/**
 * FB 體育 iframe 的預設版面色系
 * - ZPL1（總代 ZPLM）：預設淺色版面(daily)
 * - 其餘代理（含 BBF1）：預設深色版面(dark)，PC / H5 皆同
 *
 * 初次進入平台（force = true）會強制帶上代理的預設色系，覆蓋供應商記住的
 * 前次選擇，達成「不保留前次切換結果」；iframe 內同次切換回傳的網址則不 force，
 * 保留玩家當次的切換。
 */
export function useFBSportsColor() {
  const { isZPL1 } = useAgentCode()

  const defaultColor = computed(() => {
    if (isZPL1.value) return FB_SPORTS_COLOR.LIGHT
    return FB_SPORTS_COLOR.DARK
  })

  const applyDefaultColor = (url: string, force = false) => {
    if (!defaultColor.value) return url

    return applyFBSportsColor(url, defaultColor.value, force)
  }

  const applyDefaultColorToContent = (content: string, force = false) => {
    if (!defaultColor.value) return content

    return applyFBSportsColorToContent(content, defaultColor.value, force)
  }

  return {
    defaultColor,
    applyDefaultColor,
    applyDefaultColorToContent,
  }
}
