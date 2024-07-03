import React from "react"
import cx from "../../../../utils/cx";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import useShowShortcut from "../../../AddToMobileShortcut/hooks/useShowShortcut";

interface IUserInfoStatusPopoverContainerProps {
  children: React.ReactNode
}

export const U7UserInfoStatusPopoverContainer = ({
  children,
}: IUserInfoStatusPopoverContainerProps) => {
  const { isDesktop, isTablet } = useBreakpoint();
  const isShowShortcut = useShowShortcut();
  return (
    <div
      className={cx(
        'fixed z-[1002] right-[0px] top-[64px]',
        {
          'top-[136px]':isShowShortcut && !isDesktop
        },
        {
          'bottom-[100px]': isDesktop,
          'bottom-[0px]': isTablet,
        },
        'w-full max-w-[412px]',
        'rounded-xl',
        'bg-linear-4-main',
        'overflow-y-auto',
        'shadow-[0px_0px_30px__rgba(0,_0,_0,_0.3)]'
      )}
    >
      {children}
    </div>
  )
};

export default U7UserInfoStatusPopoverContainer;
