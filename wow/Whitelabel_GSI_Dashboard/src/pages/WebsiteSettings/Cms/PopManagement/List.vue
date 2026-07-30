<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <div class="msk" v-if="!permission.edit"></div>
      <q-form class="form-container" @submit="setSettings">
        <q-card class="q-pa-md bg-transparent" flat>
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("query_params.stop_or_enable") }}</div>
            <div class="q-mt-xs link-container">
              <div class="row items-center q-gutter-md">
                <div class="enable">
                  <q-toggle
                    v-model="form.age_confirmation"
                    :color="form.age_confirmation ? 'positive' : 'negative'"
                    :false-value="0"
                    :true-value="1"
                    stack-label
                    size="lg"
                    :label="form.age_confirmation ? $t('common.enable') : $t('common.disable')"
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none q-mt-xl">
            <div>{{ $t("cms.popWindowTitle") }}</div>
            <div class="q-mt-xs">
              <div class="row items-center q-gutter-md">
                <q-table
                  square
                  hide-pagination
                  :rows-per-page-options="[0]"
                  :rows="[cmsForm.setting.lang]"
                  :columns="tableColumnTitle"
                  row-key="id"
                  table-header-class="bg-success"
                  style="width: 100%"
                >
                  <template #body="props">
                    <q-tr>
                      <!-- 標題 -->
                      <q-td key="title" :props="props">
                        <div v-html="truncatedHtmlContent(cmsForm.setting.lang)" class="centered-content"></div>
                      </q-td>

                      <!-- 功能 -->
                      <q-td key="actions" :props="props">
                        <q-btn
                          flat
                          fab-mini
                          color="blue"
                          :to="{ name: 'CmsPopEdit', params: { mode: 'title', id: cmsForm.id } }"
                        >
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
          </q-card-section>

          <q-card-section class="q-pa-none q-mt-xl">
            <div>{{ $t("cms.popImgUpload") }}</div>
            <div class="q-mt-xs link-container">
              <div class="row items-center q-gutter-md">
                <div>
                  <PreviewImage
                    :parentImage="cmsForm.setting.pop_up_img[0]"
                    :defaultImage="addKycDefault()"
                    :aspectRatio="'214/120'"
                    :maxWidth="'214px'"
                    @update:modelValue="updateIconUrl($event, 0)"
                    imageToBase64
                    :maxFileSize="1048576"
                  />

                  <div class="col q-mr-md q-pt-md text-left">
                    <div class="img_tool">
                      <div class="left-btn">
                        <p class="q-mb-none">{{ $t("edit_form.image_file_size", { limit: "1MB" }) }}</p>
                      </div>
                      <div class="right-btn">
                        <q-btn outline color="deep-orange" @click="removePic(0)">
                          {{ $t("btn.remove") }}
                          <q-icon class="q-ml-xs" size="xs" name="delete_outline" />
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <PreviewImage
                    :parentImage="cmsForm.setting.pop_up_img[1]"
                    :defaultImage="addKycDefault()"
                    :aspectRatio="'214/120'"
                    :maxWidth="'214px'"
                    @update:modelValue="updateIconUrl($event, 1)"
                    imageToBase64
                    :maxFileSize="1048576"
                  />
                  <div class="col q-mr-md q-pt-md text-left">
                    <div class="img_tool">
                      <div class="left-btn">
                        <p class="q-mb-none">{{ $t("edit_form.image_file_size", { limit: "1MB" }) }}</p>
                      </div>
                      <div class="right-btn">
                        <q-btn outline color="deep-orange" @click="removePic(1)">
                          {{ $t("btn.remove") }}
                          <q-icon class="q-ml-xs" size="xs" name="delete_outline" />
                        </q-btn>
                      </div>
                    </div>
                  </div>
                  <!--end-->
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none q-mt-xl" v-if="!isLoading">
            <div class="q-mt-xs">
              <div class="row items-center q-gutter-md">
                <div>
                  <div class="row items-center">
                    {{ $t("cms.playerAgreesButton") }}
                    <AiLanguage class="ml-4" @applyLanguage="applyAgreeLanguage" />
                  </div>
                  <q-tabs
                    v-model="language.agreeCurrent"
                    dense
                    class="bg-transparent text-grey-8"
                    active-color="main-color"
                    content-class="languageTab"
                    outside-arrows
                  >
                    <q-tab
                      v-for="(lang, key) in language.list"
                      :key="key"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                      content-class="languageTabItem"
                    />
                  </q-tabs>

                  <q-tab-panels v-model="language.agreeCurrent" animated swipeable>
                    <q-tab-panel
                      v-for="(lang, key) in language.list"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                    >
                      <div class="text-h6">
                        <q-input
                          v-model.trim="cmsForm.setting.comfirm_button_lang[lang.label]"
                          outlined
                          dense
                          hide-bottom-space
                          outline
                          borderless
                          :placeholder="$t('common.please_enter_content')"
                        />
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
                <div>
                  <div class="row items-center">
                    {{ $t("cms.playerRejectButton") }}
                    <AiLanguage class="ml-4" @applyLanguage="applyRejectLanguage" />
                  </div>
                  <q-tabs
                    v-model="language.rejectCurrent"
                    dense
                    class="bg-transparent text-grey-8"
                    active-color="main-color"
                    content-class="languageTab"
                    outside-arrows
                  >
                    <q-tab
                      v-for="(lang, key) in language.list"
                      :key="key"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                      content-class="languageTabItem"
                    />
                  </q-tabs>

                  <q-tab-panels v-model="language.rejectCurrent" animated swipeable>
                    <q-tab-panel
                      v-for="(lang, key) in language.list"
                      :name="lang.label"
                      :label="lang.label"
                      class="q-px-none"
                    >
                      <div class="text-h6">
                        <q-input
                          v-model.trim="cmsForm.setting.reject_button_lang[lang.label]"
                          outlined
                          dense
                          hide-bottom-space
                          outline
                          borderless
                          :placeholder="$t('common.please_enter_content')"
                        />
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none q-mt-xl">
            <div>{{ $t("cms.popContent") }}</div>
            <q-btn
              class="q-mt-md btns btn-blue"
              color="main-color"
              :to="{
                name: 'CmsPopAdd',
                params: { mode: 'entrance', id: cmsForm.id }
              }"
              v-if="permission.edit"
            >
              <q-icon class="q-mr-xs" size="xs" name="add" />
              {{ $t("btn.add") }}
            </q-btn>
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
                        <q-btn outline color="gray" :disable="true" v-if="props.rowIndex === 0">
                          {{ $t("cms.batchCheck") }}
                        </q-btn>
                        <q-number
                          v-else
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
                      <q-td key="title" :props="props">
                        <div v-html="truncatedHtmlContent(props.row.lang)" class="centered-content"></div>
                      </q-td>

                      <!-- 功能 -->
                      <q-td key="actions" :props="props">
                        <q-btn
                          flat
                          fab-mini
                          color="blue"
                          :to="{
                            name: 'CmsPopEdit',
                            params: { mode: 'entrance', id: cmsForm.id },
                            query: {
                              index: props.rowIndex
                            }
                          }"
                        >
                          {{ $t("btn.edit") }}
                        </q-btn>
                        <q-btn flat fab-mini color="red" @click="onRemove(props.rowIndex)" v-if="props.rowIndex !== 0">
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

          <q-card-section class="q-pa-none q-mt-xl row justify-end">
            <q-btn color="primary" class="submit-btn" type="submit" :loading="isLoading">{{ $t("btn.save") }}</q-btn>
          </q-card-section>
        </q-card>
      </q-form>
    </template>
  </q-splitter>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCommon } from "src/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "src/stores/siteStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import { getSettings, putSettings } from "src/api/common"
  import { useCms } from "src/composables/useCms"
  import { CMS_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { QTableProps } from "quasar"
  import { usePermission } from "@/hook/usePermission"
  import { useImage } from "src/hook/useImage"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { addCmsItem, editCmsItem } from "src/api/cms"
  import { clone } from "ramda"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useEnv } from "src/hook/useEnv"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const $q = useQuasar()
  const { t } = useI18n()

  const siteStore = useSiteStore()
  const languageStore = useLanguageStore()

  const { stringEnumToArray, numberEnumToArray } = useCommon()
  const { addKycDefault } = useImage()
  const {
    initCmsForm,
    cmsForm,
    cmsList,
    titleLangObj,
    handleGetCmsList,
    handleGetCmsDetail,
    optionsSort,
    handleEditCmsItem
  } = useCms()
  const isAdd = ref(false)
  const { permission } = usePermission()
  const isLoading = ref(false)
  const splitterModel = ref(100)
  const { envData, removePrefixDeep } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })
  const language = reactive({
    list: languageList,
    agreeCurrent: languageList.value[0].label,
    rejectCurrent: languageList.value[0].label
  })

  interface cmsPupController {
    age_confirmation: number
  }
  const form = reactive<cmsPupController>({
    // require_withdrawal_password: WITHDRAWAL_PASSWORD.Enums.Require,
    age_confirmation: 0
  })
  /*
  watch(
    () => cmsForm.value.setting.comfirm_button_lang,
    (newLang) => {
      alert(newLang)
      language.agreeCurrent = Object.keys(newLang)[0]
    },
    { deep: true }
  )*/

  const updateIconUrl = (value: string, index: number) => {
    cmsForm.value.setting.pop_up_img[index] = value
  }
  const removePic = (index: number) => {
    cmsForm.value.setting.pop_up_img[index] = ""
  }

  async function handleSortInput(row: Response.CmsItem) {
    cmsForm.value.entrance.sort((a, b) => Number(a.sort) - Number(b.sort)) // 將 sort 轉為數字進行排序
    cmsForm.value.entrance.forEach((item, index) => {
      item.sort = index
    })
    const { search, status } = useSearch(editCmsItem)
    await search(cmsForm.value)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  async function setSettings() {
    cmsForm.value.setting.pop_up_img = cmsForm.value.setting.pop_up_img.filter((item) => item !== "")
    cmsForm.value.setting.product_entrance_type = 0
    cmsForm.value.setting.product_integration_id = 0
    /*let payload = removePrefixDeep(cmsForm.value, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
    payload = removePrefixDeep(payload, `${VITE_APP_BASE_API}/`)*/

    await Promise.all([putSettings(form), editCmsItem(cmsForm.value)])
      .then(([webSiteRes, cmsRes]) => {
        if (webSiteRes.code === 0 && cmsRes.code === 0) {
          $q.notify({
            type: "positive",
            message: t("message.edit_success"),
            position: "top",
            timeout: 300
          })
          setTimeout(() => {
            location.reload()
          }, 1000)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  onMounted(async () => {
    const { search, tableData, status } = useSearch(getSettings)
    isLoading.value = true
    await search()
    isLoading.value = false

    if (status) {
      const result = tableData.value as Response.GetSettings
      form.age_confirmation = result.age_confirmation
    }
    await handleGetCmsList(CMS_TYPE.Enums.POPMANAGEMENT)
    if (cmsList.value.length > 0) {
      isLoading.value = true
      await handleGetCmsDetail(cmsList.value[0].id)
      isLoading.value = false

      cmsForm.value.entrance.forEach((item, index) => {
        item.sort = index
      })
    } else {
      isAdd.value = true
      initCmsForm(CMS_TYPE.Enums.POPMANAGEMENT)
      const { search, status, message } = useSearch(addCmsItem)
      isLoading.value = true
      cmsForm.value.title = "POPMANAGEMENT"
      cmsForm.value.entrance = [
        {
          type: CMS_TYPE.Enums.POPMANAGEMENT as number,
          payload: {},
          lang: clone(titleLangObj.value) as Request.CmsLangTitle,
          img: ""
        }
      ]
      cmsForm.value.setting.product_entrance_type = 0
      cmsForm.value.setting.product_integration_id = 0
      await search(cmsForm.value)
      if (!status.value) {
        $q.notify({
          type: "positive",
          message: message.value,
          position: "top",
          timeout: 300
        })
        setTimeout(() => {
          history.go(0)
        }, 1000)
      } else {
        location.reload()
        isLoading.value = false
      }
    }
    language.agreeCurrent = languageList.value[0].label
  })

  const tableColumnTitle = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "title",
        label: t("table_header.title"),
        field: "title",
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
        name: "title",
        label: t("table_header.title"),
        field: "title",
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

  function truncatedHtmlContent(data: any, maxLength = 30) {
    if (data === null || data === "") {
      return ""
    }
    const currentLang = languageStore.currentLanguage
    let langValue = data[currentLang.toLowerCase()]

    if (langValue === undefined) {
      const firstLangKey = Object.keys(data)[0]
      langValue = data[firstLangKey.toLowerCase()]
    }

    //return langValue.content || ""
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = langValue || ""

    let truncatedContent = ""
    let length = 0

    function traverseNodes(node: any) {
      if (length >= maxLength) {
        return
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const remainingLength = maxLength - length
        truncatedContent += node.textContent.substring(0, remainingLength)
        length += node.textContent.length
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase()
        truncatedContent += `<${tagName}`

        for (let attr of node.attributes) {
          truncatedContent += ` ${attr.name}="${attr.value}"`
        }
        truncatedContent += ">"

        for (let child of node.childNodes) {
          traverseNodes(child)
          if (length >= maxLength) {
            break
          }
        }

        truncatedContent += `</${tagName}>`
      }
    }

    for (let child of tempDiv.childNodes as any) {
      traverseNodes(child)
      if (length >= maxLength) {
        break
      }
    }

    // Add ellipsis if content is truncated
    if (length > maxLength) {
      truncatedContent += "..."
    }
    return truncatedContent
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
    const { search, status } = useSearch(editCmsItem)
    await search(cmsForm.value)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
    closeRemoveLoading()
    closeRemove()
  }

  const applyAgreeLanguage = async () => {
    const firstItemData = cmsForm.value.setting.comfirm_button_lang[language.agreeCurrent as LANGUAGE_TYPE.Enums]
    if (!firstItemData) {
      $q.notify({
        type: "negative",
        message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
        position: "top",
        timeout: 300
      })
      return
    }
    try {
      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          cmsForm.value.setting.comfirm_button_lang[item as LANGUAGE_TYPE.Enums] = data[0].translations[item]
        })

        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("applyAgreeLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }

  const applyRejectLanguage = async () => {
    const firstItemData = cmsForm.value.setting.reject_button_lang[language.rejectCurrent as LANGUAGE_TYPE.Enums]
    if (!firstItemData) {
      $q.notify({
        type: "negative",
        message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
        position: "top",
        timeout: 300
      })
    }
    try {
      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        Object.keys(data[0].translations).forEach((item) => {
          cmsForm.value.setting.reject_button_lang[item as LANGUAGE_TYPE.Enums] = data[0].translations[item]
        })
      }
      $q.notify({
        type: "positive",
        message: t("message.ai_translation_completed"),
        position: "top",
        timeout: 300
      })
    } catch (error) {
      console.error("applyRejectLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  .form-container {
    max-width: 100%;
    .select-open-lobby {
      width: 14.125rem;
      height: 2.25rem;
      :deep(.q-field__control) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
        :deep(.q-field__native) {
          min-height: 2.25rem;
          height: 2.25rem;
        }
      }
      :deep(.q-field__append) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
      }
    }
    .input-url {
      width: 35.625rem;
      height: 2.25rem;
      :deep(.q-field__before) {
        width: 4.5625rem;
      }
      :deep(.q-field__control) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
        :deep(.q-field__native) {
          min-height: 2.25rem;
          height: 2.25rem;
        }
      }
      :deep(.q-field__append) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
      }
      :deep(.q-field__bottom) {
        bottom: -1rem;
      }
    }
    .enable {
      width: fit-content;
      height: fit-content;
      border: 1px solid #c2c2ca;
      border-radius: 6px;
      padding-right: 60px;
      :deep(.q-toggle) {
        width: 100px;
      }
    }
    .link-container {
      width: 43.75rem;
      border-radius: 0.5rem;
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      .link-row {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #040207e0;
      }
    }

    .submit-btn {
      width: 12rem;
      height: 2.875rem;
      font-size: 1rem;
      border-radius: 6px;
    }
  }
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
  .img_tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 12px;
    }
  }
  .left-btn,
  .right-btn {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  :deep(.q-tab-panels) {
    background: transparent;
  }
  :deep(.q-tabs--dense .q-tab) {
    padding-left: 10px;
    padding-right: 10px;
  }
  ::v-deep(.q-td) {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    p {
      margin: 0;
    }
  }
  .centered-content {
    display: flex;
    vertical-align: middle;
    justify-content: center;
  }
</style>
