interface Advertisement {
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

interface Privilege {
    name: string;
    describe: string;
}

interface Wallet {
    id: string;
    coins: Coin[];
}

interface AdvertiserLevel {
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

interface OtcUser {
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

interface PaymentInfo {
    id: string;
    type: string;
}

interface OtcOrder {
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

interface CryptoAsset {
    name: string
}

interface FiatCurrency {
    name: string
}

interface AdvertisementLevel {
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

interface AdvertisementCondition {
    completeUsers: number;
    completeOrders: number;
    completeAmount: number;
    completeRate: number;
}

interface OtcOrderDayReportInfo {
    fee: number
    quantity: number
}

interface UserOtcOrderReport {
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