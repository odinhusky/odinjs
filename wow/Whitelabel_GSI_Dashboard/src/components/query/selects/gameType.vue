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
    await queryStore.getGameTypeList()
    if (!queryStore.gameTypeList.length) {
      dropdownData.list.length = 0
      return
    }
    // const { data } = await getProductGameType({ only_actived: true })
    // if (!data || !data.length) {
    //   dropdownData.list.length = 0
    //   return
    // }
    const agent_code = siteStore.agent_code.toLocaleLowerCase()

    dropdownData.list = queryStore.gameTypeList.map((e) => {
      let label = GAME_TYPE.I18nKeys[e.value as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow"

      if (agent_code === "anip") {
        if (e.value === GAME_TYPE.Enums.SLOT) {
          label = "common.ecasino"
        } else if (e.value === GAME_TYPE.Enums.SPORTBOOK) {
          label = "common.sports_betting"
        }
      }
      const value = e.value as number
      return {
        label,
        value
      }
    })
  })
</script>
