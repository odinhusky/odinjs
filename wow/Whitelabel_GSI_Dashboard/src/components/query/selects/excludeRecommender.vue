<template>
  <div class="exclude-recommender">
    <p>{{ t("query_params.exclude_recommender") }} ({{ selectedValues.length }}/20)</p>
    <ElSelect
      v-model="selectedValues"
      multiple
      filterable
      remote
      show-arrow
      remote-show-suffix
      reserve-keyword
      :placeholder="''"
      :remote-method="remoteMethod"
      @change="handleChange"
      @visible-change="handleVisibleChange"
      class="w-full"
    >
      <ElOption v-for="item in options" :key="item.id" :label="item.account" :value="item.id" />
    </ElSelect>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { getMemberQuotaMemberSearch } from "@/api/member"
  import type { MemberSearch } from "@/api/member"
  import { Notify } from "quasar"
  import { ElSelect, ElOption } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"

  const { t } = useI18n()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: String,
      required: true
    }
  })

  const model = defineModel<number[] | undefined>()
  const selectedValues = ref<number[]>([])
  const options = ref<MemberSearch[]>([])

  const remoteMethod = async (query: string) => {
    try {
      const sendData = {
        type: 1,
        account: query === "" ? "%" : query + "%",
        offset: 0,
        size: 100
      }
      const { data } = await getMemberQuotaMemberSearch(sendData)
      if (data && data.list) {
        options.value = data.list
      } else {
        options.value = []
      }
    } catch (error) {
      console.error("Failed to search recommenders:", error)
      options.value = []
    }
  }

  const handleChange = (val: number[]) => {
    if (val && val.length > 20) {
      val.pop()
      Notify.create({
        type: "negative",
        message: t("error_msg.max_20_accounts"),
        position: "top",
        timeout: 2000
      })
    }
    selectedValues.value = val || []
    model.value = [...selectedValues.value]
  }

  const handleVisibleChange = (visible: boolean) => {
    if (visible && options.value.length === 0) {
      remoteMethod("")
    }
  }
</script>

<style scoped lang="scss">
  .exclude-recommender {
    :deep(.el-select) {
      .el-select__wrapper {
        min-height: 40px;
        border-radius: 4px;
      }
    }
  }
</style>
