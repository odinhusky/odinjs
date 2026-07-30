<template>
  <div class="q-pa-md" v-if="showTable">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />

    <query :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
          <q-table
            v-if="showTable"
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #header="props">
              <q-tr :props="props">
                <q-th rowspan="2">{{ $t("table_header.member_account") }}</q-th>
                <q-th rowspan="2">{{ $t("table_header.subordinate_members") }}</q-th>
                <q-th colspan="2" v-for="(item, index) in store.currencyList" :key="index">
                  {{ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums] }}
                </q-th>
              </q-tr>
              <q-tr>
                <template v-for="(currency, index) in store.currencyList" :key="index">
                  <q-th>{{ $t("table_header.ratio") }}</q-th>
                  <q-th>{{ $t("table_header.amount") }}</q-th>
                </template>
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
                <template v-for="(item, index) in props.row.amounts" :key="index">
                  <q-td class="text-center"> {{ item.limit }}% </q-td>
                  <q-td class="text-center">{{ item.amount }}</q-td>
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
  import SubPage from "layouts/SubPage/Index.vue"
  import { onMounted, ref, watch, computed, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { GetAgentMemberCommissionDetailNestedDetail } from "@/api/agentMemberManagements"
  import { useQueryStore } from "@/stores/queryStore"
  import { CURRENCY_TYPE } from "@/utils/constants"

  const store = useQueryStore()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    usePagination: false
  })
  interface levelDetail {
    member_id: number
    account: string
    next_level_count: number
    currency_limit: { currency_id: number; limit: number }[]
  }
  const showTable = ref(false)
  let { search, tableData, isSuccess } = useSearch(GetAgentMemberCommissionDetailNestedDetail)
  onMounted(async () => {
    await store.getCurrencyList()
    submit()
  })
  function onBackTo() {
    /* router.push({
      name: "AgentMemberCommissioDetailList",
      query: {
        start,
        end
      }
    })*/
    const { account } = route.params
    commission.value = commission.value.replace(new RegExp(` / ${account}$`), "").trim()
    router.back()
  }
  const message = computed(() => {
    return commission.value
  })
  const commission = ref("")
  const { start, end } = route.query

  function submit() {
    const { statement_id, account } = route.params
    let payload = {
      statement_id: statement_id,
      account: account
    }
    Promise.all([search(payload)]).then(() => {
      if (tableData.value.length <= 0) {
        showTable.value = true
        return
      }
      tableData.value.forEach((data: any) => {
        const limitMap = Object.fromEntries(
          data.amounts.map((item: { currency_id: number; limit: number; amount: number }) => [
            item.currency_id,
            { limit: item.limit, amount: item.amount }
          ])
        )

        // 构建结果数组，每个对象包含 currency_id、limit 和 amount
        const result = store.currencyList.map((item: { value: number }) => ({
          currency_id: item.value,
          limit: limitMap[item.value]?.limit || 0,
          amount: limitMap[item.value]?.amount || 0
        }))

        data.amounts = result
      })

      /*if (!isNaN(Number(route.params.commission_id))) {
          commission.value = route.query.commission_name as string
        } else {
          commission.value = tableData.value[0].name
        }*/
      commission.value = (commission.value as string) || (route.query.commission_name as string)

      if (!commission.value.includes(account as string)) {
        commission.value += " / " + account
      }
      showTable.value = true
    })
  }

  function onAction(row: any) {
    const { commission_name } = route.query
    const { statement_id } = route.params
    router.push({
      name: "AgentMemberCommissioDetailNestedDetail",
      params: {
        statement_id: statement_id,
        account: row.account
      },
      query: {
        commission_name: commission_name,
        start,
        end
      }
    })
  }
  watch(
    () => route.params.account,
    (newAccount, oldAccount) => {
      if (newAccount !== oldAccount && route.name === "AgentMemberCommissioDetailNestedDetail") {
        submit()
      }
    }
  )
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
