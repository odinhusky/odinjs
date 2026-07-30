<template>
  <p v-if="ReceiveDateTypeList.length">
    {{ t("receive_status.receive_status") }}
  </p>
  <!-- 幣別 -->
  <querySelect
    v-if="ReceiveDateTypeList.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="ReceiveDateTypeList"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import querySelect from "@/components/query/selects/base.vue"
  import * as CONSTANTS from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"

  const { t } = useI18n()
  const { numberEnumToArray } = useCommon()
  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  interface IDropdownItem<T> {
    label: string
    value: T
  }
  const store = useQueryStore()

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<string | number | undefined>()

  //日期類型-(建立時間/派發時間/領取時間/逾期時間)
  const ReceiveDateTypeList = computed(() => {
    const list: IDropdownItem<CONSTANTS.RECEIVE_DATE_TYPE.Enums>[] = []
    numberEnumToArray(CONSTANTS.RECEIVE_DATE_TYPE.Enums).forEach((item) => {
      list.push({
        label:
          CONSTANTS.RECEIVE_DATE_TYPE.I18nKeys[item as keyof typeof CONSTANTS.RECEIVE_DATE_TYPE.I18nKeys] ||
          "common.unknow",
        value: item as number
      })
    })
    return list
  })

  onMounted(async () => {
    await store.getCurrencyList()
  })
</script>
