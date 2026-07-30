import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"
import { PIXEL_CODE_TYPE } from "src/common/utils/constants"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_r027/layout/Index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_r027/pages/Home.vue"),
        meta: {
          triggerPixelCodes: [PIXEL_CODE_TYPE.Enums.EVENT_HOMEPAGE]
        }
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r027/pages/ProductLobby.vue")
      },
      {
        path: "gameLobby/:integrationId/:gameType/:productCode",
        name: "GameLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r027/pages/GameLobby.vue")
      },
      {
        path: "cmsCustomPage/:cmsCustomPageId",
        name: "CmsCustomPage",
        component: () => import("app/template/set_r027/pages/CmsCustomPage.vue")
      },
      {
        path: "sabaPage",
        name: "SabaPage",
        meta: {
          className: "p-0 h-full",
          hideLiveChat: false,
          needAuth: false
        },
        component: () => import("app/template/set_r027/pages/SabaPage/Index.vue")
      },
      {
        path: "digitainPage",
        name: "DigitainPage",
        meta: {
          className: "p-0 h-full",
          hideLiveChat: true
        },
        component: () => import("app/template/set_r027/pages/DigitainPage/Index.vue")
      },
      {
        path: "/betByPage",
        name: "BetByPage",
        component: () => import("app/template/set_r027/pages/BetByPage/Index.vue"),
        meta: {
          className: "p-0 h-full",
          hideLiveChat: true,
          needAuth: false
        }
      },
      {
        path: "/luckyPage",
        name: "LuckyPage",
        component: () => import("app/template/set_r027/pages/LuckyPage/Index.vue"),
        meta: {
          className: "p-0 h-full",
          hideLiveChat: true,
          needAuth: false
        }
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r027/pages/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r027/pages/Collaboration/Index.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        meta: {
          needAuth: true,
          referralRebateAccess: true
        },
        component: () => import("app/template/set_r027/pages/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_r027/pages/ReferralRebate/Index.vue")
          }
        ]
      },
      {
        path: "/ai_agent",
        name: "AIAgent",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r027/pages/AIAgent/Index.vue")
      },
      {
        path: "/promotion",
        name: "promotion",
        component: () => import("app/template/set_r027/pages/Promotion.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/set_r027/pages/PromotionDetail.vue")
      },
      {
        path: "/promotionDetail/:id",
        name: "PromotionDetail",
        component: () => import("app/template/set_r027/pages/PromotionDetail.vue")
      },
      {
        path: "/webInformationCms/:id",
        name: "webInformation",
        component: () => import("app/template/set_r027/pages/WebInformation.vue")
      },
      {
        path: "forgotPass",
        name: "ForgotPass",
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        component: () => import("app/template/set_r027/pages/ForgotPass/Step1.vue")
      },
      {
        path: "forgotPass/:token",
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        component: () => import("app/template/set_r027/pages/ForgotPass/Step2.vue")
      },
      {
        path: "quickPass/:token/:account?",
        name: "QuickPass",
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        component: () => import("app/template/set_r027/pages/QuickPass/Index.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_r027/layout/Index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "memberCenter",
        component: () => import("app/template/set_r027/pages/Member/Index.vue"),
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        children: [
          {
            path: "",
            name: "memberSummary",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberSummary.vue")
          },
          {
            path: "profile",
            name: "memberProfile",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberProfile.vue")
          },
          {
            path: "vip",
            name: "MemberVip",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberVip.vue")
          },
          {
            path: "deposit",
            name: "MemberDeposit",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberDeposit.vue")
          },
          {
            path: "withdraw",
            name: "MemberWithdraw",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberWithdraw.vue")
          },
          {
            path: "bank",
            name: "memberBank",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberBank.vue")
          },
          {
            path: "bankAdd/:id?",
            name: "memberBankAdd",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberBankAdd.vue")
          },
          {
            path: "order",
            name: "MemberOrder",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberOrder.vue")
          },
          {
            path: "history",
            name: "history",
            component: () => import("app/template/set_r027/pages/Member/MemberHistory.vue")
          },
          {
            path: "inbox",
            name: "memberInbox",
            meta: {
              footerContentClass: ["phone:hidden"]
            },
            component: () => import("app/template/set_r027/pages/Member/MemberInbox.vue")
          }
        ]
      },
      {
        path: "profileCenter",
        name: "memberProfileCenter",
        component: () => import("app/template/set_r027/pages/MemberWithoutNav/Index.vue"),
        meta: {
          footerContentClass: ["phone:hidden"]
        },
        children: [
          {
            path: "detail",
            name: "MemberProfileDetail",
            component: () => import("app/template/set_r027/pages/MemberWithoutNav/MemberProfileDetail.vue")
          },
          {
            path: "loginPassword",
            name: "MemberLoginPassword",
            component: () => import("app/template/set_r027/pages/MemberWithoutNav/MemberLoginPassword.vue")
          },
          {
            path: "withdrawPassword",
            name: "MemberWithdrawPassword",
            component: () => import("app/template/set_r027/pages/MemberWithoutNav/MemberWithdrawPassword.vue")
          }
        ]
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
