import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface RegisterInputCustomParamsType {
  type: string
  mode?: string
}

// 電話國碼選項(+886 / +254 ...etc)
export interface CountryOption {
  label: string
  value: string | number
}

export type RegistInputCustomRequestType = RegisterInputCustomParamsType

export interface RegisterInputCustomItem {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: [] | CountryOption[]
  column_rule?: {
    enabled: boolean
    maxLength?: number
    minLength?: number
    requireNumber?: boolean
    requireSpecialChar?: boolean
    requireUpperLowerCase?: boolean
  }
}

export type RegistInputCustomList = RegisterInputCustomItem[]
export type RegistInputCustomResponseType = RegistInputCustomList

export const registInputCustom = (params: RegisterInputCustomParamsType) => {
  return requestFn<RegistInputCustomRequestType, RegistInputCustomResponseType>(
    ENDPOINT_PATHS.AUTH.REGISTER_CUSTOM_INPUT,
    params,
    {
      name: "registInputCustom",
      method: "get",
      needToken: false
    }
  )
}
