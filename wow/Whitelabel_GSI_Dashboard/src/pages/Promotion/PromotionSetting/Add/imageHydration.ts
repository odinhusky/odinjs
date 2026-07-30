import type * as Request from "@/api/request.type"

const DATA_URL_IMAGE_PATTERN = /^data:image\/[a-zA-Z0-9.+-]+;base64,/

function isBase64PromotionImage(value?: string) {
  return Boolean(value && DATA_URL_IMAGE_PATTERN.test(value.trim()))
}

function stripResourceQuery(value: string) {
  return value.split("#")[0].split("?")[0]
}

function toPromotionStorageKey(value?: string) {
  if (!value) {
    return ""
  }

  const normalizedValue = value.trim()
  if (!normalizedValue || isBase64PromotionImage(normalizedValue)) {
    return ""
  }

  const strippedValue = stripResourceQuery(normalizedValue)
  if (/^https?:\/\//.test(strippedValue)) {
    try {
      return decodeURIComponent(new URL(strippedValue).pathname.replace(/^\/+/, ""))
    } catch (error) {
      return strippedValue
    }
  }

  return strippedValue.replace(/^\/+/, "")
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to convert blob to base64"))
    reader.readAsDataURL(blob)
  })
}

function resolvePromotionImageUrl(item: Request.PromotionInfo, dynamicResourceUrl: string) {
  const normalizedImage = item.image?.trim() ?? ""

  if (!normalizedImage) {
    return ""
  }

  if (normalizedImage.startsWith("blob:")) {
    return normalizedImage
  }

  if (/^https?:\/\//.test(stripResourceQuery(normalizedImage))) {
    return normalizedImage
  }

  const normalizedStorageKey = toPromotionStorageKey(item.storage_key || normalizedImage)
  if (!normalizedStorageKey) {
    return ""
  }

  return `${dynamicResourceUrl}/${normalizedStorageKey}`
}

export async function hydratePromotionImagesBeforeSubmit(
  info: Request.PromotionInfo[] = [],
  dynamicResourceUrl: string
) {
  await Promise.all(
    info.map(async (item) => {
      if (isBase64PromotionImage(item.image)) {
        return
      }

      const imageUrl = resolvePromotionImageUrl(item, dynamicResourceUrl)
      if (!imageUrl) {
        throw new Error(`Missing image source for ${item.lang}`)
      }

      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image for ${item.lang}: ${response.status}`)
      }

      item.image = await blobToDataUrl(await response.blob())
    })
  )
}
