<template>
  <!-- 帳號狀態凍結/非凍結 -->
  <p v-if="dropdownData.list.length">
    {{ t("table_header.game") }}
  </p>
  <querySelect
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="dropdownData.list"
    :loading="loading"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, watch, ref } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    /** 遊戲列表 */
    gameList: {
      type: Array as () => Array<{ game_code: string; game_name: string }>,
      required: false,
      default: () => []
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

  const loading = ref(false)

  const loadGames = () => {
    loading.value = true
    dropdownData.list.length = 0 // 清空现有数据
    if (props.gameList && props.gameList.length > 0) {
      props.gameList.forEach((item: { game_code: string; game_name: string }) => {
        dropdownData.list.push({
          label: item.game_name,
          value: item.game_code
        })
      })
    }
    loading.value = false
  }

  onMounted(() => {
    loadGames()
  })

  // 监听 gameList 变化
  watch(
    () => props.gameList,
    () => {
      loadGames()
    },
    { deep: true }
  )
</script>
