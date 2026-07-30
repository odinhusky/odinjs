<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn class="btns btn-blue" color="main-color" :to="{ name: 'CmsWebIntroductionAdd' }" v-if="permission.edit">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <div class="table-container">
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="cmsList"
        :columns="tableColumn"
        row-key="id"
        table-header-class="bg-success"
      >
        <template #body="props">
          <q-tr>
            <!-- 排序 -->
            <q-td key="sort" :props="props" width="100px">
              <q-number
                v-model="props.row.sort"
                :options="optionsSort"
                dense
                outlined
                class="sort-input"
                @blur="handleSortInput(props.row)"
                placeholder=""
                :disable="isLoading || !permission.edit"
              />
            </q-td>
            <!-- 標題 -->
            <q-td key="title" :props="props">
              {{ props.row.title }}
            </q-td>
            <!-- 指定連結 -->
            <q-td key="url_id" :props="props">
              {{ t(CMS_WEBINTRODUCTION_TYPE.I18nKeys[props.row.url_id as CMS_WEBINTRODUCTION_TYPE.Enums] || "") }}
            </q-td>
            <!-- 網頁連結 -->
            <q-td key="id" :props="props"> /webInformationCms/{{ props.row.id }} </q-td>
            <!-- 啟停用 -->
            <q-td key="enabled" :props="props">
              <q-toggle
                v-model="props.row.enabled"
                color="green"
                :false-value="false"
                :true-value="true"
                keep-color
                @click="updateStatus(props.row)"
                :disable="isLoading || !permission.edit"
              />
            </q-td>
            <!-- 功能 -->
            <q-td key="actions" :props="props">
              <q-btn flat fab-mini color="blue" :to="{ name: 'CmsWebIntroductionEdit', params: { id: props.row.id } }">
                {{ $t("btn.edit") }}
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
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import { useCms } from "src/composables/useCms"
  import { CMS_TYPE, CMS_WEBINTRODUCTION_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const { isLoading, optionsSort, cmsList, handleGetCmsList, handleCmsItemSort, handleCmsItemStatus } = useCms()
  const { permission } = usePermission()

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "sort",
        label: t("table_header.order"),
        field: "sort",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "url_id",
        label: t("cms.page_address"),
        field: "url_id",
        sortable: false,
        align: "center"
      },
      {
        name: "id",
        label: t("cms.page_url"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "enabled",
        label: t("table_header.enable_or_disable"),
        field: "enabled",
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
    ]

    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function handleSortInput(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemSort = {
      id: row.id,
      sort: Number(row.sort),
      title: row.title,
      type: CMS_TYPE.Enums.WEBSITE_INFORMATION
    }
    handleCmsItemSort(params)
  }

  function updateStatus(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemStatus = {
      id: row.id,
      enabled: row.enabled,
      type: CMS_TYPE.Enums.WEBSITE_INFORMATION
    }
    handleCmsItemStatus(params)
  }

  onMounted(() => {
    handleGetCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
</style>
