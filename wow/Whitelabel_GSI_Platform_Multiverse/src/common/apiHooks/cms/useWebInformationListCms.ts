import type * as Response from "src/api/response.type"
import { useCms } from "src/common/composables/useCms"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

export function useWebInformationListCms() {
  const route = useRoute()
  const { transformCmsHtmlContent } = useDynamicImage()
  const { nowLang } = useLanguage()
  const selectedWebInformationId = ref<number | null>(null)
  const { cmsWebInformationList } = useCms()

  const webInformationList = computed(() => {
    return cmsWebInformationList.value || []
  })

  const webInformationData = computed(() => {
    const websiteInformation = webInformationList.value || []
    if (!websiteInformation.length) return null

    // 先嘗試用 route 判斷
    const routeId = Number(route.params.id)
    let matchedItem = null

    // 先找 url_id
    if (routeId) {
      matchedItem = websiteInformation.find((item: Response.CmsItem) => item.url_id === routeId)
      // 如果 url_id 找不到，再往下找 id
      if (!matchedItem) {
        matchedItem = websiteInformation.find((item: Response.CmsItem) => item.id === routeId)
      }
    }

    // 如果版型以 modal 設計為主，則可以從外部 component 傳入參數
    if (!matchedItem && selectedWebInformationId.value !== null) {
      matchedItem = websiteInformation.find((item: Response.CmsItem) => item.id === selectedWebInformationId.value)
    }

    return matchedItem || websiteInformation[0]
  })

  const webInformationTitle = computed(() => {
    return webInformationData.value?.Page.find((pages: { lang: string }) => pages.lang === nowLang.value)?.title || ""
  })

  const webInformationContent = computed(() => {
    const content = webInformationData.value?.Page.find(
      (pages: { lang: string }) => pages.lang === nowLang.value
    )?.content

    if (content) {
      return transformCmsHtmlContent(content)
    }

    return ""
  })

  const setSelectedWebInformationId = (id: number) => {
    selectedWebInformationId.value = id
  }

  return {
    /** 設定網站說明頁id */
    setSelectedWebInformationId,

    /** cms web information 清單 */
    webInformationList,

    /** 網站說明資料 */
    webInformationData,

    /** 網站說明標題 */
    webInformationTitle,

    /** 網站說明內容 */
    webInformationContent,
  }
}
