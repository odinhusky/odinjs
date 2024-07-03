import { useContext, useEffect, useRef } from "react"
import { useSendForgetPasswordSMSCodeMutation } from "../../../../external"
import { environment } from "../../../../../environments/environment"
import { AppLocalStorage } from "../../../../persistant/localstorage"
import { AppLocalStorageKey } from "../../../../persistant/AppLocalStorageKey"
import { IFormRef } from "../../../components/Form/Form"
import { IForgetPwdFormValues } from "../types"
import LoginModeContext from "../LoginModeContext"

const useForgetPwdForm = () => {
  const ref = useRef<IFormRef>(null)

  const [triggerSendForgetPasswordSMSCode] =
    useSendForgetPasswordSMSCodeMutation()

  const onClickSendSMSCode = () => {
    if (ref.current?.validateFormValue("phone")) return false
    triggerSendForgetPasswordSMSCode({
      appPackageName: environment.appPackageName,
      deviceId: AppLocalStorage.getItem(AppLocalStorageKey.deviceId) || "",
      phone: ref.current?.getFormValue("phone") || "",
      verifyType: 1,
    })
    return true
  }
  const {
    service,
    validator,
    onConfirmFail,
    setLoginUIStatusType,
    animate,
    runAnimate,
  } = useContext(LoginModeContext)
  const onConfirm = (values: IForgetPwdFormValues) => {
    service?.forgetPassword?.(values).catch(() => { })
  }
  const onClickLogin = () => {
    setLoginUIStatusType?.("login")
  }
  useEffect(() => {
    runAnimate("showForget")
  }, [])
  return {
    ref,
    onClickSendSMSCode,
    onClickLogin,
    // LoginModeContext
    validator,
    onConfirm,
    onConfirmFail,
    animate,
  }
}
export default useForgetPwdForm
