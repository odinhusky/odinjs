import {  useEffect, useState } from "react"
import { IButtonRender } from "../types"

type ICountingButtonType = "ready" | "counting" | "finished"
type IProps = {
  onClick: () => boolean
  render?: IButtonRender
}

const SMSCodeButton = ({
  onClick,
  render = (p) => <button {...p}/>
}: IProps) => {
  const [state, setState] = useState<ICountingButtonType>("ready")
  const [secondState, setSecondState] = useState<number>(60)
  let strState: string

  useEffect(() => {
    let countingDownID: any

    if (state === "counting") {
      if (countingDownID) {
        clearTimeout(countingDownID)
      }
      countingDownID = setTimeout(() => {
        if (secondState > 0) {
          setSecondState(secondState - 1)
        } else if (secondState === 0) {
          clearTimeout(countingDownID)
          setState("finished")
          setSecondState(120)
        }
      }, 1000)
    }
    return () => {
      if (state === "counting") {
        clearTimeout(countingDownID)
      }
    }
  }, [state, secondState])

  if (state === "ready") {
    strState = "Enviar"
  } else if (state === "counting") {
    // strState = "Esquerda " + secondState
    strState = secondState + "s"
  } else {
    strState = "Reenviar"
  }
  return render({
    type: "button",
    disabled: !["Enviar", "Reenviar"].includes(strState),
    className: "mode-sms-code-button",
    onClick: () => {
      if (state === "counting") return
      if (onClick?.() === false) return
      if (state === "ready") {
        setState("counting")
      } else if (state === "finished") {
        setState("counting")
      }
    },
    children:strState
  } )
}
export default SMSCodeButton
