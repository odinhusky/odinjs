<template>
  <div class="q-pa-md">
    <query :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="showTableList"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!-- NO. -->
                <q-td key="position" :props="props" width="250px">
                  <q-number
                    v-model="props.row.position"
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
                <!--產品-->
                <q-td key="name" :props="props">
                  {{ getGameLabel(props.row.game_type) }}
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    flat
                    fab-mini
                    color="blue"
                    :to="{ name: 'SortSetting', query: { game_type: props.row.game_type } }"
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
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useQueryStore } from "src/stores/queryStore"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useSiteStore } from "src/stores/siteStore"
  import { getGameTypes, updateGameType } from "@/api/gameType"

  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { GAME_TYPE } from "@/utils/constants"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const siteStore = useSiteStore()

  const { permission } = usePermission()
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const queryStore = useQueryStore()
  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    allowSameSubmit: true,
    /*
    useProductNames: true,*/
    useIntegration: true,
    useGameTypeV2: true,
    useProductCodeV2: true,
    //useProductCodeName: true,
    useKeyword: true
  })

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const baseColumn: QTableProps["columns"] = [
      {
        name: "name",
        label: t("table_header.name"),
        field: "name",
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

    if (isAgentMode) {
      baseColumn.unshift({
        name: "position",
        label: t("table_header.id"),
        field: "position",
        sortable: false,
        align: "center"
      })
    }

    return baseColumn
  })

  const tableList = ref<Response.GameTypes>([])

  const { search, tableData } = useSearch(getGameTypes)

  const showTableList = computed(() => {
    const resultTableList = isAgentMode
      ? tableList.value
      : queryStore.gameTypeList.map((e) => {
          return { game_type: e.value }
        })
    if (route.query.game_type) {
      const gameType = parseInt(route.query.game_type as string)
      return resultTableList.filter((e) => e.game_type === gameType)
    }
    return resultTableList
  })

  const getGameLabel = computed(() => (gameType: GAME_TYPE.Enums) => {
    const agent_code = siteStore.agent_code.toLocaleLowerCase()
    if (agent_code === "anip") {
      if (gameType === GAME_TYPE.Enums.SLOT) {
        return t("common.ecasino")
      } else if (gameType === GAME_TYPE.Enums.SPORTBOOK) {
        return t("common.sports_betting")
      }
    }
    return t(GAME_TYPE.I18nKeys[gameType as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
  })

  async function getGameTypeList() {
    if (!isAgentMode) return

    await search()
    const searchResult = tableData.value as Response.GameTypes
    tableList.value = searchResult.map((e) => {
      e.origin_position = e.position
      return e
    })
  }

  const handlePositionInput = async (row: Response.GameTypeItem) => {
    const position = row.position * 1
    if (position === row.origin_position) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(updateGameType)
      const payload: Request.SetGameType = {
        game_type: `${row.game_type}`,
        position
      }
      await search(payload)
      if (status.value) {
        getGameTypeList()
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

  async function onSubmit(queryForm: Request.ProductSort) {
    const { integration_id, game_type, product_name, keyword, product_code } = queryForm
    /* if (queryForm.keyword || queryForm.product_name) {
      router.push({
        name: "SortGameSetting",
        query: {
          game_type,
          product_name,
          keyword
        }
      })
      return
    }*/

    if (queryForm.keyword) {
      router.push({
        name: "SortGameSetting",
        query: {
          integration_id,
          game_type,
          product_name,
          keyword
        }
      })
      return
    }

    if (queryForm.product_code) {
      router.push({
        name: "SortSetting",
        query: {
          integration_id,
          game_type,
          //code: product_name
          product_code
        }
      })
      return
    }
  }

  onMounted(async () => {
    getGameTypeList()
  })
</script>

<style lang="scss" scoped>
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
        }
      }
    }
  }
</style>
