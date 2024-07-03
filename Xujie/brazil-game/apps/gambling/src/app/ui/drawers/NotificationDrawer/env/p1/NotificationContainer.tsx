import cx from "classnames";
import React from "react";

type INotificationContainer = {
  children: React.ReactNode;
}

export const NotificationContainer = (props: INotificationContainer) => {
  return (
    <div
      className={cx(
        'flex-between fixed right-0 top-0 bottom-0 flex w-[450px] flex-col bg-[var(--drawer-bg)] p-4 text-left',
        {}
      )}
      onClick={(e)=>e.stopPropagation()}
    >{props.children}
    </div>
  )
}
