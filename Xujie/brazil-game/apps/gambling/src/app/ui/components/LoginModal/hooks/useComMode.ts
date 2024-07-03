import { notification } from "antd"
import { useState } from "react"
import { IAnimateName, ILoginModeProps } from "../types"
import { useBatchSetAnimate } from "../../../hooks/useAnimation"



const duration = 200
const useComMode = ({
  defaultStatusType,
  animates = {},
  ...props
}: Omit<ILoginModeProps, "className" | "onClose"> & {
  animates?: Partial<Record<IAnimateName, string>>
}) => {
  const [loginUIStatusType, setLoginUIStatusType] = useState(
    defaultStatusType || "login"
  )

  const [api, contextHolder] = notification.useNotification()
  const onConfirmFail = (errors: Error[]) => {
    // 增加提交後驗證失效彈窗
    api.error({
      message: errors[0]?.message,
    })
  }
  const { animate, runAnimate } = useBatchSetAnimate(
    animates,
    duration
  )

  return {
    loginUIStatusType,
    setLoginUIStatusType,
    contextHolder,
    contextValue: {
      ...props,
      setLoginUIStatusType,
      onConfirmFail,
      duration,
      animate,
      runAnimate,
    },
  }
}
export default useComMode
