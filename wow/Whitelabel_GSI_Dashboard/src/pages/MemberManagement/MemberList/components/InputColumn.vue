<template>
  <div class="column">
    <p>
      {{ `${props.item.required ? "*" : ""} ${$t(`website_settings_reg.${props.item.column_name}`)}` }}
    </p>
    <q-input
      v-model="model"
      outlined
      :type="isPassword ? 'password' : 'text'"
      :disable="!props.item.edit"
      :rules="props.item.required ? [Rules.required()] : [Rules.noRule]"
      :autocomplete="isPassword ? 'current-password' : props.item.column_name"
      class="default-input"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import { MEMBER_COLUMN_NAME, INPUT_TYPE } from "src/utils/constants"
  import { useRule } from "src/hook/useRule"
  import type * as Response from "src/api/response.type"

  interface Props {
    modelValue: any // 欄位為動態, 無法預先定義
    item: {
      column_name: string
      customize: boolean
      edit: boolean
      lang?: {
        [key: string]: string
      }
      required: boolean
      type: number
      values: Response.Values[]
    }
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "", // 欄位為動態, 無法預先定義
    item: () => ({
      column_name: "",
      customize: false,
      edit: false,
      required: false,
      type: INPUT_TYPE.Enums.INPUT,
      values: []
    })
  })

  const emit = defineEmits(["update:modelValue"])

  const model = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit("update:modelValue", value)
    }
  })

  const isPassword = computed(() => props.item.column_name === MEMBER_COLUMN_NAME.Enums.PASSWORD)

  const Rules = useRule()
</script>

<style scoped lang="scss"></style>
