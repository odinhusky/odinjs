<template>
  <div class="navbar-wrapper" :style="wrapperStyle">
    <div
      v-for="(item, index) in displayNavItems"
      :key="index"
      class="nav-item"
      :class="{ active: index === activeIndex }"
      :style="index === activeIndex ? activeItemStyle : itemStyle"
      @click="handleNavClick(item, index)"
    >
      <div class="nav-icon">
        <img v-if="getItemIcon(item, index)" :src="getItemIcon(item, index)" alt="icon" class="icon-img" />
        <q-icon v-else :name="item.defaultIcon || 'apps'" size="24px" />
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useEntranceHandler } from "app/template/okbet/composables/useCms"
import type * as Response from "src/api/response.type"
import type { CmsNavbarPayload, CmsNavbarStyleSettings } from "src/types/cmsCustomPage"

const { locale } = useI18n()
const { handleEntranceClick } = useEntranceHandler()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const activeIndex = ref(0)
const payload = computed(() => props.entrance?.payload as unknown as CmsNavbarPayload)
const settingStyle = computed((): CmsNavbarStyleSettings | undefined => payload.value?.style)

// 顯示數量限制
const displayCount = computed(() => settingStyle.value?.displayCount || 4)

// 導航項目列表
const navItems = computed(() => {
  const items = payload.value?.nested_entrance
  if (items && items.length > 0) {
    return items.map((item) => {
      // 優先使用當前語系的標題
      const langTitles = item.payload?.lang_titles
      let label = item.payload?.title || ""
      if (langTitles) {
        if (langTitles[locale.value]) {
          label = langTitles[locale.value]
        } else {
          const firstLangKey = Object.keys(langTitles).find((key) => langTitles[key])
          if (firstLangKey) {
            label = langTitles[firstLangKey]
          }
        }
      }
      return {
        label: label || "Item",
        icon: item.payload?.icon || "",
        selectedIcon: item.payload?.selected_icon || "",
        defaultIcon: "apps",
        openingMethod: item.payload?.opening_method || 0,
        // 保留原始 entrance 資料用於跳轉
        entrance: item as unknown as Response.CmsEntranceItem
      }
    })
  }
  return []
})

// 根據顯示數量限制項目
const displayNavItems = computed(() => {
  return navItems.value.slice(0, displayCount.value)
})

// 取得項目圖標（根據選中狀態）
const getItemIcon = (item: ReturnType<typeof navItems.value>[number], index: number) => {
  if (index === activeIndex.value && item.selectedIcon) {
    return item.selectedIcon
  }
  return item.icon || ""
}

// 處理導航點擊
const handleNavClick = (item: ReturnType<typeof navItems.value>[number], index: number) => {
  activeIndex.value = index

  // 使用 handleEntranceClick 處理跳轉（與 FooterNav 相同的做法）
  handleEntranceClick({
    entrance: item.entrance,
    opening_method: item.openingMethod
  })
}

// 容器樣式
const wrapperStyle = computed(() => ({
  backgroundColor: settingStyle.value?.backgroundColor || "#1e2a3a",
  marginBottom: settingStyle.value?.marginBottom ? `${settingStyle.value.marginBottom}px` : "0",
  borderRadius: settingStyle.value?.borderStyle === "square" ? "0" : "8px"
}))

// 一般項目樣式
const itemStyle = computed(() => ({
  color: settingStyle.value?.textColor || "#8899aa",
  backgroundColor: "transparent"
}))

// 選中項目樣式
const activeItemStyle = computed(() => ({
  color: settingStyle.value?.selectedTextColor || "#ffffff",
  backgroundColor: settingStyle.value?.selectedBackgroundColor || "transparent"
}))
</script>

<style scoped lang="scss">
.navbar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;

      .icon-img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
    }

    .nav-label {
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
}

// Mobile 適配
@media (max-width: 768px) {
  .navbar-wrapper {
    padding: 10px 8px;

    .nav-item {
      padding: 6px 10px;
      gap: 4px;

      .nav-icon {
        width: 24px;
        height: 24px;

        .icon-img {
          width: 20px;
          height: 20px;
        }
      }

      .nav-label {
        font-size: 10px;
      }
    }
  }
}
</style>
