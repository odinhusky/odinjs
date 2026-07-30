const BASE_ENDPOINT_VERSION = {
  PLATFORM: "platform/v1",
  V1: "v1"
} as const

export const ENDPOINT_PATHS = {
  AGENT_PAYMENT_GROUP: {
    CREATE: `/${BASE_ENDPOINT_VERSION.V1}/agent/payment/group`,
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/agent/payment/group/list`,
    DETAIL: (params: { id: number | string }) => `/${BASE_ENDPOINT_VERSION.V1}/agent/payment/group/${params.id}`
  },

  AI_AGENT: {
    LAUNCH: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/game/ai_agent/launch`
  },
  ANNOUNCEMENT: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/announcement/list`
  },

  BANK: {
    FIRST_DEPOSIT_PROMOTION: `/${BASE_ENDPOINT_VERSION.V1}/player/promotions/free_spin/pop_out`,

    PAYMENT_IMG: `/${BASE_ENDPOINT_VERSION.V1}/player/center/image`,
    AVAILABLE_CURRENCY_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/wallets/currencies/available`,

    PAYMENT_GATEWAY_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/payment_gateway/list`,
    PAYMENT_TYPE_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/payment/type`,

    BANK_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/bank`,
    BANK_CARD: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/bank/card`,

    DEPOSIT: `/${BASE_ENDPOINT_VERSION.V1}/player/deposit`,
    DEPOSIT_PAYMENT_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/deposit/payment/info`,
    DEPOSIT_PAYMENT_DETAIL: `/${BASE_ENDPOINT_VERSION.V1}/player/deposit/payment`,
    DEPOSIT_PROMOTION_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/promotions/deposit`,
    DEPOSIT_REMARK: `/${BASE_ENDPOINT_VERSION.V1}/player/deposit/payment/remark`,
    DEPOSIT_DETAIL_UPLOAD: `/${BASE_ENDPOINT_VERSION.V1}/player/deposit/image`,
    MAYA_DEPOSIT: `/${BASE_ENDPOINT_VERSION.V1}/maya/deposit`,

    WITHDRAW: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw`,
    PAYOUT_SETTINGS: `/${BASE_ENDPOINT_VERSION.V1}/player/payout_settings`,
    PAYOUT_SETTINGS_EWALLET_PROVIDER: `/${BASE_ENDPOINT_VERSION.V1}/player/payout_settings/ewallet_provider`,
    PAYOUT_SETTING_DETAIL: (params: { id: number | string }) =>
      `/${BASE_ENDPOINT_VERSION.V1}/player/payout_settings/${params.id}`,
    WITHDRAW_REMARK: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/payment/remark`,
    WITHDRAW_DETAIL_UPLOAD: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/image`,
    WITHDRAW_PAYMENT_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/payment/info`,
    WITHDRAW_PAYMENT_DETAIL: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/payment`,
    WITHDRAW_CRYPTO_RATE: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/crypto/rate`,
    WITHDRAW_CRYPTO_CURRENCY: `/${BASE_ENDPOINT_VERSION.V1}/player/withdraw/crypto`,
    MAYA_WITHDRAW: `/${BASE_ENDPOINT_VERSION.V1}/maya/withdraw`,

    MAYA_LOGIN_INFO: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/withdrawal/external/info`,
    SEND_MAYA_TOKEN: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/withdrawal/external/maya/token`,
    SEND_MAYA_WITHDRAW: `/${BASE_ENDPOINT_VERSION.V1}/player/withdrawal/external/maya`
  },

  CHATROOM: {
    MEMBER_SEARCH: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/member/search`,
    RECENT: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/recent`,
    RELATION: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/relation`,
    INFO: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/info`,
    MESSAGE: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/message`,
    IMAGE: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/message/image`,
    NICKNAME: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/chatroom/member/nickname`
  },

  CMS: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/cms/detail/list`,
    DETAIL: `/${BASE_ENDPOINT_VERSION.V1}/player/cms/detail`,
    FLOAT_ICON: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/cms/features/floating-icon`
  },

  COLLABORATION: {
    VISIBILITY: `/${BASE_ENDPOINT_VERSION.V1}/player/agent_collab/visibility`,
    STATISTICS: `/${BASE_ENDPOINT_VERSION.V1}/player/agent_collab/statistics`,
    INVITATIONS: `/${BASE_ENDPOINT_VERSION.V1}/player/agent_collab/invitations`,
    REBATES: `/${BASE_ENDPOINT_VERSION.V1}/player/agent_collab/rebates`
  },

  DOMAIN: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/agent_collab/domains`
  },

  FREE_SPIN: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/promotions/free_spin/list`
  },

  GAME: {
    LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/product/game`,
    ALL_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/game/all`,
    TYPE_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/game/game_type/list`,
    PRODUCT_LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/product`,
    ALL_PRODUCT_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/game/agent_product/list`,

    FAVORITE: `/${BASE_ENDPOINT_VERSION.V1}/player/game/favorite`,
    FAVORITE_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/game/favorite/list`,

    LAUNCH: `/${BASE_ENDPOINT_VERSION.V1}/player/game/launch_game`,
    LAUNCH_GUEST: `/${BASE_ENDPOINT_VERSION.V1}/player/game/guest/launch_guest`,

    PRODUCT_AVAILABLE_CURRENCY: `/${BASE_ENDPOINT_VERSION.V1}/player/game/product_available_currency`,

    ALL_TRANSFER_OUT: `/${BASE_ENDPOINT_VERSION.V1}/player/game/all_transfer_out`
  },

  GIFT: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/gifts/list`,
    CLAIM: `/${BASE_ENDPOINT_VERSION.V1}/player/gifts/deposit`
  },

  INTEREST: {
    ACTIVITY_LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/interest/activity`,
    ACTIVITY_DESCRIPTION: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/interest/activity/description`,
    APPLY_ACTIVITY: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/interest/application/submit`,
    APPLY_ACTIVITY_REDEMPTION: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/interest/application/apply-redemption`,
    ACTIVITY_DETAIL_LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/interest/member/application`
  },

  LEADERBOARD: {
    LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/leaderboard`
  },

  AUTH: {
    GET_OTP: `/${BASE_ENDPOINT_VERSION.V1}/player/user/sms_otp`,
    GET_TOTP_STATUS: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/totp/status`,
    GET_TOTP_STATUS_ONBOARDING: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/onboarding/totp/status`,
    GET_TOTP_GENERATE: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/totp/generate`,
    GET_TOTP_GENERATE_ONBOARDING: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/onboarding/totp/generate`,
    POST_TOTP_ENABLE: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/totp/enable`,
    POST_TOTP_ENABLE_ONBOARDING: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/onboarding/totp/enable`,
    POST_TOTP_VERIFY: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/totp/verify`,
    POST_TOTP_VERIFY_ONBOARDING: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/onboarding/totp/verify`,

    REGISTER: `/${BASE_ENDPOINT_VERSION.V1}/player/user`,
    REGISTER_CUSTOM_INPUT: `/${BASE_ENDPOINT_VERSION.V1}/player/user/customize_column/list`,

    LOGIN: `/${BASE_ENDPOINT_VERSION.V1}/player/user/login`,
    LOGOUT: `/${BASE_ENDPOINT_VERSION.V1}/player/user/logout`,
    TG_WEB_APP_LOGIN: `/${BASE_ENDPOINT_VERSION.V1}/operator/member/login/tg`,
    GET_TELEGRAM_OAUTH_URL: `/${BASE_ENDPOINT_VERSION.V1}/tg/login`,
    GET_GOOGLE_OAUTH_URL: `/${BASE_ENDPOINT_VERSION.V1}/google/login`,
    MAYA_LOGIN: `/${BASE_ENDPOINT_VERSION.V1}/maya/login`,

    FORGOT_PASSWORD: `/${BASE_ENDPOINT_VERSION.V1}/player/user/forgot`,
    FORGOT_PASSWORD_SMS: `/${BASE_ENDPOINT_VERSION.V1}/player/user/forgot_sms_otp`,
    RESET_PASSWORD: `/${BASE_ENDPOINT_VERSION.V1}/player/user/forgot/reset`,

    CHECK_PHONE: `/${BASE_ENDPOINT_VERSION.V1}/player/user/check_phone`
  },

  MAIL: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/mail`
  },

  MINI_GAME: {
    AUTH_KEY: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/gs1/mini-game/auth-key`,
    LAUNCH: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/gs1/mini-game/launch`
  },

  PIXEL_CODE: {
    LIST: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/pixel-codes`
  },

  PLAYER_PAYMENT_GATEWAY: {
    GROUPS: `/${BASE_ENDPOINT_VERSION.V1}/player/payment_gateway/groups`
  },

  PROMOTION: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/promotions/list`,
    REGISTER: `/${BASE_ENDPOINT_VERSION.V1}/player/promotions/register`
  },

  RANK: {
    LATEST_WIN_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/bet/latest_win_list`,
    LATEST_BET_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/bet/latest_bet_list`
  },

  REFERRAL: {
    INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/commission/me/referral/info`,
    SUMMARY: `/${BASE_ENDPOINT_VERSION.V1}/player/commission/summary`,
    SETTING: `/${BASE_ENDPOINT_VERSION.V1}/player/commission/settings`,
    STATEMENTS_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/commission/statements`,
    STATEMENT_DETAIL: (params: { statement_id: number }) =>
      `/${BASE_ENDPOINT_VERSION.V1}/player/commission/statements/${params.statement_id}/details`,
    STATEMENT_DETAIL_TOTAL: (params: { statement_id: number }) =>
      `/${BASE_ENDPOINT_VERSION.V1}/player/commission/statements/${params.statement_id}/details/total`,

    SIGNUP_OVERVIEW: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_signup/overview`
  },

  REFERRAL_REBATE: {
    GROUP: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_rebate/group`,
    SUMMARY: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_rebate/events/current/summary`,
    STATEMENT: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_rebate/events/current/statement`,
    EVENTS: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_rebate/events`,
    EVENTS_STATEMENTS: (params: { event_id: number }) =>
      `/${BASE_ENDPOINT_VERSION.V1}/player/referral_rebate/events/${params.event_id}/statement`
  },

  REFERRAL_WHEEL: {
    STATUS: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/status`,
    CURRENT: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/current`,
    MEMBER_INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/member/info`,
    PRIZE: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/prize`,
    SPIN: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/spin`,
    WINNERS: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/winners`,
    MEMBER_PRIZES: `/${BASE_ENDPOINT_VERSION.V1}/player/referral_wheel/member/prizes`
  },

  REPORT: {
    MONEY_HISTORY_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/money/history`,
    MONEY_HISTORY_TOTAL: `/${BASE_ENDPOINT_VERSION.V1}/player/center/money/history/total`,
    MONEY_PENDING_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/money/pending`,
    MONEY_PENDING_CANCEL: `/${BASE_ENDPOINT_VERSION.V1}/player/center/money/pending/cancel`
  },

  S3: {
    GET_UPLOAD_URL: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/s3/upload-url`
  },

  SETTING: {
    GET_SETTING: `/${BASE_ENDPOINT_VERSION.V1}/player/settings`
  },

  SHAREHOLDER: {
    MY_REPORT: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/performance`,
    MY_REPORT_SUMMARY: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/performance/summary`,
    MY_REPORT_DETAIL: (params: { entry_id: number }) =>
      `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/entries/${params.entry_id}/statement`,
    YESTERDAY_REPORT: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/game/finance/statistics`,
    GET_TIME_RANGE_TEAM_OVERVIEW: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/team/overview/period`,
    GET_TEAM_OVERVIEW: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/team/overview`,
    INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/i18n`,
    LATEST: `/${BASE_ENDPOINT_VERSION.V1}/player/shareholders/latest`
  },

  SITE: {
    GET_SITE: `/${BASE_ENDPOINT_VERSION.V1}/player/user/site`,
    LOGO_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/logos/list`,
    TRAFFIC_VIEW: `/${BASE_ENDPOINT_VERSION.V1}player/traffic/view`,
    PROXY_DISPLAY: `/${BASE_ENDPOINT_VERSION.V1}/player/displays/group/proxy`
  },

  USER_INFO: {
    MEMBER_SUMMARY: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/member/summary`,
    MEMBER_CENTER_KYC: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/kyc/submit`,
    MEMBER_COLUMN: `/${BASE_ENDPOINT_VERSION.V1}/player/user/customize_column/list`,
    MEMBER_AGENT_QUOTA_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/quota/list`,
    MEMBER_AGENT_QUOTA: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/quota`,
    MEMBER_AGENT_QUOTA_MONEY_HISTORY: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/report/money_history`,
    MEMBER_AGENT_CUSTOMIZE_COLUMN: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/customize_column/list`,
    MEMBER_AGENT_REFERRAL_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/dropdown/recommender`,
    MEMBER_AGENT_TAG_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/dropdown/label`,
    MEMBER_AGENT_INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/member`,
    MEMBER_AGENT_REPORT: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/member/overview`,
    MEMBER_TEAM_AGENT_REPORT: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/member/overview/list`,
    MEMBER_AGENT_BET_REPORT: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/report/member_bet_report`,
    MEMBER_AGENT_WAGER_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/report/member_wager_list`,
    MEMBER_AGENT_WAGER_DETAIL: `/${BASE_ENDPOINT_VERSION.V1}/player/center/credit_member_agent/report/member_wager_history`,

    INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/center/basic/info`,
    ACCOUNT_INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/center/basic/info/customize`,
    SET_USER_INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/center/basic/info`,
    BET_HISTORY_TOTAL: `/${BASE_ENDPOINT_VERSION.V1}/player/center/bet/history/total`,

    LEVEL_INFO: `/${BASE_ENDPOINT_VERSION.V1}/player/levels/list`,

    USER_WITHDRAW_PASSWORD: `/${BASE_ENDPOINT_VERSION.V1}/player/center/withdrawal_password`,
    USER_WALLET_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/wallets`,
    USER_ACTIVE_WALLET: `/${BASE_ENDPOINT_VERSION.V1}/player/center/wallets/use`,
    USER_REMARK: `/${BASE_ENDPOINT_VERSION.V1}/player/center/remark`,
    USER_KYC: `/${BASE_ENDPOINT_VERSION.V1}/player/center/kyc/upload`,
    USER_KYC_WITH_TYPE: `/${BASE_ENDPOINT_VERSION.V1}/player/center/kyc`,
    USER_KYC_WITH_TYPE_ONBOARDING: `/${BASE_ENDPOINT_VERSION.V1}/player/auth/onboarding/kyc`,
    USER_KYC_RECORD: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/kyc/history`,
    USER_AVATAR: `/${BASE_ENDPOINT_VERSION.V1}/player/center/upload/head_shot`,
    USER_PASSWORD: `/${BASE_ENDPOINT_VERSION.V1}/player/center/password`,

    KYC_STATUS: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/kyc/status`,
    KYC_STATUS_ONBOARDING: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/auth/onboarding/kyc/status`,

    TRANSFER_BONUS_WALLET: `/${BASE_ENDPOINT_VERSION.V1}/player/wallet/transfer/bonus`,

    BONUS_TRANSFER_STATUS: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/wallet/bonus-transfer/status`,
    BONUS_TRANSFER: `/${BASE_ENDPOINT_VERSION.PLATFORM}/player/wallet/bonus-transfer`
  },

  USER_PREFERENCES: {
    EXCLUSION: `/${BASE_ENDPOINT_VERSION.V1}/player/center/preferences/exclusion`,
    BET_LIMIT_STATUS: `/${BASE_ENDPOINT_VERSION.V1}/player/center/member_self_bet_restriction`,
    BET_LIMIT_STATUS_LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/center/member_self_bet_restriction/list`
  },

  VIP: {
    LIST: `/${BASE_ENDPOINT_VERSION.V1}/player/levels`,
    USER_STATISTIC: `/${BASE_ENDPOINT_VERSION.V1}/player/center/statistics`
  }
} as const
