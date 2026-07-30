<template>
  <!-- 推薦輪盤 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.issue") }}
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
  import { getReferralWheelList } from "@/api/referralWheel"
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

  const { genTimeFormat } = useCommon()

  onMounted(async () => {
    const { data } = await getReferralWheelList()

    // 整理為選單內容
    data.forEach((item) => {
      dropdownData.list.push({
        label: `${genTimeFormat(item.start_time)} ~ ${genTimeFormat(item.end_time)}`,
        value: item.referral_wheel_id
      })
    })
  })
</script>
