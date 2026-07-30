import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"

interface CmsImageItem {
  img_path?: string
  img_base64?: string
  updated_time?: number
}

export function useCmsImage() {
  const { buildImageUrl } = useDynamicImage()

  /**
   * 優先使用 img_path，如果不存在或為空則使用 img_base64
   * @param item 包含圖片信息的對象
   * @returns 圖片 URL 或 base64
   */
  const getCmsImageSource = (item: CmsImageItem): string => {
    if (item.img_path) {
      return buildImageUrl(
        item.img_path,
        item.updated_time || Date.now(),
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.CMS_ENTRANCE)
      )
    }

    if (item.img_base64) {
      if (item.img_base64.startsWith("data:")) {
        return item.img_base64
      } else {
        return `data:image/jpeg;base64,${item.img_base64}`
      }
    }

    return ""
  }

  return {
    getCmsImageSource
  }
}
