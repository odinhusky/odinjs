import type { GameItem } from "@shared-lib/api/commonTypes/gameTypes"

// ── 職責說明：URL 組合器（純計算，無網路狀態）────────────────────────────────
//
// useGetImage 只負責將「相對路徑 + 環境設定」組合成正確的圖片 URL 字串。
// 所有網路行為（圖片是否存在、載入失敗的備援、重試、Blob 轉換）
// 一律由 BaseImage 元件自行處理，此處完全不介入。
//
// 職責分離（Separation of Concerns）：
//   業務邏輯層（useGetImage）：算出正確的圖片 URL
//   渲染層（BaseImage）       ：有效率、不破圖地把 URL 渲染到畫面上
//
// 兩個圖片來源：
//   - IMAGE_BASE（CDN）        env: NUXT_PUBLIC_IMAGE_BASE
//     例: https://wowdata.gsiwl.com/gsi/dev/devm
//     用於：後台手動上傳的圖片（custom_image、square_image）
//
//   - 靜態資源伺服器           env: NUXT_PUBLIC_STATIC_RESOURCE_URL（路徑前綴）
//     例: /statics/staging
//     dev 環境：Vite proxy /statics/* → gsai-dev.gsiwl.com/statics/*
//     preview：localhost 無 proxy 時使用 NUXT_PUBLIC_STATIC_RESOURCE_PROXY_TARGET
//     用於：遊戲縮圖、Tab 圖示等系統產生的靜態素材

export const useGetImage = () => {
  const runtimeConfig = useRuntimeConfig()

  /** IMAGE_BASE（CDN）的根 URL，尾部斜線已移除 */
  const imageBase = computed(() => removeTrailingSlash(String(runtimeConfig.public.imageBase || "")))

  /** 靜態資源路徑前綴，例如 /statics/staging（尾部斜線已移除） */
  const staticResourceUrl = computed(() => removeTrailingSlash(String(runtimeConfig.public.staticResourceUrl || "")))
  const staticResourceProxyTarget = computed(() =>
    removeTrailingSlash(String(runtimeConfig.public.staticResourceProxyTarget || ""))
  )

  /**
   * 將相對路徑組合為靜態資源的完整 URL。
   *
   * 優先順序：
   * 1. 已是絕對 URL（https?://...）→ 直接回傳
   * 2. 空路徑 → 回傳空字串
   * 3. 傳入 origin → origin + path（指定域名，不走靜態資源前綴）
   * 4. 未傳 origin → 靜態資源 base + path
   *    - 開發環境：http://localhost:9000/statics/staging/... → 走 Vite dev proxy
   *    - 生產環境：https://正式域名/statics/staging/...     → 由生產伺服器直接提供
   *    - 本機 preview：http://localhost:3000/...             → 改走 staticResourceProxyTarget
   *
   * 注意：若來源確定是 IMAGE_BASE（如 custom_image），
   *       請直接使用 withBase(imageBase.value, path)，無需透過此函式。
   */
  const getImage = (path: string, origin?: string): string => {
    if (!path) return ""
    if (/^https?:\/\//i.test(path)) return path
    if (origin) return withBase(removeTrailingSlash(origin), path)

    const clientOrigin = process.client ? removeTrailingSlash(window.location.origin) : ""
    const staticBase = resolveStaticResourceBase({
      origin: clientOrigin,
      staticResourceUrl: staticResourceUrl.value,
      staticResourceProxyTarget: staticResourceProxyTarget.value
    })
    return withBase(staticBase, path)
  }

  /**
   * 計算遊戲卡片的縮圖 URL。
   *
   * - custom_image 存在 → IMAGE_BASE + 版本號（後台上傳，確定在 CDN 上）
   * - 一般遊戲圖片    → 靜態資源伺服器路徑（BaseImage 負責載入與備援）
   */
  const getGameImage = (game: GameItem, gameTypeMap: Record<number, { game_type?: string }>): string => {
    if (game.custom_image) {
      // 後台上傳的自訂圖片確定在 IMAGE_BASE，直接拼接並附加版本號（快取破壞）
      return withBase(imageBase.value, withImageVersion(game.custom_image, game.integration_created_at))
    }

    // 必要欄位缺失 → 無法組成圖片路徑
    if (!game.integration_id || !game.product_code || !game.game_code) return ""

    // 優先使用 API 回傳的 game_type 字串（如 "LIVE_CASINO"），與 ProductItem 一致；
    // 若不存在則回退至 gameTypeMap 查詢（game_type_list API 可能回傳不含底線的名稱）
    const gameType = game.game_type || toGameTypeString({ gameType: game.game_type_id, gameTypeMap })

    if (!gameType) return ""

    // 靜態遊戲圖片路徑：/publics/images/games/{廠商ID}/{產品代號}/{遊戲類型}/{遊戲代號}.png
    return getImage(
      `/publics/images/games/${game.integration_id}/${game.product_code}/${gameType}/${game.game_code}.png`
    )
  }

  return { getImage, getGameImage, imageBase }
}
