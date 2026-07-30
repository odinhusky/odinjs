<template>
  <p>{{ `${props.item.required ? "*" : ""} ${$t(`website_settings_reg.${props.item.column_name}`)}` }}</p>
  <q-select
    v-model="model"
    outlined
    :options="accountOption"
    use-input
    hide-selected
    fill-input
    map-options
    emit-value
    input-debounce="0"
    @filter="filterAccount"
    :disable="!props.item.edit"
    :rules="props.item.required ? [Rules.required()] : [Rules.noRule]"
    class="default-input"
  />
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from "vue"
  import { INPUT_TYPE } from "src/utils/constants"
  import { useRule } from "src/hook/useRule"
  import type * as Response from "src/api/response.type"
  import { getMemberQuotaMemberSearch } from "@/api/member"

  interface Props {
    modelValue: any // 欄位為動態, 無法預先定義
    item: {
      column_name: string
      customize: boolean
      edit: boolean
      lang?: {
        [key: string]: string
      }
      required: boolean
      type: number
      values: Response.Values[]
    }
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "", // 欄位為動態, 無法預先定義
    item: () => ({
      column_name: "",
      customize: false,
      edit: false,
      required: false,
      type: INPUT_TYPE.Enums.SELECT,
      values: []
    })
  })

  const emit = defineEmits(["update:modelValue"])

  const model = computed({
    get: () => props.modelValue,
    set: (value: number) => {
      emit("update:modelValue", value)
    }
  })

  const Rules = useRule()

  const accountOption = ref([])
  const filterAccount = (val: string, update: Function, abort: Function) => {
    update(() => {
      const needle = val.toLowerCase()
      if (needle === "") {
        model.value = 0
      }

      getMember(needle)
    })
  }

  //搜尋會員
  const getMember = async (name: string | "") => {
    const sendData = {
      account: name + "%",
      offset: 0,
      size: 100000
    }
    const { data } = await getMemberQuotaMemberSearch(sendData)

    if (!data || !Object.keys(data).length) {
      accountOption.value.length = 0
      return
    }
    accountOption.value.length = 0
    data.list.forEach((item: any) => {
      const newItem = {
        label: item.account,
        value: item.id
      }
      accountOption.value.push(newItem as never)
    })
  }

  onMounted(async () => {
    getMember("")
  })
</script>

<style scoped lang="scss"></style>
