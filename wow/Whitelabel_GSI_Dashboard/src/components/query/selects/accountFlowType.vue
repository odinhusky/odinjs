<template>
  <p v-if="dropdownData.list.length">
    {{ t("query_params.account_flow_type") }}
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
    multiple
    class="account-flow-type-select"
  />
</template>

<script lang="ts" setup>
  import { useAttrs, reactive, onMounted, watch, nextTick } from "vue"
  import { useRoute } from "vue-router"
  import * as CONSTANTS from "@/utils/constants"
  import querySelect from "@/components/query/selects/base.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"

  const { t, locale } = useI18n()
  const route = useRoute()
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

  const model = defineModel<number[]>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })
  const store = useQueryStore()

  // 將更新下拉選單的邏輯抽出成函數
  const updateDropdownList = () => {
    dropdownData.list = []
    store.accountFlowType.forEach((item) => {
      dropdownData.list.push({
        label: t((CONSTANTS.ACCOUNT_FLOW_TYPE.I18nKeys as any)[Number(item.value)] || "common.unknow"),
        value: Number(item.value)
      })
    })
  }

  // 監聽 locale 變化
  watch(locale, () => {
    updateDropdownList()
  })

  // 監聽 model 變化，如果傳入的是單一數字，轉換為數組
  watch(
    () => model.value,
    (newValue) => {
      // 如果值不是數組，轉換為數組
      if (newValue !== undefined && newValue !== null && !Array.isArray(newValue)) {
        model.value = [Number(newValue)]
      }
    },
    { immediate: true }
  )

  // 從 route.query 或父組件初始化值的函數
  const initValue = () => {
    // 優先使用父組件傳來的值（queryForm.accountFlowType）
    if (model.value && Array.isArray(model.value) && model.value.length > 0) {
      // 如果下拉選單已經載入，驗證值是否有效
      if (dropdownData.list.length > 0) {
        const validValues = model.value.filter((val) => dropdownData.list.some((item) => item.value == val))
        if (validValues.length !== model.value.length) {
          // 如果有無效值，更新為有效值
          model.value = validValues
        }
      }
      return
    }

    // 如果 model 沒有值，從 route.query 讀取
    const columnName = props.name
    if (columnName && !!route.query[columnName]) {
      const selectValue = Array.isArray(route.query[columnName])
        ? (route.query[columnName] as string[]).map(Number) // 如果是數組，轉換為數字數組
        : [Number(route.query[columnName])]

      // 檢查值是否在下拉選單中存在，如果存在則賦值
      if (
        dropdownData.list.length > 0 &&
        selectValue.every((val) => dropdownData.list.some((item) => item.value == val))
      ) {
        model.value = selectValue // 直接賦值為數組
      } else if (dropdownData.list.length === 0) {
        // 如果下拉選單還沒載入完成，先設置值（會在 updateDropdownList 後再檢查）
        model.value = selectValue
      }
    }
  }

  onMounted(async () => {
    await store.getAccountFlowType()
    updateDropdownList()
    // 延遲初始化，確保父組件的 v-model 值已經設置
    await nextTick()
    initValue()
  })

  // 監聽路由變化，當路由參數改變時更新值
  watch(
    () => route.query[props.name],
    () => {
      if (dropdownData.list.length > 0) {
        initValue()
      }
    }
  )

  // 監聽下拉選單列表變化，當列表載入完成後再次初始化
  watch(
    () => dropdownData.list.length,
    (newLength, oldLength) => {
      // 當列表從空變為有值時，重新初始化
      if (newLength > 0 && oldLength === 0) {
        initValue()
      }
    }
  )

  // 監聽 model 的變化，當父組件設置值時，確保值正確
  watch(
    () => model.value,
    (newValue) => {
      // 如果值不是數組，轉換為數組（防止 base.vue 設置單個值）
      if (newValue !== undefined && newValue !== null && !Array.isArray(newValue)) {
        model.value = [Number(newValue)]
        return
      }
      // 如果值是數組且下拉選單已載入，驗證值是否有效
      if (newValue && Array.isArray(newValue) && newValue.length > 0 && dropdownData.list.length > 0) {
        const validValues = newValue.filter((val) => dropdownData.list.some((item) => item.value == val))
        if (validValues.length !== newValue.length) {
          // 如果有無效值，過濾掉
          model.value = validValues
        }
      }
    },
    { immediate: true, deep: true }
  )
</script>

<style lang="scss" scoped>
  .account-flow-type-select {
    min-width: 250px;
    width: 100%;

    :deep(.q-field__control) {
      min-height: 40px;
    }

    :deep(.q-field__native) {
      min-height: 40px;
      padding: 4px 0;
    }

    // 多選時，確保選中的標籤有足夠空間
    :deep(.q-chip) {
      margin: 2px 4px 2px 0;
      max-width: 100%;
    }

    // 確保輸入框區域有足夠空間顯示多個選項
    :deep(.q-field__input) {
      min-height: 32px;
    }
  }
</style>
