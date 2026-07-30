import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { FUND_METHOD_TYPE_ENUMS } from "@shared-lib/constants/enums/fundMethodType"

export interface GetPaymentTypeListRequestDataType {
  currency_id?: number
}

export type GetPaymentTypeListRequestType = GetPaymentTypeListRequestDataType | undefined

export interface PaymentGateway {
  id: number
  name: string
  type?: number
  currency?: number
  remark?: string
  logo_image_id?: number
  payment_gateway_name?: string
  pg_code?: string
}

export interface GetPaymentTypeListResponseType {
  payment_type: FUND_METHOD_TYPE_ENUMS[]
  supported_payment_gateway: PaymentGateway[]
}

export const getPaymentTypeList = (params?: GetPaymentTypeListRequestType) => {
  return requestFn<GetPaymentTypeListRequestType, GetPaymentTypeListResponseType>(
    ENDPOINT_PATHS.BANK.PAYMENT_TYPE_LIST,
    params,
    {
      name: "getPaymentTypeList",
      method: "get"
    }
  )
}
