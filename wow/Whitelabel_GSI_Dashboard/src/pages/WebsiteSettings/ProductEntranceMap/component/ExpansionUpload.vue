<template>
  <div class="q-pa-md" style="min-height: 290px">
    <div class="row">
      <div class="btn-placement-indication">
        <q-btn outline color="main-color q-ml-sm">
          {{ $t("btn.placement_indication") }}
        </q-btn>
        <img src="~assets/images/common/product-entrance-view.webp" alt="" class="mock-img" />
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <VueDraggableNext class="drag-container" :list="tableData" tag="tbody" @end="onDragEnd">
          <q-list class="rounded-borders" v-for="item in tableData">
            <q-expansion-item group="group" expand-icon-toggle expand-separator class="main-color q-mt-md">
              <template #header>
                <div class="top_header">
                  <q-icon
                    name="menu"
                    @mouseenter="disabledDrag = false"
                    @mouseleave="disabledDrag = true"
                    @touchstart="disabledDrag = false"
                    @touchend="disabledDrag = true"
                  />
                  <span class="q-pl-lg">{{ item.title }}</span>
                </div>
              </template>
              <q-card>
                <q-card-section class="image-preview_expanded_row q-flex">
                  <div class="q-flex img_upload">
                    <div class="row" v-for="(imgitem, key) in item.imgPath" :key="imgitem">
                      <span class="uploader-language-code">{{ key }}</span>
                      <div>
                        <PreviewImage
                          :parent-image="imgitem"
                          :default-image="productEntranceMapDefault()"
                          :aspect-ratio="'50/42'"
                          :max-file-size="512000"
                          @update:modelValue="updateListImgUrl($event, item.id, key)"
                          imageToBase64
                        />
                      </div>

                      <div class="q-ml-sm column justify-center">
                        <q-icon
                          name="restart_alt"
                          size="xs"
                          color="green"
                          class="cursor-pointer"
                          @click="reLoadImg(item.id, key)"
                        />
                        <q-icon
                          name="delete_outline"
                          size="xs"
                          color="red"
                          class="q-mt-sm cursor-pointer"
                          @click="removeBanner(item.id, key)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row save" v-if="permission.edit">
                    <q-btn color="green" :label="$t('btn.save')" @click="onUpdate(item.id)" />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </VueDraggableNext>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted, nextTick, toRefs } from "vue"
  import { QTableProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useDialog } from "@/hook/useDialog"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useCommon } from "@/hook/useCommon"

  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { LANGUAGE_TYPE } from "@/utils/constants"
  import {
    addBannerSetting,
    getBannerSettingList,
    deleteBannerSettingList,
    updateBannerSetting,
    updateBannerSettingSort
  } from "@/api/webSiteSetting"
  import relativeToAbsoluteResource from "@/utils/relativeToAbsoluteResource"
  import { number } from "echarts"
  import type { TypeNewBannerForm } from "@/api/request.type"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()
  const disabledDrag = ref(true)
  async function onDragEnd() {}
  const props = defineProps({
    gameCode: {
      type: Number,
      required: true,
      default: 0
    }
  })
  const { gameCode } = toRefs(props)
  const newBannerForm = ref<{
    title: string
    images: Array<{
      lang: string
      image: string
    }>
  }>({
    title: "",
    images: [
      {
        lang: LANGUAGE_TYPE.Enums.EN,
        image: ""
      },
      {
        lang: LANGUAGE_TYPE.Enums.TH,
        image: ""
      },
      {
        lang: LANGUAGE_TYPE.Enums.ID,
        image: ""
      },
      {
        lang: LANGUAGE_TYPE.Enums.VI,
        image: ""
      },
      {
        lang: LANGUAGE_TYPE.Enums.CN,
        image: ""
      },
      {
        lang: LANGUAGE_TYPE.Enums.TW,
        image: ""
      }
    ]
  })

  /*
  const productForm = reactive<TypeForm>([
    {
      id: 1,
      gameName: "WOW Gaming",
      productImg: {
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
      gameName: "JDB Slots",
      productImg: {
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
      gameName: "NE Slots",
      productImg: {
        EN: "",
        CN: "",
        TW: "",
        VN: "",
        IN: "",
        TH: ""
      }
    }
  ])*/

  const { productEntranceMapDefault } = useImage()

  const $q = useQuasar()
  const onSave = () => {
    $q.notify({
      type: "positive",
      message: t("message.success"),
      position: "top",
      timeout: 300
    })
  }
  type BannerSetting = {
    id: number
    sorts: number
    title: string
    start_date: string
    end_date: string
    enabled: boolean
    position: number
    game_type: number
    product_code: number
    image_json: Record<string, string>
    imgPath: Record<string, string>
    created_at: string
    created_by: number
    updated_at: string
    updated_by: number
    edit: boolean
    expand: boolean
  }

  type BannerSettingList = BannerSetting[]
  const tableData = ref<BannerSettingList>([])
  const cloneTableData = ref<BannerSettingList>([])

  const updateImgUrl = (value: string, item: { lang: string; image: string }) => {
    item.image = value
  }

  const removeBanner = (id: number, language: string) => {
    const row = tableData.value.find((row) => row.id === id)
    if (row) {
      row.imgPath[language] = ""
    }
  }

  const reLoadImg = (id: number, language: string) => {}

  const updateListImgUrl = (value: string, id: number, language: string) => {
    const row = tableData.value.find((row) => row.id === id)
    if (row) {
      row.imgPath[language] = value
    }
  }

  onMounted(() => {
    getBannerList()
  })
  const getBannerList = async () => {
    let sendData = { position: 1, game_type: gameCode.value }

    const { code, msg, data } = await getBannerSettingList(sendData)
    if (code !== 0) {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      return
    } else {
      tableData.value.length = 0
      cloneTableData.value.length = 0
      if (data && Array.isArray(data) && data.length > 0) {
        cloneTableData.value = data.map((item) => {
          // 使用 reduce 函数为每个项目的 image_json 创建独立的 imgPath 映射
          const imgPath = Object.keys(item.image_json).reduce((acc: Record<string, string>, key) => {
            const relativePath = item.image_json[key]
            const absolutePath = relativeToAbsoluteResource(relativePath)
            acc[key] = absolutePath["href"]
            return acc
          }, {})

          // 返回更新后的对象，包括独立的 imgPath
          return {
            ...item,
            imgPath
          }
        })

        cloneTableData.value.forEach((item) => {
          tableData.value.push(item)
          /*const copiedItem = { ...item }
          copiedItem.edit = true
          tableData.value.push(copiedItem)*/
        })
        console.log(tableData.value)
      }
    }
  }
  const errorMsg = (err: string) => {
    $q.notify({
      color: "green",
      message: t(err),
      position: "top",
      timeout: 1000
    })
  }

  const onUpdate = async (id: number) => {
    /*
    const row = tableData.value.find((row) => row.id === id && row.edit)
    if (row) {
      for (const [key, value] of Object.entries(row.imgPath)) {
        if (value === "") {
          errorMsg("error_msg.pictures_not_uploaded")
          return
        }
      }
      const sendData = {
        id: id,
        position: 1,
        images: row.imgPath
      }

      const { code, msg } = await updateBannerSetting(sendData)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      } else {
        $q.notify({
          color: "green",
          message: t("message.add_success"),
          position: "top",
          timeout: 1000
        })
        getBannerList()
      }
    }*/
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  ::v-deep(.uploader-language-code) {
    margin: auto 10px;
    font-size: 12px;
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
    max-width: 146px;
  }
  .btn-placement-indication {
    position: relative;
    .mock-img {
      position: absolute;
      left: 110%;
      top: 0;
      z-index: 1;
      display: none;
      height: 200px;
    }
    &:hover {
      .mock-img {
        display: block;
      }
    }
  }

  .main-color {
    background: #eff7ff !important;
  }
  .drag-container {
    opacity: 1 !important;
    display: block;
    .top_header {
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
      span {
        display: block;
      }
    }
    .img_upload {
      width: 94%;
    }
    .save {
      align-items: center;
    }
  }

  :deep(.q-expansion-item__container) {
    color: #086eff !important;
  }
</style>
