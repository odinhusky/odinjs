<script setup lang="ts">
import { BASE_ICON_BTN_SIZE_OBJ, BASE_ICON_BTN_THEME_OBJ } from "@shared-lib/constants/propsCategoryObj"

type BaseIconBtnTheme = (typeof BASE_ICON_BTN_THEME_OBJ)[keyof typeof BASE_ICON_BTN_THEME_OBJ]
type BaseIconBtnSize = (typeof BASE_ICON_BTN_SIZE_OBJ)[keyof typeof BASE_ICON_BTN_SIZE_OBJ]

interface BaseIconBtnProps {
  icon: string
  theme?: BaseIconBtnTheme
  size?: BaseIconBtnSize
  disabled?: boolean
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    button?: string
    icon?: string
  }
}

const baseIconBtnProps = withDefaults(defineProps<BaseIconBtnProps>(), {
  theme: BASE_ICON_BTN_THEME_OBJ.SECONDARY,
  size: BASE_ICON_BTN_SIZE_OBJ.MD,
  disabled: false
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const themeMap = {
  secondary: {
    base: cx(
      "!bg-[linear-gradient(180deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]",
      "text-[var(--button-button-title-icon-secondary-enabled)]",
      "!border-transparent"
    ),
    hover:
      "hover:!bg-[linear-gradient(180deg,var(--button-button-bg-icon-secondary-enabled)_0%,var(--button-button-bg-icon-secondary-enabled)_100%)]",
    active:
      "active:!bg-[linear-gradient(180deg,var(--button-button-bg-icon-secondary-active)_0%,var(--button-button-bg-icon-secondary-active)_100%)]",
    disabled:
      "disabled:!bg-[linear-gradient(180deg,var(--button-button-bg-icon-secondary-active)_0%,var(--button-button-bg-icon-secondary-active)_100%)] disabled:!text-[var(--button-button-font-title-disabled)]"
  },
  primary: {
    base: cx(
      "!bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)]",
      "text-[var(--button-button-title-icon-secondary-enabled)]",
      "!border-transparent"
    ),
    hover:
      "hover:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-hover)_0%,var(--button-button-bg-primary-hover)_100%)]",
    active:
      "active:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-active)_0%,var(--button-button-bg-primary-active)_100%)]",
    disabled:
      "disabled:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-disabled)_0%,var(--button-button-bg-primary-disabled)_100%)] disabled:!text-[var(--button-button-font-title-disabled)]"
  },
  primaryOutline: {
    base: "!bg-transparent !border-[var(--button-button-bg-border-enabled)] text-[var(--button-button-title-border-enabled)]",
    hover:
      "hover:!border-[var(--button-button-bg-border-hover)] hover:!text-[var(--button-button-title-border-enabled)]",
    active:
      "active:!border-[var(--button-button-bg-border-active)] active:!text-[var(--button-button-title-border-active)]",
    disabled:
      "disabled:!border-[var(--button-button-bg-border-disabled)] disabled:!text-[var(--button-button-font-title-disabled)]"
  },
  normal: {
    base: "!bg-transparent !border-[var(--button-button-border-icon-tertiary-hover)] text-[var(--button-button-title-icon-secondary-enabled)]",
    hover:
      "hover:!bg-[var(--button-button-bg-icon-tertiary-hover)] hover:!text-[var(--button-button-title-icon-tertiary-hover)] hover:!border-[var(--button-button-border-icon-tertiary-hover)]",
    active:
      "active:!bg-[var(--button-button-bg-icon-tertiary-hover)] active:!text-[var(--button-button-title-icon-tertiary-active)] active:!border-[var(--button-button-border-icon-tertiary-active)]",
    disabled:
      "disabled:!bg-transparent disabled:!border-[var(--button-button-bg-border-disabled)] disabled:!text-[var(--button-button-font-title-disabled)]"
  }
}

const commonClass = "rounded-lg"

const sizeMap = {
  lg: {
    button: "h-10 w-10",
    iconSize: "20px"
  },
  md: {
    button: "h-8 w-8",
    iconSize: "20px"
  },
  sm: {
    button: "h-6 w-6",
    iconSize: "16px"
  }
} as const

const currentTheme = computed(() => themeMap[baseIconBtnProps.theme] || themeMap[BASE_ICON_BTN_THEME_OBJ.SECONDARY])
const currentSize = computed(() => sizeMap[baseIconBtnProps.size] || sizeMap[BASE_ICON_BTN_SIZE_OBJ.MD])

const buttonClass = computed(() => {
  return cx(
    FLEX_CENTER,
    "shrink-0 transition-all duration-200",
    "!border !border-transparent",
    commonClass,
    currentSize.value.button,
    currentTheme.value.base,
    currentTheme.value.hover,
    currentTheme.value.active,
    currentTheme.value.disabled,
    baseIconBtnProps.class,
    baseIconBtnProps.classObj?.button
  )
})

const iconClass = computed(() => {
  return cx("text-current", baseIconBtnProps.classObj?.icon)
})
</script>

<template>
  <BasePlainBtn :disabled="baseIconBtnProps.disabled" :class="buttonClass" @click="emit('click', $event)">
    <BaseIcon :name="baseIconBtnProps.icon" :size="currentSize.iconSize" :class-name="iconClass" />
  </BasePlainBtn>
</template>
