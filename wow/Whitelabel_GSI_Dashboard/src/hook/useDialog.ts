import { ref, reactive } from "vue"

export function useDialog(options?: {
  /** 開啟彈窗時預先執行的 function */
  handleOpenInitialFun?: () => void

  /** 彈窗標頭 i18n key */
  dialogLabelI18nKey?: string
}) {
  const dialog = ref(false)
  const openDialog = async <U>(data?: U) => {
    dialog.value = true
    if (options && options.handleOpenInitialFun) {
      await options.handleOpenInitialFun()
    }
  }
  const closeDialog = () => (dialog.value = false)

  const loading = ref(false)
  const openLoading = () => (loading.value = true)
  const closeLoading = () => (loading.value = false)

  return {
    dialog,
    openDialog,
    closeDialog,
    loading,
    openLoading,
    closeLoading
  }
}
