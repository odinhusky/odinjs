<template>
  <div class="q-pa-md" style="min-height: 290px">
    <div class="msk" v-if="!permission.edit"></div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <div class="drag-container">
          <q-list class="rounded-borders">
            <q-expansion-item
              group="group1"
              expand-icon-toggle
              expand-separator
              class="main-color q-mt-md"
              :default-opened="true"
            >
              <template #header>
                <div class="top_header">
                  <span class="q-pl-lg">LOGO {{ $t("common.wide_version") }}</span>
                </div>
              </template>
              <q-card>
                <q-card-section class="image-preview_expanded_row q-flex">
                  <div class="q-flex img_upload">
                    <div class="row">
                      <!-- <span class="uploader-language-code">{{ $t("common.wide_version") }}</span>-->
                      <div>
                        <PreviewImage
                          :parentImage="getLogoTypeImage(1)"
                          :default-image="addKycDefault()"
                          :aspect-ratio="'1200/700'"
                          :max-width="'210px'"
                          :max-file-size="512000"
                          @update:modelValue="updateListImgUrl($event, 1)"
                          imageToBase64
                        />
                        <div class="q-ml-md">
                          <p>*1500px X 450px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>

                      <!--<div class="q-ml-sm column justify-center">
                        <q-icon
                          name="delete_outline"
                          size="xs"
                          color="red"
                          class="q-mt-sm cursor-pointer"
                          @click="removeLogo(0)"
                        />
                      </div>-->
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list class="rounded-borders">
            <q-expansion-item
              header-class="text-white"
              group="group2"
              expand-icon-toggle
              expand-separator
              expand-icon-class="text-white"
              class="main-color q-mt-md"
              :default-opened="true"
            >
              <template #header>
                <div class="top_header">
                  <span class="q-pl-lg">LOGO {{ $t("common.square") }}</span>
                </div>
              </template>
              <q-card>
                <q-card-section class="image-preview_expanded_row q-flex">
                  <div class="q-flex img_upload">
                    <div class="row">
                      <div>
                        <PreviewImage
                          :parentImage="getLogoTypeImage(2)"
                          :default-image="addLogoDefault()"
                          :aspect-ratio="'600/600'"
                          :max-width="'150px'"
                          :max-file-size="512000"
                          @update:modelValue="updateListImgUrl($event, 2)"
                          imageToBase64
                        />
                        <div class="q-ml-md">
                          <p>*500px X 500px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>

                      <!--<div class="q-ml-sm column justify-center">
                        <q-icon
                          name="delete_outline"
                          size="xs"
                          color="red"
                          class="q-mt-sm cursor-pointer"
                          @click="removeLogo(1)"
                        />
                      </div>-->
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <q-list class="rounded-borders">
            <q-expansion-item
              header-class="text-white"
              group="group3"
              expand-icon-toggle
              expand-separator
              expand-icon-class="text-white"
              class="main-color q-mt-md"
              :default-opened="true"
            >
              <template #header>
                <div class="top_header">
                  <span class="q-pl-lg">{{ $t("common.browser_icon") }}</span>
                </div>
              </template>
              <q-card>
                <q-card-section class="image-preview_expanded_row q-flex">
                  <div class="q-flex img_upload">
                    <div class="row">
                      <div class="col-3 q-ml-md">
                        <div class="icon-width">
                          <PreviewImage
                            :parentImage="getLogoTypeImage(3)"
                            :default-image="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 3)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*16px X 16px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                      <div class="col-3 q-ml-md">
                        <div>
                          <PreviewImage
                            :parentImage="getLogoTypeImage(4)"
                            :default-image="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 4)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*32px X 32px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                      <div class="col-3 q-ml-md">
                        <div>
                          <PreviewImage
                            :parentImage="getLogoTypeImage(5)"
                            :default-image="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 5)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*48px X 48px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                      <div class="col-3 q-ml-md">
                        <div>
                          <PreviewImage
                            :parentImage="getLogoTypeImage(6)"
                            :default-image="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 6)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*64px X 64px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                      <div class="col-3 q-ml-md">
                        <div>
                          <PreviewImage
                            :parentImage="getLogoTypeImage(7)"
                            :defaultImage="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 7)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*128px X 128px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                      <div class="col-3 q-ml-md">
                        <div>
                          <PreviewImage
                            :parentImage="getLogoTypeImage(8)"
                            :default-image="addLogoDefault()"
                            :aspect-ratio="'64/64'"
                            :max-width="'100px'"
                            :max-file-size="102400"
                            @update:modelValue="updateListImgUrl($event, 8)"
                            imageToBase64
                          />
                        </div>
                        <div class="q-ml-md">
                          <p>*512px X 512px</p>
                          <p>*{{ $t("common.png_files") }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
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

  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  import { getWebsiteLogo, updateWebsiteLogo } from "@/api/webSiteSetting"
  import { useEnv } from "src/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()

  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  interface ImageItem {
    id: number
    agent_id: number
    logo_type: number
    path: string
    created_at: string
    updated_at: string
  }
  const logo = ref<{
    logo_type: Number
    img: Array<{
      logo_type: number
      img: string
    }>
  }>({
    logo_type: 0,
    img: []
  })

  const { addKycDefault, addLogoDefault } = useImage()

  const $q = useQuasar()

  const reLoadImg = (id: number, language: string) => {}
  const { permission } = usePermission()

  const updateListImgUrl = async (value: string, id: number) => {
    let image = logo.value.img.find((image) => image.logo_type === id)
    if (image) {
      image.img = value
    } else {
      logo.value.img.push({
        logo_type: id,
        img: value
      })
      image = logo.value.img.find((image) => image.logo_type === id)
    }
    if (image && image.img.includes("base64,")) {
      const { code, msg, data } = await updateWebsiteLogo(image)
      if (code == 0) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        errorMsg(msg)
      }
    }
  }

  const getLogoTypeImage = (type: number) => {
    const logoType2Img = logo.value.img.find((item) => item.logo_type === type)
    return logoType2Img ? logoType2Img.img : ""
  }

  onMounted(() => {
    getLogoList()
  })

  const getLogoList = async () => {
    // let sendData = { position: 1, game_type: gameCode.value }

    const { code, msg, data } = await getWebsiteLogo()
    console.log(data)
    if (code !== 0) {
      errorMsg(msg)
      return
    } else {
      //圖片相關
      if (Array.isArray(data)) {
        logo.value.img = data.map((item: ImageItem) => ({
          ...item,
          img: `${VITE_APP_BASE_API}/${item.path}?date=${item.updated_at}`
        }))
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
  /*::v-deep(.preview-image) {
    max-width: 150px;
  }*/
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
    background: #EFF7FF !important;
  }
  .drag-container {
    opacity: 1 !important;
    display: block;
    .top_header {
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
      color: #086EFF;
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
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }

  :deep(.q-expansion-item__container) {
    color: #086EFF !important;
  }
</style>
