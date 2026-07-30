<script setup lang="ts">
interface Props {
  active?: boolean
  disabled?: boolean
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    button?: string
    icon?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const iconName = computed(() => {
  return props.active ? "material-symbols:favorite-rounded" : "material-symbols:favorite-outline-rounded"
})

const buttonClass = computed(() => {
  return cx(
    "!flex !w-8 !h-8 !aspect-square !flex-col !items-center !justify-center !rounded-full !border-0 transition-colors duration-200",
    props.active
      ? "!bg-[var(--icon-icon-bg-light)] hover:!bg-[var(--icon-icon-bg-light)]"
      : "!bg-[var(--icon-icon-bg-dark)] hover:!bg-[var(--icon-icon-bg-light)]",
    props.class,
    props.classObj?.button
  )
})

const iconClass = computed(() => {
  return cx("text-[#ff4a4a]", props.classObj?.icon)
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit("click", event)
}
</script>

<template>
  <BaseIconBtn
    :icon="iconName"
    theme="normal"
    size="md"
    :disabled="props.disabled"
    :class-obj="{
      button: buttonClass,
      icon: iconClass
    }"
    @click="handleClick"
  />
</template>
