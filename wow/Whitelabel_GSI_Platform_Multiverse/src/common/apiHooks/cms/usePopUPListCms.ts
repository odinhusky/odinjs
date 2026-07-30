import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, ref } from "vue"

export function usePopUPListCms() {
  const { buildImageUrl, transformCmsHtmlContent } = useDynamicImage()
  const { nowLang } = useLanguage()
  const { cmsPopupList } = useCms()

  //#region 彈窗管理
  const cmsPopupTitle = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return ""
    }

    const title = cmsPopupList?.value?.[0]?.Setting?.lang?.[nowLang.value as LANGUAGE_TYPE.Enums]

    if (title) {
      return transformCmsHtmlContent(title)
    }
    return ""
  })

  const cmsComfirmButtonLabel = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return ""
    }

    return cmsPopupList?.value?.[0].Setting?.comfirm_button_lang?.[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsRejectButtonLabel = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return ""
    }

    return cmsPopupList?.value?.[0]?.Setting?.reject_button_lang?.[nowLang.value as LANGUAGE_TYPE.Enums] || ""
  })

  const cmsPopupImgs = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return []
    }
    return cmsPopupList?.value?.[0]?.Setting?.pop_up_img?.map(
      (e: string) =>
        buildImageUrl(
          e,
          cmsPopupList?.value?.[0]?.Setting?.updated_time,
          squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.POPUP)
        )
    )
  })

  const cmsPopupAgreeList = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return []
    }

    return cmsPopupList?.value?.[0]?.Entrance?.filter((e: Response.CmsEntranceItem) => e.sort !== 0)?.map(
      (e: Response.CmsEntranceItem, i: number) => {
        let label = e.lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
        label = transformCmsHtmlContent(label)
        return {
          label: label,
          value: i,
        }
      }
    )
  })

  const cmsPopupCheckAgree = ref<number[]>([])

  const cmsPopupAgreeAllText = computed(() => {
    if (!cmsPopupList?.value?.length) {
      return ""
    }

    const agreeAllList = cmsPopupList?.value?.[0]?.Entrance?.filter((e: Response.CmsEntranceItem) => e.sort === 0)

    if (agreeAllList.length) {
      const agreeAllText = agreeAllList[0].lang[nowLang.value as LANGUAGE_TYPE.Enums] || ""
      return transformCmsHtmlContent(agreeAllText)
    }

    return ""
  })

  const cmsPopupCheckAllAgree = computed({
    get() {
      return cmsPopupAgreeList.value?.every((item) => cmsPopupCheckAgree.value.includes(item.value))
    },
    set(value: boolean) {
      if (value) {
        cmsPopupCheckAgree.value = cmsPopupAgreeList.value.map((item) => item.value)
      } else {
        cmsPopupCheckAgree.value = []
      }
    },
  })
  //#endregion

  return {
    /** 彈窗管理標題 */
    cmsPopupTitle,

    /** 彈窗管理確認按鈕標籤 */
    cmsComfirmButtonLabel,

    /** 彈窗管理拒絕按鈕標籤 */
    cmsRejectButtonLabel,

    /** 彈窗管理圖片*/
    cmsPopupImgs,

    /** 彈窗管理同意列表 */
    cmsPopupCheckAgree,

    /** 彈窗管理已同意項目 */
    cmsPopupAgreeList,

    /** 彈窗管理全部同意文字 */
    cmsPopupAgreeAllText,

    /** 彈窗管理全部同意 */
    cmsPopupCheckAllAgree,
  }
}
