<template>
  <p>
    {{ $t("table_header.task_name") }}
  </p>
  <!-- 語音助理 -->
  <querySelect
    ref="selectRef"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    outlined
    standout="bg-white"
    :list="[
      {
        label: 'templatetest01',
        value: 'templatetest01'
      },
      {
        label: 'templatetest02',
        value: 'templatetest02'
      },
      {
        label: 'templatetest03',
        value: 'templatetest03'
      }
    ]"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, ref } from "vue"
  import querySelect from "@/components/query/selects/base.vue"

  const selectRef = ref()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string>()

  defineExpose({
    validate: () => selectRef.value?.validate(),
    hasError: selectRef.value?.hasError
  })
</script>
