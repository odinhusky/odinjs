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
              <!--  產品類型 -->
              <q-td key="product_type" :props="props">
                {{ $t(GAME_TYPE.I18nKeys[props.row.game_type as GAME_TYPE.Enums]) }}
              </q-td>
              <!--  遊戲名稱 -->
              <q-td key="game_name" :props="props">
                {{ props.row.name }}
              </q-td>
              <!--  遊戲代碼 -->
              <q-td key="code" :props="props">
                {{ props.row.code }}
              </q-td>
              <!--hot -->
              <q-td key="hot" :props="props">
                <q-toggle
                  v-model="props.row.hot"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="0"
                  :true-value="1"
                  @update:model-value="updateGameHotStatus($event, props.row)"
                />
              </q-td>
              <!--newly -->
              <q-td key="status" :props="props">
                <q-toggle
                  v-model="props.row.newly"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="0"
                  :true-value="1"
                  @update:model-value="updateGameNewStatus($event, props.row)"
                />
              </q-td>
              <!--入口開關 -->
              <q-td key="status" :props="props">
                <q-toggle
                  v-model="props.row.status"
                  :disable="!permission.edit"
                  color="green"
                  :false-value="0"
                  :true-value="1"
                  @update:model-value="updateGameStatus($event, [props.row.id])"
                />
              </q-td>
              <!-- 功能 -->
              <q-td key="actions" :props="props">
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
    <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="26.1875rem">
      <template #mainContent>
        <div class="custom-image-form">
          <!-- 方形 -->
          <div class="custom-image-content">
            <div class="custom-image-row">
              <div class="custom-image-col">
                <q-radio v-model="dialogData.is_custom_image" :val="0" :label="$t('common.default')" />
                <img :src="getGameDefaultImg()" alt="" class="default-image" @error="setGameDefaultImg" />
              </div>
              <div class="custom-image-col">
                <q-radio v-model="dialogData.is_custom_image" :val="1" :label="$t('common.custom')" />
                <PreviewImage
                  :parentImage="dialogData.custom_image"
                  :defaultImage="addGameCustomDefault()"
                  :aspectRatio="'1/1'"
                  @update:modelValue="($event) => (dialogData.custom_image = $event)"
                  imageToBase64
                  :maxFileSize="204800"
                />
                <div class="q-mt-xs">* {{ $t("edit_form.recommended_square") }}</div>
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
  import { ref, reactive, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useQueryStore } from "src/stores/queryStore"
  import onlyPagination, { IQueryConfig } from "@/components/query/onlyPagination.vue"
  import {
    getGameList,
    setGameStstus,
    setGameHot,
    setGameNewly,
    updateGameSort,
    updateGameCustomImage
  } from "@/api/game"
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
  const queryStore = useQueryStore()
  const { addGameCustomDefault, getGametImg, setGameDefaultImg } = useImage()
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()

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
        label: t("table_header.product_name"),
        field: "product_name",
        sortable: false,
        align: "center"
      },
      {
        name: "product_type",
        label: t("table_header.product_type"),
        field: "product_type",
        sortable: false,
        align: "center"
      },
      {
        name: "game_name",
        label: t("table_header.game_name"),
        field: "game_name",
        sortable: false,
        align: "center"
      },
      {
        name: "code",
        label: t("table_header.game_code"),
        field: "code",
        sortable: false,
        align: "center"
      },
      {
        name: "hot",
        label: t("table_header.hot"),
        field: "hot",
        sortable: false,
        align: "center"
      },
      {
        name: "new",
        label: t("table_header.new"),
        field: "new",
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

  const { search, tableData, totalSize } = useSearch(getGameList)

  let catchQueryForm: Request.GetGameList
  async function onSubmit(queryForm: Request.GetGameList) {
    catchQueryForm = queryForm
    await search(queryForm)
    const searchResult = tableData.value as Response.GetProductGameSetting
    tableList.value = searchResult.map((e) => {
      e.origin_sort = e.sort
      return e
    })
  }

  const updateGameStatus = async (value: number, ids: number[]) => {
    const payload: Request.SetGameStatus = {
      ids,
      status: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      const { search, status } = useSearch(setGameStstus)
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

  const updateGameHotStatus = async (value: number, gameItem: Response.GameItem) => {
    const ids = [gameItem.id]
    const payload: Request.SetGameHot = {
      ids,
      hot: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      /* if (value === 1 && gameItem.newly) {
        await setGameNewly({ newly: false, ids })
      }*/
      const { search, status } = useSearch(setGameHot)
      await search(payload)
      onSubmit(catchQueryForm)
      if (status.value) {
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

  const updateGameNewStatus = async (value: number, gameItem: Response.GameItem) => {
    const ids = [gameItem.id]
    const payload: Request.SetGameNew = {
      ids,
      newly: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      /* if (value === 1 && gameItem.hot) {
        await setGameHot({ hot: false, ids })
      }*/
      const { search, status } = useSearch(setGameNewly)
      await search(payload)
      onSubmit(catchQueryForm)
      if (status.value) {
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

  const handlePositionInput = async (row: Response.productGameSettingItem) => {
    const sort = row.sort * 1
    if (sort === row.origin_sort) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(updateGameSort)
      const payload: Request.SetGameSort = {
        id: row.id,
        sort
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

  const getGameDefaultImg = () => {
    const gameTypeString = queryStore.gameTypeIdMap[dialogData.game_type]
    return getGametImg(gameTypeString, dialogData.product_code, dialogData.code)
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

  const dialogData = reactive<
    Request.SetGameCustomImageForm & {
      game_type: GAME_TYPE.Enums
      product_code: number
      code: string
    }
  >({
    id: 0,
    is_custom_image: 0,
    custom_image: "",
    game_type: 1,
    product_code: 0,
    code: ""
  })

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  function onEdit(row: Response.GameItem) {
    dialogData.id = row.id
    dialogData.is_custom_image = row.is_custom_image ? 1 : 0
    dialogData.custom_image = row.custom_image.includes("uploads")
      ? `${VITE_APP_BASE_API}/${row.custom_image}?v=${row.updated_at}`
      : row.custom_image
    dialogData.game_type = row.game_type
    dialogData.product_code = row.product_code
    dialogData.code = row.code
    openEditDialog()
  }

  async function handleEdit() {
    openEditLoading()
    const payload: Request.SetGameCustomImage = {
      id: dialogData.id,
      is_custom_image: dialogData.is_custom_image ? true : false,
      custom_image: dialogData.custom_image
    }

    const { search, status } = useSearch(updateGameCustomImage)
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
