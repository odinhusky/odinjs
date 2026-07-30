import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GENDER_ENUMS } from "@shared-lib/constants/enums/gender"
import { LOGIN_PROVIDER_ENUMS } from "@shared-lib/constants/enums/loginProvider"

export interface GetUserInfoResponseType {
  username: string
  real_name: string
  nickname: string
  email: string
  phone: string
  gender: GENDER_ENUMS
  date_of_birth: string
  invite_code: string
  contact: {
    contact1: string
    contact2: string
  }
  empty_password?: boolean
  member_level?: number
  has_withdrawal_password?: boolean
  avatar_path: string
  show_avatar: boolean //頭像顯示隱藏
  self_exclusion_at: number | null
  approval_status: boolean
  login_provider?: LOGIN_PROVIDER_ENUMS // 會員註冊的方式
  login_type?: LOGIN_PROVIDER_ENUMS // 當前會員登入的方式
  is_member_agent: boolean
}

export const getUserInfo = () => {
  return requestFn<EmptyType, GetUserInfoResponseType>(ENDPOINT_PATHS.USER_INFO.INFO, null, {
    name: "getUserInfo",
    method: "get"
  })
}
