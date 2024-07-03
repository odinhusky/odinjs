import React from "react";
import cx from "classnames";

interface IUserInfoStatusPopoverContainerProps {
  children: React.ReactNode
}

export const UserInfoStatusPopoverContainer = ({
  children,
}: IUserInfoStatusPopoverContainerProps) => (
  <div
    className={cx(
      'fixed z-10 right-0 top-[68px] bottom-0 border-[2px] border-[#85F1F8] rounded-2xl bg-[#047A70] overflow-y-auto]',
      'w-[400px]'
    )}
    onClick={(e)=>{
      e.stopPropagation();
    }}
  >
    {children}
  </div>
)
