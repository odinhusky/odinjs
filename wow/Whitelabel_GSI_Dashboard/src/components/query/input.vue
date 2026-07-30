<template>
  <q-input :hide-bottom-space="true" v-bind="attrs" v-model="model" />
</template>

<script lang="ts" setup>
  import { defineProps, defineModel, useAttrs, onMounted } from "vue"
  import { useRoute } from "vue-router"

  const props = defineProps({
    /** 欄位名稱 (必須與 v-model 欄位名稱一致才能匹配上 route.query) */
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  const attrs = useAttrs()

  // 支援 v-model.trim 修飾符
  const [model, modifiers] = defineModel<string, "trim">({
    set(value) {
      if (modifiers.trim) {
        return value?.trim()
      }
      return value
    }
  })

  const route = useRoute()

  onMounted(() => {
    // 從 route.query 賦值
    const columnName = props.name
    if (columnName && !!route.query[columnName] && typeof route.query[columnName] === "string") {
      model.value = route.query[columnName] as string
      return
    }

    // console.warn("The field of query element does not exist.")
  })
</script>
