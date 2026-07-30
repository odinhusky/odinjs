<template>
  <div class="leaderboard-wrapper" :style="wrapperStyle">
    <div class="leaderboard-header" :style="headerStyle">
      <h3 class="leaderboard-title" :style="titleStyle">{{ displayTitle }}</h3>
      <div class="leaderboard-icon">
        <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="icon" class="custom-icon" />
        <!-- <span v-else>🏆</span> -->
      </div>
    </div>
    <div class="leaderboard-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'latestWin' }"
        :style="activeTab === 'latestWin' ? activeTabStyle : tabStyle"
        @click="activeTab = 'latestWin'"
      >
        {{ tabTitle1 }}
        <span v-if="activeTab === 'latestWin'" class="tab-underline" :style="underlineStyle"></span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'latestBet' }"
        :style="activeTab === 'latestBet' ? activeTabStyle : tabStyle"
        @click="activeTab = 'latestBet'"
      >
        {{ tabTitle2 }}
        <span v-if="activeTab === 'latestBet'" class="tab-underline" :style="underlineStyle"></span>
      </button>
    </div>
    <div class="leaderboard-content" :style="contentStyle">
      <q-inner-loading :showing="isLoading" color="primary" />
      <!-- 有資料時顯示列表 -->
      <div v-if="!isLoading && visibleItems.length" class="rank-list" :style="listStyle">
        <transition-group appear enter-active-class="animated slideInDown" :key="currentIndex">
          <div
            v-for="(item, key) in visibleItems"
            :key="key"
            class="cursor-pointer rank-row"
          >
            <div class="rank-td account" :style="textStyle">{{ item.member_account }}</div>
            <div class="rank-td games" :style="textStyle">{{ item.game_name }}</div>
            <div class="rank-td stake" :style="textStyle">{{ moneyFormat(item.bet_amount) }}</div>
            <div class="rank-td payout" :class="parseInt(item.prize_amount) >= 0 ? 'green' : ''">
              {{
                parseInt(item.prize_amount) >= 0
                  ? `+${moneyFormat(item.prize_amount)}`
                  : `${moneyFormat(item.bet_amount)}`
              }}
            </div>
          </div>
        </transition-group>
      </div>
      <!-- 無資料時顯示 -->
      <div v-else-if="!isLoading" class="no-data" :style="listStyle">
        <div class="logo-placeholder">
          <!-- <img v-if="settingStyle?.icon" :src="settingStyle.icon" alt="logo" class="logo-img" />
          <img v-else-if="getWideLogo" :src="getWideLogo()" alt="logo" class="logo-img" /> -->
        </div>
        <span class="no-data-text" :style="textStyle">{{ $t("tableHeader.no_data") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import { useCommon } from "src/common/hooks/useCommon"
import { useLogo } from "src/common/composables/useLogo"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList, getLatestBetList } from "src/api/rank"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import type { CmsLeaderboardPayload, CmsLeaderboardStyleSettings } from "src/types/cmsCustomPage"

type TabType = "latestWin" | "latestBet"

const { t, locale } = useI18n()
const { moneyFormat } = useCommon()
const { getWideLogo } = useLogo()

const props = defineProps<{
  entrance: Response.CmsEntranceItem
}>()

const payload = computed(() => props.entrance?.payload as unknown as CmsLeaderboardPayload)
const settingStyle = computed((): CmsLeaderboardStyleSettings | undefined => payload.value?.style)

const activeTab = ref<TabType>("latestWin")
const isLoading = ref(false)

// 取得當前語系的多語系資料
const currentDetail = computed(() => {
  const details = payload.value?.details
  if (details && details.length > 0) {
    const matched = details.find((d) => d.lang === locale.value)
    return matched || details[0]
  }
  return null
})

// 顯示標題
const displayTitle = computed(() => {
  return currentDetail.value?.display_title || payload.value?.title || t("common.latestBetAndBigWins")
})

// 分頁標題 1 (最新贏家)
const tabTitle1 = computed(() => {
  return currentDetail.value?.tab_title_1 || t("common.btn.latestWin")
})

// 分頁標題 2 (最新下注)
const tabTitle2 = computed(() => {
  return currentDetail.value?.tab_title_2 || t("common.btn.latestBet")
})

// 設定值
const visibleCount = computed(() => settingStyle.value?.visibleCount || 5)
const durationSeconds = computed(() => settingStyle.value?.animationDuration || 1)
const infinite = computed(() => settingStyle.value?.infinite !== false)

// 用於 CSS v-bind 的高度計算
const rowHeight = 50 // px
const rowHeightMobile = 44 // px
const contentHeight = computed(() => `${visibleCount.value * rowHeight}px`)
const contentHeightMobile = computed(() => `${visibleCount.value * rowHeightMobile}px`)

// 樣式計算
const wrapperStyle = computed(() => ({
  backgroundColor: settingStyle.value?.backgroundColor || "#fff"
}))

const headerStyle = computed(() => ({
  backgroundColor: settingStyle.value?.backgroundColor || "#fff"
}))

const titleStyle = computed(() => ({
  color: settingStyle.value?.titleColor || "#1a3b6e"
}))

const textStyle = computed(() => ({
  color: settingStyle.value?.textColor || "#999"
}))

const tabStyle = computed(() => ({
  backgroundColor: settingStyle.value?.buttonColor || "transparent",
  color: settingStyle.value?.textColor || "#999"
}))

const activeTabStyle = computed(() => ({
  backgroundColor: settingStyle.value?.buttonSelectedColor || "transparent",
  color: settingStyle.value?.textSelectedColor || "#1a3b6e"
}))

const underlineStyle = computed(() => ({
  backgroundColor: settingStyle.value?.underlineSelectedColor || "#1a3b6e"
}))

const contentStyle = computed(() => ({
  backgroundColor: settingStyle.value?.contentBackgroundColor || "#fff"
}))

const listStyle = computed(() => ({
  backgroundColor: settingStyle.value?.backgroundColor || "transparent"
}))

// 排行榜資料
const visibleItems = ref<Response.RankItem[]>([])
const currentIndex = ref(0)
let intervalTimer: NodeJS.Timeout | null = null

async function getRankList() {
  isLoading.value = true

  let func: (params: Request.GetRankList) => Promise<Response.RankItem[]>
  switch (activeTab.value) {
    case "latestBet":
      func = getLatestBetList
      break
    case "latestWin":
      func = getLatestWinList
      break
    default:
      console.warn(`getRankList: ${activeTab.value} type is not allowed.`)
      isLoading.value = false
      return
  }

  const { status, data } = await useApi(func, {
    currency_id: undefined,
    game_type: undefined
  })

  isLoading.value = false
  startAnimation(status && data && data.length ? data : [])
}

function resetVisibleItems() {
  if (intervalTimer) {
    clearInterval(intervalTimer)
    intervalTimer = null
  }
  currentIndex.value = 0
  visibleItems.value = []
}

function startAnimation(list: Response.RankItem[] = []) {
  resetVisibleItems()

  if (!list.length || list.length <= visibleCount.value) {
    visibleItems.value = list
    return
  }

  const updateVisibleItems = () => {
    visibleItems.value.unshift(list[currentIndex.value])
    if (visibleItems.value.length > visibleCount.value + 1) {
      visibleItems.value.pop()
    }
  }

  intervalTimer = setInterval(() => {
    updateVisibleItems()

    currentIndex.value++
    if (currentIndex.value >= list.length) {
      if (infinite.value) {
        currentIndex.value = 0
      } else {
        if (intervalTimer) {
          clearInterval(intervalTimer)
          intervalTimer = null
        }
      }
    }
  }, durationSeconds.value * 1000)
}

watch(
  () => activeTab.value,
  () => {
    resetVisibleItems()
    getRankList()
  }
)

onMounted(async () => {
  await getRankList()
})

onBeforeUnmount(() => {
  resetVisibleItems()
})
</script>

<style scoped lang="scss">
.leaderboard-wrapper {
  border-radius: 12px;
  overflow: hidden;
  width: 100%;

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
    border-bottom: 2px solid #f0f0f0;

    .tab-btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;

      &.active {
        font-weight: 600;
      }

      .tab-underline {
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
      }
    }
  }

  .leaderboard-content {
    height: v-bind(contentHeight);
    position: relative;

    .rank-list {
      height: 100%;
      overflow: hidden;

      .rank-row {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #f0f0f0;

        .rank-td {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          font-size: 14px;

          &.account {
            font-weight: 400;
            color: #5a7184;
          }

          &.games {
            font-weight: 400;
            color: #5a7184;
          }

          &.stake {
            font-weight: 700;
            color: #1a3b6e;
          }

          &.payout {
            font-weight: 700;
            color: #ef4444;

            &.green {
              color: #22c55e;
            }
          }
        }
      }
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
      height: 100%;

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

// Mobile 適配
@media (max-width: 768px) {
  .leaderboard-wrapper {
    .leaderboard-header {
      padding: 12px;

      .leaderboard-title {
        font-size: 16px;
      }

      .leaderboard-icon {
        font-size: 24px;

        .custom-icon {
          width: 24px;
          height: 24px;
        }
      }
    }

    .leaderboard-tabs {
      .tab-btn {
        padding: 10px 12px;
        font-size: 12px;
      }
    }

    .leaderboard-content {
      height: v-bind(contentHeightMobile);

      .rank-list {
        .rank-row {
          height: 44px;

          .rank-td {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
