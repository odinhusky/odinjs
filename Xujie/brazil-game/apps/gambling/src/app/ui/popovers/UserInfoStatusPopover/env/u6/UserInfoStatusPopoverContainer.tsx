import React from "react"

interface IUserInfoStatusPopoverContainerProps {
  children: React.ReactNode
}

export const UserInfoStatusPopoverContainer = ({
  children,
}: IUserInfoStatusPopoverContainerProps) => (
  <div
    className="fixed z-10 right-[100px] top-[56px] bottom-4 w-[480px] rounded-xl bg-[var(--grayscale-25)] overflow-y-auto shadow-[0px_0px_30px__rgba(0,_0,_0,_0.3)]"
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    {children}
  </div>
)
