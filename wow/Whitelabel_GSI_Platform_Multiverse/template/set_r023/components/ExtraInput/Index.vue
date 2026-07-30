<template>
  <q-input
    ref="inputRef"
    v-model="inputValue"
    :rules="field.required ? [Rules.required()] : []"
    lazy-rules
    :hide-bottom-space="shouldHideBottomSpace"
    outlined
    class="form-input"
    :class="{
      'real-name-bank-match-input': props.hideBottomSpace === true,
      'mb-2': !shouldHideBottomSpace,
      'pb-4': !shouldHideBottomSpace && !field.required,
    }"
    :type="hiddenColumn(field.column_name) && !showPassword ? 'password' : 'text'"
    :placeholder="
      field.column_name === 'password' || field.column_name === 'account'
        ? ''
        : field?.lang?.[nowLang]
        ? field?.lang[nowLang]
        : $t(`member.register.${field.column_name}`)
    "
    :autocomplete="hiddenColumn(field.column_name) ? 'new-password' : 'off'"
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
import { useRule } from "src/common/hooks/useRule"
import { computed, ref } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()

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

const showPassword = ref(false)
const inputRef = ref<QInput | null>(null)
const shouldHideBottomSpace = computed<boolean>(
  () => props.hideBottomSpace === true && inputRef.value?.hasError !== true
)
</script>

<style lang="sass" scoped>
.form-input
  ::v-deep(.q-field__inner)
    .q-field__control
      height: 40px
      .q-field__append
        height: 100%
</style>
