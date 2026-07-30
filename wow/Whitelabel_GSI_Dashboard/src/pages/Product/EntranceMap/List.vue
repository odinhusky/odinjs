<template>
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
          <q-select
            v-model="selectedGameType"
            :options="dropdownData.list"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            class="q-ml-md"
            style="min-width: 4.6875rem"
            :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
            @update:model-value="updateGameType"
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
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    v-if="isAgentMode"
                    flat
                    fab-mini
                    color="blue"
                    @click="onEdit(props.row)"
                    :disable="!permission.edit"
                  >
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
        <div class="custom-image-form row items-start">
          <!-- 左欄：語言選擇 -->
          <div class="column q-pr-md" style="width: 160px">
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
              class="q-mb-sm lang-btn full-width"
              :class="{ 'bg-main-color text-white': selectedImgLanguage === lang.label }"
              flat
              unelevated
              no-caps
              @click="onSelectLanguage(lang.label)"
            />
          </div>

          <!-- 右欄：圖片設定 -->
          <div class="column col">
            <!-- 區塊標題 -->
            <div class="text-subtitle1 q-mb-md">TAB</div>

            <!-- TAB 圖片設定 -->
            <div class="custom-image-content q-mb-lg">
              <div class="row q-col-gutter-md">
                <div class="q-mr-lg">
                  <q-radio
                    v-model="dialogData.customImageForm.use_tab_image"
                    :val="false"
                    :label="$t('common.default')"
                    class="items-center"
                  />
                </div>
                <div>
                  <q-radio
                    v-model="dialogData.customImageForm.use_tab_image"
                    :val="true"
                    :label="$t('common.custom')"
                    class="items-center"
                  />
                  <PreviewImage
                    :parentImage="tabImageFullPath"
                    :defaultImage="addProductCustomTabDefault()"
                    :aspectRatio="'162/54'"
                    @update:modelValue="($event) => (dialogData.customImageForm.tab_image = $event)"
                    imageToBase64
                    @update:imgFile="(file) => updateImgFile(file, 'tab')"
                    max-width="162px"
                  />
                  <div class="q-mt-xs">
                    {{ $t("edit_form.image_recommended_size", { width: "162", height: "54", unit: "px" }) }}
                  </div>
                  <div>{{ $t("edit_form.image_file_size", { limit: "200KB" }) }}</div>
                </div>
              </div>
            </div>
            <!-- 寬版 圖片設定 -->
            <div class="text-subtitle1 q-mb-md">{{ $t("common.square") }}</div>
            <div class="custom-image-content">
              <div class="row q-col-gutter-md">
                <div class="q-mr-lg">
                  <q-radio
                    v-model="dialogData.customImageForm.use_square_image"
                    :val="false"
                    :label="$t('common.default')"
                    class="items-center"
                  />
                </div>
                <div>
                  <q-radio
                    v-model="dialogData.customImageForm.use_square_image"
                    :val="true"
                    :label="$t('common.custom')"
                    class="items-center"
                  />
                  <PreviewImage
                    :parentImage="squareImageFullPath"
                    :defaultImage="addProductCustomSquareDefault()"
                    :aspectRatio="'165/139'"
                    @update:modelValue="($event) => (dialogData.customImageForm.square_image = $event)"
                    imageToBase64
                    @update:imgFile="(file) => updateImgFile(file, 'square')"
                    max-width="165px"
                  />
                  <div class="q-mt-xs">
                    {{ $t("edit_form.image_recommended_size", { width: "500", height: "424", unit: "px" }) }}
                  </div>
                  <div>{{ $t("edit_form.image_file_size", { limit: "200KB" }) }}</div>
                </div>
              </div>
            </div>
            <!--長板-->
            <div class="text-subtitle1 q-mb-md">{{ $t("common.wide_version") }}</div>
            <div class="custom-image-content">
              <div class="row q-col-gutter-md">
                <div class="q-mr-lg">
                  <q-radio
                    v-model="dialogData.customImageForm.use_wide_image"
                    :val="false"
                    :label="$t('common.default')"
                    class="items-center"
                  />
                </div>
                <div>
                  <q-radio
                    v-model="dialogData.customImageForm.use_wide_image"
                    :val="true"
                    :label="$t('common.custom')"
                    class="items-center"
                  />
                  <PreviewImage
                    :parentImage="wideImageFullPath"
                    :defaultImage="addProductCustomWideDefault()"
                    :aspectRatio="'222/95'"
                    @update:modelValue="($event) => (dialogData.customImageForm.wide_image = $event)"
                    imageToBase64
                    @update:imgFile="(file) => updateImgFile(file, 'wide')"
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
        </div>
      </template>
    </dialog-comp>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useQueryStore } from "src/stores/queryStore"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useSiteStore } from "src/stores/siteStore"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { GAME_TYPE, LANGUAGE_TYPE } from "@/utils/constants"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  import { useImage } from "@/hook/useImage"
  import {
    getEntranceMapList,
    uploadEntranceMapImage,
    updateEntranceMapCustomize,
    updateProductSort
  } from "@/api/productV2"
  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"

  const { addProductCustomTabDefault, addProductCustomSquareDefault, addProductCustomWideDefault } = useImage()

  const { permission } = usePermission()
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const queryStore = useQueryStore()
  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  //const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const $q = useQuasar()
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
  const selectedGameType = ref(0)
  const selectedImgLanguage = ref("")
  const updateLanguage = (newLanguage: any) => {
    selectedLanguage.value = newLanguage
    onSubmit(catchQueryForm)
  }
  const updateGameType = (newType: any) => {
    selectedGameType.value = newType
    onSubmit(catchQueryForm)
  }

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    useIntegration: true,
    useProductCode: true,
    useProductNames: true,
    usePagination: true
  })

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: []
  })

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
        label: t("query_params.product_code"),
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
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    return baseColumn
  })

  const tableList = ref<Response.GetProductList>([])

  const { search, tableData, totalSize } = useSearch(getEntranceMapList)

  let catchQueryForm: Request.GetEntranceMapList
  async function onSubmit(queryForm: Request.GetEntranceMapList) {
    catchQueryForm = queryForm

    catchQueryForm.lan = selectedLanguage.value || langOption.value[0].value

    catchQueryForm.game_type = selectedGameType.value
    console.log(catchQueryForm)
    await search(queryForm)
  }

  const getGameLabel = computed(() => (gameType: GAME_TYPE.Enums) => {
    return t(GAME_TYPE.I18nKeys[gameType as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
  })

  const handlePositionInput = async (row: {
    position: number
    origin_position: number
    integration_id: number
    product_code: number
    game_type: number
  }) => {
    const position = row.position * 1
    if (position === row.origin_position) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(updateProductSort)
      const payload: Request.SetGameTypeV2 = {
        game_type: row.game_type,
        integration_id: row.integration_id,
        product_code: row.product_code,
        position: row.position
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
    use_tab_image: boolean
    use_square_image: boolean
    use_wide_image: boolean
    tab_image?: string
    square_image?: string
    wide_image?: string
    tab_path?: File | string
    square_path?: File | string
    wide_path?: File | string
    product_name: string
  }
  const dialogData = reactive<{
    integration_id: number
    product_code: number
    game_type: number
    product_name: string
    customImageForm: Request.SetGameTypeFormV2
    customize: CustomizeItem[]
  }>({
    integration_id: 0,
    product_code: 0,
    game_type: 0,
    product_name: "",
    customImageForm: {
      use_tab_image: false,
      use_square_image: false,
      use_wide_image: false,
      tab_image: "",
      square_image: "",
      wide_image: "",
      tab_path: undefined,
      square_path: undefined,
      wide_path: undefined,
      product_name: ""
    },
    customize: [
      /*{
          language_code: "zh-tw",
          use_tab_image: false,
          use_square_image: false,
          use_wide_image: false,
          tab_image: "",
          square_image: "https://api-devm-dev.gsiwl.com/uploads/agents/game/type/images/9_1_pc.png?v=1750754472",
          wide_image: ""
        },
        {
          language_code: "en",
          use_tab_image: false,
          use_square_image: false,
          use_wide_image: false,
          tab_image: "https://api-devm-dev.gsiwl.com/uploads/agents/game/type/images/9_1_pc.png?v=1750754472",
          square_image: "",
          wide_image: ""
        }*/
    ]
  })

  function onSelectLanguage(lang: string) {
    selectedImgLanguage.value = lang

    if (lang === "") {
      // 全語系
      dialogData.customImageForm.use_tab_image = false
      dialogData.customImageForm.use_square_image = false
      dialogData.customImageForm.use_wide_image = false
      dialogData.customImageForm.tab_image = ""
      dialogData.customImageForm.square_image = ""
      dialogData.customImageForm.wide_image = ""
      dialogData.customImageForm.tab_path = undefined
      dialogData.customImageForm.square_path = undefined
      dialogData.customImageForm.wide_path = undefined
    } else {
      const target = dialogData.customize.find((item) => item.language_code === lang)

      if (target) {
        dialogData.customImageForm.use_tab_image = target.use_tab_image
        dialogData.customImageForm.use_square_image = target.use_square_image
        dialogData.customImageForm.use_wide_image = target.use_wide_image
        dialogData.customImageForm.tab_image = target.tab_image
        dialogData.customImageForm.square_image = target.square_image
        dialogData.customImageForm.wide_image = target.wide_image
        dialogData.customImageForm.tab_path = target.tab_path
        dialogData.customImageForm.square_path = target.square_path
        dialogData.customImageForm.wide_path = target.wide_path
        dialogData.customImageForm.product_name = target.product_name
      } else {
        dialogData.customImageForm.use_tab_image = false
        dialogData.customImageForm.use_square_image = false
        dialogData.customImageForm.use_wide_image = false
        dialogData.customImageForm.tab_image = ""
        dialogData.customImageForm.square_image = ""
        dialogData.customImageForm.wide_image = ""
        dialogData.customImageForm.tab_path = undefined
        dialogData.customImageForm.square_path = undefined
        dialogData.customImageForm.wide_path = undefined
        dialogData.customImageForm.product_name = ""
      }
    }
  }
  watch(
    () => [
      dialogData.customImageForm.use_tab_image,
      dialogData.customImageForm.use_square_image,
      dialogData.customImageForm.use_wide_image,
      dialogData.customImageForm.tab_image,
      dialogData.customImageForm.square_image,
      dialogData.customImageForm.wide_image,
      selectedImgLanguage.value
    ],
    () => {
      if (selectedImgLanguage.value === "") {
        /*// 🔥 全語系套用
          availableLanguages.value.forEach((lang) => {
            const target = dialogData.customize.find((item) => item.lang === lang)
            if (target) {
              target.use_tab_image = dialogData.customImageForm.use_tab_image
              target.use_square_image = dialogData.customImageForm.use_square_image
              target.use_wide_image = dialogData.customImageForm.use_wide_image
              target.tab_image = dialogData.customImageForm.tab_image
              target.square_image = dialogData.customImageForm.square_image
              target.wide_image = dialogData.customImageForm.wide_image
            } else {
              dialogData.customize.push({
                lang,
                use_tab_image: dialogData.customImageForm.use_tab_image,
                use_square_image: dialogData.customImageForm.use_square_image,
                use_wide_image: dialogData.customImageForm.use_wide_image,
                tab_image: dialogData.customImageForm.tab_image,
                square_image: dialogData.customImageForm.square_image,
                wide_image: dialogData.customImageForm.wide_image
              })
            }
          })*/
      } else {
        // 🔥 單一語系
        const target = dialogData.customize.find((item) => item.language_code === selectedImgLanguage.value)
        if (target) {
          target.use_tab_image = dialogData.customImageForm.use_tab_image
          target.use_square_image = dialogData.customImageForm.use_square_image
          target.use_wide_image = dialogData.customImageForm.use_wide_image
          target.tab_image = dialogData.customImageForm.tab_image
          target.square_image = dialogData.customImageForm.square_image
          target.wide_image = dialogData.customImageForm.wide_image
          target.tab_path = dialogData.customImageForm.tab_path
          target.square_path = dialogData.customImageForm.square_path
          target.wide_path = dialogData.customImageForm.wide_path
          target.product_name = dialogData.customImageForm.product_name
        } else {
          dialogData.customize.push({
            language_code: selectedImgLanguage.value,
            use_tab_image: dialogData.customImageForm.use_tab_image,
            use_square_image: dialogData.customImageForm.use_square_image,
            use_wide_image: dialogData.customImageForm.use_wide_image,
            tab_image: dialogData.customImageForm.tab_image,
            square_image: dialogData.customImageForm.square_image,
            wide_image: dialogData.customImageForm.wide_image,
            tab_path: dialogData.customImageForm.tab_path,
            square_path: dialogData.customImageForm.square_path,
            wide_path: dialogData.customImageForm.wide_path,
            product_name: dialogData.customImageForm.product_name
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
    game_type: number
    product_name: string
    customize: CustomizeItem[]
  }) {
    dialogData.product_code = row.product_code
    dialogData.integration_id = row.integration_id
    dialogData.game_type = row.game_type
    dialogData.product_name = row.product_name
    console.log(dialogData.game_type)
    dialogData.customize = row.customize

    dialogData.customImageForm.use_tab_image = false
    dialogData.customImageForm.use_square_image = false
    dialogData.customImageForm.use_wide_image = false
    dialogData.customImageForm.tab_image = ""
    dialogData.customImageForm.square_image = ""
    dialogData.customImageForm.wide_image = ""
    dialogData.customImageForm.tab_path = undefined
    dialogData.customImageForm.square_path = undefined
    dialogData.customImageForm.wide_path = undefined
    dialogData.customImageForm.product_name = ""

    console.log(dialogData.customize)
    selectedImgLanguage.value = ""

    openEditDialog()
  }
  const getImageFullPath = (img?: string) => {
    if (!img) return ""
    const isFullUrl = img.startsWith("http")
    const isBase64 = img.startsWith("data:image/")
    return isFullUrl || isBase64 ? img : `${VITE_APP_DYNAMIC_RESOURCE_URL}/${img}?updateTime=11`
    // return isFullUrl || isBase64 ? img : `https://wowdata.gpsriowdl.com/gsi/dev/devm/${img}`
  }

  const tabImageFullPath = computed(() => getImageFullPath(dialogData.customImageForm.tab_image))
  const squareImageFullPath = computed(() => getImageFullPath(dialogData.customImageForm.square_image))
  const wideImageFullPath = computed(() => getImageFullPath(dialogData.customImageForm.wide_image))
  const updateImgFile = async (value: File, type: string) => {
    if (value) {
      if (type === "tab") {
        dialogData.customImageForm.tab_path = value
      } else if (type === "square") {
        dialogData.customImageForm.square_path = value
      } else if (type === "wide") {
        dialogData.customImageForm.wide_path = value
      }

      if (selectedImgLanguage.value !== "") {
        dialogData.customize.forEach((item) => {
          if (item.language_code === selectedImgLanguage.value) {
            if (type === "tab") {
              item.tab_path = value
            } else if (type === "square") {
              item.square_path = value
            } else if (type === "wide") {
              item.wide_path = value
            }
          }
        })
      }
    }
  }

  async function handleEdit() {
    if (selectedImgLanguage.value === "") {
      langOption.value.forEach((lang) => {
        const code = lang.value
        const existing: any = dialogData.customize.find((item) => item.language_code === code)
        if (!existing) {
          dialogData.customize.push({
            language_code: code,
            use_tab_image: dialogData.customImageForm.use_tab_image,
            use_square_image: dialogData.customImageForm.use_square_image,
            use_wide_image: dialogData.customImageForm.use_wide_image,
            tab_image: "",
            square_image: "",
            wide_image: "",
            tab_path: undefined,
            square_path: undefined,
            wide_path: undefined,
            product_name: ""
          })
        }
        const existing2: any = dialogData.customize.find((item) => item.language_code === code)
        if (existing2 && dialogData.customImageForm.tab_path) {
          existing.use_tab_image = dialogData.customImageForm.use_tab_image
          existing.tab_path = dialogData.customImageForm.tab_path
        }
        if (existing2 && dialogData.customImageForm.square_path) {
          existing.use_tab_image = dialogData.customImageForm.use_square_image
          existing.square_path = dialogData.customImageForm.square_path
        }
        if (existing2 && dialogData.customImageForm.wide_path) {
          existing.use_tab_image = dialogData.customImageForm.use_wide_image
          existing.wide_path = dialogData.customImageForm.wide_path
        }
        /*if (existing) {
            // 若語系已存在，更新欄位
            existing.use_tab_image = dialogData.customImageForm.use_tab_image
            existing.use_square_image = dialogData.customImageForm.use_square_image
            existing.use_wide_image = dialogData.customImageForm.use_wide_image
            existing.tab_path = dialogData.customImageForm.tab_path
            existing.square_path = dialogData.customImageForm.square_path
            existing.wide_path = dialogData.customImageForm.wide_path
          } else {
            // 若語系不存在，新增一筆
            dialogData.customize.push({
              language_code: code,
              use_tab_image: dialogData.customImageForm.use_tab_image,
              use_square_image: dialogData.customImageForm.use_square_image,
              use_wide_image: dialogData.customImageForm.use_wide_image,
              tab_image: "",
              square_image: "",
              wide_image: "",
              tab_path: dialogData.customImageForm.tab_path,
              square_path: dialogData.customImageForm.square_path,
              wide_path: dialogData.customImageForm.wide_path,
              product_name: ""
            })
          }*/
      })
    }
    console.log(dialogData.customize)
    console.log(dialogData.customImageForm)

    openEditLoading()

    const success = await uploadAllImages()
    if (!success) {
      closeEditLoading()
      return
    }
    const customize = dialogData.customize.map((item) => ({
      ...item,
      tab_image: item.tab_path ?? item.tab_image,
      square_image: item.square_path ?? item.square_image,
      wide_image: item.wide_path ?? item.wide_image
    }))
    console.log(customize)
    customize.forEach((item) => {
      if (!item.product_name) {
        item.product_name = dialogData.product_name
      }
    })

    const payload: Request.ProductCustomFormV2 = {
      integration_id: dialogData.integration_id,
      product_code: dialogData.product_code,
      game_type: dialogData.game_type,
      customize: customize
    }

    const { search, status } = useSearch(updateEntranceMapCustomize)
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
    const imageTypes = [{ key: "tab_path" }, { key: "square_path" }, { key: "wide_path" }]

    for (const item of dialogData.customize) {
      if (!item.language_code) continue

      try {
        for (const { key } of imageTypes) {
          const imagePath = (item as any)[key]
          if (!imagePath) continue

          const payload: Request.UploadProductImages = {
            integration_id: 1,
            product_code: dialogData.product_code,
            game_type: dialogData.game_type,
            language_code: item.language_code,
            image: imagePath
          }

          /*const { search, tableData } = useSearch(uploadEntranceMapImage)
          await search(payload)*/
          const res = await uploadEntranceMapImage(payload)
          const target = dialogData.customize.find((inner) => inner.language_code === item.language_code)
          if (res.code === 0) {
            if (target) {
              ;(target as any)[key] = res.data.path
            }
          } else {
            /*dialogData.customImageForm.tab_image = ""
            dialogData.customImageForm.square_image = ""
            dialogData.customImageForm.wide_image = ""
            dialogData.customImageForm.tab_path = undefined
            dialogData.customImageForm.square_path = undefined
            dialogData.customImageForm.wide_path = undefined*/
            $q.notify({
              type: "negative",
              message: t("error_msg.image_upload_failed"),
              position: "top",
              timeout: 1000
            })
            return false
          }
        }
      } catch (error) {
        console.error(`API error for ${item.language_code}`, error)
        return false
      }
    }
    return true
  }

  onMounted(async () => {
    await queryStore.getGameTypeListV2()
    dropdownData.list = queryStore.gameTypeListV2.map((e) => {
      const label = t(GAME_TYPE.I18nKeys[e.value as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
      const value = e.value as number
      return {
        label,
        value
      }
    })
    selectedGameType.value = dropdownData.list[0].value
    //selectedLanguage.value = langOption.value[0].value
    //onSubmit(catchQueryForm)
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
          width: 30%;
        }
      }
    }
  }
</style>
