import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put, post, deleteData } from "@/utils/request"

export const addBannerSetting = (params: Request.TypeNewBannerForm) =>
  post("/banners", params, {
    name: "addBannerSetting"
  })
type BannerSetting = {
  id: number
  sorts: number
  title: string
  start_date: string
  end_date: string
  enabled: boolean
  position: number
  game_type: number
  product_code: number
  image_json: Record<string, string>
  created_at: string
  created_by: number
  updated_at: string
  updated_by: number
  link?: string
  opening_method?: number
}
type BannerSettingResponse = {
  data: BannerSetting[]
  code: number
  msg: string
}

type BannerGameType = {
  position: number
  game_type?: string
  product_code?: string
}
export const getBannerSettingList = async (params: BannerGameType) => {
  return get<BannerSettingResponse>(`/banners/list/${params.position}`, params, {
    name: "getBannerSettingList"
  })
}

export const deleteBannerSettingList = async (id: number) => {
  return deleteData(`banners/${id}`, null, { name: "deleteBannerSettingList" })
}

export type UpdateBannerSettingPayload = {
  id: number
  title: string
  start_date: string | number
  end_date: string | number
  position: number
  link?: string
  opening_method?: number
  images: Record<string, string>
}

export const updateBannerSetting = async (params: UpdateBannerSettingPayload) => {
  return put(`/banners/${params.id}`, params, {
    name: "updateBannerSetting"
  })
}

export const updateBannerSettingSort = async (params: { ids: number[]; sorts: number[] }) => {
  return put("/banners/sorts", params, {
    name: "updateBannerSettingSort"
  })
}

interface ImageItem {
  id: number
  agent_id: number
  logo_type: number
  path: string
  created_at: string
  updated_at: string
}

interface LogoSettingResponse {
  data: ImageItem[]
}
export const getWebsiteLogo = async () => {
  return get<LogoSettingResponse>(
    `/logo/list`,
    {},
    {
      name: "getWebsiteLogo"
    }
  )
}
export const updateWebsiteLogo = async (params: { logo_type: number; img: string }) => {
  return post("/logo", params, {
    name: "updateWebsiteLogo"
  })
}

export const getWebSiteRegSetting = async () => {
  return get<Request.webSiteRegSetting>(
    `/member_customize_column/list`,
    {},
    {
      name: "getWebSiteRegSetting"
    }
  )
}

export const updateWebSiteRegSetting = async (params: Request.webSiteRegSetting[]) => {
  const payload = {
    member_customize_columns: params
  }
  return put<Request.webSiteRegSetting[]>(`/member_customize_column`, payload, {
    name: "updateWebSiteRegSetting"
  })
}

export const getWebSiteRegSettingRule = async (id: number) => {
  return get<Request.webSiteRegSettingRule>(
    `/member_customize_column/column_rule/${id}`,
    {},
    {
      name: "getWebSiteRegSettingRule"
    }
  )
}
export const updateWebSiteRegSettingRule = async (params: Request.webSiteRegSettingRule) => {
  const payload = {
    ...params,
    column_rule: {
      ...params.column_rule,
      minLength: Number(params.column_rule.minLength),
      maxLength: Number(params.column_rule.maxLength)
    }
  }
  return put<Request.webSiteRegSettingRule[]>(`/member_customize_column/column_rule`, payload, {
    name: "updateWebSiteRegSettingRule"
  })
}
