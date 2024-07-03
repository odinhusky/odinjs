import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import "./index.scss";
import { Progress } from "antd";
import { useEffect, useState } from "react";
import cx from "../../../../utils/cx";
import useAnimation from "../../../../hooks/useAnimation";

type TProps = {
  message?: string;
  onClose?: () => void;
  isOpen: boolean;
  duration?: number;
  isDesktop?: boolean;
}

export const ProgressBarNotification = (props: TProps) => {
  const [progress, setProgress] = useState(0);
  const handleClose = () => {
    setIsCloseAnimation(true);
    setTimeout(() => {
      props.onClose?.();
    }, 300);
  }
  const animationClose = () => {
    setShow(false)
  }
  const [isCloseAnimation, setIsCloseAnimation] = useAnimation(animationClose);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsCloseAnimation(false)
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
    <div className={cx(
      "notify-bar flex flex-col items-center",
      "tablet:top-8 tablet:right-10 tablet:items-end",
      "animate__animated animate__faster",
      isCloseAnimation ? 'animate__fadeOut' : '',
      show ? `visible ${props.isDesktop ? 'animate__fadeInRight' : 'animate__fadeInDown'}` : 'hidden animate__fadeOut'
    )}>
      <div className={cx("notify-bar-inner tablet:mr-10")}>
        <div className="notify">
          <div className="flex items-center">
            <CheckCircleOutlined className="icon-status text-lg" />
            <div className="message">{props.message || "message"}</div>
          </div>
          <CloseOutlined className="cursor-pointer" onClick={() => handleClose()} />
        </div>
        <div className="progress-bar">
          <Progress className="bar" percent={progress} strokeColor="#D1FAE5" trailColor="#10B965" showInfo={false} />
        </div>
      </div>
    </div>
  )
}