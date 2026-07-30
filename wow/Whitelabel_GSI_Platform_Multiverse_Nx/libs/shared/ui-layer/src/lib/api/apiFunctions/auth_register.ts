import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GENDER_ENUMS } from "@shared-lib/constants/enums/gender"

export interface RegisterParamsType {
  is_customize: boolean
  is_sub_ad?: boolean
  account?: string
  password?: string
  confirm_password?: string
  ref_account?: string
  invite_code?: string
  fullname?: string
  nickname?: string
  dob?: string
  gender?: number | null
  email?: string
  country?: string
  phone?: string
  gaming_site?: number | null
  customize_column?: {
    sns_account_1: string
    sns_account_2: string
    nationality: string
    place_of_birth: string
    present_address: string
    permanent_address: string
    nature_of_work: string
    source_of_income: string
  }
  [key: string]: any
}

export type RegisterRequestType = RegisterParamsType

export interface RegisterResponseType {
  id: string
  account: string
  nickname: string
  password: string
  agent_id: number
  ref_account?: number
  member_level: number
  real_name: string
  date_of_birth: string
  gender: GENDER_ENUMS
  phone: string
  email: string
  contact: {
    contact1: string
    contact2: string
  }
  enabled: boolean
  block: boolean
  created_at: string
  updated_at: string
}

export const register = (params: RegisterRequestType) => {
  return requestFn<RegisterRequestType, RegisterResponseType>(ENDPOINT_PATHS.AUTH.REGISTER, params, {
    name: "register",
    method: "post",
    needToken: false
  })
}
