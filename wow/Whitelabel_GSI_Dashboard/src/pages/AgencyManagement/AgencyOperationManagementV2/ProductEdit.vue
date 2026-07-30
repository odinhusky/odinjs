<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">
            {{ $t("table_header.product_setting") }} {{ $t("table_header.agent") }} :
            <span style="color: blue">{{ agent_code }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section>
          <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
            <template #mainContent>
              <div class="row q-mb-md justify-start">
                <q-select
                  v-model="selectedLanguage"
                  :options="availableLanguages"
                  outlined
                  dense
                  emit-value
                  map-options
                  color="primary"
                  style="min-width: 4.6875rem"
                  :option-label="(item) => LANGUAGE_TYPE.Labels[item as LANGUAGE_TYPE.Enums]"
                  @update:model-value="updateLanguage"
                />
              </div>
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
                    <!--集成名稱-->
                    <q-td key="integration_name" :props="props">
                      {{ props.row.integration_name }}
                    </q-td>
                    <!--產品代碼-->
                    <q-td key="product_code" :props="props">
                      {{ props.row.product_code }}
                    </q-td>
                    <!--產品-->
                    <q-td key="product_name" :props="props"> {{ props.row.product_name }} </q-td>
                    <!--產品類別-->
                    <q-td key="game_type" :props="props">
                      {{ getGameLabel(props.row.game_type) }}
                    </q-td>
                    <!--幣別-->
                    <q-td key="currency_id" :props="props">
                      {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) || "" }}
                    </q-td>
                    <!--集成開關-->
                    <q-td key="integration_status" :props="props">
                      <template v-if="props.row.integration_status">
                        {{ $t("common.is_open") }}
                      </template>

                      <template v-else>
                        {{ $t("common.is_close") }}
                      </template>
                    </q-td>
                    <!--產品開關-->
                    <q-td key="is_active" :props="props"
                      ><q-toggle
                        v-model="props.row.is_active"
                        color="green"
                        :false-value="false"
                        :true-value="true"
                        keep-color
                        :disable="!permission.edit"
                        @update:model-value="updateStatus(props.row)"
                      />
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
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { QTableProps, useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import type { agencyManagementListItem } from "@/api/response.type"
  import { useQueryStore } from "@/stores/queryStore"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { GetAgencyManagementProduct, updateAgentProductState } from "@/api/productV2"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { GAME_TYPE, CURRENCY_TYPE, LANGUAGE_TYPE } from "@/utils/constants"
  import { useLanguage } from "src/composables/useLanguage"
  import { useLanguageStore } from "src/stores/languageStore"
  import { storeToRefs } from "pinia"
  import { useSiteStore } from "src/stores/siteStore"

  const queryStore = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { permission } = usePermission()
  const $q = useQuasar()
  const { availableLanguages } = useLanguage()
  function goBack() {
    router.back()
  }
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useIntegration: true,
    useProductCode: true,
    useProductNames: true,
    useGameTypeV2: true,
    useCurrency: true,
    useIntegrationStatus: true,
    useProductStatus: true
  })
  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)
  const langOption = computed(() =>
    langList.value.map((item) => ({
      label: item.label,
      value: item.label
    }))
  )

  const selectedLanguage = ref("")

  const updateLanguage = (newLanguage: any) => {
    selectedLanguage.value = newLanguage
    onSubmit(catchQueryForm)
  }
  const tableList = ref<Response.GameTypes>([])

  const getGameLabel = computed(() => (gameType: GAME_TYPE.Enums) => {
    return t(GAME_TYPE.I18nKeys[gameType as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
  })
  const { search, spinShow, totalSize, tableData } = useSearch(GetAgencyManagementProduct)

  let catchQueryForm: Request.GetAgentProductListV2
  const id = route.params.id as string
  const agent_code = route.params.agent_code as string
  async function onSubmit(queryForm: Request.GetAgentProductListV2) {
    catchQueryForm = queryForm
    catchQueryForm.lan = selectedLanguage.value
    catchQueryForm.agent_id = parseInt(id)
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const baseColumn: QTableProps["columns"] = [
      {
        name: "integration_name",
        label: t("query_params.gsc_name"),
        field: "integration_name",
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
        name: "game_type",
        label: t("table_header.product_type"),
        field: "game_type",
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
        name: "integration_status",
        label: t("table_header.route_switch"),
        field: "integration_status",
        sortable: false,
        align: "center"
      },
      {
        name: "is_active",
        label: t("menu.product_switch"),
        field: "is_active",
        sortable: false,
        align: "center"
      }
    ]
    return baseColumn
  })

  function onCancel() {
    router.push({ name: "AgencyOperationManagementList_v2" })
  }
  const updateStatus = async (row: { agent_product_id: number; is_active: boolean }) => {
    let sendData = {
      ids: [row.agent_product_id],
      status: row.is_active
    }

    const res = await updateAgentProductState(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  onMounted(async () => {
    selectedLanguage.value = availableLanguages.value[0]
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .enable {
    width: 47%;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  .q-btn-group {
    box-shadow: none;
    border: 1px solid #6e39cb;
  }
</style>
