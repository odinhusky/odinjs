import { useContext, useEffect } from "react"
import { ILoginFormValues } from "../types"
import LoginModeContext from "../LoginModeContext"

const useLoginForm = () => {
  const {
    service,
    validator,
    onConfirmFail,
    setLoginUIStatusType,
    animate,
    runAnimate,
  } = useContext(LoginModeContext)
  const onConfirm = (values: ILoginFormValues) => {
    service?.login?.(values).catch(() => { })
  }
  const onClickForget = () => {
    runAnimate("clickForget", () => setLoginUIStatusType?.("forget"))
  }
  useEffect(() => {
    runAnimate("showLogin")
  }, [])
  return {
    // LoginModeContext
    validator,
    onConfirm,
    onConfirmFail,
    onClickForget,
    animate,
  }
}
export default useLoginForm
