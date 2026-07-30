export interface LoginResponseType {
  account: string
  access_token: string
  agent_id: number
  role_id: number
  user_id: number
  need_change_password: boolean
  need_update_profile: boolean
  is_maya_login: boolean
  maya_last_session_id: string
}

export interface GetOAuthUrlRequestType {
  redirect_url: string
}

export interface GetOAuthUrlResponseType {
  auth_url: string
}

export interface GetTotpStatusResponseType {
  is_enabled: boolean
  is_verified: boolean
}

export interface PostTotpEnableRequestType {
  passcode: string
}

export interface GetTotpGenerateResponseType {
  issuer: string
  account_name: string
  algorithm: string
  period: number
  digits: number
  secret: string
}
