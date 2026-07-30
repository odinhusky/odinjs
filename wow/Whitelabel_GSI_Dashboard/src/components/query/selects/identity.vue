<template>
  <!-- 身份 -->
  <p>
    {{ t("table_header.identity") }}
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
    :list="identityList"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, computed } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
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

  // 身份選項列表
  const identityList = computed(() => [
    {
      label: t("common.member"),
      value: 0
    },
    {
      label: t("common.agent"),
      value: 1
    }
  ])
</script>
