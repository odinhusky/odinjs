// user
export const LOGIN_URL = '/v1/api/player/login'; // 登入
export const POST_PLAYER_MAIN_INFO_URL = '/v1/api/playerMain/mainInfo'; // 玩家資訊
export const LOGOUT_URL = '/v1/api/player/logout'; // 登出
export const REGISTER_URL = '/v1/api/player/register'; //注冊
export const POST_PLAYER_SEND_OPT_URL = '/v1/api/player/sendOpt';
export const FORGET_PWD_URL = '/v1/api/player/forgetPassword'; // 忘記密碼
// export const POST_GET_SMOBILES_URL = '/v1/api/apk/smobiles'; // Evan 相同資料已經從 /v1/api/home 回應 [ServicesMobiles]，先移除
export const POST_GET_CAPTCHA_URL = '/v1/api/captcha';
export const POST_HOME_URL = '/v1/api/home';
export const POST_PLAYER_INFORMATION_SAVE_URL =
  '/v1/api/player/information/save';
export const POST_CHANGE_PASSWORD_URL = '/v1/api/player/password';
export const POST_PLAYERRE_REMOVE_CACHE_URL = '/v1/api/player/removeLevelCache';
// export const POST_PLAYER_AUTH_SEND_OPT_URL = '/v1/api/player/authSendOpt';
// export const POST_GE = '/v1/api/apk/getIsLogin';
// export const POST_PLAYER_TKEXP_URL = '/v1/api/player/tkExp';
// export const POST_GETGP_URL = '/v1/api/apk/getGp';
// export const POST_GET_VERSION_URL = '/v1/api/apk/version';
// export const POST_GET_APPLE_VERSION_URL = '/v1/api/apk/appleVersion';
// export const POST_PLAYER_BINDMAIL_URL = '/v1/api/player/bindMail';
// export const POST_ACCOUNT_FORGET_FUND_PASSWORD_URL =
//   '/v1/api/account/forget-fund-password';
// export const POST_SERVICE_OFFICIAL_URL = '/v1/api/service/official';
// export const POST_GET_RES_AREA_URL = '/v1/api/res-area';
// export const POST_PACKAGE_CONFIG_URL = '/v1/api/package/config';
// export const POST_PLAYER_UPDATE_BALANCE_URL = '/v1/api/player/updateBalance';
// export const POST_ANNOUNCEMENT_GROUP_URL = '/v1/api/announcement/group';
// export const POST_PLAYER_UPDATE_NICKNAME_URL = '/v1/api/player/updateNickname';
// export const POST_ANNOUNCEMENT_AGENT_URL = '/v1/api/announcement/agent';

// team
export const POST_PROMOTE_HOME_URL = '/v1/api/promote/home';
export const POST_VIP_HOME_URL = '/v1/api/vip/home';
export const POST_VIP_RECEIVE_BOX_URL = '/v1/api/vip/receive-box';
export const POST_VIP_RECEIVE_MONTHLY_AWARD_URL =
  '/v1/api/vip/receive-monthly-award';
