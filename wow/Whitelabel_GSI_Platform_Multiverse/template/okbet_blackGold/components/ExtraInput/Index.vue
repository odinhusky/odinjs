<template>
  <q-input
    ref="inputRef"
    v-model="inputValue"
    :rules="
      field.column_name === 'account'
        ? [Rules.required(), Rules.noWhitespace()]
        : field.required
        ? [Rules.required()]
        : []
    "
    lazy-rules
    :hide-bottom-space="shouldHideBottomSpace"
    :borderless="!isMobile"
    class="input-control form-input"
    :class="
      cx({
        'real-name-bank-match-input': props.hideBottomSpace === true,
        'mb-2': !shouldHideBottomSpace,
        'pb-4': !shouldHideBottomSpace && !field.required,
        'adjust-height': isNeedAdjustHeight,
      })
    "
    :type="hiddenColumn(field.column_name) && !showPassword ? 'password' : 'text'"
    :placeholder="field?.lang?.[nowLang] ? field?.lang[nowLang] : $t(`member.register.${field.column_name}`)"
    autocomplete="new-password"
  >
    <template #append v-if="hiddenColumn(field.column_name)">
      <q-icon
        class="eye-icon"
        :name="showPassword ? 'visibility' : 'visibility_off'"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import type { QInput } from "quasar"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRule } from "src/common/hooks/useRule"
import { cx } from "src/common/utils/cx"
import { computed, ref } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()
const { isMobile } = useMediaQuery()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  hideBottomSpace?: boolean
  field: {
    column_name: string
    customize: boolean
    edit: boolean
    lang?: {
      [key: string]: string
    }
    required: boolean
    type: number
    values: []
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: 1,
    values: [],
  }),
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value),
})

const isNeedAdjustHeight = computed(() => {
  return props.field.column_name === "account" || props.field.column_name === "password"
})

const inputRef = ref<QInput | null>(null)
const shouldHideBottomSpace = computed<boolean>(
  () => props.hideBottomSpace === true && inputRef.value?.hasError !== true
)
const showPassword = ref(false)
</script>

<style lang="scss" scoped>
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

.form-input {
  :deep(.q-field__inner) {
    .q-field__control {
      height: 2.5rem;
      .q-field__append {
        height: 100%;
      }
    }
  }
  :deep(.q-field__control) {
    &:before {
      border-bottom: 1px solid $gray-border-color;
    }
  }
}

.adjust-height {
  :deep(.q-field__native) {
    height: calc(100% - 2px);
  }
}
</style>
