<template>
  <q-card class="q-flex" style="justify-content: center; height: 345px">
    <q-card-section class="q-mr-xl card">
      <div class="top">
        <q-checkbox v-model="selectAll" :label="$t('common.game_list')" @update:model-value="toggleSelectAll" />
        <div>{{ groupValue.length }} / {{ groupOptions?.length }}</div>
      </div>
      <div class="row">
        <q-input outlined v-model="gameSearch" class="search">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-scroll-area class="game_list">
          <q-checkbox
            v-for="item in groupOptions"
            :key="item.value"
            v-model="groupValue"
            :label="item.label"
            :val="item.value"
            class="q-mr-lg w-100"
          >
          </q-checkbox>
        </q-scroll-area>
      </div>
    </q-card-section>
    <div class="controll_bar">
      <q-btn icon="chevron_left" color="main-color" outline class="q-mb-md btn" @click="toGameList()" />
      <q-btn icon="navigate_next" color="main-color" outline class="btn" @click="toPopular()" />
    </div>
    <q-card-section class="q-ml-xl q-mr-xl card">
      <div class="top">
        <q-checkbox v-model="popularSelectAll" label="Popular" @update:model-value="popularToggleSelectAll" />
        <div>{{ popularValue.length }} / {{ popularOptions?.length }}</div>
      </div>
      <div class="row">
        <q-input outlined v-model="popularSearch" class="search">
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-scroll-area class="game_list">
          <q-checkbox
            v-for="item in popularOptions"
            :key="item.value"
            v-model="popularValue"
            :label="item.label"
            :val="item.value"
            class="q-mr-lg w-100"
          >
          </q-checkbox>
        </q-scroll-area>
      </div>
    </q-card-section>
    <div class="controll_bar q-pl-xl" v-if="permission.edit">
      <div class="row save q-mb-md"><q-btn color="green" :label="$t('btn.save')" @click="onSave" /></div>
      <div class="row save"><q-btn color="main-color" outline :label="$t('btn.cancel')" @click="onCancel" /></div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
  import { watch, ref, computed, watchEffect, toRefs, defineEmits, onMounted } from "vue"
  import { QOptionGroupProps, useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  type QOptionGroupOptions = QOptionGroupProps["options"]
  const props = defineProps({
    parentValue: {
      type: Array<any>,
      required: true,
      default: () => ({})
    },

    groupOptions: {
      type: Object as () => QOptionGroupOptions,
      required: true,
      default: () => ({})
    }
  })
  const $q = useQuasar()

  const { parentValue, groupOptions } = toRefs(props)
  const groupValue = ref(parentValue.value)
  const popularValue = ref([])
  const popularOptions = ref<any>([])
  const selectAll = ref(false)
  const popularSelectAll = ref(false)
  const gameSearch = ref("")
  const popularSearch = ref("")

  const { t } = useI18n()

  onMounted(() => {
    toPopular()
  })
  const toggleSelectAll = (value: boolean) => {
    if (value) {
      groupValue.value = groupOptions.value?.map((e) => e.value) as Array<any>
    } else {
      groupValue.value = []
    }
  }
  const popularToggleSelectAll = (value: boolean) => {
    if (value) {
      popularValue.value = popularOptions.value?.map((e) => e.value)
    } else {
      popularValue.value = []
    }
  }

  const toPopular = () => {
    groupValue.value.forEach((value) => {
      const selectedItem = groupOptions.value?.find((item) => item.value === value)
      const index = groupOptions.value?.findIndex((item) => item.value === value)
      if (index !== -1) {
        groupOptions.value?.splice(index as number, 1)
      }
      popularOptions.value?.push(selectedItem)
      groupOptions.value?.sort(sortByValue)
    })
    groupValue.value = []
  }

  const toGameList = () => {
    popularValue.value.forEach((value) => {
      const selectedItem = popularOptions.value?.find((item: { value: number }) => item.value === value)
      const index = popularOptions.value?.findIndex((item: { value: number }) => item.value === value)
      if (index !== -1) {
        popularOptions.value?.splice(index as number, 1)
      }
      groupOptions.value?.push(selectedItem)
      groupOptions.value?.sort(sortByValue)
      groupValue.value = []
    })
    popularValue.value = []
  }

  function sortByValue(a: any, b: any) {
    return a.value - b.value
  }

  const emit = defineEmits(["update:onSave"])

  /*watch(parentValue, (newValue) => {
    groupValue.value = newValue
  })

  watch(groupValue, (newValue) => {
    emit("update:parentValue", newValue)
  })*/
  const onSave = () => {
    emit("update:onSave", groupValue.value)
  }
  const onCancel = () => {}

  /*watchEffect(() => {
    const hasAllOptions = groupOptions.value?.every((e) => groupValue.value.includes(e.value))
    if (hasAllOptions) {
      selectAll.value = true
      selectAllRadio.value = "true"
    } else {
      selectAll.value = false
      selectAllRadio.value = ""
    }
    if (groupValue.value.length === 0) {
      selectAllRadio.value = "false"
    }
  })*/
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 0.0625rem solid #3f3c4433;
      padding: 0.5rem 32px;
      border-radius: 62.4375rem;
      img {
        margin-right: 0.5rem;
      }
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        border-color: $mainColor;
        border-width: 0.125rem;
      }
    }
  }
  ::v-deep(.q-btn--fab-mini) {
    width: 10px;
    min-width: 10px;
  }

  .w-100 {
    width: 100%;
  }
  .card {
    width: 220px;
    height: 266px;
    border: 1px solid #c2c2ca !important;
    margin-top: 45px;
    font-size: 14px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .controll_bar {
    display: flex;
    flex-direction: column;
    align-self: center;
    .btn {
      width: 50px;
      height: 50px;
    }
  }
  ::v-deep(.q-field--outlined .q-field__control) {
    height: 36px;
  }
  ::v-deep(.q-field__marginal) {
    height: 36px !important;
  }
  .game_list {
    width: 100%;
    height: 165px;
    color: black;
  }
</style>
