<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <!--有效日期-->
              <q-td key="valid_time_start" :props="props">
                {{ genTimeFormat(props.row.valid_time_start, "yyyy-MM-dd HH:mm") }}~{{
                  genTimeFormat(props.row.valid_time_end, "yyyy-MM-dd HH:mm")
                }}
              </q-td>
              <!--傭金名稱-->
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <!--結算週期-->
              <q-td key="settle_cycle" :props="props">
                {{ props.row.settle_cycle }}
              </q-td>
              <!--權限等級-->
              <q-td key="currency" :props="props">
                {{ props.row.currency ? $t(CURRENCY_TYPE.I18nKeys[props.row.currency] || "common.unknow") : "" }}
              </q-td>
              <q-td key="reward_count" :props="props">
                {{ props.row.reward_count }}
              </q-td>
              <q-td key="block_reward_count" :props="props">
                {{ props.row.block_reward_count }}
              </q-td>

              <q-td key="reward_type" :props="props">
                {{ $t(REWARD_TYPE.I18nKeys[props.row.reward_type] || "common.unknow") }}
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
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"
  import { REWARD_TYPE, CURRENCY_TYPE } from "@/utils/constants"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { getAgentMemberCommissionReview } from "@/api/agentMemberManagements"
  import type { GetAgentMemberCommissionSetting } from "@/api/request.type"

  const { t } = useI18n()

  const $q = useQuasar()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useCommissionName: true,
    useCurrency: true,
    useRewardType: true,
    useDatePicker: true
  })

  let { search, tableData, totalSize } = useSearch(getAgentMemberCommissionReview)

  async function onSubmit(queryForm: GetAgentMemberCommissionSetting) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "valid_time_start",
      label: t("table_header.valid_time"),
      field: "valid_time_start",
      sortable: false,
      align: "center"
    },
    {
      name: "name",
      label: t("table_header.name"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "settle_cycle",
      label: t("table_header.settle_cycle"),
      field: "settle_cycle",
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
      name: "reward_count",
      label: t("table_header.reward_count"),
      field: "reward_count",
      sortable: false,
      align: "center"
    },
    {
      name: "block_reward_count",
      label: t("table_header.block_reward_count"),
      field: "block_reward_count",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_type",
      label: t("table_header.reward_type"),
      field: "reward_type",
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
  function onAction(row: GetAgentMemberCommissionSetting) {
    router.push({
      name: "AgentMemberCommissionReviewDetail",
      params: {
        id: row.id
      }
    })
  }
</script>
