export enum AppLocalStorageKey {
  // device
  deviceId = "deviceId",

  // user
  kPhone = "kPhone",
  token = "token",
  userId = "userId",
  ip = "ip",
  userInfo = "userInfo",

  favoriteLocal = "favoriteLocal",
  favoriteLocalArr = "favoriteLocalArr",
  gameRecentLocal = "gameRecentLocal",

  useLazyGetUserVIPAllInfoQuery = "useLazyGetUserVIPAllInfoQuery",
  useGetVIPInfoMutation = "useGetVIPInfoMutation",

  // system
  telegramGroup = "telegramGroup",
  telegramService = "telegramService",
  telegramManager = "telegramManager",
  downloadUrl = "downloadUrl",

  // addToMobileShortcut
  hideAddToMobileShortcut = "hideAddToMobileShortcut",
   // 判断是否是新用户
   isOldUser = "isOldUser",
  // 活動用入口通知
  activityNotice = "activityNotice",
  // 邀请码
  inviteUrl = "inviteUrl",
  // 登入後是否要轉跳頁面
  loginRedirect = 'loginRedirect',
  loginRedirectParam = 'loginRedirectParam',
}
