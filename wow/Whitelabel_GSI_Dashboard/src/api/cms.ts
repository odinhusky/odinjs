import { get, post, put, deleteData } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { ERROR_CODE, CURRENCY_TYPE, PROMOTION_REWARD_TYPE, EVENT_TYPE } from "@/utils/constants"
import { useCommon } from "@/hook/useCommon"
import { usePromotionStore } from "@/stores/promotionStore"
import { useLanguageStore } from "src/stores/languageStore"
import type { I18nTab } from "@/api/response.type"
import { format } from "date-fns"
import { clone } from "ramda"

type i18nKeys = keyof I18nTab<undefined>
const store = usePromotionStore()
const languageStore = useLanguageStore()
const currentLanguageKey = languageStore.currentLanguageOption.i18nKey as i18nKeys

export const getCmsList = async (params: Request.GetCmsList) => {
  return get<Response.CmsList>("cms/list", params, { name: "getCmsList", useLanguage: params?.lan })
}

export const getCmsDetail = async (id: number) => {
  return get<Response.GetPromotionDetail>(`cms/detail/${id}`, null, { name: "getCmsDetail" })
}

export const updateCmsItemSort = async (params: Request.UpdateCmsItemSort) => {
  return put(`cms/sort/${params.id}`, params, { name: "updateCmsItemSort" })
}

export const updateCmsItemStatus = async (params: Request.UpdateCmsItemStatus) => {
  return put(`cms/enabled/${params.id}`, { enabled: params.enabled }, { name: "updateCmsItemStatus" })
}

export const updateCmsItemPopup = async (params: Request.UpdateCmsItemPopup) => {
  return put(`cms/popup/${params.type}`, { popup: params.popup }, { name: "updateCmsItemPopup" })
}

export const editCmsItem = async (params: Request.CmsForm) => {
  return put(`cms/detail/${params.id}`, params, { name: "editCmsItem" })
}

export const addCmsItem = async (params: Request.CmsForm) => {
  return post(`cms`, params, { name: "addCmsItem" })
}

export const getCmsInternalList = async () => {
  return get<Response.CmsList>("internal_page/dropdown", {}, { name: "getCmsInternalList" })
}

export const getCmsWebIntroductionList = async () => {
  return get<Response.CmsList>("website_description/dropdown", {}, { name: "getCmsWebIntroductionList" })
}

export const delCmsItem = async (id: number) => {
  return deleteData<Response.GetPromotionDetail>(`cms/${id}`, null, { name: "delCmsItem" })
}

export const getCmsCustomPages = async () => {
  return get<Response.CmsList>("custom_page/dropdown", {}, { name: "getCmsCustomPageList" })
}

export const getFloaticon = (type: string) =>
  get<Response.CmsList>(`cms/features/floating-icon/main`, undefined, {
    usePlatform: true
  })

export const updateFloaticon = async (params: Request.CmsForm) => {
  return put(`cms/features/floating-icon/main`, params, { usePlatform: true })
}
