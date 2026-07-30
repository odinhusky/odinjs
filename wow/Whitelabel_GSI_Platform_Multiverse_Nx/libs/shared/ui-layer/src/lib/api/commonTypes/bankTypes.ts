import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"
import { DEPOSIT_REDIRECT_TYPE_ENUMS } from "@shared-lib/constants/enums/depositRedirectType"
import { DEPOSIT_REDIRECT_CHANNEL_ENUMS } from "@shared-lib/constants/enums/depositRedirectChannel"

// ----------------- PaymentList 相關 ----------------------
export interface TransferInfo {
  id: number
  group_id: number
  name: string
  type: FUND_METHOD_TYPE_ENUMS
  currency: number
  remark: string
  logo_image_id: number
  imgUrl?: string
}

export interface PaymentInfo {
  // 幣別，IDR、PHP、THB
  [key: string]: {
    // BankTransfer(銀行轉帳)，EWallet(三方轉帳)
    [key: string]: TransferInfo[]
  }
}

export interface PaymentList {
  list: PaymentInfo
  supported_currency: string[]
}

// ----------------------------------------------------------

export interface ExtraField {
  field_code: string
  field_name: string
  is_required: boolean
  type: number
  values: []
}

// ----------------- 上傳從API取得的資料 ----------------------
export interface UploadRemarkContent {
  base64: string
  path: string
  upload_at: string
}

export interface UploadRemark {
  content: Array<{ title: string; content: string }>
  images: UploadRemarkContent[]
}

export interface UploadDetailUpload {
  trans_code: string
  images: string[]
}

// ----------------- Deposit 相關 ----------------------
export interface DepositExtraRemark {
  id: number
  type: number
  content: string
}

export interface PapayaPay {
  account_name: string
  account_number: string
  bank_code: string
  [key: string]: string
}

export type DepositDynamicFieldPayload = Record<string, string>
export type DepositRequestDynamicValue =
  | string
  | number
  | string[]
  | DepositExtraRemark[]
  | PapayaPay
  | DepositDynamicFieldPayload
  | undefined

export interface DepositRequestType {
  amount: string
  group_id: number
  payment_gateway_id: number
  currency: string
  promotion_id: number
  papaya_pay?: PapayaPay
  [key: string]: DepositRequestDynamicValue
  extra_remark: DepositExtraRemark[]
  images: string[]
  return_url?: string
  failed_return_url?: string
}

export interface DepositCryptoWallet {
  wallet_address: string
  chain: string
  coin_symbol: string
  payable_amount: string
  settle_amount: string
}

export interface DepositResponseType {
  amount: string
  currency: string | number
  redirect_type: DEPOSIT_REDIRECT_TYPE_ENUMS
  redirect_content: string
  channel?: DEPOSIT_REDIRECT_CHANNEL_ENUMS | string
  crypto_wallet?: DepositCryptoWallet
  FinalCryptoRate?: number | null
  FinalCryptoAmount?: number | null
}
// ----------------- Maya 相關 ----------------------

export interface MayaBaseType {
  currency?: string
  amount: string
}
