import React from "react";


export const DesktopNotificationContainer = ({
  children,
  closeDrawer
}: { children: React.ReactNode; closeDrawer: () => void }) => {
  return (
    <div
        style={{
          scrollbarColor: 'var(--grayscale-60)  var(--grayscale-30)',
          scrollbarWidth:'thin'
        }}
      className='flex justify-end text-white p-8 z-[1005] fixed right-0 top-0 bottom-0 left-0 w-full h-full'
      onClick={()=> closeDrawer()}
    >
      <div
        className='h-full w-[480px]'
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  )
}