import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { TABLE_SORT_TYPE } from "src/utils/constants"

export function useTableSort() {
  const router = useRouter()
  const route = useRoute()

  const orderType = ref("")
  const sortType = ref<TABLE_SORT_TYPE.Enums>(TABLE_SORT_TYPE.Enums.ASC)

  const handleSort = (field: string, querySort = true) => {
    if (orderType.value === field) {
      sortType.value = sortType.value ? TABLE_SORT_TYPE.Enums.ASC : TABLE_SORT_TYPE.Enums.DESC
    } else {
      orderType.value = field
      sortType.value = TABLE_SORT_TYPE.Enums.ASC
    }

    if (querySort) {
      const order_type = orderType.value
      const sort_type = sortType.value
      router.replace({
        query: {
          ...route.query,
          order_type,
          sort_type
        }
      })
    }
  }

  const resetSort = () => {
    handleSort("")
  }

  onMounted(() => {
    if (route.query.order_type) {
      orderType.value = route.query.order_type as string
    }

    if (route.query.sort_type) {
      sortType.value = parseInt(route.query.sort_type as string)
      return
    }
  })

  return {
    /** 排序欄位 */
    orderType,

    /** 排序方式 */
    sortType,

    /** 設定排序 */
    handleSort,

    /** 重設排序 */
    resetSort
  }
}
