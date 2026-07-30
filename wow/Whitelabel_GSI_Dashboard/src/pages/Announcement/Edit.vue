<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.editorial_notice") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select v-model="form.type" :options="typeDropdownList" dense emit-value map-options outlined />
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
                      :loading="spinShow"
                      :label="form.enabled ? $t('common.enable') : $t('common.disable')"
                    />
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("edit_form.specify_announcement_object") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row">
            <!-- <div class="col-12">
              <q-option-group
                name="accepted_genres"
                v-model="form.announcement_object"
                :options="announcementTag"
                type="checkbox"
                color="primary"
                inline
                dense
              />
            </div> -->
            <div class="col-12">
              <SelectAllOptionGroup
                :parent-value="form.agent_name_group"
                :group-options="agentNameId"
                :select-all-label="$t('table_header.master_agent_name')"
                @update:parentValue="handelAgentNameIdGroup"
              />
            </div>
            <div class="col-12 q-pt-lg">
              <q-input
                v-model="form.title"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.title')"
              />
            </div>
            <div class="col-12 q-pt-lg">
              <Editor :model-value="form.desc" @update:model-value="handelEditor" />
            </div>
            <div class="col-12 q-pt-lg">
              <div class="imgUpload">
                <PreviewImage
                  :parent-image="form.img_url"
                  :default-image="promotionEventBanner()"
                  :aspect-ratio="'236/132'"
                  @update:modelValue="updateImgUrl"
                  imageToBase64
                  :maxFileSize="204800"
                />
                <div class="q-flex justify-center">
                  <span class="q-mr-md align-self-center"> {{ $t("edit_form.add_payment_logo_tip") }}</span>
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
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"
  import { useImage } from "@/hook/useImage"
  import { useSearch } from "@/hook/useSearch"
  import { getAnnouncementDetail, updateAnnouncementDetail } from "@/api/announcement"
  import type { announcementItem } from "@/api/response.type"
  import { useCommon } from "@/hook/useCommon"
  import { ANNOUNCEMENT_TYPE, DISPLAY_OBJECT_TYPE } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import SelectAllOptionGroup from "@/components/forms/AnnouncementOptionGroup.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat } = useCommon()

  const typeDropdownList = genEnumToDropdown(ANNOUNCEMENT_TYPE.Enums, ANNOUNCEMENT_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })

  const objectDropdownList = genEnumToDropdown(DISPLAY_OBJECT_TYPE.Enums, DISPLAY_OBJECT_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })

  interface Form {
    id: number
    desc: string
    announcementType: number
    type: number
    file: string
    target: string
    title: string
    enabled: number
    announcement_start_time: string
    announcement_end_time: string
    img_url: string
    agent_name_group: string[]
  }

  const form = reactive<Form>({
    id: 0,
    desc: "",
    announcementType: 1,
    type: 1,
    file: "",
    target: "1",
    title: "",
    enabled: 0,
    announcement_start_time: "",
    announcement_end_time: "",
    agent_name_group: [],
    img_url: ""
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

  const announcementTag = computed(() => [
    {
      label: t("announcement_tag.home"),
      value: 1
    },
    {
      label: t("announcement_tag.member_centre"),
      value: 2
    },
    {
      label: t("announcement_tag.slots_game"),
      value: 3
    },
    {
      label: t("announcement_tag.live_game"),
      value: 4
    },
    {
      label: t("announcement_tag.sport_game"),
      value: 5
    },
    {
      label: t("announcement_tag.card_game"),
      value: 6
    }
  ])
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
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string) => {
    form.img_url = value
  }

  const deleteImage = () => {
    form.img_url = ""
  }
  const { search, spinShow, isSuccess, tableData } = useSearch(getAnnouncementDetail)
  onMounted(() => {
    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
        form.type = tableData.value.type
        form.target = tableData.value.target
        form.title = tableData.value.title
        form.desc = tableData.value.desc
        form.agent_name_group = tableData.value.target_agent
        dateTimeSelector.from = genTimeFormat(tableData.value.announcement_start_time, "yyyy-MM-dd") as any
        dateTimeSelector.to = genTimeFormat(tableData.value.announcement_end_time, "yyyy-MM-dd") as any
        form.enabled = tableData.value.enabled
        form.img_url = tableData.value.file_path
        form.id = Number(route.params.id)
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  function onCancel() {
    router.push({ name: "AnnouncementList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  async function onSubmit() {
    isLoading.value = true
    if (dateTimeSelector.from !== undefined && dateTimeSelector.to !== undefined) {
      form.announcement_start_time = dateTimeSelector.from
      form.announcement_end_time = dateTimeSelector.to
    }
    const { code, msg } = await updateAnnouncementDetail(form)
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
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
    }

    setTimeout(() => {
      router.push({ name: "AnnouncementList" })
      isLoading.value = false
    }, 500)
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
