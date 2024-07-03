import { createContext } from "react"
import { IAnimateRecord, IConfirmFail, ILoginModeProps, IRunAnimateFn, IStatusType } from "./types"

export interface LoginModeContextProps extends Partial<Pick<ILoginModeProps, "service" | "validator">> {
  setLoginUIStatusType?: (v: IStatusType) => void
  onConfirmFail?: IConfirmFail
  runAnimate: IRunAnimateFn
  duration?: number
  animate: IAnimateRecord
}

export default createContext<LoginModeContextProps>({
  runAnimate: () => { },
  animate: {},
})
