import type { QBtnProps } from "quasar"
import { useQuasar } from "quasar"
import ConfirmDialog from "src/common/components/dialog/ConfirmDialog.vue"
import { useI18n } from "vue-i18n"

export type ConfirmDialogOpenOptions = {
  title: string
  message: string
  persistent?: boolean
  backdropScrim?: string
  /** 加在 q-dialog 根節點，供模板覆寫樣式 */
  dialogClass?: string
  okBtn?: QBtnProps
  cancelBtn?: QBtnProps
}

export function useConfirmDialog() {
  const $q = useQuasar()
  const { t } = useI18n()

  function openConfirmDialog(options: ConfirmDialogOpenOptions) {
    const { title, message, persistent = true, backdropScrim, dialogClass, okBtn, cancelBtn } = options

    return $q.dialog({
      component: ConfirmDialog,
      componentProps: {
        title,
        message,
        persistent,
        ...(backdropScrim !== undefined ? { backdropScrim } : {}),
        ...(dialogClass !== undefined ? { dialogClass } : {}),
        okBtn: {
          label: t("common.btn.confirm"),
          ...okBtn,
        },
        cancelBtn: {
          label: t("common.btn.cancel"),
          ...cancelBtn,
        },
      },
    })
  }

  return { openConfirmDialog }
}
