import cx from "classnames";
import React from "react";

type INotificationContainer = {
  children: React.ReactNode;
  className?: string;
}

export const NotificationContainer = (props: INotificationContainer) => {
  return (
    <div
      className={cx(
        'flex-between fixed right-0 top-[72px] bottom-0 flex w-[450px] flex-col bg-[var(--grayscale-20)] py-3 px-5 text-left',
        'animate__animated animate__faster animate__slideInRight', props.className
      )}
    >{props.children}
    </div>
  )
}
