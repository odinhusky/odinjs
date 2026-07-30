import { useQuasar } from "quasar"
import { useEnv } from "src/hook/useEnv"
import { ERROR_CODE } from "@/utils/constants"
import { getExportExcel, getAgentExportExcel } from "@/api/common"
import { useSearch } from "@/hook/useSearch"

export function useExport() {
  const $q = useQuasar()
  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_BASE_API } = envData()

  async function getExportPath(uuid: string, isPlatform = false) {
    const sendData = {
      uuid: uuid
    }
    let apiFn = isAgentMode ? getExportExcel : getAgentExportExcel

    //代理之後的匯出要走新版
    if (isPlatform) {
      apiFn = getAgentExportExcel
    }
    const { search, status, tableData, resCode } = useSearch(apiFn)
    await search(sendData)
    if (status.value) {
      const fileUrl =
        tableData.value.path.startsWith("http://") || tableData.value.path.startsWith("https://")
          ? tableData.value.path
          : `${VITE_APP_BASE_API}/${tableData.value.path}`
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.style.display = "none"
      link.href = url
      // 從 URL 中提取檔案名稱
      const fileName = fileUrl.split("/").pop() || "download"
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } else if (!status.value && resCode.value === ERROR_CODE.Enums.PROCESSING) {
      setTimeout(() => {
        getExportPath(uuid)
      }, 3000)
    }
  }

  return { getExportPath }
}
