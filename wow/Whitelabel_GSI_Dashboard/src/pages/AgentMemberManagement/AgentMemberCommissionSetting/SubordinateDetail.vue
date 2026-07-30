<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
      <template #mainContent>
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
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getAgentMemberCommissionSettingListSubordinateDetail } from "@/api/agentMemberManagements"
  import type { GetCommissionSettingList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: false
  })

  const message = computed(() => {
    const { commission_name } = route.query
    return `${commission_name} / ${route.params.account}`
  })
  const store = useQueryStore()

  const { search, spinShow, isSuccess, tableData } = useSearch(getAgentMemberCommissionSettingListSubordinateDetail)

  const id = route.params.commission_id as string
  const account = route.params.account as string

  const tableDatas = ref([])
  const showTable = ref(false)
  const path = ref("")

  const currencyTable = ref<{ currency_id: string | number; limit: number }[]>([])

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
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
  onMounted(async () => {
    store.getCurrencyList()

    Promise.all([search({ commission_id: parseInt(id), account: account })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          //goBack()
        }

        tableDatas.value = tableData.value
        if (tableData.value[0].amounts) {
          tableData.value[0].amounts.forEach((currency: any) => {
            // 查找對應的幣別資料
            const currencyData = store.currencyList.find((item) => item.value === currency.currency_id)
            if (currencyData) {
              tableColumn.value?.push({
                name: currencyData.label,
                label: currencyData.label,
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

        //path.value = tableData.value.path
        showTable.value = true
      })
      .catch((e: any) => {
        console.log(e)
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  function onAction(row: any) {
    const { commission_name } = route.query
    router.push({
      name: "AgentMemberCommissionSettingSubordinateDetail",
      params: {
        commission_id: id,
        account: row.account
      },
      query: {
        commission_name: commission_name
      }
    })
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
