<template>
  <!-- 產品類型 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.product_type") }}
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
    class="default-input"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { GAME_TYPE } from "@/utils/constants"
  import { getProductGameType } from "@/api/product"
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

  onMounted(async () => {
    const { data } = await getProductGameType({ only_actived: true })
    if (!data || !data.length) {
      dropdownData.list.length = 0
      return
    }
    dropdownData.list = data.map((e) => {
      const label = GAME_TYPE.I18nKeys[e.id as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow"
      const value = e.game_type
      return {
        label,
        value
      }
    })
  })
</script>
