import { FinanceType } from "common/constant";
import { C2cOrderType, ContractSide, ContractType, FutureStatus, WalletType } from "common/types"

export interface LoginRequest {
    account: string,
    password: string
}

export interface RegisterRequest {
    account: string
    password: string
    password2: string
    inviteCode: string
}

export interface FavoriteSymbolRequest {
    symbol: string
}

export interface CreateFutureRequest {
    symbol: string,
    type: ContractType,
    price: number | null,
    origQty: number,
    side: ContractSide,
    stopPrice: number | null
}

export interface AdjustLeverageRequest {
    symbol: string
    leverage: number
}

export interface GetAdvertisementRequest {
    all?: boolean
    my?: boolean
    type?: "buy" | "sell"
    cryptoAsset?: string
    fiatCurrency?: string
}

export interface CreateOtcOrderRequest {
    id: string
    type: C2cOrderType
    orderInfo: OtcOrderInfo
}

export interface OtcOrderInfo {
    price: number
    quantity: number | null
    amount: number | null
    payments: PaymentId[] | null
}

export interface PaymentId {
    id: string
}

export interface PaidRequest {
    payment: PaymentId
}

export interface GetOtcOrderRequest {
    all?: boolean
    status?: string
    type?: C2cOrderType
    advertisement?: string
    buyUser?: string
    sellUser?: string
    startDate?: number
    endDate?: number
}

export interface ClosePositionRequest {
    positionId: string
}

export interface GetOwnFuturesRequest {
    status?: FutureStatus
    start?: number
    end?: number
}

export interface GetOwnFinanceRecordRequest {
    type: FinanceType
    start?: number
    end?: number
}

export interface VerifyPhoneRequest {
    phone: string
}

export interface checkPhoneRequest {
    phone: string
    code: string
}

export interface SetGoogleSecretRequest {
    code: string
}

export interface SendEmailRequest {
    email: string
}

export interface CheckEmailRequest {
    email: string
    code: string
}

export interface ResetFinancePasswordRequest {
    password: string
    mailCode: string
    phoneCode: string | null
    financePassword: string
}

export interface SetFinancePasswordRequest {
    originPassword: string
    password: string
}

export interface ResetPasswordRequest {
    current: string
    changed: string
}

export interface ResetGoogleSecretRequest {
    password: string
    mailCode: string
    phoneCode: string | null
    financePassword: string
}

export interface SpotContractTransferRequest {
    from: string
    to: string
    amount: string
}

export interface SpotOtcTransferRequest {
    sourceServer: WalletType,
    targetServer: WalletType,
    sourceUser: string,
    targetUser: string,
    symbol: string,
    value: string
}

export interface WithdrawRequest {
    amount: string
    address: string
}

export interface CancelFutureRequest {
    orderId: string
}

export interface GetStopPriceRequest {
    symbol: string,
    profitPrice?: string
    lossPrice?: string
}

export interface SetStopPriceRequest {
    symbol: string,
    profitPrice: string | null
    lossPrice: string | null
}

export interface CreateAdvertisementRequest {
    type: number
    cryptoAsset: string;
    fiatCurrency: string;
    priceType: number;
    price: string;
    totalTradingAmount: string;
    orderLimitMin: string;
    orderLimitMax: string;
    paymentTimeLimit: number;
    conditionCompleteOrders: number;
    conditionRegisteredDays: number;
    financePassword: string;
    terms?: string
    payments: PaymentId[] | null
}

export interface GetAnnouncementRequest {
    lang: string
    topic?: string
}

export interface GetOtcOrderDayReportRequest {
    all?: boolean
    status?: string
    type?: string
}

export interface UpdateOtcUserRequest {
    roles?: string[] | null
    buyFeeRate?: number | null
    sellFeeRate?: number | null
    nickName?: string | null
}

export interface RegisterRequest {
    account: string
    password: string
    password2: string
    inviteCode: string
}

export interface ForgotPasswordRequest {
    account: string
}

export interface CreatePaymentRequest {
    type: string
    name: string
    code: string
    account: string
}

export interface AgentApplicationRequest {
    name: string
    email: string
    phone: string
    telegram: string
    whatsapp: string
    other: string
    teamName: string
    teamPeopleNumber: string
    location: string
    description: string
}

export interface CheckAccountRequest {
    account: string
}