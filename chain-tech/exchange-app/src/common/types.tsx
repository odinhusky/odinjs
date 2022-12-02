/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | any;
  Modal: undefined;
  NotFound: undefined;
  HomeScreen: undefined;
  MarketScreen: undefined;
  AllTradeScreen:undefined;
  TradeScreen: any;
  StopPositionScreen: { position: Position, remarkPrice: string};
  HistoryScreen: undefined;
  C2cScreen: {
    Id: string,
    CryptoAsset: string,
    fiatCurrency: string,
    Owner: string,
    SuccessRate: number,
    AvailableNum: string,
    LimitFrom: string,
    LimitTo: string,
    Price: string,
    Payments: [],
    PaymentTimeLimit: number
  };
  C2cBuyScreen: { from?: string };
  C2cSellScreen: { from?: string };
  C2cCreateScreen: undefined;
  C2cHistoryScreen: undefined;
  ProfileScreen: undefined;
  WalletScreen: undefined;
  Login: undefined;
  Member: undefined;
  Register: undefined;
  EmailVerify: undefined;
  Recharge: undefined;
  Withdraw: undefined;
  Funds: undefined;
  History: undefined;
  Setting: undefined;
  PhoneVerify: { phone: string };
  PhoneInput: undefined;
  GoogleVerifyStep1: undefined;
  GoogleVerifyStep2: undefined;
  GoogleVerifyStep3: undefined;
  IdentityVerifyStep1: undefined;
  IdentityVerifyStep2: { name: string, address: string, birth: number };
  FundPassword: undefined;
  Payments: undefined;
  PaymentsCreate: undefined;
  Advertisement: {
    ID: string,
    createDate: number,
    type: number,
    cryptoAsset: string,
    fiatCurrency: string,
    priceType: number,
    price: number,
    totalTradingAmount: number,
    orderLimitMin: number,
    orderLimitMax: number,
    payments: [],
    paymentTimeLimit: number,
    terms: string,
    conditionRegisteredDays: number,
    conditionCompleteOrders: number
  };
  AdvertisementEdit: undefined;
  Web: { url: string};
  Consult: undefined;
  C2c: undefined;
  C2cMember: undefined;
  C2cApply: undefined;
  C2cNotification: undefined;
  C2cHelp: undefined;
  EditName: undefined;
  Rebate: undefined;
  ForgotPassword: undefined;
  ResetPassword:undefined;
  ResetFundPassword:undefined;
  ResetGoogle:undefined;
  Announcement:undefined;
  AnnouncementDetail: { id: string}
  OtcFunds:undefined;
  AllLanguage:undefined;
  ContractHistory: undefined
  HelpCenter:undefined;
  HelpDetail: { id: string}
  HelpCenterEn:undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Home: undefined;
  Market: undefined;
  Trade: any;
  C2c: undefined;
  Wallet: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ContractSide = "BUY" | "SELL"

export type ContractType = "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET"

export type C2cOrderType = "buy" | "sell"

export type LanguageType = "tw" | "cn" | "en"

export type FutureStatus = "CREATE" | "TRADING" | "DEAL" | "CANCEL" | "FAIL"

export type WalletType = "spot" | " otc"