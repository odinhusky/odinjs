import React from "react";

export const UserInfoStatusPopoverContainer = ({ children, onMouseLeave }: { children: React.ReactNode; onMouseLeave: () => void;}) => (

<div
    className={`
      fixed right-[0] top-[66px] z-10 w-[396px] flex flex-col flex-between gap-2 rounded-2xl px-4 py-6 text-sm
      border-[2px] border-[var(--primary-assistant)]
      max-h-[calc(100vh-66px)] overflow-auto
      bg-gradient-to-r from-[var(--primary-variant-from)] to-[var(--primary-variant-to)]
    `}
     onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
)
