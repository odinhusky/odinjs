import cx from "classnames"
import styled from "styled-components"
import { IActivityRedeemableModal } from "../../index"
import { environment } from "../../../../../../environments/environment"

const Container = styled.div`
  background-size: 100% 100%;
`
export const ActivityRedeemableModal = (props: IActivityRedeemableModal) => {
  const { redeemableAmount, title, submitText, onClick, onCloseClick } = props
  return (
    <div
      className={
        "z-[1002] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"
      }
      onClick={() => {}}
    >
      <div className={"relative"}>
        <button
          className="linear-5-button absolute w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 
          top-2 right-2 mobile:top-3 mobile:right-3 rounded-full"
          onClick={onCloseClick}
        >
          <img
            className="w-1/2"
            src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
            alt="close"
          />
        </button>
        <Container
          className={cx(
            "bg-linear-6-main",
            "flex flex-col items-center",
            "py-8 px-10",
            "text-center rounded-xl font-medium",
            "w-[90vw] max-w-[336px] h-auto"
          )}
        >
          <div className="text-base text-[var(--transparente-70)]">{title}</div>
          <div className="text-2xl text-[var(--grayscale-100)]">{redeemableAmount}</div>
          <button
              className={cx(
                "linear-1-button",
                "mt-5 px-24 py-4 text-base",
              )}
              onClick={onClick}
            >
              <div className={"drop-shadow-lg"}>{submitText}</div>
            </button>
        </Container>
      </div>
    </div>
  )
}
