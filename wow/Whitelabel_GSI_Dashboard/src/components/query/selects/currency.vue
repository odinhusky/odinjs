<template>
  <!-- 幣別 -->
  <p v-if="store.currencyList.length && !hideLabel">
    {{ t("query_params.currency") }}
  </p>
  <querySelect
    v-if="store.currencyList.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    outlined
    hide-label
    standout="bg-white text-black"
    :list="store.currencyList"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"
  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    /** 是否隱藏標籤 */
    hideLabel: {
      type: Boolean,
      default: false
    }
  })
  const store = useQueryStore()

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const { t } = useI18n()

  onMounted(async () => {
    await store.getCurrencyList()
  })
</script>
