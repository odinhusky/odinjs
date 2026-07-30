<template>
  <!-- 状态冻结/非冻结 -->
  <p v-if="dropdownData.list.length">
    {{ t("table_header.quota_type") }}
  </p>
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
  import { AGENT_QUOTA_ADJUST_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    /** 栏位名称 (必须与 v-model 栏位名称一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const { t } = useI18n()

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
    numberEnumToArray(AGENT_QUOTA_ADJUST_TYPE.Enums).forEach((item) => {
      dropdownData.list.push({
        label:
          AGENT_QUOTA_ADJUST_TYPE.I18nKeys[item as keyof typeof AGENT_QUOTA_ADJUST_TYPE.I18nKeys] || "common.unknow",
        value: item as number
      })
    })
  })
</script>
