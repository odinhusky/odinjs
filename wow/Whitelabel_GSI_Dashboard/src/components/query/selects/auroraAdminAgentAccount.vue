<template>
  <!-- 總代理帳號 -->
  <p v-if="dropdownData.list.length">
    {{ t("table_header.agent_ID") }}
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
  import { useCommon } from "@/hook/useCommon"
  import { getAuroraAgentList } from "@/api/agencyManagement"
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
    const { data } = await getAuroraAgentList({
      auroraAdminAgentAccount: "",
      offset: 0,
      size: 100000
    })

    // 之後改成撈api取得幣別清單
    data.list.forEach((item) => {
      if (item.agent_code) {
        dropdownData.list.push({
          label: item.agent_code,
          value: item.agent_code
        })
      }
    })
  })
</script>
