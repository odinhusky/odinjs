<template>
  <SubPage action-label-i18n-key="common.detail" />
  <div class="q-pa-md">
    <q-card class="q-pa-md editLevelWrapper">
      <q-card-section>
        <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onAction">
          {{ $t("btn.distribute_all") }}
        </q-btn>
        <span> {{ $t("common.distribute_detail") }}</span>
      </q-card-section>
      <q-table
        square
        hide-pagination
        :rows="tableData"
        :columns="tableColumn"
        row-key="order_number"
        table-header-class="bg-success"
      >
        <template #body="props">
          <q-tr>
            <q-td key="member_account" :props="props">
              {{ props.row.member_account }}
            </q-td>
            <q-td key="currency" :props="props">
              {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency] || "common.unknow") }}
            </q-td>
            <q-td key="commission_flow_type" :props="props">
              {{ t(ANNOUNCEMENT_TYPE.I18nKeys[props.row.commission_flow_type] || "common.unknow") }}
            </q-td>
            <q-td key="block_tags_num" :props="props">
              {{ props.row.block_tags_num }}
            </q-td>
            <q-td key="status" :props="props">
              {{ $t(DISTRIBUTION_STATUS[props.row.status] || "common.unknow") }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn color="main-color" class="btnCancel q-mr-md" @click="onAction">
                {{ $t("btn.force_send") }}
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-card-actions class="row q-gutter-md item-center justify-center">
        <q-btn style="min-width: 12rem" outline :label="$t('btn.cancel')" color="primary" @click="onCancel" />
        <q-btn
          style="min-width: 12rem"
          :label="$t('btn.check')"
          color="primary"
          :loading="loading"
          class="q-ml-md"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import SubPage from "layouts/SubPage/Index.vue"
  import { ref, onMounted, computed } from "vue"
  import { QTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { getAgentMemberCommissionReviewDetail } from "@/api/agentMemberManagements"
  import type { GetAgentMemberCommissionReviewDetail } from "@/api/response.type"
  import { CURRENCY_TYPE, ANNOUNCEMENT_TYPE, DISTRIBUTION_STATUS } from "@/utils/constants"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  let { search, tableData } = useSearch(getAgentMemberCommissionReviewDetail)

  const loading = ref(false)
  onMounted(() => {
    const id = route.params.id as string
    Promise.all([search({ id: parseInt(id) })])
  })

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
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
      name: "commission_flow_type",
      label: t("common.commission_flow_type"),
      field: "commission_flow_type",
      sortable: false,
      align: "center"
    },
    {
      name: "block_tags_num",
      label: t("table_header.block_tags_num"),
      field: "block_tags_num",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.status"),
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
  function onAction(row: GetAgentMemberCommissionReviewDetail) {
    console.log("onAction")
  }
  function onCancel() {
    router.push({ name: "AgentMemberCommissionReviewList" })
  }
  function onSubmit() {
    isLoading.value = true
    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })

    setTimeout(() => {
      router.push({ name: "AgentMemberCommissionReviewList" })
      isLoading.value = false
    }, 500)
  }
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
