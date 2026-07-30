<template>
  <div class="q-pa-md">
    <query :configs="queryConfigs" @query-update="onSubmit" :class="{ isDetail: isDetail }">
      <template #mainContent>
        <template v-if="!isDetail">
          <div class="table-white-bg">
            <q-table
              square
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="tableData"
              :columns="tableColumn"
              row-key="id"
            >
              <template #body="props">
                <q-tr>
                  <!-- 異動日期 -->
                  <q-td key="modify_date" :props="props">
                    {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
                  </q-td>

                  <!-- 操作人 -->
                  <q-td key="creater_title" :props="props">
                    {{ props.row.creater_title === "" ? "-" : props.row.creater_title }}
                  </q-td>
                  <!-- 異動後等級 -->
                  <q-td key="new_level" :props="props">{{ props.row.new_level }} </q-td>
                  <!-- 異動後層級 -->
                  <q-td key="new_level_lang" :props="props"> {{ getDynamicLangValue(props.row.new_level_lang) }} </q-td>

                  <!-- 異動方式 -->
                  <!-- <q-td key="modify_type" :props="props">
                  {{
                    $t(
                      MEMBER_LEVEL_MODIFY_TYPE.I18nKeys[props.row.type as MEMBER_LEVEL_MODIFY_TYPE.Enums] ||
                        "common.unknow"
                    )
                  }}
                </q-td>-->

                  <!-- 生日 -->
                  <q-td key="modify_reason" :props="props">
                    {{ props.row.reason }}
                  </q-td>

                  <!-- 異動明細 -->
                  <q-td key="actions" :props="props">
                    <q-btn flat fab-mini icon="visibility" class="edit_pen" @click="onAction(props.row.id)">
                      <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.modify_detail") }}</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>

              <!-- 查無資料 -->
              <template #no-data>
                <div class="full-width row flex-center q-gutter-sm column no_data">
                  <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                  <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
                </div>
              </template>
            </q-table>
          </div>
        </template>

        <template v-else>
          <!-- 詳細資訊 -->
          <!-- <component :is="detailsComp" :table-data="detailTableData" @change-id="changeId" />
          <Pagination v-bind="pagination.details" />-->
          <SubPage
            :action-label-i18n-key="'btn.modify_detail'"
            back-label-i18n-key="menu.member_level_history"
            class="q-pt-xs"
            :custom-back-func="onBack"
          />
          <div class="table-white-bg">
            <q-table
              square
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="tableDataDetail"
              :columns="tableColumnDetail"
              row-key="id"
              class="q-mt-md"
            >
              <template #body="props">
                <q-tr>
                  <!-- 會員帳號 -->
                  <q-td key="username" :props="props">
                    {{ props.row.username }}
                  </q-td>

                  <!-- 推薦人 -->
                  <q-td key="ref_member" :props="props">
                    {{ props.row.ref_member === "" ? "-" : props.row.ref_member }}
                  </q-td>

                  <!-- 會員層級 -->
                  <q-td key="old_level" :props="props"> {{ props.row.old_level }} </q-td>

                  <!-- 異動後層級 -->
                  <q-td key="old_level_lang" :props="props">
                    {{ getDynamicLangValue(props.row.old_level_lang) }}
                  </q-td>

                  <!-- 會員層級 -->
                  <q-td key="new_level" :props="props"> LV{{ props.row.new_level }} </q-td>

                  <!-- 異動後層級 -->
                  <q-td key="new_level_lang" :props="props">
                    {{ getDynamicLangValue(props.row.new_level_lang) }}
                  </q-td>

                  <!-- 生日 -->
                  <q-td key="date_of_birth" :props="props">
                    {{ props.row.date_of_birth === "" ? "-" : props.row.date_of_birth }}
                  </q-td>

                  <!-- 會員標籤 -->
                  <q-td key="label_count" :props="props">
                    {{ props.row.label_count }}
                  </q-td>
                </q-tr>
              </template>

              <!-- 查無資料 -->
              <template #no-data>
                <div class="full-width row flex-center q-gutter-sm column no_data">
                  <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                  <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
                </div>
              </template>
            </q-table>
          </div>
        </template>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, defineAsyncComponent, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import query, { IQueryConfig } from "@/components/query/common.vue"

  import { MEMBER_LEVEL_MODIFY_TYPE } from "@/utils/constants"
  import { getMemberLevelHistory, getMemberLevelHistoryDetails } from "@/api/member"
  import type { GetMemberLevelHistory } from "@/api/request.type"
  import type { GetMemberLevelHistoryDetails } from "@/api/response.type"
  import { useQueryStore } from "@/stores/queryStore"
  import { useLanguageStore } from "src/stores/languageStore"

  const isDetail = ref(false)

  /*
  const listComp = defineAsyncComponent(() => import("./ListTable.vue"))
  const detailsComp = defineAsyncComponent(() => import("./DetailsTable.vue"))
  */
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat } = useCommon()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    filterShowOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useMemberLevelAfterChange: true,
    useDatePicker: true,
    everyColumnsClass: "col-12 col-sm-6 col-md-6 col-lg-2",
    customDateTimeLabelI18nKey: "common.modify_date"
  })

  const { search, tableData, totalSize } = useSearch(getMemberLevelHistory)

  let catchQueryForm: GetMemberLevelHistory

  async function onSubmit(queryForm: GetMemberLevelHistory) {
    catchQueryForm = queryForm

    await search({
      ...queryForm
    })
    isDetail.value = false
  }

  const queryStore = useQueryStore()

  onMounted(async () => {
    await queryStore.getMemberLevel()
  })

  const languageStore = useLanguageStore()
  function getDynamicLangValue(data: any) {
    if (data === null || data === "") {
      return ""
    }
    const currentLang = languageStore.currentLanguage

    const langValue = data[currentLang.toLowerCase()]

    return langValue || Object.values(data)[0]
  }

  function getLevel(memberLevel: number) {
    for (const item of queryStore.memberLevel) {
      if (item.value === memberLevel) {
        return item.label
      }
    }
    return ""
  }
  const tableDataDetail = reactive<GetMemberLevelHistoryDetails[]>([])
  async function onAction(id: number) {
    tableDataDetail.length = 0
    const res = await getMemberLevelHistoryDetails(id)
    if (res.code === 0) {
      tableDataDetail.push(...res.data.list)

      isDetail.value = true
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  /*
  // 分頁資料
  const pagination = reactive<{
    details: IPaginationSettings
  }>({
    details: {
      page: 1,
      perPage: 10,
      total: 0,
      offset: 1,
      onPagination: onDetailsPagination
    }
  })
  async function changeId(id?: number) {
    // 帶有id時，搜尋詳細資訊
    selector.id = id
    pagination.details.page = 1
    await onDetailsPagination({
      ...cacheQuery,
      page: pagination.details.page,
      perPage: pagination.details.perPage
    })
  }
*/
  /**
   * 詳細頁面
   */
  /* const {
    search: detailSearch,
    tableData: detailTableData,
    totalSize: detailTotalSize
  } = useSearch(getMemberLevelHistoryDetails)

  async function onDetailsPagination(result: IPaginationResults) {
    pagination.details.page = result.page
    pagination.details.perPage = result.perPage

    const location = {
      query: Object.assign({}, null, {
        ...cacheQuery,
        page: pagination.details.page,
        perPage: pagination.details.perPage
      })
    }

    router.push(location).then(async () => {
      await detailSearch({
        ...cacheQuery,
        page: pagination.details.page,
        perPage: pagination.details.perPage
      })
      pagination.details.total = detailTotalSize.value
    })
  }*/
  const onBack = () => {
    isDetail.value = false
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "modify_date",
      label: t("table_header.modify_date"),
      field: "modify_date",
      sortable: false,
      align: "center"
    },
    {
      name: "creater_title",
      label: t("table_header.operator"),
      field: "creater_title",
      sortable: false,
      align: "center"
    },
    {
      name: "new_level",
      label: t("table_header.level_after_change"),
      field: "new_level",
      sortable: false,
      align: "center"
    },
    {
      name: "new_level_lang",
      label: t("table_header.post_change_level"),
      field: "new_level_lang",
      sortable: false,
      align: "center"
    },

    /* {
      name: "modify_type",
      label: t("table_header.modify_type"),
      field: "modify_type",
      sortable: false,
      align: "center"
    },*/
    {
      name: "modify_reason",
      label: t("table_header.modify_reason"),
      field: "modify_reason",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  const tableColumnDetail = computed<QTableProps["columns"]>(() => [
    {
      name: "username",
      label: t("table_header.member_account"),
      field: "username",
      sortable: false,
      align: "center"
    },
    {
      name: "ref_member",
      label: t("table_header.recommender"),
      field: "ref_member",
      sortable: false,
      align: "center"
    },
    {
      name: "old_level",
      label: t("table_header.level_before_change"),
      field: "old_level",
      sortable: false,
      align: "center"
    },
    {
      name: "old_level_lang",
      label: t("table_header.Hierarchy_before_change"),
      field: "old_level_lang",
      sortable: false,
      align: "center"
    },
    {
      name: "new_level",
      label: t("table_header.level_after_change"),
      field: "new_level",
      sortable: false,
      align: "center"
    },
    {
      name: "new_level_lang",
      label: t("table_header.post_change_level"),
      field: "new_level_lang",
      sortable: false,
      align: "center"
    },
    {
      name: "date_of_birth",
      label: t("table_header.birthday"),
      field: "date_of_birth",
      sortable: false,
      align: "center"
    },
    {
      name: "label_count",
      label: t("table_header.member_tag"),
      field: "label_count",
      sortable: false,
      align: "center"
    }
  ])
</script>

<style lang="scss" scoped>
  ::v-deep(.isDetail) {
    .custom-hide {
      display: none;
    }
  }
</style>
