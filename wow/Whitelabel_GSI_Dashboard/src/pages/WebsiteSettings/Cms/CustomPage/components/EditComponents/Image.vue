<template>
  <!-- <q-card-section class="cms-custom-page-header flex items-center gap-4 py-0">
    <h3 class="text-subtitle1 text-weight-bold q-my-none">{{ $t("cms.display_count") }}</h3>
    <q-input
      v-model="props.entrance.payload.row_show"
      dense
      outlined
      class="cms-form-input no-spinner"
      :placeholder="$t('common.please_enter_content')"
      lazy-rules
      :rules="[Rules.required()]"
      hide-bottom-space
      @update:model-value="
        (val) => {
          console.log('val', val)
          if (val && typeof val === 'string') props.entrance.payload.row_show = Number(val?.replace(/\D/g, ''))
        }
      "
    ></q-input>
  </q-card-section> -->
  <q-card-section>
    <h3 class="text-subtitle1 text-weight-bold">{{ $t("cms.custom_entrance") }}</h3>
    <div class="row items-start entrance-row">
      <!-- 自訂入口卡片 -->
      <VueDraggableNext
        :list="props.entrance.payload.nested_entrance"
        handle=".drag-handle"
        class="drag-container row items-start q-gutter-md"
        item-key="id"
      >
        <div
          v-for="(subEntrance, subEntranceIndex) in props.entrance.payload.nested_entrance"
          :key="`entrance-${subEntranceIndex}`"
          class="card-entrance"
        >
          <!-- header -->
          <div class="entrance-header">
            <div class="row items-center">
              <img :src="btnSort()" alt="sort-button" class="drag-handle" />
              <span class="text-weight-bold">{{ $t("table_header.order") }}{{ subEntranceIndex + 1 }}</span>
            </div>
            <img :src="btnTrash()" alt="delete-button" @click="removeEntrance(subEntranceIndex)" />
          </div>
          <!-- img -->
          <div class="row justify-center items-center">
            <PreviewImage
              :parentImage="subEntrance.img"
              :defaultImage="cmsIconUploadDefault()"
              :aspectRatio="'1/1'"
              :maxWidth="'10rem'"
              @update:modelValue="updateEntranceImgUrl($event, subEntrance)"
              @update:img-file="updateEntranceImgFile($event, subEntrance)"
              imageToBase64
            />
          </div>
          <EntranceLink v-model="subEntrance.type" :entrance="subEntrance" :mainEntranceType="props.entrance.type" />
          <!-- <div v-for="lang in Object.keys(subEntrance.lang)" :key="lang" class="entrance-title-row">
            <span>{{ LANGUAGE_TYPE.Abbreviation[lang as LANGUAGE_TYPE.Enums] }}</span>
            <q-input
              v-model="subEntrance.lang[lang as LANGUAGE_TYPE.Enums]"
              dense
              outlined
              class="cms-form-input"
              :placeholder="$t('common.please_enter_content')"
            ></q-input>
          </div> -->
        </div>
        <!-- 新增自訂入口 -->
        <div class="card-entrance add-container">
          <h4 class="add-title">{{ $t("cms.click_add_entrance") }}</h4>
          <img :src="btnAdd()" alt="add-button" class="add-img" @click="handleAddEntrance" />
        </div>
      </VueDraggableNext>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { defineProps } from "vue"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { useRule } from "src/hook/useRule"
  import { CMS_OPENING_METHOD } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"

  const Rules = useRule()
  const { initEntrance, setFile } = useCms()
  const { cmsIconUploadDefault, btnSort, btnTrash, btnAdd } = useImage()

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const removeEntrance = (index: number) => {
    if (props.entrance.payload.nested_entrance) {
      props.entrance.payload.nested_entrance.splice(index, 1)
    }
  }

  const updateEntranceImgUrl = (value: string, item: Request.CmsEntranceItem) => {
    item.img = value
  }

  const updateEntranceImgFile = async (file: File, item: Request.CmsEntranceItem) => {
    if (file) {
      setFile(file)
      item.imgFileName = file.name
    }
  }

  const handleAddEntrance = async () => {
    const entrance = await initEntrance()
    entrance.payload.opening_method = CMS_OPENING_METHOD.Enums.NEW_TAB
    props.entrance.payload.nested_entrance?.push(entrance)
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../css//_variable.sass";
  @import "../../../../../../css/cms.scss";
  @import "../../../../../../css/dragTable.scss";

  .drag-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1rem;
    overflow-x: auto;

    .card-entrance {
      flex-shrink: 0;
      width: 220px;
      min-width: 220px;
      background: white;

      &.add-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px dashed #e0e0e0;
        border-radius: 0.5rem;
        width: 220px;
        min-width: 220px;
        height: 100%;

        .add-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .add-img {
          cursor: pointer;
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }
</style>
