<template>
  <Editor v-if="isReady" v-model="editorValue" :init="init" />
</template>

<script setup lang="ts">
  import { ref, watch, toRefs, computed, PropType, onMounted } from "vue"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useS3Upload } from "src/composables/useS3Upload"
  import { useEnv } from "src/hook/useEnv"

  // TinyMCE 相關型別導入
  import type { TinyMCE } from "tinymce"

  // TinyMCE-Vue
  import Editor from "@tinymce/tinymce-vue"

  // 初始化 TinyMCE
  // 將 TinyMCE 掛載到全局，確保 tinymce-vue 能抓到本地版本
  const isReady = ref(false)
  onMounted(async () => {
    // 動態載入核心
    const tinymceModule = await import("tinymce/tinymce.js")
    const tinymce = tinymceModule.default

    if (typeof window !== "undefined") {
      window.tinymce = tinymce
    }

    // 動態載入外觀、圖標、插件
    await Promise.all([
      import("tinymce/skins/ui/oxide/skin.css"),
      import("tinymce/themes/silver"),
      import("tinymce/icons/default"),
      import("tinymce/plugins/emoticons"),
      import("tinymce/plugins/link"),
      import("tinymce/plugins/emoticons/js/emojis.js"),
      import("tinymce/plugins/table"),
      import("tinymce/plugins/quickbars"),
      import("tinymce/plugins/image"),
      import("tinymce/plugins/imagetools"),
      import("tinymce/plugins/code"),
      import("tinymce-i18n/langs5/zh_TW.js"),
      import("tinymce-i18n/langs5/zh_CN.js")
    ])

    isReady.value = true
  })

  type EditorOptions = Parameters<TinyMCE["init"]>[0]

  const { envData } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_STATIC_RESOURCE_URL, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { uploadSingleFile, S3_STORAGE_CATEGORY } = useS3Upload()
  const languageStore = useLanguageStore()

  const props = defineProps({
    modelValue: {
      type: String,
      default: ""
    },
    init: {
      type: Object as PropType<Partial<EditorOptions>>,
      default: null
    },
    plugins: {
      type: [String, Array],
      default: "link quickbars emoticons table image imagetools code"
    },
    toolbar: {
      type: [String, Array],
      default:
        "code | link | bold italic underline strikethrough |formatselect  fontsizeselect fontsize  fontfamily | image | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | removeformat "
    }
  })

  const emit = defineEmits(["update:modelValue"])

  interface BlobInfo {
    blob: () => Blob
  }

  interface SuccessCallback {
    (url: string): void
  }

  interface FailureCallback {
    (error: string): void
  }

  const init = computed(() => {
    // 預設的 init
    const initData = {
      language: languageStore.currentLanguageOption.key.replace("-", "_"),
      height: "20vw",
      menubar: false,
      content_css: false,
      selector: "textarea", // change this value according to your HTML
      fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt 32pt 34pt 36pt 38pt 40pt",
      toolbar: `undo redo | styleselect | fontselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent${
        props.toolbar ? ` | ${props.toolbar}` : ""
      }`,
      font_formats:
        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
      skin: false,
      default_link_target: "_blank",
      quickbars_image_toolbar: "alignleft aligncenter alignright | rotateleft rotateright",
      quickbars_insert_toolbar: false,
      branding: false,
      images_upload_handler: async function (blobInfo: BlobInfo, success: SuccessCallback, failure: FailureCallback) {
        if (!blobInfo || !blobInfo.blob()) {
          failure("Blob Info is empty")
          return
        }
        const file = blobInfo.blob() as File

        const { status, data, msg } = await uploadSingleFile({
          file,
          storage_category: S3_STORAGE_CATEGORY.Enums.cms
        })

        if (status && data) {
          const base = VITE_APP_DYNAMIC_RESOURCE_URL || VITE_APP_STATIC_RESOURCE_URL || VITE_APP_BASE_API || ""
          const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base
          const key = data.objectKey.startsWith("/") ? data.objectKey : `/${data.objectKey}`

          const url = `${cleanBase}${key}`
          success(url)
        } else {
          failure(msg || "Upload failed")
        }
      }
    }

    return props.init ? { ...initData, ...props.init, plugins: props.plugins } : { ...initData, plugins: props.plugins }
  })

  const { modelValue } = toRefs(props)
  const editorValue = ref(modelValue.value)

  watch(modelValue, (newValue) => {
    editorValue.value = newValue
  })

  watch(editorValue, (newValue) => {
    emit("update:modelValue", newValue)
  })
</script>

<style>
  .tox-silver-sink {
    z-index: 9999;
  }
</style>
