export const FULL = "w-full h-full"
export const FIT = "w-fit h-fit"

export const FLEX_CENTER = "flex justify-center items-center"
export const FLEX_ITEMS_CENTER = "flex items-center"
export const FLEX_ITEMS_STRETCH = "flex items-stretch"
export const FLEX_JUSTIFY_CENTER = "flex justify-center"
export const FLEX_ITEMS_END = "flex items-end"
export const FLEX_JUSTIFY_END = "flex justify-end"
export const FLEX_COL = "flex flex-col"
export const FLEX_END_CENTER = "flex justify-end items-center"

export const LAYOUT_MAX_WIDTH = "max-w-[1200px]"
export const CONTAINER_PADDING = "px-5 py-4"
export const HOMEVIEW_CONTAINER_PADDING_X_CLASS = "w-full px-8 mob:px-3"
export const HOMEVIEW_CONTAINER_PADDING_Y_CLASS = "w-full py-6 mob:py-2"
export const HOMEVIEW_CONTAINER_GAPPING_CLASS = cx(FLEX_COL, "gap-6 mob:gap-2")

export const X_CENTER = "left-1/2 -translate-x-[50%]"
export const Y_CENTER = "top-1/2 -translate-y-[50%]"
export const XY_CENTER = "left-1/2 -translate-x-[50%] top-1/2 -translate-y-[50%]"

export const MODAL_FIX = "fixed left-0 top-0 right-0 bottom-0"

export const DEFAULT_BG = "bg-no-repeat bg-cover bg-center"
export const PATTERN_BG = "bg-repeat bg-fixed"

export const remToPx = 16

export const OVERFLOW_X_AUTO_HIDDEN =
  "overflow-x-auto overflow-y-hidden overscroll-x-contain [&[&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"

export const OVERFLOW_Y_AUTO_HIDDEN =
  "overflow-y-auto overflow-x-hidden overscroll-y-contain [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"

export const SCROLLBAR_HIDDEN = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"

export const BG_PRIMARY =
  "!bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)]"
export const BG_SECONDARY =
  "!bg-[linear-gradient(180deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]"
