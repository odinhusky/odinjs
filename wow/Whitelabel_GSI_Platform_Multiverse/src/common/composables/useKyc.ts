import { useQuasar, QTableProps } from "quasar"
import { userKycRecord } from "src/api/userInfo"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useApi } from "src/common/hooks/useApi"
import { MAIL_STATUS, MAIL_TYPE } from "src/common/utils/constants"
import { reactive, computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useEnv } from "src/common/hooks/useEnv"

interface KycState {
  list: Response.KycRecordItem[]
}

export function useKyc() {
  const $q = useQuasar()
  const router = useRouter()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL, VITE_APP_BASE_API } = envData()

  const columns = computed<QTableProps["columns"]>(() => [
    { name: "number", align: "center", label: t("tableHeader.orderNumber"), field: "number" },
    { name: "status", align: "center", label: t("tableHeader.reviewResults"), field: "status" },
    { name: "comment", align: "center", label: t("tableHeader.remark"), field: "comment" }
  ])

  const isLoading = ref(false)
  const kycState: KycState = reactive({
    list: []
  })

  async function getUserKycRecord() {
    isLoading.value = true
    const { status, data } = await useApi(userKycRecord)
    isLoading.value = false
    if (status) {
      if (!data.list) {
        kycState.list = []
        return
      }

      kycState.list = [...data.list]
      // 假資料
      // kycState.list = [
      //   {
      //     number: "12",
      //     status: "Pending",
      //     comment: "Pending"
      //   },
      //   {
      //     number: "13",
      //     status: "Pending",
      //     comment: "test12"
      //   },
      //   {
      //     number: "14",
      //     status: "Pending",
      //     comment: "test"
      //   }
      // ]
    }
  }

  return {
    isLoading,
    kycState,
    columns,
    getUserKycRecord
  }
}
