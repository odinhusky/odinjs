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
              <!--id-->
              <q-td key="id" :props="props">
                {{ props.row.code }}
              </q-td>
              <!--產品 -->
              <q-td key="game_type" :props="props">
                {{ props.row.name }}
              </q-td>
              <!--啟用代理-->
              <q-td key="quote_count" :props="props">
                <span class="text-blue">{{ props.row.quote_count }}</span>
              </q-td>
              <!--入口開關 -->
              <q-td key="status" :props="props">
                <q-toggle
                  v-model="props.row.status"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="0"
                  :true-value="1"
                  @update:model-value="updateProductStatus($event, props.row.code)"
                />
              </q-td>
              <!-- 集成開關 -->
              <q-td key="is_active" :props="props">
                <span v-if="props.row.is_active" class="text-blue">{{ $t("common.is_open") }}</span>
                <span v-else class="text-red">{{ $t("common.is_close") }}</span>
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
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getProductList, setProductStstus } from "@/api/product"
  import type * as Request from "@/api/request.type"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()

  let { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useGameCode: true,
      useKeyword: true
    }
    return baseConfig
  })

  const { search, tableData, totalSize } = useSearch(getProductList)

  let catchQueryForm: Request.GetProductList
  async function onSubmit(queryForm: Request.GetProductList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    let result: CustomQTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.id"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "game_type",
        label: t("table_header.product"),
        field: "game_type",
        sortable: false,
        align: "center"
      }
    ]
    let dynamicColumn: CustomQTableProps["columns"] = []
    if (isAdminMode) {
      dynamicColumn = [
        {
          name: "quote_count",
          label: t("table_header.activated_quantity"),
          field: "quote_count",
          sortable: false,
          align: "center"
        },
        {
          name: "status",
          label: t("table_header.personnel_switch"),
          field: "status",
          sortable: false,
          align: "center"
        },
        {
          name: "is_active",
          label: t("table_header.route_switch"),
          field: "is_active",
          sortable: false,
          align: "center"
        }
      ]
    }
    if (isGeneralAgentMode) {
      dynamicColumn = [
        {
          name: "quote_count",
          label: t("table_header.activated_quantity"),
          field: "quote_count",
          sortable: false,
          align: "center"
        },
        {
          name: "status",
          label: t("table_header.personnel_switch"),
          field: "status",
          sortable: false,
          align: "center"
        }
      ]
    }
    if (isAgentMode) {
      dynamicColumn = [
        {
          name: "status",
          label: t("table_header.personnel_switch"),
          field: "status",
          sortable: false,
          align: "center"
        }
      ]
    }

    result = result.concat(dynamicColumn)
    return result
  })

  const updateProductStatus = async (value: number, product_id: number) => {
    const payload: Request.SetProductStatus = {
      product_code: product_id,
      status: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      const { code, msg } = await setProductStstus(payload)
      if (code === 0) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        onSubmit(catchQueryForm)
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }
</script>
