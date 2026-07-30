<!--<template>
   產品類型
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
    :label="$t('query_params.product')"
    :list="dropdownData.list"
    :useI18n="false"
  />
</template>-->
<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.product") }}
  </p>
  <!-- 會員標籤 -->
  <q-select
    v-if="dropdownData.list.length"
    v-model="model"
    outlined
    standout="bg-white text-black"
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
  import { useQueryStore } from "@/stores/queryStore"
  import { getProductDropdown, getProductGameType } from "@/api/product"
  import { GAME_TYPE } from "@/utils/constants"
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    },
    gameProductCode: {
      type: String,
      required: false,
      default: 0
    }
  })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  watchEffect(() => {
    if (typeof model.value === "string") {
      model.value = parseInt(model.value)
    }
  })

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
    productData: {
      label: string
      value: number
      gameTypeId?: GAME_TYPE.Enums
    }[]
  }>({
    list: [],
    productData: []
  })

  type DropdownType = {
    label: string
    value: number
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
    const { data } = await getProductDropdown()
    if (!data || !data.length) {
      dropdownData.list.length = 0
      return
    }
    dropdownData.productData = data.map((e) => {
      const label = e.product_name || `${e.product_code}`
      const value = e.product_code
      const gameTypeId = e.game_type_id
      return {
        label,
        value,
        gameTypeId
      }
    })
    generateDropdown(dropdownData.productData)
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
