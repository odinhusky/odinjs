<template>
  <OnlyTitle backLabelI18nKey="btn.settings" :custom-back-func="onCancel" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-select
            v-model="selectedLanguage"
            :options="langOption"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            style="min-width: 4.6875rem"
            :option-label="(item) => LANGUAGE_TYPE.Labels[item.label as LANGUAGE_TYPE.Enums]"
            @update:model-value="updateLanguage"
          />
        </div>
        <div class="table-container">
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
                <q-td key="code" :props="props">
                  {{ props.row.code }}
                </q-td>
                <!--  產品名稱 -->
                <q-td key="name" :props="props">
                  {{ getGameName(props.row) }}
                </q-td>

                <!--  產品類型 -->
                <q-td key="game_type" :props="props">
                  {{ getGameLabel(props.row.game_type) }}
                </q-td>
                <!--熱門 -->
                <!-- <q-td key="hot" :props="props">
                  <q-toggle
                    class="toggle"
                    size="lg"
                    v-model="props.row.hot"
                    :disable="!permission.edit"
                    color="blue"
                    :false-value="false"
                    :true-value="true"
                    @update:model-value="updateProductHots(props.row)"
                  />
                </q-td> -->
                <!--新 -->
                <!-- <q-td key="newly" :props="props">
                  <q-toggle
                    class="toggle"
                    size="lg"
                    v-model="props.row.newly"
                    :disable="!permission.edit"
                    color="blue"
                    :false-value="false"
                    :true-value="true"
                    @update:model-value="updateProductNewlys(props.row)"
                  />
                </q-td> -->
                <!--入口開關 -->
                <q-td key="status" :props="props">
                  <q-toggle
                    class="toggle"
                    size="lg"
                    v-model="props.row.status"
                    :disable="!permission.edit"
                    color="blue"
                    :false-value="false"
                    :true-value="true"
                    @update:model-value="updateProductStatus(props.row)"
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
        </div>
      </template>
    </query>
    <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="34.25rem">
      <template #mainContent>
        <div class="custom-image-form">
          <!-- TAB -->
          <div class="custom-image-content">
            <div class="custom-image-row">
              <!-- 語系按鈕欄 -->
              <div class="custom-image-col column items-center" style="width: 160px">
                <q-btn
                  :label="$t('btn.apply_all_languages')"
                  class="q-mb-sm lang-btn"
                  :class="{ 'bg-main-color text-white': selectedImgLanguage === '' }"
                  flat
                  unelevated
                  no-caps
                  @click="onSelectLanguage('')"
                />
                <q-btn
                  v-for="lang in langOption"
                  :key="lang.label"
                  :label="LANGUAGE_TYPE.Labels[lang.label]"
                  class="q-mb-sm lang-btn"
                  :class="{ 'bg-main-color text-white': selectedImgLanguage === lang.label }"
                  flat
                  unelevated
                  no-caps
                  @click="onSelectLanguage(lang.label)"
                />
              </div>
              <div class="custom-image-col">
                <q-radio
                  v-model="dialogData.customImageForm.is_custom_image"
                  :val="false"
                  :label="$t('common.default')"
                />
                <img :src="getGameDefaultImg()" alt="" class="default-image" @error="setGameDefaultImg" />
              </div>
              <div class="custom-image-col q-pr-sm">
                <q-radio
                  v-model="dialogData.customImageForm.is_custom_image"
                  :val="true"
                  :label="$t('common.custom')"
                />
                <PreviewImage
                  :parentImage="imageFullPath"
                  :defaultImage="addProductCustomSquareDefault()"
                  @update:modelValue="($event) => (dialogData.customImageForm.custom_image = $event)"
                  imageToBase64
                  @update:imgFile="updateImgFile"
                  style="width: 200px"
                />
                <div class="q-mt-xs">
                  {{ $t("edit_form.recommended_square") }}
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
  import { ref, reactive, computed, watch, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import query, { IQueryConfig } from "@/components/query/common.vue"

  import {
    updateProductCustomize,
    uploadProductImage,
    getProductGameList,
    updateProductHot,
    updateProductNewly,
    updateProductGameState,
    setProductPosition
  } from "@/api/productV2"

  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { useImage } from "@/hook/useImage"
  import { GAME_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import OnlyTitle from "src/layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useLanguage } from "src/composables/useLanguage"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useSiteStore } from "@/stores/siteStore"
  import { storeToRefs } from "pinia"
  import { useQueryStore } from "src/stores/queryStore"

  const { permission } = usePermission()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { addProductCustomSquareDefault, getGamePublicImg } = useImage()
  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  //const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const queryStore = useQueryStore()
  const languageStore = useLanguageStore()
  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)
  const langOption = computed(() =>
    langList.value.map((item) => ({
      label: item.label,
      value: item.label
    }))
  )

  const selectedLanguage = ref(langOption.value[0].value)
  const selectedImgLanguage = ref("")
  const updateLanguage = (newLanguage: any) => {
    selectedLanguage.value = newLanguage
    onSubmit(catchQueryForm)
  }

  const getGameDefaultImg = () => {
    const gameTypeString = queryStore.gameTypeIdMap[dialogData.game_type]
    return getGamePublicImg(dialogData.integration_id, gameTypeString, dialogData.product_code, dialogData.code)
    //return `/statics/staging/publics/images/games/1/${dialogData.product_code}/${gameTypeString}/${dialogData.code}.png`
  }

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      useProductGameCode: true,
      useProductGameName: true,
      useGameTypeV2: true,
      useProductStatus: true,
      usePagination: true
    }
    return baseConfig
  })

  const showProductType = computed(() => !!route.query.code)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    let result: CustomQTableProps["columns"] = [
      {
        name: "code",
        label: t("query_params.product_game_code"),
        field: "code",
        sortable: false,
        align: "center"
      },
      {
        name: "name",
        label: t("query_params.product_game_name"),
        field: "name",
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
      // {
      //   name: "hot",
      //   label: t("table_header.hot"),
      //   field: "hot",
      //   sortable: false,
      //   align: "center"
      // },
      // {
      //   name: "newly",
      //   label: t("table_header.new"),
      //   field: "newly",
      //   sortable: false,
      //   align: "center"
      // },
      {
        name: "status",
        label: t("table_header.personnel_switch"),
        field: "status",
        sortable: false,
        align: "center"
      }
    ]

    /*if (showProductType.value) {
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

    result = result.concat(lastColumn)*/

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

  const { search, tableData, totalSize } = useSearch(getProductGameList)

  let catchQueryForm: Request.GetProductListV2
  async function onSubmit(queryForm: Request.GetProductListV2) {
    catchQueryForm = queryForm
    catchQueryForm.lan = selectedLanguage.value
    catchQueryForm.integration_id = route.query.integration_id as string
    catchQueryForm.product_code = route.query.product_code as string

    await search(queryForm)
    const searchResult = tableData.value as Response.GetProductList
    tableList.value = searchResult.map((e) => {
      e.origin_position = e.sort
      return e
    })
    console.log(VITE_APP_DYNAMIC_RESOURCE_URL)
  }
  const getGameLabel = computed(() => (gameType: GAME_TYPE.Enums) => {
    return t(GAME_TYPE.I18nKeys[gameType as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
  })

  const updateImgFile = async (value: File) => {
    if (value) {
      dialogData.customImageForm.path = value
      if (selectedImgLanguage.value !== "") {
        dialogData.customize.forEach((item) => {
          if (item.language_code === selectedImgLanguage.value) {
            item.path = value
          }
        })
      }
    }
  }

  const updateProductStatus = async (row: { id: number; status: boolean }) => {
    let sendData = {
      ids: [row.id],
      status: row.status
    }

    const { search, status } = useSearch(updateProductGameState)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }

  const updateProductHots = async (row: { id: number; hot: boolean }) => {
    let sendData = {
      ids: [row.id],
      status: row.hot
    }
    const { search, status } = useSearch(updateProductHot)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }
  const updateProductNewlys = async (row: { id: number; newly: boolean }) => {
    let sendData = {
      ids: [row.id],
      status: row.newly
    }
    const { search, status } = useSearch(updateProductNewly)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }

  const handlePositionInput = async (row: Response.ProductItem) => {
    const position = row.sort * 1

    if (position === row.origin_position) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(setProductPosition)
      const payload: { id: number; sort: number } = {
        id: row.id,
        sort: Number(row.sort)
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

  interface CustomizeItem {
    language_code: string
    is_custom_image: boolean
    custom_image: string
    path?: File | string
    game_name: string
  }
  const dialogData = reactive<{
    integration_id: number
    product_code: number
    code: number | string
    game_type: number
    game_name: string
    customImageForm: Request.ProductCustomImageFormV2
    customize: CustomizeItem[]
  }>({
    integration_id: 0,
    product_code: 0,
    code: 0,
    game_type: 0,
    game_name: "",
    customImageForm: {
      is_custom_image: false,
      custom_image: "",
      path: undefined,
      game_name: ""
    },
    customize: [
      /*{
        language_code: "zh-tw",
        is_custom_image: true,
        custom_image: "https://api-devm-dev.gsiwl.com/uploads/agents/game/type/images/9_1_pc.png?v=1750754472"
      },
      {
        language_code: "en",
        is_custom_image: true,
        custom_image: ""
      }*/
    ]
  })

  function onSelectLanguage(lang: string) {
    console.log(lang)
    selectedImgLanguage.value = lang
    if (lang === "") {
      // 全語系
      dialogData.customImageForm.is_custom_image = false
      dialogData.customImageForm.custom_image = ""
      dialogData.customImageForm.path = undefined
      dialogData.customImageForm.game_name = ""
    } else {
      const target = dialogData.customize.find((item) => item.language_code === lang)

      if (target) {
        dialogData.customImageForm.is_custom_image = target.is_custom_image
        dialogData.customImageForm.custom_image = target.custom_image
        dialogData.customImageForm.path = target.path
        dialogData.customImageForm.game_name = target.game_name
      } else {
        dialogData.customImageForm.is_custom_image = false
        dialogData.customImageForm.custom_image = ""
        dialogData.customImageForm.path = undefined
        dialogData.customImageForm.game_name = ""
      }
    }
  }
  watch(
    () => [
      dialogData.customImageForm.is_custom_image,
      dialogData.customImageForm.custom_image,
      selectedImgLanguage.value
    ],
    () => {
      if (selectedImgLanguage.value === "") {
        /*
        availableLanguages.value.forEach((lang) => {
          const target = dialogData.customize.find((item) => item.lang === lang)
          if (target) {
            target.is_custom_image = dialogData.customImageForm.is_custom_image
            target.custom_image = dialogData.customImageForm.custom_image
          } else {
            dialogData.customize.push({
              lang,
              is_custom_image: dialogData.customImageForm.is_custom_image,
              custom_image: dialogData.customImageForm.custom_image
            })
          }
        })*/
      } else {
        // 🔥 單一語系
        const target = dialogData.customize.find((item) => item.language_code === selectedImgLanguage.value)
        if (target) {
          target.is_custom_image = dialogData.customImageForm.is_custom_image
          target.custom_image = dialogData.customImageForm.custom_image
          target.path = dialogData.customImageForm.path
          target.game_name = dialogData.customImageForm.game_name
        } else {
          dialogData.customize.push({
            language_code: selectedImgLanguage.value,
            is_custom_image: dialogData.customImageForm.is_custom_image,
            custom_image: dialogData.customImageForm.custom_image,
            path: dialogData.customImageForm.path,
            game_name: dialogData.customImageForm.game_name
          })
        }
      }
    },
    { deep: true }
  )

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  function onEdit(row: {
    product_code: number
    integration_id: number
    code: number
    game_type: number
    name: string
    customize: CustomizeItem[]
  }) {
    dialogData.product_code = row.product_code
    dialogData.integration_id = row.integration_id
    dialogData.code = row.code
    dialogData.customize = row.customize
    dialogData.customImageForm.is_custom_image = false
    dialogData.customImageForm.custom_image = ""
    dialogData.customImageForm.path = undefined
    dialogData.customImageForm.game_name = ""
    dialogData.game_type = row.game_type
    dialogData.game_name = row.name
    selectedImgLanguage.value = ""
    /* dialogData.customImageForm.enable_tab_image = row.use_tab_image ? 1 : 0
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
      : row.wide_image*/

    openEditDialog()
  }

  const getImageFullPath = (img?: string) => {
    if (!img) return ""
    const isFullUrl = img.startsWith("http")
    const isBase64 = img.startsWith("data:image/")
    return isFullUrl || isBase64 ? img : `${VITE_APP_DYNAMIC_RESOURCE_URL}/${img}`
    //return isFullUrl || isBase64 ? img : `https://wowdata.gpsriowdl.com/gsi/dev/devm/${img}`
  }

  const imageFullPath = computed(() => getImageFullPath(dialogData.customImageForm.custom_image))

  async function handleEdit() {
    //如果全語系圖片沒有圖檔就不要執行以下
    if (selectedImgLanguage.value === "" && dialogData.customImageForm.custom_image !== "") {
      langOption.value.forEach((lang) => {
        const code = lang.value
        const existing: any = dialogData.customize.find((item) => item.language_code === code)
        if (!existing) {
          // 若語系不存在，新增一筆
          dialogData.customize.push({
            language_code: code,
            is_custom_image: dialogData.customImageForm.is_custom_image,
            custom_image: "",
            path: dialogData.customImageForm.path,
            game_name: ""
          })
        }
        if (existing) {
          existing.is_custom_image = dialogData.customImageForm.is_custom_image
          existing.path = dialogData.customImageForm.path
        }
      })
    }

    openEditLoading()

    const success = await uploadAllImages()
    if (!success) {
      closeEditLoading()
      return
    }
    const customize = dialogData.customize
      .map((item) => ({
        ...item,
        custom_image: item.path ?? item.custom_image
      }))
      .filter((item) => item.language_code && item.language_code.trim() !== "")

    customize.forEach((item) => {
      if (!item.game_name) {
        item.game_name = dialogData.game_name
      }
    })

    const payload: Request.ProductCustomFormV2 = {
      integration_id: dialogData.integration_id,
      product_code: dialogData.product_code,
      game_type: catchQueryForm.game_type,
      game_code: dialogData.code,
      customize: customize
    }

    const { search, status } = useSearch(updateProductCustomize)
    await search(payload)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
    closeEdit()
    closeEditLoading()
  }
  async function uploadAllImages() {
    for (const item of dialogData.customize) {
      try {
        if (!item.language_code || !item.path) continue

        const payload: Request.UploadProductImages = {
          integration_id: dialogData.integration_id,
          product_code: dialogData.product_code,
          game_type: catchQueryForm.game_type,
          game_code: dialogData.code,
          language_code: item.language_code,
          image: item.path
        }

        /*const { search, tableData, status } = useSearch(uploadProductImage)
        await search(payload)
        if (!status.value) {
          target.path = ""
          return false
        }*/
        const res = await uploadProductImage(payload)
        const target = dialogData.customize.find((innerItem) => innerItem.language_code === item.language_code)
        if (res.code === 0) {
          if (target) {
            console.log(res.data.path)
            target.path = res.data.path
          }
        } else {
          /*target.path = ""
          dialogData.customImageForm.custom_image = ""
          dialogData.customImageForm.path = undefined*/
          $q.notify({
            type: "negative",
            message: t("error_msg.image_upload_failed"),
            position: "top",
            timeout: 1000
          })
          return false
        }

        // 只更新對應語系那筆資料的 path
      } catch (error) {
        console.error(`API error for ${item.language_code}`, error)
        return false
      }
    }
    return true
  }
  onMounted(async () => {
    // selectedLanguage.value = langOption.value[0].value
  })

  function getGameName(row: any) {
    const match = row.customize?.find((c: any) => c.language_code === selectedLanguage.value)
    return match?.game_name || row.name
  }
  function onCancel() {
    router.push({ name: "ProductManageList_v2" })
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
