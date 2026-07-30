<script setup lang="ts">
import { useCmsDetailQuery } from "@shared-lib/api/hooks/useCmsDetailQuery"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"

definePageMeta({
  key: (route) => `cms-custom-page-${route.params.cmsCustomPageId}`
})

const route = useRoute()
const router = useRouter()

// 直接取路由參數為 number，避免 computed ref 傳入 hook 造成 [object Object]
const cmsCustomPageId = Number(route.params.cmsCustomPageId)

const { data: cmsDetail, isLoading } = useCmsDetailQuery(cmsCustomPageId)

// 若頁面不存在則導回首頁
watch(
  [isLoading, cmsDetail],
  ([loading, detail]) => {
    if (!loading && detail === null) {
      router.replace(ROUTE_PATH.HOME)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    :class="
      cx(
        'cms-custom-page',
        HOMEVIEW_CONTAINER_PADDING_X_CLASS,
        HOMEVIEW_CONTAINER_PADDING_Y_CLASS,
        HOMEVIEW_CONTAINER_GAPPING_CLASS,
        LAYOUT_MAX_WIDTH,
        'mx-auto'
      )
    "
  >
    <!-- 載入中 -->
    <div v-if="isLoading" :class="cx(FLEX_CENTER, 'min-h-[60dvh]')">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-[var(--brand-primary)]" />
    </div>

    <!-- 頁面內容 -->
    <template v-else-if="cmsDetail">
      <CmsCustomPageSection
        v-for="(entrance, index) in cmsDetail.Entrance"
        :key="`${cmsCustomPageId}-${entrance.type}-${index}`"
        :entrance="entrance"
      />
    </template>
  </div>
</template>
