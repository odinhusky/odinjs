<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPageOnlyTitle :backLabelI18nKey="isEditMode ? 'btn.edit' : 'btn.add'" />
    <div class="q-pa-md">
      <div class="q-pa-xl bg-white">
        <q-form @submit="handleSubmit">
          <q-card flat>
            <!-- 會員端標題 -->
            <q-card-section>
              <h3 class="text-subtitle1 text-weight-bold q-mb-md">{{ $t("cms.display_title") }}</h3>
              <div class="row items-center q-gutter-md q-mb-md">
                <span>{{ $t("cms.apply_language") }}</span>

                <q-select
                  v-model="selectedTitleLanguage"
                  :options="langOption"
                  outlined
                  dense
                  emit-value
                  map-options
                  color="primary"
                  style="max-width: 200px"
                  class="cms-form-input"
                  :option-label="(item) => LANGUAGE_TYPE.Labels[item.label as LANGUAGE_TYPE.Enums]"
                  @update:model-value="updateTitleLanguage"
                />
                <q-btn color="primary" size="16px" @click="copyTitleLanguage">{{ $t("btn.apply") }}</q-btn>
              </div>
              <div class="row items-center q-gutter-md">
                <div v-for="item in Object.keys(cmsForm.setting.lang)" :key="item">
                  <span>{{ item }}</span>
                  <q-input
                    v-model="cmsForm.setting.lang[item as LANGUAGE_TYPE.Enums]"
                    dense
                    outlined
                    class="cms-form-input"
                    :placeholder="$t('common.please_enter_content')"
                  ></q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="row items-center q-gutter-md">
              <!-- 入口設定 -->
              <div>
                <span>{{ $t("cms.entry_settings") }}</span>
                <q-select
                  v-model="cmsForm.setting.product_entrance_type"
                  :options="productEntranceTypeList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                  @update:model-value="updateIntegrationAndType"
                >
                </q-select>
              </div>
            </q-card-section>
            <q-card-section class="row items-center q-gutter-md">
              <!-- 新增平台 -->
              <div>
                <span>{{ $t("cms.add_platform") }}</span>
                <q-select
                  v-model="cmsForm.setting.product_integration_id"
                  :options="productIntegrationList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                  @update:model-value="updateIntegrationAndType"
                >
                </q-select></div
            ></q-card-section>
            <q-card-section class="row items-center q-gutter-md">
              <!-- 新增類別 -->
              <div>
                <span>{{ $t("cms.add_category") }}</span>
                <q-select
                  v-model="cmsForm.setting.product_type"
                  :options="productGameTypeList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>
            </q-card-section>
            <q-card-section class="row items-center q-gutter-md">
              <!-- 新增產品 -->
              <div>
                <span>{{ $t("cms.add_product") }}</span>
                <div class="q-flex">
                  <q-select
                    v-model="cmsForm.setting.product_code"
                    :options="productGameList"
                    dense
                    options-dense
                    outlined
                    map-options
                    emit-value
                    class="cms-form-input"
                  >
                  </q-select>
                  <q-btn outline color="main-color" @click="addEntrance()" class="q-ml-md">
                    {{ $t("btn.add") }}
                    <q-icon class="q-ml-xs" size="xs" name="add_circle_outline" />
                  </q-btn>
                </div>

                <q-select
                  v-model="selectedLanguage"
                  :options="langOption"
                  outlined
                  dense
                  emit-value
                  map-options
                  color="primary"
                  style="max-width: 200px"
                  class="q-mt-md"
                  :option-label="(item) => LANGUAGE_TYPE.Labels[item.label as LANGUAGE_TYPE.Enums]"
                  @update:model-value="updateLanguage"
                />
              </div>
            </q-card-section>

            <q-card-section class="q-pa-none">
              <div class="q-mt-xs">
                <div class="row items-center q-gutter-md">
                  <q-table
                    square
                    hide-pagination
                    :rows-per-page-options="[0]"
                    :rows="cmsForm.entrance"
                    :columns="tableColumnList"
                    row-key="id"
                    table-header-class="bg-success"
                    style="width: 100%"
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
                            placeholder=""
                            @blur="handleSortInput(props.row)"
                          />
                        </q-td>
                        <!-- 標題 -->
                        <q-td key="lang" :props="props">
                          {{ getDynamicLangValue(props.row.lang) }}
                        </q-td>

                        <!-- 功能 -->
                        <q-td key="actions" :props="props">
                          <q-btn flat fab-mini color="red" @click="onRemove(props.rowIndex)">
                            {{ $t("btn.remove") }}
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
            </q-card-section>
            <!-- btns -->
            <q-card-actions class="btns q-mt-xl q-py-md" align="center">
              <q-btn
                outline
                color="main-color"
                class="q-mr-sm col-2"
                size="md"
                :to="{ name: backRouteName }"
                :loading="isLoading"
              >
                {{ $t("btn.cancel") }}
              </q-btn>
              <q-btn color="main-color" class="col-2" size="md" type="submit" :loading="isLoading">{{
                $t("btn.save")
              }}</q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch, reactive } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { useSiteStore } from "@/stores/siteStore"
  import { CMS_TYPE, LANGUAGE_TYPE, CMS_ARRANGEMENT } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"
  import { useLanguage } from "src/composables/useLanguage"
  import { useLanguageStore } from "src/stores/languageStore"
  import { QTableProps } from "quasar"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import type * as Response from "src/api/response.type"
  import { storeToRefs } from "pinia"

  const siteStore = useSiteStore()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { cmsIconUploadDefault, btnSort, btnTrash, btnAdd } = useImage()

  const langOption = computed(() =>
    langList.value.map((item) => ({
      label: item.label,
      value: item.label
    }))
  )

  const { langList } = storeToRefs(siteStore)
  const selectedLanguage = ref("")
  const selectedTitleLanguage = ref("")
  const loading = ref(false)
  const updateLanguage = (newLanguage: string) => {
    selectedLanguage.value = newLanguage
  }

  const updateTitleLanguage = (newLanguage: string) => {
    selectedTitleLanguage.value = newLanguage
  }

  const copyTitleLanguage = () => {
    const langObj = cmsForm.value.setting.lang
    const newValue = langObj[selectedTitleLanguage.value as keyof typeof langObj]

    Object.keys(langObj).forEach((key) => {
      if (key !== selectedTitleLanguage.value) {
        langObj[key as keyof typeof langObj] = newValue
      }
    })
  }

  const updateIntegrationAndType = () => {
    cmsForm.value.entrance.length = 0
  }

  const generalOptions = {
    min: 1,
    minimumFractionDigits: "0",
    nullValue: 0
  }

  const tableColumnList = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "sort",
        label: t("table_header.order"),
        field: "sort",
        sortable: false,
        align: "center"
      },
      {
        name: "lang",
        label: t("table_header.product_name"),
        field: "lang",
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

    return columns
  })

  async function handleSortInput(row: Response.CmsItem) {
    cmsForm.value.entrance.sort((a: any, b: any) => Number(a.sort) - Number(b.sort))
    cmsForm.value.entrance.forEach((item: any, index) => {
      item.sort = index
    })
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })

  const dialogData = reactive<{
    remove: {
      id: number
    }
  }>({
    remove: { id: 0 }
  })
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading,
    closeDialog: closeRemove
  } = useDialog()

  function onRemove(index: number) {
    dialogData.remove.id = index
    openRemoveDialog(index)
  }
  async function handleRemove() {
    openRemoveLoading()

    cmsForm.value.entrance.splice(dialogData.remove.id, 1)

    closeRemoveLoading()
    closeRemove()
  }
  const {
    isLoading,
    cmsForm,
    initCmsForm,
    addCmsFormEntrance,
    handleGetCmsDetail,
    handleAddCmsItem,
    handleEditCmsItem,
    handleEntranceTypeList,
    handleIntegrationList,
    handleAgentGameTypeList,
    handleProductList,
    productEntranceTypeList,
    productIntegrationList,
    productGameTypeList,
    productGameList,
    optionsSort
  } = useCms()
  const cmsId = computed(() => Number(route.params.id) || 0)
  const backRouteName = "CmsGameTypeList"
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })

  const handleSubmit = () => {
    if (!cmsForm.value.entrance.length) {
      $q.notify({
        type: "negative",
        message: t("error_msg.entrance_required"),
        position: "top",
        timeout: 1000
      })
      return
    }
    cmsForm.value.title = cmsForm.value.setting.lang["en"] ?? Object.values(cmsForm.value.setting.lang)[0]

    if (isEditMode.value) {
      handleEditCmsItem(backRouteName)
      return
    }
    handleAddCmsItem(backRouteName)
  }

  onMounted(async () => {
    await handleEntranceTypeList()
    await handleIntegrationList()
    await handleAgentGameTypeList()
    if (isEditMode.value && cmsId.value) {
      await handleGetCmsDetail(cmsId.value, CMS_TYPE.Enums.CATEGORYMANAGEMENT)
    } else {
      initCmsForm(CMS_TYPE.Enums.CATEGORYMANAGEMENT)
    }

    selectedLanguage.value = langOption.value[0].value
    selectedTitleLanguage.value = langOption.value[0].value
  })

  function getDynamicLangValue(data: Response.MemberLevelLangTitle): string {
    if (!data || typeof data !== "object") {
      console.error("Invalid data format:", data) // Log error
      return ""
    }
    const nowLang = selectedLanguage.value as LANGUAGE_TYPE.Enums
    if (nowLang in data && data[nowLang] !== "") {
      return String(data[nowLang])
    } else {
      for (const key in data) {
        return String(data[key as LANGUAGE_TYPE.Enums])
      }
    }
    return ""
  }

  function addEntrance() {
    if (
      cmsForm.value.setting.product_entrance_type !== "" &&
      cmsForm.value.setting.product_integration_id !== "" &&
      cmsForm.value.setting.product_type !== "" &&
      cmsForm.value.setting.product_code !== ""
    ) {
      addCmsFormEntrance()
    }
  }
  watch(
    [
      () => cmsForm.value.setting.product_entrance_type,
      () => cmsForm.value.setting.product_integration_id,
      () => cmsForm.value.setting.product_type
    ],
    ([entranceType, integrationId, productType], [oldEntranceType, oldIntegrationId, oldProductType]) => {
      if (entranceType !== "" && integrationId !== "" && productType !== "") {
        cmsForm.value.setting.product_code = ""
        handleProductList()
      }
    }
  )
  watch(
    () => cmsForm.value.setting.product_code,
    (value) => {
      /*if (
        cmsForm.value.setting.product_entrance_type !== 0 &&
        cmsForm.value.setting.product_integration_id !== 0 &&
        cmsForm.value.setting.product_type !== 0
      ) {
      }*/
    }
  )
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";
</style>
