<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-bold text-dark">{{ $t("common.template_selection") }}</div>
      </q-card-section>
      <q-card-section>
        <q-carousel
          v-model="swiper"
          class="template-carousel"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="primary"
          padding
          arrows
          infinite
          height="120px"
        >
          <!-- Outer loop for q-carousel-slide -->
          <q-carousel-slide
            v-for="(chunk, chunkIndex) in chunkedPictures"
            :key="chunkIndex"
            :name="chunkIndex"
            class="column no-wrap"
          >
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <!-- Inner loop for images within each q-carousel-slide -->
              <div v-for="(picture, pictureIndex) in chunk" :key="pictureIndex" class="template-img-container">
                <q-img
                  class="template-img"
                  :class="{ active: picture.id === tempImage[platform].id }"
                  :src="picture.imgUrl"
                  height="90px"
                  width="90px"
                  @click="viewTemplate(picture)"
                ></q-img>
                <div class="q-mt-sm text-center">
                  {{ $t("common.template") + " " + picture.name }}
                </div>
                <div v-if="picture.id === setImageId" class="set-img-container">
                  <img src="~assets/images/common/icon-check.webp" alt="" />
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
      <q-card-section>
        <q-separator />
      </q-card-section>
      <q-card-section align="center">
        <q-btn-toggle
          v-model="platform"
          toggle-color="primary"
          class="btn_toggle_style"
          unelevated
          rounded
          :options="[
            { label: $t('common.desktop'), value: 'desktop' },
            { label: $t('common.mobile'), value: 'mobile' }
          ]"
        />
      </q-card-section>
      <q-card-section class="content" :class="platform">
        <q-img :src="tempImage[platform].imgUrl"></q-img>
        <div class="mask">
          <img class="mask-magnifier" src="~assets/images/common/Icon-magnifier.webp" alt="" @click="onShow" />
        </div>
      </q-card-section>
      <q-card-section align="center" v-if="permission.edit">
        <q-btn class="q-px-xl" color="primary" outline>{{ $t("btn.cancel") }}</q-btn>
        <q-btn class="q-px-xl q-ml-md" color="primary" @click="onApply">{{ $t("btn.apply") }}</q-btn>
      </q-card-section>
    </q-card>
  </div>
  <vue-easy-lightbox
    :visible="showFullscreenImage"
    :imgs="tempImage[platform].imgUrl"
    @hide="onHide"
    :rotateDisabled="true"
  ></vue-easy-lightbox>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import VueEasyLightbox from "vue-easy-lightbox"
  import desktop1 from "@/assets/images/template/desktop1.webp"
  import desktop2 from "@/assets/images/template/desktop2.webp"
  import desktop3 from "@/assets/images/template/desktop3.webp"
  import desktop4 from "@/assets/images/template/desktop4.webp"
  import desktop5 from "@/assets/images/template/desktop5.webp"
  import desktop6 from "@/assets/images/template/desktop6.webp"
  import mobile1 from "@/assets/images/template/mobile1.webp"
  import mobile2 from "@/assets/images/template/mobile2.webp"
  import mobile3 from "@/assets/images/template/mobile3.webp"
  import mobile4 from "@/assets/images/template/mobile4.webp"
  import mobile5 from "@/assets/images/template/mobile5.webp"
  import mobile6 from "@/assets/images/template/mobile6.webp"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  type imageObj = {
    id: number
    name: number
    imgUrl: string
  }

  type TempImg = {
    desktop: imageObj
    mobile: imageObj
  }
  type TempImgKeys = keyof TempImg

  const { t } = useI18n()

  const swiper = ref(0)
  const setImageId = ref(1)
  const tempImage = ref<TempImg>({
    desktop: {
      id: 1,
      name: 1,
      imgUrl: desktop2
    },
    mobile: {
      id: 1,
      name: 1,
      imgUrl: mobile2
    }
  })
  const platform = ref<TempImgKeys>("desktop")
  const showFullscreenImage = ref(false)

  const chunkedPictures = computed(() => {
    const chunkSize = 12
    const totalPictures = 12
    const result = []
    let tempArray = []
    const imageUrlObj = {
      desktop: [desktop1, desktop2, desktop3, desktop4, desktop5, desktop6],
      mobile: [mobile1, mobile2, mobile3, mobile4, mobile5, mobile6]
    }

    for (let i = 1; i <= totalPictures; i++) {
      const imageAry = imageUrlObj[platform.value]
      const picture = reactive<imageObj>({
        id: i,
        name: i,
        imgUrl: imageAry[i % imageAry.length]
      })
      if (tempArray.length === chunkSize) {
        result.push([...tempArray])
        tempArray = []
      }
      tempArray.push(picture)
      if (i === totalPictures) {
        result.push([...tempArray])
      }
    }

    return result
  })

  const viewTemplate = (item: imageObj) => {
    tempImage.value[platform.value] = item
  }

  const onShow = () => (showFullscreenImage.value = true)
  const onHide = () => (showFullscreenImage.value = false)

  const $q = useQuasar()
  const onApply = () => {
    $q.notify({
      type: "positive",
      message: t("message.apply_success"),
      position: "top",
      timeout: 300
    })
  }
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  .q-img__content > div {
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .template-img-container {
    position: relative;
    .template-img {
      ::v-deep(.q-img__image) {
        border: 4px solid transparent;
        border-radius: 10px;
      }
      &:hover {
        ::v-deep(.q-img__image) {
          border-color: #3f3c4433;
          border-radius: 6px;
        }
      }
      &.active {
        ::v-deep(.q-img__image) {
          border-color: $mainColor;
          border-radius: 6px;
        }
      }
    }
    .set-img-container {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 5px;
      bottom: 35px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .content {
    position: relative;
    margin: 0px auto;
    padding: 0;
    overflow: hidden;
    &.desktop {
      max-width: 90%;
      aspect-ratio: 1359/635;
    }
    &.mobile {
      width: 369px;
      aspect-ratio: 369/635;
    }
    .mask {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba($color: #000000, $alpha: 0.5);
      justify-content: center;
      align-items: center;
      .mask-magnifier {
        width: 78px;
        height: 78px;
        cursor: pointer;
      }
    }
    &:hover {
      .mask {
        display: flex;
      }
    }
  }
  // fullscreen
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
</style>
