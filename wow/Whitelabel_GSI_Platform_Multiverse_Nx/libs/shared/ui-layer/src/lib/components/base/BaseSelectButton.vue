<script setup lang="ts">
interface SelectButtonOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options: SelectButtonOption[]
  size?: "lg" | "xl"
  disabled?: boolean
  classObj?: {
    root?: string
    option?: string
    optionActive?: string
    optionInactive?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  size: "lg",
  disabled: false,
  classObj: () => ({})
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  change: [value: string | number]
}>()

const wrapperPaddingClass = computed(() => (props.size === "xl" ? "p-2" : "p-1"))

const handleClick = (option: SelectButtonOption) => {
  if (props.disabled || option.disabled) return
  emit("update:modelValue", option.value)
  emit("change", option.value)
}

const isActive = (option: SelectButtonOption) => option.value === props.modelValue
</script>

<template>
  <div
    :class="
      cx(
        'inline-flex w-fit items-stretch gap-1 rounded-[100px] bg-[var(--tab-tab-bg-rounded-primary-enabled)]',
        wrapperPaddingClass,
        props.disabled && 'opacity-60 pointer-events-none',
        props.classObj?.root
      )
    "
  >
    <BasePlainBtn
      v-for="option in props.options"
      :key="option.value"
      type="button"
      :disabled="props.disabled || option.disabled"
      :class="
        cx(
          'flex min-h-[40px] items-center justify-center gap-1 self-stretch rounded-[100px] px-5 py-2',
          'text-[14px] leading-5 font-semibold font-[\'Open Sans\'] transition-colors duration-200',
          isActive(option)
            ? 'bg-[linear-gradient(90deg,var(--tab-tab-bg-rounded-primary-left-active)_0%,var(--tab-tab-bg-primary-dark-right-active)_100%)] text-[var(--tab-tab-title-rounded-primary-active)]'
            : 'bg-transparent text-[var(--tab-tab-title-rounded-primary-active)]',
          !isActive(option) && 'hover:bg-white/10',
          props.classObj?.option,
          isActive(option) ? props.classObj?.optionActive : props.classObj?.optionInactive
        )
      "
      @click="handleClick(option)"
    >
      {{ option.label }}
    </BasePlainBtn>
  </div>
</template>
