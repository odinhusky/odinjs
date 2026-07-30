<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPageOnlyTitle :backLabelI18nKey="isEditMode ? 'btn.edit' : 'btn.add'" />

    <q-form @submit="handleSubmit">
      <q-card flat class="cms-custom-page-wrapper">
        <q-card-section class="cms-custom-page-header">
          <!-- 頁面標題 -->
          <div class="header-content">
            <div class="header-title">{{ $t("cms.page_title") }}</div>
            <q-input
              v-model="cmsForm.title"
              dense
              outlined
              class="cms-form-input"
              :placeholder="$t('common.please_enter_content')"
              lazy-rules
              :rules="[Rules.required()]"
              hide-bottom-space
            ></q-input>
          </div>
          <!-- 頁面網址 -->
          <div v-if="isEditMode" class="header-content">
            <div class="header-title">{{ $t("cms.page_url") }}</div>
            <div class="header-url">cmsCustomPage/{{ cmsId }}</div>
          </div>
        </q-card-section>

        <!-- 自訂頁面 -->
        <q-card-section class="cms-custom-page-body">
          <div class="page-componets">
            <div class="page-components-header-content">
              <div class="page-components-header-title">{{ $t("cms.add_block") }}</div>
              <div class="page-components-header-tip">
                <q-icon name="info"></q-icon> {{ $t("cms.click_or_drag_to_add") }}
              </div>
            </div>
            <VueDraggableNext
              v-model="pageComponets"
              :group="{ name: 'shared', pull: 'clone', put: false }"
              :clone="cloneItem"
              :sort="false"
              class="drag-componets"
            >
              <DragComponents
                v-for="item in pageComponets"
                :key="item.type"
                :id="item.type"
                @click="handleEntranceAdd(item)"
                class="cursor-pointer"
              />
            </VueDraggableNext>
          </div>

          <div class="custom-page">
            <div class="phone-frame" ref="phoneFrameRef">
              <div class="shared-wrapper" ref="sharedWrapperRef">
                <div class="shared-content" @scroll="onSharedWrapperScroll" ref="sharedContentRef">
                  <VueDraggableNext
                    v-model="cmsForm.entrance"
                    group="shared"
                    @end="onDragEnd"
                    class="draggable-content"
                  >
                    <div
                      v-for="(entrance, entranceIndex) in cmsForm.entrance"
                      :key="entranceIndex"
                      :ref="(el) => setItemRef(el, entranceIndex)"
                      class="shared-item"
                      :class="{ active: selectedEntranceIndex === entranceIndex }"
                      :style="getEntranceStyle(entrance)"
                      @click="selectEntrance(entrance, entranceIndex)"
                    >
                      <DisplayComponents :entrance="entrance" />
                    </div>
                  </VueDraggableNext>
                </div>
              </div>
              <!-- 元件類型標籤 - 放在 phone-frame 層級 -->
              <div
                v-if="selectedEntranceIndex !== null && dialogData.entrance && isSelectedItemVisible"
                class="component-type-label"
                :style="labelPosition"
              >
                {{ $t(CMS_PAGE_COMPONENT_TYPE.I18nKeys[dialogData.entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums]) }}
              </div>
              <!-- 控制按鈕 - 放在 phone-frame 層級 -->
              <div
                v-if="selectedEntranceIndex !== null && isSelectedItemVisible"
                class="entrance-controls"
                :style="controlsPosition"
              >
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  class="control-btn up-btn"
                  @click.stop="moveEntranceUp(selectedEntranceIndex)"
                  :disable="selectedEntranceIndex === 0"
                >
                  <q-icon name="keyboard_arrow_up" color="white" />
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  class="control-btn down-btn"
                  @click.stop="moveEntranceDown(selectedEntranceIndex)"
                  :disable="selectedEntranceIndex === cmsForm.entrance.length - 1"
                >
                  <q-icon name="keyboard_arrow_down" color="white" />
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  class="control-btn delete-btn"
                  @click.stop="onEntranceRemove(selectedEntranceIndex + 1)"
                >
                  <q-icon name="delete" color="white" />
                </q-btn>
              </div>
            </div>
          </div>

          <!-- 編輯面板 -->
          <div class="edit-panel-wrapper">
            <template v-if="selectedEntranceIndex !== null && dialogData.entrance">
              <div class="edit-panel-header">
                <div>
                  <span class="edit-panel-title">{{
                    $t(CMS_PAGE_COMPONENT_TYPE.I18nKeys[dialogData.entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums])
                  }}</span>
                </div>
                <q-tabs
                  v-model="editPanelTab"
                  dense
                  class="edit-panel-tabs"
                  active-color="white"
                  indicator-color="transparent"
                >
                  <q-tab name="style" :label="$t('aiAssistant.style')" class="edit-tab" />
                  <q-tab name="content" :label="$t('table_header.content')" class="edit-tab" />
                </q-tabs>
              </div>
              <div class="edit-panel-content">
                <q-tab-panels v-model="editPanelTab" animated class="edit-tab-panels bg-transparent">
                  <q-tab-panel name="style" class="q-pa-none">
                    <StyleComponents :entrance="dialogData.entrance" />
                  </q-tab-panel>
                  <q-tab-panel name="content" class="q-pa-none content-panel">
                    <EditComponents :entrance="dialogData.entrance" />
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </template>
            <template v-else>
              <div class="recommend-template-content">
                <div>{{ $t("cms.recommended_template") }}</div>
                <div class="recommend-templates">
                  <q-img
                    v-for="template in showTemplates"
                    :src="cmsRecommendCard(template.id)"
                    loading="lazy"
                    :class="{ active: template.id === dialogData.template.id }"
                    @click="onEntranceTemplate(template)"
                  ></q-img>
                </div>
              </div>
            </template>
            <div class="submit-btns">
              <q-btn
                outline
                color="main-color"
                class="submit-btn"
                size="md"
                :to="{ name: backRouteName }"
                :loading="isLoading"
              >
                {{ $t("btn.cancel") }}
              </q-btn>
              <q-btn color="main-color" class="submit-btn" size="md" type="submit" :loading="isLoading">
                {{ $t("btn.save") }}
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp
    v-model="entranceRemoveDialog"
    :configs="dialogConfigs.remove"
    :loading="entranceRemoveLoading"
    width="400px"
  >
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_information") }}</div>
    </template>
  </dialog-comp>

  <!-- 組件彈窗 -->

  <template v-if="CMS_PAGE_COMPONENT_TYPE.UseFakeDialog[dialogData.entrance?.type as CMS_PAGE_COMPONENT_TYPE.Enums]">
    <fake-dialog-comp
      v-model="customComponentDialog"
      :configs="dialogConfigs.customComponent"
      :loading="customComponentLoading"
      :max-width="CMS_PAGE_COMPONENT_TYPE.DialogWidth[dialogData.entrance?.type as CMS_PAGE_COMPONENT_TYPE.Enums] || ''"
      persistent
    >
      <template #mainContent>
        <EditComponents :entrance="dialogData.entrance" />
      </template>
    </fake-dialog-comp>
  </template>
  <template v-else>
    <dialog-comp
      v-model="customComponentDialog"
      :configs="dialogConfigs.customComponent"
      :loading="customComponentLoading"
      :max-width="CMS_PAGE_COMPONENT_TYPE.DialogWidth[dialogData.entrance?.type as CMS_PAGE_COMPONENT_TYPE.Enums] || ''"
      persistent
    >
      <template #mainContent>
        <EditComponents :entrance="dialogData.entrance" />
      </template>
    </dialog-comp>
  </template>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="templateDialog" :configs="dialogConfigs.template" :loading="templateLoading" width="400px">
    <template #mainContent>
      <div>{{ $t("cms.apply_this_template") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, ref, nextTick, watch } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { clone } from "ramda"
  import { useCommon } from "src/hook/useCommon"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { useDialog } from "@/hook/useDialog"
  import { CMS_TYPE, CMS_PAGE_COMPONENT_TYPE, GAME_TYPE, CMS_OPENING_METHOD } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import DragComponents from "./components/DragComponents/Index.vue"
  import DisplayComponents from "./components/DisplayComponents/Index.vue"
  import { getDefaultStyle } from "./components/StyleComponents/defaults"
  import EditComponents from "./components/EditComponents/Index.vue"
  import StyleComponents from "./components/StyleComponents/Index.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import FakeDialogComp from "@/components/dialogs/FakeDialog.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { TemplateData } from "./template/data/index"

  const route = useRoute()
  const { t } = useI18n()
  const $q = useQuasar()
  const { numberEnumToArray } = useCommon()
  const { cmsRecommendCard } = useImage()
  const Rules = useRule()
  const {
    isLoading,
    cmsForm,
    handleGetCmsDetail,
    initCmsForm,
    handleEditCmsItem,
    handleAddCmsItem,
    initEntrance,
    titleLangObj,
    pageLangObj,
    parseEntranceList
  } = useCms()

  const pageComponets = ref<{ type: CMS_PAGE_COMPONENT_TYPE.Enums; payload: Request.CmsEntranceItem["payload"] }[]>([])
  const backRouteName = "CmsCustomPageList"
  const cmsId = computed(() => Number(route.params.id) || 0)
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })

  // 編輯面板相關
  const selectedEntranceIndex = ref<number | null>(null)
  const editPanelTab = ref("content")

  // DOM refs 用於計算位置
  const phoneFrameRef = ref<HTMLElement | null>(null)
  const sharedWrapperRef = ref<HTMLElement | null>(null)
  const sharedContentRef = ref<HTMLElement | null>(null)
  const itemRefs = ref<Map<number, HTMLElement>>(new Map())
  const selectedItemPosition = ref({ top: 0, height: 0, isVisible: true })

  const setItemRef = (el: any, index: number) => {
    if (el) {
      itemRefs.value.set(index, el as HTMLElement)
    } else {
      // 元素被移除時清除引用
      itemRefs.value.delete(index)
    }
  }

  const updateSelectedItemPosition = () => {
    if (selectedEntranceIndex.value === null) return

    const phoneFrameEl = phoneFrameRef.value
    const contentEl = sharedContentRef.value

    if (!phoneFrameEl || !contentEl) return

    // 直接從 DOM 查詢選中的元素，而不是依賴 itemRefs
    const sharedItems = contentEl.querySelectorAll(".shared-item")
    const itemEl = sharedItems[selectedEntranceIndex.value] as HTMLElement

    if (itemEl) {
      const itemRect = itemEl.getBoundingClientRect()
      const frameRect = phoneFrameEl.getBoundingClientRect()
      const contentRect = contentEl.getBoundingClientRect()

      // 計算元件相對於 phone-frame 的位置
      const relativeTop = itemRect.top - frameRect.top

      // 判斷元件是否在可視區域內（至少有一部分可見）
      const isVisible = itemRect.bottom > contentRect.top && itemRect.top < contentRect.bottom

      selectedItemPosition.value = {
        top: relativeTop,
        height: itemRect.height,
        isVisible
      }
    }
  }

  // 判斷選中元件是否可見
  const isSelectedItemVisible = computed(() => selectedItemPosition.value.isVisible)

  // 計算標籤位置
  const labelPosition = computed(() => {
    return {
      top: `${selectedItemPosition.value.top - 30}px`,
      left: "2rem"
    }
  })

  // 計算控制按鈕位置
  const controlsPosition = computed(() => {
    const centerOffset = selectedItemPosition.value.height / 2 - 48 // 按鈕組高度的一半
    return {
      top: `${selectedItemPosition.value.top + centerOffset}px`,
      right: "1.2rem"
    }
  })

  // 滾動時更新位置
  const onSharedWrapperScroll = () => {
    updateSelectedItemPosition()
  }

  // 監聽選中狀態變化，更新位置
  watch(selectedEntranceIndex, () => {
    nextTick(() => {
      updateSelectedItemPosition()
    })
  })

  // 根據元件獲取對應的樣式設定（直接從 entrance.payload.style 讀取）
  const getEntranceStyle = (entrance: Request.CmsEntranceItem) => {
    const style = entrance.payload?.style

    return {
      marginBottom: style?.marginBottom ? `${style.marginBottom}px` : undefined
    }
  }

  type TemplateEntrance = Omit<Request.CmsEntranceItem, "img" | "is_editable" | "payload"> & {
    img?: string
    is_editable?: boolean
    payload?: Request.CmsEntranceItem["payload"] & {
      nested_entrance?: TemplateEntrance[]
    }
  }

  interface RawTemplate {
    id: number
    entrance: TemplateEntrance[]
  }

  interface SelectedTemplate {
    id: number
    entrance: Request.CmsEntranceItem[]
  }

  const normalizeTemplateEntrances = (
    entrances: TemplateEntrance[],
    parentType?: number
  ): Request.CmsEntranceItem[] => {
    return entrances.map((item) => {
      const clonedItem = clone(item) as TemplateEntrance
      const nestedEntrances = clonedItem.payload?.nested_entrance
        ? normalizeTemplateEntrances(clonedItem.payload.nested_entrance, clonedItem.type)
        : undefined
      const payload = {
        ...(clonedItem.payload ?? ({} as Request.CmsEntranceItem["payload"])),
        nested_entrance: nestedEntrances
      }

      // 將 nested 項目的 imgFileName 改用父層 type 的預設圖名稱,使其與「新增區塊」行為一致
      const defaultParentImage =
        parentType !== undefined ? CMS_PAGE_COMPONENT_TYPE.ImageName[parentType as CMS_PAGE_COMPONENT_TYPE.Enums] : ""
      const imgFileName = defaultParentImage || (clonedItem as any).imgFileName

      const merged = {
        ...clonedItem,
        img: clonedItem.img ?? "",
        is_editable: clonedItem.is_editable ?? true,
        ...(imgFileName !== undefined ? { imgFileName } : {}),
        payload
      } as Request.CmsEntranceItem

      return injectDefaultStyle(merged)
    })
  }
  const templateIds = ref([1, 2, 3, 4])
  const showTemplates = computed<RawTemplate[]>(() =>
    (TemplateData as RawTemplate[]).filter((template) => templateIds.value.includes(template.id))
  )

  // 為 entrance 注入對應類型的預設 style（缺少時才補上）
  const injectDefaultStyle = <T extends { type: number; payload?: any }>(entrance: T): T => {
    const currentStyle = entrance.payload?.style || {}
    return {
      ...entrance,
      payload: {
        ...(entrance.payload || {}),
        style: { ...getDefaultStyle(entrance.type), ...currentStyle }
      }
    }
  }

  //#region drag
  const cloneItem = (original: Request.CmsEntranceItem) => {
    return injectDefaultStyle(original)
  }

  const handleEntranceAdd = (item: {
    type: CMS_PAGE_COMPONENT_TYPE.Enums
    payload: Request.CmsEntranceItem["payload"]
  }) => {
    const clonedItem = cloneItem(item as Request.CmsEntranceItem)
    cmsForm.value.entrance.push(clonedItem)
  }

  interface DragEndEvent {
    oldIndex: number
    originalEvent: MouseEvent
  }

  const onDragEnd = (evt: DragEndEvent) => {
    const shared = document.querySelector(".shared-wrapper") as HTMLElement | null
    if (!shared) return

    const rect = shared.getBoundingClientRect()

    // 滑鼠放開時的位置
    const x = evt.originalEvent.clientX
    const y = evt.originalEvent.clientY

    // 判斷是否還在 shared-wrapper 範圍內
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (!inside && evt.oldIndex !== undefined) {
      onEntranceRemove(evt.oldIndex + 1)
    }
  }
  //#endregion drag

  const handleSubmit = () => {
    // 送出前補齊每個 entrance 的 style 預設值
    cmsForm.value.entrance = (cmsForm.value.entrance || []).map((e) => injectDefaultStyle(e))

    if (!cmsForm.value.entrance.length) {
      $q.notify({
        type: "negative",
        message: t("error_msg.entrance_required"),
        position: "top",
        timeout: 1000
      })
      return
    }

    if (isEditMode.value) {
      handleEditCmsItem(backRouteName)
      return
    }
    handleAddCmsItem(backRouteName)
  }

  // dialog
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEntranceRemove
    },
    customComponent: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleCustomComponent,
      showLabelCloseBtn: true
    },
    template: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEntranceTemplate
    }
  })
  const dialogData = reactive<{
    removeIndex: number
    entranceIndex: number
    entrance?: Request.CmsEntranceItem
    template: SelectedTemplate
  }>({
    removeIndex: 0,
    entranceIndex: 0,
    template: {
      id: 0,
      entrance: []
    }
  })

  const {
    dialog: entranceRemoveDialog,
    openDialog: openEntranceRemoveDialog,
    closeDialog: closeEntranceRemoveDialog,
    loading: entranceRemoveLoading,
    openLoading: openEntranceRemoveLoading,
    closeLoading: closeEntranceRemoveLoading
  } = useDialog()

  function onEntranceRemove(index: number) {
    dialogData.removeIndex = index
    openEntranceRemoveDialog()
  }

  function handleEntranceRemove() {
    openEntranceRemoveLoading()
    if (dialogData.removeIndex) {
      cmsForm.value.entrance.splice(dialogData.removeIndex - 1, 1)
      // 清除選中狀態
      selectedEntranceIndex.value = null
      dialogData.entrance = undefined
    }
    closeEntranceRemoveDialog()
    closeEntranceRemoveLoading()
  }

  const {
    dialog: customComponentDialog,
    openDialog: openCustomComponentDialog,
    closeDialog: closeCustomComponentDialog,
    loading: customComponentLoading,
    openLoading: openCustomComponentLoading,
    closeLoading: closeCustomComponentLoading
  } = useDialog()

  function onCustomComponent(entrance: Request.CmsEntranceItem, entranceIndex: number) {
    dialogConfigs.customComponent.dialogLabelI18nKey =
      CMS_PAGE_COMPONENT_TYPE.I18nKeys[entrance.type as CMS_PAGE_COMPONENT_TYPE.Enums]
    dialogData.entrance = clone(entrance)
    dialogData.entranceIndex = entranceIndex
    openCustomComponentDialog()
  }

  function handleCustomComponent() {
    openCustomComponentLoading()
    cmsForm.value.entrance.splice(dialogData.entranceIndex, 1, {
      ...dialogData.entrance
    } as Request.CmsEntranceItem)
    closeCustomComponentDialog()
    closeCustomComponentLoading()
  }

  // 選擇入口進行編輯（頁面內編輯，即時生效）
  function selectEntrance(entrance: Request.CmsEntranceItem, entranceIndex: number) {
    selectedEntranceIndex.value = entranceIndex
    dialogData.entrance = entrance // 直接引用原始數據，編輯即時生效
    dialogData.entranceIndex = entranceIndex
    editPanelTab.value = "content"
    nextTick(() => {
      updateSelectedItemPosition()
    })
  }

  // 延遲更新位置，確保 DOM 完全渲染
  const delayedUpdatePosition = () => {
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateSelectedItemPosition()
        })
      })
    })
  }

  // 上移元件
  function moveEntranceUp(index: number) {
    if (index > 0) {
      const temp = cmsForm.value.entrance[index]
      cmsForm.value.entrance[index] = cmsForm.value.entrance[index - 1]
      cmsForm.value.entrance[index - 1] = temp
      const newIndex = index - 1
      selectedEntranceIndex.value = newIndex
      dialogData.entranceIndex = newIndex
      dialogData.entrance = cmsForm.value.entrance[newIndex]
      delayedUpdatePosition()
    }
  }

  // 下移元件
  function moveEntranceDown(index: number) {
    if (index < cmsForm.value.entrance.length - 1) {
      const temp = cmsForm.value.entrance[index]
      cmsForm.value.entrance[index] = cmsForm.value.entrance[index + 1]
      cmsForm.value.entrance[index + 1] = temp
      const newIndex = index + 1
      selectedEntranceIndex.value = newIndex
      dialogData.entranceIndex = newIndex
      dialogData.entrance = cmsForm.value.entrance[newIndex]
      delayedUpdatePosition()
    }
  }

  const {
    dialog: templateDialog,
    openDialog: openTemplateDialog,
    closeDialog: closeTemplateDialog,
    loading: templateLoading,
    openLoading: openTemplateLoading,
    closeLoading: closeTemplateLoading
  } = useDialog()

  function onEntranceTemplate(template: RawTemplate) {
    dialogData.template.id = template.id
    dialogData.template.entrance = normalizeTemplateEntrances(template.entrance)
    openTemplateDialog()
  }

  async function handleEntranceTemplate() {
    openTemplateLoading()
    cmsForm.value.entrance = clone(dialogData.template.entrance) as Request.CmsEntranceItem[]
    await parseEntranceList(cmsForm.value.entrance)
    closeTemplateDialog()
    closeTemplateLoading()
  }
  // dialog

  onMounted(async () => {
    const list: { type: CMS_PAGE_COMPONENT_TYPE.Enums; payload: Request.CmsEntranceItem["payload"] }[] =
      await Promise.all(
        numberEnumToArray(CMS_PAGE_COMPONENT_TYPE.Enums).map(async (e) => {
          const type = e as CMS_PAGE_COMPONENT_TYPE.Enums
          let payload: Request.CmsEntranceItem["payload"] = {}

          if (type === CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER) {
            payload = {
              nested_entrance: [await initEntrance()]
            }
            if (payload.nested_entrance && payload.nested_entrance.length) {
              payload.nested_entrance[0].payload.opening_method = CMS_OPENING_METHOD.Enums.NEW_TAB
              payload.nested_entrance[0].imgFileName =
                CMS_PAGE_COMPONENT_TYPE.ImageName[CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER]
            }
          }
          if (type === CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE) {
            payload = {
              row_show: 1,
              nested_entrance: [await initEntrance()]
            }
            if (payload.nested_entrance && payload.nested_entrance.length) {
              payload.nested_entrance[0].payload.opening_method = CMS_OPENING_METHOD.Enums.NEW_TAB
              payload.nested_entrance[0].imgFileName =
                CMS_PAGE_COMPONENT_TYPE.ImageName[CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE]
            }
          }
          if (type === CMS_PAGE_COMPONENT_TYPE.Enums.TEXT) {
            payload = {
              page: clone(pageLangObj.value)
            }
          }
          if (type === CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE) {
            payload = {
              row_show: 3,
              row_num: 3,
              game_type_entrance_type: GAME_TYPE.ENTRANCE_TYPE.SINGLE_ENTRY,
              game_type_id: GAME_TYPE.Enums.LIVECASINO
            }
          }

          return { type, payload }
        })
      )

    pageComponets.value = list

    if (isEditMode.value && cmsId.value) {
      await handleGetCmsDetail(cmsId.value, CMS_TYPE.Enums.CUSTOM_PAGE)
      // 舊資料可能沒有 style，補齊預設值
      cmsForm.value.entrance = (cmsForm.value.entrance || []).map((e) => injectDefaultStyle(e))
    } else {
      initCmsForm(CMS_TYPE.Enums.CUSTOM_PAGE)
      const defaultEntrances: Request.CmsEntranceItem[] = clone(list).map((component, index) =>
        injectDefaultStyle({
          type: component.type,
          payload: component.payload,
          lang: clone(titleLangObj.value),
          img: "",
          is_editable: true,
          sort: index + 1
        })
      )

      cmsForm.value.entrance = defaultEntrances

      await parseEntranceList(cmsForm.value.entrance)
    }
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";

  .cms-custom-page-wrapper {
    @apply p-5 bg-white;
    border-radius: 0.625rem;
    box-shadow: 0px 0px 16px 0px #0000001a;

    .cms-custom-page-header {
      @apply p-5 flex gap-5;
      border-radius: 0.625rem;
      background-color: #fcf8ff;

      .header-content {
        @apply flex flex-col gap-[.375rem];
        .header-title {
          font-family: NotoSansTC;
          font-weight: 400;
          font-style: Regular;
          font-size: 14px;
          line-height: 17px;
          color: #000000;
        }

        .header-url {
          line-height: 2.5rem;
          font-family: NotoSansTC;
          font-weight: 500;
          font-style: Medium;
          font-size: 14px;
          color: #535252;
        }
      }
    }

    .cms-custom-page-body {
      @apply py-[30px] px-0;
      @apply flex gap-[1.875rem];

      .page-componets {
        @apply flex flex-col gap-5;
        padding: 1.25rem;
        border-radius: 0.625rem;
        background-color: #fcf8ff;
        width: 382px;
        height: 900px;
        overflow-y: auto;

        .page-components-header-content {
          @apply flex flex-col gap-1.5;
          .page-components-header-title {
            font-family: NotoSansTC;
            font-weight: 700;
            font-style: Bold;
            font-size: 18px;
            line-height: 22px;
            color: #535252;
          }
          .page-components-header-tip {
            @apply flex items-center gap-1;
            font-family: Noto Sans TC;
            font-weight: 400;
            font-style: Regular;
            font-size: 12px;
            line-height: 14px;
            color: #6b6b6b;
          }
        }

        .drag-componets {
          @apply flex flex-col gap-5 flex-[1] max-w-[382px];
        }
      }

      .custom-page {
        @apply flex-[2];

        .phone-frame {
          @apply relative mx-auto;
          width: 400px;

          .shared-wrapper {
            @apply w-[400px] h-[800px] overflow-hidden px-6 py-16;
            background-image: url("src/assets/images/cms/custom-page/bg-phone.webp");
            background-repeat: no-repeat;
            background-size: contain;

            .shared-content {
              @apply h-[672px] overflow-y-scroll pt-4 pb-20;

              .draggable-content {
                @apply flex flex-col gap-2.5;

                .shared-item {
                  @apply relative cursor-pointer;
                  border: 2px solid transparent;
                  border-radius: 0.5rem;
                  transition: border-color 0.2s ease;

                  &.active {
                    border-color: #086eff;
                  }

                  &:hover {
                    border-color: rgba(8, 110, 255, 0.5);
                  }
                }
              }
            }
          }

          .component-type-label {
            @apply absolute z-20 px-3 py-1 rounded-full text-white text-sm font-medium pointer-events-none;
            background-color: #086eff;
          }

          .entrance-controls {
            @apply absolute flex flex-col z-20;
            background-color: #086eff;
            border-radius: 5rem;

            .control-btn {
              @apply w-7 h-7;
              min-width: 1.75rem;
              min-height: 1.75rem;

              &.up-btn,
              &.down-btn {
                background-color: #086eff;
              }

              &:disabled {
                opacity: 0.5;
              }
            }
          }
        }
      }
    }
  }

  .edit-panel-wrapper {
    @apply flex flex-col;
    width: 31.25rem;
    height: 920px;

    .edit-panel-header {
      @apply flex flex-col gap-4 p-4 rounded-t-[.625rem];
      background-color: #fcf8ff;

      .edit-panel-title {
        font-family: NotoSansTC;
        font-weight: 700;
        font-size: 18px;
        line-height: 22px;
        color: #535252;
      }

      .edit-panel-tabs {
        @apply rounded-full flex w-fit bg-white;
        .edit-tab {
          @apply px-4 py-2 rounded-full w-fit flex-initial;
          font-size: 14px;
          min-height: 2rem;
          background-color: transparent;
          color: #535252;

          &.q-tab--active {
            background-color: #086eff;
            color: white;
          }
        }
      }
    }

    .edit-panel-content {
      @apply flex-1 p-4 bg-[#FCF8FF];
      overflow-x: auto;
      overflow-y: hidden;

      .edit-tab-panels {
        height: 100%;

        :deep(.q-panel) {
          height: 100%;
          overflow: visible;
        }
      }

      .content-panel {
        height: 100%;
        overflow-x: auto;
        // overflow-y: hidden;
      }

      .style-panel-placeholder {
        @apply p-4 text-center text-gray-500;
      }
    }

    .recommend-template-content {
      @apply flex-1 rounded-[.625rem] p-5 bg-[#FCF8FF] flex flex-col gap-[.625rem];
      font-family: NotoSansTC;
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      color: #535252;

      .recommend-templates {
        @apply grid grid-cols-2 gap-[.625rem];

        .q-img {
          cursor: pointer;
          &.active {
            border: 1px solid var(--primary-05, #086eff);
            border-radius: 0.625rem;
          }
        }
      }
    }
  }
  .submit-btns {
    @apply flex items-center gap-[.625rem];
    .submit-btn {
      @apply flex-1;
      padding: 0.3125rem 1rem;

      :deep(.q-btn__content) {
        font-family: Noto Sans TC;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
        text-transform: capitalize;
      }
    }
  }

  :deep(.cms-form-input) {
    width: auto !important;
  }

  :deep(.card-entrance-horizontal) {
    height: 100% !important;
  }
</style>
