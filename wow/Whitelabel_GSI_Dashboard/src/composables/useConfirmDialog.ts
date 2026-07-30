import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"

type ConfirmDialogOptions = {
  title?: string
  message: string
  cancel?: boolean
  persistent?: boolean
}
type ConfirmActionKey = "close" | "delete" | "disable"

export function useConfirmDialog() {
  const $q = useQuasar()
  const { t } = useI18n()

  const confirm = (options: ConfirmDialogOptions) => {
    const { title, message, cancel = true, persistent = true } = options

    return new Promise<boolean>((resolve) => {
      $q.dialog({
        title: title || t("btn.tip"),
        message,
        cancel: cancel ? { label: t("btn.cancel"), color: "primary", outline: true } : false,
        ok: { label: t("btn.confirm"), color: "primary", unelevated: true },
        persistent
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false))
    })
  }

  const confirmAction = (action: ConfirmActionKey, options?: Omit<ConfirmDialogOptions, "message">) => {
    return confirm({
      ...options,
      message: t("common.sure_to_action", {
        action: t(`common.action.${action}`)
      })
    })
  }

  return { confirm, confirmAction }
}
