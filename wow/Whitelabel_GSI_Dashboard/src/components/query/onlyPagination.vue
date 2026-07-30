<template>
  <div>
    <slot name="mainContent"></slot>

    <Pagination v-if="configs.usePagination" v-bind="pagination" />
  </div>
</template>

<script lang="ts">
  import { type IQueryConfig, type IQueryParams } from "@/components/query/types/common"
  export { IQueryConfig }
</script>

<script lang="ts" setup>
  import Pagination, {
    IPaginationResults,
    IPaginationSettings,
    allowPerPageList
  } from "@/components/query/pagination.vue"
  import { equals } from "ramda"
  import { PropType, defineProps, nextTick, onMounted, onUnmounted, reactive, ref, watchEffect, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"

  const route = useRoute()
  const router = useRouter()

  const props = defineProps({
    configs: {
      type: Object as PropType<IQueryConfig>,
      required: true,
      default: () => {
        return {}
      }
    },
    /** 總筆數 */
    total: {
      type: [Number],
      required: false,
      default: 0
    }
  })

  const emit = defineEmits(["queryUpdate", "queryExport"])

  const queryForm = reactive<Partial<IQueryParams>>({})

  // 分頁資料
  const pagination = reactive<IPaginationSettings>({
    page: 1,
    perPage: 20,
    offset: 0,
    total: 0,
    onPagination
  })

  watchEffect(() => {
    pagination.total = props.total
  })

  let cacheQuery = {}

  async function handleSubmit() {
    // 過濾掉 undefined、空字串、null，或是空陣列 的參數
    const filterQueryForm = Object.entries(queryForm).reduce((filteredQuery, [key, value]) => {
      // 如果 value 不是 undefined、空字符串、null、空数组或数组长度为 0，则保留该参数
      if (value !== undefined && value !== "" && value !== null && !(Array.isArray(value) && value.length === 0)) {
        filteredQuery[key] = value
      }
      return filteredQuery
    }, {})

    // 若 allowSameSubmit 為 false 時，比較 cacheQuery 與 filterQueryForm，相同則不送出
    if (!props.configs.allowSameSubmit && equals(cacheQuery, filterQueryForm)) {
      return
    }

    cacheQuery = filterQueryForm
    const _pagination = props.configs.usePagination
      ? {
          offset: pagination.offset,
          size: pagination.perPage
        }
      : undefined

    const location = {
      query: Object.assign({}, null, {
        ...cacheQuery,
        ..._pagination
      })
    }

    router.replace(location).then(async () => {
      emit("queryUpdate", {
        ...cacheQuery,
        ..._pagination
      })
    })
  }

  // 變更頁碼
  async function onPagination(result: IPaginationResults) {
    pagination.page = result.page
    pagination.perPage = result.perPage

    const location = {
      query: Object.assign({}, null, {
        ...cacheQuery,
        offset: (pagination.page - 1) * pagination.perPage,
        size: pagination.perPage
      })
    }

    router.replace(location).then(async () => {
      emit("queryUpdate", {
        ...cacheQuery,
        offset: (pagination.page - 1) * pagination.perPage,
        size: pagination.perPage
      })
    })
  }

  // 初始化元件
  onMounted(async () => {
    for (const key in route.query) {
      if (Object.prototype.hasOwnProperty.call(route.query, key)) {
        const value = route.query[key] as (typeof queryForm)[typeof key]
        queryForm[key] = value

        if (key === "multiDateType") {
          if (typeof value === "string") {
            queryForm.multiDateType = [parseInt(value)]
          }
          if (Array.isArray(value)) {
            queryForm.multiDateType = value.map((e) => parseInt(e as any as string))
          }
        }
      }
    }
    if (props.configs.usePagination && (route.query.offset || route.query.offset === "0") && !!route.query.size) {
      const { offset, size } = route.query

      if (typeof offset === "string" && typeof size === "string") {
        pagination.page = Math.floor(parseInt(offset) / parseInt(size)) + 1
        pagination.offset = parseInt(offset)
        pagination.perPage = parseInt(size)
      }

      pagination.perPage =
        typeof size === "string" && allowPerPageList.includes(parseInt(size)) ? parseInt(size) : allowPerPageList[0]
    }

    if (props.configs.submitOnLoaded) {
      nextTick(() => {
        handleSubmit()
      })
    }
  })
</script>

<style lang="scss" scoped>
  ::v-deep(.q-field__control),
  ::v-deep(.q-field__marginal) {
    height: unset !important;
  }
  ::v-deep(.q-field__control-container) {
    white-space: nowrap;
    overflow: hidden;
  }
  .absolute-right {
    bottom: auto;
  }
</style>
