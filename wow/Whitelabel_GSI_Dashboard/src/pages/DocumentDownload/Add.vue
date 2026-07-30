<template>
  <SubPage :action-label-i18n-key="'btn.add'" class="q-mt-xl" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.new_document") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select v-model="form.file_type" :options="typeDropdownList" dense emit-value map-options outlined />
            </div>
            <div class="col-6">
              <q-select v-model="form.target" :options="objectDropdownList" dense emit-value map-options outlined />
            </div>
            <div class="col-6">
              <DateTimePicker :date-time-model="dateTimeSelector" :on-update-date-time="onUpdateDateTime" />
            </div>
            <div class="col-6">
              <q-card class="my-card col-3 q-mr-xl q-mt-sm bg-transparent">
                <q-card-section class="text-black q-pa-xs">
                  <div>{{ $t("table_header.enable_or_disable") }}</div>
                </q-card-section>

                <q-card-actions align="left">
                  <div class="enable">
                    <q-toggle
                      v-model="form.enabled"
                      :color="form.enabled ? 'positive' : 'negative'"
                      :false-value="0"
                      :true-value="1"
                      stack-label
                      :label="form.enabled ? $t('common.enable') : $t('common.disable')"
                    />
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.specify_display_object") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row">
            <div class="col-12">
              <SelectAllOptionGroup
                :parent-value="form.target_audience"
                :group-options="agentNameId"
                :select-all-label="$t('table_header.master_agent_name')"
                @update:parentValue="handelAgentNameIdGroup"
              />
            </div>
            <div class="col-12 q-pt-lg">
              <q-input v-model="form.title" outlined stack-label :label="$t('table_header.title')" />
            </div>
            <div class="col-12 q-pt-lg">
              <Editor :model-value="form.desc" @update:model-value="handelEditor" />
            </div>
            <div class="col-12 q-pt-lg">
              <div class="imgUpload">
                <PreviewImage
                  :parent-image="form.file"
                  :default-image="addPaymentLogoDefault()"
                  :aspect-ratio="'341/112'"
                  @update:modelValue="updateImgUrl"
                  imageToBase64
                  :maxFileSize="104857600"
                />
                <div class="q-flex justify-center">
                  <span class="q-mr-md align-self-center"> *{{ $t("edit_form.add_document_tip") }}</span>
                  <q-btn
                    icon-right="delete"
                    outline
                    color="red-5"
                    class="q-mt-xs"
                    :label="$t('common.delete')"
                    @click="deleteImage"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

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
  import { ref, reactive, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useImage } from "@/hook/useImage"
  import { DOCUMENTDOWNLOAD_TYPE, DOCUMENTDOWNLOAD_OBJECT } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import SelectAllOptionGroup from "@/components/forms/DocumentDownloadOptionGroup.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { addDocumentDownloadDetail } from "@/api/documentDownload"
  import type { documentDownloadDetailItem } from "@/api/response.type"
  import SubPage from "layouts/SubPage/Index.vue"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const typeDropdownList = genEnumToDropdown(DOCUMENTDOWNLOAD_TYPE.Enums, DOCUMENTDOWNLOAD_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })

  const objectDropdownList = genEnumToDropdown(DOCUMENTDOWNLOAD_OBJECT.Enums, DOCUMENTDOWNLOAD_OBJECT.I18nKeys).map(
    (e) => {
      e.label = t(e.label)
      return e
    }
  )

  const form = reactive<documentDownloadDetailItem>({
    id: 0,
    file_type: 1,
    target: 1,
    title: "",
    desc: "",
    file_start_time: "",
    file_end_time: "",
    enabled: false,
    target_audience: [],
    file: "",
    agent_name_group: []
  })

  function goBack() {
    router.back()
  }

  const dateTimeSelector = reactive<{ from?: string; to?: string }>({
    from: undefined,
    to: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; to: string }) => {
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
  }

  const agentNameId = computed(() => [
    { label: t("table_header.agent_name"), value: 0 },
    { label: t("table_header.agent_name"), value: 1 },
    { label: t("table_header.agent_name"), value: 2 },
    { label: t("table_header.agent_name"), value: 3 }
  ])
  interface AgentItem {
    id: string
    groupValue: boolean
  }

  interface Group {
    child?: AgentItem[]
  }

  interface GroupObj {
    [key: string]: Group
  }
  const handelAgentNameIdGroup = (value: GroupObj[]): string[] => {
    const selectedAgents: string[] = []

    value.forEach((groupObj) => {
      const groupValues = Object.values(groupObj)
      groupValues.forEach((group) => {
        const child = group.child
        if (child && Array.isArray(child)) {
          child.forEach((agentItem) => {
            if (agentItem.groupValue) {
              selectedAgents.push(agentItem.id)
            }
          })
        }
      })
    })

    form.agent_name_group = selectedAgents
    return selectedAgents
  }

  // 編輯器
  const handelEditor = (value: string) => {
    form.desc = value
  }
  // 上傳圖片
  const { addPaymentLogoDefault } = useImage()
  const updateImgUrl = (value: string) => {
    form.file = value
  }
  const deleteImage = () => {
    form.file = ""
  }

  function onCancel() {
    router.push({ name: "DocumentDownloadList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  async function onSubmit() {
    if (dateTimeSelector.from !== undefined && dateTimeSelector.to !== undefined) {
      form.file_start_time = dateTimeSelector.from
      form.file_end_time = dateTimeSelector.to
    }
    isLoading.value = true
    const { code, msg } = await addDocumentDownloadDetail(form)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
    }

    setTimeout(() => {
      router.push({ name: "DocumentDownloadList" })
      isLoading.value = false
    }, 500)
  }
  function onBackTo() {
    const { start, end } = route.query
    router.push({
      name: "DocumentDownloadList",
      query: {
        start,
        end
      }
    })
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
  ::v-deep(.q-textarea .q-field__control) {
    height: 56px;
  }
  ::v-deep(.q-form .q-field__control) {
    height: 52px;
  }

  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
  }

  .custom-box-label {
    font-family: Noto Sans TC;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    margin-bottom: 12px;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    margin-bottom: 4px;
    padding: 2px 8px;
    text-align: left;
    cursor: pointer;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 15px;
    border-bottom: 1px solid #c2c2ca;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .custom-box:last-child {
    border-bottom: none;
  }
  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  .align-self-center {
    align-self: center;
  }
  .imgUpload {
    margin: 0 auto;
    max-width: 450px;
  }
</style>
