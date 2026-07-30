<template>
  <div class="announcement-wrapper" :style="wrapperStyle">
    <div class="announcement-icon">
      <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="icon" class="custom-icon" />
      <!-- <q-icon v-else name="campaign" size="20px" /> -->
    </div>
    <div class="announcement-content">
      <div v-if="announcementList.length > 0" class="announcement-slider">
        <span class="announcement-text">{{ currentAnnouncement }}</span>
      </div>
      <span v-else class="announcement-text h-[21px]"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { computed, ref, onMounted, onUnmounted } from "vue"
  import type * as Request from "src/api/request.type"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const payload = computed(() => props.entrance?.payload)
  const settingStyle = computed(() => props.entrance?.payload?.style)

  // 取得所有公告內容列表（從 nested_entrance 取得第一個語系的內容）
  const announcementList = computed(() => {
    const nestedEntrance = payload.value?.nested_entrance
    if (!nestedEntrance || nestedEntrance.length === 0) return []

    return nestedEntrance
      .map((item) => {
        const details = item.payload?.details
        if (details && details.length > 0 && details[0].content) {
          return details[0].content
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

  const startAutoPlay = () => {
    if (announcementList.value.length <= 1) return

    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % announcementList.value.length
    }, 3000)
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

  onUnmounted(() => {
    stopAutoPlay()
  })

  const wrapperStyle = computed(() => ({
    backgroundColor: settingStyle.value?.backgroundColor || "#EFF7FF",
    color: settingStyle.value?.textColor || "#409eff",
    borderRadius: settingStyle.value?.borderStyle === "square" ? "0" : "50px"
    // marginBottom: settingStyle.value?.marginBottom ? `${settingStyle.value.marginBottom}px` : "0"
  }))
</script>

<style scoped lang="scss">
  .announcement-wrapper {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    .announcement-icon {
      flex-shrink: 0;
      opacity: 0.8;

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
        animation: fadeIn 0.3s ease-in-out;
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

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
