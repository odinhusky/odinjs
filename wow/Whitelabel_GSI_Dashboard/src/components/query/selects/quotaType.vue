<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.quota_type") }}
  </p>
  <!-- 額度調整類型 -->
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
  import { QUOTA_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSiteStore } from "@/stores/siteStore"
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()

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
  const siteStore = useSiteStore()

  onMounted(() => {
    numberEnumToArray(QUOTA_TYPE.Enums).forEach((item) => {
      console.log(item)
      if (siteStore.isCredit || (item !== QUOTA_TYPE.Enums.AutoDeposit && item !== QUOTA_TYPE.Enums.AutoWithdraw)) {
        dropdownData.list.push({
          label: QUOTA_TYPE.I18nKeys[item as keyof typeof QUOTA_TYPE.I18nKeys] || "common.unknow",
          value: item as number
        })
      }
    })
  })
</script>
