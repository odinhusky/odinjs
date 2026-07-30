import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface DeleteBankCardParamsType {
  id: number
}

export type DeleteBankCardRequestType = DeleteBankCardParamsType

export const deleteBankCard = (params: DeleteBankCardParamsType) => {
  return requestFn<DeleteBankCardRequestType, EmptyType>(`${ENDPOINT_PATHS.BANK.BANK_CARD}/${params.id}`, params, {
    name: "deleteBankCard",
    method: "delete"
  })
}
