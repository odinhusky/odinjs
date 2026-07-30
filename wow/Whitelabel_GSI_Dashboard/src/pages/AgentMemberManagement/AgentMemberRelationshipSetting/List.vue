<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="agen-member-table">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableSeniorData"
            :columns="tableSeniorColumn"
            row-key="id"
            table-header-class="bg-success"
            class="no-hover no-box-shadow"
          >
            <template #body="props">
              <q-tr>
                <q-td key="senior_member" :props="props">
                  <div class="search-tool" style="justify-content: left">
                    <q-select
                      v-model="props.row.senior_member"
                      :options="['Eric', 'Jack', 'Blues', 'Raiden']"
                      map-options
                      dense
                      outlined
                      style="width: 60%"
                    />
                    <q-btn :label="$t('btn.save')" color="green" class="btn q-ml-md" />
                    <q-btn outline :label="$t('btn.cancel')" color="primary" class="btn q-ml-md" />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="agen-member-table q-mt-lg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success "
            class="no-hover no-box-shadow"
          >
            <template #body="props">
              <q-tr>
                <!--等級-->
                <q-td key="member_level" :props="props"> Lv {{ props.row.member_level }} </q-td>

                <!--數量-->
                <q-td key="member_count" :props="props">
                  {{ props.row.member_count }}
                </q-td>

                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="report" color="secondary" @click="onAction(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.details") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useRouter } from "vue-router"

  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"

  import { getAgentRelationshipSetting } from "@/api/agentMemberManagements"
  import type { GetAgentRelationshipSetting } from "@/api/request.type"
  import Pagination, {
    IPaginationResults,
    IPaginationSettings,
    allowPerPageList
  } from "@/components/query/pagination.vue"
  const { t } = useI18n()

  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: false,
    useMemberAccount: true
  })
  const tableSeniorData = reactive([
    {
      senior_member: "Eric"
    }
  ])
  let { search, tableData, totalSize } = useSearch(getAgentRelationshipSetting)

  // 分頁資料
  const pagination = reactive<{
    list: IPaginationSettings
  }>({
    list: {
      page: 1,
      perPage: 10,
      total: 0,
      onPagination: onListPagination
    }
  })
  let cacheQuery = {}

  async function onListPagination(result: IPaginationResults) {
    pagination.list.page = result.page
    pagination.list.perPage = result.perPage

    const location = {
      query: Object.assign({}, null, {
        ...cacheQuery,
        page: pagination.list.page,
        perPage: pagination.list.perPage
      })
    }

    router.push(location).then(async () => {
      await search({
        ...cacheQuery,
        page: pagination.list.page,
        perPage: pagination.list.perPage
      })
      pagination.list.total = totalSize.value
    })
  }
  async function onSubmit(queryForm: GetAgentRelationshipSetting) {
    cacheQuery = queryForm
    await search({ ...queryForm, ...pagination.list })
    pagination.list.total = totalSize.value
  }
  const tableSeniorColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "senior_member",
      label: t("table_header.senior_member"),
      field: "senior_member",
      sortable: false,
      align: "left"
    }
  ])

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_level",
      label: t("table_header.rebate_level"),
      field: "member_level",
      sortable: false,
      align: "left"
    },
    {
      name: "member_count",
      label: t("table_header.number_of_members"),
      field: "member_count",
      sortable: false,
      align: "left"
    },

    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "left"
    }
  ])

  function onAction(row: GetAgentRelationshipSetting) {
    router.push({
      name: "AgentMemberRelationshipSettingEdit",
      params: {
        id: row.id
      }
    })
  }
</script>
<style lang="scss" scoped>
  .agen-member-table {
    width: 500px;
    .search-tool {
      display: flex;
      align-items: center;
    }
    .btn {
      height: 36px;
      width: 80px;
    }
    .no-hover .q-td:hover,
    .no-hover .q-tr:hover {
      background-color: transparent !important;
      color: inherit !important;
    }
    .q-item-center {
      align-items: center;
    }
    .no-box-shadow {
      box-shadow: none;
    }
    ::v-deep(.q-table) {
      border: none !important;
    }
    .q-table__container .q-table tbody tr:nth-child(even) {
      background-color: initial !important;
    }

    ::v-deep(.q-table th) {
      padding: 0 0 0 10px !important;
      border-top: white 1px solid;
    }
    ::v-deep(.q-table td) {
      border-bottom: #dbe0f2 1px solid;
      border-top: #dbe0f2 1px solid;
      text-align: left;
    }
  }
</style>
