<template>
  <div v-if="props.entrance.payload.page" class="col-12 row q-col-gutter-md">
    <div class="col-12 col-sm q-mt-md languageTabsWrapper">
      <q-tabs
        v-model="currentLanguage"
        dense
        class="bg-transparent text-grey-8 lanarea"
        active-color="main-color"
        content-class="languageTab"
        outside-arrows
      >
        <q-tab
          v-for="page in props.entrance.payload.page.sort()"
          :key="page.lang"
          :name="page.lang"
          :label="page.lang"
          class="q-px-none q-mr-sm"
          content-class="languageTabItem"
        />
      </q-tabs>

      <q-tab-panels v-model="currentLanguage" animated swipeable class="bg-transparent q-mt-md">
        <q-tab-panel
          v-for="page in props.entrance.payload.page.sort()"
          :name="page.lang"
          :label="page.lang"
          class="q-px-none"
        >
          <div>
            <Editor :model-value="page.content" @update:model-value="handelEditor" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType, defineProps, computed, ref } from "vue"
  import type * as Request from "src/api/request.type"
  import { LANGUAGE_TYPE } from "src/utils/constants"
  import Editor from "@/components/editor/Editor.vue"

  const props = defineProps({
    entrance: {
      type: Object as PropType<Request.CmsEntranceItem> | null,
      required: true,
      default: () => {
        return null
      }
    }
  })

  const firstLang = computed(() => {
    if (props.entrance.payload.page && props.entrance.payload.page.length) {
      return props.entrance.payload.page[0].lang
    }
    return ""
  })
  const currentLanguage = ref(firstLang.value)

  const handelEditor = (value: string) => {
    if (props.entrance.payload.page) {
      const page = props.entrance.payload.page.find((e) => e.lang === (currentLanguage.value as LANGUAGE_TYPE.Enums))
      if (page) {
        page.content = value
      }
    }
  }
</script>

<style scoped lang="scss">
  .languageTabsWrapper {
    .lanarea {
      border-bottom: 1px solid #dbe0f2;
    }
    ::v-deep(.q-tabs__content) {
      justify-content: start;
    }
    .custom-textarea {
      border: 1px solid #c2c2ca;
    }
    ::v-deep(.q-textarea .q-field__native) {
      padding-left: 1.25rem;
    }
  }
</style>
