import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, put, patch, post } from "@/utils/request"
import { queryClient } from "@/query/queryClient"
import { useLanguage } from "src/composables/useLanguage"
import { useLanguageStore } from "src/stores/languageStore"
import { useEnv } from "src/hook/useEnv"
import type { productGameCode } from "@/api/product"

// 產品列表
export const getGameList = async (params?: Request.GetGameListV2) => {
  const payload: Request.GetGameListV2 = {
    integration_id: params?.integration_id,
    product_code: params?.product_code,
    product_name: params?.product_name,
    game_type: params?.game_type,
    currency_id: params?.currency,
    integration_status: params?.integration_status,
    status: params?.status,
    offset: params?.offset,
    size: params?.size
  }
  return get<Response.BaseList<Response.AgentProductList>>("/product", payload, {
    usePlatform: true,
    useLanguage: params?.lan
  })
}
// 產品類型下拉
export const getProductGameTypeV2 = async () => {
  return get<Response.ProductGameTypeList>(
    "/agent_game_type/all/list",
    {},
    {
      usePlatform: true
    }
  )
}

//第一層產品開關
export const updateProductState = (params: { ids: number[]; status: boolean }) =>
  patch<Response.GetMemberList>(`/product/status`, params, {
    usePlatform: true
  })

//更新有效投注計入比例
export const updateTurnoverRate = (params: { ids: number[]; turnover_rate: number }) =>
  patch(`/product/turnover_rate`, params, {
    usePlatform: true
  })

//更新產品現金錢包單注最高投注限制
export const updateCashMaxBet = (params: Request.UpdateProductCashMaxBet) =>
  patch<null>(`/product/cash_max_bet`, params, {
    usePlatform: true
  })

//更新產品贈金錢包開關
export const updateBonusSupport = (params: Request.UpdateProductBonusSupport) =>
  patch<null>(`/product/bonus_support`, params, {
    usePlatform: true
  })

//更新產品贈金錢包單注最高投注限制
export const updateBonusMaxBet = (params: Request.UpdateProductBonusMaxBet) =>
  patch<null>(`/product/bonus_max_bet`, params, {
    usePlatform: true
  })

//修改打開方式
export const uploadEntranceType = (params: {
  entrance_type: number
  integration_id: number
  product_code: number
  game_type: number
}) => {
  return patch<Response.GetMemberList>(`product/entrance_type`, params, {
    usePlatform: true
  })
}
// 產品設定列表第2層
export const getProductGameList = async (params?: Request.GetProductGameList) => {
  const payload: Request.GetProductGameList = {
    code: params?.code,
    name: params?.name,
    status: params?.status,
    game_type: params?.game_type,
    integration_id: params?.integration_id,
    product_code: params?.product_code,
    offset: params?.offset,
    size: params?.size
  }
  //產品排序搜尋用
  if (params?.keyword) {
    payload.name = params?.keyword
  }
  return get<Response.BaseList<Response.GameList>>("/product/game", payload, {
    usePlatform: true,
    useLanguage: params?.lan
  })
}

export const setProductPosition = async (params: { id: number; sort: number }) => {
  return patch(`/product/game/customize/${params.id}/sort`, params, {
    usePlatform: true
  })
}

//遊戲開關
export const updateProductGameState = (params: { ids: number[]; status: boolean }) =>
  patch<Response.GetMemberList>(`/product/game/status`, params, {
    usePlatform: true
  })

//遊戲hot
export const updateProductHot = (params: { ids: number[]; status: boolean }) =>
  patch<Response.GetMemberList>(`/product/game/hot`, params, {
    usePlatform: true
  })
//遊戲new
export const updateProductNewly = (params: { ids: number[]; status: boolean }) =>
  patch<Response.GetMemberList>(`/product/game/newly`, params, {
    usePlatform: true
  })

//產品管理入口圖
export const getEntranceMapList = async (params?: Request.GetEntranceMapList) => {
  const payload: Request.GetEntranceMapList = {
    integration_id: params?.integration_id,
    product_code: params?.product_code,
    product_name: params?.product_name,
    game_type: params?.game_type,
    offset: params?.offset,
    size: params?.size
  }
  //產品排序搜尋用
  if (params?.code) {
    payload.product_name = params?.code
  }
  return get<Response.BaseList<Response.GameList>>("/product/customize/list", payload, {
    usePlatform: true,
    useLanguage: params?.lan
  })
}

//CMS
//產品入口列表
export const getEntranceTypeList = async () => {
  return get<{ name: string; type: number }[]>(
    "/product/cms_dropdown/entrance_type",
    {},
    {
      usePlatform: true
    }
  )
}
//取得已簽署的集成i18n下拉選單
export const getIntegrationList = async () => {
  const languageStore = useLanguageStore()
  return get<{ name: string; id: number }[]>(
    "/product/cms_dropdown/integration",
    {},
    {
      usePlatform: true,
      useLanguage: languageStore.currentLanguage
    }
  )
}
//取得代理所有遊戲類型
export const getAgentGameTypeList = async (integration_id?: number | string) => {
  const payload = {
    integration_id: integration_id
  }
  return get<{ game_type: number }[]>("/agent_game_type/all/list", payload, {
    usePlatform: true
  })
}

