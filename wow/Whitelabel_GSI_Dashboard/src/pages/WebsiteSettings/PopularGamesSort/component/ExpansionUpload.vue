<template>
  <div class="q-pa-md">
    <div class="row q-mt-lg">
      <div class="col-12">
        <VueDraggableNext class="drag-container" :list="productForm" tag="tbody" @end="onDragEnd">
          <q-list class="rounded-borders" v-for="(item, key) in productForm">
            <q-expansion-item
              group="group"
              expand-icon-toggle
              expand-separator
              class="main-color q-mt-md"
            >
              <template #header>
                <div class="top_header">
                  <q-icon
                    name="menu"
                    @mouseenter="disabledDrag = false"
                    @mouseleave="disabledDrag = true"
                    @touchstart="disabledDrag = false"
                    @touchend="disabledDrag = true"
                  />
                  <span class="q-pl-lg">{{ item.gameName }}</span>
                </div>
              </template>

              <PopularGameOptionGroup
                :parent-value="item.game_list"
                :group-options="gameList"
                :popular-options="[]"
                @update:onSave="onSave"
              />
            </q-expansion-item>
          </q-list>
        </VueDraggableNext>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { VueDraggableNext } from "vue-draggable-next"
  import PopularGameOptionGroup from "./PopularGameOptionGroup.vue"

  const { t } = useI18n()
  const disabledDrag = ref(true)
  async function onDragEnd() {}

  type TypeForm = {
    id: number
    gameName: string
    game_list: any[]
  }[]
  const productForm = reactive<TypeForm>([
    {
      id: 1,
      gameName: "WOW Gaming",
      game_list: [1]
    },
    {
      id: 2,
      gameName: "JDB Slots",
      game_list: []
    },
    {
      id: 3,
      gameName: "NE Slots",
      game_list: []
    }
  ])
  const gameList = computed(() => [
    { label: "game1", value: 0 },
    { label: "game2", value: 1 },
    { label: "game3", value: 2 },
    { label: "game4", value: 3 },
    { label: "game5", value: 4 }
  ])

  const $q = useQuasar()
  const onSave = (Obj: any) => {
    $q.notify({
      type: "positive",
      message: t("message.success"),
      position: "top",
      timeout: 300
    })
  }

  onMounted(() => {
    console.log("call api")
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  ::v-deep(.uploader-language-code) {
    margin: auto 10px;
    font-size: 12px;
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
    width: 20px;
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
    max-width: 146px;
  }
  .btn-placement-indication {
    position: relative;
    .mock-img {
      position: absolute;
      left: 110%;
      top: 0;
      z-index: 1;
      display: none;
      height: 200px;
    }
    &:hover {
      .mock-img {
        display: block;
      }
    }
  }

  .main-color {
    background: #EFF7FF !important;
  }
  .drag-container {
    opacity: 1 !important;
    display: block;
    .top_header {
      display: flex;
      align-items: center;
      width: 100%;
      font-size: 14px;
      span {
        display: block;
      }
    }
    .img_upload {
      width: 94%;
    }
    .save {
      align-items: center;
    }
  }

  :deep(.q-expansion-item__container) {
    color: #086EFF !important;
  }
</style>
