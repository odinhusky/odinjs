<script setup lang="ts">
import type { RankResponseItem } from "@shared-lib/api/commonTypes/rankTypes"

interface RankBoardMobileContentClassObj {
  mobileRowBase?: string
  bodyText?: string
  rowEven?: string
  rowOdd?: string
  positiveAmount?: string
  negativeAmount?: string
  mobileName?: string
  mobileMeta?: string
}

interface Props {
  row: RankResponseItem
  idx: number
  classObj?: RankBoardMobileContentClassObj
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const SUCCESS_COLOR_CLASS = "text-[var(--tag-tag-title-success)]"
const NEGATIVE_COLOR_CLASS = "text-[var(--tag-tag-title-negative)]"

const formatAmount = (value: string | number) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return "0.00"
  return numeric.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatPayout = (value: string | number) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return "0.00"
  const abs = Math.abs(numeric)
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return numeric >= 0 ? `+${formatted}` : `-${formatted}`
}
</script>

<template>
  <div
    :class="
      cx(
        'hidden phone:flex phone:justify-between phone:items-center',
        'p-2',
        'text-[var(--table-table-content-title-enabled)] text-xs leading-[18px]',
        props.idx % 2 === 0 ? 'bg-[var(--table-table-content-bg-dark)]' : 'bg-[var(--table-table-content-bg-light)]',
        props.classObj?.mobileRowBase,
        props.idx % 2 === 0 ? props.classObj?.rowEven : props.classObj?.rowOdd
      )
    "
  >
    <div :class="cx(FLEX_COL, 'gap-1')">
      <div
        :class="
          cx('mb-1 truncate text-[12px] leading-4 font-bold', props.classObj?.bodyText, props.classObj?.mobileName)
        "
      >
        {{ props.row.member_account }}
      </div>

      <div :class="cx(FLEX_ITEMS_CENTER, 'gap-3')">
        <div :class="cx('min-w-0 truncate', props.classObj?.bodyText)">
          {{ props.row.game_name }}
        </div>

        <div :class="cx('min-w-0 truncate text-sm font-bold', props.classObj?.mobileMeta)">
          {{ formatAmount(props.row.bet_amount) }}
        </div>
      </div>
    </div>

    <div
      class="shrink-0 font-bold"
      :class="
        Number(props.row.prize_amount) >= 0
          ? cx(SUCCESS_COLOR_CLASS, props.classObj?.positiveAmount)
          : cx(NEGATIVE_COLOR_CLASS, props.classObj?.negativeAmount)
      "
    >
      {{ formatPayout(props.row.prize_amount) }}
    </div>
  </div>
</template>
