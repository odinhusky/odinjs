<template>
  <q-select
    v-model="model"
    outlined
    :options="dropdownData.memberLevelList"
    use-input
    hide-selected
    fill-input
    map-options
    emit-value
    input-debounce="0"
    :label="`${props.item.required ? '*' : ''} ${$t(`website_settings_reg.${props.item.column_name}`)}`"
    :disable="!props.item.edit"
    :rules="props.item.required ? [Rules.required()] : [Rules.noRule]"
  />
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, reactive } from "vue"
  import { INPUT_TYPE } from "src/utils/constants"
  import { useRule } from "src/hook/useRule"
  import type * as Response from "src/api/response.type"
  import { useQueryStore } from "@/stores/queryStore"

  interface IDropdownItem<T> {
    label: string
    value: string | number
  }
  let dropdownData = reactive({
    memberLevelList: [] as IDropdownItem<number>[]
  })
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
    set: (value: number) => {
      emit("update:modelValue", value)
    }
  })

  const Rules = useRule()

  const store = useQueryStore()

  onMounted(async () => {
    await store.getMemberLevel()
    store.memberLevel.forEach((level) => {
      dropdownData.memberLevelList.push({
        label: level.label,
        value: level.value
      })
    })
  })
</script>

<style scoped lang="scss"></style>
