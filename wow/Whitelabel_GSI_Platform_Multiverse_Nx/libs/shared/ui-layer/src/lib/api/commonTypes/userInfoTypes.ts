import { GENDER_ENUMS } from "@shared-lib/constants/enums/gender"
import { KYC_STATUS_CODE_ENUMS } from "@shared-lib/constants/enums/kycStatusCode"
import { KYC_TYPE_ENUMS } from "@shared-lib/constants/enums/kycType"
import { KYC_VERIFIED_ENUMS } from "@shared-lib/constants/enums/kycVerified"
import { LOGIN_PROVIDER_ENUMS } from "@shared-lib/constants/enums/loginProvider"

export interface UserInfoBaseParamsType {
  single: boolean
  is_customize: boolean
  real_name: string
  nickname: string
  gender: GENDER_ENUMS
  date_of_birth: string
  contact: {
    contact1: string
    contact2: string
  }
  email: string
  avatar_path: string
  show_avatar: boolean //頭像顯示隱藏
  self_exclusion_at?: number | null
  login_provider?: LOGIN_PROVIDER_ENUMS
}

export interface PasswordBaseParamsType {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface KycItemWithType {
  img: string
  type: KYC_TYPE_ENUMS
  correspondence: number
}

export interface KycListWithType {
  imgs?: KycItemWithType[]
}

export interface KycRecordResponseItem {
  number: number
  comment: string
  status: KYC_STATUS_CODE_ENUMS
}

export type KycRecordResponseItemList = KycRecordResponseItem[]

export interface KycRecordResponseList {
  list: KycRecordResponseItemList
  trace_id: string
  timestamp: number
}

export interface UserKycResponseItem {
  id: number
  img: string
  type: KYC_TYPE_ENUMS
  status: KYC_STATUS_CODE_ENUMS
  correspondence: number
  updated_time: number
  updated_at: number
  fileName: string
}

export type UserKycResponseList = UserKycResponseItem[]

export interface GetKYCStatusBaseResponseType {
  status: KYC_VERIFIED_ENUMS
}

export type MemberAgentQuotaItem = {
  member_id: number
  member_account: string
  hierarchy_level: number
  balance: string
  remain_quota_amount: string
  is_member_agent: boolean
  is_direct_downline: boolean
  is_downline_search_available: boolean
  register_date: number
  last_login_date: number
}

export type MemberAgentQuotaList = MemberAgentQuotaItem[]

export type MemberAgentQuotaListData = {
  list: MemberAgentQuotaList
  offset: number
  size: number
  total: number
}

export interface MemberAgentPamramsType {
  is_enabled: boolean
  is_member_agent: boolean
  is_blocked: boolean
  [key: string]: any
}
