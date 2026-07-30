<script setup lang="ts">
import type { RankResponseItem } from "@shared-lib/api/commonTypes/rankTypes"

interface RankBoardDeskTopContentClassObj {
  desktopRowBase?: string
  bodyText?: string
  rowEven?: string
  rowOdd?: string
  positiveAmount?: string
  negativeAmount?: string
}

interface Props {
  row: RankResponseItem
  idx: number
  classObj?: RankBoardDeskTopContentClassObj
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
        'grid grid-cols-4 p-4 text-center text-base leading-6 phone:hidden',
        'text-[var(--table-table-content-title-enabled)]',
        props.idx % 2 === 0 ? 'bg-[var(--table-table-content-bg-dark)]' : 'bg-[var(--table-table-content-bg-light)]',
        props.classObj?.desktopRowBase,
        props.classObj?.bodyText,
        props.idx % 2 === 0 ? props.classObj?.rowEven : props.classObj?.rowOdd
      )
    "
  >
    <div class="truncate">
      {{ props.row.member_account }}
    </div>
    <div class="truncate">
      {{ props.row.game_name }}
    </div>
    <div class="truncate">
      {{ formatAmount(props.row.bet_amount) }}
    </div>
    <div
      class="truncate font-semibold"
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
