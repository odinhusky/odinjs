<script setup lang="ts">
import { BASE_TAB_CATEGORY_OBJ } from "@shared-lib/constants/propsCategoryObj"

type BaseTabCategory = (typeof BASE_TAB_CATEGORY_OBJ)[keyof typeof BASE_TAB_CATEGORY_OBJ]

interface Props {
  active?: boolean
  category?: BaseTabCategory
  disabled?: boolean
  classObj?: {
    root?: string
    item?: string
    itemActive?: string
    itemInactive?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  category: BASE_TAB_CATEGORY_OBJ.DEFAULT,
  disabled: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const roundBasicClass =
  "h-8 px-5 py-2 rounded-[100px] inline-flex items-center justify-center text-sm leading-5 font-semibold"
const defaultBasicClass =
  "h-10 px-5 py-2 rounded-none rounded-tl-lg rounded-tr-lg inline-flex items-center justify-center text-base leading-6 font-bold"
const squareBasicClass =
  "inline-flex h-[58px] px-4 py-3 justify-center items-center gap-3 rounded-xl border-2 text-sm font-bold leading-[normal]"
const countryBasicClass =
  "inline-flex px-4 py-3 justify-center items-center gap-3 rounded-[100px] border-2 text-sm font-bold leading-[normal]"

const activeClass = computed(() => {
  if (props.category === BASE_TAB_CATEGORY_OBJ.ROUND) {
    return cx(
      roundBasicClass,
      "bg-[linear-gradient(90deg,var(--tab-tab-bg-rounded-primary-left-active)_0%,var(--tab-tab-bg-primary-dark-right-active)_100%)]",
      "text-[var(--tab-tab-title-rounded-primary-active)]",
      props.classObj?.itemActive
    )
  }

  if (props.category === BASE_TAB_CATEGORY_OBJ.SQUARE) {
    return cx(
      squareBasicClass,
      "border-[var(--border-border-accent)] bg-[var(--list-list-bg-active)] text-[var(--list-list-acent-title-active)]",
      props.classObj?.itemActive
    )
  }

  if (props.category === BASE_TAB_CATEGORY_OBJ.COUNTRY) {
    return cx(
      countryBasicClass,
      "border-[var(--border-border-accent)] bg-[var(--list-list-bg-active)] text-[var(--list-list-acent-title-active)]",
      props.classObj?.itemActive
    )
  }

  return cx(
    defaultBasicClass,
    "bg-[linear-gradient(90deg,var(--tab-tab-bg-rounded-primary-left-active)_0%,var(--tab-tab-bg-primary-dark-right-active)_100%)]",
    "text-[var(--tab-tab-title-square-primary-active)]",
    props.classObj?.itemActive
  )
})

const inActiveClass = computed(() => {
  if (props.category === BASE_TAB_CATEGORY_OBJ.ROUND) {
    return cx(
      roundBasicClass,
      "bg-[var(--tab-tab-bg-rounded-primary-enabled)] text-[var(--tab-tab-title-rounded-primary-enabled)]",
      props.classObj?.itemInactive
    )
  }

  if (props.category === BASE_TAB_CATEGORY_OBJ.SQUARE) {
    return cx(
      squareBasicClass,
      "border-[var(--border-border-primary)] bg-[var(--list-list-bg-enabled)] text-[var(--list-list-title-enabled)]",
      "hover:border-[var(--border-border-accent)] hover:bg-[var(--list-list-bg-active)] hover:text-[var(--list-list-acent-title-active)]",
      props.classObj?.itemInactive
    )
  }

  if (props.category === BASE_TAB_CATEGORY_OBJ.COUNTRY) {
    return cx(
      countryBasicClass,
      "border-[var(--border-border-primary)] bg-[var(--list-list-bg-enabled)] text-[var(--list-list-title-enabled)]",
      "hover:border-[var(--border-border-accent)] hover:bg-[var(--list-list-bg-active)] hover:text-[var(--list-list-acent-title-active)]",
      props.classObj?.itemInactive
    )
  }

  return cx(
    defaultBasicClass,
    "bg-[var(--tab-tab-bg-square-primary-enabled)] text-[var(--tab-tab-title-square-primary-enabled)]",
    props.classObj?.itemInactive
  )
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit("click", event)
}
</script>

<template>
  <div :class="cx('inline-flex', props.classObj?.root)">
    <BasePlainBtn
      type="button"
      :disabled="disabled"
      :class-obj="{
        button: cx(
          'transition-colors',
          'appearance-none border-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          props.active ? activeClass : inActiveClass,
          props.classObj?.item
        )
      }"
      @click="handleClick"
    >
      <slot />
    </BasePlainBtn>
  </div>
</template>