export const POST_PROMOTE_DAILY_DETAIL_URL = '/v1/api/player/bet-rebate-detail';
export const POST_AGENT_TEAM_STATISTICS_URL = '/v1/api/agent/team-statistics';
// export const POST_PROMOTE_THIS_WEEK_REBATE_URL =
//   '/v1/api/promote/thisWeekRebate';
// export const POST_PROMOTE_TEAM_TOTAL_REBATE_URL =
//   '/v1/api/promote/teamTotalRebate';
// export const POST_PROMOTE_PLAYER_REBATE_URL = '/v1/api/promote/playerRebate';
// export const POST_PROMOTE_WEEK_REBATE_URL = '/v1/api/promote/weekRebate';
// export const POST_PROMOTE_TEAM_LOST_REBATE_URL =
//   '/v1/api/promote/teamLostRebate';
// export const POST_PROMOTE_INCOME_DETAILS_URL = '/v1/api/promote/incomeDetails';
// export const POST_PROMOTE_MEMBER_DETAILS_URL = '/v1/api/promote/memberDetails';
// export const POST_PROMOTE_RECEIVE_BOX_URL = '/v1/api/promote/receive-box';
// export const POST_PROMOTE_CONVERSION_URL = '/v1/api/promote/conversion';
// export const POST_PAY_BONUS_PAYOUT_URL = '/v1/api/pay/bonusPayout';
// export const POST_PROMOTE_BONUS_URL = '/v1/api/promote/bonus';
// export const POST_PROMOTE_BONUS_TRANSFER_URL = '/v1/api/promote/bonusTransfer';
// export const POST_VIP_RECEIVE_TURNOVER_REBATE_URL =
//   '/v1/api/vip/receive-turnover-rebate';
// export const POST_AGENT_HOME_URL = '/v1/api/agent/home';
// export const POST_AGENT_USERS_URL = '/v1/api/agent/users';
// export const POST_AGENT_DETAILS_URL = '/v1/api/agent/details';
// export const POST_AGENT_RECEIVE_URL = '/v1/api/agent/receive';
// export const POST_AGENT_MESSAGE_URL = '/v1/api/agent/message';
// export const POST_AGENT_MESSAGE_DELETE_URL = '/v1/api/agent/message-delete';
// export const POST_BLOGGER_HOME_URL = '/v1/api/blogger/home';
// export const POST_BLOGGER_DATA_URL = '/v1/api/blogger/data';
// export const POST_AGENT_CLOSE_POPUP_URL = '/v1/api/agent/close-popup';
// export const POST_PROMOTE_TOTAL_INCOME_DETAILS_URL =
//   '/v1/api/promote/total-income-details';

// record
export const POST_FUND_DETAIL_URL = '/v1/api/player/fund-detail';
export const POST_RECHARGE_RECORDS_URL = '/v1/api/recharge/records';
export const POST_WITHDRAW_RECORDS_URL = '/v1/api/withdraw/records';
export const POST_AGENT_WEEK_RANKING_URL = '/v1/api/agent/week-ranking';
export const POST_AGENT_WEEK_REWARD_CONFIG_URL =
  '/v1/api/agent/week-reward-config';
export const POST_ACTIVE_WEEK_RANKING_RECEIVE_URL =
  '/v1/api/active/week-ranking-receive';
// export const POST_RANK_PLAYER_WIN_URL = '/v1/api/ranking/player-win';
// export const POST_RANK_TURNOVER_NEW_URL = '/v1/api/ranking/turnover-new';

// main
export const POST_ANNOUNCEMENT_INFO_URL = '/v1/api/announcement';
export const POST_PLAYER_BROADCAST_URL = '/v1/api/palyer-broadcast';
// export const POST_ADD_INFO_URL = '/v1/api/ad';
// export const POST_JACKPOT_INFO_URL = '/v1/api/jackPot';

// info
export const POST_PLAYER_INFORMATION_URL = '/v1/api/player/information';
export const POST_PAY_RECHARGE_URL = '/v1/api/pay/recharge';
export const POST_WITHDRAW_CONFIG_URL = '/v1/api/pay/withdrawConfig'; // TODO deprecated 不使用，直前端計算 [min ~ max]
export const POST_RECHARGE_INTO_GAME_URL = '/v1/api/game/recharge-into-game';
export const POST_REPORT_GAME_TYPE_BET_AMOUNT_URL =
  '/v1/api/player/reportGameTypeBetAmount';
