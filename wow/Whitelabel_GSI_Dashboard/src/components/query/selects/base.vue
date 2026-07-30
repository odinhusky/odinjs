<template>
  <!-- 下拉選單基底元件 -->
  <q-select
    ref="selectRef"
    v-bind="attrs"
    v-model="model"
    :hide-bottom-space="true"
    clearable
    emit-value
    :option-label="
      (item) =>
        item && item.label ? (useI18n ? ($te(item.label) ? $t(item.label) : item.label) : item.label) : item.value
    "
    :options="list"
    map-options
    :multiple="multiple"
  />
</template>

<script lang="ts" setup>
  import type { PropType } from "vue"
  import { defineProps, defineModel, useAttrs, onMounted, watchEffect, ref } from "vue"
  import { useRoute } from "vue-router"

  const selectRef = ref()

  defineExpose({
    validate: () => selectRef.value?.validate(),
    hasError: selectRef.value?.hasError
  })

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    /**
     * 項目清單
     * {
     *  label: i18n key
     *  value: 選中的值
     * }[]
     */
    list: {
      type: Array as PropType<Array<{ label: string; value: number | string | boolean | object }>>,
      required: true,
      default: () => []
    },
    useI18n: {
      type: [Boolean],
      required: false,
      default: () => true
    },
    multiple: {
      type: [Boolean],
      required: false,
      default: () => false
    }
  })

  const attrs = useAttrs()

  let model = defineModel<(typeof props.list)[number]["value"] | string[] | number[] | object>()

  const route = useRoute()

  onMounted(() => {
    // 如果是多選模式，不處理（由父組件處理）
    if (props.multiple) {
      return
    }

    // 從 route.query 賦值（僅處理單選模式）
    const columnName = props.name
    if (columnName && !!route.query[columnName]) {
      let selectValue: string | number | undefined = undefined
      if (props.list && props.list.length > 0 && typeof props.list[0].value === "string") {
        selectValue = route.query[columnName] as string
      } else if (props.list && props.list.length > 0 && typeof props.list[0].value === "number") {
        selectValue = parseInt(route.query[columnName] as string)
      }

      if (props.list && props.list.length > 0 && props.list.find((item) => item.value === selectValue)) {
        model.value = selectValue
      }
      return
    }
  })
</script>
