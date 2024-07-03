import {PayloadAction, createSlice, createSelector, createDraftSafeSelector} from '@reduxjs/toolkit';
import { IUserStore } from '../gateway/socket';
import {AppLocalStorage} from "../persistant/localstorage";
import {RootState} from "./index";
import {AppLocalStorageKey} from "../persistant/AppLocalStorageKey";
import {environment} from "../../environments/environment";

interface ActivityItem {
  bannerContext: string;
  id: number;
  title:  string;
  type: string;
}
interface IMaintenance{
  flag: number;
  start: string;
  end: string;
}

interface ConfigData {
  // box_flag: number;
  current: string;
  forceUpdate: string;
  group_telegram: string;
  invite_hig_reward: number
  maintenance: IMaintenance;
  manager_telegram: string;
  recharge_bonus_start: number;
  recharge_cashback_rate: string;
  recharge_first_cashback_rate: string;
  reward_daily_reset: boolean;
  service_telegram: string;
  url_download: string;
  withdraw_begin: string;
  withdraw_end: string;
}
interface Config {
  invite_hig_reward?: number;
  recharge_cashback_rate?: string;
  recharge_first_cashback_rate?: string;
  reward_daily_reset?: boolean;
  recharge_bonus_start?: number;
  // box_flag?: number;
  config_data?: ConfigData;
}

export type ILoginUIStatusType = "login" | "register" | "forget";

export const QueueModalLang = {
  BOX_INVITE_REWARD: {
    upper: 'BOX_INVITE_REWARD', lower: 'box_invite_reward'
  },
  DAILY_CASHBACK: {
    upper: 'BET_REWARD', lower: 'bet_reward'
  },
  LOSS_RELIEF: {
    upper: 'LOSS_REWARD', lower: 'loss_reward'
  },
  INVITE_BONUS: {
    upper: 'INVITE_BONUS', lower: 'invite_bonus'
  },
  DEPOSIT: {
    upper: 'DEPOSIT', lower: 'deposit'
  },
};

export enum QueueModalEnum {
  BOX_INVITE_REWARD = 'box_invite_reward',
  DAILY_CASHBACK = 'bet_reward',
  LOSS_RELIEF = 'loss_reward',
  INVITE_BONUS = 'invite_bonus',
  DEPOSIT = 'deposit'
};


export type UILoading = {
  isLoading: boolean;
  loadingIcon?: string;
}

export type InitialState = {
  inNativeApp: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUserMoneyStatusLoading: boolean;
  isLogin: boolean;
  uILoading: UILoading;
  userStore?: IUserStore;
  isShowLoginModal: boolean;
  loginUIStatusType: ILoginUIStatusType;
  isShowMobileLogoutModal: boolean;
  isShowTelegramModal: boolean;
  isShowDepositModal: boolean;
  isShowInviteBonusModal: boolean;
  isShowMaintenanceModal: boolean;
  isShowTelegramDetailContactModal: boolean;
  isShowiOSDownloadPopover: boolean;
  isShowGameSearchModal: boolean;
  isShowBoxModal: boolean;
  isShowDailyCashBackModal: boolean;
  isShowLossReliefModal: boolean;
  messageCount: number;
  vip_level: number;
  globalMessage: null | string;
  withdrawBegin: string
  withdrawEnd: string;
  maintenance: IMaintenance;
  activityList: ActivityItem[] | [];
  config: Config;
  isReadyToShowDepositIntervalModal: boolean;
  isShowLuckyWheelLuckyValueDetailModal: boolean;
  isShowLuckyWheelLuckyValueInsufficientModal: boolean;
  isShowDownloadModal:boolean;
};

const userStore$3: IUserStore= {
  userAmount: 0,
  // setUserAmount: (amount: number) => {
  //   console.log("setUserAmount: " + amount)
  // }
  websocketTipsDialog: false,
  loadingShow: false,
  user: {
    token: "",
    withdrawAmount: 0,
  },
  userinfo: {
    vip_level: null,
  },
  rechargeInfo: "",
  rechargeSuccessDialog: false,
  messageInfo: "",
  popCount: 0,
  messageDialog: false,
  withdrawInfo: "",
  widthdrawSuccessDialog: false,
  isUpgrade: false,
  vipUpgrade: {
    show: false,
    totalReward: 0,
    upLevelList: undefined,
  },
  balances: {
    type1: 0,
    type2: 0,
    type3: 0
  },
}

