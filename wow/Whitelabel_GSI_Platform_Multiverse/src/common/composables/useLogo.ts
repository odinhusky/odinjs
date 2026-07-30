import { useFavicon } from "@vueuse/core"
import { computed } from "vue"
import { getLogoList } from "src/api/site"
import { useApi } from "src/common/hooks/useApi"
import {
  coverImageTransform,
  DYNAMIC_IMAGE_DISPLAY_SIZE,
  squareCoverTransform,
  useDynamicImage,
  type DynamicImageTransformParams,
} from "src/common/composables/useDynamicImage"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { LOGO_TYPE } from "src/common/utils/constants"
import { useLogoStore } from "src/stores/logoStore"

export function useLogo() {
  const { logoState, setStoreLogoList } = useLogoStore()
  const { buildImageUrl } = useDynamicImage()
  const { isMobile } = useMediaQuery()

  const wideLogoTransform = computed<DynamicImageTransformParams>(() =>
    isMobile.value
      ? coverImageTransform(
          DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_WIDE_MOBILE_WIDTH,
          DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_WIDE_MOBILE_HEIGHT
        )
      : coverImageTransform(
          DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_WIDE_DESKTOP_WIDTH,
          DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_WIDE_DESKTOP_HEIGHT
        )
  )

  const squareLogoTransform = computed<DynamicImageTransformParams>(() =>
    squareCoverTransform(
      isMobile.value
        ? DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_SQUARE_MOBILE
        : DYNAMIC_IMAGE_DISPLAY_SIZE.LOGO_SQUARE_DESKTOP
    )
  )

  function buildLogoUrl(path?: string, version?: string | number, transform?: DynamicImageTransformParams) {
    if (!path) return ""
    return buildImageUrl(path, version, transform)
  }

  const wideLogoUrl = computed(() => {
    const logo = logoState.map[LOGO_TYPE.Enums.Wide]
    if (!logo) return ""
    return buildLogoUrl(logo.path, logo.updated_time, wideLogoTransform.value)
  })

  const squareLogoUrl = computed(() => {
    const logo = logoState.map[LOGO_TYPE.Enums.Square]
    if (!logo) return ""
    return buildLogoUrl(logo.path, logo.updated_time, squareLogoTransform.value)
  })

  function getWideLogo() {
    return wideLogoUrl.value
  }

  function getSquareLogo() {
    return squareLogoUrl.value
  }

  async function handleLogoList() {
    const { status, data } = await useApi(getLogoList)

    if (status) {
      setStoreLogoList(data)
      const favicons = data.filter((e) => e.logo_type >= LOGO_TYPE.Enums.Pixel16)
      if (favicons.length) {
        const icon = buildLogoUrl(
          favicons[0].path,
          favicons[0].updated_time,
          squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.FAVICON)
        )
        if (icon) {
          useFavicon(icon, { rel: "icon" })
        }
      }
    }
  }

  return { getWideLogo, getSquareLogo, wideLogoUrl, squareLogoUrl, handleLogoList }
}