export const POST_STATISTICS_PLAYER_URL = '/v1/api/statistics/player';
export const GET_EVENT_TOKENS_URL = '/v2/api/event-tokens';
export const POST_PLAYER_UPDATE_AVATAR_URL = '/v1/api/player/updateAvatar';
// export const POST_ACCOUNT_SAVE_URL = '/v1/api/account/save';
// export const POST_RECHARGE_ACCOUNT_SAVE_URL = '/v1/api/recharge/account/save';
// export const POST_ACCOUNT_GET_URL = '/v1/api/account/get';
// export const POST_ACCOUNT_UPDATE_URL = '/v1/api/account/update';
// export const POST_RECHARGE_ACCOUNT_UPDATE_URL =
//   '/v1/api/recharge/account/update';
// export const POST_ACCOUNT_FORGET_URL = '/v1/api/account/forget-fund-password';
// export const POST_WITHDRAW_PRODUCTS_URL = '/v1/api/pay/withdrawProducts';
// export const POST_PLAYER_UPDATE_URL = '/v1/api/player/updateNickname';
// export const POST_PLAYER_AVATARS_URL = '/v1/api/player/avatars';
// export const POST_PAY_BANKINFO_URL = '/v1/api/pay/bankInfo';
// export const POST_PAY_ENDORDER_URL = '/v1/api/pay/endOrder';
// export const POST_PLAYER_EMAIL_URL = '/v1/api/player/email';
// export const POST_PAY_BANKTYPE_URL = '/v1/api/pay/bankType';
// export const POST_VIPSMOBILES_URL = '/v1/api/apk/vipsmobiles';
// export const POST_GIFT_ORIENTATION_URL = '/v1/api/gift/orientation';

// export const POST_GIFT_MESSAGE_URL = '/v1/api/gift/message';
// export const POST_GIFT_DELETE_URL = '/v1/api/gift/delete';
// export const POST_SIGNIN_PLAYER_URL = '/v1/api/signIn/player';
// export const POST_RECHARGE_BANK_SAVE_URL = '/v1/api/recharge/bank/save';

// game
export const POST_GAME_ENTER_URL = '/v1/api/game/enter';
export const POST_GAME_QUITE_URL = '/v1/api/game/quite';
export const POST_GAME_HOME_URL = '/v1/api/game/home';
export const POST_GAME_SEARCH_URL = '/v1/api/game/search';
export const POST_GAME_COLLECT_URL = '/v1/api/game/collect';
export const POST_GAME_COLLECTIONS_URL = '/v1/api/game/collections';
// export const POST_GAME_TYPES_URL = '/v1/api/game/types';
// export const POST_GAME_HOT_GAME_URL = '/v1/api/game/hotGame';
// export const POST_GAME_PLAY_HISTORY_URL = '/v1/api/game/playHistory';
// export const POST_GAME_PLATFORM_RECOMMENDED_URL =
//   '/v1/api/game/platform/recommended';
// export const POST_GAME_RECOMMENDED_URL = '/v1/api/game/recommended';
// export const POST_GAME_TYPE_PLATFORM_URL = '/v1/api/game/typePlatform';
// export const POST_GAME_INFOS_URL = '/v1/api/game/infos';
// export const POST_GAME_NEW_GAME_URL = '/v1/api/game/newGame';
// export const POST_GAME_PLATFORM_INFOS_URL = '/v1/api/game/platform-infos';
// export const POST_GAME_PAGE_URL = '/v1/api/game/page';

// active
export const POST_DOWNLOAD_AWARD_START_URL =
  '/v1/api/active/download-award-start';
export const POST_DOWNLOAD_RECEIVE_PRIZE_URL =
  '/v1/api/active/download-receive-prize';
export const POST_PIGGY_BANK_WITHDRAW_URL =
  '/v1/api/active/piggy-bank-withdraw';
export const POST_PIGGY_BANK_DETAIL_URL = '/v1/api/active/piggy-bank-detail';
export const POST_GIFT_RANDOM_URL = '/v1/api/gift/random'; // 禮品代碼兌換

// export const POST_TURN_RATE_CONFIG_URL = '/v1/api/active/turn-rate-config';
// export const POST_ACTIVE_NEW_PLAYER_URL = '/v1/api/active/new-player';
// export const POST_ACTIVE_TURN_RECEIVE_PRIZE_URL =
//   '/v1/api/active/turn-receive-prize';
// export const POST_ACTIVE_TURN_LOTTERY_URL = '/v1/api/active/turn-lottery';
// export const POST_RED_PACK_SHOW_URL = '/v1/api/active/red-packed-show';
// export const POST_RED_PACK_RECEIVE_URL = '/v1/api/active/red-packed-receive';
// export const POST_REMOVE_RED_REWARD_CACHE_URL =
//   '/v1/api/active/new-player/removeRedRewardCache';

