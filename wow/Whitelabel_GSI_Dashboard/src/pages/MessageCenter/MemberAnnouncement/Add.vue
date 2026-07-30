<template>
  <SubPage :action-label-i18n-key="'btn.add'" class="q-mt-xl" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <!-- <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.add_member_notice") }}</div>
        </q-card-section> -->
        <announcement></announcement>
        <q-card-actions class="q-py-md" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
          <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import type * as Request from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { addMemberAnnouncement } from "@/api/announcement"
  import SubPage from "layouts/SubPage/Index.vue"
  import announcement from "./component/announcement.vue"
  import { storeToRefs } from "pinia"
  import { useMemberAnnouncement } from "@/stores/memberAnnouncement"
  import { useS3Upload } from "src/composables/useS3Upload"
  import { useFileStore } from "src/stores/fileStore"
  import { ANNOUNCEMENT_DISPLAY_TYPE } from "src/utils/constants"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const memberAnnouncementStore = useMemberAnnouncement()
  const { memberAnnouncementItem: form } = storeToRefs(memberAnnouncementStore)
  const { S3_STORAGE_CATEGORY, uploadSingleFile } = useS3Upload()
  const { getFile, removeFile, clearFiles } = useFileStore()

  function goBack() {
    router.back()
  }

  function onCancel() {
    router.back()
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  async function onSubmit() {
    if (form.value.start_time === "" || form.value.end_time === "") {
      errorMsg("error_msg.please_enter_date")
      return
    }

    if (!form.value.display_options.length) {
      errorMsg("error_msg.please_select_a_display_mode")
      return
    }

    if (!validateLanguages(form.value.details)) return

    if (form.value.member_mode === "true") {
      form.value.target_member_ids = [-1]
    } else {
      form.value.target_member_ids = form.value.show_member_ids
    }

    await Promise.all(
      form.value.details.map(async (item) => {
        if (item.imageFileName) {
          const file = getFile(item.imageFileName)
          if (file) {
            const { status, data, msg } = await uploadSingleFile({
              file,
              storage_category: S3_STORAGE_CATEGORY.Enums.announcement
            })
            if (status && data) {
              item.image_path = data.objectKey
            }
            removeFile(item.imageFileName)
            delete item.imageFileName
          }
        }
      })
    )

    const { code, msg } = await addMemberAnnouncement(form.value)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
      onBackTo()
      return
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  const validateLanguages = (array: Request.AddMemberAnnouncement["details"]) => {
    const missingTitleItem = array.find((item) => !item.title)
    if (missingTitleItem) {
      $q.notify({
        type: "negative",
        message: `${t("common.please_enter_title")} (${missingTitleItem.lang})`,
        position: "top",
        timeout: 1000
      })
      return false
    }
    if (form.value.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.IMAGES)) {
      const missingImageItem = array.find((item) => !item.imageFileName && !item.image_path)
      if (missingImageItem) {
        $q.notify({
          type: "negative",
          message: `${t("common.please_upload_an_image")} (${missingImageItem.lang})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    return true
  }
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
  }
  function onBackTo() {
    /*const { start, end } = route.query
    router.push({
      name: "MemberAnnouncementList",
      query: {
        start,
        end
      }
    })*/
    router.back()
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .p_select {
    display: flex;
    span {
      align-items: center;
      display: flex;
      margin-right: 15px;
    }
    ::v-deep(.q-select) {
      width: 55%;
    }
  }

  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .imgUpload {
    margin: 0 auto;
    max-width: 450px;
  }
</style>
