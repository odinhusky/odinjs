import { put } from "@/utils/request"

export type ChangePasswordReq = {
  old_password: string
  new_password: string
  confirm_password: string
  google_otp: string
}

export type ChangePasswordReqKeys = keyof ChangePasswordReq

export const changePassword = (params: ChangePasswordReq) => put<string | null>("/user/password", params)
