import { useEffect, useState } from "react";
import styled from "styled-components";
import { renderByUVersion } from "../../../../utils/renderByUVersion";
import cx from "../../../../utils/cx";


const StyledSendSMSCodeButton = styled.button`

`
{/*Enviar*/ }
{/*Esquerda 120s*/ }
{/*Reenviar*/ }
type ICountingButtonType = "ready" | "counting" | "finished";
type IProps = {
  onClick: (isCounting: boolean) => void;
  valid: boolean;
  className: string;
  disabledClassName?: string;
  successClassName?: string;
  count?: number;
}

export const SendSMSCodeButton = (props: IProps) => {
  const [state, setState] = useState<ICountingButtonType>("ready")
  const [secondState, setSecondState] = useState<number>(props.count || 60)
  let strState: string;

  useEffect(() => {
    let countingDownID: any;

    if (state === "counting") {
      if (countingDownID) {
        clearTimeout(countingDownID);
      }
      countingDownID = setTimeout(() => {
        if (secondState > 0) {
          setSecondState(secondState - 1)
        } else if (secondState === 0) {
          clearTimeout(countingDownID);
          setState("finished");
          setSecondState(120);
        }
      }, 1000)
    }
    return () => {
      if (state === "counting") {
        clearTimeout(countingDownID);
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

  const handleClick = (strState: string) => {
    props.onClick && props.onClick(state === "counting");
    if (!props.valid) return;
    if (!['Enviar', 'Reenviar'].includes(strState)) return;
    if (state === "ready") {
      setState("counting");
    } else if (state === "finished") {
      setState("counting");
    }
  }

  const disabledClassName = () => {
    return renderByUVersion({
      "u2": !['Enviar', 'Reenviar'].includes(strState) ? 'cursor-not-allowed opacity-[0.7]' : '',
    }, "")
  }

  const SendCodeBtn = () => {
    return <StyledSendSMSCodeButton
      className={cx(
        props.className,
        !['Enviar', 'Reenviar'].includes(strState) ? `${props.disabledClassName} cursor-not-allowed shadow-none` : `${props.successClassName}`
      )}
      onClick={() => handleClick(strState)}>
      {['Enviar', 'Reenviar'].includes(strState) ? strState : (<><span>{secondState + "s"}</span></>)}
    </StyledSendSMSCodeButton>
  }

  const DefaultSendBtn = () => {
    return <StyledSendSMSCodeButton
    className={cx(props.className, disabledClassName())}
    onClick={() => {
      props.onClick && props.onClick(state === "counting");
      if (!props.valid) return;
      if (state === "ready") {
        setState("counting");
      } else if (state === "finished") {
        setState("counting");
      }
    }}>{strState}</StyledSendSMSCodeButton>
  }


  return renderByUVersion({
    "u6": <SendCodeBtn />
  }, <DefaultSendBtn />)

}
