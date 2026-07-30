<script setup lang="ts">
import Button from "primevue/button"

interface Props {
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  loading?: boolean
  icon?: string
  variant?: string
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    button?: string
    label?: string
    loadingIcon?: string
  }
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit("click", event)
}

const resetButtonClass = cx(FLEX_ITEMS_CENTER, "appearance-none ring-0 outline-none")
</script>

<template>
  <Button
    unstyled
    v-bind="$attrs"
    :type="props.type"
    :disabled="props.disabled"
    :loading="props.loading"
    :icon="props.icon"
    :variant="props.variant"
    :pt="{
      root: {
        class: cx(resetButtonClass, props.class, props.classObj?.button)
      },
      label: {
        class: cx(props.classObj?.label)
      },
      loadingIcon: {
        class: cx(props.classObj?.loadingIcon)
      }
    }"
    @click="handleClick"
  >
    <slot />
  </Button>
</template>
