<template>
  <div class="navbar-wrapper" :style="wrapperStyle">
    <div
      v-for="(item, index) in displayNavItems"
      :key="index"
      class="nav-item"
      :class="{ active: index === activeIndex }"
      :style="index === activeIndex ? activeItemStyle : itemStyle"
      @click="activeIndex = index"
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
  import type { PropType } from "vue"
  import { computed, ref } from "vue"
  import type * as Request from "src/api/request.type"
  import { useSiteStore } from "src/stores/siteStore"

  const siteStore = useSiteStore()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const activeIndex = ref(0)
  const payload = computed(() => props.entrance?.payload)
  const settingStyle = computed(() => props.entrance?.payload?.style)

  // 顯示數量限制
  const displayCount = computed(() => settingStyle.value?.displayCount || 4)

  // 導航項目列表
  // 當前語系
  const currentLang = computed(() => siteStore.langList[0]?.label || "")

  const navItems = computed(() => {
    const items = payload.value?.nested_entrance
    if (items && items.length > 0) {
      return items.map((item: Request.CmsEntranceItem) => {
        // 優先使用當前語系標題，否則使用第一個有值的語系，最後 fallback 到 title
        const langTitles = item.payload?.lang_titles
        let label = item.payload?.title || ""
        if (langTitles) {
          if (currentLang.value && langTitles[currentLang.value]) {
            label = langTitles[currentLang.value]
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
          defaultIcon: "apps"
        }
      })
    }
    // 預設項目
    return [
      { label: "Slot", icon: "", selectedIcon: "", defaultIcon: "casino" },
      { label: "Casino", icon: "", selectedIcon: "", defaultIcon: "circle" },
      { label: "Sports", icon: "", selectedIcon: "", defaultIcon: "sports_basketball" },
      { label: "Fishing", icon: "", selectedIcon: "", defaultIcon: "water" }
    ]
  })

  // 根據顯示數量限制項目
  const displayNavItems = computed(() => {
    return navItems.value.slice(0, displayCount.value)
  })

  // 取得項目圖標（根據選中狀態）
  const getItemIcon = (item: any, index: number) => {
    if (index === activeIndex.value && item.selectedIcon) {
      return item.selectedIcon
    }
    return item.icon || ""
  }

  // 容器樣式
  const wrapperStyle = computed(() => ({
    backgroundColor: settingStyle.value?.backgroundColor || "#FFFFFF"
    // marginBottom: settingStyle.value?.marginBottom ? `${settingStyle.value.marginBottom}px` : "0"
  }))

  // 一般項目樣式
  const itemStyle = computed(() => ({
    color: settingStyle.value?.textColor || "#7983a2",
    backgroundColor: "transparent"
  }))

  // 選中項目樣式
  const activeItemStyle = computed(() => ({
    color: settingStyle.value?.selectedTextColor || "#ffffff",
    backgroundColor: settingStyle.value?.selectedBackgroundColor || "#025be8"
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

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s;

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
</style>
