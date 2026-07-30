<template>
  <div class="q-pa-md">
    <h3 class="text-subtitle1 text-weight-bold q-mb-none">{{ $t("cms.main_floating_icon") }}</h3>
    <q-card-section class="row items-center q-gutter-md">
      <!-- icon -->
      <div v-for="item in iconForm.icon_lang" :key="item.language">
        <span>{{ item.language }}</span>
        <div class="items-end" style="width: 16.875rem">
          <div>
            <PreviewImage
              :parentImage="item.storage_key"
              :defaultImage="cmsIconUploadDefault()"
              :aspectRatio="'64/64'"
              :maxWidth="'64px'"
              @update:modelValue="updateIconUrl($event, item.language)"
              @update:img-file="updateIconUrlFile($event, item.language)"
              imageToBase64
              :maxFileSize="20480"
            />
            <div class="mks" v-if="isLoading"></div>
          </div>

          <div>
            <p class="q-mb-none q-mt-sm">
              {{ $t("edit_form.image_dimensions", { width: "195", height: "195", unit: $t("edit_form.px") }) }}
            </p>
            <p class="q-mb-none">{{ $t("edit_form.image_file_size", { limit: "20KB" }) }}</p>
          </div>
        </div>
      </div>
    </q-card-section>
    <div class="row q-mb-md justify-start">
      <q-btn class="btns btn-blue" color="main-color" :to="{ name: 'CmsFloatingIconAdd' }" v-if="permission.edit">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <div class="table-container">
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="cmsList"
        :columns="tableColumn"
        row-key="id"
        table-header-class="bg-success"
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
                @blur="handleSortInput(props.row)"
                placeholder=""
                :disable="isLoading || !permission.edit"
              />
            </q-td>
            <!-- 標題 -->
            <q-td key="title" :props="props">
              {{ props.row.title }}
            </q-td>
            <!-- 登入前/後 -->
            <q-td key="displayLogin" :props="props">
              {{ $t(CMS_DISPLAY_LOGIN.I18nKeys[props.row.display_login as CMS_DISPLAY_LOGIN.Enums]) }}
            </q-td>
            <!-- icon -->
            <q-td key="icon" :props="props">
              <img
                v-if="props.row.icon_path"
                :src="formatImg({ path: props.row.icon_path, updatedTime: props.row.updated_time })"
                alt=""
                class="icon-img"
              />
              <img v-else :src="cmsIconDefault()" alt="" class="icon-img" />
            </q-td>

            <!-- 啟停用 -->
            <q-td key="enabled" :props="props">
              <q-toggle
                v-model="props.row.enabled"
                color="green"
                :false-value="false"
                :true-value="true"
                keep-color
                @click="updateStatus(props.row)"
                :disable="isLoading || !permission.edit"
              />
            </q-td>
            <!-- 功能 -->
            <q-td key="actions" :props="props">
              <q-btn flat fab-mini color="blue" :to="{ name: 'CmsFloatingIconEdit', params: { id: props.row.id } }">
                {{ $t("btn.edit") }}
              </q-btn>
              <q-btn flat fab-mini color="red" @click="onRemove(props.row)">
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
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, computed, ref } from "vue"
  import { useCms } from "src/composables/useCms"
  import { useImage } from "src/hook/useImage"
  import { QTableProps } from "quasar"
  import { CMS_TYPE, CMS_DISPLAY_LOGIN, LANGUAGE_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { usePermission } from "@/hook/usePermission"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useLanguage } from "src/composables/useLanguage"
  import { useS3Upload } from "src/composables/useS3Upload"
  import { useSiteStore } from "src/stores/siteStore"
  import { useFileStore } from "src/stores/fileStore"
  import { useEnv } from "src/hook/useEnv"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "src/hook/useCommon"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { getFloaticon, updateFloaticon } from "src/api/cms"

  const { t } = useI18n()

  const { cmsIconUploadDefault, cmsIconDefault } = useImage()

  const {
    isLoading,
    optionsSort,
    cmsList,
    tableColumn,
    handleGetCmsList,
    handleCmsItemSort,
    handleCmsItemStatus,
    formatImg,
    handleDelCmsList
  } = useCms()

  const { permission } = usePermission()
  const { envData, removePrefixDeep } = useEnv()
  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)
  const { S3_STORAGE_CATEGORY, uploadSingleFile } = useS3Upload()
  const fileStore = useFileStore()
  const { setFile, getFile, removeFile, clearFiles } = fileStore
  const { getLanguage } = useLanguage()
  const { isBase64Image } = useCommon()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const titleLangObj = computed(() => {
    const langObj: Response.CmsLangTitle = {}
    langList.value.forEach((e) => {
      langObj[e.label] = ""
    })
    return langObj
  })
  const icon_lang = ref()
  function handleSortInput(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemSort = {
      id: row.id,
      sort: Number(row.sort),
      title: row.title,
      type: CMS_TYPE.Enums.FLOATING_ICON
    }
    handleCmsItemSort(params)
  }

  function updateStatus(row: Response.CmsItem) {
    const params: Request.UpdateCmsItemStatus = {
      id: row.id,
      enabled: row.enabled,
      type: CMS_TYPE.Enums.FLOATING_ICON
    }
    handleCmsItemStatus(params)
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

  function onRemove(row: { id: number }) {
    dialogData.remove.id = row.id
    openRemoveDialog(row.id)
  }

  async function handleRemove() {
    openRemoveLoading()

    await handleDelCmsList({
      type: CMS_TYPE.Enums.FLOATING_ICON,
      id: dialogData.remove.id
    })
    closeRemoveLoading()
    closeRemove()
  }
  interface IconLangItem {
    language: string
    storage_key: string
    imgFileName?: string
  }

  const iconForm = ref<{
    icon_lang: IconLangItem[]
  }>({
    icon_lang: []
  })

  onMounted(async () => {
    handleGetCmsList(CMS_TYPE.Enums.FLOATING_ICON)
    const { search, status, tableData } = useSearch(getFloaticon)
    await search("main")
    if (status.value) {
      iconForm.value.icon_lang = tableData.value
      const titleLangKeys = Object.keys(titleLangObj.value)

      // 移除多餘語系
      iconForm.value.icon_lang = iconForm.value.icon_lang.filter((item) => titleLangKeys.includes(item.language))

      //補上缺少語系
      titleLangKeys.forEach((lang) => {
        const exists = iconForm.value.icon_lang.some((item) => item.language === lang)
        if (!exists) {
          iconForm.value.icon_lang.push({
            language: lang,
            storage_key: "",
            imgFileName: ""
          })
        }
      })
      Object.keys(iconForm.value.icon_lang).forEach((key: any) => {
        iconForm.value.icon_lang[key].storage_key = formatImg({
          path: iconForm.value.icon_lang[key].storage_key,
          updatedTime: Date.now()
        })
      })
    }
  })

  const updateIconUrlFile = async (file: File, language: string) => {
    const target = iconForm.value.icon_lang.find((item) => item.language === language)
    if (file && target) {
      setFile(file)
      target.imgFileName = file.name
    }
  }
  const updateIconUrl = async (value: string, language: string) => {
    const target = iconForm.value.icon_lang.find((item) => item.language === language)
    if (target) {
      target.storage_key = value

      if (target.imgFileName) {
        const file = getFile(target.imgFileName)
        if (file) {
          isLoading.value = true
          const { status, data, msg } = await uploadSingleFile({
            file,
            storage_category: S3_STORAGE_CATEGORY.Enums.cms
          })

          // 上傳成功才有s3圖片
          if (status && data) {
            target.storage_key = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${data.objectKey}`
            updeteIcon()
          } else {
            //target.storage_key = value
          }
          delete target.imgFileName
        }
      }
    }
  }

  const updeteIcon = async () => {
    const { search, status } = useSearch(updateFloaticon)
    let Prefix = removePrefixDeep(iconForm.value.icon_lang, `${VITE_APP_DYNAMIC_RESOURCE_URL}/`)
    const payload = {
      icons: Object.values(Prefix)
    }

    await search(payload)
    if (status.value) {
      isLoading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";

  .mks {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .icon-img {
    margin: 0 auto;
  }
</style>
