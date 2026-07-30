<template>
  <!-- ID -->
  <p v-if="dropdownData.list.length">
    {{ $t("table_header.id_type") }}
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
  import { KYC_IDTYPE } from "@/utils/constants"
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
      value: string
    }[]
  }>({
    list: []
  })
  const { stringEnumToArray } = useCommon()

  onMounted(() => {
    stringEnumToArray(KYC_IDTYPE.Enums).forEach((item) => {
      dropdownData.list.push({
        label: KYC_IDTYPE.I18nKeys[item as keyof typeof KYC_IDTYPE.I18nKeys],
        value: item as string
      })
    })
  })
</script>
