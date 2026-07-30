<script setup lang="ts">
import { useI18n } from "#imports"

interface OptionItem {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  options: OptionItem[]
  label?: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  invalid: false,
  errorMessage: ""
})
const { t } = useI18n()

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  change: [value: string | number]
}>()

const handleChange = (value: string | number) => {
  emit("update:modelValue", value)
  emit("change", value)
}
</script>

<template>
  <BaseSelect
    :model-value="props.modelValue"
    :options="props.options"
    option-label="label"
    option-value="value"
    :label="props.label || t('modal.type')"
    :placeholder="props.placeholder || t('placeholder.pleaseSelect')"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :error-message="props.errorMessage"
    @update:model-value="handleChange"
  />
</template>
