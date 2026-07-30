import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

export interface UserKycProfileInfo {
  [key: string]: any
  first_name: string
  middle_name: string
  last_name: string
  nationality: string
  date_of_birth: string
  place_of_birth: string
  document_type: string
  source_of_income: string
  nature_of_work: string
}

export interface UserKycAddressInfo {
  [key: string]: any
  type: string
  postal_code: string
  city: string
  address_line_1: string
  floor: string
}

export interface UserKycDocumentInfo {
  [key: string]: any
  type: string
  side: string
  storage_key: string
}

export interface UserKycInfoForm {
  [key: string]: any
  profile: UserKycProfileInfo
  addresses: UserKycAddressInfo[]
  documents: UserKycDocumentInfo[]
}

export type SetMemberCenterKycParamsType = UserKycInfoForm
export type SetMemberCenterKycRequestType = UserKycInfoForm

// 會員中心KYC (新版KYC)
export const setMemberCenterKyc = (params: SetMemberCenterKycParamsType) => {
  return requestFn<SetMemberCenterKycRequestType, EmptyType>(ENDPOINT_PATHS.USER_INFO.MEMBER_CENTER_KYC, params, {
    name: "setMemberCenterKyc",
    method: "post"
  })
}
