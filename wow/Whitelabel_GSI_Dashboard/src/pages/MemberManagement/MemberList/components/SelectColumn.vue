<template>
  <div class="column">
    <p v-if="props.item.column_name">
      {{ `${props.item.required ? "*" : ""} ${$t(`website_settings_reg.${props.item.column_name}`)}` }}
    </p>

    <q-select
      v-model="model"
      outlined
      :options="SelectOptions"
      map-options
      emit-value
      :hide-selected="!model"
      :disable="!props.item.edit"
      :rules="props.item.required ? [Rules.required()] : [Rules.noRule]"
      class="default-input"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive } from "vue"
  import { INPUT_TYPE } from "src/utils/constants"
  import { useRule } from "src/hook/useRule"
  import type * as Response from "src/api/response.type"
  import { LANGUAGE_TYPE, MEMBER_COLUMN_NAME } from "src/utils/constants"
  import { useLanguageStore } from "@/stores/languageStore"

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
      type: INPUT_TYPE.Enums.SELECT,
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

  const SelectOptions = computed(() => {
    return props.item.column_name === MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL
      ? dropdownData.memberLevel
      : props.item.values
  })

  const Rules = useRule()
  const languageStore = useLanguageStore()

  function getDynamicLangValue(data: any): string {
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
  }
  const dropdownData = reactive<{
    memberLevel: {
      label: string
      value: number
    }[]
  }>({
    memberLevel: []
  })

  onMounted(() => {
    if (props.item.column_name === MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL) {
      dropdownData.memberLevel = props.item.values.map((e) => {
        const label = getDynamicLangValue(e.label)
        const value = typeof e.value === "number" ? e.value : parseFloat(e.value)
        return {
          label,
          value
        }
      })
      model.value = dropdownData.memberLevel[0].value
    }
  })
</script>

<style scoped lang="scss"></style>
