import type * as Response from "src/api/response.type"
import type { QVueGlobals } from "quasar"
import {
  DYNAMIC_IMAGE_DISPLAY_SIZE,
  type DynamicImageTransformParams,
  squareCoverTransform,
} from "src/common/composables/useDynamicImage"
import { CMS_DISPLAY_DEVICE, CMS_ENTRANCE_TYPE, CMS_TYPE } from "src/common/utils/constants"
import { filterUnsupportedCmsItems } from "./filterUnsupportedCmsEntrance"

type BuildImageUrlFn = (path: string, version?: string | number, transform?: DynamicImageTransformParams) => string

const buildSizedImageUrl = (
  buildImageUrl: BuildImageUrlFn,
  path: string,
  version: string | number | undefined,
  size: number
) => buildImageUrl(path, version, squareCoverTransform(size))

const prependImageUrl = (
  langMap: Record<string, string>,
  buildImageUrl: BuildImageUrlFn,
  version: string | number,
  size?: number
): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const lang in langMap) {
    if (langMap[lang]) {
      result[lang] = size
        ? buildSizedImageUrl(buildImageUrl, langMap[lang], version, size)
        : buildImageUrl(langMap[lang], version)
    }
  }
  return result
}

/** 將 `/cms/all` 的 object map 转为陣列，並在每筆附上 `cmsType`。 */
export function flattenCmsAllToRows(allData: Response.CmsAllData | null | undefined): Response.CmsAllFlatRow[] {
  if (!allData) return []
  const rows: Response.CmsAllFlatRow[] = []
  for (const key of Object.keys(allData)) {
    const cmsType = Number(key) as CMS_TYPE.Enums
    if (Number.isNaN(cmsType)) continue
    const bundle = allData[cmsType as keyof Response.CmsAllData]
    if (bundle == null) continue

    if (Array.isArray(bundle)) {
      for (const item of bundle) {
        if (!item || typeof item !== "object") continue
        const cmsItem = item as Response.CmsItem
        rows.push({
          cmsType,
          id: cmsItem.id,
          url_id: cmsItem.url_id,
          Setting: cmsItem.Setting ?? {},
          Entrance: cmsItem.Entrance ?? [],
          Page: cmsItem.Page ?? [],
        })
      }
      continue
    }

    rows.push({ cmsType, ...bundle })
  }
  return rows
}

export function flatRowToCmsItems(row: Response.CmsAllFlatRow): Response.CmsItem[] {
  const { cmsType, Setting, Entrance, Page, id, url_id } = row
  const settingSafe = (Setting ?? {}) as Response.CmsSettingItem
  return [
    {
      id: id ?? cmsType,
      url_id: url_id ?? cmsType,
      Setting: settingSafe,
      Entrance: (Entrance ?? []) as Response.CmsEntranceItem[],
      Page: Page ?? [],
    },
  ]
}

export interface ProcessCmsItemListDeps {
  type: CMS_TYPE.Enums
  VITE_APP_DYNAMIC_RESOURCE_URL: string
  siteKey: string
  $q: QVueGlobals
  buildImageUrl: BuildImageUrlFn
  getGameImageByCustomPage: ReturnType<
    typeof import("src/common/composables/useGame")["useGame"]
  >["getGameImageByCustomPage"]
  getProductSquareImage: ReturnType<typeof import("src/common/composables/useGame")["useGame"]>["getProductSquareImage"]
}

/**
 * Step 1: 正規化單筆 CMS 結構，避免後續每段重複做 null/array 防護。
 * - deep clone: 保證不會汙染呼叫端原始資料
 * - Setting: 至少是可讀寫物件
 * - Entrance: 至少是陣列，方便後續 forEach/map
 */
function normalizeCmsItem(cms: Response.CmsItem): Response.CmsItem {
  // CMS payload 來源是純 JSON 結構；改用 JSON clone 避免 structuredClone 對 Proxy/特殊物件報 warning。
  const clonedCms = JSON.parse(JSON.stringify(cms)) as Response.CmsItem
  if (!clonedCms.Setting) {
    clonedCms.Setting = {} as Response.CmsSettingItem
  }
  if (!Array.isArray(clonedCms.Entrance)) {
    clonedCms.Entrance = []
  }
  return clonedCms
}

/**
 * Step 2: 只處理 CMS Setting 層級的資源網址轉換。
 * 此段不處理 Entrance fallback，不做 type 過濾，專注「把設定資源補成可直接顯示的 URL」。
 */
