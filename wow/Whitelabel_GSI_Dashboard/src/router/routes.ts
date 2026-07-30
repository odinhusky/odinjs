import type { RouteRecordRaw } from "vue-router"
import { PERMISSION } from "@/utils/constants"

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/Home",
        component: () => import("pages/Dashboard.vue"),
        meta: {
          breadcrumb: [{ name: "首頁", i18nKey: "menu.home", link: "/Home" }],
          icon: "home",
          menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_HOME_MANAGEMENT],
          group: "home"
        },
        children: [
          {
            path: "/Home",
            name: "Dashboard",
            component: () => import("pages/Dashboard.vue"),
            meta: {
              breadcrumb: [{ name: "首頁", i18nKey: "menu.home", link: "/Home" }],
              icon: "home",
              menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_HOME_SETTING]
            }
          }
        ]
      },
      {
        path: "/AiManagement",
        name: "AiManagement",
        redirect: "/AiManagement/AiMate/",
        meta: {
          breadcrumb: [{ name: "AI功能", i18nKey: "menu.ai_features", link: "/" }],
          icon: "ai",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_AI_MANAGEMENT],
          group: "ai_tools"
        },
        children: [
          {
            path: "/AiManagement/AiMate/",
            component: () => import("pages/AiManagement/AiMate/Setting.vue"),
            meta: {
              breadcrumb: [{ name: "AI Mate設定", i18nKey: "menu.ai_mate_connection", link: "/" }],
              icon: "smart_toy",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AI_MATE_CONNECTION]
            },
            children: [
              {
                path: "Setting",
                name: "AiMateSetting",
                component: () => import("pages/AiManagement/AiMate/Setting.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/AiManagement/AiVoiceBot/",
            component: () => import("pages/AiManagement/AiVoiceBot/Index.vue"),
            redirect: "/AiManagement/AiVoiceBot/TaskList",
            meta: {
              breadcrumb: [{ name: "AI語音助手", i18nKey: "menu.ai_voice_bot", link: "/" }],
              icon: "robot",
              menuShow: ["admin", "agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_AI_VOICE_BOT]
            },
            children: [
              {
                path: "TaskList",
                name: "TaskList",
                component: () => import("pages/AiManagement/AiVoiceBot/List.vue"),
                meta: {}
              },
              {
                path: "SingleCall",
                name: "SingleCall",
                component: () => import("pages/AiManagement/AiVoiceBot/SingleCall.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/AiManagement/AiKol/",
            component: () => import("pages/AiManagement/AiKol/Index.vue"),
            name: "AiKol",
            redirect: "/AiManagement/AiKol/AiKolGenerate",
            meta: {
              breadcrumb: [{ name: "AI KOL", i18nKey: "", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AI_KOL]
            },
            children: [
              {
                path: "AiKolGenerate",
                name: "AiKolGenerate",
                component: () => import("pages/AiManagement/AiKol/Detail/Generate/Index.vue"),
                meta: {}
              },
              {
                path: "MyKols",
                name: "MyKols",
                component: () => import("pages/AiManagement/AiKol/Detail/MyKols/Index.vue"),
                meta: {}
              },
              // {
              //   path: "",
              //   name: "AiKolOverview",
              //   component: () => import("pages/AiManagement/AiKol/Detail/Instagram.vue"),
              //   meta: {}
              // },
              // {
              //   path: "AiKolFb",
              //   name: "AiKolFb",
              //   component: () => import("pages/AiManagement/AiKol/Detail/Facebook.vue"),
              //   meta: {}
              // },
              // {
              //   path: "AiKolTiktok",
              //   name: "AiKolTiktok",
              //   component: () => import("pages/AiManagement/AiKol/Detail/Tiktok.vue"),
              //   meta: {}
              // },
              // {
              //   path: "AiKolTwitter",
              //   name: "AiKolTwitter",
              //   component: () => import("pages/AiManagement/AiKol/Detail/Twitter.vue"),
              //   meta: {}
              // },
              {
                path: "AiKolDetail/:id",
                name: "AiKolDetail",
                component: () => import("pages/AiManagement/AiKol/Detail/Detail.vue"),
                meta: {
                  breadcrumb: [{ name: "", i18nKey: "menu.ai_kol_overview", link: "/" }],
                  backRouteName: "AiKolOverview",
                  disableTabs: true
                }
              },
              {
                path: "AiKolPostGeneration",
                name: "AiKolPostGeneration",
                component: () => import("pages/AiManagement/AiKol/AiKolPostGeneration/Index.vue"),
                meta: {}
              },
              {
                path: "AiKolPostScheduling",
                name: "AiKolPostScheduling",
                component: () => import("pages/AiManagement/AiKol/AiKolPostScheduling/Index.vue"),
                redirect: "/AiManagement/AiKol/AiKolPostScheduling/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/AiManagement/AiKol/AiKolPostScheduling/List.vue"),
                    name: "AiKolPostSchedulingList",
                    meta: {}
                  } /*,
                  {
                    path: "Add",
                    component: () => import("pages/AiManagement/AiKol/AiKolPostScheduling/AddEdit.vue"),
                    name: "AiKolPostSchedulingAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/AiManagement/AiKol/AiKolPostScheduling/AddEdit.vue"),
                    name: "AiKolPostSchedulingEdit",
                    meta: {}
                  }*/
                ]
              },
              {
                path: "AiKolPostList",
                name: "AiKolPostList",
                component: () => import("pages/AiManagement/AiKol/AiKolPostList/Index.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/AiManagement/SocialMarketing/",
            component: () => import("pages/AiManagement/SocialMarketing/Edit.vue"),
            meta: {
              breadcrumb: [{ name: "ADS行銷服務", i18nKey: "AI ADS", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AI_ADS]
            },
            children: [
              {
                path: "SocialMarketingSetting",
                name: "SocialMarketingSetting",
                component: () => import("pages/AiManagement/SocialMarketing/Edit.vue"),
                meta: {}
              }
            ]
          }
        ]
      },

      // {
      //   path: '/Credit',
      //   component: () => import('pages/Credit.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '額度上分審核', link: '/Credit' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Profile',
      //   component: () => import('pages/UserProfile.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '個人資料', link: '/Profile' },
      //     ],
      //   },
      // },
      {
        path: "/AccountManagement",
        redirect: "/AccountManagement/BackofficeAccount",
        meta: {
          breadcrumb: [{ name: "帳號管理", i18nKey: "menu.account_management", link: "/" }],
          icon: "manage",
          menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
          permission: [
            PERMISSION.Enums.S_M_ACCOUNT_MANAGEMENT,
            PERMISSION.Enums.M_M_ACCOUNT_MANAGEMENT,
            PERMISSION.Enums.A_M_ACCOUNT_MANAGEMENT
          ],
          group: "settings"
        },
        children: [
          {
            path: "/AccountManagement/BackofficeAccount",
            component: () => import("pages/AccountManagement/BackofficeAccount/Index.vue"),
            meta: {
              breadcrumb: [{ name: "後台賬號", i18nKey: "menu.backoffice_account", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_BACKOFFICE_ACCOUNT,
                PERMISSION.Enums.M_F_BACKOFFICE_ACCOUNT,
                PERMISSION.Enums.A_F_BACKOFFICE_ACCOUNT
              ],
              name: "BackofficeAccountList"
            },
            children: [
              {
                path: "",
                name: "BackofficeAccountList",
                component: () => import("pages/AccountManagement/BackofficeAccount/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "BackofficeAccountListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AccountManagement/BackofficeAccount/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "BackofficeAccountListAdd",
                component: () => import("pages/AccountManagement/BackofficeAccount/Add/Index.vue"),
                meta: {
                  backRouteName: "BackofficeAccountList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/AccountManagement/PermissionSetting",
            component: () => import("pages/AccountManagement/PermissionSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "權限設定", i18nKey: "menu.permission_setting", link: "/" }],
              icon: "article",
              menuShow: ["admin", "agent", "generalAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_PERMISSION_SETTING,
                PERMISSION.Enums.M_F_PERMISSION_SETTING,
                PERMISSION.Enums.A_F_PERMISSION_SETTING
              ],
              name: "PermissionSettingList"
            },
            children: [
              {
                path: "",
                name: "PermissionSettingList",
                component: () => import("pages/AccountManagement/PermissionSetting/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id/:type",
                name: "PermissionSettingListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AccountManagement/PermissionSetting/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "PermissionSettingListAdd",
                component: () => import("pages/AccountManagement/PermissionSetting/Add.vue"),
                meta: {
                  backRouteName: "PermissionSettingList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/AccountManagement/IpWhiteSettings",
            component: () => import("pages/SystemSettings/IpWhiteSettings/Index.vue"),
            meta: {
              breadcrumb: [{ name: "IP白名單設定", i18nKey: "menu.backend_whitelist_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"], // TODO: 總代隱藏
              permission: [PERMISSION.Enums.M_F_IP_WHITELIST_SETTINGS, PERMISSION.Enums.A_F_IP_WHITELIST_SETTINGS]
            },
            children: [
              {
                path: "",
                name: "IpWhiteList",
                component: () => import("pages/SystemSettings/IpWhiteSettings/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "IpWhiteEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/SystemSettings/IpWhiteSettings/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "IpWhiteListAdd",
                components: {
                  default: () => import("pages/SystemSettings/IpWhiteSettings/Add.vue")
                },
                meta: {}
              }
            ]
          }
        ]
      },
      {
        path: "/MemberManagement",
        redirect: "/MemberManagement/List/",
        name: "MemberManagement",
        meta: {
          breadcrumb: [{ name: "會員管理", i18nKey: "menu.member_management", link: "/" }],
          icon: "member manage",
          menuShow: ["agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_MEMBER_MANAGEMENT],
          group: "member_management"
        },
        children: [
          {
            path: "/MemberManagement/Tag",
            component: () => import("pages/MemberManagement/MemberTag/Index.vue"),
            meta: {
              breadcrumb: [{ name: "會員標籤管理", i18nKey: "menu.member_tag_management", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_TAGS]
            },
            children: [
              {
                path: "",
                name: "MemberTagList",
                component: () => import("pages/MemberManagement/MemberTag/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "MemberTagListEdit",
                components: {
                  default: () => import("pages/MemberManagement/MemberTag/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "MemberTagListAdd",
                components: {
                  default: () => import("pages/MemberManagement/MemberTag/Add.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/MemberManagement/AgentQuota",
            name: "AgentQuota",
            component: () => import("pages/MemberManagement/AgentQuota/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理額度調整", i18nKey: "menu.agent_quota", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_AGENT_QUOTA]
            }
          },
          {
            path: "/MemberManagement/List/",
            component: () => import("pages/MemberManagement/MemberList/Index.vue"),
            name: "MemberManagementList",
            meta: {
              breadcrumb: [{ name: "會員列表", i18nKey: "menu.member_list", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_LIST]
            },
            children: [
              {
                path: "",
                name: "MemberList",
                component: () => import("pages/MemberManagement/MemberList/List.vue"),
                meta: {}
              },
              {
                path: "AddMemberSetting",
                name: "AddMemberSetting",
                component: () => import("pages/MemberManagement/MemberList/Settings/Add/Index.vue"),
                meta: {
                  backRouteName: "MemberList",
                  disableTabs: true
                }
              },
              {
                path: "Edit/:id",
                name: "MemberListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/MemberManagement/MemberList/Edit/Index.vue")
                },
                meta: {
                  backRouteName: "MemberList"
                },
                children: [
                  {
                    path: "",
                    name: "EditMemberInfo",
                    component: () => import("pages/MemberManagement/MemberList/Edit/Info.vue"),
                    meta: {
                      menuShow: ["agent", "anibetAgent", "amusevip"],
                      i18nKey: "menu.member_info"
                    }
                  },
                  {
                    path: "WithdrawSetting",
                    name: "EditWithdrawSetting",
                    component: () => import("pages/MemberManagement/MemberList/Edit/WithdrawSetting.vue"),
                    meta: { menuShow: ["agent", "anibetAgent", "amusevip"], i18nKey: "menu.withdraw_setting" }
                  },
                  {
                    path: "PersonalProfitLoss",
                    name: "EditPersonalProfitLoss",
                    component: () => import("pages/MemberManagement/MemberList/Edit/PersonalProfitLoss.vue"),
                    meta: { menuShow: ["agent", "anibetAgent", "amusevip"], i18nKey: "menu.personal_profit_loss" }
                  },
                  {
                    path: "TransactionReport",
                    name: "EditTransactionReport",
                    component: () => import("pages/MemberManagement/MemberList/Edit/TransactionReport.vue"),
                    meta: { menuShow: ["agent", "anibetAgent", "amusevip"], i18nKey: "menu.transaction_report" }
                  },
                  // {
                  //   path: "CommisionReport",
                  //   name: "EditCommissionReport",
                  //   component: () => import("pages/MemberManagement/MemberList/Edit/CommisionReport/Index.vue"),
                  //   meta: { menuShow: ["agent", "amusevip"], i18nKey: "menu.commision_report" },
                  //   children: [
                  //     {
                  //       path: "",
                  //       name: "CommisionReportList",
                  //       component: () => import("pages/MemberManagement/MemberList/Edit/CommisionReport/List.vue"),
                  //       meta: {}
                  //     },
                  //     {
                  //       path: "Detail",
                  //       name: "EditCommisionReportDetail",
                  //       component: () => import("pages/MemberManagement/MemberList/Edit/CommisionReport/Detail.vue"),
                  //       meta: {
                  //         backRouteName: "CommisionReportList",
                  //         breadcrumb: [{ name: "傭金紀錄", i18nKey: "menu.commision_report", link: "/" }],
                  //         disableTabs: true
                  //       }
                  //     }
                  //   ]
                  // },
                  {
                    path: "BettingReport",
                    name: "EditBettingReport",
                    component: () => import("pages/MemberManagement/MemberList/Edit/BettingReport.vue"),
                    meta: { menuShow: ["agent", "anibetAgent", "amusevip"], i18nKey: "menu.betting_report" }
                  },
                  {
                    path: "Remark",
                    name: "EditRemark",
                    component: () => import("pages/MemberManagement/MemberList/Edit/Remark.vue"),
                    meta: { menuShow: ["agent", "amusevip"], i18nKey: "menu.private_remark" }
                  },
                  {
                    path: "CollaborationDomain",
                    name: "EditCollaborationDomain",
                    component: () => import("pages/MemberManagement/MemberList/Edit/CollaborationDomain.vue"),
                    meta: { menuShow: ["agent"], i18nKey: "menu.collaborationDomain" }
                  },
                  {
                    path: "SessionLog",
                    name: "EditSessionLog",
                    component: () => import("pages/MemberManagement/MemberList/Edit/SessionLog.vue"),
                    meta: { menuShow: ["agent", "anibetAgent", "amusevip"], i18nKey: "menu.session_log" }
                  }
                ]
              }
            ]
          },
          {
            path: "/MemberManagement/Level",
            name: "MemberLevel",
            component: () => import("pages/MemberManagement/MemberLevel/Index.vue"),
            redirect: "/MemberManagement/Level/Settings",
            meta: {
              breadcrumb: [{ name: "會員層級", i18nKey: "menu.member_level", link: "/" }],
              icon: "article",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_LEVEL]
            },
            children: [
              {
                path: "",
                name: "MemberLevelSetting",
                component: () => import("pages/MemberManagement/MemberLevel/Settings/Index.vue"),
                meta: {}
              },
              {
                path: "AddMemberLevelSetting",
                name: "AddMemberLevelSetting",
                component: () => import("pages/MemberManagement/MemberLevel/Settings/Add/Index.vue"),
                meta: {
                  backRouteName: "MemberLevelSetting",
                  disableTabs: true
                }
              },
              {
                path: "EditMemberLevelSetting/:id",
                name: "EditMemberLevelSetting",
                component: () => import("pages/MemberManagement/MemberLevel/Settings/Edit/Index.vue"),
                meta: {
                  backRouteName: "MemberLevelSetting",
                  disableTabs: true
                }
              },
              {
                path: "Modify",
                name: "MemberLevelModify",
                component: () => import("pages/MemberManagement/MemberLevel/Modify.vue"),
                meta: {}
              },
              {
                path: "History",
                name: "MemberLevelHistory",
                component: () => import("pages/MemberManagement/MemberLevel/History/Index.vue"),
                meta: {}
              },
              {
                path: "RewardList",
                name: "MemberLevelRewardList",
                component: () => import("pages/MemberManagement/MemberLevel/RewardList/Index.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/MemberManagement/Quota",
            name: "MemberQuota",
            component: () => import("pages/MemberManagement/MemberQuota/Index.vue"),
            meta: {
              breadcrumb: [{ name: "會員額度調整", i18nKey: "menu.member_quota", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_QUOTA]
            }
          },
          {
            path: "/MemberManagement/KycVerification",
            component: () => import("pages/MemberManagement/KycVerification/Index.vue"),
            meta: {
              breadcrumb: [{ name: "kyc", i18nKey: "menu.kyc_verification", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_KYC]
            },
            children: [
              {
                path: "",
                name: "MemberKycList",
                component: () => import("pages/MemberManagement/KycVerification/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "MemberKycEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/MemberManagement/KycVerification/Edit.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/MemberManagement/AuditAdjustment",
            name: "MemberAuditAdjustment",
            component: () => import("pages/MemberManagement/MemberAuditAdjustment/Index.vue"),
            meta: {
              breadcrumb: [{ name: "會員稽核調整", i18nKey: "member_audit_adjustment", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_AUDIT_ADJUSTMENT]
            }
          }
        ]
      },
      // {
      //   path: '/TicketManagement',
      //   redirect: '/TicketManagement/RealTimeData',
      //   meta: { breadcrumb: [{ name: '工單管理', link: '/' },], icon: 'receipt_long' },
      //   children: [
      //     {
      //       path: '/TicketManagement/RealTimeData',
      //       component: () => import('pages/TicketManagement/RealTimeData/Index.vue'),
      //       meta: { breadcrumb: [{ name: '工單管理', link: '/' }, { name: '即時數據', link: '/TicketManagement/RealTimeData' }], icon: 'insert_chart' },
      //     },
      //     {
      //       path: '/TicketManagement/TicketList',
      //       component: () => import('pages/TicketManagement/TicketList/TicketList.vue'),
      //       meta: { breadcrumb: [{ name: '工單管理', link: '/' }, { name: '工單列表', link: '/TicketManagement/TicketList' }], icon: 'article' },
      //     },
      //   ],
      // },

      {
        path: "/DepositAndwithdrawalManagement",
        redirect: "/DepositAndwithdrawalManagement/DepositList",
        meta: {
          breadcrumb: [{ name: "出入款審核", i18nKey: "menu.deposit_withdrawal_list", link: "/" }],
          icon: "money check",
          menuShow: ["agent", "anibetAgent"],
          permission: [PERMISSION.Enums.A_M_TRANSACTION_MANAGEMENT],
          group: "cash_flow"
        },
        children: [
          {
            path: "/DepositAndwithdrawalManagement/DepositList",
            name: "DepositAndwithdrawalManagementDepositList",
            component: () => import("pages/DepositAndwithdrawalManagement/DepositList.vue"),
            meta: {
              breadcrumb: [{ name: "會員存款", i18nKey: "menu.member_deposit", link: "/" }],
              icon: "description",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_DEPOSIT_VERIFY]
            }
          },
          {
            path: "/DepositAndwithdrawalManagement/List",
            name: "DepositAndwithdrawalManagementList",
            component: () => import("pages/DepositAndwithdrawalManagement/WithdrawalList.vue"),
            meta: {
              breadcrumb: [{ name: "會員出款", i18nKey: "menu.member_withdrawal", link: "/" }],
              icon: "description",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_WITHDRAWAL_VERIFY]
            }
          }
          // {
          //   path: "/DepositAndwithdrawalManagement/DepositReport",
          //   name: "DepositReport",
          //   component: () => import("pages/Reports/DepositReport.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "存款紀錄查詢", i18nKey: "menu.deposit_record_inquiry", link: "/" }],
          //     icon: "monetization_on",
          //     menuShow: ["agent", "anibetAgent"]
          //   }
          // },
          // {
          //   path: "/DepositAndwithdrawalManagement/WithdrawalReport",
          //   name: "WithdrawalReport",
          //   component: () => import("pages/Reports/WithdrawalReport.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "出款紀錄查詢", i18nKey: "menu.withdrawal_record_inquiry", link: "/" }],
          //     icon: "credit_card",
          //     menuShow: ["agent", "anibetAgent"]
          //   }
          // }
        ]
      },

      {
        path: "/Promotion",
        redirect: "/Promotion/Setting",
        meta: {
          breadcrumb: [{ name: "優惠管理", i18nKey: "menu.promotion", link: "/" }],
          icon: "discount",
          menuShow: ["agent", "anibetAgent"],
          permission: [PERMISSION.Enums.A_M_PROMOTION_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/Promotion/Setting",
            component: () => import("pages/Promotion/PromotionSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "優惠設定", i18nKey: "menu.promotion_setting", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_PROMOTION_SETTINGS]
            },
            children: [
              {
                path: "",
                name: "PromotionSettingList",
                component: () => import("pages/Promotion/PromotionSetting/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "PromotionSettingEdit",
                components: {
                  default: () => import("pages/Promotion/PromotionSetting/Edit.vue")
                },
                meta: {
                  backRouteName: "PromotionSettingList",
                  disableTabs: true
                }
              },
              {
                path: "Add",
                name: "PromotionSettingAdd",
                component: () => import("pages/Promotion/PromotionSetting/Add/Index.vue"),
                meta: {
                  backRouteName: "PromotionSettingList",
                  disableTabs: true
                }
              }
            ]
          },

          {
            path: "/Promotion/Review",
            component: () => import("pages/Promotion/PromotionReview.vue"),
            meta: {
              breadcrumb: [{ name: "優惠審核", i18nKey: "menu.promotion_review", link: "/" }],
              icon: "article",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_PROMOTION_VERIFY]
            }
          }
        ]
      },

      {
        path: "/InvitationBonus",
        redirect: "/InvitationBonus/Setting",
        meta: {
          breadcrumb: [{ name: "invitation_bonus", i18nKey: "menu.invitation_bonus", link: "/" }],
          icon: "invitationBonus",
          menuShow: ["agent", "credit"],
          permission: [PERMISSION.Enums.A_M_REFERRAL_SIGNUP_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/InvitationBonus/Setting",
            component: () => import("pages/InvitationBonus/InvitationBonusSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "邀請禮金設定", i18nKey: "menu.invitation_bonus_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REFERRAL_SIGNUP_SETTING]
            },
            children: [
              {
                path: "",
                name: "InvitationBonusSettingList",
                component: () => import("pages/InvitationBonus/InvitationBonusSetting/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "InvitationBonusSettingEdit",
                components: {
                  default: () => import("pages/InvitationBonus/InvitationBonusSetting/Edit.vue")
                },
                meta: {
                  backRouteName: "InvitationBonusSettingList",
                  disableTabs: true
                }
              },
              {
                path: "Add",
                name: "InvitationBonusSettingAdd",
                component: () => import("pages/InvitationBonus/InvitationBonusSetting/Add/Index.vue"),
                meta: {
                  backRouteName: "InvitationBonusSettingList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/InvitationBonus/InvitationBonusDetail",
            component: () => import("pages/InvitationBonus/InvitationBonusDetail/Index.vue"),
            meta: {
              breadcrumb: [{ name: "邀請禮金設定明細", i18nKey: "menu.send_rewards_list", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REFERRAL_SIGNUP_DETAIL]
            },
            children: [
              {
                path: "",
                name: "InvitationBonusDetailList",
                component: () => import("pages/InvitationBonus/InvitationBonusDetail/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:campaign_id/:event_id",
                name: "InvitationBonusDetail",
                component: () => import("pages/InvitationBonus/InvitationBonusDetail/Detail.vue"),
                meta: {
                  backRouteName: "InvitationBonusDetailList",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:campaign_id/:parent_id/:active_member_count",
                name: "InvitationBonusDetailNestedDetail",
                component: () => import("pages/InvitationBonus/InvitationBonusDetail/NestedDetail.vue"),
                meta: {
                  backRouteName: "InvitationBonusDetail",
                  disableTabs: true
                }
              }
            ]
          }
          /*
          {
            path: "/Promotion/Review",
            component: () => import("pages/Promotion/PromotionReview.vue"),
            meta: {
              breadcrumb: [{ name: "優惠審核", i18nKey: "menu.promotion_review", link: "/" }],
              icon: "article",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_PROMOTION_VERIFY]
            }
          }*/
        ]
      },
      {
        path: "/InvitationRoulette",
        redirect: "/InvitationRoulette/List/",
        component: () => import("pages/InvitationRoulette/Index.vue"),
        meta: {
          breadcrumb: [{ name: "邀請輪盤", i18nKey: "menu.invitation_roulette", link: "/InvitationRoulette" }],
          icon: "website_settings",
          menuShow: ["admin", "agent", "anibetAgent"], // 總帶隱藏
          permission: [PERMISSION.Enums.A_M_REFERRAL_WHEEL_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/InvitationRoulette/List/",
            component: () => import("pages/InvitationRoulette/Index.vue"),
            meta: {
              breadcrumb: [{ name: "邀請輪盤", i18nKey: "menu.invitation_roulette", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "generalAgent", "agent", "anibetAgent"],
              permission: [
                PERMISSION.Enums.A_A_REFERRAL_WHEEL_SETTINGS_VIEW,
                PERMISSION.Enums.A_A_REFERRAL_WHEEL_SETTINGS_EDIT,
                PERMISSION.Enums.A_F_REFERRAL_WHEEL_SETTINGS
              ]
            },
            children: [
              {
                path: "",
                name: "InvitationRouletteList",
                component: () => import("pages/InvitationRoulette/List.vue")
              }
            ]
          },
          {
            path: "/InvitationRoulette/Adjustment/",
            component: () => import("pages/InvitationRoulette/Adjustment.vue"),
            meta: {
              breadcrumb: [{ name: "旋轉次數調整", i18nKey: "menu.invitation_roulette_adjustment", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "generalAgent", "agent", "anibetAgent"],
              permission: [
                PERMISSION.Enums.A_A_REFERRAL_WHEEL_SETTINGS_VIEW,
                PERMISSION.Enums.A_A_REFERRAL_WHEEL_SETTINGS_EDIT,
                PERMISSION.Enums.A_F_REFERRAL_WHEEL_SETTINGS
              ]
            },
            children: [
              {
                path: "",
                name: "InvitationRouletteAdjustmentList",
                component: () => import("pages/InvitationRoulette/Adjustment.vue")
              }
            ]
          }
        ]
      },
      {
        path: "/FreeRound",
        redirect: "/FreeRound/List/",
        component: () => import("pages/FreeRound/Index.vue"),
        meta: {
          breadcrumb: [{ name: "免費旋轉", i18nKey: "menu.free_round", link: "/FreeRound" }],
          icon: "website_settings",
          menuShow: ["admin", "agent", "anibetAgent"], // 總帶隱藏
          permission: [PERMISSION.Enums.A_M_FREE_ROUND_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/FreeRound/List/",
            component: () => import("pages/FreeRound/Index.vue"),
            meta: {
              breadcrumb: [{ name: "免費旋轉", i18nKey: "menu.free_round", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "generalAgent", "agent", "anibetAgent"],
              permission: [
                PERMISSION.Enums.A_M_FREE_ROUND_MANAGEMENT,
                PERMISSION.Enums.A_F_FREE_ROUND_SETTING,
                PERMISSION.Enums.A_A_FREE_ROUND_SETTING_EDIT,
                PERMISSION.Enums.A_A_FREE_ROUND_SETTING_VIEW
              ]
            },
            children: [
              {
                path: "",
                name: "FreeRoundList",
                component: () => import("pages/FreeRound/List.vue")
              }
            ]
          },
          {
            path: "/FreeRound/FreeGameReport",
            name: "FreeGameReport",
            component: () => import("pages/Reports/FreeGameReport.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "免費遊戲報表",
                  i18nKey: "menu.free_game_details",
                  link: "/FreeRound/FreeGameReport"
                }
              ],
              icon: "account_balance_wallet",
              // TODO: menuShow、permission
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_FREE_ROUND_REPORT]
            }
          }
        ]
      },
      {
        path: "/GiftDdetails",
        redirect: "/GiftDdetails/List",
        meta: {
          breadcrumb: [{ name: "禮金明細", i18nKey: "menu.gift_details", link: "/" }],
          icon: "gift",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_GIFT],
          group: "promotions"
        },
        children: [
          {
            path: "/GiftDdetails/List",
            component: () => import("pages/GiftDdetails/Index.vue"),
            meta: {
              breadcrumb: [{ name: "禮金明細", i18nKey: "menu.gift_details", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_GIFT_DETAIL]
            },
            children: [
              {
                path: "",
                name: "GiftDdetailsList",
                component: () => import("pages/GiftDdetails/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "GiftDdetails",
                component: () => import("pages/GiftDdetails/Detail.vue"),
                meta: {
                  backRouteName: "GiftDdetails",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },
      {
        path: "/CommissionManagement",
        redirect: "/CommissionManagement/CommissionSetting",
        meta: {
          breadcrumb: [{ name: "佣金管理", i18nKey: "menu.commission_management", link: "/" }],
          icon: "rebate_manage",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_REBATE_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/CommissionManagement/CommissionSetting",
            component: () => import("pages/CommissionManagement/CommissionSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "佣金設定", i18nKey: "menu.commission_setup", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REBATE_SETUP]
            },
            children: [
              {
                path: "",
                name: "CommissionSettingList",
                component: () => import("pages/CommissionManagement/CommissionSetting/List.vue"),
                meta: {}
              },
              {
                path: "Add",
                name: "CommissionSettingAdd",
                component: () => import("pages/CommissionManagement/CommissionSetting/Add.vue"),
                meta: {
                  backRouteName: "CommissionSettingList"
                }
              },
              {
                path: "Edit/:id",
                name: "CommissionSettingEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/CommissionManagement/CommissionSetting/Edit.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/CommissionManagement/CommissionDetail",
            component: () => import("pages/CommissionManagement/CommissionDetail/Index.vue"),
            meta: {
              breadcrumb: [{ name: "佣金明细", i18nKey: "menu.commission_detail", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REBATE_DETAIL]
            },
            children: [
              {
                path: "",
                name: "CommissionDetailList",
                component: () => import("pages/CommissionManagement/CommissionDetail/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "CommissionDetail",
                component: () => import("pages/CommissionManagement/CommissionDetail/Detail.vue"),
                meta: {
                  backRouteName: "CommissionDetail",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },

      {
        path: "/InterestTreasure",
        redirect: "/InterestTreasure/List",
        meta: {
          breadcrumb: [{ name: "利息寶", i18nKey: "menu.interest_treasure", link: "/" }],
          icon: "bank",
          menuShow: ["agent", "credit"],
          permission: [PERMISSION.Enums.A_M_INTEREST_MANAGEMENT],
          group: "promotions"
        },
        children: [
          {
            path: "/InterestTreasure/List",
            component: () => import("pages/InterestTreasure/Index.vue"),
            meta: {
              breadcrumb: [{ name: "利息寶", i18nKey: "menu.interest_treasure", link: "/" }],
              icon: "bank",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_INTEREST_ACTIVITY_SETTING]
            },
            children: [
              {
                path: "",
                name: "InterestTreasureList",
                component: () => import("pages/InterestTreasure/List.vue"),
                meta: {}
              },
              {
                path: "Add",
                name: "InterestTreasureAdd",
                component: () => import("pages/InterestTreasure/Add.vue"),
                meta: {
                  backRouteName: "InterestTreasureList"
                }
              },
              {
                path: "Edit/:id",
                name: "InterestTreasureEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/InterestTreasure/Edit.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/InterestTreasure/AuditChecklist",
            component: () => import("pages/InterestTreasure/AuditChecklist/Index.vue"),
            meta: {
              breadcrumb: [{ name: "審核清單", i18nKey: "menu.audit_checklist", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_INTEREST_REVIEW]
            },
            children: [
              {
                path: "",
                name: "InterestTreasureAuditChecklistList",
                component: () => import("pages/InterestTreasure/AuditChecklist/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "InterestTreasureAuditChecklistDetail",
                component: () => import("pages/InterestTreasure/AuditChecklist/Detail.vue"),
                meta: {
                  backRouteName: "InterestTreasureAuditChecklistList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/InterestTreasure/InterestTreasureRecord",
            component: () => import("pages/InterestTreasure/InterestTreasureRecord/Index.vue"),
            meta: {
              breadcrumb: [{ name: "利息寶紀錄", i18nKey: "menu.Interest_treasure_record", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_INTEREST_RECORD]
            },
            children: [
              {
                path: "",
                name: "InterestTreasureInterestTreasureRecordList",
                component: () => import("pages/InterestTreasure/InterestTreasureRecord/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "InterestTreasureInterestTreasureRecordDetail",
                component: () => import("pages/InterestTreasure/InterestTreasureRecord/Detail.vue"),
                meta: {
                  backRouteName: "InterestTreasureInterestTreasureRecordList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/InterestTreasure/InterestTreasureDescription",
            component: () => import("pages/InterestTreasure/InterestTreasureDescription/Index.vue"),
            meta: {
              breadcrumb: [{ name: "廣宣與說明設定", i18nKey: "menu.advertising_and_description_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_INTEREST_DESCRIPTION]
            },
            children: [
              {
                path: "",
                name: "InterestTreasureInterestTreasureDescription",
                component: () => import("pages/InterestTreasure/InterestTreasureDescription/Index.vue"),
                meta: {}
              }
            ]
          }
        ]
      },

      {
        path: "/Jackpot",
        name: "Jackpot",
        redirect: "/Jackpot/Management",
        meta: {
          breadcrumb: [{ name: "JACKPOT", i18nKey: "menu.jackpot", link: "/Jackpot" }],
          icon: "gift",
          menuShow: ["agent"],
          group: "promotions",
          permission: [PERMISSION.Enums.A_M_JACKPOT_MANAGEMENT]
        },
        children: [
          {
            path: "Management",
            name: "JackpotManagement",
            component: () => import("pages/Jackpot/Management/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "JACKPOT Configuration",
                  i18nKey: "menu.jackpot_configuration",
                  link: "/Jackpot/Management"
                }
              ],
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_JACKPOT_CONFIGURATION]
            }
          },
          {
            path: "WinningRecords",
            name: "JackpotWinningRecords",
            component: () => import("pages/Jackpot/WinningRecords/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "JACKPOT Winning Records",
                  i18nKey: "menu.jackpot_winning_records",
                  link: "/Jackpot/WinningRecords"
                }
              ],
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_JACKPOT_WINNING_RECORDS]
            }
          }
        ]
      },
      {
        path: "/AgentMemberManagement",
        redirect: "/AgentMemberManagement/AgentMemberCommissionSetting",
        meta: {
          breadcrumb: [{ name: "會員代理", i18nKey: "menu.agent_member_management", link: "/" }],
          icon: "agent_member_manage",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_AFFILIATE_MANAGEMENT],
          group: "affiliate"
        },
        children: [
          {
            path: "/AgentMemberManagement/AgentMemberCommissionSetting",
            component: () => import("pages/AgentMemberManagement/AgentMemberCommissionSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理佣金設定", i18nKey: "menu.agent_member_commission_setting", link: "/" }],
              icon: "description",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AFFILIATE_SETUP]
            },
            children: [
              {
                path: "",
                name: "AgentMemberCommissionSettingList",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissionSetting/List.vue"),
                meta: {}
              },

              {
                path: "Detail/:commission_id",
                name: "AgentMemberCommissionSettingDetail",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissionSetting/Detail/Index.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissionSettingList",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:commission_id/:account",
                name: "AgentMemberCommissionSettingNestedDetail",
                component: () =>
                  import("pages/AgentMemberManagement/AgentMemberCommissionSetting/Detail/NestedDetail.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissionSettingList",
                  disableTabs: true
                }
              },
              {
                path: "Edit/:id",
                name: "AgentMemberCommissionSettingEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgentMemberManagement/AgentMemberCommissionSetting/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "AgentMemberCommissionSettingAdd",
                component: () =>
                  import("pages/AgentMemberManagement/AgentMemberCommissionSetting/Settings/Add/Index.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissionSettingList",
                  disableTabs: true
                }
              }
            ]
          },
          // {
          //   path: "/AgentMemberManagement/AgentMemberCommissionReview",
          //   component: () => import("pages/AgentMemberManagement/AgentMemberCommissionReview/Index.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "代理佣金審核", i18nKey: "menu.agency_commission_review", link: "/" }],
          //     icon: "description",
          //     menuShow: ["agent"]
          //   },
          //   children: [
          //     {
          //       path: "",
          //       name: "AgentMemberCommissionReviewList",
          //       component: () => import("pages/AgentMemberManagement/AgentMemberCommissionReview/List.vue"),
          //       meta: {}
          //     },
          //     {
          //       path: "Detail",
          //       name: "AgentMemberCommissionReviewDetail",
          //       component: () => import("pages/AgentMemberManagement/AgentMemberCommissionReview/Detail/Index.vue"),
          //       meta: {
          //         backRouteName: "AgentMemberCommissionReviewList",
          //         disableTabs: true
          //       }
          //     }
          //   ]
          // },
          {
            path: "/AgentMemberManagement/AgentMemberCommissioDetail",
            component: () => import("pages/AgentMemberManagement/AgentMemberCommissioDetail/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理佣金明細", i18nKey: "menu.agency_commission_detail", link: "/" }],
              icon: "description",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AFFILIATE_DETAIL]
            },
            children: [
              {
                path: "",
                name: "AgentMemberCommissioDetailList",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissioDetail/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:statement_id/:commission_id",
                name: "AgentMemberCommissioDetailDetail",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissioDetail/Detail/Index.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissioDetailList",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:statement_id/:account",
                name: "AgentMemberCommissioDetailNestedDetail",
                component: () =>
                  import("pages/AgentMemberManagement/AgentMemberCommissioDetail/Detail/NestedDetail.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissioDetailList",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/AgentMemberManagement/AgentMemberCommissioReport",
            component: () => import("pages/AgentMemberManagement/AgentMemberCommissioReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理佣金報表", i18nKey: "menu.agency_commission_report", link: "/" }],
              icon: "description",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_AFFILIATE_REPORT]
            },
            children: [
              {
                path: "",
                name: "AgentMemberCommissioReportList",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissioReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:commission_id",
                name: "AgentMemberCommissioReportDetail",
                component: () => import("pages/AgentMemberManagement/AgentMemberCommissioReport/Detail/Index.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissioReportList",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:commission_id/:member_id",
                name: "AgentMemberCommissioReportNestedDetail",
                component: () =>
                  import("pages/AgentMemberManagement/AgentMemberCommissioReport/Detail/NestedDetail.vue"),
                meta: {
                  backRouteName: "AgentMemberCommissioReportList",
                  disableTabs: true
                }
              }
            ]
          }

          //{
          //  path: "/AgentMemberManagement/DepositList",
          //  name: "DepositAndwithdrawalManagementDepositList",
          //  component: () => import("pages/AgentMemberManagement/DepositList.vue"),
          //  meta: {
          //    breadcrumb: [{ name: "佣金報表", i18nKey: "menu.commission_report", link: "/" }],
          //    icon: "description",
          //    menuShow: ["agent"]
          //  }
          //}
        ]
      },
      {
        path: "/ReferralCommissionManagement",
        redirect: "/ReferralCommissionManagement/CommissionSetting",
        meta: {
          breadcrumb: [{ name: "上級返佣", i18nKey: "menu.referral_commission_management", link: "/" }],
          icon: "referral_rebate_manage",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_REFERRAL_REBATE_MANAGEMENT],
          group: "affiliate"
        },
        children: [
          {
            path: "/ReferralCommissionManagement/CommissionSetting",
            component: () => import("pages/ReferralCommissionManagement/CommissionSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "上級返佣設定", i18nKey: "menu.referral_commission_setup", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REFERRAL_REBATE_SETUP]
            },
            children: [
              {
                path: "",
                name: "ReferralCommissionSettingEdit",
                component: () => import("pages/ReferralCommissionManagement/CommissionSetting/Edit.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/ReferralCommissionManagement/CommissionDetail",
            component: () => import("pages/ReferralCommissionManagement/CommissionDetail/Index.vue"),
            meta: {
              breadcrumb: [{ name: "上級佣金明细", i18nKey: "menu.referral_commission_detail", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_REFERRAL_REBATE_DETAIL]
            },
            children: [
              {
                path: "",
                name: "ReferralCommissionDetailList",
                component: () => import("pages/ReferralCommissionManagement/CommissionDetail/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "ReferralCommissionDetail",
                component: () => import("pages/ReferralCommissionManagement/CommissionDetail/Detail.vue"),
                meta: {
                  backRouteName: "ReferralCommissionDetail",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:event_id/:entry_id",
                name: "ReferralCommissionNestedDetail",
                component: () => import("pages/ReferralCommissionManagement/CommissionDetail/NestedDetail.vue"),
                meta: {
                  backRouteName: "ReferralCommissionDetail",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },
      {
        path: "/ShareholdersProxy",
        redirect: "/ShareholdersProxy/ShareholdersSetting",
        meta: {
          breadcrumb: [{ name: "股東代理", i18nKey: "menu.shareholder_proxy", link: "/" }],
          icon: "shareholders",
          menuShow: ["agent", "credit"],
          permission: [PERMISSION.Enums.A_M_SHAREHOLDER_MANAGEMENT],
          group: "affiliate"
        },
        children: [
          {
            path: "/ShareholdersProxy/ShareholdersDetail",
            component: () => import("pages/ShareholdersProxy/ShareholdersDetail/Index.vue"),
            meta: {
              breadcrumb: [{ name: "佣金明細", i18nKey: "menu.commission_details", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_SHAREHOLDER_DETAIL]
            },
            children: [
              {
                path: "",
                name: "ShareholdersDetailList",
                component: () => import("pages/ShareholdersProxy/ShareholdersDetail/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:id",
                name: "ShareholdersDetail",
                component: () => import("pages/ShareholdersProxy/ShareholdersDetail/Detail.vue"),
                meta: {
                  backRouteName: "ShareholdersDetail",
                  disableTabs: true
                }
              },
              {
                path: "NestedDetail/:event_id/:entry_id",
                name: "ShareholdersDetailNestedDetail",
                component: () => import("pages/ShareholdersProxy/ShareholdersDetail/NestedDetail.vue"),
                meta: {
                  backRouteName: "ShareholdersDetail",
                  disableTabs: true
                }
              }
            ]
          },
          {
            path: "/ShareholdersProxy/ShareholdersAccountSetting",
            component: () => import("pages/ShareholdersProxy/ShareholdersAccountSetting/List.vue"),
            meta: {
              breadcrumb: [{ name: "帳號設定", i18nKey: "menu.account_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_SHAREHOLDER_PARTICIPANT]
            },
            children: [
              {
                path: "",
                name: "ShareholdersAccountSettingList",
                component: () => import("pages/ShareholdersProxy/ShareholdersAccountSetting/List.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/ShareholdersProxy/ShareholdersSetting",
            component: () => import("pages/ShareholdersProxy/ShareholdersSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "佔成設定", i18nKey: "menu.commission_rate_setting", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_SHAREHOLDER_SETUP]
            },
            children: [
              {
                path: "",
                name: "ShareholdersProxyEdit",
                component: () => import("pages/ShareholdersProxy/ShareholdersSetting/Edit.vue"),
                meta: {}
              }
            ]
          }
        ]
      },
      {
        path: "/Collaboration",
        redirect: "/Collaboration/Setting",
        meta: {
          breadcrumb: [{ name: "合營代理", i18nKey: "menu.collaboration_management", link: "/" }],
          icon: "collaboration",
          menuShow: ["agent", "credit"],
          permission: [PERMISSION.Enums.A_M_COLLABORATION],
          group: "affiliate"
        },
        children: [
          {
            path: "/Collaboration/Setting",
            component: () => import("pages/Collaboration/CollaborationSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "合營計畫設定", i18nKey: "menu.collaboration_setting", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_COLLABORATION_SETTING]
            },
            children: [
              {
                path: "",
                name: "CollaborationSettingEdit",
                component: () => import("pages/Collaboration/CollaborationSetting/Edit.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/Collaboration/Review",
            component: () => import("pages/Collaboration/CollaborationReview/Index.vue"),
            meta: {
              breadcrumb: [{ name: "合營計畫詳細", i18nKey: "menu.collaboration_detail", link: "/" }],
              icon: "description",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_COLLABORATION_SETTLEMENT_DETAIL]
            },
            children: [
              {
                path: "",
                name: "CollaborationReviewList",
                component: () => import("pages/Collaboration/CollaborationReview/List.vue"),
                meta: {}
              },

              {
                path: "Detail/:id",
                name: "CollaborationReviewDetail",
                component: () => import("pages/Collaboration/CollaborationReview/Detail.vue"),
                meta: {
                  backRouteName: "CollaborationReviewDetail",
                  disableTabs: true
                }
              }
            ]
          }
          // 隱藏派發後的明細
          // {
          //   path: "/Collaboration/Detail",
          //   component: () => import("pages/Collaboration/CollaborationDetail/Index.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "合營計畫明細", i18nKey: "menu.collaboration_detail", link: "/" }],
          //     icon: "description",
          //     menuShow: ["agent"],
          //     permission: [PERMISSION.Enums.A_F_COLLABORATION_SETTLEMENT_DETAIL]
          //   },
          //   children: [
          //     {
          //       path: "",
          //       name: "CollaborationDetailList",
          //       component: () => import("pages/Collaboration/CollaborationDetail/List.vue"),
          //       meta: {}
          //     },

          //     {
          //       path: "Detail/:id",
          //       name: "CollaborationDetail",
          //       component: () => import("pages/Collaboration/CollaborationDetail/Detail.vue"),
          //       meta: {
          //         backRouteName: "CollaborationDetail",
          //         disableTabs: true
          //       }
          //     }
          //   ]
          // }
          /*{
            path: "/Collaboration/Detail",
            component: () => import("pages/Collaboration/CollaborationReview.vue"),
            meta: {
              breadcrumb: [{ name: "合營計畫明細", i18nKey: "menu.collaboration_detail", link: "/" }],
              icon: "article",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_PROMOTION_VERIFY]
            }
          }*/
        ]
      },
      {
        path: "/SystemSettings",
        redirect: "/SystemSettings/AlertSettings",
        meta: {
          breadcrumb: [{ name: "告警管理", i18nKey: "permission_menu.alert_management", link: "/" }],
          icon: "system_settings",
          menuShow: ["agent", "anibetAgent", "amusevip"], // TODO: 總代隱藏
          permission: [PERMISSION.Enums.M_M_SYSTEM_MANAGEMENT, PERMISSION.Enums.A_M_SYSTEM_MANAGEMENT],
          group: "settings"
        },
        children: [
          {
            path: "/SystemSettings/AlertSettings",
            meta: {
              breadcrumb: [{ name: "告警設定", i18nKey: "menu.alert_settings", link: "/" }],
              icon: "warning_setting",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_WARNING_SETTINGS]
            },
            children: [
              {
                path: "",
                name: "AlertSettingsList",
                component: () => import("pages/MessageCenter/AlertSettings/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "AlertSettingsEdit",
                components: {
                  default: () => import("pages/MessageCenter/AlertSettings/AddEdit.vue")
                },
                meta: {
                  backRouteName: "AlertSettingsList",
                  disableTabs: true
                }
              },
              {
                path: "Add",
                name: "AlertSettingsAdd",
                component: () => import("pages/MessageCenter/AlertSettings/AddEdit.vue"),
                meta: {
                  backRouteName: "AlertSettingsList",
                  disableTabs: true
                }
              },
              {
                path: "Detail/:id",
                name: "AlertSettingsDetail",
                component: () => import("pages/MessageCenter/AlertSettings/Detail.vue"),
                meta: {
                  backRouteName: "AlertSettingsList"
                }
              }
            ]
          },
          {
            path: "/SystemSettings/MonitoringSettings",
            component: () => import("pages/MessageCenter/MonitoringSettings/MonitoringSettings.vue"),
            meta: {
              breadcrumb: [
                { name: "監控設定", i18nKey: "menu.monitoring_settings", link: "/SystemSettings/MonitoringSettings" }
              ],
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_MONITORING_SETTINGS]
            }
          },
          {
            path: "/SystemSettings/NotificationRecord",
            component: () => import("pages/MessageCenter/NotificationRecord/NotificationRecord.vue"),
            meta: {
              breadcrumb: [
                { name: "通知記錄", i18nKey: "menu.notification_record", link: "/SystemSettings/NotificationRecord" }
              ],
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_NOTIFICATION_RECORD]
            }
          }
        ]
      },
      {
        path: "/WebsiteSettings",
        redirect: "/WebsiteSettings/BannerSettings",
        meta: {
          breadcrumb: [{ name: "版面設定", i18nKey: "menu.layout_settings", link: "/" }],
          icon: "website_settings",
          menuShow: ["agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_LAYOUT_SETTINGS],
          group: "cms"
        },
        children: [
          {
            path: "/WebsiteSettings/BannerSettings",
            name: "BannerSettings",
            component: () => import("pages/WebsiteSettings/BannerSettings/Index.vue"),
            redirect: "/WebsiteSettings/BannerSettings/Home",
            meta: {
              breadcrumb: [
                { name: "banner設定", i18nKey: "menu.banner_settings", link: "/WebsiteSettings/BannerSettings/Home" }
              ],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_BANNER_SETTINGS]
            },
            children: [
              {
                path: "Home",
                name: "Home",
                component: () => import("pages/WebsiteSettings/BannerSettings/PcHome.vue"),
                meta: {}
              },
              /*
              {
                path: "MobileHome",
                name: "MobileHome",
                component: () => import("pages/WebsiteSettings/BannerSettings/component/BannerTable.vue"),
                meta: {}
              },*/
              {
                path: "ProductLobby/:gameType?",
                name: "ProductLobby",
                component: () => import("pages/WebsiteSettings/BannerSettings/ProductLobby.vue"),
                meta: {}
              },
              {
                path: "GameLobby/:gameType?/:supplierType?",
                name: "GameLobby",
                component: () => import("pages/WebsiteSettings/BannerSettings/GameLobby.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/WebsiteSettings/Cms",
            name: "Cms",
            component: () => import("pages/WebsiteSettings/Cms/Index.vue"),
            redirect: "/WebsiteSettings/Cms/CustomPage/List",
            meta: {
              breadcrumb: [{ name: "Cms", i18nKey: "menu.page_management", link: "/WebsiteSettings/Cms/CustomPage" }],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_CMS_SETTINGS],
              group: "cms"
            },
            children: [
              {
                path: "CustomPage",
                name: "CmsCustomPage",
                component: () => import("pages/WebsiteSettings/Cms/CustomPage/Index.vue"),
                redirect: "/WebsiteSettings/Cms/CustomPage/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/CustomPage/List.vue"),
                    name: "CmsCustomPageList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/CustomPage/AddEdit.vue"),
                    name: "CmsCustomPageAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/CustomPage/AddEdit.vue"),
                    name: "CmsCustomPageEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "Home",
                name: "CmsHome",
                component: () => import("pages/WebsiteSettings/Cms/Home/Index.vue"),
                redirect: "/WebsiteSettings/Cms/Home/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/Home/List.vue"),
                    name: "CmsHomeList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/Home/AddEdit.vue"),
                    name: "CmsHomeAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/Home/AddEdit.vue"),
                    name: "CmsHomeEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "GcashHome",
                name: "CmsGcashHome",
                component: () => import("pages/WebsiteSettings/Cms/GcashHome/Index.vue"),
                redirect: "/WebsiteSettings/Cms/GcashHome/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/GcashHome/List.vue"),
                    name: "GcashHomeList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/GcashHome/AddEdit.vue"),
                    name: "GcashHomeAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/GcashHome/AddEdit.vue"),
                    name: "GcashHomeEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "NavigationBar",
                name: "CmsNavigationBar",
                component: () => import("pages/WebsiteSettings/Cms/NavigationBar/Index.vue"),
                redirect: "/WebsiteSettings/Cms/NavigationBar/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/NavigationBar/List.vue"),
                    name: "CmsNavigationBarList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/NavigationBar/AddEdit.vue"),
                    name: "CmsNavigationBarAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/NavigationBar/AddEdit.vue"),
                    name: "CmsNavigationBarEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "Menu",
                name: "CmsMenu",
                component: () => import("pages/WebsiteSettings/Cms/Menu/Index.vue"),
                redirect: "/WebsiteSettings/Cms/Menu/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/Menu/List.vue"),
                    name: "CmsMenuList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/Menu/AddEdit.vue"),
                    name: "CmsMenuAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/Menu/AddEdit.vue"),
                    name: "CmsMenuEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "H5FooterMenu",
                name: "CmsH5FooterMenu",
                component: () => import("pages/WebsiteSettings/Cms/H5FooterMenu/Index.vue"),
                redirect: "/WebsiteSettings/Cms/H5FooterMenu/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/H5FooterMenu/List.vue"),
                    name: "CmsH5FooterMenuList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/H5FooterMenu/AddEdit.vue"),
                    name: "CmsH5FooterMenuAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/H5FooterMenu/AddEdit.vue"),
                    name: "CmsH5FooterMenuEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "WebIntroduction",
                name: "CmsWebIntroduction",
                component: () => import("pages/WebsiteSettings/Cms/WebIntroduction/Index.vue"),
                redirect: "/WebsiteSettings/Cms/WebIntroduction/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/WebIntroduction/List.vue"),
                    name: "CmsWebIntroductionList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/WebIntroduction/AddEdit.vue"),
                    name: "CmsWebIntroductionAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/WebIntroduction/AddEdit.vue"),
                    name: "CmsWebIntroductionEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "FooterSetting",
                name: "CmsFooterSetting",
                component: () => import("pages/WebsiteSettings/Cms/FooterSetting.vue"),
                meta: {}
              },
              {
                path: "IndexPageImage",
                name: "CmsIndexPageImage",
                component: () => import("pages/WebsiteSettings/Cms/IndexPageImage/Index.vue"),
                redirect: "/WebsiteSettings/Cms/IndexPageImage/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/IndexPageImage/List.vue"),
                    name: "CmsIndexPageImageList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/IndexPageImage/AddEdit.vue"),
                    name: "CmsIndexPageImageAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/IndexPageImage/AddEdit.vue"),
                    name: "CmsIndexPageImageEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "FloatingIcon",
                name: "CmsFloatingIcon",
                component: () => import("pages/WebsiteSettings/Cms/FloatingIcon/Index.vue"),
                redirect: "/WebsiteSettings/Cms/FloatingIcon/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/FloatingIcon/List.vue"),
                    name: "CmsFloatingIconList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/FloatingIcon/AddEdit.vue"),
                    name: "CmsFloatingIconAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/FloatingIcon/AddEdit.vue"),
                    name: "CmsFloatingIconEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "ContactUs",
                name: "CmsContactUs",
                component: () => import("pages/WebsiteSettings/Cms/ContactUs/Index.vue"),
                redirect: "/WebsiteSettings/Cms/ContactUs/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/ContactUs/List.vue"),
                    name: "CmsContactUsList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/ContactUs/AddEdit.vue"),
                    name: "CmsContactUsAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/ContactUs/AddEdit.vue"),
                    name: "CmsContactUsEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "PopManagement",
                name: "CmsPop",
                component: () => import("pages/WebsiteSettings/Cms/PopManagement/Index.vue"),
                redirect: "/WebsiteSettings/Cms/PopManagement/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/PopManagement/List.vue"),
                    name: "CmsPopList",
                    meta: {}
                  },
                  {
                    path: "Add/:mode/:id",
                    component: () => import("pages/WebsiteSettings/Cms/PopManagement/AddEdit.vue"),
                    name: "CmsPopAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:mode/:id",
                    component: () => import("pages/WebsiteSettings/Cms/PopManagement/AddEdit.vue"),
                    name: "CmsPopEdit",
                    meta: {}
                  }
                ]
              },
              {
                path: "GameTypeManagement",
                name: "CmsGameTypeManagement",
                component: () => import("pages/WebsiteSettings/Cms/GameTypeManagement/Index.vue"),
                redirect: "/WebsiteSettings/Cms/GameTypeManagement/List",
                meta: {},
                children: [
                  {
                    path: "List",
                    component: () => import("pages/WebsiteSettings/Cms/GameTypeManagement/List.vue"),
                    name: "CmsGameTypeList",
                    meta: {}
                  },
                  {
                    path: "Add",
                    component: () => import("pages/WebsiteSettings/Cms/GameTypeManagement/AddEdit.vue"),
                    name: "CmsGameTypeAdd",
                    meta: {}
                  },
                  {
                    path: "Edit/:id",
                    component: () => import("pages/WebsiteSettings/Cms/GameTypeManagement/AddEdit.vue"),
                    name: "CmsGameTypeEdit",
                    meta: {}
                  }
                ]
              }
            ]
          },
          {
            path: "/WebsiteSettings/ProductEntranceMap/:gameType?",
            name: "ProductEntranceMap",
            component: () => import("pages/WebsiteSettings/ProductEntranceMap/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "產品入口圖設置",
                  i18nKey: "menu.product_entrance_picture_settings",
                  link: "/WebsiteSettings/ProductEntranceMap"
                }
              ],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_PRODUCT_ENTRANCE_SETTINGS]
            }
          },
          {
            path: "/WebsiteSettings/PopularGamesSort/:gameType?",
            name: "PopularGamesSort",
            component: () => import("pages/WebsiteSettings/PopularGamesSort/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "熱門遊戲排序",
                  i18nKey: "menu.popular_games_sort",
                  link: "/WebsiteSettings/PopularGamesSort"
                }
              ],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_POPULAR_GAME_SORT]
            }
          },
          {
            path: "/WebsiteSettings/HomePagePopularSLOTSSorting",
            name: "HomePagePopularSLOTSSorting",
            component: () => import("pages/WebsiteSettings/HomePagePopularSLOTSSorting/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "首頁熱門SLOTS排序",
                  i18nKey: "menu.home_page_popular_slots_sorting"
                }
              ],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_HOME_POP_SLOT_SETTINGS]
            }
          },
          {
            path: "/WebsiteSettings/HomePageDynamicColumnSettings",
            name: "HomePageDynamicColumnSettings",
            component: () => import("pages/WebsiteSettings/HomePageDynamicColumnSettings/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "首頁動態列設置",
                  i18nKey: "menu.home_page_dynamic_column_settings"
                }
              ],
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_HOME_DYNAMIC_PANEL_SETTINGS]
            }
          },
          {
            path: "/SystemSettings/TemplateSettings",
            component: () => import("pages/SystemSettings/TemplateSettings/TemplateSettings.vue"),
            meta: {
              breadcrumb: [
                { name: "版型設定", i18nKey: "menu.template_settings", link: "/SystemSettings/TemplateSettings" }
              ],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_TEMPLATE_SETTINGS]
            }
          }
        ]
      },
      {
        path: "/SiteSettings",
        redirect: "/SiteSettings/NoteSettings",
        meta: {
          breadcrumb: [{ name: "網站設定", i18nKey: "menu.website_settings", link: "/" }],
          icon: "website_settings",
          menuShow: ["agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_WEBSITE_MANAGEMENT],
          group: "settings"
        },
        children: [
          {
            path: "/SiteSettings/ClinetWebSiteLanguageSettings",
            component: () => import("pages/WebsiteSettings/ClinetSideSettings/ClinetWebSiteLanguageSettings.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "語系設定",
                  i18nKey: "menu.language_settings",
                  link: "/SiteSettings/ClinetWebSiteLanguageSettings"
                }
              ],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_LOCALIZATION_SETTINGS]
            }
          },
          {
            path: "/SiteSettings/NoteSettings",
            component: () => import("pages/SystemSettings/NoteSettings/Index.vue"),
            meta: {
              breadcrumb: [{ name: "備註設置", i18nKey: "menu.note_settings", link: "/SiteSettings/NoteSettings" }],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_NOTE_SETTINGS]
            }
          },

          {
            path: "/SiteSettings/ClinetSideSettings",
            name: "ClinetSideSettings",
            component: () => import("pages/WebsiteSettings/ClinetSideSettings/Index.vue"),
            redirect: "/SiteSettings/ClinetSideSettings/ClinetWebSiteSettings",
            meta: {
              breadcrumb: [
                {
                  name: "網站設定",
                  i18nKey: "menu.website_information_settings",
                  link: "/SiteSettings/ClinetSideSettings/ClinetWebSiteSettings"
                }
              ],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_WEB_SETTINGS]
            },
            children: [
              {
                path: "ClinetWebSiteLanguageSettings",
                name: "ClinetWebSiteLanguageSettings",
                component: () => import("pages/WebsiteSettings/ClinetSideSettings/ClinetWebSiteLanguageSettings.vue"),
                meta: {
                  permission: [PERMISSION.Enums.A_F_LOCALIZATION_SETTINGS]
                }
              },
              {
                path: "ClinetWebSiteSettings",
                name: "ClinetWebSiteSettings",
                component: () => import("pages/WebsiteSettings/ClinetSideSettings/ClinetWebSiteSettings.vue"),
                meta: {}
              },
              {
                path: "ClinetWebSiteRegSettings",
                name: "ClinetWebSiteRegSettings",
                component: () => import("pages/WebsiteSettings/ClinetSideSettings/ClinetWebSiteRegSettings.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/SiteSettings/WebsiteImageSettings",
            name: "WebsiteImageSettings",
            component: () => import("pages/WebsiteSettings/WebsiteImageSettings/Index.vue"),
            redirect: "/SiteSettings/WebsiteImageSettings/WebsiteLogo",
            meta: {
              breadcrumb: [
                {
                  name: "網站圖片設定",
                  i18nKey: "menu.website_image_settings",
                  link: "/SiteSettings/WebsiteImageSettings/WebsiteLogo"
                }
              ],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_WEBIMAGE_SETTINGS]
            },
            children: [
              {
                path: "WebsiteLogo",
                name: "WebsiteLogo",
                component: () => import("pages/WebsiteSettings/WebsiteImageSettings/WebsiteLogo.vue"),
                meta: {}
              }
              /*
              {
                path: "GameLobby/:gameType?/:supplierType?",
                name: "GameLobby",
                component: () => import("pages/WebsiteSettings/BannerSettings/GameLobby.vue"),
                meta: {}
              }*/
            ]
          },
          {
            path: "/SiteSettings/TrackingCodeConfig",
            name: "WebsiteTrackingCodeConfig",
            component: () => import("pages/WebsiteSettings/TrackingCodeConfig/Index.vue"),
            redirect: "/SiteSettings/TrackingCodeConfig/PixelCode",
            meta: {
              breadcrumb: [
                {
                  name: "追蹤代碼配置",
                  i18nKey: "menu.tracking_code_configuration",
                  link: "/SiteSettings/TrackingCodeConfig/PixelCode"
                }
              ],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_M_WEBSITE_ANALYTICS_MANAGEMENT]
            },
            children: [
              {
                path: "PixelCode",
                name: "WebsitePixelCode",
                component: () => import("pages/WebsiteSettings/TrackingCodeConfig/PixelCode.vue"),
                meta: {}
              }
              // {
              //   path: "FileUpload",
              //   name: "WebsiteFileUpload",
              //   component: () => import("pages/WebsiteSettings/SEO/FileUpload.vue"),
              //   meta: {}
              // }
            ]
          },
          {
            path: "/SiteSettings/DNSSettings",
            name: "DNSSettings",
            component: () => import("pages/WebsiteSettings/DNSSettings/Index.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "DNS 設定",
                  i18nKey: "menu.dns_settings"
                }
              ],
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_DNS_SETTING]
            }
          }
        ]
      },
      {
        path: "/MessageAgentCenter",
        redirect: "/MessageAgentCenter/AgentNewestAnnouncement/",
        meta: {
          breadcrumb: [{ name: "訊息中心", i18nKey: "menu.announcement_management", link: "/MessageCenter" }],
          icon: "announcement",
          menuShow: ["agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_MESSAGE_CENTER],
          group: "cms"
        },
        children: [
          {
            path: "/MessageAgentCenter/AgentNewestAnnouncement/",
            component: () => import("pages/MessageCenter/AgentNewestAnnouncement/List.vue"),
            meta: {
              breadcrumb: [{ name: "最新公告", i18nKey: "menu.newest_announcement", link: "/" }],
              icon: "announcement",
              menuShow: ["agent", "anibetAgent"],
              permission: [PERMISSION.Enums.A_F_NEWEST_ANNOUCEMENT]
            }
          },
          {
            path: "/MessageAgentCenter/MemberAnnouncement",
            meta: {
              breadcrumb: [{ name: "會員公告", i18nKey: "menu.member_announcement", link: "/" }],
              icon: "announcement",
              menuShow: ["agent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_ANNOUCEMENT]
            },
            children: [
              {
                path: "",
                name: "MemberAnnouncementList",
                component: () => import("pages/MessageCenter/MemberAnnouncement/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "MemberAnnouncementEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/MessageCenter/MemberAnnouncement/Edit.vue")
                },
                meta: {}
              },
              {
                path: "MemberAnnouncementAdd",
                name: "MemberAnnouncementAdd",
                component: () => import("pages/MessageCenter/MemberAnnouncement/Add.vue"),
                meta: {}
              }
            ]
          }
        ]
      },
      {
        path: "/MessageManagement",
        redirect: "/MessageManagement/SystemMessages",
        meta: {
          breadcrumb: [
            { name: "站內信功能", i18nKey: "menu.message_management", link: "/MessageManagement/SystemMessages" }
          ],
          icon: "announcement",
          menuShow: ["agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_MESSAGE_MANAGEMENT],
          group: "cms"
        },
        children: [
          {
            path: "/MessageManagement/SystemMessages",
            name: "SystemMessages",
            component: () => import("pages/MessageManagement/SystemMessages.vue"),
            meta: {
              breadcrumb: [
                { name: "系統訊息", i18nKey: "menu.system_messages", link: "/MessageManagement/SystemMessages" }
              ],
              icon: "announcement",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MESSAGE_NOTIFICATION]
            }
          },
          {
            path: "/MessageManagement/MemberInquiries",
            name: "MemberInquiries",
            component: () => import("pages/MessageManagement/MemberInquiries.vue"),
            meta: {
              breadcrumb: [
                { name: "會員諮詢", i18nKey: "menu.member_inquiries", link: "/MessageManagement/MemberInquiries" }
              ],
              icon: "announcement",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MESSAGE_INQUIRE]
            }
          }
        ]
      },
      {
        path: "/Product",
        redirect: "/Product/Manage_v2",
        meta: {
          breadcrumb: [{ name: "產品", i18nKey: "menu.product", link: "/" }],
          icon: "product",
          menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
          permission: [
            PERMISSION.Enums.S_M_PRODUCT_MANAGEMENT,
            PERMISSION.Enums.M_M_PRODUCT_MANAGEMENT,
            PERMISSION.Enums.A_M_PRODUCT_MANAGEMENT
          ],
          group: "cms"
        },
        children: [
          {
            path: "/Product/Manage_v2",
            component: () => import("pages/Product/Manage_v2/Index.vue"),
            meta: {
              breadcrumb: [{ name: "產品管理_v2", i18nKey: "menu.product", link: "/" }],
              icon: "toggle_on",
              menuShow: ["agent", "generalAgent"],
              permission: [
                PERMISSION.Enums.S_F_PRODUCT_SWITCH,
                PERMISSION.Enums.M_F_PRODUCT_SWITCH,
                PERMISSION.Enums.A_F_PRODUCT_SWITCH
              ],
              name: "ProductManageList_v2"
            },
            children: [
              {
                path: "",
                name: "ProductManageList_v2",
                component: () => import("pages/Product/Manage_v2/List.vue"),
                meta: {}
              },
              {
                path: "/Product/Manage/Setting_v2",
                name: "ProductManageSetting_v2",
                component: () => import("pages/Product/Manage_v2/Setting.vue"),
                meta: {
                  permission: [
                    PERMISSION.Enums.S_F_PRODUCT_SWITCH,
                    PERMISSION.Enums.M_F_PRODUCT_SWITCH,
                    PERMISSION.Enums.A_F_PRODUCT_SWITCH
                  ]
                }
              },
              {
                path: "/Product/Manage/GameSetting_v2",
                name: "ProductManageGameSetting_v2",
                component: () => import("pages/Product/Manage_v2/GameSetting.vue"),
                meta: {
                  permission: [PERMISSION.Enums.S_F_GAME_ENTRANCE_SETTINGS, PERMISSION.Enums.A_F_GAME_ENTRANCE_SETTINGS]
                }
              }
            ]
          },
          {
            path: "/Product/EntranceMap",
            component: () => import("pages/Product/EntranceMap/Index.vue"),
            meta: {
              breadcrumb: [{ name: "產品管理入口圖", i18nKey: "menu.product_management_image", link: "/" }],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [
                PERMISSION.Enums.S_F_PRODUCT_SWITCH,
                PERMISSION.Enums.M_F_PRODUCT_SWITCH,
                PERMISSION.Enums.A_F_PRODUCT_SWITCH
              ],
              name: "ProductEntranceMapV2"
            },
            children: [
              {
                path: "",
                name: "ProductEntranceMapV2",
                component: () => import("pages/Product/EntranceMap/List.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/Product/SortSetting",
            component: () => import("pages/Product/SortSetting/Index.vue"),
            meta: {
              breadcrumb: [{ name: "排序設定", i18nKey: "menu.sort_settings", link: "/" }],
              icon: "toggle_on",
              menuShow: ["agent"],
              permission: [
                PERMISSION.Enums.S_F_PRODUCT_SWITCH,
                PERMISSION.Enums.M_F_PRODUCT_SWITCH,
                PERMISSION.Enums.A_F_GAME_ENTRANCE_SORTS
              ],
              name: "SortSettingList"
            },
            children: [
              {
                path: "",
                name: "SortSettingList",
                component: () => import("pages/Product/SortSetting/List.vue"),
                meta: {}
              },
              {
                path: "/Product/SortSetting/Setting",
                name: "SortSetting",
                component: () => import("pages/Product/SortSetting/Setting.vue"),
                meta: {}
              },
              {
                path: "/Product/SortSetting/GameSetting",
                name: "SortGameSetting",
                component: () => import("pages/Product/SortSetting/GameSetting.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/Product/ProductMaintenanceSettings",
            component: () => import("pages/Product/ProductMaintenanceSettings.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "產品維護設置",
                  i18nKey: "menu.product_maintenance_settings",
                  link: "/Product/ProductMaintenanceSettings"
                }
              ],
              icon: "settings",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_PRODUCT_MAINTENANCE_SETTINGS]
            }
          }
        ]
      },
      {
        path: "/GeneralAgencyManagement",
        redirect: "/GeneralAgencyManagement/List/",
        component: () => import("pages/GeneralAgencyManagement/Index.vue"),
        meta: {
          breadcrumb: [
            {
              name: "總代管理",
              i18nKey: "menu.general_agency_management",
              link: "/GeneralAgencyManagement"
            }
          ],
          icon: "member manage",
          menuShow: ["admin"],
          permission: [PERMISSION.Enums.S_M_MASTER_MANAGEMENT],
          group: "settings"
        },
        children: [
          {
            path: "/GeneralAgencyManagement/List/",
            component: () => import("pages/GeneralAgencyManagement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "總代管理", i18nKey: "menu.general_agency_management", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_MASTER_MANAGEMENT]
            },
            children: [
              {
                path: "",
                name: "GeneralAgencyManagementList",
                component: () => import("pages/GeneralAgencyManagement/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "GeneralAgencyManagementListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/GeneralAgencyManagement/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "GeneralAgencyManagementListAdd",
                component: () => import("pages/GeneralAgencyManagement/Add/Index.vue"),
                meta: {
                  backRouteName: "GeneralAgencyManagementList",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },

      // {
      //   path: "/AgencyOperationsManagement",
      //   redirect: "/AgencyOperationsManagement",
      //   meta: {
      //     breadcrumb: [
      //       {
      //         name: "代理管理",
      //         i18nKey: "menu.agency_management",
      //         link: "/AgencyOperationsManagement"
      //       }
      //     ],
      //     icon: "proxy manage",
      //     menuShow: ["admin", "agent", "generalAgent"]
      //   },
      //   children: [
      //     {
      //       path: "/AgencyOperationsManagement",
      //       component: () => import("pages/AgencyOperationsManagement/AgencyOperationsManagement.vue"),
      //       meta: {
      //         breadcrumb: [
      //           {
      //             name: "代理營運管理",
      //             i18nKey: "menu.agency_operations_management",
      //             link: "/AgencyOperationsManagement"
      //           }
      //         ],
      //         menuShow: ["admin"]
      //       }
      //     },
      //     {
      //       path: "/AgencyOperationsManagement/List/",
      //       component: () => import("pages/AgencyManagement/Index.vue"),
      //       meta: {
      //         breadcrumb: [{ name: "代理管理", i18nKey: "menu.agency_management", link: "/" }],
      //         icon: "insert_chart",
      //         menuShow: ["generalAgent"]
      //       },
      //       children: [
      //         {
      //           path: "",
      //           name: "AgencyManagementList",
      //           component: () => import("pages/AgencyManagement/List.vue"),
      //           meta: {}
      //         },
      //         {
      //           path: "Edit/:id",
      //           name: "AgencyManagementListEdit",
      //           components: {
      //             layout: () => import("layouts/SubPage/Index.vue"),
      //             default: () => import("pages/AgencyManagement/Edit.vue")
      //           },
      //           meta: {}
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: "/AgencyManagement",
        redirect: "/AgencyManagement/AgencyOperationManagement",
        meta: {
          breadcrumb: [
            {
              name: "代理管理",
              i18nKey: "menu.agency_management",
              link: "/AgencyOperationsManagement"
            }
          ],
          icon: "agent_member_manage",
          menuShow: ["admin"],
          permission: [PERMISSION.Enums.S_M_AGENT_MANAGEMENT],
          group: "settings"
        },
        children: [
          {
            path: "/AgencyManagement/AgencyOperationManagement",
            component: () => import("pages/AgencyOperationsManagement/AgencyOperationsManagement.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "代理營運管理",
                  i18nKey: "menu.agency_operation_management",
                  link: "/AgencyOperationsManagement"
                }
              ],
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_AGENCY_OPERATIONS_MANAGEMENT]
            }
          }
        ]
      },
      {
        path: "/AgencyOperationsManagement",
        redirect: "/AgencyOperationsManagementV2/List/",
        meta: {
          breadcrumb: [
            {
              name: "代理管理",
              i18nKey: "menu.agency_management",
              link: "/AgencyOperationsManagement"
            }
          ],
          icon: "proxy manage",
          menuShow: ["generalAgent"],
          permission: [PERMISSION.Enums.M_M_AGENT_MANAGEMENT],
          group: "settings"
        },
        children: [
          /*{
            path: "/AgencyOperationsManagement/List/",

            component: () => import("pages/AgencyManagement/AgencyOperationManagement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理管理", i18nKey: "menu.agency_management", link: "/" }],
              icon: "insert_chart",
              menuShow: ["generalAgent"],
              permission: [PERMISSION.Enums.M_F_AGENCY_MANAGEMENT],
              name: "AgencyOperationsManagementList"
            },
            children: [
              {
                path: "",
                name: "AgencyOperationManagementList",
                component: () => import("pages/AgencyManagement/AgencyOperationManagement/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "AgencyOperationManagementListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagement/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "AgencyOperationManagementListAdd",
                component: () => import("pages/AgencyManagement/AgencyOperationManagement/Add/Index.vue"),
                meta: {
                  backRouteName: "AgencyOperationManagementList",
                  disableTabs: true
                }
              },
              {
                path: "commission/:id",
                name: "AgencyOperationManagementCommissionEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagement/CommissionEdit.vue")
                },
                meta: {
                  backRouteName: "AgencyOperationManagementList",
                  disableTabs: true
                }
              }
            ]
          },*/
          {
            path: "/AgencyOperationsManagementV2/List/",
            component: () => import("pages/AgencyManagement/AgencyOperationManagementV2/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理管理", i18nKey: "menu.agency_management", link: "/" }],
              icon: "insert_chart",
              menuShow: ["generalAgent"],
              permission: [PERMISSION.Enums.M_F_AGENCY_MANAGEMENT],
              name: "AgencyOperationManagementList_v2"
            },
            children: [
              {
                path: "",
                name: "AgencyOperationManagementList_v2",
                component: () => import("pages/AgencyManagement/AgencyOperationManagementV2/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "AgencyOperationManagementListEdit_v2",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagementV2/Edit.vue")
                },
                meta: {}
              },
              {
                path: "CurrencyEdit/:id",
                name: "AgencyOperationManagementCurrencyEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagementV2/CurrencyEdit.vue")
                },
                meta: {}
              },
              {
                path: "ProductEdit/:id/:agent_code",
                name: "AgencyOperationManagementProductEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagementV2/ProductEdit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "AgencyOperationManagementListAdd_v2",
                component: () => import("pages/AgencyManagement/AgencyOperationManagementV2/Add/Index.vue"),
                meta: {
                  backRouteName: "AgencyOperationManagementList_v2",
                  disableTabs: true
                }
              },
              {
                path: "commission/:id",
                name: "AgencyOperationManagementCommissionEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AgencyManagement/AgencyOperationManagement/CommissionEdit.vue")
                },
                meta: {
                  backRouteName: "AgencyOperationManagementList_v2",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },
      // {
      //   path: '/Tables',
      //   component: () => import('pages/Tables.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: 'Table模板', link: '/Tables' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Contact',
      //   component: () => import('pages/Contact.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '聯絡人', link: '/Contact' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Checkout',
      //   component: () => import('pages/Checkout.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '購物車', link: '/Checkout' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Charts',
      //   component: () => import('pages/Charts.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '圖表', link: '/Charts' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Calendar',
      //   component: () => import('pages/Calendar.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '行事曆', link: '/Calendar' },
      //     ],
      //   },
      // },
      {
        path: "/CashFlow",
        redirect: "/CashFlow/List/",
        component: () => import("pages/CashFlow/Index.vue"),
        meta: {
          breadcrumb: [{ name: "金流管理", i18nKey: "menu.cash_flow", link: "/CashFlow" }],
          icon: "money",
          menuShow: ["admin", "agent", "anibetAgent", "credit"], // 總帶隱藏
          permission: [
            PERMISSION.Enums.S_M_PAYMENT_MANAGEMENT,
            PERMISSION.Enums.M_M_PAYMENT_MANAGEMENT,
            PERMISSION.Enums.A_M_PAYMENT_MANAGEMENT
          ],
          group: "cash_flow"
        },
        children: [
          {
            path: "/CashFlow/List/",
            component: () => import("pages/CashFlow/Index.vue"),
            meta: {
              breadcrumb: [{ name: "金流管理", i18nKey: "menu.cash_flow", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "generalAgent", "agent", "anibetAgent"],
              permission: [
                PERMISSION.Enums.S_F_CASH_FLOW,
                PERMISSION.Enums.M_F_CASH_FLOW,
                PERMISSION.Enums.A_F_CASH_FLOW
              ]
            },
            children: [
              {
                path: "",
                name: "CashFlowList",
                component: () => import("pages/CashFlow/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "CashFlowListEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/CashFlow/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "CashFlowListAdd",
                components: {
                  default: () => import("pages/CashFlow/Add/Index.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/CashFlow/riskControl/",
            component: () => import("pages/CashFlow/riskControl/Index.vue"),
            meta: {
              breadcrumb: [{ name: "风控设置", i18nKey: "menu.risk_control_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_WITHDRAWAL_RISK]
            },
            children: [
              {
                path: "riskControl",
                name: "riskControl",
                component: () => import("pages/CashFlow/riskControl/Index.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/CashFlow/CryptoExchangeRateSettings/",
            component: () => import("pages/CashFlow/CryptoExchangeRateSettings.vue"),
            meta: {
              breadcrumb: [{ name: "虛擬貨幣匯率設定", i18nKey: "menu.crypto_exchange_rate_settings", link: "/" }],
              icon: "currency_exchange",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_CRYPTO_EXCHANGE_SETTING]
            },
            children: [
              {
                path: "",
                name: "CryptoExchangeRateSettings",
                component: () => import("pages/CashFlow/CryptoExchangeRateSettings.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/CashFlow/PaymentTypeManagement/",
            component: () => import("pages/CashFlow/PaymentTypeManagement.vue"),
            meta: {
              breadcrumb: [{ name: "支付類型管理", i18nKey: "menu.payment_type_management", link: "/" }],
              icon: "settings",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_PAYMENT_TYPE_SETTING]
            },
            children: [
              {
                path: "",
                name: "PaymentTypeManagement",
                component: () => import("pages/CashFlow/PaymentTypeManagement.vue"),
                meta: {}
              }
            ]
          },
          {
            path: "/CashFlow/CashFlowMerchantManagement/",
            component: () => import("pages/CashFlow/CashFlowMerchantManagement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "金流商戶管理", i18nKey: "menu.cash_flow_merchant_management", link: "/" }],
              icon: "store",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_GATEWAY_CONNECTION]
            },
            children: [
              {
                path: "",
                name: "CashFlowMerchantManagement",
                component: () => import("pages/CashFlow/CashFlowMerchantManagement.vue"),
                meta: {}
              },
              {
                path: "add",
                name: "CashFlowMerchantManagementAdd",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/CashFlow/CashFlowMerchantManagement/Setting.vue")
                },
                meta: {
                  backRouteName: "CashFlowMerchantManagement"
                }
              },
              {
                path: "edit/:payment_gateway_name",
                name: "CashFlowMerchantManagementEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/CashFlow/CashFlowMerchantManagement/Setting.vue")
                },
                meta: {
                  backRouteName: "CashFlowMerchantManagement"
                }
              }
            ]
          }
        ]
      },

      {
        path: "/Announcement",
        redirect: "/Announcement",
        meta: {
          breadcrumb: [{ name: "公告管理", i18nKey: "menu.announcement_management", link: "/" }],
          icon: "announcement",
          menuShow: ["admin"],
          permission: [PERMISSION.Enums.S_M_ANNOUCEMENT_MANAGEMENT],
          group: "cms"
        },
        children: [
          {
            path: "/Announcement",
            component: () => import("pages/Announcement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "公告管理", i18nKey: "menu.announcement_management", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_ANNOUCEMENT_MANAGEMENT],
              name: "AnnouncementList"
            },
            children: [
              {
                path: "",
                name: "AnnouncementList",
                component: () => import("pages/Announcement/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "AnnouncementEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/Announcement/Edit.vue")
                },
                meta: {}
              },
              {
                path: "AnnouncementAdd",
                name: "AnnouncementAdd",
                component: () => import("pages/Announcement/Add.vue"),
                meta: {}
              }
            ]
          }
        ]
      },

      {
        path: "/CacheManagement",
        redirect: "/CacheManagement/List",
        meta: {
          breadcrumb: [{ name: "Cache管理", i18nKey: "menu.cache_management", link: "/" }],
          icon: "cache",
          menuShow: ["admin"],
          permission: [PERMISSION.Enums.S_M_CACHE_MANAGEMENT],
          group: "cms"
        },
        children: [
          {
            path: "/CacheManagement/List",
            component: () => import("pages/CacheManagement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "Cache管理", i18nKey: "menu.cache_management", link: "/" }],
              icon: "cache",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_CACHE_MANAGEMENT],
              name: "CacheList"
            }
          }
        ]
      },

      {
        path: "/AgentCacheManagement",
        redirect: "/AgentCacheManagement/List",
        meta: {
          breadcrumb: [{ name: "清理緩存", i18nKey: "menu.cache_clear", link: "/" }],
          icon: "cache",
          menuShow: ["agent"],
          permission: [PERMISSION.Enums.A_M_CACHE_MANAGEMENT_NEW],
          group: "cms"
        },
        children: [
          {
            path: "/AgentCacheManagement/List",
            component: () => import("pages/AgentCacheManagement/Index.vue"),
            meta: {
              breadcrumb: [{ name: "清理緩存", i18nKey: "menu.cache_clear", link: "/" }],
              icon: "cache",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_CACHE_MANAGEMENT_NEW],
              name: "AgentCacheList"
            }
          }
        ]
      },

      {
        path: "/MessageCenter",
        redirect: "/MessageCenter/NewestAnnouncement",
        meta: {
          breadcrumb: [{ name: "公告管理", i18nKey: "menu.announcement_management", link: "/" }],
          icon: "announcement",
          menuShow: ["generalAgent"],
          permission: [PERMISSION.Enums.M_M_ANNOUCEMENT_MANAGEMENT],
          group: "cms"
        },
        children: [
          {
            path: "",
            component: () => import("pages/MessageCenter/NewestAnnouncement/List.vue"),
            meta: {
              breadcrumb: [{ name: "最新公告", i18nKey: "menu.newest_announcement", link: "/" }],
              icon: "insert_chart",
              menuShow: ["generalAgent"],
              permission: [PERMISSION.Enums.M_F_NEWEST_ANNOUCEMENT],
              name: "AnnouncementList"
            }
          }
        ]
      },
      {
        path: "/HistoryRecord",
        redirect: "/HistoryRecord/AccountFlowReport",
        meta: {
          breadcrumb: [{ name: "歷史報表", i18nKey: "menu.history_records", link: "/HistoryRecord" }],
          icon: "report",
          menuShow: ["admin", "generalAgent", "agent", "anibetAgent", "amusevip"],
          permission: [PERMISSION.Enums.A_M_HISTORY_MANAGEMENT],
          group: "records"
        },
        children: [
          {
            path: "/HistoryRecord/AccountFlowReport",
            name: "AccountFlowReport",
            component: () => import("pages/Reports/AccountFlowReport.vue"),
            meta: {
              breadcrumb: [
                { name: "帳變明細", i18nKey: "menu.account_flow_report", link: "/HistoryRecord/AccountFlowReport" }
              ],
              icon: "account_balance_wallet",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_ACCOUNT_FLOW_REPORT]
            }
          },
          {
            path: "/HistoryRecord/BetRecord",
            name: "BetRecord",
            component: () => import("pages/Reports/BetRecord.vue"),
            meta: {
              breadcrumb: [
                { name: "投注紀錄查詢", i18nKey: "menu.bet_record_inquiry", link: "/HistoryRecord/BetRecord" }
              ],
              icon: "attach_money",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_BET_RECORD_INQUIRY]
            }
          },
          {
            path: "/HistoryRecord/UserActionLog",
            name: "UserActionLog",
            component: () => import("pages/AccountManagement/UserActionLog/UserActionLog.vue"),
            meta: {
              breadcrumb: [{ name: "操作記錄", i18nKey: "menu.user_action_log", link: "/" }],
              icon: "article",
              menuShow: ["admin", "agent", "anibetAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_USER_ACTION_LOG,
                PERMISSION.Enums.M_F_USER_ACTION_LOG,
                PERMISSION.Enums.A_F_USER_ACTION_LOG
              ],
              name: "UserActionLog"
            }
          }
        ]
      },
      {
        path: "/Report",
        redirect: "/Report/CashReport",
        meta: {
          breadcrumb: [{ name: "統計報表", i18nKey: "menu.report", link: "/Report" }],
          icon: "report",
          menuShow: ["admin", "generalAgent", "agent", "anibetAgent", "amusevip"],
          permission: [
            PERMISSION.Enums.S_M_STATISTIC_REPORT,
            PERMISSION.Enums.M_M_STATISTIC_REPORT,
            PERMISSION.Enums.A_M_STATISTIC_REPORT
          ],
          group: "records"
        },

        children: [
          {
            path: "/Report/DailyOverviewtReport",
            name: "DailyOverviewtReport",
            component: () => import("pages/Reports/DailyOverviewtReport.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "每日綜合報表",
                  i18nKey: "menu.daily_comprehensive_report",
                  link: "/Report/DailyOverviewtReport"
                }
              ],
              icon: "account_balance_wallet",
              // TODO: menuShow、permission
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_OVERVIEW_REPORT]
            }
          },
          {
            path: "CashReport",
            component: () => import("pages/Reports/CashReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "現金報表", i18nKey: "menu.cash_report", link: "/" }],
              icon: "account_balance_wallet",
              menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_CASH_REPORT,
                PERMISSION.Enums.M_F_CASH_REPORT,
                PERMISSION.Enums.A_F_CASH_REPORT
              ]
            },
            children: [
              {
                path: "",
                name: "CashReportList",
                component: () => import("pages/Reports/CashReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:date/:currencyId",
                name: "CashReportDetail",
                components: {
                  default: () => import("pages/Reports/CashReport/Detail.vue")
                },
                meta: {}
              },
              {
                path: "Detail/:date/:currencyId/:memberId/:memberAccount",
                name: "CashReportMemberDetail",
                components: {
                  default: () => import("pages/Reports/CashReport/MemberDetail.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/Report/BetReport",
            component: () => import("pages/Reports/BetReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "投注報表", i18nKey: "menu.bet_report", link: "/" }],
              icon: "inventory",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_BET_REPORT]
            },
            children: [
              {
                path: "",
                name: "BetReportList",
                component: () => import("pages/Reports/BetReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:currencyId",
                name: "BetReportProductDetail",
                components: {
                  default: () => import("pages/Reports/BetReport/ProductDetail.vue")
                },
                meta: {}
              },
              {
                path: "Detail/:currencyId/:productCode",
                name: "BetReportMemberDetail",
                components: {
                  default: () => import("pages/Reports/BetReport/MemberDetail.vue")
                },
                meta: {}
              },
              {
                path: "Detail/:currencyId/:productCode/:memberId",
                name: "BetReportOrderDetail",
                components: {
                  default: () => import("pages/Reports/BetReport/OrderDetail.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/Report/MemberBetReport",
            name: "MemberBetReport",
            component: () => import("pages/Reports/MemberBetReport.vue"),
            meta: {
              breadcrumb: [
                { name: "會員投注報表", i18nKey: "menu.member_bet_report", link: "/Report/MemberBetReport" }
              ],
              icon: "credit_card",
              menuShow: ["agent", "anibetAgent", "amusevip"],
              permission: [PERMISSION.Enums.A_F_MEMBER_BET_REPORT]
            }
          },

          // {
          //   path: "/Report/DepositReport",
          //   name: "DepositReport",
          //   component: () => import("pages/Reports/DepositReport.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "存款紀錄查詢", i18nKey: "menu.deposit_record_inquiry", link: "/" }],
          //     icon: "monetization_on",
          //     menuShow: ["agent", "anibetAgent", "amusevip"],
          //     permission: [PERMISSION.Enums.A_F_DEPOSIT_RECORD_INQUIRY]
          //   }
          // },
          // {
          //   path: "/Report/WithdrawalReport",
          //   name: "WithdrawalReport",
          //   component: () => import("pages/Reports/WithdrawalReport.vue"),
          //   meta: {
          //     breadcrumb: [{ name: "出款紀錄查詢", i18nKey: "menu.withdrawal_record_inquiry", link: "/" }],
          //     icon: "credit_card",
          //     menuShow: ["agent", "anibetAgent", "amusevip"],
          //     permission: [PERMISSION.Enums.A_F_WITHDRAWAL_RECORD_INQUIRY]
          //   }
          // },

          {
            path: "/Report/ProductBetReport",
            component: () => import("pages/Reports/ProductBetReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "產品投注報表", i18nKey: "menu.product_bet_report", link: "/" }],
              icon: "inventory",
              menuShow: ["admin", "agent", "anibetAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_PRODUCT_BET_REPORT,
                PERMISSION.Enums.M_F_PRODUCT_BET_REPORT,
                PERMISSION.Enums.A_F_PRODUCT_BET_REPORT
              ]
            },
            children: [
              {
                path: "",
                name: "ProductBetReportList",
                component: () => import("pages/Reports/ProductBetReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:productId/:currencyId",
                name: "ProductBetReportDetail",
                components: {
                  default: () => import("pages/Reports/ProductBetReport/Detail.vue")
                },
                meta: {}
              },
              {
                path: "Detail/:productId/:currencyId/:memberId",
                name: "ProductBetReportMemberDetail",
                components: {
                  default: () => import("pages/Reports/ProductBetReport/MemberDetail.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/Report/UserReport",
            name: "UserReport",
            component: () => import("pages/Reports/UserReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "用戶報表", i18nKey: "menu.user_report", link: "/Report/UserReport" }],
              icon: "people",
              menuShow: ["admin", "agent", "generalAgent", "anibetAgent", "amusevip"],
              permission: [
                PERMISSION.Enums.S_F_USER_REPORT,
                PERMISSION.Enums.M_F_USER_REPORT,
                PERMISSION.Enums.A_F_USER_REPORT
              ]
            },
            children: [
              {
                path: "",
                name: "UserReportList",
                component: () => import("pages/Reports/UserReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/:date",
                name: "UserReportDetail",
                components: {
                  default: () => import("pages/Reports/UserReport/Detail.vue")
                },
                meta: {}
              }
            ]
          },
          {
            path: "/Report/MasterAgentBetReport",
            name: "MasterAgentBetReport",
            component: () => import("pages/Reports/MasterAgentBetReport.vue"),
            meta: {
              breadcrumb: [
                { name: "總代投注報表", i18nKey: "menu.master_agent_bet_report", link: "/MasterAgentBetReport" }
              ],
              icon: "attach_money",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_MASTER_BET_REPORT]
            }
          },
          {
            path: "/Report/AgentBetReport",
            name: "AgentBetReport",
            component: () => import("pages/Reports/AgentBetReport.vue"),
            meta: {
              breadcrumb: [{ name: "代理投注報表", i18nKey: "menu.agent_bet_report", link: "/AgentBetReport" }],
              icon: "attach_money",
              menuShow: ["generalAgent"],
              permission: [PERMISSION.Enums.M_F_AGENT_BET_REPORT]
            }
          },
          {
            path: "/Report/AgentCommissionReport",
            name: "AgentCommissionReport",
            component: () => import("pages/Reports/AgentCommissionReport.vue"),
            meta: {
              breadcrumb: [
                { name: "代理佣金報表", i18nKey: "menu.agent_commission_report", link: "/AgentCommissionReport" }
              ],
              icon: "attach_money",
              menuShow: ["generalAgent"],
              permission: [PERMISSION.Enums.M_F_AGENT_COMMISSION_REPORT]
            }
          },

          {
            path: "/Report/AgentReport",
            name: "AgentReport",
            component: () => import("pages/Reports/AgentReport.vue"),
            meta: {
              breadcrumb: [
                {
                  name: "代理報表",
                  i18nKey: "menu.agent_report",
                  link: "/Report/AgentReport"
                }
              ],
              icon: "account_balance_wallet",
              // TODO: menuShow、permission
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_AURORA_OVERVIEW_REPORT]
            }
          },
          {
            path: "/Report/TeamAgentReport",
            name: "TeamAgentReport",
            component: () => import("pages/Reports/TeamAgentReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理報表", i18nKey: "menu.team_agent_report", link: "/Report/TeamAgentReport" }],
              icon: "account_balance_wallet",
              menuShow: ["agent"],
              permission: [PERMISSION.Enums.A_F_MEMBER_OVERVIEW_REPORT]
            },
            children: [
              {
                path: "",
                name: "TeamAgentReportList",
                component: () => import("pages/Reports/TeamAgentReport.vue"),
                meta: {}
              },
              {
                path: ":memberAccount",
                name: "TeamAgentReportDetail",
                component: () => import("pages/Reports/TeamAgentReport/Detail.vue"),
                meta: {}
              }
            ]
          }

          /*{
            path: "/Report/DayReport/list",
            component: () => import("pages/Reports/DayReport/Index.vue"),
            meta: {
              breadcrumb: [{ name: "每日報表", i18nKey: "menu.day_report", link: "/Report/DayReport" }],
              icon: "people",
              menuShow: ["agent"]
            },
            children: [
              {
                path: "",
                name: "DayReport",
                component: () => import("pages/Reports/DayReport/List.vue"),
                meta: {}
              },
              {
                path: "Detail/Date/:id",
                name: "DayReportDateDetail",
                components: {
                  layout: () => import("layouts/Detail/Index.vue"),
                  default: () => import("pages/Reports/DayReport/DateDetail.vue")
                },
                meta: {}
              },
              {
                path: "Detail/Regist/:id",
                name: "DayReportRegistDetail",
                components: {
                  layout: () => import("layouts/Detail/Index.vue"),
                  default: () => import("pages/Reports/DayReport/RegistDetail.vue")
                },
                meta: {}
              }
            ]
          }*/
        ]
      },
      {
        path: "/AdminProxySettings",
        redirect: "/AdminProxySettings/List/",
        component: () => import("pages/AdminProxySettings/Index.vue"),
        meta: {
          breadcrumb: [
            {
              name: "代理設定",
              i18nKey: "menu.proxy_settings",
              link: "/AdminProxySettings"
            }
          ],
          icon: "member manage",
          menuShow: ["admin"],
          permission: [PERMISSION.Enums.S_M_AURORA_AGENT_MANAGEMENT],
          group: "settings"
        },
        children: [
          {
            path: "/AdminProxySettings/List/",
            component: () => import("pages/AdminProxySettings/Index.vue"),
            meta: {
              breadcrumb: [{ name: "代理設定", i18nKey: "menu.proxy_settings", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin"],
              permission: [PERMISSION.Enums.S_F_AURORA_AGENT_MANAGEMENT]
            },
            children: [
              {
                path: "",
                name: "AdminProxySettingsList",
                component: () => import("pages/AdminProxySettings/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "AdminProxySettingsEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/AdminProxySettings/Edit.vue")
                },
                meta: {}
              },
              {
                path: "Add",
                name: "AdminProxySettingsAdd",
                component: () => import("pages/AdminProxySettings/Add/Index.vue"),
                meta: {
                  backRouteName: "AdminProxySettingsList",
                  disableTabs: true
                }
              }
            ]
          }
        ]
      },
      // {
      //   path: '/Tables',
      //   component: () => import('pages/Tables.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: 'Table模板', link: '/Tables' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Contact',
      //   component: () => import('pages/Contact.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '聯絡人', link: '/Contact' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Checkout',
      //   component: () => import('pages/Checkout.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '購物車', link: '/Checkout' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Charts',
      //   component: () => import('pages/Charts.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '圖表', link: '/Charts' },
      //     ],
      //   },
      // },
      // {
      //   path: '/Calendar',
      //   component: () => import('pages/Calendar.vue'),
      //   meta: {
      //     breadcrumb: [
      //       { name: '首頁', link: '/' },
      //       { name: '行事曆', link: '/Calendar' },
      //     ],
      //   },
      // },
      // {
      //   path: "/CashFlow",
      //   component: () => import("pages/CashFlow/CashFlow.vue"),
      //   meta: {
      //     breadcrumb: [{ name: "金流管理", i18nKey: "menu.cash_flow", link: "/CashFlow" }],
      //     icon: "money",
      //     menuShow: ["admin", "agent", "generalAgent"]
      //   }
      // },
      // {
      //   path: "/Announcement",
      //   component: () => import("pages/Announcement/Index.vue"),
      //   meta: {
      //     breadcrumb: [{ name: "公告管理", i18nKey: "menu.announcement_management", link: "/Announcement" }],
      //     icon: "announcement",
      //     menuShow: ["admin", "generalAgent"]
      //   }
      // },

      {
        path: "/DocumentDownload",
        component: () => import("pages/DocumentDownload/Index.vue"),
        meta: {
          breadcrumb: [{ name: "文檔下載", i18nKey: "menu.document_download", link: "/DocumentDownload" }],
          icon: "document",
          menuShow: ["admin", "agent", "generalAgent", "anibetAgent"],
          permission: [
            PERMISSION.Enums.S_M_FILE_MANAGEMENT,
            PERMISSION.Enums.M_M_FILE_MANAGEMENT,
            PERMISSION.Enums.A_M_FILE_MANAGEMENT
          ],
          group: "documents"
        },
        children: [
          {
            path: "/DocumentDownload",
            component: () => import("pages/DocumentDownload/Index.vue"),
            meta: {
              breadcrumb: [{ name: "文檔下載", i18nKey: "menu.document_download", link: "/" }],
              icon: "insert_chart",
              menuShow: ["admin", "anibetAgent"],
              permission: [
                PERMISSION.Enums.S_F_DOCUMENT_DOWNLOAD,
                PERMISSION.Enums.M_F_DOCUMENT_DOWNLOAD,
                PERMISSION.Enums.A_F_DOCUMENT_DOWNLOAD
              ],
              name: "DocumentDownloadList"
            },
            children: [
              {
                path: "",
                name: "DocumentDownloadList",
                component: () => import("pages/DocumentDownload/List.vue"),
                meta: {}
              },
              {
                path: "Edit/:id",
                name: "DocumentDownloadEdit",
                components: {
                  layout: () => import("layouts/SubPage/Index.vue"),
                  default: () => import("pages/DocumentDownload/Edit.vue")
                },
                meta: {}
              },
              {
                path: "DocumentDownloadAdd",
                name: "DocumentDownloadAdd",
                component: () => import("pages/DocumentDownload/Add.vue"),
                meta: {}
              }
            ]
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  },
  {
    path: "/Maintenance",
    component: () => import("pages/Maintenance.vue")
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("pages/Login.vue")
  }
]

export default routes
