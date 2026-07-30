<template>
  <div class="announcement-wrapper" :style="wrapperStyle">
    <div class="announcement-icon">
      <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="icon" class="custom-icon" />
      <!-- <q-icon v-else name="notifications" size="20px" /> -->
    </div>
    <div class="announcement-content">
      <div v-if="announcementList.length > 0" class="announcement-slider">
        <transition name="fade" mode="out-in">
          <span :key="currentIndex" class="announcement-text" :style="textStyle">{{ currentAnnouncement }}</span>
        </transition>
      </div>
      <span v-else class="announcement-text" :style="textStyle">{{ $t("cms.no_announcement") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import type * as Response from "src/api/response.type"
import type { CmsAnnouncementPayload, CmsAnnouncementStyleSettings } from "src/types/cmsCustomPage"

const { locale } = useI18n()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const payload = computed(() => props.entrance?.payload as unknown as CmsAnnouncementPayload)
const settingStyle = computed((): CmsAnnouncementStyleSettings | undefined => payload.value?.style)

// 取得所有公告內容列表（從 nested_entrance 取得當前語系或第一個語系的內容）
const announcementList = computed(() => {
  const nestedEntrance = payload.value?.nested_entrance
  if (!nestedEntrance || nestedEntrance.length === 0) return []

  return nestedEntrance
    .map((item) => {
      const details = item.payload?.details
      if (details && details.length > 0) {
        // 優先使用當前語系
        const matched = details.find((d) => d.lang === locale.value)
        if (matched?.content) return matched.content
        // 否則使用第一個語系
        if (details[0].content) return details[0].content
      }
      return ""
    })
    .filter((content) => content !== "")
})

// 輪播公告
const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const currentAnnouncement = computed(() => {
  if (announcementList.value.length === 0) return ""
  return announcementList.value[currentIndex.value] || ""
})

// 輪播間隔（預設 3 秒）
const autoPlaySeconds = computed(() => settingStyle.value?.autoPlaySeconds || 3)

const startAutoPlay = () => {
  if (announcementList.value.length <= 1) return

  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % announcementList.value.length
  }, autoPlaySeconds.value * 1000)
}

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})

// 樣式計算
const wrapperStyle = computed(() => ({
  backgroundColor: settingStyle.value?.backgroundColor || "#2a2a2a",
  marginBottom: settingStyle.value?.marginBottom ? `${settingStyle.value.marginBottom}px` : "0",
  borderRadius: settingStyle.value?.borderStyle === "square" ? "8px" : "50px"
}))

const textStyle = computed(() => ({
  color: settingStyle.value?.textColor || "#fff"
}))
</script>

<style scoped lang="scss">
.announcement-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  gap: 12px;
  cursor: pointer;
  width: 100%;

  .announcement-icon {
    flex-shrink: 0;
    opacity: 0.8;
    color: inherit;

    .custom-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }
  }

  .announcement-content {
    flex: 1;
    overflow: hidden;

    .announcement-slider {
      position: relative;
    }

    .announcement-text {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

// Mobile 適配
@media (max-width: 768px) {
  .announcement-wrapper {
    padding: 10px 12px;
    gap: 10px;

    .announcement-content {
      .announcement-text {
        font-size: 12px;
      }
    }
  }
}
</style>