// export const POST_LOGGER_EVENT_URL = '/v1/api/collection/log/frontend'; // TODO 封裝 RTK Query，走存 [fetchBatch]

// message
export const POST_MESSAGE_LIST_URL = '/v2/api/messaging/messages/page';
export const POST_MESSAGE_READ_URL = '/v2/api/messaging/messages/read';
export const POST_MESSAGE_UNREAD_COUNT_URL =
  '/v2/api/messaging/messages/unread/count';
export const POST_BIND_NOTIFY_TOKEN_URL = '/v1/api/notification/bind-token';

// wallet
export const GET_PAY_CHECKOUT_DETAIL_URL = '/v2/api/pay/checkout-detail';
export const POST_PAY_CHECKOUT_CONFIRM_URL = '/v2/api/pay/checkout-confirm';

export const POST_PAY_CONFIG_INFO_WITH_OPTIONS_URL =
  '/v1/api/pay/payConfigInfoWithOptions';

// event
export const POST_PLAYER_EVENT_REPORT_URL = '/v1/api/player/event/report';

// campaign
export const POST_CAMPAIGN_LIST_URL = '/v2/api/campaign/list';
export const POST_CAMPAIGN_LAUNCH_URL = '/v2/api/campaign/launch';

export const POST_COLLECTION_LOG_FRONTEND_URL =
  '/v2/api/collection/log/frontend';

// - Team Club 俱樂部相關 Start ===========
export const POST_TEAM_BET_REWARD_LIST_URL = '/v2/api/team/bet/reward/list';
export const POST_TEAM_DEPOSIT_REWARD_LIST_URL =
  '/v2/api/team/deposit/reward/list';
export const POST_TEAM_INVITATION_REWARD_LIST_URL =
  '/v2/api/team/invitation/reward/list';
export const POST_TEAM_INVITATION_TASK_REWARD_LIST_URL =
  '/v2/api/team/invitation/task/reward/list';

export const POST_TEAM_LEVEL_CONFIG_URL = '/v2/api/team/levelConfig';
export const POST_TEAM_REWARD_CLAIM_HISTORY_LIST_URL =
  '/v2/api/team/reward/claim/history/list';
export const POST_TEAM_REWARD_CLAIM_LIST_URL = '/v2/api/team/reward/claim/list';

export const POST_TEAM_COLLECT_REWARD_URL = '/v2/api/team/collectReward';
export const POST_TEAM_FINANCE_TIER_SUMMARY_LIST_URL =
  '/v2/api/team/finance/tier/summary/list';
export const POST_TEAM_INFORMATION_URL = '/v2/api/team/information';
export const POST_TEAM_INVITE_INFORMATION_URL =
  '/v2/api/team/inviteInformation';
export const POST_TEAM_MEMBER_SUMMARY_URL = '/v2/api/team/member/summary';

export const POST_INVITE_DAILY_CONFIG_URL = '/v2/api/invite/dailyConfig';
export const POST_INVITE_TEAM_REWARD_CONFIG_URL =
  '/v2/api/invite/teamRewardConfig';

// - Team Club 俱樂部相關 End ===========

// - Wheel 相關 Start ===========
export const POST_WHEEL_CONFIG_URL = '/v2/api/wheel/config';
export const POST_WHEEL_NEWS_TICKER_LIST_URL = '/v2/api/wheel/news-ticker/list';
export const POST_WHEEL_PLAYER_PROGRESS_URL = '/v2/api/wheel/player/progress';
export const POST_WHEEL_PLAYER_SPIN_URL = '/v2/api/wheel/player/spin';
export const POST_WHEEL_PLAYER_SPIN_HISTORY_LIST_URL =
  '/v2/api/wheel/player/spin/history/list';
// export const POST_WHEEL_PLAYER_SUMMARY_URL = '/v2/api/wheel/player/summary';

//參加拼多多輪盤活動
export const POST_INVITE_WHEEL_PARTICIPATE_URL =
  '/v2/api/wheel/inviteWheel/participate';
