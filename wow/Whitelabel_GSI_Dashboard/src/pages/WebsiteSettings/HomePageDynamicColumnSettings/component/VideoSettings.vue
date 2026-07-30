<template>
  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <q-card-section class="q-pb-none">
      <div class="text-h5 text-grey-8 text-bold row">
        {{ $t("table_header.video_settings") }}
        <q-space />
      </div>
    </q-card-section>
  </div>
  <div class="q-pa-md">
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :columns="tableColumn"
      :rows="tableData"
      row-key="id"
      class="q-mt-md"
    >
      <template #body="props">
        <q-tr>
          <q-td key="floating_chart" class="image-preview_expanded_row">
            <div class="row" v-for="item in languageArray" :key="item">
              <span class="uploader-language-code">{{ item }}</span>
              <PreviewImage
                :parentImage="props.row.bannerImg.EN"
                :defaultImage="websiteHomeBannerDefault('../assets/images/common/website-video-setting-default.webp')"
                :aspectRatio="'50/225'"
                disabled
                :detail="imageDetail"
              />
            </div>
          </q-td>
          <q-td key="actions">
            <q-btn color="green" :label="$t('btn.save')" @click="onSave" />
          </q-td>
        </q-tr>
      </template>

      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from "vue"
  import { QTableProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"

  import PreviewImage from "@/components/forms/PreviewImage.vue"

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
    bannerImg: TypeBannerImg
  }
  const newBannerForm = ref<TypeBannerForm>({
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
  })
  const imageDetail = ref({
    tipOneSize: "50×225 px ",
    tipTwoSize: "500KB內"
  })
  const route = useRoute()
  const { websiteHomeBannerDefault, bannerHomeDesktop, bannerHomeMobile, bannerProductLobby, bannerGameLobby } =
    useImage()
  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "floating_chart",
      label: t("table_header.floating_chart"),
      field: "floating_chart",
      sortable: false,
      align: "left"
    },
    {
      name: "actions",
      label: t("table_header.actions"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  const tableData = ref([
    {
      id: 1,
      title: "Home Banner 1",
      original_title: "Home Banner 1",
      date: { from: "2024/01/01", to: "2024/02/29" },
      original_date: { from: "2024/01/01", to: "2024/02/29" },
      launched: true,
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

  const languageArray: TypeBannerImgKeys[] = ["EN", "CN", "TW", "VN", "IN", "TH"]
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
    console.log(newBannerForm.value)
    newBannerForm.value.original_title = newBannerForm.value.title
    newBannerForm.value.original_date = newBannerForm.value.date
    const newId = Math.max(...tableData.value.map((e) => e.id)) + 1
    newBannerForm.value.id = newId
    tableData.value.push({ ...newBannerForm.value })
    $q.notify({
      type: "positive",
      message: t("message.success"),
      position: "top",
      timeout: 300
    })
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

  onMounted(() => {
    console.log("call api")
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  ::v-deep(.uploader-language-code) {
    margin: auto 10px;
  }
  ::v-deep(.image-preview_expanded_row) {
    margin-top: 10px;
  }

  ::v-deep(.image-preview_expanded_row) {
    display: flex !important;
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
    height: 260px;
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
    max-width: 270px;
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
  .q-table tbody .q-tr {
    .image-preview_expanded_row:before {
      background: none !important;
    }
  }
</style>
