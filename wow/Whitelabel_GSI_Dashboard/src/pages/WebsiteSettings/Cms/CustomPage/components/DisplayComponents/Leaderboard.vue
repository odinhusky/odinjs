<template>
  <div class="leaderboard-wrapper" :style="wrapperStyle">
    <div class="leaderboard-header" :style="headerStyle">
      <h3 class="leaderboard-title" :style="titleStyle">{{ displayTitle }}</h3>
      <div class="leaderboard-icon">
        <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="icon" class="custom-icon" />
      </div>
    </div>
    <div class="leaderboard-tabs">
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'bigWins' }"
        :style="activeTab === 'bigWins' ? activeTabStyle : tabStyle"
        @click="activeTab = 'bigWins'"
      >
        <span class="tab-text">
          {{ tabTitle1 }}
          <span v-if="activeTab === 'bigWins'" class="tab-underline" :style="underlineStyle"></span>
        </span>
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'latestBets' }"
        :style="activeTab === 'latestBets' ? activeTabStyle : tabStyle"
        @click="activeTab = 'latestBets'"
      >
        <span class="tab-text">
          {{ tabTitle2 }}
          <span v-if="activeTab === 'latestBets'" class="tab-underline" :style="underlineStyle"></span>
        </span>
      </button>
    </div>
    <div class="leaderboard-content">
      <div class="no-data">
        <!-- <div class="logo-placeholder">
          <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="logo" class="logo-img" />
        </div> -->
        <span class="no-data-text" :style="textStyle">No Data</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { computed, ref } from "vue"
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

  const activeTab = ref<"bigWins" | "latestBets">("bigWins")

  // 取得第一個語系的多語系資料
  const firstDetail = computed(() => {
    const details = payload.value?.details
    if (details && details.length > 0) {
      return details[0]
    }
    return null
  })

  // 顯示標題
  const displayTitle = computed(() => {
    return (
      firstDetail.value?.display_title ||
      payload.value?.display_title ||
      payload.value?.title ||
      "Latest Bet And Big Wins"
    )
  })

  // 分頁標題 1
  const tabTitle1 = computed(() => {
    return firstDetail.value?.tab_title_1 || "Latest Big Wins"
  })

  // 分頁標題 2
  const tabTitle2 = computed(() => {
    return firstDetail.value?.tab_title_2 || "Latest Bets"
  })

  // 容器樣式
  const wrapperStyle = computed(() => ({
    backgroundColor: settingStyle.value?.backgroundColor || "#fcfcfc"
    // marginBottom: settingStyle.value?.marginBottom ? `${settingStyle.value.marginBottom}px` : "24px"
  }))

  // 標題區域樣式
  const headerStyle = computed(() => ({
    backgroundColor: settingStyle.value?.backgroundColor || "#fcfcfc"
  }))

  // 標題文字樣式
  const titleStyle = computed(() => ({
    color: settingStyle.value?.titleColor || "#626263"
  }))

  // 一般文字樣式
  const textStyle = computed(() => ({
    color: settingStyle.value?.textColor || "#7983a2"
  }))

  // Tab 按鈕樣式（未選中）
  const tabStyle = computed(() => ({
    backgroundColor: settingStyle.value?.buttonColor || "#e8ecf8",
    color: settingStyle.value?.textColor || "#7983a2"
  }))

  // Tab 按鈕樣式（選中）
  const activeTabStyle = computed(() => ({
    backgroundColor: settingStyle.value?.buttonSelectedColor || "#bad5ff",
    color: settingStyle.value?.textSelectedColor || "#000000"
  }))

  // 底線樣式
  const underlineStyle = computed(() => ({
    backgroundColor: settingStyle.value?.underlineSelectedColor || "#025be8"
  }))
</script>

<style scoped lang="scss">
  .leaderboard-wrapper {
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;

    .leaderboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;

      .leaderboard-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }

      .leaderboard-icon {
        font-size: 32px;

        .custom-icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }
      }
    }

    .leaderboard-tabs {
      display: flex;

      .tab-btn {
        flex: 1;
        padding: 12px 16px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &.active {
          font-weight: 600;
        }

        .tab-text {
          position: relative;
          display: inline-block;
          padding-bottom: 4px;
        }

        .tab-underline {
          position: absolute;
          bottom: -12px;
          left: -2.5px;
          width: 105%;
          height: 2px;
        }
      }
    }

    .leaderboard-content {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;

      .no-data {
        text-align: center;
        padding: 40px;

        .logo-placeholder {
          margin-bottom: 16px;

          .logo-img {
            max-width: 120px;
            opacity: 0.5;
          }
        }

        .no-data-text {
          font-size: 18px;
        }
      }
    }
  }
</style>
