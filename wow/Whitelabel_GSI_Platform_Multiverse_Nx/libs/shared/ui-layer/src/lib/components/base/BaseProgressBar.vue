<script setup lang="ts">
import ProgressBar from "primevue/progressbar"
import { BASE_PROGRESS_BAR_THEME_OBJ } from "@shared-lib/constants/propsCategoryObj"

type BaseProgressBarTheme = (typeof BASE_PROGRESS_BAR_THEME_OBJ)[keyof typeof BASE_PROGRESS_BAR_THEME_OBJ]

interface Props {
  value?: number
  theme?: BaseProgressBarTheme
  height?: number
  classObj?: {
    wrapper?: string
    track?: string
    fill?: string
    top?: string
    bottom?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  theme: BASE_PROGRESS_BAR_THEME_OBJ.PRIMARY,
  height: 10,
  classObj: () => ({})
})

const normalizedValue = computed(() => {
  const value = Number(props.value ?? 0)
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
})

const trackClassMap: Record<BaseProgressBarTheme, string> = {
  primary: cx(
    "rounded-[100px] border border-[var(--progress-bar-progress-border-primary)]",
    "bg-[var(--progress-bar-progress-bg)]"
  ),
  secondary: cx("rounded-[100px]", "bg-[var(--progress-bar-progress-bg)]")
}

const fillClassMap: Record<BaseProgressBarTheme, string> = {
  primary: cx(
    "rounded-[100px]",
    "bg-[linear-gradient(180deg,var(--progress-bar-progress-fill-primary-from)_0%,var(--progress-bar-progress-fill-primary-to)_100%)]"
  ),
  secondary: cx(
    "rounded-l-[100px] rounded-r-none",
    "bg-[linear-gradient(180deg,var(--progress-bar-progress-fill-secondary-from)_0%,var(--progress-bar-progress-fill-secondary-to)_100%)]"
  )
}

const progressStyle = computed(() => ({
  height: `${props.height}px`
}))
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-1', props.classObj?.wrapper)">
    <div v-if="$slots.top" :class="cx('w-full', props.classObj?.top)">
      <slot name="top" :value="normalizedValue" />
    </div>

    <ProgressBar
      :value="normalizedValue"
      :pt="{
        root: {
          class: cx('w-full overflow-hidden relative', trackClassMap[props.theme], props.classObj?.track),
          style: progressStyle
        },
        value: {
          class: cx('transition-all duration-300', fillClassMap[props.theme], props.classObj?.fill)
        },
        label: {
          class: '!hidden'
        }
      }"
    >
      <template #default>
        <slot :value="normalizedValue" />
      </template>
    </ProgressBar>

    <div v-if="$slots.bottom" :class="cx('w-full', props.classObj?.bottom)">
      <slot name="bottom" :value="normalizedValue" />
    </div>
  </div>
</template>
