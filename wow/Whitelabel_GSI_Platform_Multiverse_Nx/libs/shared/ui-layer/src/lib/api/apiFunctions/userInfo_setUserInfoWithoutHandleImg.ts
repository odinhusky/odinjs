import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { UserInfoBaseParamsType } from "@shared-lib/api/commonTypes/userInfoTypes"
import { GENDER_ENUMS } from "@shared-lib/constants/enums/gender"

export interface SetUserInfoWithoutHandleImgParamsType {
  [key: string]: any
  single: boolean
  is_customize: boolean
  fullname: string // 真實姓名
  nickname: string // 暱稱
  dob: string // 生日
  gender: GENDER_ENUMS // 性別
  country: string // 國碼
  phone: string // 電話
  email: string // 電子郵箱
  gaming_site: number // 遊戲場地
  sns_account_1: string // 通訊軟體1
  sns_account_2: string // 通訊軟體2
  nationality: string // 國籍
  place_of_birth: string // 出生地
  present_address: string // 現居地址
  permanent_address: string // 永久地址
  nature_of_work: string // 工作性質
  source_of_income: string // 收入來源
  self_exclusion_at?: number | null
  approval_status: boolean
}

export type SetUserInfoWithoutHandleImgRequestType = UserInfoBaseParamsType

// !! 注意：此 function 傳入的 Params 以及 Request 的參數不相同，且與 setUserInfo 、setUserInfoWithoutParamsLimit 為相同的 API 路徑

// 對應原本的名稱為 setUserInfo2
export const setUserInfoWithoutHandleImg = (params: SetUserInfoWithoutHandleImgParamsType) => {
  const formData = JSON.parse(JSON.stringify(params))
  formData.gender = Number(formData.gender)

  return requestFn<SetUserInfoWithoutHandleImgRequestType, EmptyType>(
    ENDPOINT_PATHS.USER_INFO.SET_USER_INFO,
    formData,
    {
      name: "setUserInfoWithoutHandleImg",
      method: "put"
    }
  )
}
