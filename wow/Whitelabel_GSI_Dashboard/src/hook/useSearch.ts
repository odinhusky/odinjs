import { getCurrentInstance, ref } from "vue"
import { ERROR_CODE } from "@/utils/constants"
import { Notify } from "quasar"
import { useRouterStore } from "src/stores/routerStore"
import { useQueryStore } from "@/stores/queryStore"
import { useI18n } from "vue-i18n"

function hasListField(data: unknown): data is { list: unknown } {
  return typeof data === "object" && data !== null && Object.prototype.hasOwnProperty.call(data, "list")
}

function getSearchData(data: unknown): unknown[] | unknown {
  if (hasListField(data)) {
    return Array.isArray(data.list) ? data.list : []
  }

  return data || []
}

export function useSearch(searchFunction?: any) {
  // const router = useRouter()
  // 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
  // 因此可以解決this.$Message 諸如此類問題
  // const { proxy }: any = getCurrentInstance()
  const spinShow = ref(false)
  const tableData: any = ref([])
  const tableTotal: any = ref({})
  const tableSubTotal: any = ref({})
  const totalSize = ref(0)
  const pageSize = ref(0)
  const clearListData = () => (tableData.value = [])
  const isSuccess = ref<boolean>()
  const message = ref("")
  const status = ref(false)
  const resCode = ref(0)
  const { go } = useRouterStore()
  const store = useQueryStore()
  // const params = ref(condition)
  const search = async (params: any = {}, options: { skipNotifyCodes?: number[] } = {}) => {
    if (!searchFunction) {
      console.warn("search function not available")
      return
    }
    spinShow.value = true
    store.toggleSpinner()
    try {
      const response = await searchFunction(params)
      isSuccess.value = response.status
      if (isSuccess.value) {
        tableData.value = getSearchData(response.data)
      } else {
        // 失敗回應（例如 403）時，避免將錯誤物件餵給 q-table 的 rows。
        tableData.value = Array.isArray(response.data?.list)
          ? response.data.list
          : Array.isArray(response.data)
            ? response.data
            : []
      }
      totalSize.value = response.data?.pagination?.total ?? response.data?.total ?? undefined
      pageSize.value = response.data?.pagination?.size ?? response.data?.size ?? undefined
      spinShow.value = false
      tableTotal.value = response.data?.summary?.total || undefined
      tableSubTotal.value = response.data?.summary?.page || undefined
      message.value = response.msg
      status.value = response.code === ERROR_CODE.Enums.SUCCESS
      resCode.value = response.code

      if (!isSuccess.value) {
        const { skipNotifyCodes = [] } = options
        if (skipNotifyCodes.includes(response.code)) {
          return
        }

        switch (response.code) {
          case ERROR_CODE.Enums.CORE_PERMISSION_IS_NOT_ALLOW:
            Notify.create({
              type: "negative",
              position: "top",
              message: $t(ERROR_CODE.I18nKeys[response.code as ERROR_CODE.Enums] as string),
              icon: "warning",
              timeout: 1000
            })
            go("Dashboard")
            break
          case ERROR_CODE.Enums.WHITELIST_FOUND:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_PARSE_FAILED:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_EXPIRED:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_USER_NOT_FOUND:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_INVALID_TOKEN:
          case ERROR_CODE.Enums.CORE_JWT_TOKEN_UNAUTHORIZED_IP:
          case ERROR_CODE.Enums.A_USER_IS_DISABLE:
          case ERROR_CODE.Enums.A_USER_IS_BAN:
          case ERROR_CODE.Enums.CORE_INVALID_AUTHORIZATION:
          case ERROR_CODE.Enums.CORE_AGENT_ID_NO_MATCH:
          case ERROR_CODE.Enums.INVALID_TOKEN:
            tableData.value = []
            Notify.create({
              type: "negative",
              position: "top",
              message: $t(ERROR_CODE.I18nKeys[response.code as ERROR_CODE.Enums] as string),
              icon: "warning",
              timeout: 1000
            })
            sessionStorage.removeItem("publicToken")
            sessionStorage.removeItem("tabData")
            sessionStorage.removeItem("userData")
            go("Login")
            break
          default: {
            const key = ERROR_CODE.I18nKeys[response.code as ERROR_CODE.Enums] as string
            if (
              resCode.value === ERROR_CODE.Enums.A_INSUFFICIENT_BALANCE ||
              resCode.value === ERROR_CODE.Enums.PROCESSING
            ) {
              return
            }

            Notify.create({
              type: "negative",
              position: "top",
              message: key ? $t(key) : `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
              icon: "warning",
              timeout: 1000
            })
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      spinShow.value = false
      store.toggleSpinner()
    }
  }

  // 提供不打search 時  仍然能改變 list loading 狀態的窗口
  const changeLoading = (status: boolean) => {
    spinShow.value = status
  }

  return {
    spinShow,
    isSuccess,
    totalSize,
    tableData,
    clearListData,
    changeLoading,
    search,
    tableTotal,
    tableSubTotal,
    message,
    status,
    resCode
  }
}
