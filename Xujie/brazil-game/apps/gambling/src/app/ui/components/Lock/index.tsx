import useBreakpoint from "../../pageTemplate/hooks/useBreakpoint";
import React from "react";
import cx from "../../utils/cx";
import { CacheImage } from "../image/CacheImage";
import { IconTooltip } from "../Tooltips/IconTooltip";

type ILockIconProps = {
  tipId: string;
  className?: string;
};
export const LockIcon = (props: ILockIconProps) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const lockIconRes = `assets/shared/icon_lock${
    isMobile ? "_m" : isTablet ? "_t" : ""
  }.png`;
  const sizeClass = isMobile
    ? "w-[48px] h-[48px]"
    : isTablet
    ? "w-16 h-16"
    : "w-16 h-16";
  return (
    <IconTooltip
      id={`game-lock-tooltip-${props.tipId}`}
      className={cx("", props.className)}
      content="unlock when your level up"
      tooltipStyle={{
        padding: "4px",
        paddingLeft: "8px",
        paddingRight: "8px",
        width: isMobile ? "165px" : "190px",
        borderRadius: "999px",
        fontSize: isMobile ? "12px" : "14px",
        background: "#000000CC",
      }}
      icon={
        <CacheImage
          className={cx("self-center", sizeClass)}
          alt={"lock-icon"}
          src={lockIconRes}
          children={
            <img
              className={cx("self-center", sizeClass)}
              alt={"lock-icon"}
              src={lockIconRes}
            />
          }
        />
      }
    />
  );
};
