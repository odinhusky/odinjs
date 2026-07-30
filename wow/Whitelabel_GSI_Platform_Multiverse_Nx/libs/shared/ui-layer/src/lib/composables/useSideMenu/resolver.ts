import type { CmsEntranceItem, CmsLangTitle } from "../../api/commonTypes/cmsTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "../../constants/enums/cmsEntranceType"
import { CMS_WEB_INFORMATION_URL_ID_ENUMS } from "../../constants/enums/cmsWebInformation"
import { Category, CATEGORY_ENUMS, GAME_TYPE_ENUMS } from "../../constants/enums/gameType"
import {
  ROUTE_PATH,
  toCmsCustomPageRoute,
  toGameLobbyRoute,
  toProductLobbyRoute,
  toWebInformationCmsRoute
} from "../../constants/routePath"
import type { SideMenuItem, SideMenuNavigationTarget } from "./types"

const DID_ROUTE_ALIASES: Record<string, string> = {
  // 首頁
  homepage: ROUTE_PATH.HOME,
  // 優惠活動
  promotion: ROUTE_PATH.PROMOTION,
  // 網站說明
  website_information: toWebInformationCmsRoute(CMS_WEB_INFORMATION_URL_ID_ENUMS.ABOUT_US),
  // 會員中心
  membersummary: ROUTE_PATH.MEMBER.SUMMARY,
  member_summary: ROUTE_PATH.MEMBER.SUMMARY,
  // 歷史紀錄
  history: ROUTE_PATH.MEMBER.HISTORY,
  // 站內信
  memberinbox: ROUTE_PATH.MEMBER.MESSAGE,
  member_inbox: ROUTE_PATH.MEMBER.MESSAGE,
  site_message: ROUTE_PATH.MEMBER.MESSAGE,
  // VIP
  membervip: ROUTE_PATH.MEMBER.VIP,
  vip: ROUTE_PATH.MEMBER.VIP,
  member_level: ROUTE_PATH.MEMBER.VIP,
  // 修改密碼
  changepassword: ROUTE_PATH.MEMBER.CHANGE_PASSWORD,
  change_password: ROUTE_PATH.MEMBER.CHANGE_PASSWORD,
  // 個人資料
  basic_information: ROUTE_PATH.MEMBER.PROFILE,
  // 銀行卡
  withdrawal_setting: ROUTE_PATH.MEMBER.BANK_CARD,
  // 錢包（存款/提款）
  deposit: ROUTE_PATH.DEPOSIT,
  withdrawal: ROUTE_PATH.WITHDRAW,
  // 訂單紀錄
  processing_order: ROUTE_PATH.MEMBER.ORDERS,
  // 公告中心
  announcement_center: ROUTE_PATH.ANNOUNCEMENT,
  // 合營代理
  agent_collaboration_strategy: ROUTE_PATH.COLLABORATION,
  // 會員代理（對齊舊專案 set_r017 RouterNameMapping）
  affiliate_detail: ROUTE_PATH.REFERRAL,
  member_strategy: ROUTE_PATH.REFERRAL,
  referral: ROUTE_PATH.REFERRAL,
  referral_rebate: ROUTE_PATH.REFERRAL_REBATE
}

const normalizeGameType = (gameType?: string | number) => {
  const value = Number(gameType)
  if (!Number.isFinite(value)) return undefined
  return value as GAME_TYPE_ENUMS
}

export const ensureExternalLinkProtocol = (link: string) => {
  if (!link) return ""
  if (/^https?:\/\//i.test(link)) return link
  return `https://${link}`
}

export const resolveCategoryLobbyRoute = (gameType?: string | number) => {
  const normalizedGameType = normalizeGameType(gameType)
  if (normalizedGameType === undefined) return ""

  if (Category[normalizedGameType] === CATEGORY_ENUMS.LOBBYOPEN) {
    return toProductLobbyRoute(normalizedGameType)
  }

  return toGameLobbyRoute(normalizedGameType)
}

export const resolveLobbyRoute = (gameType?: string | number, productCode?: string | number) => {
  if (gameType === undefined || gameType === null || String(gameType) === "") return ""
  if (productCode !== undefined && productCode !== null && String(productCode) !== "") {
    return toGameLobbyRoute(gameType, productCode)
  }

  return toGameLobbyRoute(gameType)
}

export const resolveDidRoute = (did?: string) => {
  if (!did) return ""
  const directRoute = ROUTE_PATH.SIDE_MENU_DID[did as keyof typeof ROUTE_PATH.SIDE_MENU_DID]
  if (directRoute) return directRoute

  const normalizedDid = did.trim().toLowerCase()
  return DID_ROUTE_ALIASES[normalizedDid] || ""
}

export const resolveCmsLang = (lang: CmsLangTitle | undefined, locale: string) => {
  if (!lang) return ""

  const normalizedLocale = locale.toLowerCase().replace("_", "-")
  const exact = Object.entries(lang).find(([key]) => key.toLowerCase() === normalizedLocale)?.[1]
  if (exact) return exact

  const prefix = normalizedLocale.split("-")[0]
  const partial = Object.entries(lang).find(([key]) => key.toLowerCase().startsWith(prefix))?.[1]
  if (partial) return partial

  return Object.values(lang).find(Boolean) || ""
}

export const resolveCmsEntranceNavigationTarget = (
  entrance: CmsEntranceItem | undefined
): SideMenuNavigationTarget => {
  if (!entrance) return { to: "", isExternal: false }
  return resolveEntranceNavigationTarget({
    key: "",
    label: "",
    icon: "",
    entrance
  } as SideMenuItem)
}

export const resolveEntranceNavigationTarget = (item: SideMenuItem): SideMenuNavigationTarget => {
  const payload = item.entrance?.payload
  const entranceType = item.entrance?.type

  if (!payload || entranceType === undefined || entranceType === null) {
    return {
      to: item.to || "",
      isExternal: Boolean(item.to?.startsWith("http"))
    }
  }

  switch (entranceType) {
    case CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE:
      return {
        to: resolveDidRoute(payload.did),
        isExternal: false
      }
    case CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY:
      return {
        to: resolveCategoryLobbyRoute(payload.game_type),
        isExternal: false
      }
    case CMS_ENTRANCE_TYPE_ENUMS.CUSTOM_LINK: {
      const link = ensureExternalLinkProtocol(payload.link || "")
      return {
        to: link,
        isExternal: Boolean(link)
      }
    }
    case CMS_ENTRANCE_TYPE_ENUMS.HOMEPAGE_SECTION:
      return {
        to: ROUTE_PATH.HOME,
        isExternal: false
      }
    case CMS_ENTRANCE_TYPE_ENUMS.CUSTOM_PAGE:
      return {
        to: payload.link_id != null ? toCmsCustomPageRoute(payload.link_id) : "",
        isExternal: false
      }
    case CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK:
      return {
        to: resolveLobbyRoute(payload.game_type, payload.product_code),
        isExternal: false
      }
    default: {
      const externalLink = payload.link ? ensureExternalLinkProtocol(payload.link) : ""
      const to =
        item.to ||
        externalLink ||
        resolveDidRoute(payload.did) ||
        resolveLobbyRoute(payload.game_type, payload.product_code)
      return {
        to,
        isExternal: Boolean(externalLink)
      }
    }
  }
}
