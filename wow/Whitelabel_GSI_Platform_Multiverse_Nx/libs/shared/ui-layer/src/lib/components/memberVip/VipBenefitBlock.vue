<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  classObj?: {
    root?: string
    title?: string
    value?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const displayValue = computed(() => {
  if (typeof props.value === "string") {
    return props.value
  }

  const value = Number(props.value)
  if (Number.isNaN(value) || value <= 0) return ""
  return formatMoney(value)
})
</script>

<template>
  <div :class="cx(FLEX_COL, 'justify-center items-start text-left gap-1 flex-1', props.classObj?.root)">
    <p
      :class="
        cx(
          'text-[10px] leading-[1] text-[var(--card-card-subtitle-secondary-enabled)] text-left',
          props.classObj?.title
        )
      "
    >
      {{ props.title }}
    </p>

    <p
      :class="
        cx(
          'text-base leading-6 font-semibold text-[var(--card-card-title-primary-enabled)] text-left',
          props.classObj?.value
        )
      "
    >
      {{ displayValue }}
    </p>
  </div>
</template>
