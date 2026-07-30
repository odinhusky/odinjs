<template>
  <p>{{ $t("table_header.calculate_type") }}</p>
  <querySelect
    v-bind="attrs"
    v-model="model"
    :name="name"
    borderless
    dense
    standout="bg-white text-black"
    rounded
    :list="dropdownData.list"
  />
</template>

<script lang="ts" setup>
  import { useAttrs, reactive } from "vue"
  import querySelect from "@/components/query/selects/base.vue"

  defineProps({
    name: {
      type: [String],
      required: true,
      default: () => ""
    }
  })

  defineOptions({ inheritAttrs: false })

  const attrs = useAttrs()
  const model = defineModel<string | number | undefined>()

  const dropdownData = reactive<{
    list: {
      label: string
      value: number
    }[]
  }>({
    list: [
      {
        label: "table_header.winlose",
        value: 1
      },
      {
        label: "table_header.net_gaming_revenue",
        value: 2
      }
    ]
  })
</script>
