import { useCms } from "src/common/composables/useCms"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed } from "vue"

export function useFooterListCms() {
  const { buildImageUrl, transformCmsHtmlContent } = useDynamicImage()
  const { nowLang } = useLanguage()
  const { cmsFooterSettingsList } = useCms()

  const cmsFooterLogos = computed(() => {
    if (!cmsFooterSettingsList?.value?.length) {
      return []
    }
    return cmsFooterSettingsList.value[0]?.Setting?.logo_sort?.map(
      (e: string) =>
        buildImageUrl(
          e,
          cmsFooterSettingsList.value![0].Setting.updated_time,
          squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.FOOTER_LOGO)
        )
    )
  })

  const cmsFooterTextContent = computed(() => {
    if (!cmsFooterSettingsList?.value?.length) {
      return null
    }

    const pageList = cmsFooterSettingsList.value[0]?.Page?.filter(
      (e: { lang: LANGUAGE_TYPE.Enums; title: string; content: string }) => e.lang === nowLang.value
    )

    if (pageList.length) {
      pageList[0].content = transformCmsHtmlContent(pageList[0].content)
      return pageList[0]
    }

    return null
  })

  return {
    cmsFooterLogos,
    cmsFooterTextContent,
  }
}
