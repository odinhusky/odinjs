<script setup lang="ts">
interface Props {
  currencyCode: string
  numerator: string | number
  denominator: string | number
  isMaxLevel?: boolean
}

const props = defineProps<Props>()

const denominatorValue = computed(() => {
  const value = Number(props.denominator)
  if (Number.isNaN(value) || value <= 0) return 0
  return value
})

const numeratorValue = computed(() => {
  const value = Number(props.numerator)
  if (Number.isNaN(value) || value <= 0) return 0
  return value
})

const progressValue = computed(() => {
  if (props.isMaxLevel) return 100
  if (!denominatorValue.value) return 0
  return Math.min(100, (numeratorValue.value / denominatorValue.value) * 100)
})

// const denominatorLabel = computed(() => {
//   if (props.isMaxLevel) return "MAX"
//   return formatMoney(denominatorValue.value)
// })

const commonTextClass = "block text-[10px] text-[var(--progress-bar-progress-title-third)] leading-none"
</script>

<template>
  <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
    <span class="text-xs font-bold text-[var(--text-text-primary)] min-w-[36px]">{{ props.currencyCode }}</span>

    <BaseProgressBar
      theme="secondary"
      :height="10"
      :value="progressValue"
      :class-obj="{
        wrapper: 'flex-1 p-1 bg-[var(--progress-bar-progress-bg)] rounded'
      }"
    >
      <template #top="{ value }">
        <div class="w-full flex justify-center items-center gap-2">
          <span :class="cx(commonTextClass)">
            {{ formatMoney(numeratorValue) }}
            <!-- / {{ denominatorLabel }} -->
          </span>

          <span :class="cx(commonTextClass)">|</span>

          <span :class="cx(commonTextClass)"> {{ props.isMaxLevel ? "MAX" : value.toFixed(0) }}% </span>
        </div>
      </template>
    </BaseProgressBar>
  </div>
</template>
