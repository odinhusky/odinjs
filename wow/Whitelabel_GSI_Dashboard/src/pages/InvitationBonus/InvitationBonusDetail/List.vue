<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="period_start_at" :props="props">
                  {{ genTimeFormat(props.row.period_start_at, "yyyy-MM-dd") }} ~
                  {{ genTimeFormat(props.row.period_end_at, "yyyy-MM-dd") }}
                </q-td>

                <q-td key="payout_count" :props="props">
                  {{ props.row.payout_count }}
                </q-td>
                <q-td key="blocked_count" :props="props">
                  {{ props.row.blocked_count }}
                </q-td>
                <q-td key="payout_method" :props="props">
                  {{ $t(REWARD_TYPE.I18nKeys[props.row.payout_method as REWARD_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="status" :props="props">
                  {{ $t(PROCESS_STATUS.I18nKeys[props.row.status as PROCESS_STATUS.Enums] || "common.unknow") }}
                </q-td>
                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="main-color" class="q-mr-xs" @click="onAction(props.row)">
                    <q-icon name="visibility" />
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
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { REWARD_TYPE, PROCESS_STATUS } from "@/utils/constants"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getInvitationBounsEventList } from "@/api/invitationBouns"
  import type { GetInvitationBonusEventList } from "@/api/request.type"

  const { t, locale } = useI18n()
  const { genTimeFormat, parseDate } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true,
    useRewardType: true
  })
  let { search, tableData, totalSize } = useSearch(getInvitationBounsEventList)

  let catchQueryForm: GetInvitationBonusEventList

  async function onSubmit(queryForm: any) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "period_start_at",
      label: t("query_params.event_time"),
      field: "period_start_at",
      sortable: false,
      align: "center"
    },

    {
      name: "payout_count",
      label: t("table_header.reward_count"),
      field: "payout_count",
      sortable: false,
      align: "center"
    },
    {
      name: "blocked_count",
      label: t("table_header.block_reward_count"),
      field: "blocked_count",
      sortable: false,
      align: "center"
    },
    {
      name: "payout_method",
      label: t("table_header.reward_type"),
      field: "payout_method",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.settlement_status"),
      field: "status",
      sortable: false,
      align: "center"
    },

    {
      name: "actions",
      label: t("table_header.actions"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])
  const $q = useQuasar()

  const route = useRoute()
  const router = useRouter()
  const onAction = (row: any) => {
    const { start, end } = route.query
    router.push({
      name: "InvitationBonusDetail",
      params: {
        campaign_id: row.campaign_id,
        event_id: row.event_id
      },
      query: {
        start,
        end
      }
    })
  }
</script>

<style lang="scss" scoped></style>
