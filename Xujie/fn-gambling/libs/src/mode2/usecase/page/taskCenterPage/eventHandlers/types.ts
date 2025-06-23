export enum MissionActionType {
  NOTHING = 'NOTHING', // 無行為
  NAVTOHALL = 'NAVTOHALL', // 每日任務action go 都去首頁
  BindPhone = 'BindPhone', // 綁定手機號碼
  SetupLoginPassword = 'SetupLoginPassword', // 設定登入密碼
  LoginOfficialApp = 'LoginOfficialApp', // 下載安裝並登入APP
  BindInviteCode = 'BindInviteCode', // 綁定邀請碼
  BindBankCard = 'BindBankCard', // 首次綁定銀行卡
  FirstSuccessDeposit = 'FirstSuccessDeposit', // 首次充值
  FinishDepositTutorial = 'FinishDepositTutorial', // 充值教學
  FirstSuccessWithdrawal = 'FirstSuccessWithdrawal', // 首次提現
  RedeemCouponCode = 'RedeemCouponCode', // 兌換優惠碼
  ShareReferralLink = 'ShareReferralLink', // 分享推薦連結
}
