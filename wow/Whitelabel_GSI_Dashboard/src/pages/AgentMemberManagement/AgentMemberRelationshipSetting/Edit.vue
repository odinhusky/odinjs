<template>
  <div class="q-pa-md">
    <div class="agen-member-table">
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="formData.member_list"
        :columns="tableSeniorColumn"
        row-key="id"
        table-header-class="bg-success"
        class="no-hover no-box-shadow"
      >
        <template #body="props">
          <q-tr>
            <!--帳號-->
            <q-td key="account" :props="props">{{ props.row.account }} </q-td>
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
    <!--
      <q-card-actions class="row q-gutter-md item-center justify-center">
        <q-btn style="min-width: 12rem" outline :label="$t('btn.cancel')" color="primary" @click="onCancel" />
        <q-btn style="min-width: 12rem" :label="$t('btn.check')" color="primary" class="q-ml-md" @click="onSubmit" />
      </q-card-actions>-->
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useQuasar, QTableProps } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { getAgentRelationshipSettingDetail } from "@/api/agentMemberManagements"
  import type { GetAgentRelationshipChainSettingDetail } from "@/api/response.type"

  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()

  const form = reactive<GetAgentRelationshipChainSettingDetail>([
    {
      id: 1,
      member_list: []
    }
  ])

  const [formData] = form
  const { search, spinShow, isSuccess, tableData } = useSearch(getAgentRelationshipSettingDetail)
  function goBack() {
    router.back()
  }
  onMounted(() => {
    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
        let data = tableData.value[0]
        formData.member_list = data.member_list
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })
  const tableSeniorColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "account",
      label: t("table_header.account"),
      field: "account",
      sortable: false,
      align: "left"
    },
    {
      name: "senior_member",
      label: t("table_header.senior_member"),
      field: "senior_member",
      sortable: false,
      align: "left"
    }
  ])
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
