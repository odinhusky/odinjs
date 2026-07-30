<script setup lang="ts">
import type { RankResponseItem } from "@shared-lib/api/commonTypes/rankTypes"

export type RankTab = "latestBet" | "latestWin"

export interface RankScrollRow {
  uid: number
  data: RankResponseItem
}

export interface RankBoardStyleConfig {
  titleColor?: string
  textColor?: string
  buttonColor?: string
  buttonSelectedColor?: string
  textSelectedColor?: string
  underlineSelectedColor?: string
}

interface RankBoardBaseClassObj {
  wrapper?: string
  tabWrapper?: string
  boardWrapper?: string
  headerRow?: string
  headerCell?: string
  viewport?: string
  rowItem?: string
  emptyState?: string
}

interface Props {
  title?: string
  activeTab: RankTab
  tab1Label?: string
  tab2Label?: string
  showHeader?: boolean
  scrollRows: RankScrollRow[]
  rowHeight?: number
  visibleCount?: number
  isLoading?: boolean
  styleConfig?: RankBoardStyleConfig
  classObj?: RankBoardBaseClassObj
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  tab1Label: "Latest bets",
  tab2Label: "Latest Big Wins",
  showHeader: true,
  rowHeight: 43,
  visibleCount: 5,
  isLoading: false,
  styleConfig: () => ({}),
  classObj: () => ({})
})

const emit = defineEmits<{
  "tab-change": [tab: RankTab]
}>()

// ── CSS 變數（由 styleConfig 注入，作用域為整個元件） ────────────────────────
const cssVarsStyle = computed(() => {
  const s: Record<string, string> = {}
  const sc = props.styleConfig
  if (sc?.titleColor) s["--rb-title"] = sc.titleColor
  if (sc?.textColor) s["--rb-text"] = sc.textColor
  if (sc?.buttonColor) s["--rb-btn-bg"] = sc.buttonColor
  if (sc?.buttonSelectedColor) s["--rb-btn-active-bg"] = sc.buttonSelectedColor
  if (sc?.textSelectedColor) s["--rb-btn-active-text"] = sc.textSelectedColor
  if (sc?.underlineSelectedColor) s["--rb-underline"] = sc.underlineSelectedColor
  s["--rb-row-height"] = `${props.rowHeight}px`
  return s
})

const viewportHeight = computed(() => `${props.rowHeight * props.visibleCount}px`)

const viewportStyle = computed(() => ({
  height: viewportHeight.value,
  minHeight: viewportHeight.value,
  maxHeight: viewportHeight.value
}))
</script>

<template>
  <div :class="cx('rank-board-base', props.classObj?.wrapper)" :style="cssVarsStyle">
    <!-- 標題 -->
    <slot name="title">
      <div v-if="props.title" class="rank-base-title-wrapper px-4 pt-4 pb-2">
        <RankBoardTitle :title="props.title" />
      </div>
    </slot>

    <!-- Tab 切換 -->
    <slot name="tabs">
      <div :class="cx('flex border-b border-white/10', props.classObj?.tabWrapper)">
        <BasePlainBtn
          class="rank-base-tab flex-1 py-2 text-sm font-medium transition-colors justify-center"
          :class="props.activeTab === 'latestBet' ? 'rank-base-tab--active' : 'rank-base-tab--inactive'"
          @click="emit('tab-change', 'latestBet')"
        >
          {{ props.tab1Label }}
        </BasePlainBtn>
        <BasePlainBtn
          class="rank-base-tab flex-1 py-2 text-sm font-medium transition-colors justify-center"
          :class="props.activeTab === 'latestWin' ? 'rank-base-tab--active' : 'rank-base-tab--inactive'"
          @click="emit('tab-change', 'latestWin')"
        >
          {{ props.tab2Label }}
        </BasePlainBtn>
      </div>
    </slot>

    <!-- 表頭 + 資料列：包在同一容器，避免外層 gap 插入中間 -->
    <div :class="cx('overflow-hidden', props.classObj?.boardWrapper)">
      <slot name="header">
        <div
          v-if="props.showHeader"
          :class="
            cx(
              'grid grid-cols-4 px-4 text-xs opacity-60 text-center',
              'text-[var(--rb-text,var(--table-table-content-title-enabled))]',
              props.classObj?.headerRow
            )
          "
          :style="{ height: `${props.rowHeight}px`, alignItems: 'center' }"
        >
          <span :class="props.classObj?.headerCell">Player</span>
          <span :class="props.classObj?.headerCell">Game</span>
          <span :class="props.classObj?.headerCell">Bet</span>
          <span :class="props.classObj?.headerCell">{{ props.activeTab === "latestWin" ? "Win" : "Payout" }}</span>
        </div>
      </slot>

      <!-- 捲動資料列（有資料） -->
      <TransitionGroup
        v-if="props.scrollRows.length"
        name="rank-base-scroll"
        tag="div"
        :class="cx('relative overflow-hidden', props.classObj?.viewport)"
        :style="viewportStyle"
      >
        <div
          v-for="(item, idx) in props.scrollRows"
          :key="item.uid"
          :class="cx('rank-base-row', props.classObj?.rowItem)"
          :style="{ height: `${props.rowHeight}px` }"
        >
          <slot name="row" :row="item.data" :idx="idx" />
        </div>
      </TransitionGroup>

      <!-- 空狀態（無資料） -->
      <div
        v-else
        :class="cx('relative overflow-hidden flex items-center justify-center', props.classObj?.viewport)"
        :style="viewportStyle"
      >
        <slot name="empty">
          <div v-if="props.isLoading" class="text-sm text-white/75">Loading...</div>
          <NoData v-else type="empty" :class-obj="{ root: cx('!min-h-0 h-full') }" />
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 標題色：使用 CSS 變數覆蓋 RankBoardTitle 內部 token ── */
.rank-base-title-wrapper :deep(h3) {
  color: var(--rb-title, var(--text-text-title)) !important;
}

/* ── Tab：inactive ── */
.rank-base-tab--inactive {
  background-color: var(--rb-btn-bg, transparent);
  color: var(--rb-text, inherit);
  border-bottom: 2px solid transparent;
}

/* ── Tab：active ── */
.rank-base-tab--active {
  background-color: var(--rb-btn-active-bg, transparent);
  color: var(--rb-btn-active-text, inherit);
  border-bottom: 2px solid var(--rb-underline, currentColor);
}

/* ── Tab：hover ── */
.rank-base-tab:hover {
  background-color: var(--rb-btn-active-bg, rgba(255, 255, 255, 0.08)) !important;
  color: var(--rb-btn-active-text, inherit) !important;
}

/* ── 捲動動畫：新資料由下方進入，舊資料向上離開 ── */
.rank-base-scroll-enter-active,
.rank-base-scroll-leave-active,
.rank-base-scroll-move {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.rank-base-scroll-leave-active {
  position: absolute;
  width: 100%;
}

.rank-base-scroll-enter-from {
  opacity: 0;
  transform: translateY(var(--rb-row-height, 43px));
}

.rank-base-scroll-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--rb-row-height, 43px) * -1));
}
</style>
