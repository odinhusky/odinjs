<template>
  <!-- 集成名稱 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.gsc_name") }}
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
  import { GAME_TYPE } from "@/utils/constants"
  import { getProductGameType } from "@/api/product"
  import { useQueryStore } from "src/stores/queryStore"
  import { useSiteStore } from "src/stores/siteStore"
  import { useI18n } from "vue-i18n"

  const siteStore = useSiteStore()

  const queryStore = useQueryStore()
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

  onMounted(async () => {
    await queryStore.getIntegration()
    if (!queryStore.integration.length) {
      dropdownData.list.length = 0
      return
    }

    dropdownData.list = queryStore.integration.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })
</script>
