export const ROUTE_PATH = {
  HOME: "/",
  LOGIN: {
    PASSWORD: "/login",
    SMS: "/login/phone"
  },
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgotPassword",
  FORGOT_PASS: "/ForgotPass",
  ANNOUNCEMENT: "/announcement",
  COLLABORATION: "/collaboration",
  ABOUT: "/about",
  WEB_INFORMATION_CMS: "/webInformationCms",
  WALLET: "/wallet",
  DEPOSIT: "/deposit",
  WITHDRAW: "/withdraw",
  REFERRAL: "/referral",
  REFERRAL_REBATE: "/referralRebate",
  PRODUCT_LOBBY: "/productLobby",
  GAME_LOBBY: "/gameLobby",
  PROMOTION: "/promotion",
  CMS_CUSTOM_PAGE: "/cmsCustomPage",
  SIDE_MENU_DID: {
    memberSummary: "/member/summary",
    history: "/member/history",
    memberInbox: "/member/inbox",
    MemberVip: "/member/vip",
    memberVip: "/member/vip"
  },
  MEMBER: {
    SUMMARY: "/member/summary",
    PROFILE: "/member/memberProfile",
    BANK_CARD: "/member/bankCard",
    BANK_CARD_ADD: "/member/bankCardAdd",
    BANK_CARD_EDIT: "/member/bankCardEdit",
    CHANGE_PASSWORD: "/member/changePassword",
    CHANGE_WITHDRAWAL_PASSWORD: "/member/changeWithdrawalPassword",
    HISTORY: "/member/history",
    ORDERS: "/member/orders",
    PENDING_ORDER: "/member/orders",
    MESSAGE: "/member/inbox",
    INBOX: "/member/inbox",
    VIP: "/member/vip",
    INTEREST: "/member/interest",
    REBATE: "/member/rebate",
    MEMBER_MANAGEMENT: "/member/membershipManagement"
  }
} as const

export const toProductLobbyRoute = (gameType: string | number) => `${ROUTE_PATH.PRODUCT_LOBBY}/${gameType}`

export const toCmsCustomPageRoute = (id: string | number) => `${ROUTE_PATH.CMS_CUSTOM_PAGE}/${id}`

export const toWebInformationCmsRoute = (id: string | number) => `${ROUTE_PATH.WEB_INFORMATION_CMS}/${id}`

export const toGameLobbyRoute = (gameType: string | number, productCode?: string | number) =>
  productCode ? `${ROUTE_PATH.GAME_LOBBY}/${gameType}/${productCode}` : `${ROUTE_PATH.GAME_LOBBY}/${gameType}`

export const toForgotPassTokenRoute = (token: string) => `${ROUTE_PATH.FORGOT_PASS}/${token}`

export const toMemberBankCardAddRoute = (id?: string | number) => ROUTE_PATH.MEMBER.BANK_CARD_ADD

export const toMemberBankCardEditRoute = (id: string | number) => `${ROUTE_PATH.MEMBER.BANK_CARD_EDIT}/${id}`

export const SIDE_MENU_DID_ROUTE_PATH = ROUTE_PATH.SIDE_MENU_DID

export const AUTH_ROUTE_GROUPS = {
  GUEST_ONLY_ROUTES: [ROUTE_PATH.LOGIN.PASSWORD, ROUTE_PATH.LOGIN.SMS, ROUTE_PATH.REGISTER, ROUTE_PATH.FORGOT_PASSWORD],
  AUTH_REQUIRED_ROUTES: [
    ROUTE_PATH.DEPOSIT,
    ROUTE_PATH.WITHDRAW,
    ROUTE_PATH.REFERRAL,
    ROUTE_PATH.REFERRAL_REBATE,
    ROUTE_PATH.MEMBER.SUMMARY,
    ROUTE_PATH.MEMBER.HISTORY,
    ROUTE_PATH.MEMBER.ORDERS,
    ROUTE_PATH.MEMBER.MESSAGE,
    ROUTE_PATH.MEMBER.PROFILE,
    ROUTE_PATH.MEMBER.BANK_CARD,
    ROUTE_PATH.MEMBER.BANK_CARD_ADD,
    ROUTE_PATH.MEMBER.BANK_CARD_EDIT,
    ROUTE_PATH.MEMBER.VIP,
    ROUTE_PATH.MEMBER.CHANGE_PASSWORD,
    ROUTE_PATH.MEMBER.CHANGE_WITHDRAWAL_PASSWORD,
    ROUTE_PATH.COLLABORATION,
    ROUTE_PATH.MEMBER.MEMBER_MANAGEMENT
  ]
} as const
