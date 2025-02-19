export const BasePagePathObj = {
  HallPage: '/hall',
  ActivityPage: '/activity',
  InviteWheelPage: '/inviteWheel', // 邀請輪盤
  // Team Club
  TeamClubPage: '/teamClub', // 俱樂部主頁
  MyPage: '/my',

  LoginPage: '/login',
  WalletPage: '/wallet',
  InvitePage: '/invite',
  RecordPage: '/record',
  GameLobbyPage: '/gameLobby',
  GamePage: '/game',
  ChangePasswordPage: '/changePassword', //修改密码
  BindKYCPage: '/bindKYC', // 合併 Personal 以及 binding bank card
  MoreGamePage: '/moreGame',
  PolicyPage: '/policy',
  FeedBackPage: '/feedback',

  RewardsDetail: '/rewardsDetail',
  SubordinateDataPage: '/subordinateData',
  SharePage: '/share',
  // TeamClubRules: '/teamClubRules', // 俱樂部規則頁

  // Wheel
  RechargeWheelPage: '/rechargeWheel',
  RechargeWheelRecordsPage: '/rechargeWheelRecords', // 邀請輪盤

  ActivityRecordPage: '/activityRecord', // 记录
  GiftCodeRedeemPage: '/giftCodeRedeem', // 禮品代碼兌換頁面

  // UTR(交易明細) 上報功能
  FullOrderDetailPage: '/fullOrderDetail',

  // static
  OfficialWebsite: '/', // 官方網站
  PwaInstallGuide: '/pwaInstallGuide', // android 靜態網頁，引導安裝PWA，運營推廣，渠道推廣
  // 收銀台
  CustomizeCheckoutPage: '/checkout', // 自定義收銀台
  PopPage: '/pop', // 邀請頁面
  ActivityRulePage: '/activity-rule',

  AccountPage: '/account',
  WalletGuidePage: '/wallet-guide',
  SettingPage: '/setting',
  GameSupplierListPage: '/game-supplier-list',
  OrderDetailPage: '/order-detail',
} as const;

export const BasePagePathOrders: string[] = Object.values(BasePagePathObj);

export type BasePagePathObjKeyTypes = keyof typeof BasePagePathObj;
export type BasePagePaths =
  (typeof BasePagePathObj)[keyof typeof BasePagePathObj];
