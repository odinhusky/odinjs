<template>
  <!-- 金流類型 -->
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
    :label="$t('edit_form.fund_method')"
    :list="dropdownData.list"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive } from "vue"
  import querySelect from "@/components/query/selects/base.vue"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const dropdownData = reactive({
    list: [
      { label: "fund_method_type.third_party_payment", value: 2 },
      { label: "fund_method_type.crypto_wallet_third", value: 7 },
      { label: "fund_method_type.external_channel_transfer", value: 6 },

    ]
  })
</script>