//拼多多轮盘主页资讯
export const POST_INVITE_WHEEL_PORTAL_INFO_URL =
  '/v2/api/wheel/inviteWheel/portalInfo';
//拼多多轮盘奖励纪录
export const POST_INVITE_WHEEL_REWARD_LIST_URL =
  '/v2/api/wheel/inviteWheel/rewardList';
// 轉輪盤
export const POST_INVITE_WHEEL_SPIN_URL = '/v2/api/wheel/inviteWheel/spin';
// 提領輪盤獎勵
export const POST_INVITE_WHEEL_WITHDRAW_URL =
  '/v2/api/wheel/inviteWheel/withdraw';
//拼多多轮盘奖励
export const POST_INVITE_WHEEL_WITHDRAW_LIST_URL =
  '/v2/api/wheel/inviteWheel/withdrawList';

export const POST_INVITE_WHEEL_NEWS_TICKER_LIST_URL =
  '/v2/api/wheel/inviteWheel/new-tickers';

// - Wheel 相關 End ===========

// - 上報 UTR 相關 Start ===========
export const POST_RECHARGE_QUERY_RECEIPT_URL = '/v2/api/recharge/queryReceipt'; // 查询订单收据明细
export const POST_RECHARGE_UPDATE_RECEIPT_URL =
  '/v2/api/recharge/updateReceipt'; // 充值订单异动收据资讯
export const POST_RECHARGE_UPLOAD_RECEIPT_URL =
  '/v2/api/recharge/uploadReceipt'; // 充值订单上传收据附件
// - 上報 UTR 相關 End ===========

// - 訪客模式 相關 Start ===========
export const POST_PLAYER_BIND_ACCOUNT_URL = '/v2/api/player/bindAccount'; //訪客帳戶綁定

export const POST_PLAYER_BIND_REFER_CODE_URL = '/v2/api/player/bindReferCode'; //邀請碼綁定
export const POST_PLAYER_VISITOR_LOGIN_CHECK_URL =
  '/v2/api/player/visitorLoginCheck'; //訪客模式登入檢核

// - 訪客模式 相關 End ===========

export const POST_PLAYER_OTP_LOGIN_URL = '/v2/api/player/otpLogin'; //一次性密碼登入

// - [V6] 新增 Start ===========
export const POST_WITHDRAW_OPTIONS_URL = '/v2/api/pay/withdrawOptions';
export const POST_UPDATE_GENDER_URL = '/v2/api/player/updateGender';
export const POST_VIP_REWARD_HISTORY_URL = '/v2/api/vip/reward-history';
export const POST_PROMOTE_START_PAGE_URL = '/v2/api/promote/start-page';
export const POST_TEAM_NOTICE_READ_URL = '/v2/api/team/notice/read';

export const POST_GAME_RECENT_PLAY_URL = '/v2/api/game/getRecentPlay';
export const POST_RECHARGE_DETAIL_URL = '/v2/api/recharge/detail';
export const POST_RECHARGE_CLAIM_TUTORIAL_REWARD_URL =
  '/v2/api/recharge/claimTutorialReward';

export const POST_TEAM_INVITATION_TASK_REWARD_CLAIM_URL =
  '/v2/api/team/invitation/task/reward/claim';
export const POST_TEAM_INVITATION_TASK_REWARD_CLAIM_ALL_URL =
  '/v2/api/team/invitation/task/reward/claimAll';

export const POST_ACTIVE_CLAIM_SURPRISE_REWARD_URL =
  '/v2/api/active/claimSurpriseReward';
export const POST_VIP_CLAIM_REBATE_URL = '/v2/api/vip/claimReBate';

export const POST_MESSAGES_CLAIM_URL = '/v2/api/messaging/messages/claim';
export const POST_MESSAGES_DELETE_ALL_READ_URL =
  '/v2/api/messaging/messages/delAllRead';
export const POST_MESSAGES_DELETE_URL = '/v2/api/messaging/messages/delete';

export const POST_RANKING_HISTORY_URL = '/v2/api/ranking/history'; //查詢前次排行榜

