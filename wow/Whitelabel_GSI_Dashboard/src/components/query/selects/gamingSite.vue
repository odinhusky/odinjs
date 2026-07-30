<template>
  <p v-if="dropdownData.list.length">
    {{ t("table_header.game_site") }}
  </p>
  <!-- 帳變類型 -->
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
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"

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
  const store = useQueryStore()

  onMounted(async () => {
    await store.getGameSiteDropdown()

    store.gameSiteDropdown.forEach((item) => {
      dropdownData.list.push({
        label: `member_customize_column.${item.label}`,
        value: item.value as number
      })
    })
  })
</script>
