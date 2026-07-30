import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

import { get, put } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"

export const getReferralWheel = (params: any) => {
  const { genTimeFormat } = useCommon()

  const payload = {
    date: params.start ? genTimeFormat(new Date(parseInt(params.start)), "yyyy-MM-dd'T'HH:mm:ss'Z'", false) : ""
  }

  return get<Response.GetReferralWheel>("/referral_wheel/", payload, {
    name: "getReferralWheel"
  })
}

export const exportReferralWheel = (id: number) => {
  return get<Response.ExportReferralWheel>(
    `referral_wheel/report/${id}`,
    {},
    {
      name: "exportReferralWheel"
    }
  )
}

export const getReferralWheelSpinCountLog = (params: Request.GetReferralWheelSpinCountLog) => {
  return get<Response.GetReferralWheelSpinCountLog>(`referral_wheel/spin_count/log`, params, {
    name: "getReferralWheelSpinCountLog"
  })
}

export const putReferralWheelMemberSpinCount = (member_id: number, params: Request.PutReferralWheelMemberSpinCount) => {
  return put(`referral_wheel/member/${member_id}/spin_count`, params, {
    name: "putReferralWheelMemberSpinCount"
  })
}

export const getReferralWheelList = () => {
  return get<Response.GetReferralWheelList>(
    "/referral_wheel/list",
    { size: "10" },
    {
      name: "getReferralWheelList"
    }
  )
}

export const getReferralWheelMember = (params: Request.GetReferralWheelMember) => {
  return get<Response.GetReferralWheelMember>("/referral_wheel/member", params, {
    name: "getReferralWheelMember"
  })
}
