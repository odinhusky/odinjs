import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { EmptyType } from "@shared-lib/api/commonTypes"

export interface GetFreeSpinListParamsType {
  currency_id: number
}

export type GetFreeSpinListRequestType = GetFreeSpinListParamsType

export interface FreeSpinItem {
  channel_code: string
  currency_code: string
  game_code: string
  game_name: string
  game_type: string
  game_type_id: number
  integration_id: number
  product_code: number
  product_name: string
  rounds: number
  [property: string]: any
}

export type FreeSpinList = FreeSpinItem[]

export interface GetFreeSpinListResponseType {
  list: FreeSpinList
}

export const getFreeSpinList = (params: GetFreeSpinListParamsType) => {
  return requestFn<GetFreeSpinListRequestType, GetFreeSpinListResponseType>(ENDPOINT_PATHS.FREE_SPIN.LIST, params, {
    name: "getFreeSpinList",
    method: "get"
  })
}
