<script setup lang="ts">
import type { RankResponseItem } from "@shared-lib/api/commonTypes/rankTypes"
import type { GetLatestBetListParamsType } from "@shared-lib/api/apiFunctions/rank_getLatestBetList"
import { useLatestBetList } from "@shared-lib/api/hooks/useLatestBetList"
import { useLatestWinList } from "@shared-lib/api/hooks/useLatestWinList"
import RankBoardDeskTopContent from "./RankBoardDeskTopContent.vue"
import RankBoardMobileContent from "./RankBoardMobileContent.vue"
import RankBoardSwitcher from "./RankBoardSwitcher.vue"
import RankBoardTitle from "./RankBoardTitle.vue"
import type { RankTab, RankScrollRow } from "./RankBoardBase.vue"

interface RankBoardClassObj {
  wrapper?: string
  title?: string
  tabWrapper?: string
  tabItem?: string
  tabRoot?: string
  boardWrapper?: string
  headerRow?: string
  headerCell?: string
  viewport?: string
  rowItem?: string
  desktopRowBase?: string
  mobileRowBase?: string
  bodyText?: string
  rowEven?: string
  rowOdd?: string
  positiveAmount?: string
  negativeAmount?: string
  emptyState?: string
  mobileName?: string
  mobileMeta?: string
}

interface Props {
  gameType?: number
  classObj?: RankBoardClassObj
}

const props = withDefaults(defineProps<Props>(), {
  gameType: undefined,
  classObj: () => ({})
})

// ── 常數 ─────────────────────────────────────────────────────────────────────
const MAX_VISIBLE_ROWS = 8
const ROLL_INTERVAL = 2500
// desktop row: p-4 (16px×2) + leading-6 (24px) = 56px；mobile 約 54px 故取 56
const ROW_HEIGHT = 56
const DEFAULT_TH_CLASS = "p-3"

// ── 狀態 ─────────────────────────────────────────────────────────────────────
const route = useRoute()
const activeTab = ref<RankTab>("latestBet")
const rollTimer = ref<ReturnType<typeof setInterval> | null>(null)
const scrollRows = ref<RankScrollRow[]>([])
const currentIndex = ref(0)
const rollingUid = ref(0)

// ── 遊戲類型解析 ──────────────────────────────────────────────────────────────
const resolvedGameType = computed(() => {
  if (typeof props.gameType === "number" && Number.isFinite(props.gameType)) {
    return props.gameType
  }
  const routeType = Number(route.params.gameType)
  return Number.isFinite(routeType) ? routeType : undefined
})

// ── API ───────────────────────────────────────────────────────────────────────
const rankQueryParams = reactive<GetLatestBetListParamsType>({
  game_type: undefined
})

const {
  latestBetList,
  refetch: refetchLatestBetList,
  isFetching: isLatestBetFetching
} = useLatestBetList({
  params: rankQueryParams,
  options: { enabled: false }
})

const {
  latestWinList,
  refetch: refetchLatestWinList,
  isFetching: isLatestWinFetching
} = useLatestWinList({
  params: rankQueryParams,
  options: { enabled: false }
})

const displayRows = computed<RankResponseItem[]>(() => {
  if (activeTab.value === "latestWin") return latestWinList.value || []
  return latestBetList.value || []
})

const isLoading = computed(() => {
  if (activeTab.value === "latestWin") return isLatestWinFetching.value
  return isLatestBetFetching.value
})

const refreshRankData = async () => {
  rankQueryParams.game_type = resolvedGameType.value
  if (activeTab.value === "latestWin") {
    await refetchLatestWinList()
    return
  }
  await refetchLatestBetList()
}

const handleTabChange = async (tab: RankTab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  await refreshRankData()
}

// ── 捲動動畫（新資料由下方進入，與 CmsCustomPageLeaderboard 方向一致） ────────
const stopRolling = () => {
  if (rollTimer.value) {
    clearInterval(rollTimer.value)
    rollTimer.value = null
  }
}

