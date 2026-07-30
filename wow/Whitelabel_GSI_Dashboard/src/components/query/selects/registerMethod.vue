<template>
  <!-- 三方登入 -->
  <p>
    {{ t("query_params.third_party_login") }}
  </p>
  <querySelect
    v-bind="attrs"
    :hide-bottom-space="true"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="registerMethodList"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, computed } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useI18n } from "vue-i18n"
  import { REGISTER_METHOD } from "@/utils/constants"

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

  const model = defineModel<number | undefined>()

  const { t } = useI18n()

  // 三方登入選項列表
  const registerMethodList = computed(() => [
    {
      label: "Telegram",
      value: REGISTER_METHOD.Enums.Telegram
    },
    {
      label: "Google",
      value: REGISTER_METHOD.Enums.Google
    }
  ])
</script>
