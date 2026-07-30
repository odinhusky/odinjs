<script setup lang="ts">
import type { CmsEntranceItem } from "@shared-lib/api/commonTypes/cmsTypes"
import type {
  CmsLeaderboardPayload,
  CmsLeaderboardDetail,
  CmsLeaderboardStyleSettings
} from "@shared-lib/api/commonTypes/cmsCustomPageTypes"
import type { RankResponseItem } from "@shared-lib/api/commonTypes/rankTypes"
import type { RankTab, RankBoardStyleConfig } from "../RankBoard/RankBoardBase.vue"
import { useLatestWinList } from "@shared-lib/api/hooks/useLatestWinList"
import { useLatestBetList } from "@shared-lib/api/hooks/useLatestBetList"

interface ScrollRow {
  uid: number
  data: RankResponseItem
}

const ROW_HEIGHT = 54 // px — 包含內距與視覺間距，對齊舊版顯示效果

const props = defineProps<{
  entrance: CmsEntranceItem
}>()

const { locale } = useI18n()

const payload = computed((): CmsLeaderboardPayload => {
  return (props.entrance.payload as unknown as CmsLeaderboardPayload) ?? {}
})

const settingStyle = computed((): CmsLeaderboardStyleSettings | undefined => payload.value?.style)

// ── 多語言文字 ───────────────────────────────────────────────────────────────
const localDetail = computed((): CmsLeaderboardDetail | undefined => {
  const details = payload.value?.details ?? []
  return details.find((d) => d.lang === locale.value) ?? details[0]
})

const displayTitle = computed(() => localDetail.value?.display_title || payload.value?.title || "最新投注和大額贏獎")

// ── API ───────────────────────────────────────────────────────────────────────
const { latestWinList, refetch: refetchWin } = useLatestWinList({ params: {} })
const { latestBetList, refetch: refetchBet } = useLatestBetList({ params: {} })

// ── Tab 切換 ──────────────────────────────────────────────────────────────────
const activeTab = ref<RankTab>("latestBet")

const switchTab = (tab: RankTab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  stopAnimation()
  scrollRows.value = []
  if (tab === "latestWin") {
    refetchWin()
  } else {
    refetchBet()
  }
}

const activeList = computed((): RankResponseItem[] => {
  const list = activeTab.value === "latestWin" ? latestWinList.value ?? [] : latestBetList.value ?? []
  return list as RankResponseItem[]
})

// ── 滾動動畫（使用自增 uid 確保 TransitionGroup key 唯一，避免動畫失效） ─────
const visibleCount = computed(() => settingStyle.value?.visibleCount ?? 5)
const animDuration = computed(() => (settingStyle.value?.animationDuration ?? 3) * 1000)

let rowKeyCounter = 0
const scrollRows = ref<ScrollRow[]>([])
const nextIndex = ref(0)

let animTimer: ReturnType<typeof setInterval> | null = null

const stopAnimation = () => {
  if (animTimer) {
    clearInterval(animTimer)
    animTimer = null
  }
}

const startAnimation = () => {
  stopAnimation()
  const list = activeList.value
  if (list.length <= visibleCount.value) return
  animTimer = setInterval(() => {
    const current = activeList.value
    if (!current.length) return
    // slice(1) 移除最舊一筆，push 新資料從下方進入 → 形成向上捲動效果
    scrollRows.value = [
      ...scrollRows.value.slice(1),
      { uid: rowKeyCounter++, data: current[nextIndex.value % current.length] }
    ]
    nextIndex.value = (nextIndex.value + 1) % current.length
  }, animDuration.value)
}

watch(activeList, (list) => {
  stopAnimation()
  const count = Math.min(visibleCount.value, list.length)
  scrollRows.value = list.slice(0, count).map((data) => ({ uid: rowKeyCounter++, data }))
  nextIndex.value = count % (list.length || 1)
  nextTick(() => startAnimation())
})

onMounted(() => refetchBet())
onBeforeUnmount(() => stopAnimation())

// ── 格式化工具 ────────────────────────────────────────────────────────────────
const formatAmount = (value: string | number): string => {
  const n = Number(value)
  if (!Number.isFinite(n)) return "0.00"
  return Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatPayout = (value: string | number): string => {
  const n = Number(value)
  if (!Number.isFinite(n)) return "0.00"
  const formatted = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n >= 0 ? `+${formatted}` : `-${formatted}`
}

const isPrizePositive = (row: RankResponseItem) => Number(row.prize_amount) >= 0

const rowBgClass = (idx: number) =>
  idx % 2 === 0 ? "bg-[var(--table-table-content-bg-dark)]" : "bg-[var(--table-table-content-bg-light)]"

// ── 外層容器樣式 ──────────────────────────────────────────────────────────────
const wrapperStyle = computed(() => {
  const s: Record<string, string> = {}
  if (settingStyle.value?.marginBottom !== undefined) s.marginBottom = `${settingStyle.value.marginBottom}px`
  if (settingStyle.value?.backgroundColor) s.backgroundColor = settingStyle.value.backgroundColor
  if (settingStyle.value?.borderStyle !== "square") s.borderRadius = "8px"
  // 避免資料輪播時觸發瀏覽器 scroll anchoring 造成整頁捲軸抖動
  s.overflowAnchor = "none"
  return s
})

// ── 傳給 RankBoardBase 的 styleConfig（CSS 變數注入） ─────────────────────────
const leaderboardStyleConfig = computed(
  (): RankBoardStyleConfig => ({
    titleColor: settingStyle.value?.titleColor,
    textColor: settingStyle.value?.textColor,
    buttonColor: settingStyle.value?.buttonColor,
    buttonSelectedColor: settingStyle.value?.buttonSelectedColor,
    textSelectedColor: settingStyle.value?.textSelectedColor,
    underlineSelectedColor: settingStyle.value?.underlineSelectedColor
  })
)

const COMMON_DETAIL_SPAN_CLASS = "truncate text-center"
</script>

<template>
  <div class="cms-leaderboard" :style="wrapperStyle">
    <RankBoardBase
      :show-header="false"
      :title="displayTitle"
      :active-tab="activeTab"
      :scroll-rows="scrollRows"
      :row-height="ROW_HEIGHT"
      :visible-count="visibleCount"
      :style-config="leaderboardStyleConfig"
      @tab-change="switchTab"
    >
      <template #row="{ row, idx }">
        <div
          class="grid grid-cols-4 px-4 text-sm text-[var(--rb-text,var(--table-table-content-title-enabled))]"
          :class="rowBgClass(idx)"
          :style="{ height: `${ROW_HEIGHT}px`, alignItems: 'center', lineHeight: '1.5' }"
        >
          <span :class="cx(COMMON_DETAIL_SPAN_CLASS)">{{ row.member_account }}</span>
          <span :class="cx(COMMON_DETAIL_SPAN_CLASS)">{{ row.game_name }}</span>
          <span :class="cx(COMMON_DETAIL_SPAN_CLASS)">{{ formatAmount(row.bet_amount) }}</span>
          <span
            :class="
              cx(
                COMMON_DETAIL_SPAN_CLASS,
                'font-semibold',
                isPrizePositive(row) ? 'text-[var(--tag-tag-title-success)]' : 'text-[var(--tag-tag-title-negative)]'
              )
            "
          >
            {{ formatPayout(row.prize_amount) }}
          </span>
        </div>
      </template>
    </RankBoardBase>
  </div>
</template>
