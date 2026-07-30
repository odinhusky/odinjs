<script setup lang="ts">
interface Props {
  label: string
  icon: string
  iconSrc?: string
  active?: boolean
  activeMode?: "row" | "icon"
  hoverLikeActive?: boolean
  collapsed?: boolean
  classObj?: {
    root?: string
    button?: string
    iconWrap?: string
    icon?: string
    text?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  iconSrc: "",
  active: false,
  activeMode: "row",
  hoverLikeActive: true,
  collapsed: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "click"): void
}>()

const rowActiveClass =
  "!bg-[linear-gradient(90deg,var(--sidebar-sidebar-item-bg-left-active)_0%,var(--sidebar-sidebar-item-bg-transparent-active)_100%)]"
const rowHoverClass =
  "hover:!bg-[linear-gradient(90deg,var(--sidebar-sidebar-item-bg-left-active)_0%,var(--sidebar-sidebar-item-bg-transparent-active)_100%)]"

const iconActiveClass =
  "!bg-[linear-gradient(90deg,var(--sidebar-sidebar-item-bg-left-active)_0%,var(--sidebar-sidebar-item-bg-right-active)_100%)]"
const iconHoverClass =
  "group-hover:!bg-[linear-gradient(90deg,var(--sidebar-sidebar-item-bg-left-active)_0%,var(--sidebar-sidebar-item-bg-right-active)_100%)]"

const buttonClass = computed(() =>
  cx(
    FLEX_ITEMS_CENTER,
    "gap-2",
    "group w-full rounded-lg transition-all duration-200",
    props.activeMode === "row" ? "px-3 py-2" : "px-4 py-3",
    props.collapsed ? "justify-center" : "justify-start",
    props.activeMode === "row" && props.active && rowActiveClass,
    props.activeMode === "row" && props.hoverLikeActive && rowHoverClass,
    props.classObj?.button
  )
)

const iconWrapClass = computed(() =>
  cx(
    "h-6 w-6 shrink-0 rounded-md p-1",
    FLEX_CENTER,
    "transition-all duration-200",
    props.activeMode === "icon" && props.active && iconActiveClass,
    props.activeMode === "icon" && props.hoverLikeActive && iconHoverClass,
    props.classObj?.iconWrap
  )
)

const iconClass = computed(() =>
  cx(
    "text-[var(--sidebar-sidebar-item-icon-enabled)] group-hover:text-[var(--sidebar-sidebar-item-icon-active)]",
    props.active && "text-[var(--sidebar-sidebar-item-icon-active)]",
    props.classObj?.icon
  )
)

const textClass = computed(() =>
  cx(
    "truncate transition-colors duration-200",
    "text-left text-sm leading-5 font-bold ",
    "text-[var(--sidebar-sidebar-item-title-enabled)]",
    props.active && "text-[var(--sidebar-sidebar-item-icon-active)]",
    props.hoverLikeActive && "group-hover:text-[var(--sidebar-sidebar-item-icon-active)]",
    props.classObj?.text
  )
)
</script>

<template>
  <div :class="cx('w-full', props.classObj?.root)">
    <BasePlainBtn :class-obj="{ button: buttonClass }" @click="emit('click')">
      <div :class="iconWrapClass">
        <BaseImage
          v-if="props.iconSrc"
          :src="props.iconSrc"
          :class-obj="{
            container: 'h-6 w-6',
            image: 'h-5 w-5 object-contain',
            placeholder: 'h-5 w-5 !min-h-0 !bg-transparent'
          }"
        />
        <BaseIcon v-else :name="props.icon" size="2rem" :class-name="iconClass" />
      </div>

      <span v-if="!props.collapsed" :class="textClass">{{ props.label }}</span>
    </BasePlainBtn>
  </div>
</template>
