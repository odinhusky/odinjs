import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { GENDER_ENUMS } from "@shared-lib/constants/enums/gender"
import { LOGIN_PROVIDER_ENUMS } from "@shared-lib/constants/enums/loginProvider"

export interface GetAccountInfoResponseType {
  account: string // 帳號
  ref_account: string // 推薦人
  invite_code: string // 推薦人
  fullname: string // 真實姓名
  nickname: string // 暱稱
  dob: string // 生日
  gender: GENDER_ENUMS // 性別
  country: string // 國碼
  phone: string // 電話
  email: string // 電子郵箱
  sns_account_1: string // 通訊軟體1
  sns_account_2: string // 通訊軟體2
  nationality: string // 國籍
  place_of_birth: string // 出生地
  present_address: string // 現居地址
  permanent_address: string // 永久地址
  nature_of_work: string // 工作性質
  source_of_income: string // 收入來源
  gaming_site: number // 遊戲場地
  empty_password: boolean
  has_withdrawal_password: boolean
  avatar_path: string
  self_exclusion_at: number | null
  member_level: number
  approval_status: boolean
  login_provider?: LOGIN_PROVIDER_ENUMS // 會員註冊的方式
  login_type?: LOGIN_PROVIDER_ENUMS // 當前會員登入的方式
  middle_name: string
  last_name: string
  city: string
  country_name: string
  region: string
  province: string
  area: string
  postal_code: string
  job_type_details: string
  income_source_details: string
  sms_otp: string
  is_member_agent: boolean
  is_sub_ad: boolean
  registered_ip: string // 註冊IP
  cert_expiry_date: string
  uid: string | number
  [key: string]: any // 其他自訂欄位
}

// 取得會員資訊（包含自訂欄位）
// 對應 function 為 getUserInfo2 以及 getAccountInfo
export const getAccountInfo = () => {
  return requestFn<EmptyType, GetAccountInfoResponseType>(ENDPOINT_PATHS.USER_INFO.ACCOUNT_INFO, null, {
    name: "getAccountInfo",
    method: "get"
  })
}