export const POST_RANKING_MY_REWARDS_URL = '/v2/api/ranking/myRewards'; //查詢自己的獎勵

export const POST_RANKING_ONGOING_URL = '/v2/api/ranking/ongoing'; // 查詢當前排行榜

export const POST_RANKING_RULES_URL = '/v2/api/ranking/rules'; // 排行榜規則

export const POST_PROMOTE_RANKING_JACKPOT_URL =
  '/v2/api/promote/ranking-jackpot'; // 排行榜彈窗資訊
export const POST_PROMOTE_WINNING_SHARE_URL = '/v2/api/promote/winning-share'; //赢钱推广
export const POST_PROMOTE_FIRST_CHARGE_URL = '/v2/api/promote/first-charge'; //首充
export const POST_PROMOTE_SURPRISE_REWARD_URL =
  '/v2/api/promote/surprise-reward'; //惊喜奖励
export const POST_PROMOTE_VIP_REBATE_URL = '/v2/api/promote/vip-rebate'; //每日返水
export const POST_PROMOTE_INVITE_WHEEL_URL = '/v2/api/promote/invite-wheel'; //邀請轉盤談窗

export const POST_MISSION_CLAIM_URL = '/v2/api/mission/claim'; // 领取任务奖励
export const POST_MISSION_CLAIM_BOX_URL = '/v2/api/mission/claimBox'; // 领取任务宝箱奖励
export const POST_MISSION_ONGOING_URL = '/v2/api/mission/ongoing'; // 取得个人任务资讯
export const POST_MISSION_TIP_NUMBERS_URL = '/v2/api/mission/tipNumbers'; // 取得任务完成提示
export const POST_MISSION_HISTORY_URL = '/v2/api/mission/history'; // 取得任务完成提示
export const POST_PROMOTE_DAILY_MISSION_URL = '/v2/api/promote/daily-mission'; // 每日任务弹窗
export const POST_PROMOTE_NEW_PLAYER_BONUS_URL =
  '/v2/api/promote/new-player-bonus'; // 新人福利弹窗

export const POST_RECHARGE_TUTORIAL_STATUS_URL =
  '/v2/api/recharge/tutorialStatus'; // 支付教程活动状态
// - [V6] 新增 End ===========

export const POST_REPORT_COLLECTION_BEHAVIOR_URL =
  '/v2/api/collection/log/behavior';

export const POST_PIXEL_EVENT_URL = '/v2/api/event/pixel';
export const POST_EVENT_ADJUST_PATCH_URL = '/v2/api/event/adjust-patch';
export const POST_GAME_ALL_URL = '/v2/api/game/all';
export const POST_DEVICE_EVENT_URL = '/v2/api/device/event';

export const PUT_MMP_UPDATE_URL = '/v2/api/mmp/update';
export const POST_PAY_BROKEN_CONFIG_URL = '/v2/api/pay/broken/config'; // 破产充值优惠奖励选项
export const POST_PAY_BROKEN_RECHARGE_URL = '/v2/api/pay/broken/recharge'; //破产充值

export const POST_PAY_ADDON_CONFIG_URL = '/v2/api/pay/addOn/config'; //取得附加加值资讯
export const POST_PAY_ADDON_POSTPONE_URL = '/v2/api/pay/addOn/postponeAddOn'; //推迟附加加值弹窗
export const POST_PAY_INBOX_CONFIG_URL = '/v2/api/pay/inbox/config'; //站内信充值优惠奖励选项
export const POST_PAY_INBOX_RECHARGE_URL = '/v2/api/pay/inbox/recharge'; //站内信充值

export const POST_BROKEN_BOX_INFO_URL = '/v2/api/broken/box/information'; //取得破产宝箱奖励资讯

export const POST_BROKEN_BOX_CLAIM_URL = '/v2/api/broken/box/claim'; // 领取破产宝箱奖励

export const POST_PROMOTE_PRIZE_WHEEL_URL = '/v2/api/promote/prize-wheel'; // 大獎輪盤
export const POST_WHEEL_PRIZE_SPIN_URL = '/v2/api/wheel/prize/spin'; // 大獎輪盤spin
