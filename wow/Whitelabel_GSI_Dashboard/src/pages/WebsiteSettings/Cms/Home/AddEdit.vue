<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPageOnlyTitle :backLabelI18nKey="isEditMode ? 'btn.edit' : 'btn.add'" />
    <div class="q-pa-md">
      <div class="q-pa-xl bg-white">
        <q-form @submit="handleSubmit">
          <q-card flat>
            <!-- 標題 -->
            <q-card-section class="row items-center q-gutter-md">
              <h3 class="text-subtitle1 text-weight-bold q-my-none">{{ $t("table_header.title") }}</h3>
              <q-input
                v-model="cmsForm.title"
                dense
                outlined
                class="cms-form-input"
                :placeholder="$t('common.please_enter_content')"
                lazy-rules
                :rules="[Rules.required()]"
              ></q-input>
            </q-card-section>
            <!-- 會員端標題 -->
            <q-card-section>
              <div class="row items-center">
                <div class="text-subtitle1 text-weight-bold q-mb-none">{{ $t("cms.display_title") }}</div>
                <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
              </div>
              <div class="row items-center q-gutter-md">
                <div v-for="item in Object.keys(cmsForm.setting.lang).sort()" :key="item">
                  <span>{{ item }}</span>
                  <q-input
                    v-model="cmsForm.setting.lang[item as LANGUAGE_TYPE.Enums]"
                    dense
                    outlined
                    class="cms-form-input"
                    :placeholder="$t('common.please_enter_content')"
                  ></q-input>
                </div>
              </div>
            </q-card-section>
            <!-- icon、排序方式、入口排序 -->
            <q-card-section class="row q-gutter-md">
              <!-- icon -->
              <div>
                <span>ICON</span>
                <div class="row items-end" style="width: 16.875rem">
                  <PreviewImage
                    :parentImage="cmsForm.setting.icon"
                    :defaultImage="cmsIconUploadDefault()"
                    :aspectRatio="'64/64'"
                    :maxWidth="'64px'"
                    @update:modelValue="updateIconUrl"
                    imageToBase64
                    :maxFileSize="102400"
                  />
                  <div>
                    <p class="q-mb-none">
                      {{ $t("edit_form.image_dimensions", { width: "36", height: "36", unit: $t("edit_form.px") }) }}
                    </p>
                    <p class="q-mb-none">{{ $t("edit_form.image_file_size", { limit: "100KB" }) }}</p>
                  </div>
                </div>
              </div>
              <!-- 排列方式 -->
              <div>
                <span>{{ $t("cms.sorting_method") }}</span>
                <q-select
                  v-model="cmsForm.setting.entrance_sort"
                  :options="entranceSortList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>

              <!-- 入口排序 -->
              <div>
                <span>{{ $t("cms.entrance_sorting") }}</span>
                <div class="row items-center">
                  <q-radio
                    v-model="cmsForm.setting.arrangement"
                    :val="0"
                    :label="$t('cms.multiple_rows_scroll')"
                    size="md"
                  />
                  <div class="row items-center no-wrap audit-multiple-container q-ml-sm">
                    <q-btn size="md" square flat @click="multiReduceRow('pc')">-</q-btn>
                    <q-number
                      v-model.number="cmsForm.setting.arrangement_row_pc"
                      dense
                      borderless
                      square
                      :options="generalOptions"
                      class="audit-multiple"
                      style="width: 50%"
                      @blur="changeMultiArrangement()"
                    />
                    <q-btn size="md" square flat @click="multiRowAdd('pc')">+</q-btn>
                  </div>
                </div>

                <q-radio v-model="cmsForm.setting.arrangement" :val="1" :label="$t('cms.multiple_columns')" size="md" />
              </div>
              <!-- 每列顯示數量 -->
              <div>
                <span>{{ $t("cms.display_quantity_per_colum") }}</span>
                <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
                  <span class="w-40">PC:</span>
                  <q-btn size="md" square flat @click="rowReduce('pc')">-</q-btn>
                  <q-input
                    v-model.number="cmsForm.setting.row_show_pc"
                    dense
                    borderless
                    square
                    class="audit-multiple"
                    @update:model-value="changeArrangement()"
                  />
                  <q-btn size="md" square flat @click="rowAdd('pc')">+</q-btn>
                </div>
                <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
                  <span class="w-40">MOB:</span>
                  <q-btn size="md" square flat @click="rowReduce('mob')">-</q-btn>
                  <q-input
                    v-model.number="cmsForm.setting.row_show_mob"
                    dense
                    borderless
                    square
                    class="audit-multiple"
                    @update:model-value="changeArrangement()"
                  />
                  <q-btn size="md" square flat @click="rowAdd('mob')">+</q-btn>
                </div>
              </div>
              <!-- 顯示裝置 -->
              <div>
                <span>{{ $t("cms.display_device") }}</span>
                <q-select
                  v-model="cmsForm.setting.display_device"
                  :options="displayDeviceList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>
              <!-- view_all -->
              <div>
                <span>{{ $t("cms.view_all") }}</span>
                <q-select
                  v-model="cmsForm.setting.view_all"
                  :options="viewAllList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                >
                </q-select>
              </div>
            </q-card-section>

            <!-- 自訂入口 -->
            <q-card-section>
              <h3 class="text-subtitle1 text-weight-bold">{{ $t("cms.custom_entrance") }}</h3>
              <div class="row items-start entrance-row">
                <!-- 自訂入口卡片 -->
                <VueDraggableNext
                  :list="cmsForm.entrance"
                  :disabled="disabledDrag"
                  class="drag-container row items-start q-gutter-md"
                  :move="checkMove"
                  item-key="id"
                  @start="onDragStart"
                  @end="onDragEnd"
                >
                  <div
                    v-for="(entrance, entranceIndex) in cmsForm.entrance"
                    :key="`entrance-${entranceIndex}`"
                    class="card-entrance"
                  >
                    <!--前三筆不可編輯-->
                    <div
                      class="mk"
                      v-if="!cmsForm.is_editable && isEditMode && cmsForm.entrance.length > 3 && entranceIndex == 1"
                    ></div>
                    <!-- header -->
                    <div class="entrance-header">
                      <div class="row items-center">
                        <img
                          :src="btnSort()"
                          alt="sort-button"
                          @mouseenter="disabledDrag = false"
                          @mouseleave="disabledDrag = true"
                          @touchstart="disabledDrag = false"
                          @touchend="disabledDrag = true"
                        />
                        <span class="text-weight-bold">{{ $t("table_header.order") }}{{ entranceIndex + 1 }}</span>
                      </div>
                      <img :src="btnTrash()" alt="delete-button" @click="removeEntrance(entranceIndex)" />
                    </div>
                    <!-- img -->
                    <div class="row justify-center items-center">
                      <PreviewImage
                        v-if="!isCardDisabled(entranceIndex)"
                        :parentImage="entrance.img"
                        :defaultImage="cmsIconUploadDefault()"
                        :aspectRatio="'1/1'"
                        :maxWidth="'10rem'"
                        @update:modelValue="updateEntranceImgUrl($event, entrance)"
                        imageToBase64
                      />
                      <img
                        v-else
                        :src="entrance.img || cmsIconUploadDefault()"
                        :style="{ maxWidth: '10rem', aspectRatio: '1/1', objectFit: 'contain' }"
                        alt="locked-image"
                      />
                    </div>
                    <EntranceLink
                      v-model="entrance.type"
                      :entrance="entrance"
                      :cardDisabled="isCardDisabled(entranceIndex)"
                    />
                    <div v-for="lang in Object.keys(entrance.lang)" :key="lang" class="entrance-title-row">
                      <span>{{ LANGUAGE_TYPE.Abbreviation[lang as LANGUAGE_TYPE.Enums] }}</span>
                      <q-input
                        v-model="entrance.lang[lang as LANGUAGE_TYPE.Enums]"
                        dense
                        outlined
                        class="cms-form-input"
                        :placeholder="$t('common.please_enter_content')"
                        :disable="isCardDisabled(entranceIndex)"
                      ></q-input>
                    </div>
                  </div>
                  <!-- 新增自訂入口 -->
                  <div class="card-entrance add-container">
                    <h4 class="add-title">{{ $t("cms.click_add_entrance") }}</h4>
                    <img :src="btnAdd()" alt="add-button" class="add-img" @click="addCmsFormEntrance" />
                  </div>
                </VueDraggableNext>
              </div>
            </q-card-section>
            <!-- btns -->
            <q-card-actions class="btns q-mt-xl q-py-md" align="center">
              <q-btn
                outline
                color="main-color"
                class="q-mr-sm col-2"
                size="md"
                :to="{ name: backRouteName }"
                :loading="isLoading"
              >
                {{ $t("btn.cancel") }}
              </q-btn>
              <q-btn color="main-color" class="col-2" size="md" type="submit" :loading="isLoading">{{
                $t("btn.save")
              }}</q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue"
  import { useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { useSiteStore } from "@/stores/siteStore"
  import { CMS_TYPE, LANGUAGE_TYPE, CMS_ARRANGEMENT } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"

  const siteStore = useSiteStore()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { cmsIconUploadDefault, btnSort, btnTrash, btnAdd } = useImage()
  const Rules = useRule()

  const generalOptions = {
    min: 1,
    minimumFractionDigits: "0",
    nullValue: 0
  }
  const {
    isLoading,
    cmsForm,
    entranceSortList,
    arrangementList,
    displayDeviceList,
    viewAllList,
    initCmsForm,
    addCmsFormEntrance,
    handleGetCmsDetail,
    handleAddCmsItem,
    handleEditCmsItem
  } = useCms()
  const cmsId = computed(() => Number(route.params.id) || 0)
  const backRouteName = "CmsHomeList"
  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })
  const disabledDrag = ref(true)

  const updateIconUrl = (value: string) => {
    cmsForm.value.setting.icon = value
  }

  const updateEntranceImgUrl = (value: string, item: Request.CmsEntranceItem) => {
    item.img = value
  }

  const auditStep = ref(1)
  const auditMutliStep = ref(1)
  const updateRowValue = (mode: string, operation: "add" | "reduce", columns: string) => {
    auditStep.value = cmsForm.value.setting.arrangement === CMS_ARRANGEMENT.Enums.MULTIPLE_ROWS_SCROLL ? 0.1 : 1
    console.log("x")
    // 取得 key
    let key =
      columns === "arrangement_row"
        ? mode === "pc"
          ? "arrangement_row_pc"
          : "arrangement_row_mob"
        : mode === "pc"
        ? "row_show_pc"
        : "row_show_mob"

    const rawValue = cmsForm.value.setting[key]
    const currentValue = typeof rawValue === "string" ? parseFloat(rawValue) || 0 : (rawValue as number)

    const changeValue =
      columns === "arrangement_row"
        ? operation === "add"
          ? auditMutliStep.value
          : -auditMutliStep.value
        : operation === "add"
        ? auditStep.value
        : -auditStep.value

    const newValue = normalizeNumber(currentValue + changeValue)

    cmsForm.value.setting[key] = newValue <= 0 ? (columns === "arrangement_row" ? 1 : 0) : newValue

    if (cmsForm.value.setting.arrangement === CMS_ARRANGEMENT.Enums.MULTIPLE_COLUMNS) {
      cmsForm.value.setting.row_show_pc = Math.floor(cmsForm.value.setting.row_show_pc)
      cmsForm.value.setting.row_show_mob = Math.floor(cmsForm.value.setting.row_show_mob)
    }
  }

  const rowReduce = (mode: string) => updateRowValue(mode, "reduce", "row")
  const rowAdd = (mode: string) => updateRowValue(mode, "add", "row")

  const normalizeNumber = (num: number) => Math.round(num * 10) / 10

  const changeArrangement = () => {
    if (cmsForm.value.setting.arrangement === CMS_ARRANGEMENT.Enums.MULTIPLE_COLUMNS) {
      // 將 row_show_pc 和 row_show_mob 變整數
      cmsForm.value.setting.row_show_pc = Math.floor(cmsForm.value.setting.row_show_pc)
      cmsForm.value.setting.row_show_mob = Math.floor(cmsForm.value.setting.row_show_mob)
    }

    if (cmsForm.value.setting.row_show_pc < 1) {
      cmsForm.value.setting.row_show_pc = 1
    }
    if (cmsForm.value.setting.row_show_mob < 1) {
      cmsForm.value.setting.row_show_mob = 1
    }
    auditStep.value = cmsForm.value.setting.arrangement === CMS_ARRANGEMENT.Enums.MULTIPLE_ROWS_SCROLL ? 0.1 : 1
  }

  const multiReduceRow = (mode: string) => updateRowValue(mode, "reduce", "arrangement_row")
  const multiRowAdd = (mode: string) => updateRowValue(mode, "add", "arrangement_row")
  const changeMultiArrangement = () => {
    if (cmsForm.value.setting.arrangement_row_pc < 1) {
      cmsForm.value.setting.arrangement_row_pc = 1
    }
    if (cmsForm.value.setting.arrangement_row_mob < 1) {
      cmsForm.value.setting.arrangement_row_mob = 1
    }
    cmsForm.value.setting.arrangement_row_pc = Math.floor(cmsForm.value.setting.arrangement_row_pc)
    cmsForm.value.setting.arrangement_row_mob = Math.floor(cmsForm.value.setting.arrangement_row_mob)
  }
  const handleSubmit = () => {
    if (!cmsForm.value.entrance.length) {
      $q.notify({
        type: "negative",
        message: t("error_msg.entrance_required"),
        position: "top",
        timeout: 1000
      })
      return
    }
    if (
      !cmsForm.value.setting.row_show_pc ||
      !cmsForm.value.setting.row_show_mob ||
      Number(cmsForm.value.setting.row_show_pc) === 0 ||
      Number(cmsForm.value.setting.row_show_mob) === 0
    ) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_column"),
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

  onMounted(async () => {
    if (isEditMode.value && cmsId.value) {
      await handleGetCmsDetail(cmsId.value)
    } else {
      initCmsForm(CMS_TYPE.Enums.HOME)
      addCmsFormEntrance()
    }
    changeArrangement()
  })

  const checkMove = (event: any) => {
    //console.log("cmsEditLock" + siteStore.cmsEditLock + ":" + cmsId.value)

    if (isEditMode.value && cmsId.value) {
      if (cmsForm.value.is_editable) {
        return true
      }
      const toIndex = event.relatedContext.index
      const fromIndex = event.draggedContext.index

      if (fromIndex === 1) {
        return false
      }

      if (toIndex === 1) {
        return false
      }
    }

    return true
    /*const draggedItem = cmsForm.value.entrance[event.draggedContext.index]
      console.log(draggedItem.is_editable)
      return draggedItem.is_editable*/

    /*if (isEditMode.value && cmsId.value) {
        const toIndex = cmsForm.value.entrance[event.relatedContext.index]
        const fromIndex = cmsForm.value.entrance[event.draggedContext.index]

        if (!fromIndex.is_editable) {
          return false
        }
        if (!toIndex.is_editable) {
          return false
        }
      }
      return true*/
  }
  let dragFromIndex: number | null = null
  let dragToIndex: number | null = null
  let backupList: any[] = []

  function onDragStart(evt: any) {
    dragFromIndex = evt.oldIndex
    backupList = JSON.parse(JSON.stringify(cmsForm.value.entrance))
  }

  function onDragEnd(evt: any) {
    if (cmsForm.value.is_editable) {
      return true
    }
    dragToIndex = evt.newIndex
    if (dragFromIndex === null || dragToIndex === null) return

    const frozenIndex = 1 // 永遠固定排序2

    if (dragFromIndex === frozenIndex || dragToIndex === frozenIndex) {
      // 用原始備份強制還原整份資料
      cmsForm.value.entrance = JSON.parse(JSON.stringify(backupList))
      return
    }

    const newList = JSON.parse(JSON.stringify(backupList))

    const temp = newList[dragFromIndex]
    newList[dragFromIndex] = newList[dragToIndex]
    newList[dragToIndex] = temp

    newList[frozenIndex] = JSON.parse(JSON.stringify(backupList[frozenIndex]))

    cmsForm.value.entrance = newList
  }

  const removeEntrance = (index: number) => {
    if (isCardDisabled(index)) {
      return
    }
    cmsForm.value.entrance.splice(index, 1)
  }
  const isCardDisabled = (index: number) => {
    return !cmsForm.value.is_editable && isEditMode.value && index === 1
  }

  const applyLanguage = async () => {
    try {
      const firstItemData = Object.keys(cmsForm.value.setting.lang)
        .sort()
        .map((item) => cmsForm.value.setting.lang[item as LANGUAGE_TYPE.Enums])
        .find((item) => !!item)

      if (!firstItemData) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      $q.loading.show()
      const languages = Object.keys(cmsForm.value.setting.lang)
      const { status, data } = await translateAiText([{ input_text: firstItemData, languages }])
      if (status && Array.isArray(data) && data.length) {
        cmsForm.value.setting.lang = data[0].translations
        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";

  .audit-multiple-container {
    :deep(.q-btn) {
      height: 42px;
    }
    :deep(input) {
      text-align: center;
    }
    // .w-40 {
    //   width: 40px;
    // }
  }
</style>
