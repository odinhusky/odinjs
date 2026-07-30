<template>
  <div class="q-px-md" style="min-height: 296px">
    <div class="row q-py-md q-px-sm" :class="backgroundColor" v-if="permission.edit">
      <q-btn class="btns btn-blue" color="main-color" @click="onAction">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add_banner") }}
      </q-btn>
      <div class="btn-placement-indication">
        <q-btn class="btns text-blue" outline color="main-color q-ml-sm">
          {{ $t("btn.placement_indication") }}
        </q-btn>
        <img :src="bannerImg" alt="" class="mock-img" />
      </div>
    </div>
    <q-markup-table square v-show="showNewBanner" class="q-pa-sm !overflow-x-auto" :class="backgroundColor">
      <thead class="bg-success">
        <tr>
          <th v-for="item in tableColumn2">{{ item.label }}</th>
        </tr>
      </thead>

      <tr>
        <td key="title">
          <q-input v-model="newBannerForm.title" outlined :label="$t('common.home_page_new_banner_title')" />
        </td>
        <td key="time" class="main-date-field" style="width: 375px">
          <DateTimePicker
            :date-time-model="newBannerForm.dateRange"
            class="edit-input"
            :label="$t('table_header.display_time')"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="onNewBannerDateChange"
          />
        </td>
        <td key="image_preview" class="image-preview_expanded_row">
          <div v-for="item in newBannerForm.images" :key="item.lang" class="row no-wrap">
            <span class="uploader-language-code">{{ item.lang }}</span>
            <div>
              <PreviewImage
                :parent-image="item.image"
                :default-image="websiteHomeBannerDefault()"
                :aspect-ratio="'270/70'"
                @update:modelValue="updateImgUrl($event, item)"
                imageToBase64
                :max-file-size="512000"
              />
            </div>
          </div>
        </td>
        <td key="link" class="image-preview_expanded_row">
          <div class="row no-wrap">
            <q-input
              v-model="newBannerForm.link"
              dense
              outlined
              :placeholder="$t('common.enter_link')"
              style="width: 100%"
            />
          </div>
          <div class="row no-wrap">
            <q-select
              v-bind="attrs"
              v-model="newBannerForm.opening_method"
              :options="link_options"
              :label="$t('common.redirect_method')"
              outlined
              map-options
              emit-value
              dense
              flex
              style="width: 100%"
            />
          </div>
        </td>
        <td key="actions" class="actions-field" v-if="permission.edit">
          <q-btn outline class="row bg-primary text-white" @click="onSave()">
            {{ $t("btn.add") }}
          </q-btn>
          <q-btn outline color="main-color" class="row" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
        </td>
      </tr>
    </q-markup-table>

    <q-markup-table square class="q-pa-sm !overflow-x-auto" :class="backgroundColor">
      <thead class="bg-success">
        <tr>
          <th v-for="item in tableColumn">{{ item.label }}</th>
        </tr>
      </thead>

      <VueDraggableNext class="drag-container" :list="tableData" tag="tbody" @end="onDragEnd" @start="onDragStart">
        <tr v-for="(item, index) in tableData" :key="index" v-if="tableData.length">
          <template v-if="!item.edit">
            <td key="id">
              {{ item.id }}
              <q-icon
                name="menu"
                @mouseenter="onDragStart"
                @touchstart="onDragStart"
                @click="onDragStart"
                style="font-size: 1.5em"
              />
            </td>
            <td key="title">
              <q-input
                v-model="item.title"
                outlined
                :label="$t('common.home_page_new_banner_title')"
                readonly
                @click="showEdit(item.id)"
              />
            </td>
            <td key="time" class="main-date-field" style="width: 375px">
              <DateTimePicker
                :date-time-model="item.dateRange"
                class="edit-input"
                :label="$t('table_header.display_time')"
                :with-outlined="true"
                :with-borderless="false"
                :useTimePicker="true"
                :readonly="true"
                @click="showEdit(item.id)"
              />
            </td>

            <td key="image_preview" class="image-preview_expanded_row">
              <div class="row no-wrap" @click="showEdit(item.id)">
                <span class="uploader-language-code">{{ Object.keys(item.imgPath)[0] }}</span>
                <PreviewImage
                  :parent-image="item.imgPath[Object.keys(item.imgPath)[0]]"
                  :default-image="websiteHomeBannerDefault()"
                  :aspect-ratio="'270/70'"
                  disabled
                />
              </div>
            </td>
            <td key="link" class="image-preview_expanded_row">
              <div class="row no-wrap">
                <q-input
                  v-model="item.link"
                  dense
                  outlined
                  :placeholder="$t('common.enter_link')"
                  style="width: 100%"
                  readonly
                />
              </div>
              <div class="row no-wrap">
                <q-select
                  v-bind="attrs"
                  v-model="item.opening_method"
                  :options="link_options"
                  :label="$t('common.redirect_method')"
                  outlined
                  map-options
                  emit-value
                  dense
                  flex
                  style="width: 100%"
                  readonly
                />
              </div>
            </td>
            <td key="actions" v-if="permission.edit">
              <q-btn flat color="red" icon="delete" @click="onDelete(item.id)" />
            </td>
          </template>
          <template v-else-if="item.expand && item.edit">
            <td key="id" />
            <td key="title">
              <q-input v-model="item.title" outlined :label="$t('common.home_page_new_banner_title')" />
            </td>
            <td key="time">
              <DateTimePicker
                :date-time-model="item.dateRange"
                class="edit-input"
                :label="$t('table_header.display_time')"
                :with-outlined="true"
                :with-borderless="false"
                :useTimePicker="true"
                :on-update-date-time="(value) => onDateChange(value, index)"
              />
            </td>
            <td key="image_preview" class="image-preview_expanded_row">
              <div v-for="(imgitem, key) in item.imgPath" :key="imgitem" class="row no-wrap">
                <span class="uploader-language-code">{{ key }}</span>
                <div>
                  <PreviewImage
                    :parent-image="imgitem"
                    :default-image="websiteHomeBannerDefault()"
                    :aspect-ratio="'270/70'"
                    :max-file-size="512000"
                    @update:modelValue="updateListImgUrl($event, item.id, key)"
                    imageToBase64
                  />
                </div>
                <div class="q-ml-sm column justify-center" v-if="permission.edit">
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
            </td>
            <td key="link" class="image-preview_expanded_row">
              <div class="row no-wrap">
                <q-input
                  v-model="item.link"
                  dense
                  outlined
                  :placeholder="$t('common.enter_link')"
                  style="width: 100%"
                />
              </div>
              <div class="row no-wrap">
                <q-select
                  v-bind="attrs"
                  v-model="item.opening_method"
                  :options="link_options"
                  :label="$t('common.redirect_method')"
                  outlined
                  map-options
                  emit-value
                  dense
                  flex
                  style="width: 100%"
                />
              </div>
            </td>
            <td key="actions" v-if="permission.edit">
              <q-btn color="green" flat class="q-mr-xs" icon="save" @click="onUpdate(item.id)"></q-btn>
            </td>
          </template>
        </tr>
        <!-- 查無資料 -->
        <tr v-else>
          <td colspan="99">
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </td>
        </tr>
      </VueDraggableNext>
    </q-markup-table>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_banner") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted, nextTick, toRefs, useAttrs, watch } from "vue"
  import type { QTableProps } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useDialog } from "@/hook/useDialog"
  import { VueDraggableNext } from "vue-draggable-next"
  import { useCommon } from "@/hook/useCommon"

  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
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
  import { useSiteStore } from "@/stores/siteStore"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import { useEnv } from "src/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useTimeZoneStore } from "@/stores/timezoneStore"

  const siteStore = useSiteStore()
  const timezoneStore = useTimeZoneStore()
  const props = defineProps({
    position: {
      type: Number,
      required: false,
      default: 1
    },
    gameCode: {
      type: Number,
      required: true,
      default: 0
    },
    productCode: {
      type: Number,
      required: true,
      default: 0
    },
    backgroundColor: {
      type: String,
      required: false,
      default: "bg-light-blue-1"
    }
  })
  const attrs = useAttrs()
  const { position, gameCode, productCode, backgroundColor } = toRefs(props)
  const { permission } = usePermission()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const link_options = computed(() => [
    { label: t("common.new_tab"), value: 0 },
    { label: t("common.redirect"), value: 1 }
  ])
  function onDragStart() {
    tableData.value.forEach((item) => {
      item.expand = false
    })
  }
  async function onDragEnd() {
    await nextTick()

    //tableData.value = sortByEdit(tableData.value)

    const sortedData = updateSortsAndGenerateOutput(tableData.value)

    const sendData = {
      ids: sortedData.ids,
      sorts: sortedData.sorts
    }

    const { code, msg } = await updateBannerSettingSort(sendData)
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
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
      tableData.value.length = 0
      cloneTableData.value.length = 0
      getBannerList()
    }
  }
  /*function sortByEdit(data: any) {
    let A: BannerSetting[] = []
    let B: BannerSetting[] = []

    // 将数据拆分为两个数组
    data.forEach((item) => {
      if (item.edit) {
        A.push(item)
      } else {
        B.push(item)
      }
    })

    const editMap = new Map()
    A.forEach((item) => {
      if (!editMap.has(item.id)) {
        editMap.set(item.id, [])
      }
      editMap.get(item.id).push(item)
    })

    // 重新组合 `B` 和 `A` 数组
    const result: BannerSetting[] = []
    B.forEach((item) => {
      result.push(item)
      // 如果在 `editMap` 中找到相同 `id` 的元素，将其添加到 `result` 数组中
      if (editMap.has(item.id)) {
        result.push(...editMap.get(item.id))
        editMap.delete(item.id) // 删除该 id，避免重复添加
      }
    })

    return result
  }*/
  function updateSortsAndGenerateOutput(data: any[]): { ids: number[]; sorts: number[] } {
    // 创建一个 set，用于存储唯一的 id
    const idsSet = new Set<number>()
    // 创建一个映射，用于跟踪每个 id 的首次出现的索引
    const idFirstOccurrence = new Map<number, number>()
    // 创建一个数组用于存储 ids 的顺序
    const idsArray: number[] = []

    // 过滤掉带有 edit: true 的元素
    data = data.filter((item) => !item.edit)

    // 遍历数据，并记录唯一 id 和它们的首次出现索引
    data.forEach((item, index) => {
      const id = item.id
      if (!idsSet.has(id)) {
        idsSet.add(id)
        idFirstOccurrence.set(id, index)
        idsArray.push(id)
      }
    })

    // 创建 sortsArray，用于存储 id 的首次出现索引
    const sortsArray = idsArray.map((id) => idFirstOccurrence.get(id) as number)

    // 返回 ids 和 sorts 数组
    return {
      ids: idsArray,
      sorts: sortsArray
    }
  }

  onMounted(async () => {
    getBannerList()
    newBannerdateTimeRange.value = `${newBannerForm.value.dateRange.from}  ~ ${newBannerForm.value.dateRange.to}`
    siteStore.langList.forEach((lang) => {
      newBannerForm.value.images.push({
        lang: lang.label,
        image: ""
      })
    })
  })
  const disabledDrag = ref(true)

  const showNewBanner = ref(false)
  type TypeDate = {
    from: string | undefined
    to: string | undefined
  }

  const { genTimeFormat } = useCommon()
  const { formatDate, formatDateTime, formatTime } = useRfc3339()

  const nowDate = genTimeFormat(new Date(), "yyyy-MM-dd")
  const newBannerdateTimeRange = ref("")

  const newBannerForm = ref<{
    title: string
    date: TypeDate
    dateRange: {
      from: string
      to: string
      fromHms: string
      toHms: string
    }
    images: Array<{
      lang: string
      image: string
    }>
    link: string
    opening_method: number
  }>({
    title: "",
    date: { from: nowDate, to: nowDate },
    dateRange: {
      from: nowDate,
      to: nowDate,
      fromHms: "00:00:00",
      toHms: "23:59:59"
    },
    images: [],
    link: "",
    opening_method: 0
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

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      { name: "id", label: t("table_header.sequence"), field: "id", sortable: false, align: "left" },
      { name: "title", label: t("table_header.title"), field: "title", sortable: false, align: "center" },
      {
        name: "time",
        label: t("table_header.display_time"),
        field: "time",
        sortable: false,
        align: "center"
      },
      {
        name: "image_preview",
        label: t("table_header.picture_preview"),
        field: "image_preview",
        sortable: false,
        align: "center"
      },
      {
        name: "link",
        label: t("common.link"),
        field: "link",
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

    // 如果無編輯權限 就把 checkbox 和 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })
  const tableColumn2 = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      { name: "title", label: t("table_header.title"), field: "title", sortable: false, align: "center" },
      {
        name: "time",
        label: t("table_header.display_time"),
        field: "time",
        sortable: false,
        align: "center"
      },
      {
        name: "image_preview",
        label: t("table_header.picture_preview"),
        field: "image_preview",
        sortable: false,
        align: "center"
      },
      {
        name: "link",
        label: t("common.link"),
        field: "link",
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

    // 如果無編輯權限 就把 checkbox 和 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

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
    date: TypeDate
    edit: boolean
    expand: boolean
    dateRange: {
      from: string
      to: string
      fromHms: string
      toHms: string
    }
    link: string
    opening_method: number
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

  const $q = useQuasar()

  type BannerParamType = {
    position: number
    game_type?: string
    product_code?: string
  }
  const getBannerParam = (): BannerParamType => {
    const baseData = { position: position.value }
    const additionalData: { [key: string]: any } = {}

    if (position.value >= 2) {
      additionalData.game_type = gameCode.value
    }

    if (position.value >= 3) {
      additionalData.product_code = productCode.value
    }

    return { ...baseData, ...additionalData }
  }

  const getBannerDisplayDateRange = (item: Pick<BannerSetting, "start_date" | "end_date">) => {
    return {
      from: formatDate(item.start_date),
      to: formatDate(item.end_date),
      fromHms: formatTime(item.start_date) || "00:00:00",
      toHms: formatTime(item.end_date) || "23:59:59"
    }
  }

  const isBannerDateRangeDirty = (item: BannerSetting) => {
    const defaultDateRange = getBannerDisplayDateRange(item)
    return (
      item.dateRange.from !== defaultDateRange.from ||
      item.dateRange.to !== defaultDateRange.to ||
      item.dateRange.fromHms !== defaultDateRange.fromHms ||
      item.dateRange.toHms !== defaultDateRange.toHms
    )
  }

  const getBannerList = async () => {
    let sendData = getBannerParam()

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
        //把沒有的語系加上去
        const updatedData = data.map((item) => {
          if (item.image_json == null || typeof item.image_json !== "object") {
            item.image_json = {}
          }
          siteStore.langList.forEach(({ label }) => {
            if (!item.image_json[label]) {
              item.image_json[label] = ""
            }
          })
          return item
        })
        cloneTableData.value = updatedData.map((item) => {
          // 使用 reduce 函数为每个项目的 image_json 创建独立的 imgPath 映射
          const imgPath = Object.keys(item.image_json).reduce((acc: Record<string, string>, key) => {
            const relativePath = item.image_json[key]
            /*const absolutePath = relativeToAbsoluteResource(relativePath)
              acc[key] = absolutePath["href"]*/
            if (relativePath === "") {
              acc[key] = ""
            } else {
              acc[key] = `${VITE_APP_BASE_API}/${relativePath}?updateTime=${item.updated_time}`
            }
            return acc
          }, {})

          // 返回更新后的对象，包括独立的 imgPath
          const dateRange = getBannerDisplayDateRange(item)
          return {
            ...item,
            imgPath,
            date: {
              from: formatDateTime(item.start_date),
              to: formatDateTime(item.end_date)
            },
            dateRange,
            expand: false
          }
        })

        //API無提供 遊戲大廳跟產品大廳的分類參數
        if (gameCode.value !== 0 && productCode.value !== 0) {
          //遊戲大廳
          cloneTableData.value = cloneTableData.value.filter(
            (item) => item.game_type === gameCode.value && item.product_code === productCode.value
          )
        } else if (gameCode.value !== 0 && productCode.value === 0) {
          //產品大廳
          cloneTableData.value = cloneTableData.value.filter((item) => item.game_type === gameCode.value)
        }

        cloneTableData.value.forEach((item) => {
          tableData.value.push(item)
          const copiedItem = { ...item }
          copiedItem.edit = true
          tableData.value.push(copiedItem)
        })
        console.log(tableData.value)
      }
    }
  }

  const updateBannerDisplayTime = (item: BannerSetting) => {
    // 可編輯列若已改過時間（dirty），切換時區時不要覆蓋使用者輸入
    if (item.edit && isBannerDateRangeDirty(item)) return
    const dateRange = getBannerDisplayDateRange(item)
    item.date = {
      from: formatDateTime(item.start_date),
      to: formatDateTime(item.end_date)
    }
    item.dateRange = dateRange
  }

  watch(
    () => timezoneStore.targetOffsetMinutes,
    () => {
      cloneTableData.value.forEach((item) => updateBannerDisplayTime(item))
      tableData.value.forEach((item) => updateBannerDisplayTime(item))
    }
  )

  const errorMsg = (err: string) => {
    $q.notify({
      color: "green",
      message: t(err),
      position: "top",
      timeout: 1000
    })
  }
  const onSave = async () => {
    if (newBannerForm.value.title === "") {
      errorMsg("common.please_enter_title")
      return
    } else if (newBannerForm.value.dateRange.from === "" || newBannerForm.value.dateRange.to === "") {
      errorMsg("error_msg.please_enter_date")
      return
    }
    for (const imageObj of newBannerForm.value.images) {
      if (imageObj.image === "") {
        errorMsg("error_msg.pictures_not_uploaded")
        // console.error(`Image for language '${imageObj.lang}' is empty.`)
        return
      }
    }
    const images = (newBannerForm.value.images as Array<{ lang: string; image: string }>).reduce(
      (acc, { lang, image }) => {
        acc[lang] = image
        return acc
      },
      {} as Record<string, string>
    )

    //const images = newBannerForm.value.images.map(({ lang, image }) => ({ lang, image }))
    let param = getBannerParam()

    const sendData: TypeNewBannerForm = {
      title: newBannerForm.value.title,
      start_date:
        genTimeFormat(
          new Date(`${newBannerForm.value.dateRange.from} ${newBannerForm.value.dateRange.fromHms}` || ""),
          "yyyy-MM-dd HH:mm:ss",
          false
        ) || "",
      end_date:
        genTimeFormat(
          new Date(`${newBannerForm.value.dateRange.to} ${newBannerForm.value.dateRange.toHms}` || ""),
          "yyyy-MM-dd HH:mm:ss",
          false
        ) || "",
      link: newBannerForm.value.link,
      opening_method: newBannerForm.value.opening_method,
      images
    }

    sendData.position = param.position
    if (param.game_type !== undefined) {
      sendData.game_type = param.game_type
    }
    if (param.product_code !== undefined) {
      sendData.product_code = param.product_code
    }

    const { code, msg } = await addBannerSetting(sendData)
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
      tableData.value.length = 0
      cloneTableData.value.length = 0

      getBannerList()
      onCancel()
      resetNewBanner()
    }

    console.log(sendData)
  }

  const onAction = () => {
    if (!showNewBanner.value) {
      showNewBanner.value = true
      if (newBannerForm.value.images.length <= 0) {
        siteStore.langList.forEach((lang) => {
          newBannerForm.value.images.push({
            lang: lang.label,
            image: ""
          })
        })
      }
    } else {
      showNewBanner.value = false
    }
  }

  const onCancel = () => {
    //resetNewBanner()
    showNewBanner.value = false
  }

  const resetNewBanner = () => {
    newBannerForm.value.images = []
    newBannerForm.value.title = ""
    newBannerForm.value.date = { from: nowDate, to: nowDate }
    siteStore.langList.forEach((lang) => {
      newBannerForm.value.images.push({
        lang: lang.label,
        image: ""
      })
    })
    newBannerForm.value.dateRange = {
      from: nowDate || "",
      to: nowDate || "",
      fromHms: "00:00:00",
      toHms: "23:59:59"
    }
    newBannerForm.value.link = ""
    newBannerForm.value.opening_method = 0
  }
  const onUpdate = async (id: number) => {
    const row = tableData.value.find((row) => row.id === id && row.edit)
    if (row) {
      if (row.title === "") {
        errorMsg("common.please_enter_title")
        return
      } else if (row.dateRange.from === "" || row.dateRange.to === "") {
        errorMsg("error_msg.please_enter_date")
        return
      }
      for (const [key, value] of Object.entries(row.imgPath)) {
        if (value === "") {
          errorMsg("error_msg.pictures_not_uploaded")
          return
        }
      }
      const imagePath: { [key: string]: string } = {}

      for (let key in row.imgPath) {
        if (row.imgPath.hasOwnProperty(key)) {
          let pathWithoutQuery = row.imgPath[key].split("?")[0]
          imagePath[key] = pathWithoutQuery.replace(/^https:\/\/[^\/]+\//, "")
        }
      }

      const sendData = {
        id: id,
        title: row.title,
        start_date:
          genTimeFormat(
            new Date(`${row.dateRange.from} ${row.dateRange.fromHms}` || ""),
            "yyyy-MM-dd HH:mm:ss",
            false
          ) || "",
        end_date:
          genTimeFormat(new Date(`${row.dateRange.to} ${row.dateRange.toHms}` || ""), "yyyy-MM-dd HH:mm:ss", false) ||
          "",
        position: 1,
        link: row.link,
        opening_method: row.opening_method,
        images: imagePath
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
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
        getBannerList()
      }
    }
  }
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closDeleteDialog,
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
    const { code, msg } = await deleteBannerSettingList(dialogDataId.value)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      getBannerList()
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 300
      })
    }
    closeDeleteLoading()
    closDeleteDialog()
  }

  const showEdit = (id: number) => {
    tableData.value.forEach((item) => {
      if (item.id === id) {
        item.expand = !item.expand
      } else {
        item.expand = false
      }
    })
  }

  function onNewBannerDateChange(value: { from?: string; to?: string; fromHms?: string; toHms?: string } | string) {
    console.log(value)
    if (value !== null) {
      if (typeof value === "string") {
        newBannerForm.value.dateRange.from = value
        newBannerForm.value.dateRange.to = value
      } else {
        newBannerForm.value.dateRange.from = value.from
        newBannerForm.value.dateRange.to = value.to
        newBannerForm.value.dateRange.fromHms = value.fromHms || "00:00:00"
        newBannerForm.value.dateRange.toHms = value.toHms || "23:59:59"
      }
    } else {
      newBannerForm.value.dateRange.from = ""
      newBannerForm.value.dateRange.to = ""
      newBannerForm.value.dateRange.fromHms = "00:00:00"
      newBannerForm.value.dateRange.toHms = "23:59:59"
    }
  }
  function onDateChange(
    value: { from?: string; to?: string; fromHms?: string; toHms?: string } | string,
    index: number
  ) {
    console.log(tableData.value[index])
    if (value !== null) {
      if (typeof value === "string") {
        tableData.value[index].dateRange.from = value
        tableData.value[index].dateRange.to = value
      } else {
        tableData.value[index].dateRange.from = value.from || ""
        tableData.value[index].dateRange.to = value.to || ""
        tableData.value[index].dateRange.fromHms = value.fromHms || "00:00:00"
        tableData.value[index].dateRange.toHms = value.toHms || "23:59:59"
      }
    } else {
      tableData.value[index].dateRange.from = ""
      tableData.value[index].dateRange.to = ""
      tableData.value[index].dateRange.fromHms = "00:00:00"
      tableData.value[index].dateRange.toHms = "23:59:59"
    }
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
    width: 45px;
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

  .q-markup-table {
    border-radius: 0 0 15px 15px;
  }
</style>
