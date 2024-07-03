import { WithdrawEndpoint } from './WithdrawEndpoint';

const DOWN_LOAD_URL = '/japi/invite/api/finger/download'; //  取得apk下載連結

// user
const POST_REGISTER_URL = '/japi/user/register'; // 註冊
const POST_LOGIN_URL = '/japi/user/login'; // 登入
const POST_FORGET_PASSWORD_URL = '/japi/user/forget-password'; // 忘記密碼
const GET_VIP_INFO_URL = '/japi/user/vip-info'; // 取得VIP訊息
const GET_GAME_RECORD_URL = '/japi/report/api/user/game-records'; // 取得遊戲紀錄

// mail
const GET_MAIL_COUNT_URL = '/japi/user/mail/info'; // 取得未讀訊息數量
const POST_MAIL_READ_URL = (mailId: number) => `/japi/user/mail/read/${mailId}`; // 設定訊息為已讀
const GET_MAIL_LIST_URL = '/japi/user/mail/list'; // 取得訊息列表
const GET_NOTICE_MARQUEES_URL = '/japi/user/notice/marquees'; // 取得跑馬燈

// system
const GET_GLOBAL_CONFIG_URL = '/japi/user/global-config'; // 獲取全局配置
const GET_MAINTENANCE_URL = '/japi/user/maintenance-config'; // 取得維護資訊
const GET_RECHARGE_CONFIG_URL = '/japi/user/recharge-config'; // 取得充值配置

// payment
const POST_RECHARGE_URL = '/japi/user/recharge'; // 充值 (new)
const POST_WITHDRAW_URL = '/japi/user/withdraw'; // 提現 (new)
// const POST_RECHARGE_URL = '/prod-api/pay-service/recharge' // 充值 (old)
// const POST_WITHDRAW_URL = '/prod-api/payment/balance-less' // 提現 (old)

const GET_RECHARGE_RECORD_URL = '/japi/user/recharge-list'; // 取得充值紀錄
const GET_WITHDRAW_RECORD_URL = '/japi/user/withdraw-list'; // 取得提現紀錄
const GET_WITHDRAW_LIMIT_URL = '/japi/user/withdraw-limit'; // 取得提現限制
const GET_BANK_URL = '/japi/user/bank'; // 取得銀行資訊

// punch in
const POST_PUNCH_IN_URL = '/japi/user/punch-in'; // 簽到
const GET_PUNCH_IN_CONFIG_URL = '/japi/user/punch-in-config'; // 取得簽到配置

// 幸運輪盤相關 URL
const POST_LUCKY_WHEEL_SPIN_URL = '/japi/user/activity/lucky-wheel/spin';
const GET_LUCKY_WHEEL_CONFIG_URL = '/japi/user/activity/lucky-wheel';
const GET_USER_LUCKY_WHEEL_RECORDS_URL =
  '/japi/user/activity/lucky-wheel/records';
const GET_OTHER_USER_LUCKY_WHEEL_RECORDS_URL =
  '/japi/user/activity/lucky-wheel/records/notification';
const GET_LUCKY_WHEEL_LUCKY_VALUE_DETAIL_URL =
  '/japi/user/activity/lucky-wheel/lucky-value/detail';

// 寶箱相關URL
const GET_BOX_INFO_URL = '/japi/user/activity/box-invite'; // 寶箱獎勵活動資訊
const POST_BOX_CLAIM = '/japi/user/activity/box-invite/claim'; //領取寶箱邀請獎勵
const GET_BOX_INVITE_LIST_URL = '/japi/user/activity/box-invite/invitees'; // 下級邀請明細

const GET_USER_BALANCE_URL = '/japi/user/balance';
const GET_USER_BALANCE_SIMPLE_DATA_URL =
  '/japi/user/balance/querySimpleBalance';

const GET_USER_VIP_ALL_DISPLAY_URL = '/japi/user/vip/getAllDisplayVo';
const POST_SIGN_IN_RECORD_LIST_URL = '/japi/user/punch-in/histories';
const GET_USER_EXTRA_INFO_URL = '/japi/user/getExtraInfo';

const GET_USER_DAMA_PROCESS_URL = '/japi/user/dama_process';
const GET_USER_DAMA_URL = '/japi/user/getDama';

// const POST_PLAYER_UPDATE_URL = '/prod-api/player/update' // old
const POST_USER_UPDATE_URL = '/japi/user/update';

const GET_USER_INVITE_CONFIG_URL =
  '/japi/invite/userInvite/getUserInviteConfig';
const GET_USER_INVITE_REWARD_DATA_URL =
  '/japi/invite/userInvite/queryInviteRewardData';
const GET_USER_INVITE_UNSETTLE_REWARD_DATA_URL =
  '/japi/invite/userInvite/queryUnsettleInviteRewardData';
const GET_USER_INVITE_DAILY_REPORT_DATA_URL =
  '/japi/invite/userInvite/queryInviteDayReportData';
