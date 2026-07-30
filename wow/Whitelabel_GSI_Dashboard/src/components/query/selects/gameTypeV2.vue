<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.product_type") }}
  </p>
  <!-- 產品類型V2 -->
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
  import { GAME_TYPE } from "@/utils/constants"
  import { getProductGameType } from "@/api/product"
  import { useQueryStore } from "src/stores/queryStore"
  import { useSiteStore } from "src/stores/siteStore"
  import { useI18n } from "vue-i18n"

  const siteStore = useSiteStore()

  const queryStore = useQueryStore()
  const { t } = useI18n()

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

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  onMounted(async () => {
    await queryStore.getGameTypeListV2()
    if (!queryStore.gameTypeListV2.length) {
      dropdownData.list.length = 0
      return
    }

    dropdownData.list = queryStore.gameTypeListV2.map((e) => {
      const label = GAME_TYPE.I18nKeys[e.value as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow"
      const value = e.value as number
      return {
        label,
        value
      }
    })
  })
</script>
