<script setup lang="ts">
import { computed } from "vue"
import type { PromotionTypeOption } from "../../composables/usePromotionFlow"
import type { PROMOTION_TYPE_ENUMS } from "../../constants/enums/promotionType"

const props = defineProps<{
  modelValue: PROMOTION_TYPE_ENUMS
  options: PromotionTypeOption[]
}>()

const emit = defineEmits<{
  "update:modelValue": [value: PROMOTION_TYPE_ENUMS]
}>()

const activeIndex = computed(() => Math.max(0, props.options.findIndex((item) => item.value === props.modelValue)))
const activeOption = computed(() => props.options[activeIndex.value] || props.options[0])

const selectOption = (value: PROMOTION_TYPE_ENUMS) => {
  emit("update:modelValue", value)
}

const moveOption = (direction: -1 | 1) => {
  const nextIndex = activeIndex.value + direction
  const nextOption = props.options[nextIndex]
  if (!nextOption) return
  selectOption(nextOption.value)
}
</script>

<template>
  <div>
    <div class="phone:hidden w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div class="inline-flex min-w-max rounded-full bg-[var(--card-card-bg-secondary-enabled)] p-2">
        <button
          v-for="option in props.options"
          :key="option.value"
          type="button"
          :class="
            cx(
              'h-10 min-w-[92px] shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-bold leading-5 transition-colors',
              props.modelValue === option.value
                ? 'bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] text-[var(--button-button-title-primary-enabled)]'
                : 'text-[var(--text-text-primary)] hover:text-[var(--button-button-title-primary-enabled)]'
            )
          "
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="hidden phone:flex h-11 w-full items-center justify-between bg-[var(--card-card-bg-secondary-enabled)] px-4">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center text-[var(--text-text-primary)] disabled:opacity-40"
        :disabled="activeIndex <= 0"
        @click="moveOption(-1)"
      >
        <BaseIcon name="mdi:chevron-up" size="18px" />
      </button>
      <span class="min-w-0 truncate px-3 text-sm font-bold leading-5 text-[var(--text-text-primary)]">
        {{ activeOption?.label }}
      </span>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center text-[var(--text-text-primary)] disabled:opacity-40"
        :disabled="activeIndex >= props.options.length - 1"
        @click="moveOption(1)"
      >
        <BaseIcon name="mdi:chevron-down" size="18px" />
      </button>
    </div>
  </div>
</template>
