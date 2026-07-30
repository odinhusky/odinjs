<template>
  <div class="q-pa-md" v-if="level0Detail">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
        <q-table
          v-if="showTable"
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableDatas"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
        >
          <template #body="props">
            <q-tr v-if="tableDatas.length">
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
              <q-td key="rebate_ratio" :props="props" v-if="props.row.rebate_ratio !== undefined">
                {{ props.row.rebate_ratio }}
              </q-td>
              <q-td v-for="(item, index) in currencyTable" :key="index" class="text-center"> {{ item.limit }}% </q-td>
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
  <div class="q-pa-md" v-else>
    <SubPage :action-label-i18n-key="subMessage" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
        <q-table
          v-if="showTable"
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="subTableDatas"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
        >
          <template #body="props">
            <q-tr v-if="subTableDatas.length">
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
              <q-td v-for="(item, index) in props.row.currencyTable" :key="index" class="text-center">
                {{ item.limit }}%
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
    const { commission_name } = route.query
    if (!isNaN(Number(route.params.commission_id))) {
      return `${commission_name}`
    } else {
      return commission.value
    }
  })
  const store = useQueryStore()
  const commission = ref("")
  let detailApi
  let id = route.params.commission_id as string

  if (!isNaN(Number(route.params.commission_id))) {
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
  const tableDatas = ref<levelDetail[]>([])

  const showTable = ref(false)
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

  onMounted(async () => {
    store.getCurrencyList()
    Promise.all([search(id)])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          //goBack()
        }
        //如果不是帳號搜尋
        if (!isNaN(Number(route.params.commission_id))) {
          tableDatas.value = tableData.value

          tableData.value[0].currency_limit.forEach((currency: any) => {
            // 查找對應的幣別資料
            const currencyData = store.currencyList.find((item) => item.value === currency.currency_id)

            if (currencyData) {
              originalColumns.value?.push({
                name: currencyData.label,
                label: CURRENCY_TYPE.Enums[currency.currency_id as CURRENCY_TYPE.Enums],
                field: currencyData.label,
                sortable: false,
                align: "center"
              })
              currencyTable.value.push({
                currency_id: currency.currency_id,
                limit: currency.limit
              })
            }
          })
        } else {
          //帳號搜尋
          tableDatas.value.push(tableData.value.member_info)
          commission.value = tableData.value.name
          id = tableData.value.commission_id

          //帳號搜尋有反傭比例
          //暫時 待後端
          tableDatas.value = tableDatas.value.map((data) => ({
            ...data,
            rebate_ratio: 0
          }))
          tableColumn.value?.push({
            name: "rebate_ratio",
            label: t("table_header.rebate_ratio"),
            field: "rebate_ratio",
            sortable: false,
            align: "center"
          })

          tableData.value.currency_limit.forEach((currency: any) => {
            const currencyData = store.currencyList.find((item) => item.value === currency.currency_id)
            if (currencyData) {
              tableColumn.value?.push({
                name: currencyData.label,
                label: CURRENCY_TYPE.Enums[currency.currency_id as CURRENCY_TYPE.Enums],
                field: currencyData.label,
                sortable: false,
                align: "center"
              })
              currencyTable.value.push({
                currency_id: currency.currency_id,
                limit: currency.limit
              })
            }
          })
        }

        showTable.value = true
      })
      .catch((e: any) => {
        console.log(e)
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  interface subDetail {
    member_id: number
    account: string
    next_level_count: number
    amounts: { currency_id: number; limit: number }[]
  }

  const subMessage = computed(() => {
    const { commission_name } = route.query
    return `${commission_name} / ${accountPath.value}`
  })
  const accountPath = ref("")

  const subTableDatas = ref<subDetail[]>([])
  async function onAction(row: any) {
    const res = await getAgentMemberCommissionSettingListSubordinateDetail({
      commission_id: parseInt(id),
      account: row.account
    })

    subTableDatas.value.length = 0
    if (res.code === 0) {
      subTableDatas.value = res.data.list
      accountPath.value += `${row.account} / `
      currencyTable.value.length = 0
      originalColumns.value = originalColumns.value.slice(0, 2)

      if (subTableDatas.value?.[0]?.amounts != null) {
        subTableDatas.value[0].amounts.forEach((currency: any) => {
          // 查找對應的幣別資料
          const currencyData = store.currencyList.find((item) => item.value === currency.currency_id)
          if (currencyData) {
            tableColumn.value?.push({
              name: currencyData.label,
              label: CURRENCY_TYPE.Enums[currency.currency_id as CURRENCY_TYPE.Enums],
              field: currencyData.label,
              sortable: false,
              align: "center"
            })
            currencyTable.value.push({
              currency_id: currency.currency_id,
              limit: currency.limit
            })
          }
        })
      }

      level0Detail.value = false
    }
  }

  function onBackTo() {
    router.push({
      name: "AgentMemberCommissionSettingList"
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
</style>
