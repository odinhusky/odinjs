<template>
  <OnlyTitle backLabelI18nKey="btn.game_settings" :custom-back-func="router.back" />
  <div class="q-pa-md">
    <onlyPagination v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableList"
          :columns="tableColumn"
          row-key="id"
          table-header-class="bg-success"
        >
          <template #body="props">
            <q-tr>
              <!--  排序  -->
              <q-td key="sequence" :props="props">
                <q-number
                  v-model="props.row.sort"
                  :options="{
                    min: 1,
                    minimumFractionDigits: '0',
                    precision: '0',
                    nullValue: '',
                    separator: ''
                  }"
                  dense
                  outlined
                  class="sort-input"
                  @blur="handlePositionInput(props.row)"
                  placeholder=""
                />
              </q-td>
              <!--  產品代碼 -->
              <q-td key="product_code" :props="props">
                {{ props.row.product_code }}
              </q-td>
              <!--  產品名稱 -->
              <q-td key="product_name" :props="props">
                {{ props.row.product_name }}
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <q-btn
                  flat
                  fab-mini
                  color="blue"
                  :to="{
                    name: 'SortGameSetting',
                    query: {
                      integration_id: props.row.integration_id,
                      product_code: props.row.product_code,
                      game_type: props.row.game_type
                    }
                  }"
                >
                  {{ $t("btn.settings") }}
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
    </onlyPagination>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useQueryStore } from "src/stores/queryStore"
  import onlyPagination, { IQueryConfig } from "@/components/query/onlyPagination.vue"

  import { getEntranceMapList, updateProductSort } from "@/api/productV2"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { useImage } from "@/hook/useImage"
  import { GAME_TYPE } from "src/utils/constants"
  import OnlyTitle from "src/layouts/SubPage/OnlyTitle.vue"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const queryStore = useQueryStore()
  const { envData } = useEnv()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }
    return baseConfig
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    let result: CustomQTableProps["columns"] = [
      {
        name: "sequence",
        label: t("table_header.sequence"),
        field: "sequence",
        sortable: false,
        align: "center"
      },
      {
        name: "product_code",
        label: t("table_header.product_code"),
        field: "product_code",
        sortable: false,
        align: "center"
      },
      {
        name: "product_name",
        label: t("table_header.product"),
        field: "product_name",
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

    return result
  })

  const tableList = ref<Response.GetProductGameSetting>([])

  const { search, tableData, totalSize } = useSearch(getEntranceMapList)

  let catchQueryForm: Request.ProductSort
  async function onSubmit(queryForm: Request.ProductSort) {
    console.log(queryForm)

    catchQueryForm = queryForm
    await search(queryForm)
    const searchResult = tableData.value as Response.GetProductGameSetting
    tableList.value = searchResult.map((e) => {
      e.origin_sort = e.sort
      return e
    })
  }

  const handlePositionInput = async (row: Response.productGameSettingItem) => {
    const sort = row.sort * 1
    if (sort === row.origin_sort) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(updateProductSort)
      const payload = {
        integration_id: row.integration_id,
        product_code: row.product_code,
        game_type: row.game_type,
        sort: sort
      }
      await search(payload)
      if (status.value) {
        onSubmit(catchQueryForm)
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  onMounted(async () => {
    await queryStore.getGameTypeList()
  })
</script>

<style scoped lang="scss">
  .sort-input {
    width: 4.6875rem;
    margin: 0 auto;

    :deep(.q-field__native) {
      .q-field__input {
        text-align: center;
      }
    }
  }

  .custom-image-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    .custom-image-content {
      .title {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.25rem;
        padding-left: 0.625rem;
        margin-top: 1.25rem;
        margin-bottom: 0.625rem;
      }
      .custom-image-row {
        display: flex;
        justify-content: space-between;
        gap: 1.5rem;
        .custom-image-col {
          width: 45%;
          .default-image {
            width: 100%;
            aspect-ratio: 1/1;
          }
        }
      }
    }
  }
</style>
