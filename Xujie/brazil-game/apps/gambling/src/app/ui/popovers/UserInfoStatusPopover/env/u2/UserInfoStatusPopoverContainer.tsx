import React, { useEffect, useState } from "react";
import cx from "../../../../utils/cx";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../reduxStore";

interface IUserInfoStatusPopoverContainerProps {
  children: React.ReactNode
  className: boolean
}

export const UserInfoStatusPopoverContainer = ({
  children,className
}: IUserInfoStatusPopoverContainerProps) => {

  // const [isCloseAnimation, setIsCloseAnimation] = useState(false);


  return (
    <div
    
      className={cx(
        'fixed z-10 right-0 top-[72px] bottom-0 w-[400px] border-t border-[var(--grayscale-50)] rounded-tl-2xl rounded-bl-2xl bg-[var(--grayscale-20)] overflow-y-auto',
        'animate__animated animate__faster animate__slideInRight', className
        //  isCloseAnimation ? 'animate__slideOutRight' : 'animate__slideInRight'
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  )
}
