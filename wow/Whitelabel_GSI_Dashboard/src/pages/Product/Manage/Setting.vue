<template>
  <OnlyTitle backLabelI18nKey="btn.settings" :custom-back-func="router.back" />
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
              <!--  產品代碼 -->
              <q-td key="product_code" :props="props">
                {{ props.row.code }}
              </q-td>
              <!--  產品名稱 -->
              <q-td key="product" :props="props">
                {{ props.row.name }}
              </q-td>
              <!--  產品類型 -->
              <q-td v-if="showProductType" key="product_type" :props="props">
                {{ $t(GAME_TYPE.I18nKeys[props.row.game_type as GAME_TYPE.Enums]) }}
              </q-td>
              <!--入口開關 -->
              <q-td key="status" :props="props">
                <q-toggle
                  v-model="props.row.status"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="0"
                  :true-value="1"
                  @update:model-value="updateProductStatus($event, props.row)"
                />
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props">
                <q-btn
                  flat
                  fab-mini
                  color="blue"
                  :to="{
                    name: 'ProductManageGameSetting',
                    query: { game_type: props.row.game_type, product_code: props.row.code }
                  }"
                >
                  {{ $t("btn.game_settings") }}
                </q-btn>
                <q-btn flat fab-mini color="blue" @click="onEdit(props.row)" :disable="!permission.edit">
                  {{ $t("btn.entrance_image") }}
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
    <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="34.25rem">
      <template #mainContent>
        <div class="custom-image-form">
          <!-- TAB -->
          <div class="custom-image-content">
            <div class="title">TAB</div>
            <div class="custom-image-row">
              <div class="custom-image-col">
                <q-radio v-model="dialogData.customImageForm.enable_tab_image" :val="0" :label="$t('common.default')" />
              </div>
              <div class="custom-image-col">
                <q-radio v-model="dialogData.customImageForm.enable_tab_image" :val="1" :label="$t('common.custom')" />
                <PreviewImage
                  :parentImage="dialogData.customImageForm.tab_image_code"
                  :defaultImage="addProductCustomTabDefault()"
                  :aspectRatio="'162/54'"
                  @update:modelValue="($event) => (dialogData.customImageForm.tab_image_code = $event)"
                  imageToBase64
                  max-width="162px"
                />
                <div class="q-mt-xs">
                  {{ $t("edit_form.image_recommended_size", { width: "162", height: "54", unit: "px" }) }}
                </div>
                <div>{{ $t("edit_form.image_file_size", { limit: "200KB" }) }}</div>
              </div>
            </div>
          </div>
          <!-- 方形 -->
          <div class="custom-image-content">
            <div class="title">{{ $t("common.square") }}</div>
            <div class="custom-image-row">
              <div class="custom-image-col">
                <q-radio
                  v-model="dialogData.customImageForm.enable_square_image"
                  :val="0"
                  :label="$t('common.default')"
                />
              </div>
              <div class="custom-image-col">
                <q-radio
                  v-model="dialogData.customImageForm.enable_square_image"
                  :val="1"
                  :label="$t('common.custom')"
                />
                <PreviewImage
                  :parentImage="dialogData.customImageForm.square_image_code"
                  :defaultImage="addProductCustomSquareDefault()"
                  :aspectRatio="'165/139'"
                  @update:modelValue="($event) => (dialogData.customImageForm.square_image_code = $event)"
                  imageToBase64
                  max-width="165px"
                />
                <div class="q-mt-xs">
                  {{ $t("edit_form.image_recommended_size", { width: "500", height: "424", unit: "px" }) }}
                </div>
                <div>{{ $t("edit_form.image_file_size", { limit: "200KB" }) }}</div>
              </div>
            </div>
          </div>
          <!-- 寬版 -->
          <div class="custom-image-content">
            <div class="title">{{ $t("common.wide_version") }}</div>
            <div class="custom-image-row">
              <div class="custom-image-col">
                <q-radio
                  v-model="dialogData.customImageForm.enable_wide_image"
                  :val="0"
                  :label="$t('common.default')"
                />
              </div>
              <div class="custom-image-col">
                <q-radio v-model="dialogData.customImageForm.enable_wide_image" :val="1" :label="$t('common.custom')" />
                <PreviewImage
                  :parentImage="dialogData.customImageForm.wide_image_code"
                  :defaultImage="addProductCustomWideDefault()"
                  :aspectRatio="'222/95'"
                  @update:modelValue="($event) => (dialogData.customImageForm.wide_image_code = $event)"
                  imageToBase64
                  max-width="165px"
                />
                <div class="q-mt-xs">
                  {{ $t("edit_form.image_recommended_size", { width: "700", height: "300", unit: "px" }) }}
                </div>
                <div>{{ $t("edit_form.image_file_size", { limit: "200KB" }) }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </dialog-comp>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import onlyPagination, { IQueryConfig } from "@/components/query/onlyPagination.vue"
  import { getProductList, setProductStstus, setProductCustomImage, setProductPosition } from "@/api/product"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { useImage } from "@/hook/useImage"
  import { GAME_TYPE } from "src/utils/constants"
  import OnlyTitle from "src/layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { addProductCustomTabDefault, addProductCustomSquareDefault, addProductCustomWideDefault } = useImage()
  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_BASE_API } = envData()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }
    return baseConfig
  })

  const showProductType = computed(() => !!route.query.code)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    let result: CustomQTableProps["columns"] = [
      {
        name: "product_code",
        label: t("table_header.product_code"),
        field: "product_code",
        sortable: false,
        align: "center"
      },
      {
        name: "product",
        label: t("table_header.product"),
        field: "product",
        sortable: false,
        align: "center"
      }
    ]

    if (showProductType.value) {
      result.push({
        name: "product_type",
        label: t("table_header.product_type"),
        field: "product_type",
        sortable: false,
        align: "center"
      })
    }
    let lastColumn: CustomQTableProps["columns"] = [
      {
        name: "status",
        label: t("table_header.personnel_switch"),
        field: "status",
        sortable: false,
        align: "center"
      }
    ]

    result = result.concat(lastColumn)

    if (isAgentMode) {
      result.unshift({
        name: "sequence",
        label: t("table_header.sequence"),
        field: "sequence",
        sortable: false,
        align: "center"
      })
      result.push({
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      })
    }
    return result
  })

  const tableList = ref<Response.GetProductList>([])

  const { search, tableData, totalSize } = useSearch(getProductList)

  let catchQueryForm: Request.GetProductList
  async function onSubmit(queryForm: Request.GetProductList) {
    catchQueryForm = queryForm
    await search(queryForm)
    const searchResult = tableData.value as Response.GetProductList
    tableList.value = searchResult.map((e) => {
      e.origin_position = e.position
      return e
    })
  }

  const updateProductStatus = async (value: number, item: Response.ProductItem) => {
    const payload: Request.SetProductStatus = {
      product_code: item.code,
      game_type: item.game_type,
      status: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      const { search, status } = useSearch(setProductStstus)
      await search(payload)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        onSubmit(catchQueryForm)
      }
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  const handlePositionInput = async (row: Response.ProductItem) => {
    const position = row.position * 1
    if (position === row.origin_position) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(setProductPosition)
      const payload: Request.setProductPosition = {
        product_id: row.agent_product_id,
        position
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

  const dialogConfigs = reactive<{
    edit: IDialogConfig
  }>({
    edit: {
      dialogLabelI18nKey: "btn.entrance_image",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit,
      showLabelCloseBtn: true
    }
  })

  const dialogData = reactive<{
    productId: number
    customImageForm: Request.ProductCustomImageForm
  }>({
    productId: 0,
    customImageForm: {
      enable_tab_image: 0,
      enable_square_image: 0,
      enable_wide_image: 0,
      tab_image_code: "",
      square_image_code: "",
      wide_image_code: ""
    }
  })

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  function onEdit(row: Response.ProductItem) {
    dialogData.productId = row.agent_product_id
    dialogData.customImageForm.enable_tab_image = row.use_tab_image ? 1 : 0
    dialogData.customImageForm.tab_image_code = row.tab_image.includes("uploads")
      ? `${VITE_APP_BASE_API}/${row.tab_image}?v=${row.updated_at}`
      : row.tab_image
    dialogData.customImageForm.enable_square_image = row.use_square_image ? 1 : 0
    dialogData.customImageForm.square_image_code = row.square_image.includes("uploads")
      ? `${VITE_APP_BASE_API}/${row.square_image}?v=${row.updated_at}`
      : row.square_image
    dialogData.customImageForm.enable_wide_image = row.use_wide_image ? 1 : 0
    dialogData.customImageForm.wide_image_code = row.wide_image.includes("uploads")
      ? `${VITE_APP_BASE_API}/${row.wide_image}?v=${row.updated_at}`
      : row.wide_image

    openEditDialog()
  }

  async function handleEdit() {
    openEditLoading()
    const payload: Request.SetProductCustomImage = {
      product_id: dialogData.productId,
      enable_tab_image: dialogData.customImageForm.enable_tab_image ? true : false,
      enable_square_image: dialogData.customImageForm.enable_square_image ? true : false,
      enable_wide_image: dialogData.customImageForm.enable_wide_image ? true : false,
      tab_image_code: dialogData.customImageForm.tab_image_code,
      square_image_code: dialogData.customImageForm.square_image_code,
      wide_image_code: dialogData.customImageForm.wide_image_code
    }
    const { search, status } = useSearch(setProductCustomImage)
    await search(payload)
    closeEditLoading()
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeEdit()
    }
  }
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
        }
      }
    }
  }
</style>
