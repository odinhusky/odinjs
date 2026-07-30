import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

declare module "vue-router" {
  interface RouteMeta {
    /** 此頁面是否需要登入後才能造訪 */
    needAuth?: boolean

    /** 若未登入，則將使用者踢回的 route (未設定則預設踢回 HomePage) */
    goRouteIfNoToken?: string

    /** 進入前需通過 referral rebate 訪問規則（API + is_member_agent） */
    referralRebateAccess?: boolean

    /** okbet 控制外層homePage/index page-layout */
    className?: string

    /** 控制版型 layout 是否隱藏 footer */
    hideFooter?: boolean

    /** 觸發後台pixel codes */
    triggerPixelCodes?: PIXEL_CODE_TYPE.Enums[]

    /** set_r017 CMS footer 的 class */
    footerContentClass?: string[]

    /** set_r017 footer nav 的 class */
    footerNavClass?: string[]
  }
}
