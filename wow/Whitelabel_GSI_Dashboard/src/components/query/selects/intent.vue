<template>
  <p v-if="dropdownData.list.length">
    {{ $t("query_params.intent") }}
  </p>
  <!-- 帳號狀態凍結/非凍結 -->
  <querySelect
    v-if="dropdownData.list.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="dropdownData.list"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { INTENT } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"

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

  const model = defineModel<string | number | undefined>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  const { numberEnumToArray } = useCommon()

  onMounted(() => {
    numberEnumToArray(INTENT.Enums).forEach((item) => {
      dropdownData.list.push({
        label: INTENT.I18nKeys[item as keyof typeof INTENT.I18nKeys] || "common.unknow",
        value: item as number
      })
    })
  })
</script>
