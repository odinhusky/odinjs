<template>
  <q-card-section class="q-pt-xs">
    <div class="grid grid-cols-[auto_1fr] items-center mb-0 px-0 gap-5 max-w-[31.25rem] pt-4 pb-8">
      <div>{{ $t("query_params.announcement_type") }}</div>
      <q-select
        v-model="form.type"
        :options="typeDropdownList"
        :option-label="(item) => (item && item.label ? $t(item.label) : item.value)"
        dense
        emit-value
        map-options
        outlined
        class="flex-1"
        :disable="isEdit"
      />
      <div>{{ $t("table_header.announcement_time") }}</div>
      <DateTimePicker
        label=""
        :date-time-model="dateTimeSelector"
        :on-update-date-time="onUpdateDateTime"
        :quick-selectors="[]"
        :date-option="dateOption"
        class="flex-1 date-time-picker"
      />
    </div>
    <q-separator />
    <div class="flex items-center gap-5 py-8">
      <div class="text-h6 text-bold text-dark">{{ $t("announcement_display_type.display_mode") }}</div>
      <q-checkbox
        v-model="form.display_options"
        v-for="item in displayTypeList"
        :key="item.value"
        :val="item.value"
        :label="item.label"
        size="md"
        dense
        :disable="item.disable"
      />
    </div>
    <q-separator />
    <div class="flex items-center gap-5 py-8">
      <div class="text-h6 text-bold text-dark">{{ $t("query_params.display_object_target") }}</div>
      <q-radio v-model="form.member_mode" val="true" :label="$t('query_params.all_member')" size="md" dense />
      <q-radio v-model="form.member_mode" val="false" :label="$t('query_params.single_member')" size="md" dense />
      <q-select
        v-model="form.show_member_ids"
        :options="accountOption"
        use-input
        use-chips
        multiple
        fill-input
        input-debounce="0"
        emit-value
        map-options
        @filter="filterAccount"
        outlined
        square
        borderless
        dense
        style="width: 30%"
      >
        <template v-slot:append>
          <q-icon name="search" @click.stop.prevent />
        </template>
      </q-select>
    </div>
    <q-separator />
    <div class="col-12 q-mt-md flex-column">
      <div class="languageTabsWrapper">
        <div class="row tab-container">
          <div class="col-6">
            <q-tabs v-model="language.current" class="justify-start">
              <q-tab
                v-for="(lang, key) in language.list"
                :key="key"
                :name="lang.label"
                :label="lang.label"
                class="i18n-tab"
              />
            </q-tabs>
          </div>

          <div class="q-pl-lg col-6 row items-center q-col-gutter-md">
            <span>{{ $t("edit_form.apply_to_other_languages") }}</span>
            <div class="col-4">
              <q-select
                v-model="language.apply"
                :options="language.list"
                class="edit-input"
                borderless
                dense
                emit-value
                map-options
                standout="bg-white text-black"
              />
            </div>
            <div>
              <q-btn color="primary" size="16px" outline @click="applyToOtherLanguage">{{ $t("btn.apply") }}</q-btn>
            </div>
          </div>
        </div>
        <q-tab-panels v-model="language.current" animated class="q-mt-md">
          <q-tab-panel v-for="item in form.details" :name="item.lang" class="q-px-none">
            <div class="row q-col-gutter-xl">
              <div class="col-6">
                <div>{{ $t("table_header.title") }}</div>
                <q-input v-model="item.title" outlined dense class="edit-input rounded-lg" />
                <div class="q-mt-lg q-mb-xs">{{ $t("cms.image") }}</div>
                <div class="row no-wrap">
                  <div class="col-9 q-pt-xs">
                    <PreviewImage
                      :parentImage="item.image"
                      :defaultImage="promotionEventBanner()"
                      :aspectRatio="'236/132'"
                      @update:modelValue="updateImgUrl($event, item)"
                      @update:img-file="updateImgFile($event, item)"
                      imageToBase64
                      :maxFileSize="204800"
                      accept-file-type="image/jpeg, image/jpg, image/png, image/gif"
                    />
                  </div>
                  <div class="col-3">
                    <div class="column justify-end q-pl-md fit">
                      <q-btn class="q-mt-xs" color="red-5" @click="deleteImage(item)">{{ $t("common.delete") }}</q-btn>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div>{{ $t("table_header.content") }}</div>
                <div>
                  <Editor :model-value="item.content" @update:model-value="handelEditor($event, item)" />
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!--<div class="col-12 q-pt-lg">
      <q-input v-model="form.title" outlined stack-label :label="$t('table_header.title')" />
    </div>
   <div class="col-12 q-pt-lg">
      <Editor :model-value="form.desc" @update:model-value="handelEditor" />
    </div>-->
    <!--<div class="col-12 q-pt-lg">
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
    </div>-->
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted, nextTick, toRefs, watch } from "vue"
  import { QTableProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useQuasar } from "quasar"
  import type * as Request from "@/api/request.type"

  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"

  import { ANNOUNCEMENT_MEMBER_TYPE, ANNOUNCEMENT_DISPLAY_TYPE } from "@/utils/constants"
  import { useImage } from "@/hook/useImage"
  import { useFileStore } from "src/stores/fileStore"
  import { useEnv } from "src/hook/useEnv"
  import { storeToRefs } from "pinia"
  import { useMemberAnnouncement } from "@/stores/memberAnnouncement"
  import { useQueryStore } from "@/stores/queryStore"
  import { getMemberList } from "@/api/announcement"
  import { useSiteStore } from "@/stores/siteStore"
  import { format, isBefore, startOfDay } from "date-fns"
  import { useCommon } from "src/hook/useCommon"

  const { t } = useI18n()

  const { envData } = useEnv()
  const { numberEnumToArray, genTimeFormat } = useCommon()
  const { setFile } = useFileStore()
  const $q = useQuasar()

  const memberAnnouncementStore = useMemberAnnouncement()
  const { memberAnnouncementItem: form } = storeToRefs(memberAnnouncementStore)
  const queryStore = useQueryStore()

  const typeDropdownList = ref<{ label: string; value: number }[]>([])
  const selectMode = ref("true")

  const today = startOfDay(new Date())

  const dateOption = (date: string) => {
    const target = startOfDay(new Date(date))
    return !isBefore(target, today)
  }

  const displayTypeList = computed(() => {
    return numberEnumToArray(ANNOUNCEMENT_DISPLAY_TYPE.Enums).map((item) => {
      let disable = false

      if (
        item === ANNOUNCEMENT_DISPLAY_TYPE.Enums.ALL_CONTENT &&
        form.value.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.IMAGES)
      ) {
        disable = true
      }
      if (
        item === ANNOUNCEMENT_DISPLAY_TYPE.Enums.IMAGES &&
        form.value.display_options.includes(ANNOUNCEMENT_DISPLAY_TYPE.Enums.ALL_CONTENT)
      ) {
        disable = true
      }
      return {
        label: t(
          ANNOUNCEMENT_DISPLAY_TYPE.I18nKeys[item as keyof typeof ANNOUNCEMENT_DISPLAY_TYPE.I18nKeys] || "common.unknow"
        ),
        value: item as number,
        disable
      }
    })
  })

  const siteStore = useSiteStore()
  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })

  const props = defineProps({
    accountOption: {
      type: [Array],
      required: false,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const language = reactive({
    list: languageList,
    current: languageList.value[0].label,
    apply: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const applyToOtherLanguage = () => {
    const fromLanguage = language.current
    const applyValue = Number(language.apply)
    const toLanguage = languageList.value[applyValue].label

    if (fromLanguage !== toLanguage) {
      const fromIndex = form.value.details?.findIndex((e) => e.lang === fromLanguage) as number
      const toIndex = form.value.details?.findIndex((e) => e.lang === toLanguage) as number

      if (form.value.details) {
        form.value.details[toIndex].title = form.value.details[fromIndex].title
        form.value.details[toIndex].content = form.value.details[fromIndex].content
        form.value.details[toIndex].image = form.value.details[fromIndex].image
        form.value.details[toIndex].image_path = form.value.details[fromIndex].image_path
        form.value.details[toIndex].imageFileName = form.value.details[fromIndex].imageFileName
      }
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  // 上傳圖片
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string, item: Request.AddMemberAnnouncementDetailItem) => {
    item.image = value
  }
  const updateImgFile = (file: File, item: Request.AddMemberAnnouncementDetailItem) => {
    if (file) {
      setFile(file)
      item.imageFileName = file.name
      item.image_path = ""
    }
  }
  const deleteImage = (item: Request.AddMemberAnnouncementDetailItem) => {
    item.image = ""
    item.image_path = ""
    item.imageFileName = ""
  }
  const handelEditor = (value: string, item: { content: string }) => {
    item.content = value
  }

  onMounted(async () => {
    await queryStore.getMemberAnnounceType()

    queryStore.MemberAnnounceType.forEach((data, index) => {
      typeDropdownList.value.push({
        label: (ANNOUNCEMENT_MEMBER_TYPE.I18nKeys as any)[data.value] || "common.unknow",
        value: data.value
      })
    })
    //搜尋會員
    await getMember("")

    if (form.value.start_time !== "") {
      dateTimeSelector.from = genTimeFormat(form.value.start_time, "yyyy-MM-dd")
      dateTimeSelector.fromHms = genTimeFormat(form.value.start_time, "HH:mm:ss")
    }
    if (form.value.end_time !== "") {
      dateTimeSelector.to = genTimeFormat(form.value.end_time, "yyyy-MM-dd")
      dateTimeSelector.toHms = genTimeFormat(form.value.end_time, "HH:mm:ss")
    }

    if (form.value.member_mode === "false") {
      //把ID轉成帳號名
      updateAccountOption()
    }
  })

  const updateAccountOption = async () => {
    stringOptions.value.forEach((item) => {
      if (form.value.show_member_ids.includes(item.value)) {
        const newItem = {
          label: item.label,
          value: item.value
        }
        accountOption.value.push(newItem)
      }
    })
  }

  interface StringOption {
    label: string
    value: number
  }
  const accountOption = ref<StringOption[]>([])
  const stringOptions = ref<StringOption[]>([])

  const filterAccount = (val: string, update: Function, abort: Function) => {
    update(() => {
      const needle = val.toLowerCase()
      if (stringOptions.value.length <= 0) {
        getMember(needle)
      }
      accountOption.value = stringOptions.value.filter((v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1)
    })
  }
  //搜尋會員
  const getMember = async (name: string | "") => {
    const sendData = {
      offset: 0,
      size: 300
    }
    const { data } = await getMemberList(sendData)
    if (!data || !Object.keys(data).length) {
      stringOptions.value.length = 0
      return
    }
    stringOptions.value.length = 0
    data.list.forEach((item: any) => {
      const newItem = {
        label: item.account,
        value: item.id
      }
      // 将新对象添加到 accountOption 数组中
      stringOptions.value.push(newItem as never)
    })
  }
  const dateTimeSelector = reactive<{ from?: string; to?: string; fromHms?: string; toHms?: string }>({
    from: undefined,
    to: undefined,
    fromHms: undefined,
    toHms: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; to: string; fromHms?: string; toHms?: string }) => {
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      dateTimeSelector.fromHms = undefined
      dateTimeSelector.toHms = undefined
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
    dateTimeSelector.fromHms = newValue.fromHms
    dateTimeSelector.toHms = newValue.toHms
  }

  const formatDateTimeSelector = (data: { start_date: string; end_date: string }) => {
    dateTimeSelector.from = data.start_date
    dateTimeSelector.to = data.end_date
  }

  /*
  watch(
    form,
    (newValue) => {
      console.log(newValue)
      formatDateTimeSelector(newValue)
    },
    { deep: true }
  )*/

  watch(dateTimeSelector, (newValue) => {
    form.value.start_time = newValue.from + " " + newValue.fromHms || ""
    form.value.end_time = newValue.to + " " + newValue.toHms || ""
  })
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

  :deep(.uploader-language-code) {
    margin: auto 10px;
    font-size: 12px;
  }

  :deep(.image-preview_expanded_row > :not(:first-child)) {
    margin-top: 10px;
  }
  :deep(.q-tabs__content) {
    justify-content: start !important;
  }

  .date-time-picker {
    :deep(.q-field__native) {
      padding-top: 0.125rem;
    }
  }

  .i18n-tab.q-tab {
    min-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 10px 10px 0 0;
    border-top: 1px solid #f0f2f5;
    border-left: 1px solid #f0f2f5;
    border-right: 1px solid #f0f2f5;

    &.q-tab--active {
      background-color: #eff7ff;
      border: none;
    }
  }
</style>
