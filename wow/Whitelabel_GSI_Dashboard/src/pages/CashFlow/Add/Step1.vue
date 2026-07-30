<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section class="q-pl-sm">
      <div class="text-subtitle1 text-bold">{{ $t("edit_form.front_end_information") }}</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-6 q-pl-sm">
          <div>{{ $t("table_header.payer_name") }}</div>
          <q-input
            v-model="form.name"
            square
            borderless
            dense
            class="edit-input"
            :placeholder="$t('common.please_enter_content')"
          />
          <div class="q-mt-lg">{{ $t("edit_form.front_end_display") }}</div>
          <div class="enable">
            <q-toggle
              v-model="form.display"
              :color="form.display ? 'positive' : 'negative'"
              :false-value="false"
              :true-value="true"
              stack-label
              size="xl"
              :label="form.display ? $t('common.enable') : $t('common.disable')"
            />
          </div>
        </div>
        <div class="col-6">
          <div>LOGO</div>
          <PreviewImage
            :parentImage="form.logoImgUrl"
            :defaultImage="addPaymentLogoDefault()"
            :aspectRatio="'200/80'"
            @update:modelValue="updateImgUrl"
            @update:imgFile="updateImgFile"
            :maxFileSize="10240000"
            imageToBase64
          />
          <div class="row justify-evenly items-center q-mt-md">
            <div>{{ $t("edit_form.add_payment_logo_tip") }}</div>
            <q-btn outline color="red" icon-right="delete_outline" @click="deleteImage">{{
              $t("common.delete")
            }}</q-btn>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section align="center">
      <q-btn
        color="main-color"
        class="q-px-xl q-py-sm"
        :loading="isSubmitting"
        :disable="isSubmitting"
        @click="onSubmit"
        >{{ $t("btn.next_step") }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted, nextTick, ref } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useCashFlowStore } from "@/stores/cashflowStore"
  import { useStepper } from "@/hook/useStepper"
  import { useImage } from "@/hook/useImage"
  import { uploadPaymentImage } from "@/api/paymentGateway"
  import type * as Request from "@/api/request.type"
  import PreviewImage from "@/components/forms/PreviewImage.vue"

  const $q = useQuasar()
  const { t } = useI18n()
  const { nextPrevStep } = useStepper()
  const cashFlowStore = useCashFlowStore()

  const { gatewayItem: form } = storeToRefs(cashFlowStore)

  // 防止連續調用
  const isSubmitting = ref(false)
  // 上傳圖片
  const { addPaymentLogoDefault } = useImage()
  const updateImgFile = (value: File) => {
    form.value.logoImgFile = value
    form.value.logo_image_id = 0
  }
  const updateImgUrl = (value: string) => {
    form.value.logoImgUrl = value
  }
  const deleteImage = () => {
    form.value.logoImgUrl = ""
    form.value.logoImgFile = undefined
    form.value.logo_image_id = 0
  }

  const canSendApi = (): boolean => {
    if (!form.value.name) {
      $q.notify({
        type: "negative",
        message: `${t("table_header.please_enter")}${t("table_header.payer_name")}`,
        position: "top",
        timeout: 1000
      })
      return false
    }
    if (!form.value.logo_image_id && !form.value.logoImgFile) {
      $q.notify({
        type: "negative",
        message: t("error_msg.logo_image_is_required"),
        position: "top",
        timeout: 1000
      })
      return false
    }

    return true
  }

  const onSubmit = async () => {
    // 防止連續調用
    if (isSubmitting.value) {
      return
    }

    // 檢查欄位規則，不符合則return掉
    if (!canSendApi()) {
      return
    }

    isSubmitting.value = true

    try {
      if (form.value.logo_image_id) {
        nextPrevStep(true)
        return
      }

      if (form.value.logoImgFile) {
        const payload: Request.UploadPaymentImage = {
          image: form.value.logoImgFile
        }
        const { code, data, msg } = await uploadPaymentImage(payload)
        if (code !== 0) {
          $q.notify({
            type: "negative",
            message: msg,
            position: "top",
            timeout: 1000
          })
          return
        }
        form.value.logo_image_id = data.image_id
        nextPrevStep(true)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    if (form.value.logo_image_id === 0) {
      nextTick(() => {
        deleteImage()
      })
    }
  })
</script>

<style lang="scss" scoped>
  @import "@/css/form.scss";
  .enable {
    width: 47%;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
</style>
