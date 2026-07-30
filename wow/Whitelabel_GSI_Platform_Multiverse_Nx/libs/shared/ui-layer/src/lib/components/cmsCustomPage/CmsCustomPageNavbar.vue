<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type {
  CmsNavbarPayload,
  CmsNavbarNestedEntrance,
  CmsNavbarStyleSettings
} from "@shared-lib/api/commonTypes/cmsCustomPageTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { toProductLobbyRoute } from "@shared-lib/constants/routePath"

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const router = useRouter()
const { openGame } = useOpenGame()
const { locale } = useI18n()

const normalizeLocaleTag = (value: string): string => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
}

const payload = computed((): CmsNavbarPayload => {
  return (props.entrance.payload as unknown as CmsNavbarPayload) ?? {}
})

const settingStyle = computed((): CmsNavbarStyleSettings | undefined => payload.value?.style)

const displayCount = computed(() => settingStyle.value?.displayCount ?? Infinity)

const navItems = computed((): CmsNavbarNestedEntrance[] => {
  const all = payload.value?.nested_entrance ?? []
  return displayCount.value === Infinity ? all : all.slice(0, displayCount.value)
})

// ── 標籤文字（lang_titles > title） ──────────────────────────────────────────
const getLabel = (item: CmsNavbarNestedEntrance): string => {
  const langTitles = item.payload?.lang_titles
  if (langTitles) {
    const entries = Object.entries(langTitles)
    const exact = langTitles[locale.value]
    if (exact) return exact

    const current = normalizeLocaleTag(locale.value)
    const byNormalized = entries.find(([key]) => normalizeLocaleTag(key) === current)?.[1]
    if (byNormalized) return byNormalized

    const currentBase = current.split("-")[0]
    if (currentBase) {
      const byBase = entries.find(([key]) => normalizeLocaleTag(key).split("-")[0] === currentBase)?.[1]
      if (byBase) return byBase
    }

    return entries.find(([, value]) => !!value)?.[1] ?? ""
  }
  return item.payload?.title ?? ""
}

// ── 圖示（active 時切換 selected_icon） ───────────────────────────────────────
const getIcon = (item: CmsNavbarNestedEntrance, idx: number): string => {
  if (idx === activeIndex.value && item.payload?.selected_icon) {
    return item.payload.selected_icon
  }
  return item.payload?.icon ?? ""
}

// ── Active 狀態 ───────────────────────────────────────────────────────────────
const activeIndex = ref(0)

// ── 點擊處理 ──────────────────────────────────────────────────────────────────
const handleNavClick = (item: CmsNavbarNestedEntrance, idx: number) => {
  activeIndex.value = idx
  const p = item.payload
  if (!p) return

  const type = item.type
  const openingMethod = p.opening_method

  const navigateTo = (path: string) => {
    if (openingMethod === 1) {
      window.open(path.startsWith("/") ? `${window.location.origin}${path}` : path, "_blank")
    } else {
      router.push(path)
    }
  }

  if (type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK) {
    openGame(Number(p.integration_id), Number(p.product_code), String(p.game_code || ""), Number(p.game_type))
    return
  }

  if (type === CMS_ENTRANCE_TYPE_ENUMS.CATEGORY_LOBBY && p.game_type) {
    navigateTo(toProductLobbyRoute(p.game_type))
    return
  }

  if (type === CMS_ENTRANCE_TYPE_ENUMS.INTERNAL_PAGE && p.link) {
    navigateTo(p.link)
    return
  }

  if (type === CMS_ENTRANCE_TYPE_ENUMS.CUSTOM_LINK && p.link) {
    if (p.link.startsWith("/")) {
      navigateTo(p.link)
    } else {
      window.open(p.link, "_blank")
    }
  }
}

// ── 樣式 ──────────────────────────────────────────────────────────────────────
const wrapperStyle = computed(() => {
  const s: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) s.marginBottom = `${settingStyle.value.marginBottom}px`
  if (settingStyle.value?.backgroundColor) s.backgroundColor = settingStyle.value.backgroundColor
  if (settingStyle.value?.padding !== undefined) s.padding = `${settingStyle.value.padding}px`
  return s
})

const itemStyle = (idx: number): Record<string, string> => {
  const selected = idx === activeIndex.value
  const s: Record<string, string> = {}
  if (selected) {
    if (settingStyle.value?.selectedTextColor) s.color = settingStyle.value.selectedTextColor
    if (settingStyle.value?.selectedBackgroundColor) s.backgroundColor = settingStyle.value.selectedBackgroundColor
  } else {
    if (settingStyle.value?.textColor) s.color = settingStyle.value.textColor
  }
  return s
}
</script>

<template>
  <div class="cms-navbar flex items-center justify-around py-3 px-4 rounded-lg" :style="wrapperStyle">
    <template v-if="navItems.length">
      <BasePlainBtn
        v-for="(item, idx) in navItems"
        :key="idx"
        class="flex flex-col items-center gap-1.5 py-2 px-4 cursor-pointer transition-all rounded-lg hover:opacity-80"
        :style="itemStyle(idx)"
        @click="handleNavClick(item, idx)"
      >
        <div class="h-7 w-7 flex items-center justify-center">
          <BaseImage v-if="getIcon(item, idx)" :src="getIcon(item, idx)" class="h-6 w-6 object-contain" alt="" />
        </div>
        <span class="text-xs font-medium text-center leading-tight whitespace-nowrap">
          {{ getLabel(item) }}
        </span>
      </BasePlainBtn>
    </template>
  </div>
</template>
