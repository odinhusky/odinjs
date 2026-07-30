<template>
  <q-input
    ref="inputRef"
    v-model="inputValue"
    :rules="
      field?.column_rule?.enabled
        ? [
            (val) =>
              checkCustomRule({
                val,
                Rules,
                column_rule: field?.column_rule ? field.column_rule : DEFAULT_CUSTOM_COLUMN_RULE,
                column_name: field.column_name,
              }),
            Rules.noWhitespace(),
          ]
        : field.required
        ? [Rules.required()]
        : []
    "
    lazy-rules
    :hide-bottom-space="shouldHideBottomSpace"
    class="input-control form-input"
    :class="{
      'real-name-bank-match-input': props.hideBottomSpace === true,
      'mb-2': !shouldHideBottomSpace,
      'pb-4': !shouldHideBottomSpace && !field.required,
    }"
    :type="hiddenColumn(field.column_name) && !showPassword ? 'password' : 'text'"
    :placeholder="
      field.column_name === 'password' || field.column_name === 'account'
        ? ''
        : customPlaceholder
        ? customPlaceholder
        : field?.lang?.[nowLang]
        ? field?.lang?.[nowLang]
        : $t(`member.register.${field.column_name}`)
    "
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
import * as Response from "src/api/response.type"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { DEFAULT_CUSTOM_COLUMN_RULE, useRule } from "src/common/hooks/useRule"
import { checkCustomRule } from "src/common/utils/customRulesUtils"
import { computed, ref } from "vue"

const Rules = useRule()
const { nowLang } = useLanguage()
const { hiddenColumn } = useAuth()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  field: Response.RegistInputCustom
  customPlaceholder?: string
  hideBottomSpace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    column_rule: {
      ...DEFAULT_CUSTOM_COLUMN_RULE,
    },
    customize: false,
    edit: false,
    lang: {},
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
