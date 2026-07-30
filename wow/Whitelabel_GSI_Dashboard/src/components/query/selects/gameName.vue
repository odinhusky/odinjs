<template>
  <!-- 產品類型 -->
  <p>
    {{ t("query_params.game_name") }}
  </p>
  <querySelect
    v-bind="attrs"
    v-model="model"
    :hide-bottom-space="true"
    :name="name"
    outlined
    standout="bg-white text-black"
    :list="dropdownData.list"
    multiple
    class="default-input"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, watchEffect } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"

  const queryStore = useQueryStore()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    gameCode: {
      type: Number,
      required: false,
      default: 0
    },
    isUseGameCode: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string[] | number[] | undefined>()

  const { t } = useI18n()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
      product_code: number
    }[]
  }>({
    list: []
  })

  watchEffect(() => {
    if (props.isUseGameCode) {
      if (props.gameCode) {
        dropdownData.list = queryStore.gameDropdown.filter((e) => e.product_code === props.gameCode)
      } else {
        dropdownData.list.length = 0
        model.value = undefined
      }
    }
  })

  watchEffect(() => {
    if (model.value && model.value.length > 0 && typeof model.value[0] === "string") {
      model.value = model.value.map((e) => parseInt(e as string))
    }
  })

  onMounted(async () => {
    await queryStore.getGameDropdownList()
  })
</script>
