import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ExtraField } from "@shared-lib/api/commonTypes/bankTypes"
import { FEE_TYPE_ENUMS } from "@shared-lib/constants/enums/feeType"

export interface ExtraRemark {
  id: number
  type: number
  titles: [
    {
      lang: string
      title: string
    }
  ]
  content?: string // 僅給前端動態輸入用
}

export interface DepositPaymentDetailResponseType {
  deposit_min: string
  deposit_max: string
  audit_rate: string
  fee_type: FEE_TYPE_ENUMS
  extra_field_key: string | null
  extra_field: {
    [key: string]: ExtraField[]
  } | null
  extra_remark: ExtraRemark[]
  quick_amounts: string[]
  fee_amount: string
  fee_rate: string
  usdt_rate: string | null
  bank_name: string
  bank_account_name?: string
  bank_account: string
  qrcode_image_id: number
  imgUrl?: string
  currency_brand: string
  chain: string
  wallet_address: string
  enable_first_deposit_check: boolean
  first_deposit_min: string
}

export const depositPaymentDetail = (id: number) => {
  return requestFn<EmptyType, DepositPaymentDetailResponseType>(
    `${ENDPOINT_PATHS.BANK.DEPOSIT_PAYMENT_DETAIL}/${id}`,
    null,
    {
      name: "depositPaymentDetail",
      method: "get"
    }
  )
}
