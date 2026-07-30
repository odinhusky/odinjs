<template>
  <!-- kyc狀態 -->
  <p v-if="dropdownData.list.length">
    {{ $t("query_params.state") }}
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
  import { PROCESS_STATUS } from "@/utils/constants"
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
    numberEnumToArray(PROCESS_STATUS.Enums).forEach((item) => {
      if (
        item === PROCESS_STATUS.Enums.PROCESS_STATUS_PENDING ||
        item === PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING ||
        item === PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED ||
        item === PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED
      ) {
        dropdownData.list.push({
          label: PROCESS_STATUS.kycI18nKeys[item as keyof typeof PROCESS_STATUS.kycI18nKeys] || "common.unknow",
          value: item as number
        })
      }
    })
  })
</script>
