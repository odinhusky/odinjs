import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ExtraField } from "@shared-lib/api/commonTypes/bankTypes"
import { FEE_TYPE_ENUMS } from "@shared-lib/constants/enums/feeType"

export interface WithdrawPaymentDetail {
  withdraw_min: string
  withdraw_max: string
  audit_rate: string
  fee_type: FEE_TYPE_ENUMS
  fee_amount: string
  fee_rate: string
  quick_amounts: string[]
  extra_field_key: string
  extra_field: {
    [key: string]: ExtraField[]
  }
}

export type WithdrawalPaymentDetailResponseType = WithdrawPaymentDetail

export const withdrawPaymentDetail = (id: number) => {
  return requestFn<EmptyType, WithdrawalPaymentDetailResponseType>(
    `${ENDPOINT_PATHS.BANK.WITHDRAW_PAYMENT_DETAIL}/${id}`,
    null,
    {
      name: "withdrawPaymentDetail",
      method: "get"
    }
  )
}
