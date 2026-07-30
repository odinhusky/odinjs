<template>
  <div class="slider-horizontal-container">
    <!-- 自訂入口卡片 -->
    <VueDraggableNext
      :list="props.entrance.payload.nested_entrance"
      class="drag-container-horizontal"
      item-key="id"
      handle=".drag-handle"
    >
      <div
        v-for="(subEntrance, subEntranceIndex) in props.entrance.payload.nested_entrance"
        :key="`entrance-${subEntranceIndex}`"
        class="card-entrance-horizontal"
      >
        <!-- header -->
        <div class="entrance-header">
          <div class="row items-center">
            <img :src="btnSort()" alt="sort-button" class="drag-handle" />
            <span class="text-xs">{{ $t("table_header.order") }}{{ subEntranceIndex + 1 }}</span>
          </div>
          <img :src="btnTrash()" alt="delete-button" @click="removeEntrance(subEntranceIndex)" />
        </div>
        <!-- img -->
        <div class="row justify-center items-center mb-2">
          <PreviewImage
            :parentImage="subEntrance.img"
            :defaultImage="cmsIconUploadDefault()"
            :aspectRatio="'162/137'"
            :maxWidth="'10rem'"
            @update:modelValue="updateEntranceImgUrl($event, subEntrance)"
            @update:img-file="updateEntranceImgFile($event, subEntrance)"
            imageToBase64
          />
        </div>
        <EntranceLink v-model="subEntrance.type" :entrance="subEntrance" :mainEntranceType="props.entrance.type" />
      </div>
      <!-- 新增自訂入口 -->
      <div class="card-entrance-horizontal add-container">
        <h4 class="add-title">{{ $t("cms.click_add_entrance") }}</h4>
        <img :src="btnAdd()" alt="add-button" class="add-img" @click="handleAddEntrance" />
      </div>
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from "vue"
  import { useImage } from "src/hook/useImage"
  import { useCms } from "src/composables/useCms"
  import { CMS_OPENING_METHOD } from "src/utils/constants"
  import type * as Request from "src/api/request.type"
  import { VueDraggableNext } from "vue-draggable-next"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import EntranceLink from "src/pages/WebsiteSettings/Cms/component/EntranceLink.vue"

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

  .slider-horizontal-container {
    display: flex;
    height: 100%;
    width: max-content;
    min-width: 100%;

    .drag-container-horizontal {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      height: 100%;
      padding-bottom: 1rem;

      .card-entrance-horizontal {
        flex-shrink: 0;
        width: 220px;
        height: fit-content;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        padding: 0.75rem;

        .entrance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;

          img {
            cursor: pointer;
            width: 1.25rem;
            height: 1.25rem;
          }
        }

        &.add-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background: #fff;
          border: 1px dashed #e0e0e0;

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
  }
</style>
