import { requestFn } from "@shared-lib/api/axiosInterceptors"
import type { GAME_TYPE_ENUMS } from "@shared-lib/constants/enums/gameType"
import type { BANNER_POSITION_ENUMS } from "@shared-lib/constants/enums/bannerPosition"

export interface ReqBannerListParams {
  position: BANNER_POSITION_ENUMS
}

export interface Banner {
  code: number
  id: number
  agent_id: number
  sorts: number
  title: string
  start_date: string
  end_date: string
  enabled: boolean
  position: BANNER_POSITION_ENUMS
  product_code: number
  game_code: string
  game_type: GAME_TYPE_ENUMS
  image_json: Record<string, string>
  image_json_v2: Record<string, string>
  created_at: string
  created_by: number
  updated_at: string
  updated_by: number
  updated_time: number
  link: string
  opening_method: number
}

export type BannerList = Banner[]

export type GetBannerListRequestType = ReqBannerListParams
export type GetBannerListResponseType = BannerList

/**
 * 取得 Banner 列表 API
 * @param position - Banner 位置
 */
export const getBannerList = async (params: GetBannerListRequestType) => {
  return requestFn<GetBannerListRequestType, GetBannerListResponseType>("/v1/player/banners/list", params, {
    name: "getBannerList",
    method: "get"
  })
}
