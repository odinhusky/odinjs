<template>
  <!-- 權限等級 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.permission_level") }}
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
  import { getAdminAccountPermission } from "@/api/common"
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
      value: number
    }[]
  }>({
    list: []
  })

  const {} = useCommon()
  onMounted(async () => {
    const sendData = { name: "", offset: 0, size: 100 }
    const { data } = await getAdminAccountPermission(sendData)
    if (!data || !Object.keys(data).length) {
      dropdownData.list.length = 0
      return
    }
    data.list.forEach((item: { name: string; id: number }) => {
      dropdownData.list.push({
        label: item.name,
        value: item.id
      })
    })
  })
</script>