//取得產品列表
export const getProductList = async (
  integration_id: number | string,
  game_type: number | string,
  entrance_type: number | string
) => {
  const payload = {
    integration_id: integration_id,
    game_type: game_type,
    entrance_type: entrance_type
  }
  return get<{ product_code: number; product_name: string; product_name_i18n: {} }[]>(
    "/product/cms_dropdown/agent_product",
    payload,
    {
      usePlatform: true
    }
  )
}

//遊戲上傳入口圖
export const uploadProductImage = async (params: Request.UploadPaymentImage) => {
  return post<Response.ProductImage>("product/game/customize/upload", params, {
    useFormData: true,
    usePlatform: true,
    name: "uploadProductImage"
  })
}
//更新遊戲入口圖
export const updateProductCustomize = (params: Request.ProductCustomFormV2) => {
  const { removePrefixDeep, envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const payload = {
    integration_id: params.integration_id,
    product_code: params.product_code,
    game_type: Number(params.game_type),
    game_code: params.game_code,
    customize: params.customize
  }
  let prePayload = removePrefixDeep(payload, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)

  return patch<Response.ProductImage>(`/product/game/customize`, prePayload, {
    usePlatform: true
  })
}

//產品管理入口圖上傳圖
export const uploadEntranceMapImage = async (params: Request.UploadPaymentImage) => {
  return post<Response.ProductImage>("product/customize/upload", params, {
    useFormData: true,
    usePlatform: true,
    name: "uploadProductImage"
  })
}
//更新產品入口圖
export const updateEntranceMapCustomize = (params: Request.ProductCustomFormV2) => {
  const { removePrefixDeep, envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const payload = {
    integration_id: params.integration_id,
    product_code: params.product_code,
    game_type: Number(params.game_type),
    customize: params.customize
  }
  //let prePayload = removePrefixDeep(payload, `https://wowdata.gpsriowdl.com/gsi/dev/devm/`)
  let prePayload = removePrefixDeep(payload, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
  return patch<Response.ProductImage>(`/product/customize`, prePayload, {
    usePlatform: true
  })
}
//更新產品排序
export const updateProductSort = async (params: Request.SetGameSort) => {
  return patch(`/product/sort`, params, {
    usePlatform: true
  })
}

//總代-產品
export const GetAgencyManagementProduct = async (params?: Request.GetAgentProductListV2) => {
  const payload: Request.GetAgentProductListV2 = {
    agent_id: params?.agent_id,
    integration_id: params?.integration_id,
    product_code: params?.product_code,
    product_name: params?.product_name,
    game_type: params?.game_type,
    currency_id: params?.currency,
    integration_status: params?.integration_status,
    is_active: params?.status,
    offset: params?.offset,
    size: params?.size
  }
  return get<Response.BaseList<Response.GameList>>("/product/agent_product", payload, {
    usePlatform: true,
    useLanguage: params?.lan
  })
}
//總代-產品開關
export const updateAgentProductState = (params: { ids: number[]; status: boolean }) =>
  patch<Response.GetMemberList>(`/product/agent_product/status`, params, {
    usePlatform: true
  })

//產品排序
export const getGameTypes = async () => {
  return get<Response.BaseList<Response.GameTypes>>("/product/sort", null, {
    usePlatform: true
  })
}

export const getProductV2Dropdown = async (params?: productGameCode) => {
  return queryClient.fetchQuery({
    queryKey: ["v2", "product", "dropdown", params ?? {}],
    queryFn: () =>
      get<Response.ProductDropdownList>("product/dropdown", params, {
        usePlatform: true
      })
  })
}
// cms遊戲清單
export const getCmsGameDropdown = async (params: {
  game_type?: number
  product_code?: number
  integration_id?: number
}) => {
  const payload = {
    //status: params?.status,
    game_type_id: params?.game_type,
    integration_id: params?.integration_id,
    product_code: params?.product_code
  }

  return get<Response.BaseList<Response.GameList>>("/product/game/dropdown", payload, {
    usePlatform: true
  })
}

// cms遊戲詳細
export const getCmsGameDetail = async (params: {
  game_type?: number
  product_code?: number
  integration_id?: number | string
  game_code?: string
}) => {
  const payload = {
    //status: params?.status,
    game_type: params?.game_type,
    integration_id: params?.integration_id,
    product_code: params?.product_code,
    game_code: params?.game_code
  }

  return get<Response.BaseList<Response.GameList>>("/product/game/customize", payload, {
    usePlatform: true
  })
}