function decorateCmsAssets(cms: Response.CmsItem, deps: ProcessCmsItemListDeps): Response.CmsItem {
  const { buildImageUrl } = deps

  // 主 icon
  if (cms.Setting.icon_path) {
    cms.Setting.icon_path = buildSizedImageUrl(
      buildImageUrl,
      cms.Setting.icon_path,
      cms.Setting.updated_time,
      DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ICON
    )
  }

  // 選中 icon
  if (cms.Setting.selected_icon_path) {
    cms.Setting.selected_icon_path = buildSizedImageUrl(
      buildImageUrl,
      cms.Setting.selected_icon_path,
      cms.Setting.updated_time,
      DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ICON
    )
  }

  // 首頁形象圖（多語系）
  if (cms.Setting.img_lang) {
    cms.Setting.img_lang = prependImageUrl(cms.Setting.img_lang, buildImageUrl, cms.Setting.updated_time)
  }

  // 聯絡我們 icon（多語系）
  if (cms.Setting.icon_lang) {
    cms.Setting.icon_lang = prependImageUrl(
      cms.Setting.icon_lang,
      buildImageUrl,
      cms.Setting.updated_time,
      DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_FLOAT_ICON
    )
  }

  // 聯絡我們內文圖（多語系）
  if (cms.Setting.contact_img_lang) {
    cms.Setting.contact_img_lang = prependImageUrl(
      cms.Setting.contact_img_lang,
      buildImageUrl,
      cms.Setting.updated_time
    )
  }

  return cms
}

/**
 * Step 3: 處理 Entrance 圖片。
 * 規則：
 * 1) 有 img_path -> 直接補版本化 URL
 * 2) 無 img_path 且為 GAME_LINK -> 依 payload 逐級 fallback 產生圖
 */
function resolveEntranceImage(cms: Response.CmsItem, deps: ProcessCmsItemListDeps): Response.CmsItem {
  const { buildImageUrl, getGameImageByCustomPage, getProductSquareImage, siteKey } = deps

  cms.Entrance.forEach((entrance) => {
    // 後端若已提供圖，優先使用後端圖
    if (entrance.img_path) {
      entrance.img_path = buildSizedImageUrl(
        buildImageUrl,
        entrance.img_path,
        entrance.updated_time || cms.Setting.updated_time,
        DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ENTRANCE
      )
      return
    }

    const gamePayload = entrance.payload
    // 只有 GAME_LINK 會走遊戲圖片 fallback；其他入口類型維持原樣
    if (entrance.type !== CMS_ENTRANCE_TYPE.Enums.GAME_LINK) return
    if (!gamePayload?.product_code || !gamePayload?.game_type) return

    // 最完整資料：可用客製遊戲圖 API
    if (gamePayload?.game_code && gamePayload?.product_integration_id) {
      entrance.img_path = getGameImageByCustomPage({
        game_type: gamePayload.game_type,
        product_integration_id: gamePayload.product_integration_id,
        product_code: gamePayload.product_code,
        game_code: gamePayload.game_code,
      })
      return
    }

    // 次佳資料：組靜態遊戲圖路徑
    if (gamePayload?.game_code) {
      entrance.img_path = getGameImageByCustomPage({
        game_type: gamePayload.game_type,
        product_integration_id: 1,
        product_code: gamePayload.product_code,
        game_code: gamePayload.game_code,
      })
      return
    }

    // 最後 fallback：使用產品方圖
    entrance.img_path = getProductSquareImage({
      updated_at: 0,
      game_type: gamePayload.game_type,
      product_code: gamePayload.product_code,
      siteKey,
    })
  })

  return cms
}

/**
 * Step 4: type-specific 過濾規則。
 * 目前僅 HOME / HOME_INFORMATION_IMAGE / NAVIGATION_BAR 套裝置過濾。
 * 其他 type 一律原樣回傳，避免意外變更行為。
 */
function filterByTypeRules(list: Response.CmsItem[], deps: ProcessCmsItemListDeps): Response.CmsItem[] {
  const { type, $q } = deps
  if (
    type !== CMS_TYPE.Enums.HOME &&
    type !== CMS_TYPE.Enums.HOME_INFORMATION_IMAGE &&
    type !== CMS_TYPE.Enums.NAVIGATION_BAR
  ) {
    return list
  }

  const isMobile = $q.platform.is.mobile
  return list.filter((item) => {
    const displayDevice = item.Setting.payload?.display_device
    // 未設定或「不限制裝置」視為可顯示
    if (displayDevice === undefined || displayDevice === CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS) return true
    // 嚴格排除互斥裝置
    return isMobile
      ? displayDevice !== CMS_DISPLAY_DEVICE.Enums.DESKTOP
      : displayDevice !== CMS_DISPLAY_DEVICE.Enums.MOBILE
  })
}

/**
 * 將 `CmsItem[]` 做與舊版 `/detail/list` 相同的圖片 URL、入口圖、裝置過濾處理。
 */
export function processCmsItemList(list: Response.CmsItem[], deps: ProcessCmsItemListDeps): Response.CmsItem[] {
  // pipeline（行為不變重構版）：
  // normalize -> filter unsupported entrances -> decorate assets -> resolve entrance image -> type filter
  const normalized = list.map(normalizeCmsItem)
  const supportedList = filterUnsupportedCmsItems(normalized)
  const withAssets = supportedList.map((item) => decorateCmsAssets(item, deps))
  const withEntranceImage = withAssets.map((item) => resolveEntranceImage(item, deps))
  return filterByTypeRules(withEntranceImage, deps)
}
