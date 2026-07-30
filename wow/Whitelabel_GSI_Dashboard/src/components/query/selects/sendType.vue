<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.distribution_type") }}
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
  import { useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { SEND_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()

  defineProps({
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
    numberEnumToArray(SEND_TYPE.Enums).forEach((item) => {
      dropdownData.list.push({
        label: SEND_TYPE.I18nKeys[item as keyof typeof SEND_TYPE.I18nKeys] || "common.unknow",
        value: item as number
      })
    })
  })
</script>
