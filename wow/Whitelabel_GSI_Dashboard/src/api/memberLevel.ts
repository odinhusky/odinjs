import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { SETTLEMENT_CYCLE } from "@/utils/constants"
import { get, post, put, deleteData } from "@/utils/request"

export const getMemberLevelSettings = async () => {
  return get<Response.GetMemberLevelList>("levels/member", null, {
    name: "getMemberLevelSettings"
  })
}

export const getLevelSettings = async () => {
  return get<Response.GetMemberLevelList>(
    "levels",
    {},
    {
      name: "getLevelSettings"
    }
  )
}
export const getCashLevelSettings = async (params: { currency_id: number }) => {
  return get<Response.GetMemberLevelList>("levels", params, {
    name: "getLevelSettings"
  })
}

export const getMemberLevelDetail = async (levelID: number) => {
  return get<Response.MemberLevelItem>(`member/level/${levelID}`, null, {
    name: "getMemberLevelDetail"
  })
}

export const getMemberLevelSingleDetail = async (levelID: number) => {
  return get<Response.MemberLevelItem>(`levels/${levelID}`, null, {
    name: "getMemberLevelSingleDetail"
  })
}

export const addMemberLevelSettings = async (params: Request.AddMemberLevel) => {
  return post("levels", params, {
    name: "addMemberLevelSettings"
  })
}

export const updateMemberLevelSettings = async (params: Request.updateMemberLevel) => {
  return put(`levels/${params.id}`, params, {
    name: "updateMemberLevelSettings"
  })
}
interface levelSetting {
  settlement_type: SETTLEMENT_CYCLE.Enums
  settlement_week: number
  auto_payout: boolean
  is_repeat: boolean
  can_skip: boolean
  promotion_condition: number
  audit_rate: number
  block_lebel: number[]
  wallet_type: number
  currentCurrency: number
}
export const updateMemberLevelDefaultSettings = async (params: levelSetting) => {
  return put(`levels/settings`, params, {
    name: "updateMemberLevelListSettings"
  })
}

export const getMemberLevelDefaultSettings = async () => {
  return get<Response.GetMemberLevelSetting>(
    `levels/settings`,
    {},
    {
      name: "getMemberLevelDefaultSettings"
    }
  )
}

export const deleteMemberLevelSettings = async (levelID: number) => {
  return deleteData(`levels/${levelID}`, null, {
    name: "deleteMemberLevelSettings"
  })
}

export const getMemberLevelList = async () => {
  return get<Response.GetMemberLevelList>("levels/dropdown", null, {
    name: "getMemberLevelList"
  })
}
