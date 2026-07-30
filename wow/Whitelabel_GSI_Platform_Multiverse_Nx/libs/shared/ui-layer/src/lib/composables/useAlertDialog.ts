interface AlertDialogOption {
  label: string
  value: string
  metaLabel?: string
  amount?: string
}

interface OpenAlertDialogPayload {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  options?: AlertDialogOption[]
  selectedValue?: string
  onConfirm?: (selectedValue: string) => void | Promise<void>
}

interface AlertDialogState {
  visible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  options: AlertDialogOption[]
  selectedValue: string
}

let confirmHandler: ((selectedValue: string) => void | Promise<void>) | null = null

export const useAlertDialog = () => {
  const state = useState<AlertDialogState>("r017-alert-dialog-state", () => ({
    visible: false,
    title: "Alert",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    options: [],
    selectedValue: ""
  }))

  const openAlertDialog = (payload: OpenAlertDialogPayload) => {
    const options = payload.options || []
    const defaultValue = payload.selectedValue || options[0]?.value || ""

    state.value = {
      visible: true,
      title: payload.title || "Alert",
      message: payload.message,
      confirmText: payload.confirmText || "OK",
      cancelText: payload.cancelText || "Cancel",
      options,
      selectedValue: defaultValue
    }

    confirmHandler = payload.onConfirm || null
  }

  const closeAlertDialog = () => {
    state.value.visible = false
    confirmHandler = null
  }

  const setSelectedValue = (value: string) => {
    state.value.selectedValue = value
  }

  const confirmAlertDialog = async () => {
    const selected = state.value.selectedValue
    const handler = confirmHandler
    state.value.visible = false
    confirmHandler = null

    if (handler) {
      await handler(selected)
    }
  }

  return {
    state,
    openAlertDialog,
    closeAlertDialog,
    setSelectedValue,
    confirmAlertDialog
  }
}
