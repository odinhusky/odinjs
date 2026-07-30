<template>
  <p>{{ `${props.item.required ? "*" : ""} ${t(`website_settings_reg.${props.item.column_name}`)}` }}</p>
  <q-input
    v-model="model"
    outlined
    :disable="!props.item.edit"
    :rules="props.item.required ? [Rules.required()] : [Rules.noRule]"
    class="default-input"
    :hide-bottom-space="props.hideBottomSpace"
  >
    <template #prepend>
      <q-icon name="event" class="cursor-pointer" size="16px">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="model" mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { INPUT_TYPE } from "src/utils/constants"
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
    hideBottomSpace?: boolean
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
    }),
    hideBottomSpace: false
  })

  const emit = defineEmits(["update:modelValue"])
  const { t } = useI18n()

  const model = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit("update:modelValue", value)
    }
  })

  const Rules = useRule()
</script>

<style scoped lang="scss"></style>
