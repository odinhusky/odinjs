<template>
  <p v-if="dropdownData.list.length">
    {{ t("table_header.prize_distribution_type") }}
  </p>
  <!-- 錢包類型 -->
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
  defineOptions({ inheritAttrs: false })
  import { useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { PRIZE_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
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
    numberEnumToArray(PRIZE_TYPE.Enums).forEach((item) => {
      dropdownData.list.push({
        label: PRIZE_TYPE.I18nKeys[item as keyof typeof PRIZE_TYPE.I18nKeys] || "common.unknow",
        value: item as number
      })
    })
  })
</script>
