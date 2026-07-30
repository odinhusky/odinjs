<template>
  <div v-if="visible && hasContent" v-bind="$attrs">
    <q-checkbox
      v-model="modelValue"
      :checked-icon="useCircleIcons ? 'check_circle' : undefined"
      :unchecked-icon="useCircleIcons ? 'radio_button_unchecked' : undefined"
      :color="color"
      :size="size"
      :disable="disabled"
      :dark="dark"
    />
    <span class="agree-text">{{ label || t("member.terms.agreeTerms") }}</span>
  </div>
</template>

<script setup lang="ts">
import type * as Request from "src/api/request.type"
import { useResponsibilityClauseQuery } from "src/common/apiHooks/responsibilityClause/useResponsibilityClauseQuery"
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    position: Request.GetResponsibilityClause["position"]
    disabled?: boolean
    useCircleIcons?: boolean
    color?: string
    size?: string
    dark?: boolean
    label?: string
    visible?: boolean
  }>(),
  {
    disabled: false,
    useCircleIcons: false,
    color: "term",
    size: "xs",
    dark: false,
    label: "",
    visible: true,
  }
)

const emit = defineEmits<{
  hasContent: [value: boolean]
}>()

const modelValue = defineModel<boolean>({
  required: true,
})

const { t } = useI18n()
const { data: clauseData } = useResponsibilityClauseQuery({
  position: () => props.position,
})
const hasContent = computed(() => clauseData.value?.hasContent ?? false)
const visible = computed(() => props.visible)

watch(
  hasContent,
  (value) => {
    emit("hasContent", value)
  },
  { immediate: true }
)
</script>
