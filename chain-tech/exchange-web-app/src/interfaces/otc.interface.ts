import { Coin } from "./exchange.interface";

export interface Advertisement {
    id: string;
    createdDate: number;
    owner: string;
    status: number;
    type: number;
    cryptoAsset: string;
    fiatCurrency: string;
    priceType: number;
    price: number;
    totalTradingAmount: number;
    orderLimitMin: number;
    orderLimitMax: number;
    payments: PaymentInfo[];
    paymentTimeLimit: number;
    terms: string;
    conditionRegisteredDays: number;
    conditionCompleteOrders: number;
}

export interface Privilege {
    name: string;
    describe: string;
}

export interface Wallet {
    id: string;
    coins: Coin[];
}

export interface AdvertiserLevel {
    id: number;
    isSpecial: boolean;
    name: string;
    deposit: number;
    maxAmountPerOrder: number;
    maxAmountPerDay: number;
    conditionCompleteUsers: number;
    conditionCompleteOrders: number;
    conditionCompleteAmount: number;
    conditionCompleteRate: number;
}

export interface OtcUser {
    account: string;
    nickName?: string;
    roles: string[];
    privileges: Privilege[];
    forbiddens: string[];
    buyFeeRate: number;
    sellFeeRate: number;
    wallet: Wallet;
    advertiserDeposit?: number;
    advertiserLevel?: AdvertiserLevel;
}

export interface PaymentInfo {
    id: string;
    type: string;
}

export interface OtcOrder {
    id: string;
    createdDate: number;
    advertisement: string;
    buyUser: string;
    sellUser: string;
    buyFeeRate: number;
    sellFeeRate: number;
    status: number;
    cryptoAsset: string;
    fiatCurrency: string;
    price: number;
    quantity: number;
    amount: number;
    paymentTimeLimit: number;
    payments: PaymentInfo[];
    payment?: PaymentInfo;
    buyUserCheckDate: number;
    sellUserCheckDate?: number;
    payDate?: number;
    confirmDate?: number;
    cancelDate: number;
    appealDate?: number;
    cancelAppealDate?: number;
    cancelUser?: string;
    appealUser?: string;
    cancelAppealUser?: string;
}

export interface CryptoAsset {
    name: string
}

export interface FiatCurrency {
    name: string
}

export interface AdvertisementLevel {
    id: number;
    isSpecial: boolean;
    name: string;
    deposit: number;
    maxAmountPerOrder: number;
    maxAmountPerDay: number;
    conditionCompleteUsers: number;
    conditionCompleteOrders: number;
    conditionCompleteAmount: number;
    conditionCompleteRate: number;
}

export interface AdvertisementCondition {
    completeUsers: number;
    completeOrders: number;
    completeAmount: number;
    completeRate: number;
}

export interface OtcOrderDayReportInfo {
    fee: number
    quantity: number
}

export interface UserOtcOrderReport {
    completeOrders30daysCount: number;
    completeOrders30daysRate: number;
    averageConfirmTime30days: number;
    averagePayTime30days: number;
    accountCreatedTime: number;
    firstCompleteTime: number;
    completeUsers: number;
    buyCompleteOrdersCount: number;
    sellCompleteOrdersCount: number;
    completeAmount30days: number;
    buyCompleteAmount: number;
    sellCompleteAmount: number;
}