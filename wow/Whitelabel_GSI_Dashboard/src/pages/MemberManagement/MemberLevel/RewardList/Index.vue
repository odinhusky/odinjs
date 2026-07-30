<template>
  <div class="q-px-md" v-if="!isDetail">
    <component :is="listComp" @change-id="changeId" />
  </div>
  <div class="q-px-md" v-else>
    <component :is="detailsComp" @change-id="changeId" :id="selector.id" />
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useRouter } from "vue-router"

  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { useCommon } from "@/hook/useCommon"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import Pagination, {
    IPaginationResults,
    IPaginationSettings,
    allowPerPageList
  } from "@/components/query/pagination.vue"
  import { getMemberLevelRewardList, getMemberLevelRewardDetails } from "@/api/member"
  import type { GetMemberLevelRewardDetails } from "@/api/request.type"
  import type { MemberLevelRewardDetailsItem } from "@/api/response.type"

  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat } = useCommon()

  const selector = reactive({
    id: 0
  })

  const isDetail = computed(() => selector.id > 0)

  const listComp = defineAsyncComponent(() => import("./List.vue"))
  const detailsComp = defineAsyncComponent(() => import("./Detail.vue"))

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    everyColumnsClass: "col-12 col-sm-6 col-md-6 col-lg-2",
    useDatePicker: true,
    customDateTimeLabelI18nKey: "common.reward_range"
  })

  const { search, tableData, totalSize } = useSearch(getMemberLevelRewardList)

  let cacheQuery = {}
  async function onSubmit(queryForm: GetMemberLevelRewardDetails) {
    selector.id = 0
    cacheQuery = queryForm
    await search({ ...queryForm })
  }

  async function changeId(id?: number) {
    if (id !== 0) {
    }
    selector.id = id
  }

  /**
   * 詳細頁面
   */
  const {
    search: detailSearch,
    tableData: detailTableData,
    totalSize: detailTotalSize
  } = useSearch(getMemberLevelRewardDetails)

  async function onDetailsPagination(result: IPaginationResults) {
    pagination.details.page = result.page
    pagination.details.perPage = result.perPage

    const location = {
      query: Object.assign({}, null, {
        ...cacheQuery,
        page: pagination.details.page,
        perPage: pagination.details.perPage,
        id: selector.id
      })
    }

    router.push(location).then(async () => {
      await detailSearch({
        ...selector,
        ...cacheQuery,
        page: pagination.details.page,
        perPage: pagination.details.perPage
      })
      pagination.details.total = detailTotalSize.value
    })
  }

  const { dialog } = useDialog()
  const onAction = (row: MemberLevelRewardDetailsItem) => {
    console.log(row)
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.isDetail) {
    .custom-hide {
      display: none;
    }
  }
</style>
