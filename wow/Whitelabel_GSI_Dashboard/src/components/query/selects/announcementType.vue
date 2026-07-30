<template>
  <!-- 產品類型 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.type") }}
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
  import { ANNOUNCEMENT_MEMBER_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })
  const store = useQueryStore()

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

  onMounted(async () => {
    await store.getMemberAnnounceType()
    store.MemberAnnounceType.forEach((item) => {
      dropdownData.list.push({
        label:
          ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[item.value as keyof typeof ANNOUNCEMENT_MEMBER_TYPE.I18nKeys] ||
          "common.unknow",
        value: item.value as number
      })
    })
  })
</script>
