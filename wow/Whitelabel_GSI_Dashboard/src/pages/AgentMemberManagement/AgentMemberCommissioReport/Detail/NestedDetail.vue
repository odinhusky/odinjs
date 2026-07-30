<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="message" :custom-back-func="onBackTo" class="q-mb-md" />
    <query :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <q-td key="parent_account" :props="props">
                  <span
                    v-if="props.row.next_level_member_count > 0"
                    class="text-blue cursor-pointer"
                    @click="onAction(props.row)"
                  >
                    {{ props.row.member_account }}
                  </span>
                  <span v-else>
                    {{ props.row.member_account }}
                  </span>
                </q-td>
                <q-td key="next_level_member_count" :props="props">
                  {{ props.row.next_level_member_count }}
                </q-td>
                <q-td key="limit" :props="props">
                  {{ props.row.limit }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) || "" }}
                </q-td>
                <q-td key="next_level_total_bet" :props="props">
                  {{ props.row.next_level_total_bet }}
                </q-td>
                <q-td key="next_level_total_valid_bet" :props="props">
                  {{ props.row.next_level_total_valid_bet }}
                </q-td>
                <q-td key="next_level_total_profit" :props="props">
                  {{ props.row.next_level_total_profit }}
                </q-td>
                <q-td key="total_member_count" :props="props">
                  {{ props.row.total_member_count }}
                </q-td>
                <q-td key="total_bet" :props="props">
                  {{ props.row.total_bet }}
                </q-td>
                <q-td key="total_valid_bet" :props="props">
                  {{ props.row.total_valid_bet }}
                </q-td>
                <q-td key="total_profit" :props="props">
                  {{ props.row.total_profit }}
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
  import SubPage from "layouts/SubPage/Index.vue"
  import { onMounted, computed, reactive, ref, watch } from "vue"
  import type { CustomQTableProps } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { GetAgentCommissionReportsMembers } from "@/api/agentMemberManagements"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import type { GetAgentMemberCommissionReport } from "@/api/request.type"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    usePagination: false
  })

  let { search, tableData, tableTotal, isSuccess } = useSearch(GetAgentCommissionReportsMembers)
  onMounted(() => {
    submit()
  })
  const commission = ref("")
  const message = computed(() => {
    return commission.value
  })

  function onAction(row: GetAgentMemberCommissionReport) {
    const { commission_id, date } = route.params
    const { commission_name, account } = route.query
    const { start, end, currency } = route.query
    router.push({
      name: "AgentMemberCommissioReportNestedDetail",
      params: {
        commission_id: commission_id,
        member_id: row.member_id
        //grand_parent_account: row.parent_account,
      },
      query: {
        commission_name: commission_name,
        account: row.parent_account,
        member_id: row.member_id,
        currency,
        start,
        end
      }
    })
    //submit()
    //location.reload()
  }
  function submit() {
    const { commission_id, grand_parent_account } = route.params
    const { start, end, member_id, currency } = route.query
    let payload = {
      commission_id: commission_id,
      member_id: member_id,
      currency_id: currency,
      start_date: start,
      end_date: end
    }
    Promise.all([search(payload)]).then(() => {
      commission.value = (commission.value as string) || (route.query.commission_name as string)

      /*if (!commission.value.includes(grand_parent_account as string)) {
        commission.value += " / " + grand_parent_account
      }*/

      //showTable.value = true
    })
  }

  function onBackTo() {
    const { grand_parent_account } = route.params
    commission.value = commission.value.replace(new RegExp(` / ${grand_parent_account}$`), "").trim()
    router.back()
  }
  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "parent_account",
      label: t("table_header.member_account"),
      field: "parent_account",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_member_count",
      label: t("table_header.number_of_members_lower_level"),
      field: "next_level_member_count",
      sortable: false,
      align: "center"
    },
    {
      name: "limit",
      label: t("table_header.rebate_ratio"),
      field: "limit",
      sortable: false,
      align: "center"
    },
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_bet",
      label: t("table_header.bet_amount_lower_level"),
      field: "next_level_total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_valid_bet",
      label: t("table_header.valid_bets_lower_level"),
      field: "next_level_total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "next_level_total_profit",
      label: t("table_header.profit_and_loss_lower_level"),
      field: "next_level_total_profit",
      sortable: false,
      align: "center"
    },
    {
      name: "total_member_count",
      label: t("table_header.number_of_members_all"),
      field: "total_member_count",
      sortable: false,
      align: "center"
    },
    {
      name: "total_bet",
      label: t("table_header.bet_amount_all"),
      field: "total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_valid_bet",
      label: t("table_header.valid_bets_all"),
      field: "total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_profit",
      label: t("table_header.profit_and_loss_all"),
      field: "total_profit",
      sortable: false,
      align: "center"
    }
  ])
  /*watch(
    () => route.params.grand_parent_account,
    (newAccount, oldAccount) => {
      console.log("newAccount=" + newAccount)
      console.log("oldAccount=" + oldAccount)

      if (newAccount !== oldAccount && route.name === "AgentMemberCommissioReportNestedDetail") {
        console.log("xxx")
        submit()
      }
    }
  )*/
  watch(
    () => route.query,
    (newAccount, oldAccount) => {
      submit()
    }
  )
</script>

<style lang="scss" scoped>
  ::v-deep(.q-tab) {
    width: 8%;
    flex: 0 0 auto;
  }

  .q-tab-panel {
    padding: 0 0 0 0;
  }

  :deep(.editLevelWrapper) {
    .label {
      line-height: 2.25rem;
    }

    .languageTabsWrapper {
      max-width: 30rem;

      .languageTab {
        flex: 0.5 1 auto;

        .languageTabItem {
          min-width: 1rem;
        }
      }
    }

    .avatarWrapper {
      flex: auto;

      .avatarImg {
        border-radius: 0.3125rem;
        font-size: 1.6875rem;
        width: 3.25rem;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1/1;
      }

      .avatarTips {
        font-size: 0.75rem;
      }
    }
  }
  .q-align-center {
    align-items: center;
  }

  .q-radio-w {
    /*width: 45%;*/
  }
  .radio-group {
    display: flex;
    flex-direction: column;
  }

  .radio-group > div {
    display: flex;
    margin-bottom: 0.8em;
  }

  .d-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .direction {
    flex-direction: row !important;
    align-items: center !important;
  }

  .d-center {
    display: flex;
    justify-content: flex-start;
  }
  .audit-multiple-container {
    width: 50%;
    border: 1px solid #999;
    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
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