const initialState: InitialState = {
  inNativeApp: false,
  globalMessage: null,
  vip_level: 0,
  uILoading: {isLoading: true},
  isUserMoneyStatusLoading: false,
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isLogin: !!AppLocalStorage.getItem(AppLocalStorageKey.token),
  loginUIStatusType: "register",
  userStore: userStore$3,
  isShowLoginModal: false,
  isShowMobileLogoutModal: false,
  isShowTelegramModal: false,
  isShowDepositModal: false,
  isShowInviteBonusModal: false,
  isShowMaintenanceModal: false,
  isShowTelegramDetailContactModal: false,
  isShowiOSDownloadPopover: false,
  isShowGameSearchModal: false,
  isShowBoxModal: false,
  isShowDailyCashBackModal: false,
  isShowLossReliefModal: false,
  messageCount: 0,

  withdrawBegin: "00:00",
  withdrawEnd: "00:00",
  maintenance: {
    flag: 0,
    start: "",
    end: "",
  },
  activityList: [],
  config: {
    invite_hig_reward: undefined,
    recharge_cashback_rate: undefined,
    recharge_first_cashback_rate: undefined,
    reward_daily_reset: undefined,
    recharge_bonus_start: undefined,
  },
  isReadyToShowDepositIntervalModal: false,
  isShowLuckyWheelLuckyValueDetailModal: false,
  isShowLuckyWheelLuckyValueInsufficientModal: false,
  isShowDownloadModal:false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGlobalMessage: (state: InitialState, action: PayloadAction<string | null>) => {
      state.globalMessage = action.payload;
    },
    setUILoading: (state: InitialState, action: PayloadAction<UILoading>) => {
      state.uILoading ={
          isLoading: action.payload.isLoading,
          loadingIcon: action.payload.loadingIcon
      };
    },
    setIsUserMoneyStatusLoading: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isUserMoneyStatusLoading = action.payload;
    },
    setIsLogin: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setUserVIPLevel: (state: InitialState, action: PayloadAction<number>) => {
      state.vip_level = action.payload;
    },
    setUserStore: (state: InitialState, action: PayloadAction<IUserStore>) => {
      state.userStore = action.payload;
    },
    showLoginDrawerOrModal:  (state: InitialState, action: PayloadAction<boolean>) => {
      // 如果未登入過，預設顯示註冊Modal
      if (action.payload) {
        let isOldUser = AppLocalStorage.getItem(AppLocalStorageKey.isOldUser)
        state.loginUIStatusType = isOldUser ? 'login' : 'register';
      }
      state.isShowLoginModal = action.payload;
    },
    setLoginUIStatusType: (state: InitialState, action: PayloadAction<ILoginUIStatusType>) => {
      state.loginUIStatusType = action.payload;
    },
    showMobileLogoutModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowMobileLogoutModal = action.payload;
    },
    setShowTelegramModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowTelegramModal = action.payload;
    },
    setShowDepositModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowDepositModal = action.payload;
    },
    setIsShowInviteBonusModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowInviteBonusModal = action.payload;
    },
    setShowMaintenanceModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowMaintenanceModal = action.payload;
    },
    setShowTelegramDetailContactModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowTelegramDetailContactModal = action.payload;
    },
    setIsReadyToShowDepositIntervalModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isReadyToShowDepositIntervalModal = action.payload;
    },
    setShowBoxModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowBoxModal = action.payload;
    },
    setShowDailyCashBackModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowDailyCashBackModal = action.payload;
    },
    setShowLossReliefModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowLossReliefModal = action.payload;
    },
    setIsShowLuckyWheelLuckyValueDetailModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowLuckyWheelLuckyValueDetailModal = action.payload;
    },
    setIsShowLuckyWheelLuckyValueInsufficientModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowLuckyWheelLuckyValueInsufficientModal = action.payload;
    },
    setIsMobile: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setIsTablet: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isTablet = action.payload;
    },
    setIsDesktop: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isDesktop = action.payload;
    },
    setMessageCount: (state: InitialState, action: PayloadAction<number>) => {
      state.messageCount = action.payload;
    },
    setWithdrawBegin: (state: InitialState, action: PayloadAction<string>) => {
      state.withdrawBegin = action.payload
    },
    setWithdrawEnd: (state: InitialState, action: PayloadAction<string>) => {
      state.withdrawEnd = action.payload
    },
    setMaintenance: (state: InitialState, action: PayloadAction<IMaintenance>) => {
      state.maintenance = action.payload
      if (Number(action.payload.flag) === 1) {
        state.isShowMaintenanceModal = true
      }
    },
    setShowiOSDownloadPopover: (state: InitialState, action: PayloadAction<boolean>) => {
     state.isShowiOSDownloadPopover = action.payload;
    },
    setShowGameSearchModal: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isShowGameSearchModal = action.payload;
    },
    setInNativeApp: (state: InitialState, action: PayloadAction<boolean>) => {
      state.inNativeApp = action.payload
    },
    setActivityList: (state: InitialState, action: PayloadAction<ActivityItem[] | []>) => {
      state.activityList = action.payload
    },
    setConfig: (state: InitialState, action: PayloadAction<Config>) => {
      state.config = action.payload
    },
    setShowDownloadModal: (state: InitialState, action: PayloadAction<boolean>) => {
     state.isShowDownloadModal = action.payload;
    },
  },
});

// 充值余额
export const type1Selector =  (state: RootState) => state.app?.userStore?.balances?.type1 || 0;

// 可提现余额
export const type2Selector = (state: RootState) => state.app?.userStore?.balances?.type2 || 0;

// 奖励余额
export const type3Selector = (state: RootState) => state.app?.userStore?.balances?.type3 || 0;

export const totalBalanceSheetSelector = createDraftSafeSelector(
  type1Selector,
  type2Selector,
  type3Selector,
  (type1, type2, type3) => parseFloat((type1 + type2 + type3).toFixed(2))
)
export const totalReasableSelector = createDraftSafeSelector(
  type2Selector,
  type3Selector,
  (type2, type3) => parseFloat((type2 + type3).toFixed(2))
)
export const toDepositAccountSwingSelector = createDraftSafeSelector(
  type1Selector,
  type2Selector,
  (type1, type2) => parseFloat((type1 + type2).toFixed(2))
)
export const toDepositAccountRemovableSelector = type2Selector

export const accountPromotedSwingSelector = type3Selector
export const accountPromotedWithdrawableSelector = type3Selector


