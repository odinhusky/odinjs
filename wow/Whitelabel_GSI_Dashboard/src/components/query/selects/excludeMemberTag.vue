<template>
  <!-- 會員標籤 -->
  <p v-if="dropdownData.list.length">
    {{ t("query_params.exclude_member_tags") }}
  </p>
  <q-select
    v-if="dropdownData.list.length"
    :hide-bottom-space="true"
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
    multiple
    popup-content-class="membet-tag-select"
    class="default-input"
  >
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" v-if="opt.value !== -1">
        <q-checkbox
          :model-value="selected"
          :label="t(opt.label)"
          color="primary"
          @update:model-value="toggleOption(opt)"
        />
      </q-item>
      <q-item v-bind="itemProps" v-else class="q-pt-md">
        {{ t(opt.label) }}
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { MEMBER_TAG_TYPE } from "@/utils/constants"
  import { useQueryStore } from "@/stores/queryStore"
  import type * as Response from "@/api/response.type"

  /*function toggleSelection(option) {
    console.log(model.value)
    console.log(option)
  }*/

  const { t } = useI18n()
  const queryStore = useQueryStore()
  const route = useRoute()
  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  const attrs = useAttrs()

  const model = defineModel<string[] | number[] | undefined>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

  const {} = useCommon()

  function generateDropdown(data: Response.MemberTags[]) {
    let currentType: MEMBER_TAG_TYPE.Enums | null = null
    const list = data.sort((a, b) => a.type - b.type)
    list.forEach((item) => {
      let label = item.name
      let value = item.id
      if (currentType === null) {
        dropdownData.list.push({
          label: MEMBER_TAG_TYPE.I18nKeys[MEMBER_TAG_TYPE.Enums.Deposit],
          value: -1
        })
        currentType = item.type
      }
      if (currentType !== item.type) {
        dropdownData.list.push({
          label: MEMBER_TAG_TYPE.I18nKeys[item.type],
          value: -1
        })
        currentType = item.type
      }
      dropdownData.list.push({ label, value })
    })
  }

  onMounted(async () => {
    await queryStore.getMemberTag()
    generateDropdown(queryStore.memberTags)

    // 從 route.query 賦值
    const columnName = props.name
    if (columnName && !!route.query[columnName]) {
      const selectValue = Array.isArray(route.query[columnName])
        ? (route.query[columnName] as string[]).map(Number) // 如果是數組，轉換為數字數組
        : [Number(route.query[columnName])]

      if (dropdownData.list && selectValue.every((val) => dropdownData.list.some((item) => item.value == val))) {
        model.value = selectValue // 直接赋值为数组
      }
      return
    }
  })
</script>

<style lang="scss">
  .membet-tag-select {
    .q-virtual-scroll__content {
      .q-item:not(.disabled) {
        text-indent: 1.5rem;
      }
      .q-item.disabled {
        .q-item__label {
          font-size: 0.7rem;
        }
      }
    }
  }
</style>
