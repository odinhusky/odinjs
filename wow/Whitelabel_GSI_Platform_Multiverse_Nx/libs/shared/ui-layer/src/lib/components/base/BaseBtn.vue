<script setup lang="ts">
import Button from "primevue/button"

type BaseBtnTheme = (typeof BASE_BTN_THEME_OBJ)[keyof typeof BASE_BTN_THEME_OBJ]
type BaseBtnCategory = (typeof BASE_BTN_CATEGORY_OBJ)[keyof typeof BASE_BTN_CATEGORY_OBJ]
type BaseBtnSize = (typeof BASE_BTN_SIZE_OBJ)[keyof typeof BASE_BTN_SIZE_OBJ]

interface BaseBtnProps {
  theme?: BaseBtnTheme // 💡 主題切換
  category?: BaseBtnCategory // 💡 類別切換
  size?: BaseBtnSize | string | undefined
  active?: boolean
  rounded?: boolean // 💡 圓角設定
  disabled?: boolean
  loading?: boolean
  icon?: string
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    button?: string // 針對 根節點 (button)
    label?: string // 針對 文字標籤 (label)
  }
}

const baseBtnProps = withDefaults(defineProps<BaseBtnProps>(), {
  theme: BASE_BTN_THEME_OBJ.PRIMARY,
  size: BASE_BTN_SIZE_OBJ.MD,
  category: BASE_BTN_CATEGORY_OBJ.SOLID,
  active: false,
  rounded: false,
  disabled: false
})

// 主題類名映射 (讓 Tailwind 編譯器抓得到完整字串)
const themeMap = {
  primary: {
    solid: {
      text: "text-[var(--button-button-title-primary-enabled)]",
      bg: cx(BG_PRIMARY),
      border: "!border-none",
      hover:
        "hover:!bg-none hover:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-hover)_0%,var(--button-button-bg-primary-hover)_100%)] hover:!text-[var(--button-button-title-primary-enabled)]",
      active:
        "active:!bg-none active:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-active)_0%,var(--button-button-bg-primary-active)_100%)]",
      disabled:
        "disabled:!bg-none disabled:!bg-[linear-gradient(90deg,var(--button-button-bg-primary-disabled)_0%,var(--button-button-bg-primary-disabled)_100%)] disabled:!text-[var(--button-button-title-primary-disabled)]"
    },
    outline: {
      text: "text-[var(--button-button-bg-primary-left-enabled)]",
      bg: "bg-transparent",
      border: "!border-[1px] !border-[var(--button-button-bg-primary-left-enabled)]",
      hover:
        "hover:!border-[var(--button-button-bg-border-hover)] hover:!text-[var(--button-button-title-border-hover)]",
      active:
        "active:!border-[var(--button-button-bg-border-active)] active:!text-[var(--button-button-title-border-active)]",
      disabled:
        "disabled:!border-[var(--button-button-bg-border-disabled)] disabled:!text-[var(--button-button-title-border-disabled)]"
    },
    text: {
      text: "text-[var(--button-button-bg-primary-left-enabled)]",
      bg: "!bg-transparent",
      border: "!border-none",
      hover: "hover:!text-[var(--button-button-bg-primary-hover)] hover:!bg-transparent hover:!shadow-none",
      active: "active:!text-[var(--button-button-bg-primary-active)] active:!shadow-none",
      disabled: "disabled:!bg-transparent disabled:!text-[var(--button-button-title-primary-disabled)]"
    }
  },
  secondary: {
    solid: {
      text: "text-[var(--button-button-title-secondary-enabled)]",
      bg: cx(BG_SECONDARY),
      border: "!border-none",
      hover:
        "hover:!bg-[linear-gradient(180deg,var(--button-button-bg-secondary-hover)_0%,var(--button-button-bg-secondary-hover)_100%)] hover:!text-[var(--button-button-title-secondary-enabled)]",
      active:
        "active:!bg-none active:!bg-[linear-gradient(180deg,var(--button-button-bg-secondary-active)_0%,var(--button-button-bg-secondary-active)_100%)]",
      disabled:
        "disabled:!bg-none disabled:!bg-[linear-gradient(180deg,var(--button-button-bg-secondary-disabled)_0%,var(--button-button-bg-secondary-disabled)_100%)] disabled:!text-[var(--button-button-title-secondary-disabled)]"
    },
    outline: {
      text: "text-[var(--button-button-bg-secondary-left-enabled)]",
      bg: "bg-transparent",
      border: "!border-[1px] !border-[var(--button-button-bg-secondary-left-enabled)]",
      hover:
        "hover:!border-[var(--button-button-bg-border-secondary-hover)] hover:!text-[var(--button-button-title-border-secondary-hover)]",
      active:
        "active:!border-[var(--button-button-bg-border-secondary-active)] active:!text-[var(--button-button-title-border-secondary-active)]",
      disabled:
        "disabled:!border-[var(--button-button-bg-border-disabled)] disabled:!text-[var(--button-button-title-border-disabled)]"
    },
    text: {
      text: "text-[var(--button-button-bg-secondary-left-enabled)]",
      bg: "!bg-transparent",
      border: "!border-none",
      hover: "hover:!text-[var(--button-button-bg-secondary-hover)] hover:!shadow-none",
      active: "active:!text-[var(--button-button-bg-secondary-active)] active:!shadow-none",
      disabled: "disabled:!bg-transparent disabled:!text-[var(--button-button-title-secondary-disabled)]"
    }
  }
}

