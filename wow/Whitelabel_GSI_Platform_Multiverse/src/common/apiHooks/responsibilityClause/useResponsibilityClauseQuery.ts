import type { UseQueryOptions, UseQueryReturnType } from "@tanstack/vue-query"
import { getResponsibilityClause } from "src/api/login"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApiQuery } from "src/common/apiHooks/useApiQuery"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { QUERY_KEY } from "src/common/utils/constants/queryKeys"
import { computed, type MaybeRefOrGetter, toValue } from "vue"

export interface ResponsibilityClauseViewData {
  content: string
  images: string[]
  hasContent: boolean
  hasImages: boolean
}

type ResponsibilityClauseQueryOptions = Omit<
  UseQueryOptions<ApiResponse<Response.ResponsibilityClause>, Error, ResponsibilityClauseViewData, any[]>,
  "queryKey" | "queryFn"
>

export interface UseResponsibilityClauseQueryOptions {
  position: MaybeRefOrGetter<Request.GetResponsibilityClause["position"]>
  options?: ResponsibilityClauseQueryOptions
}

const defaultResponsibilityClauseViewData: ResponsibilityClauseViewData = {
  content: "",
  images: [],
  hasContent: false,
  hasImages: false,
}

export function useResponsibilityClauseQuery({
  position,
  options = {},
}: UseResponsibilityClauseQueryOptions): UseQueryReturnType<ResponsibilityClauseViewData, Error> {
  const { nowLang } = useLanguage()
  const { buildImageUrl } = useDynamicImage()
  const normalizedPosition = computed(() => toValue(position))

  return useApiQuery<typeof getResponsibilityClause, ResponsibilityClauseViewData>(
    QUERY_KEY.RESPONSIBILITY_CLAUSE(normalizedPosition.value),
    getResponsibilityClause,
    { position: normalizedPosition.value },
    {
      staleTime: 0,
      meta: {
        persist: false,
      },
      ...options,
      select: (response) => {
        const data = response.data

        if (!data) {
          return defaultResponsibilityClauseViewData
        }

        const content =
          data.i18n?.find((item) => item.lang === nowLang.value)?.content?.trim() ||
          data.i18n?.find((item) => item.lang.toLowerCase() === nowLang.value.toLowerCase())?.content?.trim() ||
          ""
        const images = Array.isArray(data.images)
          ? data.images.map((imagePath) => buildImageUrl(imagePath)).filter(Boolean)
          : []

        return {
          content,
          images,
          hasContent: !!content,
          hasImages: images.length > 0,
        }
      },
    }
  )
}
