import cx from "classnames";
import styled from "styled-components";
import { IActivityRedeemableModal } from "../../index";
import { environment } from "../../../../../../environments/environment";

const Container = styled.div`
  background-size: 100% 100%;
`;
export const ActivityRedeemableModal = (props: IActivityRedeemableModal) => {
  const { redeemableAmount, title, submitText, onClick, onCloseClick } = props;
  return (
    <div
      className={
        "z-[1002] fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-[rgba(0,0,0,0.65)]"
      }
      onClick={onCloseClick}
    >
      <div className={"relative flex flex-col justify-center items-center gap-5"} onClick={(e)=>{e.stopPropagation()}}>
        {/* <button
          className="linear-5-button absolute w-7 tablet:w-10 mobile:w-9 h-7 tablet:h-10 mobile:h-9 
          top-2 right-2 mobile:top-3 mobile:right-3 rounded-full"
          onClick={onCloseClick}
        >
          <img
            className="w-1/2"
            src={`assets/${environment.uVersion}/ic_close_noBorder.png`}
            alt="close"
          />
        </button> */}
        <Container
          className={cx(
            "bg-popup1 border-popup-button before:rounded-lg rounded-lg",
            "flex flex-col gap-8 items-center",
            "text-lg p-8 font-bold text-[var(--grayscale-100)]",
            "shadow-[0px_4px_4px_0px_#00000040]",
            "w-[90vw] max-w-[296px] h-auto"
          )}
        >
          <div className="flex flex-col gap-5 text-center">
            <p>{title}</p>
            <p>{redeemableAmount}</p>
          </div>
          <button
            className={cx("linear-4-button border-popup-button text-sm w-full h-9 rounded-full font-bold")}
            onClick={onClick}
          >
            <div className={""}>{submitText}</div>
          </button>
        </Container>
        <button
          className="w-10 h-10"
          onClick={onCloseClick}
        >
          <img
            className="w-full"
            src={`assets/${environment.uVersion}/ic_closed.png`}
            alt="close"
          />
        </button>
      </div>
    </div>
  );
};
