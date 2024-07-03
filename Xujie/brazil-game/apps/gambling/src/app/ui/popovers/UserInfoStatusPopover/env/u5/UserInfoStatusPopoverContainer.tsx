import React from "react"

interface IUserInfoStatusPopoverContainerProps {
  children: React.ReactNode
}

export const UserInfoStatusPopoverContainer = ({
  children,
}: IUserInfoStatusPopoverContainerProps) => (
  <div
    className="fixed z-10 right-0 top-[72px] bottom-0 w-[480px] bg-[var(--grayscale-25)] overflow-y-auto shadow-[-8px_0px_8px__rgba(0,_0,_0,_0.5)]"
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    {children}
  </div>
)
