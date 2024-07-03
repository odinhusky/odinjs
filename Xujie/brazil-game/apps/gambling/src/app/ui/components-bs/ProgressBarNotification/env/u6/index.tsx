import { useEffect, useState } from "react";
import useAnimation from "../../../../hooks/useAnimation";
import cx from "../../../../utils/cx";
import { TProps } from "../..";
import {
  CheckCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

export const ProgressBarNotification = (props: TProps) => {
  const [progress, setProgress] = useState(0);
  const handleClose = () => {
    setIsCloseAnimation(true);
    setTimeout(() => {
      props.onClose?.();
    }, 300);
  };
  const animationClose = () => {
    setShow(false);
  };
  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(animationClose);
  const [show, setShow] = useState(false);
  const iconSize = props.isDesktop ? "36px" : "24px";
  const closeIconSize = props.isDesktop ? "20px" : "13.33px";
  const isSuccess = props.isSuccess === undefined ? true : props.isSuccess;

  useEffect(() => {
    setIsCloseAnimation(false);
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          handleClose()
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 1;
      });
    }, 10);

    return () => clearInterval(timer);
  }, [show]);

  useEffect(() => {
    setIsCloseAnimation(false);
    setShow(true);
    setProgress(0);
  }, [props.isOpen]);

  return (
    <div
      className={cx(
        "fixed flex gap-3 mobile:gap-4 text-sm mobile:text-base text-[var(--grayscale-100)] w-[calc(100%-16px)] tablet:w-[420px] mobile:w-[360px]",
        "p-4 mobile:px-5 mobile:py-4 bg-[var(--grayscale-15)] top-3 right-2 items-center justify-between z-[1010]",
        "rounded-lg tablet:rounded-xl border-2 border-solid shadow-[0px_4px_4px_0px_#00000040]",
        "animate__animated animate__faster",
        {
          animate__fadeOut: isCloseAnimation,
          "visible animate__fadeInRight": show,
          "hidden animate__fadeOut": !show,
          "border-[var(--state-success-main)]": isSuccess,
          "border-[var(--state-error-main)]": !isSuccess,
        }
      )}
    >
      {isSuccess ? (
        // 成功(勾)
        <CheckCircleFilled style={{ fontSize: iconSize, color: "#83D810" }} />
      ) : (
        // 失败(感叹号)
        <ExclamationCircleFilled
          style={{ fontSize: iconSize, color: "#FF686D" }}
        />
      )}
      <div className="w-full text-left">{props.message || "message"}</div>
      <CloseOutlined
        className="cursor-pointer"
        style={{ fontSize: closeIconSize }}
        onClick={() => handleClose()}
      />
    </div>
  );
};
