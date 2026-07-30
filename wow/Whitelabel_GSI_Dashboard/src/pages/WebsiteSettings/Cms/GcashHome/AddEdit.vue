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
              <h3 class="text-subtitle1 text-weight-bold q-mb-none">{{ $t("cms.display_title") }}</h3>
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
            <q-card-section class="row items-center q-gutter-md">
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
                <q-select
                  v-model="cmsForm.setting.arrangement"
                  :options="arrangementList"
                  dense
                  options-dense
                  outlined
                  map-options
                  emit-value
                  class="cms-form-input"
                  @update:model-value="changeArrangement()"
                >
                </q-select>
              </div>
              <!-- 每列顯示數量 -->
              <div>
                <span>{{ $t("cms.display_quantity_per_colum") }}</span>
                <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
                  <span class="q-ml-sm">PC:</span>
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
                  <span class="q-ml-sm">MOB:</span>
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
                >
                  <div
                    v-for="(entrance, entranceIndex) in cmsForm.entrance"
                    :key="`entrance-${entranceIndex}`"
                    class="card-entrance"
                  >
                    <!--前三筆不可編輯-->
                    <div
                      class="mk"
                      v-if="!cmsForm.is_editable && isEditMode && cmsForm.entrance.length > 3 && entranceIndex <= 2"
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
                      <img :src="btnTrash()" alt="delete-button" @click="cmsForm.entrance.splice(entranceIndex, 1)" />
                    </div>
                    <!-- img -->
                    <div class="row justify-center items-center">
                      <PreviewImage
                        :parentImage="entrance.img"
                        :defaultImage="cmsIconUploadDefault()"
                        :aspectRatio="'1/1'"
                        :maxWidth="'10rem'"
                        @update:modelValue="updateEntranceImgUrl($event, entrance)"
                        imageToBase64
                      />
                    </div>
                    <EntranceLink v-model="entrance.type" :entrance="entrance" />
                    <div v-for="lang in Object.keys(entrance.lang).sort()" :key="lang" class="entrance-title-row">
                      <span>{{ LANGUAGE_TYPE.Abbreviation[lang as LANGUAGE_TYPE.Enums] }}</span>
                      <q-input
                        v-model="entrance.lang[lang as LANGUAGE_TYPE.Enums]"
                        dense
                        outlined
                        class="cms-form-input"
                        :placeholder="$t('common.please_enter_content')"
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
  import { CMS_TYPE, LANGUAGE_TYPE } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import SubPageOnlyTitle from "layouts/SubPage/OnlyTitle.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"

  const siteStore = useSiteStore()
  const { t } = useI18n()
  const $q = useQuasar()
  const route = useRoute()
  const { cmsIconUploadDefault, btnSort, btnTrash, btnAdd } = useImage()
  const Rules = useRule()
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
  const backRouteName = "GcashHomeList"
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
  const updateRowValue = (mode: string, operation: "add" | "reduce") => {
    const key = mode === "pc" ? "row_show_pc" : "row_show_mob"

    const currentValue =
      typeof cmsForm.value.setting[key] === "string"
        ? parseFloat(cmsForm.value.setting[key] as string) || 0
        : (cmsForm.value.setting[key] as number)
    const changeValue = operation === "add" ? auditStep.value : -auditStep.value

    cmsForm.value.setting[key] = normalizeNumber(currentValue + changeValue)

    if (cmsForm.value.setting[key] <= 0) {
      cmsForm.value.setting[key] = 0
    }
  }

  const rowReduce = (mode: string) => updateRowValue(mode, "reduce")
  const rowAdd = (mode: string) => updateRowValue(mode, "add")

  const normalizeNumber = (num: number) => Math.round(num * 10) / 10

  const changeArrangement = () => {
    if (cmsForm.value.setting.arrangement === 1) {
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
    auditStep.value = cmsForm.value.setting.arrangement === 0 ? 0.1 : 1
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
      initCmsForm(CMS_TYPE.Enums.GCASHHOME)
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

      if (fromIndex <= 2) {
        return false
      }

      if (toIndex <= 2) {
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
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  @import "../../../../css/cms.scss";
  @import "../../../../css/dragTable.scss";
</style>
