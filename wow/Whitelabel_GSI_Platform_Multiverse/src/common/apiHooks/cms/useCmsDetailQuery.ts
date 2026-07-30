import { getCmsDetailFull } from "src/api/cms"
import type * as Response from "src/api/response.type"
import { useApiQuery } from "src/common/apiHooks/useApiQuery" // 你的泛用 hook
import { useEnv } from "src/common/hooks/useEnv"
import {
  CMS_ARRANGEMENT,
  CMS_ENTRANCE_SORT,
  CMS_DISPLAY_LOGIN,
  CMS_DISPLAY_DEVICE,
  CMS_OPENING_METHOD,
} from "src/common/utils/constants"
import {
  useDynamicImage,
  DYNAMIC_IMAGE_DISPLAY_SIZE,
  squareCoverTransform,
} from "src/common/composables/useDynamicImage"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import type { UseQueryReturnType } from "@tanstack/vue-query"
import { FIVE_MINUTES } from "src/common/utils/constants/durationTime"
import { cloneDeep } from "src/common/utils/cloneDeep"
import { QUERY_KEY } from "src/common/utils/constants/queryKeys"
import type { UseQueryOptions } from "@tanstack/vue-query"
import { filterUnsupportedCmsItem } from "./filterUnsupportedCmsEntrance"

// 建立預設的 CmsItem 物件
const defaultCmsItem: Response.CmsItem = {
  id: 0,
  url_id: 0,
  Setting: {
    lang: {},
    comfirm_button_lang: {},
    reject_button_lang: {},
    icon_path: "",
    img_lang: {},
    icon_lang: {},
    contact_lang: {},
    contact_img_lang: {},
    selected_icon_path: "",
    payload: {
      arrangement: CMS_ARRANGEMENT.Enums.SINGLE_COLUMN,
      entrance_sort: CMS_ENTRANCE_SORT.Enums.CUSTOM,
      display_login: CMS_DISPLAY_LOGIN.Enums.NO_RESTRICTIONS,
      display_device: CMS_DISPLAY_DEVICE.Enums.NO_RESTRICTIONS,
      opening_method: CMS_OPENING_METHOD.Enums.NEW_TAB,
      row_show_mob: 1,
      row_show_pc: 1,
      view_all: 0,
      arrangement_row_pc: 1,
      arrangement_row_mob: 1,
      product_integration_id: 0,
      product_entrance_type: 0,
    },
    logo_sort: [],
    pop_up_img: [],
    updated_time: 0,
  },
  Entrance: [],
  Page: [],
}

type CmsDetailQueryOptions = Omit<
  UseQueryOptions<
    ApiResponse<Response.CmsItem>, // TQueryFnData
    Error,
    Response.CmsItem, // TData (您的 select 是回傳 CmsItem，不是 CmsItem[])
    any[]
  >,
  "queryKey" | "queryFn"
>

export interface UseCmsDetailQueryType {
  id: number
  options?: CmsDetailQueryOptions
}

/**
 * 宣告式的 Hook，專門用於取得並「轉換」CmsDetail
 * @param id number
 * @param options TanStack Query 選項 (例如 { enabled: false })
 */
export function useCmsDetailQuery({
  id,
  options = {},
}: UseCmsDetailQueryType): UseQueryReturnType<Response.CmsItem, Error> {
  const { envData } = useEnv()
  const { buildImageUrl } = useDynamicImage()

  const query = useApiQuery<typeof getCmsDetailFull, Response.CmsItem>(
    [QUERY_KEY.CMS_DETAIL, QUERY_KEY.CMS_SPECIFIC_DETAIL(id)], // TQV Query Keys
    getCmsDetailFull, // API 函數
    id, // API payload
    {
      staleTime: 0, // 每次都重新請求 API
      gcTime: 0, // 不保留快取

      // 關閉持久化
      meta: {
        persist: false,
      },

      ...options,

      select: (response: ApiResponse<Response.CmsItem>): Response.CmsItem => {
        if (!response.data) {
          console.warn(`[useCmsDetailQuery] API for Id: ${id}, returned status:true but no data.`)
          return cloneDeep(defaultCmsItem) // 回傳預設的 CmsItem 物件，避免後續操作崩潰
        }

        const { data } = response

        // 把 handleCmsDetail 的所有轉換邏輯搬到這裡
        // 深拷貝數據，避免修改原始 API 響應
        const cmsDetail = cloneDeep(data)
        const filteredCmsDetail = filterUnsupportedCmsItem(cmsDetail)
        if (!filteredCmsDetail) {
          return cloneDeep(defaultCmsItem)
        }

        if (filteredCmsDetail?.Setting?.icon_path) {
          filteredCmsDetail.Setting.icon_path = buildImageUrl(
            filteredCmsDetail?.Setting?.icon_path,
            filteredCmsDetail?.Setting?.updated_time,
            squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ICON)
          )
        }

        if (filteredCmsDetail?.Entrance && Array.isArray(filteredCmsDetail?.Entrance)) {
          filteredCmsDetail?.Entrance?.forEach((entrance) => {
            if (entrance?.img_path) {
              entrance.img_path = buildImageUrl(
                entrance?.img_path,
                entrance?.updated_time,
                squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ENTRANCE)
              )
            }
          })
        }

        return filteredCmsDetail
      },
    }
  )

  // 回傳 TQV 的 query 物件
  // query.data 現在會是 'select' 轉換後的乾淨 list
  return query
}
