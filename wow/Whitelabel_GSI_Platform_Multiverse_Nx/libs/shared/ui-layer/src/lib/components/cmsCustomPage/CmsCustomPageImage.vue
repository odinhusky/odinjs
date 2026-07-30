<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type { CmsImagePayload, CmsStyleSettings } from "@shared-lib/api/commonTypes/cmsCustomPageTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const { openGame } = useOpenGame()

const payload = computed((): CmsImagePayload => {
  return (props.entrance.payload as unknown as CmsImagePayload) ?? {}
})

const settingStyle = computed((): CmsStyleSettings | undefined => payload.value?.style)

const isGrid = computed(() => settingStyle.value?.displayStyle === "grid")
const colCount = computed(() => Number(settingStyle.value?.rowShow ?? payload.value?.row_show ?? 3))

// ── 圖片建構 ──────────────────────────────────────────────────────────────────
const imageConfig = computed(() => ({
  imageBase: removeTrailingSlash(String(runtimeConfig.public.imageBase || "")),
  origin: process.client ? window.location.origin : "",
  staticResourceUrl: removeTrailingSlash(String(runtimeConfig.public.staticResourceUrl || ""))
}))

const imageItems = computed(() => {
  return (payload.value?.nested_entrance ?? []).map((item) => ({
    ...item,
    imgSrc: buildCmsEntranceImageSrc(item, imageConfig.value)
  }))
})

// ── Grid 模式分頁 ──────────────────────────────────────────────────────────────
const GRID_PAGE_SIZE = 3
const gridPage = ref(0)

const gridGroups = computed(() => {
  const groups: (typeof imageItems.value)[] = []
  for (let i = 0; i < imageItems.value.length; i += GRID_PAGE_SIZE) {
    groups.push(imageItems.value.slice(i, i + GRID_PAGE_SIZE))
  }
  return groups
})

const currentGridGroup = computed(() => gridGroups.value[gridPage.value] ?? [])

const canGoPrev = computed(() => gridPage.value > 0)
const canGoNext = computed(() => gridPage.value < gridGroups.value.length - 1)

// ── 樣式 ──────────────────────────────────────────────────────────────────────
const wrapperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) {
    style.marginBottom = `${settingStyle.value.marginBottom}px`
  }
  if (settingStyle.value?.backgroundColor) {
    style.backgroundColor = settingStyle.value.backgroundColor
  }
  return style
})

const gridClass = computed(() => (isGrid.value ? "grid grid-cols-3 gap-2" : `grid gap-2`))

const gridStyle = computed(() => {
  if (isGrid.value) return {}
  return {
    gridTemplateColumns: `repeat(${colCount.value}, minmax(0, 1fr))`
  }
})

const borderClass = computed(() => (settingStyle.value?.borderStyle === "square" ? "rounded-none" : "rounded-lg"))

const getAltTag = (item: CmsEntranceItem): string => {
  const payload = (item as unknown as { payload?: { alt_tag?: unknown } }).payload
  const rawAltTag = payload?.alt_tag
  return typeof rawAltTag === "string" ? rawAltTag : ""
}

// ── 點擊處理 ──────────────────────────────────────────────────────────────────
const handleImageClick = (item: CmsEntranceItem) => {
  const { type, payload: p } = item

  if (type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK) {
    openGame(Number(p.integration_id), Number(p.product_code), String(p.game_code || ""), Number(p.game_type))
    return
  }

  if (!p.link) return

  const isExternal = /^https?:\/\//i.test(p.link)

  if (p.opening_method === 1 /* NEW_TAB */) {
    window.open(isExternal ? p.link : `${window.location.origin}${p.link}`, "_blank")
  } else {
    if (isExternal) {
      window.location.href = p.link
    } else {
      router.push(p.link)
    }
  }
}
</script>

<template>
  <div v-if="imageItems.length" :style="wrapperStyle">
    <!-- Grid 模式：三欄分頁切換 -->
    <template v-if="isGrid">
      <div class="relative">
        <div class="grid grid-cols-3 gap-2 px-1">
          <div
            v-for="(item, idx) in currentGridGroup"
            :key="idx"
            class="cursor-pointer overflow-hidden"
            :class="borderClass"
            @click="handleImageClick(item)"
          >
            <BaseImage :src="item.imgSrc" :alt="getAltTag(item)" class="w-full h-auto object-cover" />
          </div>
        </div>

        <!-- 導覽按鈕 -->
        <div v-if="gridGroups.length > 1" class="mt-2 flex justify-center gap-3">
          <BasePlainBtn
            :disabled="!canGoPrev"
            class="px-3 py-1 text-sm rounded disabled:opacity-40"
            :class="borderClass"
            @click="gridPage--"
          >
            &lt;
          </BasePlainBtn>
          <span class="text-sm self-center">{{ gridPage + 1 }} / {{ gridGroups.length }}</span>
          <BasePlainBtn
            :disabled="!canGoNext"
            class="px-3 py-1 text-sm rounded disabled:opacity-40"
            :class="borderClass"
            @click="gridPage++"
          >
            &gt;
          </BasePlainBtn>
        </div>
      </div>
    </template>

    <!-- Horizontal 模式：根據 rowShow 顯示 N 列 -->
    <template v-else>
      <div :class="gridClass" :style="gridStyle">
        <div
          v-for="(item, idx) in imageItems"
          :key="idx"
          class="cursor-pointer overflow-hidden"
          :class="borderClass"
          @click="handleImageClick(item)"
        >
          <BaseImage :src="item.imgSrc" :alt="getAltTag(item)" class="w-full h-auto object-cover" />
        </div>
      </div>
    </template>
  </div>
</template>