const resetScrollRows = () => {
  stopRolling()
  currentIndex.value = 0
  rollingUid.value = 0
  scrollRows.value = []
}

const startRolling = (list: RankResponseItem[] = []) => {
  resetScrollRows()

  if (!list.length || list.length <= MAX_VISIBLE_ROWS) {
    scrollRows.value = list.map((data) => ({ uid: ++rollingUid.value, data }))
    return
  }

  scrollRows.value = list.slice(0, MAX_VISIBLE_ROWS).map((data) => ({ uid: ++rollingUid.value, data }))
  currentIndex.value = MAX_VISIBLE_ROWS % list.length

  rollTimer.value = setInterval(() => {
    const data = list[currentIndex.value]
    scrollRows.value = [...scrollRows.value.slice(1), { uid: ++rollingUid.value, data }]
    currentIndex.value = (currentIndex.value + 1) % list.length
  }, ROLL_INTERVAL)
}

watch(
  [resolvedGameType],
  async () => {
    await refreshRankData()
  },
  { immediate: true }
)
watch(
  () => displayRows.value,
  (rows) => {
    startRolling(rows || [])
  },
  { deep: true }
)

onBeforeUnmount(() => resetScrollRows())

// ── 傳給 RankBoardBase 的 classObj（對應欄位） ────────────────────────────────
const baseClassObj = computed(() => ({
  wrapper: cx("w-full", FLEX_COL, "gap-3 phone:gap-2", props.classObj?.wrapper),
  boardWrapper: props.classObj?.boardWrapper,
  headerRow: props.classObj?.headerRow,
  headerCell: props.classObj?.headerCell,
  viewport: props.classObj?.viewport,
  rowItem: props.classObj?.rowItem,
  emptyState: props.classObj?.emptyState
}))
</script>

<template>
  <RankBoardBase
    :active-tab="activeTab"
    :scroll-rows="scrollRows"
    :row-height="ROW_HEIGHT"
    :visible-count="MAX_VISIBLE_ROWS"
    :is-loading="isLoading"
    :class-obj="baseClassObj"
    @tab-change="handleTabChange"
  >
    <!-- 標題 -->
    <template #title>
      <RankBoardTitle :class-obj="{ title: props.classObj?.title }" />
    </template>

    <!-- Tab 切換（使用原始圓角 Switcher 樣式） -->
    <template #tabs>
      <RankBoardSwitcher
        :active-tab="activeTab"
        :class-obj="{
          tabWrapper: props.classObj?.tabWrapper,
          tabItem: props.classObj?.tabItem,
          tabRoot: props.classObj?.tabRoot
        }"
        @change="handleTabChange"
      />
    </template>

    <!-- 表頭（桌機才顯示） -->
    <template #header>
      <div
        :class="
          cx(
            'grid grid-cols-4 phone:hidden',
            'text-center text-[18px] font-bold leading-6',
            'bg-[var(--table-table-header-bg)]',
            'text-[var(--table-table-header-title)]',
            props.classObj?.headerRow
          )
        "
      >
        <div :class="cx(DEFAULT_TH_CLASS, props.classObj?.headerCell)">Player</div>
        <div :class="cx(DEFAULT_TH_CLASS, props.classObj?.headerCell)">Games</div>
        <div :class="cx(DEFAULT_TH_CLASS, props.classObj?.headerCell)">Stake</div>
        <div :class="cx(DEFAULT_TH_CLASS, props.classObj?.headerCell)">Payout</div>
      </div>
    </template>

    <!-- 每一列（桌機 + 手機各自的 layout） -->
    <template #row="{ row, idx }">
      <RankBoardDeskTopContent :row="row" :idx="idx" :class-obj="props.classObj" />
      <RankBoardMobileContent :row="row" :idx="idx" :class-obj="props.classObj" />
    </template>
  </RankBoardBase>
</template>
