<template>
  <p v-if="store.memberLevel.length">
    {{ t("query_params.member_level") }}
  </p>
  <!-- 會員層級 -->
  <querySelect
    v-if="store.memberLevel.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="store.memberLevel"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { MEMBER_LEVEL } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"
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

  const store = useQueryStore()

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
  onMounted(async () => {
    await store.getMemberLevel()
  })
</script>
