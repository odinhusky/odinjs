<template>
  <!-- 會員層級 -->
  <p v-if="store.memberLevel.length">
    {{ t("query_params.exclude_member_level") }}
  </p>
  <querySelect
    v-if="store.memberLevel.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    outlined
    standout="bg-white text-black"
    :list="store.memberLevel"
    class="default-input"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { MEMBER_LEVEL } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"

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
    await store.getMemberLevel()
  })
</script>