// 尺寸映射
const sizeClasses = {
  xl: "px-4 py-3 text-base leading-6 font-bold rounded-lg ",
  lg: "px-4 py-2 text-base leading-6 font-bold rounded-lg ",
  md: "px-3 py-1 text-base leading-6 font-bold rounded-lg ",
  sm: "px-3 py-0.5 text-sm leading-5 font-bold rounded-lg "
}

const currentStyles = computed(() => {
  const themeGroup = themeMap[baseBtnProps.theme] || themeMap[BASE_BTN_THEME_OBJ.PRIMARY]
  // 💡 根據 category 選擇對應的樣式組
  return themeGroup[baseBtnProps.category as BaseBtnCategory] || themeGroup[BASE_BTN_CATEGORY_OBJ.SOLID]
})

const computedSizeClass = computed(() => {
  return sizeClasses[baseBtnProps.size as keyof typeof sizeClasses] || sizeClasses.md
})

const isNumberCategory = computed(() => baseBtnProps.category === BASE_BTN_CATEGORY_OBJ.NUMBER)

const numberCategoryClass = computed(() => {
  return cx(
    "inline-flex px-3 py-1 justify-center items-center !rounded-[var(--rounded-rounded-full,100px)] !border-[1px]",
    "text-[14px] leading-5 font-bold text-[var(--tag-tag-title-secondary-enabled)]",
    "!border-transparent !bg-[var(--tag-tag-bg-secondary-enabled)]",
    !baseBtnProps.active &&
      "hover:!border-[var(--tag-tag-border-secondary-hover)] hover:!bg-[var(--tag-tag-bg-secondary-hover)]",
    "active:!bg-[var(--tag-tag-bg-secondary-active)]",
    baseBtnProps.active && "!bg-[var(--tag-tag-bg-secondary-active)]"
  )
})
</script>

<template>
  <Button
    :disabled="baseBtnProps.disabled"
    :loading="baseBtnProps.loading"
    :icon="baseBtnProps.icon"
    :variant="baseBtnProps.category === BASE_BTN_CATEGORY_OBJ.TEXT ? 'text' : undefined"
    :pt="{
      root: ({ props: ptProps, context }) => ({
        class: cx(
          'inline-flex items-center justify-center transition-all duration-200',

          !isNumberCategory && 'border-[var(--color-transparent)] !bg-transparent',

          // 直接使用 Computed 傳出來的完整字串
          !isNumberCategory && currentStyles.text,
          !isNumberCategory && currentStyles.bg,
          !isNumberCategory && currentStyles.hover,
          !isNumberCategory && currentStyles.border,
          !isNumberCategory && currentStyles.active,
          !isNumberCategory && currentStyles.disabled,

          isNumberCategory && numberCategoryClass,

          !isNumberCategory && 'hover:shadow-lg',
          'disabled:cursor-not-allowed',

          // 💡 圓角判斷：如果 rounded 為 true 則強制使用 pill 樣式，否則使用 size 預設的 rounded-lg
          !isNumberCategory && (baseBtnProps.rounded ? '!rounded-[100px]' : computedSizeClass),

          // 尺寸套用
          !isNumberCategory && computedSizeClass,

          // 額外的 class（如果有的話）
          baseBtnProps.class,
          baseBtnProps?.classObj?.button
        )
      }),
      // 💡 這裡對應的是包裹 Slot 的那個 span 標籤
      label: ({ props: ptProps }) => ({
        class: cx(
          'p-button-label flex items-center justify-center gap-2', // 預設 flex 方便處理 slot 內的元件排版
          baseBtnProps?.classObj?.label
        )
      }),
      loadingIcon: { class: 'mr-2' }
    }"
  >
    <slot />
  </Button>
</template>
