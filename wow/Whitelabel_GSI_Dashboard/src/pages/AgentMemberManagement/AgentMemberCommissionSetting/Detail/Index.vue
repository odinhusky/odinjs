<template>
  <div class="q-pa-md" v-if="showTable">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableDatas"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #header="props">
              <q-tr :props="props">
                <q-th rowspan="1">{{ $t("table_header.account") }}</q-th>
                <q-th rowspan="1">{{ $t("table_header.number_of_subordinate_members") }}</q-th>
                <q-th colspan="1" v-for="(item, index) in store.currencyList" :key="index">
                  {{ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums] }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr>
                <q-td key="account" :props="props">
                  <span
                    v-if="props.row.next_level_count > 0"
                    class="text-blue cursor-pointer"
                    @click="onAction(props.row)"
                    >{{ props.row.account }}</span
                  >
                  <span v-else>{{ props.row.account }}</span>
                </q-td>
                <q-td key="next_level_count" :props="props">
                  {{ props.row.next_level_count }}
                </q-td>
                <template v-for="(item, index) in props.row.currency_limit" :key="index">
                  <q-td class="text-center"> {{ item.limit }}% </q-td>
                </template>
              </q-tr>
            </template>
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
  import { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"

  import {
    getAgentMemberCommissionSettingListDetail,
    getAgentMemberCommissionSettingListDetailAccount,
    getAgentMemberCommissionSettingListSubordinateDetail
  } from "@/api/agentMemberManagements"

  import type { GetCommissionSettingList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"

  import { CURRENCY_TYPE } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    usePagination: false
  })
  const level0Detail = ref(true)
  const message = computed(() => {
    return commission.value
  })
  const store = useQueryStore()
  const commission = ref("")
  const showTable = ref(false)

  let detailApi
  const commission_id = route.params.commission_id
  let account_commission_id = ""
  if (!isNaN(Number(commission_id))) {
    detailApi = getAgentMemberCommissionSettingListDetail
  } else {
    detailApi = getAgentMemberCommissionSettingListDetailAccount
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(detailApi)
  interface levelDetail {
    member_id: number
    account: string
    next_level_count: number
    currency_limit: { currency_id: number; limit: number }[]
  }

  const currencyTable = ref<{ currency_id: string | number; limit: number }[]>([])
  let originalColumns = ref([
    {
      name: "account",
      label: t("table_header.account"),
      field: "account",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_count",
      label: t("table_header.number_of_subordinate_members"),
      field: "next_level_count",
      sortable: false,
      align: "center"
    }
  ])
  let tableColumn = computed(() => originalColumns.value)
  const { start, end } = route.query
  const tableDatas = ref<levelDetail[]>([])

  onMounted(async () => {
    await store.getCurrencyList()
    Promise.all([search(commission_id)]).then(() => {
      if (tableData.value.length <= 0) {
        showTable.value = true
        return
      }

      if (!isNaN(Number(commission_id))) {
        tableDatas.value = tableData.value
      } else {
        //帳號搜尋回傳格式不同
        tableDatas.value.push(tableData.value)
        tableDatas.value[0].member_id = tableData.value.member_info.member_id
        tableDatas.value[0].account = tableData.value.member_info.account
        tableDatas.value[0].next_level_count = tableData.value.member_info.next_level_count
        account_commission_id = tableData.value.commission_id
      }
      tableDatas.value.forEach((data: any) => {
        const limitMap = Object.fromEntries(
          data.currency_limit.map((item: { currency_id: number; limit: number }) => [
            item.currency_id,
            { limit: item.limit }
          ])
        )

        const result = store.currencyList.map((item: { value: number }) => ({
          currency_id: item.value,
          limit: limitMap[item.value]?.limit || 0
        }))

        data.currency_limit = result
      })

      if (!isNaN(Number(route.params.commission_id))) {
        commission.value = route.query.commission_name as string
      } else {
        commission.value = tableDatas.value[0].name
      }

      showTable.value = true
    })
  })

  function onAction(row: any) {
    let cid = ""
    if (!isNaN(Number(commission_id))) {
      cid = commission_id
    } else {
      cid = account_commission_id
    }

    router.push({
      name: "AgentMemberCommissionSettingNestedDetail",
      params: {
        commission_id: cid,
        account: row.account
      },
      query: {
        commission_name: commission.value,
        start,
        end
      }
    })
  }

  function onBackTo() {
    router.push({
      name: "AgentMemberCommissionSettingList",
      query: {
        start,
        end
      }
    })
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
  ::v-deep(.q-table__sort-icon) {
    opacity: 1;
  }
  ::v-deep(.custom-hide) {
    display: none;
  }
  ::v-deep(.q-table--horizontal-separator thead th) {
    border-bottom-width: 1px !important;
    border-color: white;
  }
</style>
