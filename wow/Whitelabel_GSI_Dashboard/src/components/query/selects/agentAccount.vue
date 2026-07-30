<template>
  <!-- 代理帳號 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.agent") }}
  </p>
  <querySelect
    v-if="dropdownData.list.length"
    v-bind="attrs"
    :hide-bottom-space="true"
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
  import { useCommon } from "@/hook/useCommon"
  import { getGeneralAgentList } from "@/api/common"
  import { useI18n } from "vue-i18n"

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

  const { t } = useI18n()

  const dropdownData = reactive<{
    list: {
      label: string
      value: string
    }[]
  }>({
    list: []
  })

  const {} = useCommon()

  onMounted(async () => {
    const { data } = await getGeneralAgentList()

    // 之後改成撈api取得幣別清單
    data.list.forEach((item) => {
      dropdownData.list.push({
        label: item.user_account ? `${item.user_account} (${item.agent_code})` : item.agent_code,
        value: item.id
      })
    })
  })
</script>
