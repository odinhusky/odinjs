<script setup lang="ts">
import { BASE_BADGE_SIZE_OBJ, BASE_BADGE_THEME_OBJ } from "@shared-lib/constants/propsCategoryObj"

type BaseBadgeSize = (typeof BASE_BADGE_SIZE_OBJ)[keyof typeof BASE_BADGE_SIZE_OBJ]
type BaseBadgeTheme = (typeof BASE_BADGE_THEME_OBJ)[keyof typeof BASE_BADGE_THEME_OBJ]

interface Props {
  size?: BaseBadgeSize
  theme?: BaseBadgeTheme
  classObj?: {
    root?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  size: BASE_BADGE_SIZE_OBJ.MD,
  theme: BASE_BADGE_THEME_OBJ.BASE,
  classObj: () => ({})
})

const sizeClassMap = {
  sm: "px-2 py-1 text-xs leading-[18px] font-bold",
  md: "px-3 py-1 text-sm leading-5 font-bold"
} as const

const themeClassMap = {
  primary: cx(
    "rounded-[100px] border border-[var(--tag-tag-border-primary)]",
    "bg-[linear-gradient(90deg,var(--tag-tag-bg-primary-left)_0%,var(--tag-tag-bg-primary-right)_100%)]",
    "text-[var(--tag-tag-title-primary)]"
  ),
  base: "rounded-[100px] bg-[var(--tag-tag-bg-default)] text-[var(--tag-tag-title-secondary-enabled)]",
  success: "rounded-[100px] bg-[var(--tag-tag-bg-default)] !text-[var(--tag-tag-title-success)]",
  fail: "rounded-[100px] bg-[var(--tag-tag-bg-default)] !text-[var(--tag-tag-title-negative)]",
  info: "rounded-[100px] bg-[var(--tag-tag-bg-default)] !text-[var(--tag-tag-title-info)]",
  warning: "rounded-[100px] bg-[var(--tag-tag-bg-default)] !text-[var(--tag-tag-title-warning)]"
} as const
</script>

<template>
  <span
    :class="
      cx(
        'inline-flex items-center justify-center whitespace-nowrap',
        sizeClassMap[props.size],
        themeClassMap[props.theme],
        props.classObj?.root
      )
    "
  >
    <slot />
  </span>
</template>
