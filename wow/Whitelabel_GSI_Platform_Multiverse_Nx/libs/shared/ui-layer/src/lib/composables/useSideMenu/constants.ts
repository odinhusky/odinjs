import { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { resolveCategoryLobbyRoute } from "./resolver"
import type { SideMenuItem } from "./types"

export const SIDE_MENU_LOGOUT_KEY = "logout"

export const STATIC_MEMBER_ITEMS: SideMenuItem[] = [
  { key: "member-center", label: "會員中心", icon: "mdi:account-circle-outline", to: ROUTE_PATH.MEMBER.SUMMARY },
  { key: "profile", label: "個人資訊", icon: "mdi:account-outline", to: ROUTE_PATH.MEMBER.PROFILE },
  { key: "history", label: "歷史", icon: "mdi:history", to: ROUTE_PATH.MEMBER.HISTORY },
  { key: "pendingOrder", label: "處理中訂單", icon: "mdi:clock-time-eight-outline", to: ROUTE_PATH.MEMBER.ORDERS },
  { key: "message", label: "我的訊息", icon: "mdi:email-outline", to: ROUTE_PATH.MEMBER.MESSAGE },
  { key: "vip", label: "VIP 俱樂部", icon: "mdi:diamond-stone", to: ROUTE_PATH.MEMBER.VIP },
  { key: "interest", label: "優惠活動", icon: "mdi:gift-outline", to: ROUTE_PATH.MEMBER.INTEREST },
  { key: "rebate", label: "利息寶", icon: "mdi:piggy-bank-outline", to: ROUTE_PATH.MEMBER.REBATE },
  { key: "member-change-pass", label: "修改密碼", icon: "mdi:key-outline", to: ROUTE_PATH.MEMBER.CHANGE_PASSWORD },
  { key: SIDE_MENU_LOGOUT_KEY, label: "登出", icon: "mdi:logout" }
]

export const DYNAMIC_ICON_FALLBACK: Record<string, string> = {
  slot: "mdi:slot-machine",
  "live casino": "mdi:cards-playing-spade-multiple-outline",
  fishing: "mdi:fish",
  sports: "mdi:soccer",
  "e-sports": "mdi:gamepad-variant-outline",
  p2p: "mdi:cards-outline",
  "v-sports": "mdi:run-fast",
  lottery: "mdi:ticket-outline",
  cardboard: "mdi:view-grid-outline",
  other: "mdi:dots-grid",
  cockfighting: "mdi:bird",
  luckysport: "mdi:trophy-outline",
  betby: "mdi:alpha-b-circle-outline",
  saba: "mdi:alpha-s-circle-outline"
}

export const DEFAULT_DYNAMIC_ITEMS: SideMenuItem[] = [
  {
    key: "slot",
    label: "Slot",
    icon: "mdi:slot-machine",
    gameType: GAME_TYPE_ENUMS.SLOT,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.SLOT)
  },
  {
    key: "live-casino",
    label: "Live Casino",
    icon: "mdi:cards-playing-spade-multiple-outline",
    gameType: GAME_TYPE_ENUMS.LIVECASINO,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.LIVECASINO)
  },
  {
    key: "fishing",
    label: "Fishing",
    icon: "mdi:fish",
    gameType: GAME_TYPE_ENUMS.FISHING,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.FISHING)
  },
  {
    key: "sports",
    label: "Sports",
    icon: "mdi:soccer",
    gameType: GAME_TYPE_ENUMS.SPORTBOOK,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.SPORTBOOK)
  },
  {
    key: "e-sports",
    label: "E-Sports",
    icon: "mdi:gamepad-variant-outline",
    gameType: GAME_TYPE_ENUMS.ESPORT,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.ESPORT)
  },
  {
    key: "p2p",
    label: "P2P",
    icon: "mdi:cards-outline",
    gameType: GAME_TYPE_ENUMS.P2P,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.P2P)
  },
  {
    key: "v-sports",
    label: "V-Sports",
    icon: "mdi:run-fast",
    gameType: GAME_TYPE_ENUMS.VIRTUALSPORT,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.VIRTUALSPORT)
  },
  {
    key: "lottery",
    label: "Lottery",
    icon: "mdi:ticket-outline",
    gameType: GAME_TYPE_ENUMS.LOTTERY,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.LOTTERY)
  },
  {
    key: "cardboard",
    label: "Cardboard",
    icon: "mdi:view-grid-outline",
    gameType: GAME_TYPE_ENUMS.CARDBOARD,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.CARDBOARD)
  },
  {
    key: "other",
    label: "OTHER",
    icon: "mdi:dots-grid",
    gameType: GAME_TYPE_ENUMS.OTHER,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.OTHER)
  },
  {
    key: "cockfighting",
    label: "Cockfighting",
    icon: "mdi:bird",
    gameType: GAME_TYPE_ENUMS.COCKFIGHTING,
    to: resolveCategoryLobbyRoute(GAME_TYPE_ENUMS.COCKFIGHTING)
  },
  { key: "luckysport", label: "LuckySport", icon: "mdi:trophy-outline", to: ROUTE_PATH.HOME },
  { key: "betby", label: "Betby", icon: "mdi:alpha-b-circle-outline", to: ROUTE_PATH.HOME },
  { key: "saba", label: "SABA", icon: "mdi:alpha-s-circle-outline", to: ROUTE_PATH.HOME }
]
