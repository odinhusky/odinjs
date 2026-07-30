<template>
  <p v-if="store.voiceBotList.length">
    {{ $t("table_header.voice_bot_name") }}
  </p>
  <!-- 語音助理 -->
  <querySelect
    ref="selectRef"
    class="required"
    v-if="store.voiceBotList.length"
    :hide-bottom-space="true"
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    outlined
    standout="bg-white"
    :list="store.voiceBotList.map((item) => ({ label: item.voice_type, value: item }))"
    :useI18n="false"
  />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, reactive, onMounted, ref } from "vue"
  import querySelect from "@/components/query/selects/base.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useQueryStore } from "@/stores/queryStore"

  const selectRef = ref()

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })
  const store = useQueryStore()

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()

  const model = defineModel<{ voice_type: string; example_voice_url: string }>()

  onMounted(async () => {
    await store.getVoiceBotList()
    console.log(store.voiceBotList)
  })

  defineExpose({
    validate: () => selectRef.value?.validate(),
    hasError: selectRef.value?.hasError
  })
</script>
