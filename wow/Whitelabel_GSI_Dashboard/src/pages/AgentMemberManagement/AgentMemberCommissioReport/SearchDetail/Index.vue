<template>
  <SubPage :action-label-i18n-key="route.params.id" />
  <div class="q-pa-md">
    <q-card class="q-pa-md editLevelWrapper">
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
            <q-td key="commission_name" :props="props">
              {{ props.row.commission_name }}
            </q-td>
            <q-td key="next_level_member_count" :props="props">
              {{ props.row.next_level_member_count }}
            </q-td>
            <q-td key="limit" :props="props">
              {{ props.row.limit }}
            </q-td>
            <q-td key="currency" :props="props">
              {{ props.row.currency }}
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

        <!-- 本頁總計/搜尋結果總計 -->
        <template #bottom-row="props">
          <table-total-comp :columns="props.cols" :table-data="tableData" :total-data="tableTotal" />
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import SubPage from "layouts/SubPage/Index.vue"
  import { onMounted, computed } from "vue"
  import { CustomQTableProps } from "quasar"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { GetAgentMemberCommissionReportSearchDetail } from "@/api/agentMemberManagements"
  import tableTotalComp from "@/components/tableTotal/Index.vue"

  const { t } = useI18n()
  const route = useRoute()
  let { search, tableData, tableTotal } = useSearch(GetAgentMemberCommissionReportSearchDetail)
  onMounted(() => {
    const { account, currency_id } = route.params
    const { start, end } = route.query
    let payload = {
      account,
      currency_id,
      start,
      end
    }
    Promise.all([search(payload)])
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "commission_name",
      label: t("table_header.member_account"),
      field: "commission_name",
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
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
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
</style>
