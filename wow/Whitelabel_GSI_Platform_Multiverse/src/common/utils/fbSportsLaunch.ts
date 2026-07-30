import type * as Response from "src/api/response.type"

const URL_REGEX = /https?:\/\/[^\s"'<>]+/
const IFRAME_SRC_REGEX = /<iframe[^>]+src=["']([^"']+)["']/i

export const FB_SPORTS_PRODUCT_CODE = 1183
export const FB_SPORTS_GUEST_TOKEN = "guestMode"
// FB 體育 iframe 版面色系參數：dark = 深色版面、daily = 淺色版面
export const FB_SPORTS_COLOR = {
  DARK: "dark",
  LIGHT: "daily",
} as const

export const resolveFBSportsUrl = (data?: Partial<Response.LaunchGame>) => {
  const gameUrl = data?.game_url?.trim()

  if (gameUrl) return gameUrl

  const gameContent = data?.game_content

  if (!gameContent) return ""

  const iframeSrc = gameContent.match(IFRAME_SRC_REGEX)?.[1]?.trim()
  if (iframeSrc) return iframeSrc

  return gameContent.match(URL_REGEX)?.[0] ?? ""
}

// 以字串方式 upsert 單一 query 參數，不用 URLSearchParams 重新序列化整段 query。
// FB 的 game_url 於 query 內帶有未編碼的 apiSrc/pushSrc（含 :// ），若經
// URLSearchParams.toString() 會被 encode（:// → %3A%2F%2F），導致 FB H5 前端
// 解析 apiSrc 失敗、退回自身記憶的預設色系。overwrite = true 覆蓋既有值，
// false 則保留既有值（僅在缺少時附加）。
const upsertFBSportsParam = (url: string, key: string, value: string, overwrite: boolean) => {
  const pattern = new RegExp(`([?&#]${key}=)[^&#]*`, "i")
  if (pattern.test(url)) {
    return overwrite ? url.replace(pattern, `$1${value}`) : url
  }

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}${key}=${value}`
}

export const applyFBSportsGuestOptions = (url: string) => {
  if (!url) return ""

  let result = upsertFBSportsParam(url, "token", FB_SPORTS_GUEST_TOKEN, true)
  result = upsertFBSportsParam(result, "tutorialPop", "1", true)
  result = upsertFBSportsParam(result, "hideBalance", "1", true)
  return result
}

// force = true 時，即使網址已帶 color 也會覆蓋成指定色系。
// 初次進入平台的 launch 網址需 force，才不會沿用供應商記住的前次選擇；
// iframe 內同次切換回傳的 changeUrl 則不 force，以保留玩家當次的切換結果。
export const applyFBSportsColor = (url: string, color: string = FB_SPORTS_COLOR.DARK, force = false) => {
  if (!url) return ""

  return upsertFBSportsParam(url, "color", color, force)
}

// game_content 是一段內含 iframe 的 HTML，需替換其中的網址才能帶上色系參數
export const applyFBSportsColorToContent = (content: string, color: string = FB_SPORTS_COLOR.DARK, force = false) => {
  if (!content) return ""

  const target = resolveFBSportsUrl({ game_content: content })
  if (!target) return content

  const nextTarget = applyFBSportsColor(target, color, force)
  if (nextTarget === target) return content

  return content.split(target).join(nextTarget)
}

export const isFBSportsLoginMessage = (data: unknown) => {
  return hasTruthyMessageKey(data, "relogin")
}

export const resolveFBSportsChangeUrl = (data: unknown) => {
  if (!data || typeof data !== "object") return ""

  const changeUrl = (data as Record<string, unknown>).changeUrl

  return typeof changeUrl === "string" ? changeUrl : ""
}

export const resolveFBSportsVersion = (data: unknown) => {
  if (!data || typeof data !== "object") return ""

  const version = (data as Record<string, unknown>).version

  return typeof version === "string" || typeof version === "number" ? String(version) : ""
}

const hasTruthyMessageKey = (data: unknown, key: string) => {
  if (!data || typeof data !== "object") return false

  return Boolean((data as Record<string, unknown>)[key])
}