const GET_USER_INVITE_REWARD_RECORD_LIST_URL =
  '/japi/invite/userInvite/getRewardRecordList';

const GET_USER_GAME_LIST_URL = '/japi/user/game/getGameList';

// const POST_OTP_PING_URL = '/prod-api/otp/ping' // 請求OTP驗證碼 (old)
const POST_OTP_PING_URL = '/japi/user/otp'; // 請求OTP驗證碼 (new)

// for activity
const GET_ACTIVITY_LOBBY_URL = '/japi/user/activity/lobby';
const GET_ACTIVITY_LOSS_BENEFIT_URL = '/japi/user/activity/loss-benefit';
const GET_ACTIVITY_DAILY_CASHBACK_URL = '/japi/user/activity/daily-cashback';
const GET_ACTIVITY_HISTORY_URL = '/japi/user/activity/history';
const GET_ACTIVITY_HISTORY_RECORD_URL = '/japi/user/activity/history/record';
const POST_ACTIVITY_CLAIM_URL = (activityType: string) =>
  `/japi/user/activity/claim/${activityType}`;

const POST_ACTIVITY_DOWNLOAD_REWARD_URL = '/japi/user/activity/download-reward';

const POST_EXTERNAL_GAME_START_URL = (gameBrand: string) =>
  `/exapi/external-game/game/${gameBrand}/startGame`;

// wallet
const POST_BIND_WITHDRAW_PASSWORD_URL = '/japi/user/bind_withdraw_password';
const POST_VERIFY_WITHDRAW_PASSWORD_URL = '/japi/user/verify_withdraw_password';
const GET_HAS_WITHDRAW_PASSWORD_URL = '/japi/user/has_withdraw_password';

//account
const POST_CHANGE_PHONE_URL = '/japi/user/change_phone';
const POST_CHANGE_LOGIN_PASSWORD_URL = '/japi/user/change_login_password';

export {
  DOWN_LOAD_URL,
  POST_FORGET_PASSWORD_URL,
  POST_REGISTER_URL,
  POST_LOGIN_URL,
  GET_VIP_INFO_URL,
  GET_GAME_RECORD_URL,
  GET_MAIL_COUNT_URL,
  POST_MAIL_READ_URL,
  GET_MAIL_LIST_URL,
  GET_NOTICE_MARQUEES_URL,
  GET_GLOBAL_CONFIG_URL,
  GET_MAINTENANCE_URL,
  GET_RECHARGE_CONFIG_URL,
  POST_RECHARGE_URL,
  POST_WITHDRAW_URL,
  GET_RECHARGE_RECORD_URL,
  GET_WITHDRAW_RECORD_URL,
  GET_WITHDRAW_LIMIT_URL,
  GET_BANK_URL,
  POST_PUNCH_IN_URL,
  GET_PUNCH_IN_CONFIG_URL,
  POST_LUCKY_WHEEL_SPIN_URL,
  GET_LUCKY_WHEEL_CONFIG_URL,
  GET_USER_LUCKY_WHEEL_RECORDS_URL,
  GET_OTHER_USER_LUCKY_WHEEL_RECORDS_URL,
  GET_LUCKY_WHEEL_LUCKY_VALUE_DETAIL_URL,
  GET_BOX_INFO_URL,
  POST_BOX_CLAIM,
  GET_BOX_INVITE_LIST_URL,
  GET_USER_BALANCE_URL,
  GET_USER_BALANCE_SIMPLE_DATA_URL,
  GET_USER_VIP_ALL_DISPLAY_URL,
  POST_SIGN_IN_RECORD_LIST_URL,
  GET_USER_EXTRA_INFO_URL,
  GET_USER_DAMA_URL,
  POST_USER_UPDATE_URL,
  GET_USER_INVITE_CONFIG_URL,
  GET_USER_INVITE_REWARD_DATA_URL,
  GET_USER_INVITE_UNSETTLE_REWARD_DATA_URL,
  GET_USER_INVITE_DAILY_REPORT_DATA_URL,
  GET_USER_INVITE_REWARD_RECORD_LIST_URL,
  GET_USER_GAME_LIST_URL,
  POST_OTP_PING_URL,
  POST_EXTERNAL_GAME_START_URL,
  GET_ACTIVITY_LOBBY_URL,
  GET_ACTIVITY_LOSS_BENEFIT_URL,
  GET_ACTIVITY_DAILY_CASHBACK_URL,
  GET_ACTIVITY_HISTORY_URL,
  GET_ACTIVITY_HISTORY_RECORD_URL,
  POST_ACTIVITY_CLAIM_URL,
  POST_ACTIVITY_DOWNLOAD_REWARD_URL,
  GET_USER_DAMA_PROCESS_URL,
  POST_BIND_WITHDRAW_PASSWORD_URL,
  POST_VERIFY_WITHDRAW_PASSWORD_URL,
  GET_HAS_WITHDRAW_PASSWORD_URL,
  POST_CHANGE_PHONE_URL,
  POST_CHANGE_LOGIN_PASSWORD_URL,
};
