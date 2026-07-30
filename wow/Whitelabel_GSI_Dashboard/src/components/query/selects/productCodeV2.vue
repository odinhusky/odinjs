<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.product") }}
  </p>
  <!-- 會員標籤 -->
  <q-select
    v-if="dropdownData.list.length"
    :hide-bottom-space="true"
    v-model="model"
    standout="bg-white text-black"
    outlined
    clearable
    emit-value
    :option-label="(item) => (item && item.label ? t(item.label) : item.value)"
    :options="dropdownData.list"
    :option-disable="(item) => item.value === -1"
    map-options
    options-dense
    popup-content-class="product-select"
    class="default-input"
  >
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" v-if="opt.value !== -1">
        <span>{{ t(opt.label) }}</span>
      </q-item>
      <q-item v-bind="itemProps" v-else class="q-pt-md">
        {{ t(opt.label) }}
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, watchEffect } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { GAME_TYPE } from "@/utils/constants"
  import { useI18n } from "vue-i18n"

  const queryStore = useQueryStore()

  const { t } = useI18n()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    integration: {
      type: [String, Number],
      required: false,
      default: 0
    }
  })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  const dropdownData = reactive<{
    list: {
      label: string | number
      value: string | number
    }[]
    cloneList: {
      label: string | number
      value: string | number
    }[]
  }>({
    list: [],
    cloneList: []
  })
  watchEffect(() => {
    if (typeof model.value === "string") {
      model.value = parseInt(model.value)
    }
  })

  type DropdownType = {
    label: string | number
    value: string | number
    gameTypeId?: GAME_TYPE.Enums
  }
  function generateDropdown(data: DropdownType[]) {
    let currentType: GAME_TYPE.Enums | null = null
    const list = data.filter((item) => item.gameTypeId !== undefined).sort((a, b) => a.gameTypeId! - b.gameTypeId!)

    list.forEach((item) => {
      const { label, value, gameTypeId } = item

      if (currentType === null || currentType !== gameTypeId) {
        dropdownData.list.push({
          label: GAME_TYPE.I18nKeys[gameTypeId as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow",
          value: -1 // 分類項目，用 value: -1 做分隔
        })
        if (item.gameTypeId !== undefined) {
          currentType = item.gameTypeId
        }
      }

      dropdownData.list.push({ label, value })
    })
  }
  onMounted(async () => {
    await queryStore.getProductV2DropdownList()
    generateDropdown(queryStore.productDropdownV2)
  })
</script>

<style lang="scss">
  .product-select {
    .q-virtual-scroll__content {
      .q-item:not(.disabled) {
        text-indent: 1.5rem;
        line-height: 1.5625rem;
      }
      .q-item.disabled {
        .q-item__label {
          font-size: 0.7rem;
        }
      }
    }
  }
</style>
