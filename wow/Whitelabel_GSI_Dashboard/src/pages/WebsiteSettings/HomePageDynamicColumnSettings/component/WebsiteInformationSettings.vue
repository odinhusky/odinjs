<template>
  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <q-card-section class="q-pb-none">
      <div class="text-h5 text-grey-8 text-bold row">
        {{ $t("table_header.website_information_settings") }}
        <q-space />
      </div>
    </q-card-section>
  </div>
  <div class="q-pa-md">
    <div class="row justify-start q-mb-md">
      <q-btn class="btns btn-blue" color="main-color" @click="onAction" v-if="permission.edit">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <div class="table-container">
      <q-markup-table square>
      <thead class="bg-success">
        <tr>
          <th v-for="item in tableColumn">{{ item.label }}</th>
        </tr>
      </thead>
      <!-- disabled => 讓整行不能拉取 -->
      <VueDraggableNext class="drag-container" :list="tableData" tag="tbody" :disabled="disabledDrag" @end="onDragEnd">
        <tr v-if="showNewBanner">
          <td key="id" />
          <td key="title">
            <q-input v-model="addInfo.title" outlined :label="$t('common.please_enter_title')" />
          </td>
          <td key="content">
            <q-input v-model="addInfo.content" outlined :label="$t('common.please_enter_content')" />
          </td>
          <td key="website">
            <q-input v-model="addInfo.website" outlined :label="$t('common.please_enter_content')" />
          </td>
          <td key="image_preview" class="image-preview_expanded_row">
            <div v-for="items in languageArray" :key="items" class="row no-wrap">
              <span class="uploader-language-code">{{ items }}</span>
              <div @click="setBannerImgPosition(addInfo.id, items)">
                <PreviewImage
                  :parentImage="addInfo.bannerImg[items]"
                  :aspectRatio="'70/70'"
                  @update:modelValue="updateImgUrl"
                  :maxFileSize="512000"
                />
              </div>
              <div class="q-ml-sm column justify-center">
                <q-icon
                  name="restart_alt"
                  size="xs"
                  color="green"
                  class="cursor-pointer"
                  @click="removeBanner(addInfo.id, items)"
                />
                <q-icon
                  name="delete_outline"
                  size="xs"
                  color="red"
                  class="q-mt-sm cursor-pointer"
                  @click="removeBanner(addInfo.id, items)"
                />
              </div>
            </div>
          </td>
          <td key="actions">
            <q-btn color="green" class="q-mr-xs" @click="onSave">{{ $t("btn.save") }}</q-btn>
          </td>
        </tr>
        <tr v-for="item in tableData">
          <td>
            {{ item.id }}
            <!-- 事件判斷drag status -->
            <q-icon
              name="menu"
              class="drag-icon"
              @mouseenter="disabledDrag = false"
              @mouseleave="disabledDrag = true"
              @touchstart="disabledDrag = false"
              @touchend="disabledDrag = true"
            />
          </td>
          <td>
            <q-input v-model="item.title" outlined :label="$t('common.please_enter_title')" readonly />
          </td>
          <td key="content">
            <q-input v-model="item.content" outlined :label="$t('common.please_enter_content')" readonly />
          </td>
          <td key="website">
            <q-input v-model="item.website" outlined :label="$t('common.please_enter_content')" readonly />
          </td>
          <td key="image_preview" class="image-preview_expanded_row">
            <div class="row no-wrap">
              <span class="uploader-language-code">EN</span>
              <PreviewImage :parentImage="item.bannerImg.EN" :aspectRatio="'70/70'" disabled />
            </div>
          </td>
          <td key="actions" v-if="permission.edit">
            <q-btn color="red" :label="$t('common.delete')" @click="onDelete(item.id)" />
          </td>
        </tr>
      </VueDraggableNext>
      </q-markup-table>
    </div>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_banner") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from "vue"
  import { QTableProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useDialog } from "@/hook/useDialog"
  import { VueDraggableNext } from "vue-draggable-next"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useSiteStore } from "@/stores/siteStore"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const siteStore = useSiteStore()

  const { t } = useI18n()

  const showNewBanner = ref(false)
  type TypeDate = {
    from: string
    to: string
  }
  type TypeBannerImg = {
    EN: string
    CN: string
    TW: string
    VN: string
    IN: string
    TH: string
  }
  type TypeBannerImgKeys = keyof TypeBannerImg
  type TypeBannerForm = {
    id: number
    title: string
    original_title: string
    date: TypeDate
    original_date: TypeDate
    launched: boolean
    content: string
    website: string
    bannerImg: TypeBannerImg
  }
  const newBannerForm = ref<TypeBannerForm>({
    id: 0,
    title: "",
    original_title: "",
    date: { from: "", to: "" },
    original_date: { from: "", to: "" },
    launched: false,
    content: "",
    website: "",
    bannerImg: {
      EN: "",
      CN: "",
      TW: "",
      VN: "",
      IN: "",
      TH: ""
    }
  })

  const route = useRoute()
  const { websiteHomeBannerDefault, bannerHomeDesktop, bannerHomeMobile, bannerProductLobby, bannerGameLobby } =
    useImage()
  const bannerImg = computed(() => {
    let imgUrl = ""
    switch (route.name) {
      case "Home":
        imgUrl = bannerHomeDesktop()
        break
      case "MobileHome":
        imgUrl = bannerHomeMobile()
        break
      case "ProductLobby":
        imgUrl = bannerProductLobby()
        break
      case "GameLobby":
        imgUrl = bannerGameLobby()
        break
      default:
        imgUrl = bannerHomeDesktop()
        break
    }
    return imgUrl
  })
  const disabledDrag = ref(true)

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      { name: "id", label: t("table_header.sequence"), field: "id", sortable: false, align: "left" },
      { name: "title", label: t("table_header.title"), field: "title", sortable: false, align: "center" },
      { name: "content", label: t("table_header.content"), field: "content", sortable: false, align: "center" },
      { name: "website", label: t("table_header.website"), field: "website", sortable: false, align: "center" },
      {
        name: "image_preview",
        label: t("table_header.picture_preview"),
        field: "image_preview",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限  actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const tableData = ref([
    {
      id: 1,
      title: "Home Banner 1",
      original_title: "Home Banner 1",
      date: { from: "2024/01/01", to: "2024/02/29" },
      original_date: { from: "2024/01/01", to: "2024/02/29" },
      launched: true,
      content: "",
      website: "",
      bannerImg: {
        EN: "",
        CN: "",
        TW: "",
        VN: "",
        IN: "",
        TH: ""
      }
    },
    {
      id: 2,
      title: "Home Banner 2",
      original_title: "Home Banner 2",
      date: { from: "2024/02/01", to: "2024/02/29" },
      original_date: { from: "2024/02/01", to: "2024/02/29" },
      launched: true,
      content: "",
      website: "",
      bannerImg: {
        EN: "",
        CN: "",
        TW: "",
        VN: "",
        IN: "",
        TH: ""
      }
    },
    {
      id: 3,
      title: "Home Banner 3",
      original_title: "Home Banner 3",
      date: { from: "2024/03/01", to: "2024/03/31" },
      original_date: { from: "2024/03/01", to: "2024/03/31" },
      launched: false,
      content: "",
      website: "",
      bannerImg: {
        EN: "",
        CN: "",
        TW: "",
        VN: "",
        IN: "",
        TH: ""
      }
    }
  ])
  const addInfo = ref({
    id: 0,
    title: "",
    original_title: "",
    date: { from: "", to: "" },
    original_date: { from: "", to: "" },
    launched: false,
    content: "",
    website: "",
    bannerImg: {
      EN: "",
      CN: "",
      TW: "",
      VN: "",
      IN: "",
      TH: ""
    }
  })
  const languageArray = computed(() => siteStore.langList.map((lang) => lang.label))
  const bannerUploadId = ref(0)
  const bannerUploadLnaguage = ref<TypeBannerImgKeys>("EN")
  const newBannerUploadLnaguage = ref<TypeBannerImgKeys>("EN")
  // 上傳圖片
  const setBannerImgPosition = (id: number, language: TypeBannerImgKeys) => {
    bannerUploadId.value = id
    bannerUploadLnaguage.value = language
  }
  const updateImgUrl = (value: string) => {
    const filterTableData = tableData.value.filter((e) => e.id === bannerUploadId.value)
    if (filterTableData.length > 0) {
      filterTableData[0].bannerImg[bannerUploadLnaguage.value] = value
    }
  }
  const removeBanner = (id: number, language: TypeBannerImgKeys) => {
    const filterTableData = tableData.value.filter((e) => e.id === id)
    if (filterTableData.length > 0) {
      filterTableData[0].bannerImg[language] = ""
    }
  }

  const setNewBannerImgPosition = (language: TypeBannerImgKeys) => {
    newBannerUploadLnaguage.value = language
  }
  const updateNewBannerImgUrl = (value: string) => {
    newBannerForm.value.bannerImg[newBannerUploadLnaguage.value] = value
  }
  const $q = useQuasar()
  const onSave = () => {
    newBannerForm.value.title = addInfo.value.title
    newBannerForm.value.content = addInfo.value.content
    newBannerForm.value.website = addInfo.value.website
    const newId = Math.max(...tableData.value.map((e) => e.id)) + 1
    newBannerForm.value.id = newId
    tableData.value.push({ ...newBannerForm.value })
    $q.notify({
      type: "positive",
      message: t("message.success"),
      position: "top",
      timeout: 300
    })
    showNewBanner.value = !showNewBanner.value
  }

  const onAction = () => {
    showNewBanner.value = true
  }

  const onCancel = () => {
    newBannerForm.value = {
      id: 0,
      title: "",
      original_title: "",
      date: { from: "", to: "" },
      original_date: { from: "", to: "" },
      launched: false,
      bannerImg: {
        EN: "",
        CN: "",
        TW: "",
        VN: "",
        IN: "",
        TH: ""
      }
    }
    showNewBanner.value = false
  }

  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    delete: {
      dialogLabelI18nKey: "common.delete",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDelete
    }
  })
  const dialogDataId = ref(0)
  function onDelete(id: number) {
    dialogDataId.value = id
    openDeleteDialog()
  }
  async function handleDelete() {
    openDeleteLoading()
    // call api
    tableData.value = tableData.value.filter((e) => e.id !== dialogDataId.value)
    $q.notify({
      type: "positive",
      message: t("message.delete_success"),
      position: "top",
      timeout: 300
    })
    closeDeleteLoading()
  }

  onMounted(() => {
    console.log("call api !!!")
  })
  async function onDragEnd() {
    console.log("onDragEnd")
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  ::v-deep(.uploader-language-code) {
    margin: auto 10px;
  }

  ::v-deep(.image-preview_expanded_row > :not(:first-child)) {
    margin-top: 10px;
  }

  ::v-deep(.q-uploader__list) {
    min-height: 30px;
  }

  ::v-deep(.actions-field > :not(first-child)) {
    margin-top: 10px;
  }

  ::v-deep(.image-preview_expanded_row > .row > .uploader-language-code) {
    width: 20px;
  }

  ::v-deep(.reminder-text) {
    float: left;
    color: red;
    margin-top: 2px;
  }

  ::v-deep(.q-tr) {
    background-color: transparent !important;
  }

  .vel-modal {
    ::v-deep(.vel-img-wrapper) {
      cursor: grab !important;
      &:active {
        cursor: grabbing !important;
      }
    }
    ::v-deep(.vel-toolbar) {
      background-color: transparent;
      .toolbar-btn {
        background-color: transparent;
        .vel-icon {
          width: 40px;
          height: 40px;
        }
      }
      .toolbar-btn__resize {
        display: none;
      }
    }
    ::v-deep(.btn__close) {
      width: 33px;
      height: 33px;
      background-color: rgba($color: #fff, $alpha: 0.2);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
      .vel-icon {
        width: 18px;
        height: 18px;
      }
    }
  }
  ::v-deep(.preview-image) {
    max-width: 100px;
  }
  .btn-placement-indication {
    position: relative;
    .mock-img {
      position: absolute;
      left: 110%;
      top: 0;
      z-index: 1;
      display: none;
    }
    &:hover {
      .mock-img {
        display: block;
      }
    }
  }
  .disabled,
  [disabled] {
    opacity: 1 !important;
  }
</style>
